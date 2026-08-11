package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.NoteRequestDTO;
import com.bhoomi.mindvault.dto.NoteResponseDTO;
import com.bhoomi.mindvault.entity.Note;
import com.bhoomi.mindvault.entity.User;
import com.bhoomi.mindvault.repository.NoteRepository;
import com.bhoomi.mindvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    // Get currently logged-in user's email
    private String getLoggedInUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }

    // Create Note
    @Override
    public NoteResponseDTO createNote(NoteRequestDTO dto) {

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Note note = new Note();

        note.setTitle(dto.getTitle());
        note.setContent(dto.getContent());
        note.setCategory(dto.getCategory());
        note.setTags(dto.getTags());

        // Connect note with logged-in user
        note.setUser(user);

        Note savedNote = noteRepository.save(note);

        return new NoteResponseDTO(
                savedNote.getId(),
                savedNote.getTitle(),
                savedNote.getContent(),
                savedNote.getCategory(),
                savedNote.getTags()
        );
    }

    // Get all notes of logged-in user
    @Override
    public List<NoteResponseDTO> getAllNotes() {

        String email = getLoggedInUserEmail();

        List<Note> notes =
                noteRepository.findByUserEmail(email);

        List<NoteResponseDTO> response = new ArrayList<>();

        for (Note note : notes) {

            response.add(new NoteResponseDTO(
                    note.getId(),
                    note.getTitle(),
                    note.getContent(),
                    note.getCategory(),
                    note.getTags()
            ));
        }

        return response;
    }

    // Get one note
    @Override
    public NoteResponseDTO getNoteById(Long id) {

        String email = getLoggedInUserEmail();

        Note note = noteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        // Make sure note belongs to logged-in user
        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not allowed to access this note");
        }

        return new NoteResponseDTO(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCategory(),
                note.getTags()
        );
    }

    // Update Note
    @Override
    public NoteResponseDTO updateNote(Long id, NoteRequestDTO dto) {

        String email = getLoggedInUserEmail();

        Note note = noteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        // Make sure note belongs to logged-in user
        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not allowed to update this note");
        }

        note.setTitle(dto.getTitle());
        note.setContent(dto.getContent());
        note.setCategory(dto.getCategory());
        note.setTags(dto.getTags());

        Note updatedNote = noteRepository.save(note);

        return new NoteResponseDTO(
                updatedNote.getId(),
                updatedNote.getTitle(),
                updatedNote.getContent(),
                updatedNote.getCategory(),
                updatedNote.getTags()
        );
    }

    // Delete Note
    @Override
    public void deleteNote(Long id) {

        String email = getLoggedInUserEmail();

        Note note = noteRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Note not found"));

        // Make sure note belongs to logged-in user
        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not allowed to delete this note");
        }

        noteRepository.delete(note);
    }

    // Search Notes
    @Override
    public List<NoteResponseDTO> searchNotes(String keyword) {

        String email = getLoggedInUserEmail();

        List<Note> notes =
                noteRepository.findByUserEmailAndTitleContainingIgnoreCase(
                        email,
                        keyword
                );

        List<NoteResponseDTO> response = new ArrayList<>();

        for (Note note : notes) {

            response.add(new NoteResponseDTO(
                    note.getId(),
                    note.getTitle(),
                    note.getContent(),
                    note.getCategory(),
                    note.getTags()
            ));
        }

        return response;
    }
}
