// pos-backend/src/main/java/com/zosh/payload/dto/OrderDTO.java

package com.shivam.payload.dto;

import com.shivam.domain.OrderStatus;
import com.shivam.domain.PaymentType;
// Removed: import com.shivam.modal.Customer;
import lombok.*; // Assuming you use lombok

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;

    // Pricing fields
    private Double subtotal;
    private Double discount;
    private Double tax;
    private Double totalAmount; // Final amount
    private String razorpayPaymentId;

    // --- START: NEW LOYALTY FIELDS ---
    private Integer pointsEarned;
    private Integer pointsRedeemed;
    // --- END: NEW LOYALTY FIELDS ---

    private Long branchId;
    private Long cashierId;

    // --- START FIX: Changed type to CustomerDTO ---
    private CustomerDTO customer;
    // --- END FIX ---

    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
    private PaymentType paymentType;
    private OrderStatus status;
}