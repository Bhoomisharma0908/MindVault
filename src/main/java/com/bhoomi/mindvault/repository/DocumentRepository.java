package com.bhoomi.mindvault.repository;

import com.bhoomi.mindvault.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUserEmail(String email);

    List<Document> findByUserEmailAndFileNameContainingIgnoreCase(
            String email,
            String fileName
    );
}
