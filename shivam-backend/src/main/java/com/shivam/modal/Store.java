package com.shivam.modal;

import com.shivam.domain.StoreStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "brand name is required")
    private String brand;

    @OneToOne
    private User storeAdmin;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String description;
    private String storeType;
    private StoreStatus status;

    @Embedded
    private StoreContact contact = new StoreContact();

    // --- START: Added Fields from Tax/Currency Fix ---
    // (Assuming these are already here from our previous fix)
    @Column(name = "tax_rate", scale = 2)
    private Double taxRate;
    private String currency;
    private String dateFormat;
    @Column(length = 500)
    private String receiptFooter;
    // --- END: Added Fields from Tax/Currency Fix ---

    // --- START: New Payment Toggle Fields ---
    private Boolean acceptsCash;
    private Boolean acceptsCard;
    private Boolean acceptsUpi;
    // --- END: New Payment Toggle Fields ---

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
        status = StoreStatus.PENDING;
        // --- START: Add Defaults for new fields ---
        if(taxRate == null) taxRate = 0.0;
        if(currency == null) currency = "USD";
        if(acceptsCash == null) acceptsCash = true;
        if(acceptsCard == null) acceptsCard = true;
        if(acceptsUpi == null) acceptsUpi = true;
        // --- END: Add Defaults ---
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}