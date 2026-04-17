package com.example.smart_campus_operations.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.smart_campus_operations.model.TicketAttachment;

@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

    // Get all attachments for a specific ticket
    List<TicketAttachment> findByTicketId(Long ticketId);

    // Count attachments for a ticket (to enforce max 3 limit)
    long countByTicketId(Long ticketId);
}