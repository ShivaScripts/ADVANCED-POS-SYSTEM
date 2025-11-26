// pos-backend/src/main/java/com/zosh/controller/CustomerController.java
package com.shivam.controller;

import com.shivam.exception.ResourceNotFoundException;
import com.shivam.modal.Customer;
import com.shivam.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shivam.payload.dto.CustomerStatsDTO;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<Customer> create(
            @RequestBody Customer customer) {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(
            @PathVariable Long id,
            @RequestBody Customer customer
    ) throws ResourceNotFoundException {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id
    ) throws ResourceNotFoundException {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(
            @PathVariable Long id
    ) throws ResourceNotFoundException {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAll() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // --- START: NEW ENDPOINT ---
    @PutMapping("/{id}/add-points")
    public ResponseEntity<Customer> addPoints(
            @PathVariable Long id,
            @RequestParam Integer pointsToAdd
    ) throws ResourceNotFoundException {
        Customer updatedCustomer = customerService.addLoyaltyPoints(id, pointsToAdd);
        return ResponseEntity.ok(updatedCustomer);
    }

    // --- DUPLICATE METHOD REMOVED ---

    // --- START: ADD THIS NEW ENDPOINT ---
    @GetMapping("/branch/{branchId}/stats")
    @PreAuthorize("hasAnyAuthority('ROLE_BRANCH_MANAGER', 'ROLE_BRANCH_ADMIN')")
    public ResponseEntity<CustomerStatsDTO> getCustomerStats(
            @PathVariable Long branchId
    ) {
        CustomerStatsDTO stats = customerService.getCustomerStats(branchId);
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyAuthority('ROLE_BRANCH_MANAGER', 'ROLE_BRANCH_ADMIN')")
    public ResponseEntity<List<Customer>> getBranchCustomers(
            @PathVariable Long branchId
    ) {
        List<Customer> customers = customerService.getCustomersByBranch(branchId);
        return ResponseEntity.ok(customers);
    }

}