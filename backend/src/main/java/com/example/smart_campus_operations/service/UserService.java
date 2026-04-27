package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.*;
import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.entity.NotificationType;
import com.example.smart_campus_operations.exception.ResourceNotFoundException;
import com.example.smart_campus_operations.repository.UserRepository;
import com.example.smart_campus_operations.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        AppUser user = AppUser.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .provider("ADMIN_CREATED")
                .build();

        return mapToResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(UUID id) {
        return userRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public UserResponse updateProfile(Authentication auth, UpdateProfileRequest request) {
        UserResponse current = getCurrentUser(auth);
        AppUser user = userRepository.findById(current.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setName(request.getName());
        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        AppUser savedUser = userRepository.save(user);

        // Send notification
        notificationService.sendNotification(
                savedUser.getId(),
                NotificationType.PROFILE_UPDATED,
                "Your profile details have been successfully updated.",
                savedUser.getId(),
                "USER"
        );

        return mapToResponse(savedUser);
    }

    @Transactional
    public void deleteCurrentUser(Authentication auth) {
        UserResponse current = getCurrentUser(auth);
        userRepository.deleteById(current.id());
    }

    @Transactional
    public UserResponse updateUserRole(UUID id, UserRoleUpdateRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(request.role());
        return mapToResponse(userRepository.save(user));
    }

    public UserResponse getCurrentUser(Authentication auth) {
        if (auth == null) {
            throw new IllegalStateException("No authenticated user found");
        }
        
        String email;
        if (auth.getPrincipal() instanceof CustomOAuth2User oauthUser) {
            return mapToResponse(oauthUser.getAppUser());
        } else if (auth.getPrincipal() instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            email = auth.getName();
        }

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return mapToResponse(user);
    }

    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponse mapToResponse(AppUser user) {
        return new UserResponse(
                user.getId(), user.getEmail(), user.getName(),
                user.getProfilePicture(), user.getRole(), user.getProvider()
        );
    }
}
