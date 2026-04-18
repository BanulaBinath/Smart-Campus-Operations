package com.example.smart_campus_operations.controller;

import com.example.smart_campus_operations.dto.NotificationResponse;
import com.example.smart_campus_operations.dto.UnreadCountResponse;
import com.example.smart_campus_operations.service.NotificationService;
import com.example.smart_campus_operations.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        UUID userId = userService.getCurrentUser(authentication).id();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(Authentication authentication) {
        UUID userId = userService.getCurrentUser(authentication).id();
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id, Authentication authentication) {
        UUID userId = userService.getCurrentUser(authentication).id();
        notificationService.markAsRead(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        UUID userId = userService.getCurrentUser(authentication).id();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable UUID id, Authentication authentication) {
        UUID userId = userService.getCurrentUser(authentication).id();
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build();
    }
}

