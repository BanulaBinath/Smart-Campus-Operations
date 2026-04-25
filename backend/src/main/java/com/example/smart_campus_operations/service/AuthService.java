package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.AuthResponse;
import com.example.smart_campus_operations.dto.LoginRequest;
import com.example.smart_campus_operations.dto.RegisterRequest;
import com.example.smart_campus_operations.dto.UserResponse;
import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.entity.Role;
import com.example.smart_campus_operations.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

        private static final Logger log = LoggerFactory.getLogger(AuthService.class);
        private static final String DEFAULT_ADMIN_EMAIL = "banulabinath.edu@gmail.com";
        private static final String DEFAULT_ADMIN_PASSWORD = "@Banula123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        AppUser user = AppUser.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Default role
                .provider("LOCAL")
                .build();

        AppUser savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .message("User registered successfully")
                .user(mapToUserResponse(savedUser))
                .build();
    }

        @Transactional
        public AuthResponse login(LoginRequest request, HttpServletRequest servletRequest, HttpServletResponse servletResponse) {
        String loginEmail = normalizeEmail(request.getEmail());
        log.debug("Login request received for email={}", loginEmail);

        AppUser user = userRepository.findByEmailIgnoreCase(loginEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        log.debug("User lookup result: found=true, dbEmail={}", user.getEmail());

                String storedPassword = user.getPassword();
                if (storedPassword == null || storedPassword.isBlank()) {
            throw new BadCredentialsException("Invalid email or password");
        }

        log.debug("Stored password from database for {}: {}", user.getEmail(), storedPassword);
        log.debug("Password format detected for {}: {}", user.getEmail(), detectPasswordFormat(storedPassword));

                if (!isBcryptHash(storedPassword)) {
                        if (DEFAULT_ADMIN_EMAIL.equalsIgnoreCase(user.getEmail()) && DEFAULT_ADMIN_PASSWORD.equals(storedPassword)) {
                                user.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
                                user = userRepository.saveAndFlush(user);
                                storedPassword = user.getPassword();
                                log.debug("Plaintext admin password migrated to BCrypt for {}", user.getEmail());
                        } else if (!request.getPassword().equals(storedPassword)) {
                                throw new BadCredentialsException("Invalid email or password");
                        } else {
                                user.setPassword(passwordEncoder.encode(request.getPassword()));
                                user = userRepository.saveAndFlush(user);
                                storedPassword = user.getPassword();
                                log.debug("Legacy plaintext password migrated to BCrypt for {}", user.getEmail());
                        }
                }

                if (!passwordEncoder.matches(request.getPassword(), storedPassword)) {
                        throw new BadCredentialsException("Invalid email or password");
                }

        log.debug("Calling authenticationManager.authenticate for email={}", loginEmail);

                Authentication authentication;
                try {
                        authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        loginEmail,
                                                        request.getPassword()
                                        )
                        );
                } catch (AuthenticationException ex) {
                        log.warn("Authentication failed for email={}: {}", loginEmail, ex.getClass().getSimpleName());
                        throw new BadCredentialsException("Invalid email or password");
                }

        var context = SecurityContextHolder.getContext();
        context.setAuthentication(authentication);
        securityContextRepository.saveContext(context, servletRequest, servletResponse);

        return AuthResponse.builder()
                .message("Login successful")
                .user(mapToUserResponse(user))
                .build();
    }

        private boolean isBcryptHash(String value) {
                return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
        }

        private String detectPasswordFormat(String value) {
                if (isBcryptHash(value)) {
                        return "BCRYPT";
                }
                return "PLAINTEXT_OR_UNKNOWN";
        }

        private String normalizeEmail(String email) {
                return email == null ? "" : email.trim().toLowerCase();
        }

    private UserResponse mapToUserResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getProfilePicture(),
                user.getRole(),
                user.getProvider()
        );
    }
}
