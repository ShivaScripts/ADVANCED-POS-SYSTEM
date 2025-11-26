package com.shivam.service.impl;

import com.shivam.domain.OrderStatus;
import com.shivam.domain.PaymentType;
import com.shivam.exception.UserException;
import com.shivam.mapper.OrderMapper;
import com.shivam.modal.*;
import com.shivam.payload.dto.CustomerDTO;
import com.shivam.payload.dto.DashboardAnalyticsDTO;
import com.shivam.payload.dto.OrderDTO;
import com.shivam.repository.*;
import com.shivam.service.InventoryService;
import com.shivam.service.OrderService;
import com.shivam.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.HashMap; // <-- ADDED
import java.util.List;
import java.util.Map;     // <-- ADDED
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
// Excel imports
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
@RequiredArgsConstructor // This Lombok annotation will handle constructor injection
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final UserService userService;
    private final InventoryService inventoryService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    // This is the Spring helper for sending WebSocket messages
    private final SimpMessagingTemplate messagingTemplate;

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);


    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO dto) throws UserException {
        User cashier = userService.getCurrentUser();
        Branch branch = cashier.getBranch();
        if (branch == null) throw new UserException("Cashier is not associated with a branch.");
        Long branchId = branch.getId();

        Customer customerEntity = null;
        CustomerDTO customerDto = dto.getCustomer();

        if (customerDto != null && customerDto.getId() != null) {
            customerEntity = customerRepository.findById(customerDto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + customerDto.getId()));
            log.info("Found customer entity with ID: {}", customerEntity.getId());
        } else {
            log.info("No customer ID provided in OrderDTO, treating as walk-in customer.");
        }

        Order order = Order.builder()
                .branch(branch)
                .cashier(cashier)
                .customer(customerEntity)
                .paymentType(dto.getPaymentType())
                .build();

        // Set financial details
        order.setSubtotal(dto.getSubtotal());
        order.setDiscount(dto.getDiscount());
        order.setTax(dto.getTax());
        order.setTotalAmount(dto.getTotalAmount());
        order.setRazorpayPaymentId(dto.getRazorpayPaymentId());

        // Loyalty Logic
        Integer pointsToRedeem = dto.getPointsRedeemed() != null ? dto.getPointsRedeemed() : 0;
        Integer pointsEarned = 0;
        if (customerEntity != null) {
            Integer currentPoints = customerEntity.getLoyaltyPoints() != null ? customerEntity.getLoyaltyPoints() : 0;
            if (pointsToRedeem > 0) {
                if (currentPoints < pointsToRedeem) {
                    throw new UserException("Customer does not have enough loyalty points to redeem.");
                }
                customerEntity.setLoyaltyPoints(currentPoints - pointsToRedeem);
                order.setPointsRedeemed(pointsToRedeem);
                log.info("Redeemed {} points for customer {}", pointsToRedeem, customerEntity.getId());
                currentPoints -= pointsToRedeem;
            }
            if (order.getTotalAmount() > 0) {
                pointsEarned = (int) (order.getTotalAmount() / 100) * 5;
                if (pointsEarned > 0) {
                    customerEntity.setLoyaltyPoints(currentPoints + pointsEarned);
                    order.setPointsEarned(pointsEarned);
                    log.info("Earned {} points for customer {}", pointsEarned, customerEntity.getId());
                }
            }
            customerRepository.save(customerEntity);
        }
        // --- END LOYALTY LOGIC ---


        // Process OrderItems (handles both regular products and custom items)
        List<OrderItem> orderItems = dto.getItems().stream().map(itemDto -> {
            // itemDto is expected to be OrderItemDTO (either with productId for regular products
            // or without productId for custom items)
            if (itemDto.getProductId() != null) {
                // REGULAR product path
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + itemDto.getProductId()));

                // Attempt to update inventory immediately (inside mapping)
                try {
                    inventoryService.updateStock(product.getId(), branchId, -itemDto.getQuantity());
                } catch (Exception e) {
                    log.error("Failed to update stock for product ID {}: {}", product.getId(), e.getMessage(), e);
                    // Depending on business rules, you could rethrow to rollback the transaction:
                    // throw new RuntimeException("Stock update failed for product: " + product.getName(), e);
                }

                return OrderItem.builder()
                        .product(product)
                        .productName(product.getName()) // Snapshot of name
                        .price(product.getSellingPrice()) // Snapshot of price
                        .quantity(itemDto.getQuantity())
                        .order(order)
                        .build();
            } else {
                // CUSTOM item path (no product reference)
                return OrderItem.builder()
                        .product(null)
                        .productName(itemDto.getProductName())
                        .price(itemDto.getPrice())
                        .quantity(itemDto.getQuantity())
                        .order(order)
                        .build();
            }
        }).collect(Collectors.toList());
        order.setItems(orderItems);

        // 1. Save Order (cascades to save OrderItems)
        Order savedOrder = orderRepository.save(order);
        log.info("Order saved successfully with ID: {}", savedOrder.getId());

        // After saving, trigger the live dashboard update (best-effort; don't fail on broadcast)
        try {
            broadcastDashboardUpdate(savedOrder.getBranch().getId());
        } catch (Exception e) {
            log.error("Failed to broadcast dashboard update after order creation.", e);
        }

        log.info("Mapping saved order to DTO...");
        OrderDTO resultDto = OrderMapper.toDto(savedOrder);
        log.info("Returning OrderDTO with CustomerDTO: {}", resultDto.getCustomer());
        return resultDto;
    }

    // --- START: MODIFIED PUBLIC METHOD (more detailed analytics) ---
    @Override
    public DashboardAnalyticsDTO getDashboardAnalytics(Long branchId) {
        log.info("Calculating dashboard analytics for branch ID: {}", branchId);

        // Define "Today"
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        // Fetch all of today's orders for this branch
        List<Order> todayOrders = orderRepository.findByBranchIdAndCreatedAtBetween(
                branchId, startOfDay, endOfDay
        );

        // --- New Analytics Logic ---
        double totalSales = 0.0;
        long totalOrders = todayOrders.size();
        Map<String, Double> salesByCategory = new HashMap<>();

        for (Order order : todayOrders) {
            totalSales += (order.getTotalAmount() != null ? order.getTotalAmount() : 0.0);

            if (order.getItems() == null) continue;

            for (OrderItem item : order.getItems()) {
                String categoryName = "Uncategorized";

                if (item.getProduct() != null && item.getProduct().getCategory() != null) {
                    categoryName = item.getProduct().getCategory().getName();
                }

                double itemPrice = (item.getPrice() != null) ? item.getPrice() : 0.0;
                int itemQuantity = (item.getQuantity() != null) ? item.getQuantity() : 0;
                double itemTotalSales = itemPrice * itemQuantity;

                salesByCategory.put(
                        categoryName,
                        salesByCategory.getOrDefault(categoryName, 0.0) + itemTotalSales
                );
            }
        }
        // --- End New Analytics Logic ---

        // Create and return the DTO with the new map
        return new DashboardAnalyticsDTO(
                branchId,
                totalSales,
                totalOrders,
                salesByCategory
        );
    }
    // --- END: MODIFIED PUBLIC METHOD ---


    // Modified private method: now re-uses getDashboardAnalytics()
    private void broadcastDashboardUpdate(Long branchId) {
        log.info("Broadcasting dashboard update for branch ID: {}", branchId);

        // 1. Get the analytics (this now includes the category data)
        DashboardAnalyticsDTO analytics = getDashboardAnalytics(branchId);

        // 2. Define the topic and send the message
        String topic = "/topic/dashboard/branch/" + branchId;

        messagingTemplate.convertAndSend(topic, analytics);
        log.info("Successfully broadcasted to {}: {} orders, {} sales", topic,
                // safe getters used in DTO (method names assumed available)
                analytics.getTotalOrdersToday(), analytics.getTotalSalesToday());
    }


    // ... (rest of OrderServiceImpl.java - other methods remain unchanged) ...

    @Override
    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(OrderMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    @Override
    public List<OrderDTO> getOrdersByBranch(Long branchId,
                                            Long customerId,
                                            Long cashierId,
                                            PaymentType paymentType,
                                            OrderStatus status) {
        return orderRepository.findByBranchId(branchId).stream()
                .filter(order -> customerId == null ||
                        (order.getCustomer() != null &&
                                order.getCustomer().getId().equals(customerId)))
                .filter(order -> cashierId == null ||
                        (order.getCashier() != null &&
                                order.getCashier().getId().equals(cashierId)))
                .filter(order -> paymentType == null ||
                        order.getPaymentType() == paymentType)
                .map(OrderMapper::toDto)
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByCashier(Long cashierId, LocalDateTime from, LocalDateTime to) {
        User cashier = userRepository.findById(cashierId)
                .orElseThrow(() -> new EntityNotFoundException("Cashier not found with id: " + cashierId));

        List<Order> orders;
        if (from != null && to != null) {
            log.info("Fetching orders for cashier {} between {} and {}", cashierId, from, to);
            LocalDateTime endOfDay = to;
            if (to.toLocalTime().equals(java.time.LocalTime.MIDNIGHT)) {
                endOfDay = to.plusDays(1).minusNanos(1);
            }
            orders = orderRepository.findByCashierAndCreatedAtBetween(cashier, from, endOfDay);
        } else {
            log.info("Fetching all orders for cashier {}", cashierId);
            orders = orderRepository.findByCashierId(cashierId);
        }

        if (orders == null) {
            return Collections.emptyList();
        }

        return orders.stream()
                .map(OrderMapper::toDto)
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    @Override
    public List<OrderDTO> getTodayOrdersByBranch(Long branchId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return orderRepository.findByBranchIdAndCreatedAtBetween(branchId, start, end)
                .stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByCustomerId(Long customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getTop5RecentOrdersByBranchId(Long branchId) {
        branchRepository.findById(branchId)
                .orElseThrow(() -> new EntityNotFoundException("Branch not found with ID: " + branchId));

        List<Order> orders = orderRepository.findTop5ByBranch_IdOrderByCreatedAtDesc(branchId);
        return orders.stream()
                .map(OrderMapper::toDto)
                .collect(Collectors.toList());
    }

    // Export transactions to Excel
    @Override
    public ByteArrayInputStream exportTransactionsToExcel(Long branchId) {
        // 1. Fetch data
        List<Order> orders = orderRepository.findByBranch_IdOrderByCreatedAtDesc(branchId);
        // 2. Define headers
        String[] HEADERS = {"ID", "Date & Time", "Cashier", "Customer", "Amount", "Payment Method", "Status"};
        String SHEET = "Transactions";

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = workbook.createSheet(SHEET);

            // 3. Create Header Row
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
            }

            // 4. Create Data Rows
            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getCreatedAt() != null ? order.getCreatedAt().format(formatter) : "");
                row.createCell(2).setCellValue(order.getCashier() != null ? order.getCashier().getFullName() : "N/A");
                row.createCell(3).setCellValue(order.getCustomer() != null ? order.getCustomer().getFullName() : "Walk-in");
                row.createCell(4).setCellValue(order.getTotalAmount() != null ? order.getTotalAmount() : 0.0);
                row.createCell(5).setCellValue(order.getPaymentType() != null ? order.getPaymentType().toString() : "N/A");
                row.createCell(6).setCellValue(order.getStatus() != null ? order.getStatus().toString() : "N/A");
            }

            // 5. Auto-size columns for better readability
            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 6. Write to output stream and return
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            log.error("Failed to export transactions to Excel", e);
            throw new RuntimeException("Failed to export transactions to Excel: " + e.getMessage());
        }
    }
    // ... [KEEP ALL EXISTING METHODS] ...

    @Override
    public Map<String, Object> getTrendingProduct(Long storeAdminId) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);

        // Fetch top 1 selling item
        List<Object[]> results = orderRepository.findTopSellingProductToday(
                storeAdminId,
                startOfDay,
                PageRequest.of(0, 1)
        );

        Map<String, Object> response = new HashMap<>();
        if (!results.isEmpty()) {
            Object[] row = results.get(0);
            response.put("productName", row[0]);
            response.put("quantity", row[1]);
            response.put("found", true);
        } else {
            response.put("found", false);
            response.put("message", "No sales yet");
        }
        return response;
    }
}
