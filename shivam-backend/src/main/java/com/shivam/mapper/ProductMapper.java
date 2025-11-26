package com.shivam.mapper;

import com.shivam.modal.Category;
import com.shivam.modal.Product;
import com.shivam.modal.Store;
import com.shivam.payload.dto.ProductDTO;

public class ProductMapper {

    public static ProductDTO toDto(Product product) {
        // --- START: ADD NULL CHECK ---
        Category category = product.getCategory();
        // --- END: ADD NULL CHECK ---

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .description(product.getDescription())
                .mrp(product.getMrp())
                .sellingPrice(product.getSellingPrice())
                .brand(product.getBrand())

                // --- START: USE CHECKED VARIABLE ---
                .category(category != null ? category.getName() : null)
                .categoryId(category != null ? category.getId() : null)
                // --- END: USE CHECKED VARIABLE ---

                .storeId(product.getStore() != null ? product.getStore().getId() : null)
                .image(product.getImage())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public static Product toEntity(ProductDTO dto,
                                   Store store,
                                   Category category) {
        return Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .sku(dto.getSku())
                .description(dto.getDescription())
                .mrp(dto.getMrp())
                .sellingPrice(dto.getSellingPrice())
                .brand(dto.getBrand())
                .category(category)

                .store(store)
                .image(dto.getImage())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
}
