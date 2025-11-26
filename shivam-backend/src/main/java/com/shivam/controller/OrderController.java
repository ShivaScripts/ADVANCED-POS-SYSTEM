package com.shivam.controller;

import com.shivam.domain.OrderStatus;
import com.shivam.domain.PaymentType;
import com.shivam.exception.UserException;
import com.shivam.payload.dto.OrderDTO;
import com.shivam.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.List;
import java.time.LocalDateTime;

// --- START: Added imports for Excel download (added by AI) ---
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayInputStream;
import com.shivam.modal.User;
import com.shivam.service.UserService;
import java.util.Map;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    // ... [KEEP ALL EXISTING ENDPOINTS] ...

    @GetMapping("/analytics/trending")
    @PreAuthorize("hasAuthority('ROLE_STORE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getTrendingProduct(@RequestHeader("Authorization") String jwt) throws UserException {
        User admin = userService.findUserProfileByJwt(jwt);
        return ResponseEntity.ok(orderService.getTrendingProduct(admin.getId()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CASHIER')")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO dto) throws UserException {
        return ResponseEntity.ok(orderService.createOrder(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }


    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByBranch(
            @PathVariable Long branchId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long cashierId,
            @RequestParam(required = false) PaymentType paymentType,
            @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByBranch(
                        branchId,
                        customerId,
                        cashierId,
                        paymentType,
                        status
                )
        );
    }

    @GetMapping("/cashier/{cashierId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByCashier(
            @PathVariable Long cashierId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return ResponseEntity.ok(orderService.getOrdersByCashier(cashierId, from, to));
    }
    // --- END: Modify getOrdersByCashier endpoint ---

    @GetMapping("/today/branch/{branchId}")
    public ResponseEntity<List<OrderDTO>> getTodayOrders(@PathVariable Long branchId) {
        return ResponseEntity.ok(orderService.getTodayOrdersByBranch(branchId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDTO>> getCustomerOrders(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
    }

    @GetMapping("/recent/{branchId}")
    @PreAuthorize("hasAnyAuthority('ROLE_BRANCH_MANAGER', 'ROLE_BRANCH_ADMIN')")
    public ResponseEntity<List<OrderDTO>> getRecentOrders(@PathVariable Long branchId) {
        List<OrderDTO> recentOrders = orderService.getTop5RecentOrdersByBranchId(branchId);
        return ResponseEntity.ok(recentOrders);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_STORE_MANAGER') or hasAuthority('ROLE_STORE_ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // --- START: ADD THIS NEW ENDPOINT (added by AI) ---
    @GetMapping("/branch/{branchId}/export")
    @PreAuthorize("hasAnyAuthority('ROLE_BRANCH_MANAGER', 'ROLE_BRANCH_ADMIN', 'ROLE_STORE_MANAGER', 'ROLE_STORE_ADMIN')")
    public ResponseEntity<InputStreamResource> exportTransactions(
            @PathVariable Long branchId
    ) {
        String filename = "transactions_branch_" + branchId + "_" + java.time.LocalDate.now() + ".xlsx";
        ByteArrayInputStream in = orderService.exportTransactionsToExcel(branchId);

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
