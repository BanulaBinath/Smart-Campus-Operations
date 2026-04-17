package com.example.smart_campus_operations.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.smart_campus_operations.model.Ticket;
import com.example.smart_campus_operations.repo.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public List<Ticket> getTicketsByUser(String createdBy) {
        return ticketRepository.findByCreatedBy(createdBy);
    }

    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public Ticket updateStatus(Long id, String status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public Ticket assignTicket(Long id, String assignedTo) {
        Ticket ticket = getTicketById(id);
        ticket.setAssignedTo(assignedTo);
        return ticketRepository.save(ticket);
    }

    public Ticket rejectTicket(Long id, String reason) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus("REJECTED");
        ticket.setRejectionReason(reason);
        return ticketRepository.save(ticket);
    }

    public Ticket resolveTicket(Long id, String notes) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus("RESOLVED");
        ticket.setResolutionNotes(notes);
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }
}