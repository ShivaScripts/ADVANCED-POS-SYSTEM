package com.shivam.mapper;

import com.shivam.modal.Store; // <-- Add Import
import com.shivam.modal.User;
import com.shivam.payload.response.AuthResponse;

public class AuthResponseMapper {

    public static AuthResponse toDto(User user, String jwt) {
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setUser(UserMapper.toDTO(user));

        // --- START: Add Store Info (from Tax/Currency fix AND new toggles) ---
        // Find the store, whether user is admin or employee
        Store userStore = user.getStore();
        if (userStore == null && user.getBranch() != null) {
            userStore = user.getBranch().getStore();
        }

        // If we found a store, add its settings to the auth response
        if (userStore != null) {
            // From previous fix
            authResponse.setTaxRate(userStore.getTaxRate());
            authResponse.setCurrency(userStore.getCurrency());

            // --- New Payment Toggles ---
            authResponse.setAcceptsCash(userStore.getAcceptsCash());
            authResponse.setAcceptsCard(userStore.getAcceptsCard());
            authResponse.setAcceptsUpi(userStore.getAcceptsUpi());
            // --- End New Payment Toggles ---

        } else {
            // Default values if no store is found (e.g., for ROLE_ADMIN)
            authResponse.setTaxRate(0.0);
            authResponse.setCurrency("USD");
            authResponse.setAcceptsCash(true); // Default to true
            authResponse.setAcceptsCard(true); // Default to true
            authResponse.setAcceptsUpi(true);  // Default to true
        }
        // --- END: Add Store Info ---

        return authResponse;
    }
}