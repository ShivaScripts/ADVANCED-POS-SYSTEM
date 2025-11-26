package com.shivam.repository;

import com.shivam.modal.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Inventory findByProductId(Long productId);
    List<Inventory> findByBranchId(Long branchId);

    @Query("""
        SELECT COUNT(i)
        FROM Inventory i
        JOIN i.product p
        WHERE i.branch.id = :branchId
        AND i.quantity < 100
    """)
    int countLowStockItems(@Param("branchId") Long branchId);

    // --- ADDED THIS METHOD ---
    Inventory findByProductIdAndBranchId(Long productId, Long branchId);
    // --- END ---

}