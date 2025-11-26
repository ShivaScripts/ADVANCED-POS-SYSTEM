package com.shivam.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map; // <-- ADD THIS IMPORT

/**
 * A simple DTO to broadcast live analytics updates to the dashboard.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsDTO {

    private long branchId;
    private double totalSalesToday;
    private long totalOrdersToday;

    // --- START: ADD THIS NEW FIELD ---
    /**
     * Holds the total sales for each category.
     * Key: Category Name (e.g., "Food", "Uncategorized")
     * Value: Total Sales (e.g., 4500.50)
     */
    private Map<String, Double> salesByCategory;
    // --- END: ADD THIS NEW FIELD ---
}