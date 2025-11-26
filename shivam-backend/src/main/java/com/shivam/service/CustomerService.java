// pos-backend/src/main/java/com/zosh/service/CustomerService.java
package com.shivam.service;

import java.util.List;
import com.shivam.exception.ResourceNotFoundException;
import com.shivam.modal.Customer;
import com.shivam.payload.dto.CustomerStatsDTO; // <-- START: ADD IMPORT


public interface CustomerService {

    Customer createCustomer(Customer customer);

    Customer updateCustomer(Long id, Customer customer) throws ResourceNotFoundException;

    void deleteCustomer(Long id) throws ResourceNotFoundException;

    Customer getCustomerById(Long id) throws ResourceNotFoundException;
    List<Customer> getCustomersByBranch(Long branchId);
    List<Customer> getAllCustomers();

    List<Customer> searchCustomer(String keyword);

    // --- START: NEW METHOD SIGNATURE ---
    Customer addLoyaltyPoints(Long customerId, Integer pointsToAdd) throws ResourceNotFoundException;
    CustomerStatsDTO getCustomerStats(Long branchId);
    // --- END: ADD THIS METHOD ---
}