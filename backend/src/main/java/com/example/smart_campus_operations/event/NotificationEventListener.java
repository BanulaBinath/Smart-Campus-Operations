package com.example.smart_campus_operations.event;

import com.example.smart_campus_operations.entity.NotificationType;
import com.example.smart_campus_operations.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    @Async
    @EventListener
    public void handleBookingStatusChanged(BookingStatusChangedEvent event) {
        log.info("Handling booking status changed event for booking: {}", event.bookingId());
        NotificationType type = event.newStatus().equalsIgnoreCase("APPROVED") 
                ? NotificationType.BOOKING_APPROVED 
                : NotificationType.BOOKING_REJECTED;
        
        String message = "Your booking request " + event.bookingId() + " has been " + event.newStatus().toLowerCase() + ".";
        
        notificationService.sendNotification(event.userId(), type, message, event.bookingId(), "BOOKING");
    }

    @Async
    @EventListener
    public void handleTicketStatusChanged(TicketStatusChangedEvent event) {
        log.info("Handling ticket status changed event for ticket: {}", event.ticketId());
        String message = "Your ticket " + event.ticketId() + " status is now " + event.newStatus().toLowerCase() + ".";
        
        notificationService.sendNotification(event.userId(), NotificationType.TICKET_STATUS_CHANGED, message, event.ticketId(), "TICKET");
        
        if (event.assignedTo() != null) {
            String assignMsg = "A new ticket " + event.ticketId() + " has been assigned to you.";
            notificationService.sendNotification(event.assignedTo(), NotificationType.TICKET_ASSIGNED, assignMsg, event.ticketId(), "TICKET");
        }
    }

    @Async
    @EventListener
    public void handleNewComment(NewCommentEvent event) {
        log.info("Handling new comment event for ticket: {}", event.ticketId());
        String message = event.commenterName() + " commented on your ticket " + event.ticketId() + ".";
        
        notificationService.sendNotification(event.ticketOwnerId(), NotificationType.NEW_COMMENT, message, event.ticketId(), "TICKET");
    }
}
