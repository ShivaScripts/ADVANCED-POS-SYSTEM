package com.shivam.service.impl;

import com.shivam.domain.UserRole;
import com.shivam.modal.Order;
import com.shivam.payload.StoreAnalysis.*;
import com.shivam.repository.*;
import com.shivam.service.StoreAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest; // <-- Added Import
import org.springframework.data.domain.Pageable; // <-- Added Import
import org.springframework.stereotype.Service;
import java.time.LocalDate; // <-- ADD THIS IMPORT
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreAnalyticsServiceImpl implements StoreAnalyticsService {

    private final BranchRepository branchRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final RefundRepository refundRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    // --- START: MODIFIED getStoreOverview METHOD ---
    @Override
    public StoreOverviewDTO getStoreOverview(Long storeAdminId) {
        // --- 1. Calculate Date Ranges ---
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfYesterday = startOfToday.minusDays(1);

        // --- 2. Fetch "All-Time" Data (your existing logic) ---
        List<UserRole> roles = new ArrayList<>();
        roles.add(UserRole.ROLE_STORE_MANAGER);
        roles.add(UserRole.ROLE_CUSTOMER);
        roles.add(UserRole.ROLE_BRANCH_CASHIER);
        roles.add(UserRole.ROLE_BRANCH_MANAGER);

        Double totalSales = orderRepository.sumTotalSalesByStoreAdmin(storeAdminId).orElse(0.0);
        Integer totalOrders = orderRepository.countByStoreAdminId(storeAdminId);

        // --- 3. Fetch "Today & Yesterday" Data (new logic) ---
        Integer todayOrders = orderRepository.countOrdersTodayForStoreAdmin(storeAdminId, startOfToday);
        Integer yesterdayOrders = orderRepository.countOrdersYesterdayForStoreAdmin(storeAdminId, startOfYesterday, startOfToday);
        Double totalSalesToday = orderRepository.sumTotalSalesTodayForStoreAdmin(storeAdminId, startOfToday);
        Integer activeCashiers = orderRepository.countActiveCashiersTodayForStoreAdmin(storeAdminId, startOfToday);
        Integer yesterdayActiveCashiers = orderRepository.countActiveCashiersYesterdayForStoreAdmin(storeAdminId, startOfYesterday, startOfToday);

        // --- 4. Build the complete DTO ---
        StoreOverviewDTO.StoreOverviewDTOBuilder builder = StoreOverviewDTO.builder()
                .totalBranches(branchRepository.countByStoreAdminId(storeAdminId))
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .totalEmployees(userRepository.countByStoreAdminIdAndRoles(storeAdminId, roles))
                .totalCustomers(customerRepository.countByStoreAdminId(storeAdminId))
                .totalRefunds(refundRepository.countByStoreAdminId(storeAdminId))
                .totalProducts(productRepository.countByStoreAdminId(storeAdminId))
                // .topBranchName(branchRepository.findTopBranchBySales(storeAdminId)) // This is still commented

                // --- Add the new fields ---
                .todayOrders(todayOrders)
                .yesterdayOrders(yesterdayOrders)
                .totalSalesToday(totalSalesToday)
                .activeCashiers(activeCashiers)
                .yesterdayActiveCashiers(yesterdayActiveCashiers);

        // --- 5. Build and return (AOV is calculated by the DTO's getter) ---
        return builder.build();
    }
    // --- END: MODIFIED getStoreOverview METHOD ---

    @Override
    public TimeSeriesDataDTO getSalesTrends(Long storeAdminId, String period) {
        //        // Dummy data, replace with actual queries later
        ////        List<TimeSeriesPointDTO> points = List.of(
        ////                new TimeSeriesPointDTO("Week 1", BigDecimal.valueOf(4000)),
        ////                new TimeSeriesPointDTO("Week 2", BigDecimal.valueOf(6200))
        ////        );
        return null;
    }

    @Override
    public List<TimeSeriesPointDTO> getMonthlySalesGraph(Long storeAdminId) {
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(365);

        List<Order> orders = orderRepository.findAllByStoreAdminAndCreatedAtBetween(storeAdminId, start, end);

        Map<YearMonth, Double> grouped = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> YearMonth.from(order.getCreatedAt()),  // Group by Year-Month
                        Collectors.summingDouble(order ->
                                order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0.0
                        )
                ));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new TimeSeriesPointDTO(
                        entry.getKey().atDay(1).atStartOfDay(), // Convert YearMonth to LocalDateTime
                        entry.getValue()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeSeriesPointDTO> getDailySalesGraph(Long storeAdminId) {
//        return null;
        LocalDateTime end = LocalDateTime.now();
        LocalDateTime start = end.minusDays(6);
        return orderRepository.getDailySales(storeAdminId, start, end);
    }

    @Override
    public List<CategorySalesDTO> getSalesByCategory(Long storeAdminId) {
        return productRepository.getSalesGroupedByCategory(storeAdminId);
    }

    @Override
    public List<PaymentInsightDTO> getSalesByPaymentMethod(Long storeAdminId) {
        return orderRepository.getSalesByPaymentMethod(storeAdminId);
    }

    @Override
    public List<BranchSalesDTO> getSalesByBranch(Long storeAdminId) {
        return orderRepository.getSalesByBranch(storeAdminId);
    }

    @Override
    public List<PaymentInsightDTO> getPaymentBreakdown(Long storeAdminId) {
        return orderRepository.getSalesByPaymentMethod(storeAdminId);
    }

    @Override
    public BranchPerformanceDTO getBranchPerformance(Long storeAdminId) {
        return BranchPerformanceDTO.builder()
                .branchSales(orderRepository.getSalesByBranch(storeAdminId))
                .newBranchesThisMonth(branchRepository.countNewBranchesThisMonth(storeAdminId))
//                .topBranch(branchRepository.findTopBranchBySales(storeAdminId))
                .build();
    }

    @Override
    public StoreAlertDTO getStoreAlerts(Long storeAdminId) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        userRepository.findInactiveCashiers(storeAdminId, sevenDaysAgo);

        return StoreAlertDTO.builder()
                .lowStockAlerts(productRepository.findLowStockProducts(storeAdminId))
                .noSalesToday(branchRepository.findBranchesWithNoSalesToday(storeAdminId))
                .refundSpikeAlerts(refundRepository.findRefundSpikes(storeAdminId))
                .inactiveCashiers(userRepository.findInactiveCashiers(storeAdminId, sevenDaysAgo))
                .build();
    }

    // --- ADD THIS NEW METHOD ---
    @Override
    public List<RecentSaleDTO> getRecentSales(Long storeAdminId) {
        // Create a Pageable object to request only the top 5 results
        Pageable topFive = PageRequest.of(0, 5);
        return orderRepository.findRecentSalesByStoreAdmin(storeAdminId, topFive);
    }
    // --- END ---
}
