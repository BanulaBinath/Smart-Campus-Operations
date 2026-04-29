package com.example.smart_campus_operations.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.smart_campus_operations.model.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Get all tickets by a specific user
    List<Ticket> findByCreatedBy(String createdBy);

    // Get all tickets assigned to a specific technician
    List<Ticket> findByAssignedTo(String assignedTo);

    // Get all tickets by status
    List<Ticket> findByStatus(String status);

    // Get all tickets by priority
    List<Ticket> findByPriority(String priority);

    @Modifying
    @Query("update Ticket t set t.createdBy = :newEmail where t.createdBy = :oldEmail")
    int replaceCreatedBy(@Param("oldEmail") String oldEmail, @Param("newEmail") String newEmail);

    @Modifying
    @Query("update Ticket t set t.assignedTo = :newEmail where t.assignedTo = :oldEmail")
    int replaceAssignedTo(@Param("oldEmail") String oldEmail, @Param("newEmail") String newEmail);
}