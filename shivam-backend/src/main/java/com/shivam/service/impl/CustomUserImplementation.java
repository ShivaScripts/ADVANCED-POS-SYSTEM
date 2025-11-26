package com.shivam.service.impl;

import com.shivam.modal.User;
import com.shivam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.shivam.domain.UserRole; // <-- START: ADD THIS IMPORT

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserImplementation implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(username);

        if (user == null) {
            throw new UsernameNotFoundException("user doesn't exist with email " + username);
        }

        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().toString());
        Collection<? extends GrantedAuthority> authorities = Collections.singletonList(authority);

        // --- START: FIX ---
        // By default, assume the user is enabled
        boolean isEnabled = true;

        // Only check the 'verified' flag for employee roles
        if (user.getRole() == UserRole.ROLE_BRANCH_MANAGER || user.getRole() == UserRole.ROLE_BRANCH_CASHIER) {
            isEnabled = user.getVerified();
        }

        // Admins (like ROLE_STORE_ADMIN) will always have isEnabled = true

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                isEnabled, // Use our new 'isEnabled' logic
                true,
                true,
                true,
                authorities
        );
        // --- END: FIX ---
    }
}