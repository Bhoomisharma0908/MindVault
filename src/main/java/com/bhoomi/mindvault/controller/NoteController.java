package com.bhoomi.mindvault.controller;

import com.bhoomi.mindvault.dto.NoteRequestDTO;
import com.bhoomi.mindvault.dto.NoteResponseDTO;
import com.bhoomi.mindvault.service.impl.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Create Note
    @PostMapping
    public NoteResponseDTO createNote(
            @RequestBody NoteRequestDTO requestDTO) {

        return noteService.createNote(requestDTO);
    }

    // Get all Notes
    @GetMapping
    public List<NoteResponseDTO> getAllNotes() {

        return noteService.getAllNotes();
    }

    // Search Notes
    @GetMapping("/search")
    public List<NoteResponseDTO> searchNotes(
            @RequestParam String keyword) {

        return noteService.searchNotes(keyword);
    }

    // Get notes belonging to a collection
    @GetMapping("/collection/{collectionId}")
    public List<NoteResponseDTO> getNotesByCollection(
            @PathVariable Long collectionId) {

        return noteService.getNotesByCollection(collectionId);
    }

    // Get Note by ID
    @GetMapping("/{id}")
    public NoteResponseDTO getNoteById(
            @PathVariable Long id) {

        return noteService.getNoteById(id);
    }

    // Update Note
    @PutMapping("/{id}")
    public NoteResponseDTO updateNote(
            @PathVariable Long id,
            @RequestBody NoteRequestDTO requestDTO) {

        return noteService.updateNote(
                id,
                requestDTO
        );
    }

    // Delete Note
    @DeleteMapping("/{id}")
    public String deleteNote(
            @PathVariable Long id) {

        noteService.deleteNote(id);

        return "Note deleted successfully";
    }
}