package com.bhoomi.mindvault.controller;

import com.bhoomi.mindvault.dto.NoteRequestDTO;
import com.bhoomi.mindvault.dto.NoteResponseDTO;
import com.bhoomi.mindvault.service.impl.NoteService;
import jakarta.validation.Valid;
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
            @Valid @RequestBody NoteRequestDTO noteRequestDTO) {

        return noteService.createNote(noteRequestDTO);
    }

    // Get All Notes
    @GetMapping
    public List<NoteResponseDTO> getAllNotes() {

        return noteService.getAllNotes();
    }

    // Get Note By ID
    @GetMapping("/{id}")
    public NoteResponseDTO getNoteById(@PathVariable Long id) {

        return noteService.getNoteById(id);
    }

    // Update Note
    @PutMapping("/{id}")
    public NoteResponseDTO updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequestDTO noteRequestDTO) {

        return noteService.updateNote(id, noteRequestDTO);
    }

    // Delete Note
    @DeleteMapping("/{id}")
    public String deleteNote(@PathVariable Long id) {

        noteService.deleteNote(id);

        return "Note deleted successfully";
    }

    // Search Notes
    @GetMapping("/search")
    public List<NoteResponseDTO> searchNotes(
            @RequestParam String keyword) {

        return noteService.searchNotes(keyword);
    }
}