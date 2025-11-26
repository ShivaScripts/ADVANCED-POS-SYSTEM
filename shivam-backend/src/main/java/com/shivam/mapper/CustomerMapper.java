// In com.shivam.mapper package
package com.shivam.mapper;

import com.shivam.modal.Customer;
import com.shivam.payload.dto.CustomerDTO;

public class CustomerMapper {

    public static CustomerDTO toDto(Customer customer) {
        if (customer == null) {
            return null;
        }
        return CustomerDTO.builder()
                .id(customer.getId())
                .fullName(customer.getFullName()) // Make sure Customer entity has getFullName()
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .build();
    }

    // Optional: toEntity method if needed elsewhere
    public static Customer toEntity(CustomerDTO dto) {
        if (dto == null) {
            return null;
        }
        Customer customer = new Customer(); // Or use builder if available
        customer.setId(dto.getId());
        customer.setFullName(dto.getFullName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        return customer;
    }
}