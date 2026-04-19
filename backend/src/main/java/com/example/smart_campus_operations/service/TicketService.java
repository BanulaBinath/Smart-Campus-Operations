package com.example.smart_campus_operations.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.smart_campus_operations.exception.BadRequestException;
import com.example.smart_campus_operations.exception.ResourceNotFoundException;
import com.example.smart_campus_operations.model.Ticket;
import com.example.smart_campus_operations.repo.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "OPEN",
            "IN_PROGRESS",
            "RESOLVED",
            "CLOSED"
    );

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public List<Ticket> getTicketsByUser(String createdBy) {
        return ticketRepository.findByCreatedBy(createdBy);
    }

    public List<Ticket> getTicketsByTechnician(String assignedTo) {
        return ticketRepository.findByAssignedTo(assignedTo);
    }

    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public Ticket updateStatus(Long id, String status) {
        if (status == null || !ALLOWED_STATUSES.contains(status)) {
            throw new BadRequestException(
                    "Invalid status value. Allowed values: OPEN, IN_PROGRESS, RESOLVED, CLOSED");
        }

        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket assignTicket(Long id, String assignedTo) {
        if (assignedTo == null || assignedTo.trim().isEmpty()) {
            throw new BadRequestException("Assigned technician name cannot be empty");
        }

        Ticket ticket = getTicketById(id);
        ticket.setAssignedTo(assignedTo);
        return ticketRepository.save(ticket);
    }

    public Ticket rejectTicket(Long id, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Rejection reason cannot be empty");
        }

        Ticket ticket = getTicketById(id);
        ticket.setStatus("REJECTED");
        ticket.setRejectionReason(reason);
        return ticketRepository.save(ticket);
    }

    public Ticket resolveTicket(Long id, String notes) {
        if (notes == null || notes.trim().isEmpty()) {
            throw new BadRequestException("Resolution notes cannot be empty");
        }

        Ticket ticket = getTicketById(id);
        ticket.setStatus("RESOLVED");
        ticket.setResolutionNotes(notes);
        return ticketRepository.save(ticket);
    }

    public Ticket closeTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus("CLOSED");
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }
}