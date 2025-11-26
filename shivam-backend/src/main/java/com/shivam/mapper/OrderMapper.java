package com.shivam.mapper;

import com.shivam.modal.Order;
// Removed: import com.shivam.modal.Customer;
import com.shivam.payload.dto.CustomerDTO; // <-- Add Import
import com.shivam.payload.dto.OrderDTO;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDto(Order order) {

        // --- START FIX: Map Customer entity to CustomerDTO ---
        CustomerDTO customerDto = (order.getCustomer() != null)
                ? CustomerMapper.toDto(order.getCustomer()) // Use CustomerMapper
                : null;
        // --- END FIX ---

        return OrderDTO.builder()
                .id(order.getId())
                .subtotal(order.getSubtotal())
                .discount(order.getDiscount())
                .tax(order.getTax())
                .totalAmount(order.getTotalAmount())
                .branchId(order.getBranch() != null ? order.getBranch().getId() : null)
                .cashierId(order.getCashier() != null ? order.getCashier().getId() : null)
                // --- Use the mapped CustomerDTO ---
                .customer(customerDto)
                // ---
                .createdAt(order.getCreatedAt())
                .paymentType(order.getPaymentType())
                .status(order.getStatus())
                .items(order.getItems() != null ? order.getItems().stream()
                        .map(OrderItemMapper::toDto)
                        .collect(Collectors.toList()) : List.of())
                .razorpayPaymentId(order.getRazorpayPaymentId())
                .build();
    }

    // Optional: Add a toEntity method if needed elsewhere
    // This would likely need updating if OrderDTO.customer is now CustomerDTO
    // public static Order toEntity(OrderDTO dto) { ... }
}