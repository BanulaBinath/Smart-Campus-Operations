package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.entity.Notification;
import com.example.smart_campus_operations.entity.NotificationType;
import com.example.smart_campus_operations.dto.NotificationResponse;
import com.example.smart_campus_operations.dto.UnreadCountResponse;
import com.example.smart_campus_operations.exception.ResourceNotFoundException;
import com.example.smart_campus_operations.repository.NotificationRepository;
import com.example.smart_campus_operations.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.smart_campus_operations.entity.Role;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void sendNotification(UUID recipientId, NotificationType type, String message, UUID referenceId, String referenceType) {
        AppUser recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public void sendNotificationByEmail(String recipientEmail, NotificationType type, String message, Long referenceId, String referenceType) {
        AppUser recipient = userRepository.findByEmail(recipientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with email: " + recipientEmail));

        UUID referenceUuid = referenceId != null ? UUID.nameUUIDFromBytes(referenceId.toString().getBytes()) : null;

        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .referenceId(referenceUuid)
                .referenceType(referenceType)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public void sendNotificationToRole(Role role, NotificationType type, String message, UUID referenceId, String referenceType) {
        List<AppUser> users = userRepository.findAllByRole(role);
        for (AppUser recipient : users) {
             Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .build();
             notificationRepository.save(notification);
        }
    }

    public List<NotificationResponse> getNotificationsForUser(UUID userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UnreadCountResponse getUnreadCount(UUID userId) {
        return new UnreadCountResponse(notificationRepository.countByRecipientIdAndReadFalse(userId));
    }

    @Transactional
    public void markAsRead(UUID notificationId, UUID requestingUserId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(requestingUserId)) {
            throw new IllegalStateException("You cannot mark someone else's notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllReadByRecipientId(userId);
    }

    @Transactional
    public void deleteNotification(UUID notificationId, UUID requestingUserId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(requestingUserId)) {
            throw new IllegalStateException("You cannot delete someone else's notification");
        }

        notificationRepository.delete(notification);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getType(), n.getMessage(), n.isRead(),
                n.getReferenceId(), n.getReferenceType(), n.getCreatedAt()
        );
    }
}
