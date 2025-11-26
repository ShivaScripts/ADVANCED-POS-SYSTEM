package com.shivam.service;

import java.util.Map; // <--- Add this import
import com.shivam.domain.OrderStatus;
import com.shivam.domain.PaymentType;
import com.shivam.exception.UserException;
import com.shivam.payload.dto.DashboardAnalyticsDTO; // --- ADD THIS IMPORT ---
import com.shivam.payload.dto.OrderDTO;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO dto) throws UserException;
    OrderDTO getOrderById(Long id);

    List<OrderDTO> getOrdersByBranch(Long branchId,
                                     Long customerId,
                                     Long cashierId,
                                     PaymentType paymentType,
                                     OrderStatus status);

    List<OrderDTO> getOrdersByCashier(Long cashierId, LocalDateTime from, LocalDateTime to);

    void deleteOrder(Long id);
    List<OrderDTO> getTodayOrdersByBranch(Long branchId);
    List<OrderDTO> getOrdersByCustomerId(Long customerId);
    List<OrderDTO> getTop5RecentOrdersByBranchId(Long branchId);

    ByteArrayInputStream exportTransactionsToExcel(Long branchId);

    // --- START: ADD THIS NEW METHOD ---
    /**
     * Calculates the "data analytics" for the branch's current day.
     * @param branchId The ID of the branch.
     * @return A DTO with today's sales and order totals.
     */
    DashboardAnalyticsDTO getDashboardAnalytics(Long branchId);
    Map<String, Object> getTrendingProduct(Long storeAdminId);
    // --- END: ADD THIS NEW METHOD ---
}