package com.shivam.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.shivam.payload.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private String jwt;
    private String message;
    private String title;
    private UserDTO user;

    // --- START: Added Fields from Tax/Currency Fix ---
    // (Assuming these are already here from our previous fix)
    private Double taxRate;
    private String currency;
    // --- END: Added Fields ---

    // --- START: New Payment Toggle Fields ---
    private Boolean acceptsCash;
    private Boolean acceptsCard;
    private Boolean acceptsUpi;
    // --- END: New Payment Toggle Fields ---
}