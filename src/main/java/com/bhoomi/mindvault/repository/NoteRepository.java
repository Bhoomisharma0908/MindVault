package com.bhoomi.mindvault.repository;

import com.bhoomi.mindvault.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByTitleContainingIgnoreCase(String title);

    List<Note> findByUserEmail(String email);

    List<Note> findByUserEmailAndTitleContainingIgnoreCase(
            String email,
            String title
    );
}
