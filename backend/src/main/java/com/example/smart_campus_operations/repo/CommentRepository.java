package com.example.smart_campus_operations.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.smart_campus_operations.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a specific ticket
    List<Comment> findByTicketId(Long ticketId);

    @Modifying
    @Query("update Comment c set c.createdBy = :newEmail where c.createdBy = :oldEmail")
    int replaceCreatedBy(@Param("oldEmail") String oldEmail, @Param("newEmail") String newEmail);
}