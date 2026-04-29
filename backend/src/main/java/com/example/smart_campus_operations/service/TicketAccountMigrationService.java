package com.example.smart_campus_operations.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.smart_campus_operations.repo.CommentRepository;
import com.example.smart_campus_operations.repo.TicketRepository;

@Service
public class TicketAccountMigrationService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;

    public TicketAccountMigrationService(TicketRepository ticketRepository, CommentRepository commentRepository) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Map<String, Object> replaceEmails(Map<String, String> replacements) {
        if (replacements == null || replacements.isEmpty()) {
            throw new IllegalArgumentException("replacements must not be empty");
        }

        int ticketsCreatedByUpdated = 0;
        int ticketsAssignedToUpdated = 0;
        int commentsCreatedByUpdated = 0;

        for (Map.Entry<String, String> entry : replacements.entrySet()) {
            String oldEmail = entry.getKey();
            String newEmail = entry.getValue();

            if (oldEmail == null || oldEmail.isBlank() || newEmail == null || newEmail.isBlank()) {
                continue;
            }

            ticketsCreatedByUpdated += ticketRepository.replaceCreatedBy(oldEmail, newEmail);
            ticketsAssignedToUpdated += ticketRepository.replaceAssignedTo(oldEmail, newEmail);
            commentsCreatedByUpdated += commentRepository.replaceCreatedBy(oldEmail, newEmail);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ticketsCreatedByUpdated", ticketsCreatedByUpdated);
        result.put("ticketsAssignedToUpdated", ticketsAssignedToUpdated);
        result.put("commentsCreatedByUpdated", commentsCreatedByUpdated);
        return result;
    }
}
