package com.example.smart_campus_operations.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.smart_campus_operations.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a specific ticket
    List<Comment> findByTicketId(Long ticketId);
}