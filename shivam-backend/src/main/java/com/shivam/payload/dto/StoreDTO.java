package com.shivam.payload.dto;

import com.shivam.domain.StoreStatus;
import com.shivam.modal.StoreContact;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreDTO {
    private Long id;
    private String brand;
    private Long storeAdminId;
    private UserDTO storeAdmin;
    private String storeType;
    private StoreStatus status;
    private String description;
    private StoreContact contact;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // --- START: Added Fields from Tax/Currency Fix ---
    // (Assuming these are already here)
    private Double taxRate;
    private String currency;
    private String dateFormat;
    private String receiptFooter;
    // --- END: Added Fields from Tax/Currency Fix ---

    // --- START: New Payment Toggle Fields ---
    private Boolean acceptsCash;
    private Boolean acceptsCard;
    private Boolean acceptsUpi;
    // --- END: New Payment Toggle Fields ---
}