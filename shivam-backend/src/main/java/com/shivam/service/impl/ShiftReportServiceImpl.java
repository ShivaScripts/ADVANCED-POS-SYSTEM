// pos-backend/src/main/java/com/zosh/service/impl/ShiftReportServiceImpl.java
package com.shivam.service.impl;

import com.shivam.domain.PaymentType;
import com.shivam.exception.UserException;
import com.shivam.modal.*;
import com.shivam.repository.*;
import com.shivam.service.ShiftReportService;
import com.shivam.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftReportServiceImpl implements ShiftReportService {

    private final ShiftReportRepository shiftReportRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final OrderRepository orderRepository;
    private final RefundRepository refundRepository;
    private final UserService userService;

    @Override
    public ShiftReport startShift(Long cashierId,
                                  Long branchId,
                                  LocalDateTime shiftStart // Param not used
    ) throws UserException {
        User currentUser = userService.getCurrentUser();
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDate today = currentDateTime.toLocalDate();

        Branch branch = branchRepository.findById(branchId).orElseThrow(() ->
                new RuntimeException("Branch not found with ID: " + branchId));

        // Check for an existing OPEN shift today
        Optional<ShiftReport> latestOpenShiftOpt = shiftReportRepository
                .findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(currentUser);

        if (latestOpenShiftOpt.isPresent()) {
            ShiftReport latestOpenShift = latestOpenShiftOpt.get();
            if (latestOpenShift.getShiftStart().toLocalDate().isEqual(today)) {
                throw new RuntimeException("An open shift already exists for today. Please end the current shift first.");
            }
        }

        ShiftReport shift = new ShiftReport();
        shift.setCashier(currentUser);
        shift.setBranch(branch);
        shift.setShiftStart(currentDateTime);

        return shiftReportRepository.save(shift);
    }

    @Override
    @Transactional // Keep Transactional here
    public ShiftReport endShift(Long shiftReportId, LocalDateTime shiftEnd) throws UserException {
        User currentUser = userService.getCurrentUser();
        shiftEnd = LocalDateTime.now(); // Use current time

        ShiftReport shift = shiftReportRepository
                .findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(currentUser)
                .orElseThrow(
                        () -> new EntityNotFoundException("No active shift report found for the current user.")
                );

        shift.setShiftEnd(shiftEnd);

        // Clear lists before saving final data
        if (shift.getTopSellingProducts() == null) shift.setTopSellingProducts(new ArrayList<>()); else shift.getTopSellingProducts().clear();
        if (shift.getRecentOrders() == null) shift.setRecentOrders(new ArrayList<>()); else shift.getRecentOrders().clear();

        List<Order> orders = orderRepository.findByCashierAndCreatedAtBetween(
                shift.getCashier(), shift.getShiftStart(), shiftEnd
        );
        List<Refund> refunds = refundRepository.findByCashierAndCreatedAtBetween(
                shift.getCashier(), shift.getShiftStart(), shiftEnd
        );

        double totalRefunds = refunds.stream().mapToDouble(r -> r.getAmount() != null ? r.getAmount() : 0.0).sum();
        double totalSales = orders.stream().mapToDouble(Order::getTotalAmount).sum();
        int totalOrders = orders.size();
        double netSales = totalSales - totalRefunds;

        shift.setTotalSales(totalSales);
        shift.setTotalOrders(totalOrders);
        shift.setTotalRefunds(totalRefunds);
        shift.setNetSales(netSales);

        // Calculate and add relationships ONLY on endShift
        List<Order> newRecentOrders = getRecentOrders(orders);
        shift.getRecentOrders().addAll(newRecentOrders);
        List<Product> newTopProducts = getTopSellingProducts(orders);
        shift.getTopSellingProducts().addAll(newTopProducts);

        shift.setPaymentSummaries(getPaymentSummaries(orders, totalSales));
        shift.setRefunds(refunds);

        return shiftReportRepository.save(shift); // Save the final state
    }

    @Override
    public ShiftReport getShiftReportById(Long id) {
        return shiftReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift report not found"));
    }

    @Override
    public List<ShiftReport> getAllShiftReports() {
        return shiftReportRepository.findAll();
    }

    @Override
    public List<ShiftReport> getShiftReportsByCashier(Long cashierId) {
        User cashier = userRepository.findById(cashierId)
                .orElseThrow(() -> new RuntimeException("Cashier not found"));
        return shiftReportRepository.findByCashier(cashier);
    }

    @Override
    public List<ShiftReport> getShiftReportsByBranch(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        return shiftReportRepository.findByBranch(branch);
    }

    // --- START: MODIFIED METHOD ---
    @Override
    public ShiftReport getCurrentShiftProgress(Long cashierId) throws UserException {
        User cashier = userService.getCurrentUser();

        ShiftReport shift = shiftReportRepository
                .findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(cashier)
                .orElseThrow(() -> new RuntimeException("No active shift found for this cashier"));

        LocalDateTime now = LocalDateTime.now();

        // Fetch all data for the current shift period
        List<Order> orders = orderRepository.findByCashierAndCreatedAtBetween(
                cashier, shift.getShiftStart(), now
        );
        List<Refund> refunds = refundRepository.findByCashierAndCreatedAtBetween(
                cashier, shift.getShiftStart(), now
        );

        // Perform all calculations
        double totalSales = orders.stream().mapToDouble(Order::getTotalAmount).sum();
        int totalOrders = orders.size();
        double totalRefunds = refunds.stream().mapToDouble(r -> r.getAmount() != null ? r.getAmount() : 0.0).sum();
        double netSales = totalSales - totalRefunds;

        // Calculate transient payment summaries
        List<PaymentSummary> calculatedPaymentSummaries = getPaymentSummaries(orders, totalSales);

        // --- ADDED THIS LOGIC ---
        // Also calculate the lists (but don't save them to the shift entity)
        List<Order> recentOrders = getRecentOrders(orders);
        List<Product> topProducts = getTopSellingProducts(orders);
        // --- END ADDED LOGIC ---


        // Set ONLY the simple values and transient summaries on the shift object
        shift.setTotalSales(totalSales);
        shift.setTotalOrders(totalOrders);
        shift.setTotalRefunds(totalRefunds);
        shift.setNetSales(netSales);
        shift.setPaymentSummaries(calculatedPaymentSummaries);

        // --- ADDED THIS LOGIC ---
        // Set the transient lists for the DTO
        shift.setRecentOrders(recentOrders);
        shift.setTopSellingProducts(topProducts);
        shift.setRefunds(refunds);
        // --- END ADDED LOGIC ---

        // We DO NOT save the shift here, as this is a "live progress" check.
        // The DTO will now be created from this fully populated (but unsaved) object.
        return shift;
    }
    // --- END: MODIFIED METHOD ---


    @Override
    public ShiftReport getShiftReportByCashierAndDate(Long cashierId, LocalDateTime date) {
        User cashier = userRepository.findById(cashierId)
                .orElseThrow(() -> new RuntimeException("Cashier not found"));
        LocalDateTime start = date.toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusNanos(1);
        return shiftReportRepository.findByCashierAndShiftStartBetween(cashier, start, end)
                .orElseThrow(() -> new RuntimeException("No shift report found on this date"));
    }

    @Override
    public void deleteShiftReport(Long id) {
        if (!shiftReportRepository.existsById(id)) {
            throw new RuntimeException("Shift report not found");
        }
        shiftReportRepository.deleteById(id);
    }

    // ----------------- HELPER METHODS (No changes needed) -----------------

    private List<Order> getRecentOrders(List<Order> orders) {
        return orders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<Product> getTopSellingProducts(List<Order> orders) {
        Map<Product, Integer> productSalesMap = new HashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                // --- START: FIX FOR CUSTOM ITEMS ---
                // If product is null (a custom item), skip it in top selling
                if (product != null) {
                    productSalesMap.put(product, productSalesMap.getOrDefault(product, 0) + item.getQuantity());
                }
                // --- END: FIX FOR CUSTOM ITEMS ---
            }
        }
        return productSalesMap.entrySet().stream()
                .sorted(Map.Entry.<Product, Integer>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private List<PaymentSummary> getPaymentSummaries(List<Order> orders, double totalSales) {
        Map<PaymentType, List<Order>> grouped = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getPaymentType() != null ? order.getPaymentType() : PaymentType.CASH
                ));

        List<PaymentSummary> summaries = new ArrayList<>();
        for (Map.Entry<PaymentType, List<Order>> entry : grouped.entrySet()) {
            double amount = entry.getValue().stream().mapToDouble(Order::getTotalAmount).sum();
            int transactions = entry.getValue().size();
            double percent = (totalSales > 0) ? (amount / totalSales) * 100 : 0;

            PaymentSummary ps = new PaymentSummary();
            ps.setType(entry.getKey());
            ps.setTotalAmount(amount);
            ps.setTransactionCount(transactions);
            ps.setPercentage(percent);
            summaries.add(ps);
        }
        return summaries;
    }
}