package com.shivam.mapper;


import com.shivam.modal.Branch;
import com.shivam.modal.Inventory;
import com.shivam.modal.Product;
import com.shivam.payload.dto.InventoryDTO;

public class InventoryMapper {

    public static InventoryDTO toDto(Inventory inventory) {
        return InventoryDTO.builder()
                .id(inventory.getId())
                .branchId(inventory.getBranch().getId())
                .productId(inventory.getProduct().getId())
                .quantity(inventory.getQuantity())
                .build();
    }

    public static Inventory toEntity(InventoryDTO dto, Branch branch, Product product) {
        return Inventory.builder()
                .id(dto.getId())
                .branch(branch)
                .product(product)
                .quantity(dto.getQuantity())
                .build();
    }
}

