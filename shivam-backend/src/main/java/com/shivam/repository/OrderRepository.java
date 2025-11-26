package com.shivam.repository;

import com.shivam.modal.Order;
import com.shivam.modal.User;
import com.shivam.payload.StoreAnalysis.BranchSalesDTO;
import com.shivam.payload.StoreAnalysis.PaymentInsightDTO;
import com.shivam.payload.StoreAnalysis.RecentSaleDTO; // <-- Added Import
import com.shivam.payload.StoreAnalysis.TimeSeriesPointDTO;
import org.springframework.data.domain.Pageable; // <-- Added Import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByBranchId(Long branchId);
    List<Order> findByCashierId(Long cashierId);
    List<Order> findByBranchIdAndCreatedAtBetween(Long branchId,
                                                  LocalDateTime start,
                                                  LocalDateTime end);
    List<Order> findByCashierAndCreatedAtBetween(User cashier,
                                                 LocalDateTime start,
                                                 LocalDateTime end);
    @Query("SELECT o FROM Order o WHERE o.branch.id = :branchId ORDER BY o.createdAt DESC")
    List<Order> findByBranch_IdOrderByCreatedAtDesc(@Param("branchId") Long branchId);
    List<Order> findTop5ByBranch_IdOrderByCreatedAtDesc(Long branchId);
    @Query(""" 
            SELECT SUM(o.totalAmount) 
            FROM Order o 
            WHERE o.branch.id = :branchId  
            AND o.createdAt BETWEEN :start AND :end
           """)
    Optional<BigDecimal> getTotalSalesBetween(@Param("branchId") Long branchId,
                                              @Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);

    @Query("""
        SELECT u.id, u.fullName, SUM(o.totalAmount) AS totalRevenue
        FROM Order o
        JOIN o.cashier u
        WHERE o.branch.id = :branchId
        GROUP BY u.id, u.fullName
        ORDER BY totalRevenue DESC
    """)
    List<Object[]> getTopCashiersByRevenue(@Param("branchId") Long branchId);

    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.branch.id = :branchId
        AND DATE(o.createdAt) = :date
    """)
    int countOrdersByBranchAndDate(@Param("branchId") Long branchId,
                                   @Param("date") LocalDate date);

    @Query("""
        SELECT COUNT(DISTINCT o.cashier.id)
        FROM Order o
        WHERE o.branch.id = :branchId
        AND DATE(o.createdAt) = :date
    """)
    int countDistinctCashiersByBranchAndDate(@Param("branchId") Long branchId,
                                             @Param("date") LocalDate date);

    @Query("""
    SELECT o.paymentType, SUM(o.totalAmount), COUNT(o)
    FROM Order o
    WHERE o.branch.id = :branchId
    AND DATE(o.createdAt) = :date
    GROUP BY o.paymentType
""")
    List<Object[]> getPaymentBreakdownByMethod(
            @Param("branchId") Long branchId,
            @Param("date") LocalDate date
    );

    ////////////////////

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.branch.store.storeAdmin.id = :storeAdminId")
    Optional<Double> sumTotalSalesByStoreAdmin(@Param("storeAdminId") Long storeAdminId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.branch.store.storeAdmin.id = :storeAdminId")
    int countByStoreAdminId(@Param("storeAdminId") Long storeAdminId);
//

    @Query("""
    SELECT o FROM Order o 
    WHERE o.branch.store.storeAdmin.id = :storeAdminId 
    AND o.createdAt BETWEEN :start AND :end
""")
    List<Order> findAllByStoreAdminAndCreatedAtBetween(@Param("storeAdminId") Long storeAdminId,
                                                       @Param("start") LocalDateTime start,
                                                       @Param("end") LocalDateTime end);



    @Query("""
    SELECT new com.shivam.payload.StoreAnalysis.TimeSeriesPointDTO(
        o.createdAt,
        SUM(o.totalAmount)
    )
    FROM Order o
    WHERE o.branch.store.storeAdmin.id = :storeAdminId
     AND o.createdAt BETWEEN :start AND :end
    GROUP BY o.createdAt
    ORDER BY o.createdAt
""")
    List<TimeSeriesPointDTO> getDailySales(@Param("storeAdminId") Long storeAdminId,
                                           @Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);


    @Query("""
        SELECT new com.shivam.payload.StoreAnalysis.PaymentInsightDTO(
            o.paymentType,
            SUM(o.totalAmount)
        )
        FROM Order o
        WHERE o.branch.store.storeAdmin.id = :storeAdminId
        GROUP BY o.paymentType
    """)
    List<PaymentInsightDTO> getSalesByPaymentMethod(@Param("storeAdminId") Long storeAdminId);

    @Query("""
        SELECT new com.shivam.payload.StoreAnalysis.BranchSalesDTO(
            o.branch.name,
            SUM(o.totalAmount)
        )
        FROM Order o
        WHERE o.branch.store.storeAdmin.id = :storeAdminId
        GROUP BY o.branch.id
    """)
    List<BranchSalesDTO> getSalesByBranch(@Param("storeAdminId") Long storeAdminId);


    // --- NEW: Recent sales with pageable support ---
    @Query("""
        SELECT new com.shivam.payload.StoreAnalysis.RecentSaleDTO(
            o.branch.name,
            o.totalAmount,
            o.createdAt
        )
        FROM Order o
        WHERE o.branch.store.storeAdmin.id = :storeAdminId
        ORDER BY o.createdAt DESC
    """)
    List<RecentSaleDTO> findRecentSalesByStoreAdmin(@Param("storeAdminId") Long storeAdminId, Pageable pageable);
    // --- END NEW ---
    // ... other methods ...

    // --- START: ADD THESE METHODS ---

    @Query("SELECT COUNT(o) FROM Order o WHERE o.branch.id = :branchId")
    long countByBranch_Id(@Param("branchId") Long branchId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.customer.id = :customerId AND o.branch.id = :branchId")
    long countOrdersByCustomerAndBranch(@Param("customerId") Long customerId, @Param("branchId") Long branchId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.customer.id = :customerId AND o.branch.id = :branchId")
    Double sumTotalAmountByCustomerAndBranch(@Param("customerId") Long customerId, @Param("branchId") Long branchId);
// --- START: ADD THESE NEW QUERIES ---

    /**
     * Counts all orders placed today (since midnight) for a specific Store Admin.
     */
    @Query("""
        SELECT COUNT(o) 
        FROM Order o 
        WHERE o.branch.store.storeAdmin.id = :storeAdminId 
        AND o.createdAt >= :startOfDay
    """)
    Integer countOrdersTodayForStoreAdmin(
            @Param("storeAdminId") Long storeAdminId,
            @Param("startOfDay") LocalDateTime startOfDay);

    /**
     * Counts all orders placed yesterday for a specific Store Admin.
     */
    @Query("""
        SELECT COUNT(o) 
        FROM Order o 
        WHERE o.branch.store.storeAdmin.id = :storeAdminId 
        AND o.createdAt >= :startOfYesterday AND o.createdAt < :startOfToday
    """)
    Integer countOrdersYesterdayForStoreAdmin(
            @Param("storeAdminId") Long storeAdminId,
            @Param("startOfYesterday") LocalDateTime startOfYesterday,
            @Param("startOfToday") LocalDateTime startOfToday);

    /**
     * Sums all sales from today (since midnight) for a specific Store Admin.
     * This is needed to calculate Average Order Value (AOV).
     */
    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0.0) 
        FROM Order o 
        WHERE o.branch.store.storeAdmin.id = :storeAdminId 
        AND o.createdAt >= :startOfDay
    """)
    Double sumTotalSalesTodayForStoreAdmin(
            @Param("storeAdminId") Long storeAdminId,
            @Param("startOfDay") LocalDateTime startOfDay);

    /**
     * Counts the number of distinct cashiers who have made at least one sale today.
     * This is the "Active Cashiers" metric.
     */
    @Query("""
        SELECT COUNT(DISTINCT o.cashier.id) 
        FROM Order o 
        WHERE o.branch.store.storeAdmin.id = :storeAdminId 
        AND o.createdAt >= :startOfDay
    """)
    Integer countActiveCashiersTodayForStoreAdmin(
            @Param("storeAdminId") Long storeAdminId,
            @Param("startOfDay") LocalDateTime startOfDay);

    /**
     * Counts the number of distinct cashiers who made at least one sale yesterday.
     */
    @Query("""
        SELECT COUNT(DISTINCT o.cashier.id) 
        FROM Order o 
        WHERE o.branch.store.storeAdmin.id = :storeAdminId 
        AND o.createdAt >= :startOfYesterday AND o.createdAt < :startOfToday
    """)
    Integer countActiveCashiersYesterdayForStoreAdmin(
            @Param("storeAdminId") Long storeAdminId,
            @Param("startOfYesterday") LocalDateTime startOfYesterday,
            @Param("startOfToday") LocalDateTime startOfToday);

    // --- END: ADD THESE NEW QUERIES ---
    // --- END: ADD THESE METHODS ---

    // --- CORRECTED QUERY: Changed 'productName' to 'name' ---
    @Query("""
        SELECT oi.product.name, SUM(oi.quantity) as totalSold
        FROM Order o
        JOIN o.items oi
        WHERE o.branch.store.storeAdmin.id = :storeAdminId
        AND o.createdAt >= :startOfDay
        GROUP BY oi.product.name
        ORDER BY totalSold DESC
    """)
    List<Object[]> findTopSellingProductToday(
            @Param("storeAdminId") Long storeAdminId,
            @Param("startOfDay") LocalDateTime startOfDay,
            Pageable pageable
    );
}
