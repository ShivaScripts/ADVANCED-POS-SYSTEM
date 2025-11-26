package com.shivam.mapper;

import com.shivam.modal.Store;
import com.shivam.modal.User;
import com.shivam.payload.dto.StoreDTO;

public class StoreMapper {

    public static StoreDTO toDto(Store store) {
        if (store == null) return null; // Safety check
        return StoreDTO.builder()
                .id(store.getId())
                .brand(store.getBrand())
                .storeAdminId(store.getStoreAdmin() != null ? store.getStoreAdmin().getId() : null)
                .storeAdmin(UserMapper.toDTO(store.getStoreAdmin()))
                .storeType(store.getStoreType())
                .description(store.getDescription())
                .contact(store.getContact())
                .createdAt(store.getCreatedAt())
                .updatedAt(store.getUpdatedAt())
                .status(store.getStatus())
                // --- START: Added Mappings from Tax/Currency Fix ---
                // (Assuming these are already here)
                .taxRate(store.getTaxRate())
                .currency(store.getCurrency())
                .dateFormat(store.getDateFormat())
                .receiptFooter(store.getReceiptFooter())
                // --- END: Added Mappings ---

                // --- START: New Payment Toggle Mappings ---
                .acceptsCash(store.getAcceptsCash())
                .acceptsCard(store.getAcceptsCard())
                .acceptsUpi(store.getAcceptsUpi())
                // --- END: New Payment Toggle Mappings ---
                .build();
    }

    public static Store toEntity(StoreDTO dto, User storeAdmin) {
        if (dto == null) return null; // Safety check
        return Store.builder()
                .id(dto.getId())
                .brand(dto.getBrand())
                .storeAdmin(storeAdmin)
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .storeType(dto.getStoreType())
                .description(dto.getDescription())
                // Note: toEntity in StoreServiceImpl handles contact separately

                // --- START: Added Mappings from Tax/Currency Fix ---
                // (Assuming these are already here)
                .taxRate(dto.getTaxRate())
                .currency(dto.getCurrency())
                .dateFormat(dto.getDateFormat())
                .receiptFooter(dto.getReceiptFooter())
                // --- END: Added Mappings ---

                // --- START: New Payment Toggle Mappings ---
                .acceptsCash(dto.getAcceptsCash())
                .acceptsCard(dto.getAcceptsCard())
                .acceptsUpi(dto.getAcceptsUpi())
                // --- END: New Payment Toggle Mappings ---
                .build();
    }
}