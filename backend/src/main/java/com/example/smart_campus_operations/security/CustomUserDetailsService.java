package com.example.smart_campus_operations.security;

import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
    log.debug("Loading user details for email={}", normalizedEmail);

    AppUser user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    log.debug("UserDetails resolved with dbEmail={} and role={}", user.getEmail(), user.getRole());

        return new User(
                user.getEmail(),
                user.getPassword() != null ? user.getPassword() : "", // Handle potential null for OAuth users
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
