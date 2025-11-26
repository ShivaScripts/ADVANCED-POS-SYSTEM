package com.shivam.configrations;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;

public class JwtValidator extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;

    public JwtValidator(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String jwt = request.getHeader(JwtConstant.JWT_HEADER);

        if (jwt != null) {
            try {
                // Handle "Bearer " prefix safely
                if (jwt.startsWith("Bearer ")) {
                    jwt = jwt.substring(7);
                }

                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
                Claims claims = Jwts.parser().verifyWith(key).build()
                        .parseSignedClaims(jwt).getPayload();

                String email = String.valueOf(claims.get("email"));

                // Load user to check status
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // Check if enabled (Verified)
                if (userDetails.isEnabled()) {
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userDetails.getUsername(),
                            null,
                            userDetails.getAuthorities()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // This specific error was being swallowed before!
                    throw new BadCredentialsException("User account is disabled (Not Verified)");
                }

            } catch (BadCredentialsException e) {
                // If we intentionally threw an error above, let it pass through!
                throw e;
            } catch (Exception e) {
                // For any other unknown error, PRINT IT so we can see it in the console
                System.out.println("🔴 JWT VALIDATION ERROR: " + e.getMessage());
                e.printStackTrace();
                throw new BadCredentialsException("Invalid token: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}