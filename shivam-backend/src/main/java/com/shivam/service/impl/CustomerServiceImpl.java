// pos-backend/src/main/java/com/zosh/service/impl/CustomerServiceImpl.java
package com.shivam.service.impl;


import com.shivam.exception.ResourceNotFoundException;
import com.shivam.modal.Customer;
import com.shivam.repository.CustomerRepository;
import com.shivam.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Import this
import com.shivam.payload.dto.CustomerStatsDTO; // <-- START: ADD IMPORT
import com.shivam.repository.OrderRepository; // <-- START: ADD IMPORT

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customerData) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Customer not found with id " + id));

        customer.setFullName(customerData.getFullName());
        customer.setEmail(customerData.getEmail());
        customer.setPhone(customerData.getPhone());

        return customerRepository.save(customer);
    }
    @Override
    public List<Customer> getCustomersByBranch(Long branchId) {
        return customerRepository.findCustomersByBranch(branchId);
    }

    @Override
    public void deleteCustomer(Long id) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        customerRepository.delete(customer);
    }

    @Override
    public Customer getCustomerById(Long id) throws ResourceNotFoundException {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public List<Customer> searchCustomer(String keyword) {
        return customerRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
    }

    // --- START: NEW METHOD IMPLEMENTATION ---
    @Override
    @Transactional // Ensures this is a database transaction
    public Customer addLoyaltyPoints(Long customerId, Integer pointsToAdd) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        if (pointsToAdd <= 0) {
            throw new IllegalArgumentException("Points to add must be positive.");
        }

        Integer currentPoints = customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0;
        customer.setLoyaltyPoints(currentPoints + pointsToAdd);

        // We don't need to save here, @Transactional will handle it.
        // But for clarity, we can save and return.
        return customerRepository.save(customer);
    }
    @Override
    public CustomerStatsDTO getCustomerStats(Long branchId) {
        // 1. Get all unique customers for this branch
        List<Customer> customers = customerRepository.findCustomersByBranch(branchId);
        long totalCustomers = customers.size();

        // 2. Get total orders for this branch
        long totalOrders = orderRepository.countByBranch_Id(branchId);

        // 3. Calculate Gold Members based on your rules
        long goldMembers = 0;
        for (Customer customer : customers) {
            long customerOrders = orderRepository.countOrdersByCustomerAndBranch(customer.getId(), branchId);
            Double customerSpent = orderRepository.sumTotalAmountByCustomerAndBranch(customer.getId(), branchId);

            // Handle null spending
            double totalSpent = (customerSpent != null) ? customerSpent : 0.0;

            // Apply Gold Member logic: > 20 orders OR > 50k spent
            if (customerOrders > 20 || totalSpent > 50000) {
                goldMembers++;
            }
        }

        // 4. Calculate Average Orders (and prevent NaN)
        double avgOrdersPerCustomer = 0.0;
        if (totalCustomers > 0) {
            // Use totalOrders (all orders at branch) / totalUniqueCustomers
            avgOrdersPerCustomer = (double) totalOrders / totalCustomers;
        }

        // 5. Return the DTO
        return new CustomerStatsDTO(totalCustomers, goldMembers, avgOrdersPerCustomer);
    }
    // --- END: ADD THIS NEW METHOD ---

    // --- END: NEW METHOD IMPLEMENTATION ---
}