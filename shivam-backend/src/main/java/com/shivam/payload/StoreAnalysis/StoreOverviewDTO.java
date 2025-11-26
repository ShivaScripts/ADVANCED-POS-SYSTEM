package com.shivam.payload.StoreAnalysis;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal; // <-- Already here
import java.math.RoundingMode; // <-- ADD THIS IMPORT

@Data
@Builder
public class StoreOverviewDTO {
    // --- Existing Fields ---
    private Integer totalBranches;
    private Double totalSales;
    private Integer totalOrders;
    private Integer totalEmployees;
    private Integer totalCustomers;
    private Integer totalRefunds;
    private Integer totalProducts;
    private String topBranchName;

    // --- START: ADD THESE NEW FIELDS ---
    // (These match what your Sales.jsx file is asking for)

    private Integer todayOrders;
    private Integer yesterdayOrders; // For comparison

    private Integer activeCashiers;
    private Integer yesterdayActiveCashiers; // For comparison

    private Double totalSalesToday; // We need this to calculate AOV

    /**
     * Helper method to calculate Average Order Value.
     * This is backend logic kept inside the DTO builder.
     */
    public Double getAverageOrderValue() {
        if (todayOrders == null || todayOrders == 0 || totalSalesToday == null) {
            return 0.0;
        }
        // Calculate AOV and round to 2 decimal places
        BigDecimal sales = BigDecimal.valueOf(totalSalesToday);
        BigDecimal orders = BigDecimal.valueOf(todayOrders);
        return sales.divide(orders, 2, RoundingMode.HALF_UP).doubleValue();
    }
    // --- END: ADD THESE NEW FIELDS ---
}