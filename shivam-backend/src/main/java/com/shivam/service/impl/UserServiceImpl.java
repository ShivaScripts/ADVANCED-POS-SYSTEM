package com.shivam.service.impl;

import com.shivam.configrations.JwtProvider;
import com.shivam.domain.UserRole;
import com.shivam.exception.UserException;
import com.shivam.modal.User;
import com.shivam.repository.BranchRepository;
import com.shivam.repository.PasswordResetTokenRepository;
import com.shivam.repository.StoreRepository;
import com.shivam.repository.UserRepository;
import com.shivam.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    public User getUserByEmail(String email) throws UserException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }
        return user;
    }

    @Override
    public User getUserFromJwtToken(String jwt) throws UserException {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user == null) throw new UserException("user not exist with email " + email);
        return user;
    }

    // --- START: ADDED MISSING METHOD ---
    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {
        // This simply calls your existing logic to extract the user from the token
        return getUserFromJwtToken(jwt);
    }
    // --- END: ADDED MISSING METHOD ---

    @Override
    public User getUserById(Long id) throws UserException {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public Set<User> getUserByRole(UserRole role) throws UserException {
        return userRepository.findByRole(role);
    }

    @Override
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User not found");
        }
        return user;
    }

    @Override
    public List<User> getUsers() throws UserException {
        return userRepository.findAll();
    }
}