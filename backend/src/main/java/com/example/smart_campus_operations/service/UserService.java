package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.dto.UserResponse;
import com.example.smart_campus_operations.dto.UserRoleUpdateRequest;
import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.exception.ResourceNotFoundException;
import com.example.smart_campus_operations.repository.UserRepository;
import com.example.smart_campus_operations.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
    public UserResponse updateUserRole(UUID id, UserRoleUpdateRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(request.role());
        return mapToResponse(userRepository.save(user));
    }

    public UserResponse getCurrentUser(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof CustomOAuth2User oauthUser)) {
            throw new IllegalStateException("No authenticated user found");
        }
        return mapToResponse(oauthUser.getAppUser());
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
                user.getProfilePicture(), user.getRole()
        );
    }
}
