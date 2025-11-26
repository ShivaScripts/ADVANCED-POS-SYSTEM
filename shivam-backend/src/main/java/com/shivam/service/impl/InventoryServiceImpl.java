package com.shivam.service.impl;


import com.shivam.exception.UserException;
import com.shivam.mapper.InventoryMapper;
import com.shivam.modal.Branch;
import com.shivam.modal.Inventory;
import com.shivam.modal.Product;
import com.shivam.payload.dto.InventoryDTO;
import com.shivam.repository.BranchRepository;
import com.shivam.repository.InventoryRepository;
import com.shivam.repository.ProductRepository;
import com.shivam.util.SecurityUtil;
import com.shivam.service.InventoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional; // <-- Added Import
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger; // <-- Added Import
import org.slf4j.LoggerFactory; // <-- Added Import
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

// --- START: Additional imports for Excel export (added by AI) ---
import com.shivam.modal.Category;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
// --- END: Additional imports ---

@RequiredArgsConstructor
@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final SecurityUtil securityUtil;

    // --- ADDED LOGGER ---
    private static final Logger log = LoggerFactory.getLogger(InventoryServiceImpl.class);
    // --- END ---

    @Override
    public InventoryDTO createInventory(InventoryDTO dto) throws AccessDeniedException, UserException {
        Branch branch = branchRepository.findById(dto.getBranchId())
                .orElseThrow(() -> new EntityNotFoundException("Branch not found"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

//        securityUtil.checkAuthority(branch);

        // Check if inventory already exists for this product/branch before creating
        Inventory existing = inventoryRepository.findByProductIdAndBranchId(dto.getProductId(), dto.getBranchId());
        if (existing != null) {
            log.warn("Inventory already exists for product {} in branch {}. Updating quantity instead.", dto.getProductId(), dto.getBranchId());
            existing.setQuantity(existing.getQuantity() + dto.getQuantity());
            return InventoryMapper.toDto(inventoryRepository.save(existing));
        }

        Inventory inventory = InventoryMapper.toEntity(dto, branch, product);
        return InventoryMapper.toDto(inventoryRepository.save(inventory));
    }

    @Override
    public InventoryDTO updateInventory(Long id, InventoryDTO dto) throws AccessDeniedException, UserException {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found"));

//        securityUtil.checkAuthority(inventory);

        inventory.setQuantity(dto.getQuantity());
        return InventoryMapper.toDto(inventoryRepository.save(inventory));
    }

    @Override
    public void deleteInventory(Long id) throws AccessDeniedException, UserException {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found"));

        securityUtil.checkAuthority(inventory);

        inventoryRepository.delete(inventory);
    }

    @Override
    public InventoryDTO getInventoryById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inventory not found"));

        return InventoryMapper.toDto(inventory);
    }

    @Override
    public List<InventoryDTO> getInventoryByBranch(Long branchId) {
        return inventoryRepository.findByBranchId(branchId)
                .stream()
                .map(InventoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryDTO getInventoryByProductId(Long productId) {
        // Note: This still returns the first inventory found for a product,
        // which might not be specific enough in a multi-branch system.
        Inventory inventory = inventoryRepository.findByProductId(productId);
        if (inventory == null) {
            throw new EntityNotFoundException("Inventory not found for product ID: " + productId);
        }
        return InventoryMapper.toDto(inventory);
    }

    // --- ADDED THIS METHOD ---
    @Override
    @Transactional
    public void updateStock(Long productId, Long branchId, int quantityChange) {
        log.info("Updating stock for product {} in branch {}: Change by {}", productId, branchId, quantityChange);

        Inventory inventory = inventoryRepository.findByProductIdAndBranchId(productId, branchId);

        if (inventory == null) {
            log.warn("No inventory record found for product {} and branch {}. Cannot update stock.", productId, branchId);
            // Consider throwing an exception or creating the inventory record if appropriate
            // throw new ResourceNotFoundException("Inventory not found for product " + productId + " in branch " + branchId);
            return; // Exit if no inventory record exists
        }

        int currentQuantity = inventory.getQuantity() != null ? inventory.getQuantity() : 0; // Handle potential null
        int newQuantity = currentQuantity + quantityChange; // quantityChange is negative for sales, positive for refunds

        if (newQuantity < 0) {
            log.warn("Oversell detected or invalid negative quantity for product {} in branch {}. Setting stock to 0.", productId, branchId);
            newQuantity = 0; // Prevent negative stock
        }

        inventory.setQuantity(newQuantity);
        inventoryRepository.save(inventory); // Save the updated inventory
        log.info("Successfully updated stock for product {} in branch {}. New quantity: {}", productId, branchId, newQuantity);
    }
    // --- END ---

    // --- START: ADD THIS NEW METHOD ---
    @Override
    public ByteArrayInputStream exportInventoryToExcel(Long branchId) {
        // 1. Fetch data
        List<Inventory> inventories = inventoryRepository.findByBranchId(branchId);

        // 2. Define headers
        String[] HEADERS = {"SKU", "Product Name", "Category", "Quantity", "Last Updated"};
        String SHEET = "Inventory";

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = workbook.createSheet(SHEET);

            // 3. Create Header Row
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
            }

            // 4. Create Data Rows
            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            for (Inventory inventory : inventories) {
                Row row = sheet.createRow(rowIdx++);

                Product product = inventory.getProduct();
                Category category = (product != null) ? product.getCategory() : null;

                row.createCell(0).setCellValue(product != null ? product.getSku() : "N/A");
                row.createCell(1).setCellValue(product != null ? product.getName() : "N/A");
                row.createCell(2).setCellValue(category != null ? category.getName() : "Uncategorized");
                row.createCell(3).setCellValue(inventory.getQuantity() != null ? inventory.getQuantity() : 0);
                row.createCell(4).setCellValue(inventory.getLastUpdated() != null ? inventory.getLastUpdated().format(formatter) : "");
            }

            // 5. Auto-size columns
            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 6. Write to output stream and return
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            log.error("Failed to export inventory to Excel", e);
            throw new RuntimeException("Failed to export inventory to Excel: " + e.getMessage());
        }
    }
    // --- END: ADD THIS NEW METHOD ---
}
