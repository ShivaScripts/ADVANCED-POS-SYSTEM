package com.shivam.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatsDTO {
    private long totalCustomers;
    private long goldMembers;
    private double avgOrdersPerCustomer;
}