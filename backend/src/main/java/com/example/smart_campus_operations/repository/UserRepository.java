package com.example.smart_campus_operations.repository;

import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByProviderId(String providerId);
    List<AppUser> findAllByRole(Role role);
}
