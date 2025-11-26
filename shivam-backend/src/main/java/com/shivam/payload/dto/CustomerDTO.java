// In com.shivam.payload.dto package
package com.shivam.payload.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    // Add other fields you might need
}