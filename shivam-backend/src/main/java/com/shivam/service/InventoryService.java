// pos-backend/src/main/java/com/zosh/service/InventoryService.java
package com.shivam.service;


import com.shivam.exception.UserException;
import com.shivam.payload.dto.InventoryDTO;

import java.io.ByteArrayInputStream; // <-- START: ADD THIS IMPORT
import java.nio.file.AccessDeniedException;
import java.util.List;

public interface InventoryService {
    InventoryDTO createInventory(InventoryDTO dto) throws AccessDeniedException, UserException;
    InventoryDTO updateInventory(Long id, InventoryDTO dto) throws AccessDeniedException, UserException;
    void deleteInventory(Long id) throws AccessDeniedException, UserException;
    InventoryDTO getInventoryById(Long id);
    InventoryDTO getInventoryByProductId(Long productId);
    List<InventoryDTO> getInventoryByBranch(Long branchId);

    // --- ADDED THIS METHOD ---
    void updateStock(Long productId, Long branchId, int quantityChange);
    // --- END ---

    // --- START: ADD THIS NEW METHOD ---
    ByteArrayInputStream exportInventoryToExcel(Long branchId);
    // --- END: ADD THIS NEW METHOD ---

}