package com.shivam.service;

import com.shivam.exception.UserException;
import com.shivam.payload.dto.UserDTO;
import com.shivam.payload.response.AuthResponse;

public interface AuthService {
    AuthResponse login(String username, String password) throws UserException;
    AuthResponse signup(UserDTO req) throws UserException;

    void createPasswordResetToken(String email) throws UserException;
    void resetPassword(String token, String newPassword);
}
