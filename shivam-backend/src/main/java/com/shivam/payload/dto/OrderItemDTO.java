// pos-backend/src/main/java/com/zosh/payload/dto/OrderItemDTO.java
package com.shivam.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long id;
    private Long productId; // Will be null for custom items
    private Integer quantity;
    private ProductDTO product; // Used for fetching, not creating
    private Double price; // Will be set for custom items

    // --- START: NEW FIELD ---
    private String productName; // Will be set for custom items
    // --- END: NEW FIELD ---
}