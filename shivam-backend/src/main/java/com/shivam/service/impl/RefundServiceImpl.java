package com.shivam.service.impl;

import com.shivam.domain.OrderStatus;
import com.shivam.exception.ResourceNotFoundException;
import com.shivam.exception.UserException;
import com.shivam.modal.*;
import com.shivam.payload.dto.RefundDTO;
import com.shivam.repository.BranchRepository;
import com.shivam.repository.OrderRepository;
import com.shivam.repository.RefundRepository;
import com.shivam.service.InventoryService; // <-- Added Import
import com.shivam.service.RefundService;
import com.shivam.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger; // <-- Added Import
import org.slf4j.LoggerFactory; // <-- Added Import
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final BranchRepository branchRepository;

    // --- ADDED DEPENDENCY ---
    private final InventoryService inventoryService;
    // --- END ---

    // --- ADDED LOGGER ---
    private static final Logger log = LoggerFactory.getLogger(RefundServiceImpl.class);
    // --- END ---

    @Override
    @Transactional // Make refund creation and stock update atomic
    public Refund createRefund(RefundDTO refundDTO) throws UserException, ResourceNotFoundException {
        User currentCashier = userService.getCurrentUser();

        Order order = orderRepository.findById(refundDTO.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + refundDTO.getOrderId()));

        Branch branch = branchRepository.findById(refundDTO.getBranchId()).orElseThrow(
                () -> new EntityNotFoundException("Branch not found with ID: " + refundDTO.getBranchId())
        );
        Long branchId = branch.getId(); // Get branch ID

        // --- Check if order is already refunded ---
        if (order.getStatus() == OrderStatus.REFUNDED) {
            log.warn("Attempted to refund an already refunded order ID: {}", order.getId());
            // Decide how to handle this - throw exception or return existing refund?
            // For now, let's prevent duplicate refunds.
            throw new UserException("Order " + order.getId() + " has already been refunded.");
        }
        // --- End Check ---


        Refund refund = new Refund();
        refund.setOrder(order);
        refund.setCashier(currentCashier);
        refund.setReason(refundDTO.getReason());
        // Assuming full refund amount for now, adjust if partial refunds are needed
        refund.setAmount(order.getTotalAmount());
        refund.setCreatedAt(LocalDateTime.now());
        refund.setBranch(branch);
        // Set payment type based on original order or specific refund DTO field if available
        refund.setPaymentType(order.getPaymentType());


        // 1. Save the refund record
        Refund savedRefund = refundRepository.save(refund);

        // 2. Update inventory stock (Assuming full refund restocks all original items)
        try {
            // We need the original order items to know what to restock
            Order originalOrder = savedRefund.getOrder();
            if (originalOrder != null && originalOrder.getItems() != null) {
                for (OrderItem item : originalOrder.getItems()) {
                    if (item.getProduct() != null && item.getQuantity() != null) {
                        Long productId = item.getProduct().getId();
                        int quantityToRestock = item.getQuantity(); // Restock the original quantity

                        // Call updateStock with POSITIVE quantity for refund/restock
                        inventoryService.updateStock(productId, branchId, quantityToRestock);
                    } else {
                        log.warn("Skipping inventory restock for order item ID {} (part of refund ID {}) due to missing product or quantity.", item.getId(), savedRefund.getId());
                    }
                }
            } else {
                log.warn("Could not find original order items for refund ID {}. Inventory not restocked.", savedRefund.getId());
            }
        } catch (Exception e) {
            // Log the error but don't fail the refund creation (or decide if it should fail)
            log.error("Failed to update inventory stock for refund ID {}: {}", savedRefund.getId(), e.getMessage(), e);
            // Optionally: You could throw a custom exception here
            // throw new RuntimeException("Failed to restock inventory after refund creation", e);
        }

        // 3. Update the original order status
        order.setStatus(OrderStatus.REFUNDED);
        orderRepository.save(order);

        // 4. Return the saved refund
        return savedRefund;
    }
    @Override
    public List<Refund> getAllRefunds() {
        return refundRepository.findAll();
    }

    @Override
    public List<Refund> getRefundsByCashier(Long cashierId) {
        return refundRepository.findByCashierId(cashierId);
    }

    @Override
    public List<Refund> getRefundsByShiftReport(Long shiftReportId) {
        return refundRepository.findByShiftReportId(shiftReportId);
    }

    @Override
    public List<Refund> getRefundsByCashierAndDateRange(Long cashierId, LocalDateTime from, LocalDateTime to) {
        return refundRepository.findByCashierIdAndCreatedAtBetween(cashierId, from, to);
    }

    @Override
    public List<Refund> getRefundsByBranch(Long branchId) {
        List<Refund> refunds= refundRepository.findByBranchId(branchId);
        return refunds;
    }

    @Override
    public Refund getRefundById(Long id) throws ResourceNotFoundException {
        return refundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Refund not found"));
    }

    @Override
    public void deleteRefund(Long refundId) throws ResourceNotFoundException {
        if (!refundRepository.existsById(refundId)) {
            throw new ResourceNotFoundException("Refund not found");
        }
        refundRepository.deleteById(refundId);
    }


}
