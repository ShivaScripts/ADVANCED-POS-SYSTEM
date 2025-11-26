package com.shivam.service;

import com.shivam.modal.PaymentSummary;
import com.shivam.payload.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface BranchAnalyticsService {
    List<DailySalesDTO> getDailySalesChart(Long branchId, int days);
    List<ProductPerformanceDTO> getTopProductsByQuantityWithPercentage(Long branchId);
    List<CashierPerformanceDTO> getTopCashierPerformanceByOrders(Long branchId);
    List<CategorySalesDTO> getCategoryWiseSalesBreakdown(Long branchId,
                                                         LocalDate date);

    BranchDashboardOverviewDTO getBranchOverview(Long branchId);
    List<PaymentSummary> getPaymentMethodBreakdown(Long branchId, LocalDate date);



}
