// pos-backend/src/main/java/com/zosh/modal/Order.java
package com.shivam.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shivam.domain.OrderStatus;
import com.shivam.domain.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double subtotal;
    private Double discount;
    private Double tax;
    private Double totalAmount;

    private String razorpayPaymentId;

    // --- START: NEW LOYALTY FIELDS ---
    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer pointsEarned = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer pointsRedeemed = 0;
    // --- END: NEW LOYALTY FIELDS ---

    private LocalDateTime createdAt;

    @ManyToOne
    @JsonIgnore
    private Branch branch;

    @ManyToOne
    @JsonIgnore
    private User cashier;

    @ManyToOne(fetch = FetchType.EAGER)
    private Customer customer;

    private PaymentType paymentType;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    private OrderStatus status = OrderStatus.COMPLETED;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}