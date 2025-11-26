package com.shivam.payload.StoreAnalysis;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecentSaleDTO {
    private String branchName;
    private Double totalAmount;
    private LocalDateTime createdAt;
}