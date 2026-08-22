package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.NoteRequestDTO;
import com.bhoomi.mindvault.dto.NoteResponseDTO;
import com.bhoomi.mindvault.entity.Collection;
import com.bhoomi.mindvault.entity.Note;
import com.bhoomi.mindvault.entity.User;
import com.bhoomi.mindvault.repository.CollectionRepository;
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

    @Autowired
    private CollectionRepository collectionRepository;

    // Get logged-in user's email
    private String getLoggedInUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }

    // Create Note
    @Override
    public NoteResponseDTO createNote(
            NoteRequestDTO requestDTO) {

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Note note = new Note();

        note.setTitle(requestDTO.getTitle());
        note.setContent(requestDTO.getContent());
        note.setCategory(requestDTO.getCategory());
        note.setTags(requestDTO.getTags());
        note.setUser(user);

        // Assign collection if provided
        if (requestDTO.getCollectionId() != null) {

            Collection collection =
                    collectionRepository.findById(
                            requestDTO.getCollectionId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Collection not found"));

            // Make sure collection belongs to logged-in user
            if (!collection.getUser().getEmail().equals(email)) {

                throw new RuntimeException(
                        "You are not allowed to use this collection");
            }

            note.setCollection(collection);
        }

        Note savedNote = noteRepository.save(note);

        return convertToResponse(savedNote);
    }

    // Get all notes
    @Override
    public List<NoteResponseDTO> getAllNotes() {

        String email = getLoggedInUserEmail();

        List<Note> notes =
                noteRepository.findByUserEmail(email);

        List<NoteResponseDTO> response =
                new ArrayList<>();

        for (Note note : notes) {
            response.add(convertToResponse(note));
        }

        return response;
    }

    // Get note by ID
    @Override
    public NoteResponseDTO getNoteById(Long id) {

        String email = getLoggedInUserEmail();

        Note note =
                noteRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Note not found"));

        // Security check
        if (!note.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to access this note");
        }

        return convertToResponse(note);
    }

    // Update note
    @Override
    public NoteResponseDTO updateNote(
            Long id,
            NoteRequestDTO requestDTO) {

        String email = getLoggedInUserEmail();

        Note note =
                noteRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Note not found"));

        // Security check
        if (!note.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to update this note");
        }

        note.setTitle(requestDTO.getTitle());
        note.setContent(requestDTO.getContent());
        note.setCategory(requestDTO.getCategory());
        note.setTags(requestDTO.getTags());

        // Update collection
        if (requestDTO.getCollectionId() != null) {

            Collection collection =
                    collectionRepository.findById(
                            requestDTO.getCollectionId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Collection not found"));

            // Security check
            if (!collection.getUser().getEmail().equals(email)) {

                throw new RuntimeException(
                        "You are not allowed to use this collection");
            }

            note.setCollection(collection);

        } else {

            // Remove note from collection
            note.setCollection(null);
        }

        Note updatedNote =
                noteRepository.save(note);

        return convertToResponse(updatedNote);
    }

    // Delete note
    @Override
    public void deleteNote(Long id) {

        String email = getLoggedInUserEmail();

        Note note =
                noteRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Note not found"));

        // Security check
        if (!note.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to delete this note");
        }

        noteRepository.delete(note);
    }

    // Search notes
    @Override
    public List<NoteResponseDTO> searchNotes(
            String keyword) {

        String email = getLoggedInUserEmail();

        List<Note> notes =
                noteRepository
                        .findByUserEmailAndTitleContainingIgnoreCase(
                                email,
                                keyword);

        List<NoteResponseDTO> response =
                new ArrayList<>();

        for (Note note : notes) {
            response.add(convertToResponse(note));
        }

        return response;
    }

    // Get notes by collection
    @Override
    public List<NoteResponseDTO> getNotesByCollection(
            Long collectionId) {

        String email = getLoggedInUserEmail();

        // Check collection exists
        Collection collection =
                collectionRepository.findById(collectionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Collection not found"));

        // Security check
        if (!collection.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to access this collection");
        }

        List<Note> notes =
                noteRepository.findByCollectionIdAndUserEmail(
                        collectionId,
                        email);

        List<NoteResponseDTO> response =
                new ArrayList<>();

        for (Note note : notes) {
            response.add(convertToResponse(note));
        }

        return response;
    }

    // Convert Entity to Response DTO
    private NoteResponseDTO convertToResponse(Note note) {

        Long collectionId = null;

        if (note.getCollection() != null) {
            collectionId =
                    note.getCollection().getId();
        }

        return new NoteResponseDTO(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getCategory(),
                note.getTags(),
                collectionId
        );
    }
}
