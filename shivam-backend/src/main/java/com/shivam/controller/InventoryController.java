package com.shivam.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayInputStream;
import com.shivam.exception.UserException;
import com.shivam.payload.dto.InventoryDTO;
import com.shivam.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/inventories")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    @PreAuthorize("hasAuthority('STORE_MANAGER')")
    public ResponseEntity<InventoryDTO> create(@RequestBody InventoryDTO dto) throws AccessDeniedException, UserException {
        return ResponseEntity.ok(inventoryService.createInventory(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('STORE_MANAGER')")
    public ResponseEntity<InventoryDTO> update(@PathVariable Long id,
                                               @RequestBody InventoryDTO dto) throws AccessDeniedException, UserException {
        return ResponseEntity.ok(inventoryService.updateInventory(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('STORE_MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws AccessDeniedException, UserException {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<InventoryDTO> getInventoryByProduct(
            @PathVariable Long productId) {
        return ResponseEntity.ok(
                inventoryService.getInventoryByProductId(productId)
        );
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<InventoryDTO>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(inventoryService.getInventoryByBranch(branchId));
    }
    // ... inside InventoryController class, after getByBranch()

    // --- START: ADD THIS NEW ENDPOINT ---
    @GetMapping("/branch/{branchId}/export")
    @PreAuthorize("hasAnyAuthority('ROLE_BRANCH_MANAGER', 'ROLE_BRANCH_ADMIN', 'ROLE_STORE_MANAGER', 'ROLE_STORE_ADMIN')")
    public ResponseEntity<InputStreamResource> exportInventory(
            @PathVariable Long branchId
    ) {
        String filename = "inventory_branch_" + branchId + "_" + java.time.LocalDate.now() + ".xlsx";
        ByteArrayInputStream in = inventoryService.exportInventoryToExcel(branchId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + filename);

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
    // --- END: ADD THIS NEW ENDPOINT ---


}

