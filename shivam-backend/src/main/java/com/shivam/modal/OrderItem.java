// pos-backend/src/main/java/com/zosh/modal/OrderItem.java
package com.shivam.modal;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    private Double price; // Price at the time of sale

    // --- START: NEW FIELD ---
    private String productName; // Name at the time of sale
    // --- END: NEW FIELD ---

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = true) // Allow product to be null
    private Product product;

    @ManyToOne
    private Order order;
}