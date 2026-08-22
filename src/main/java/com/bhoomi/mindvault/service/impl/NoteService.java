package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.NoteRequestDTO;
import com.bhoomi.mindvault.dto.NoteResponseDTO;

import java.util.List;

public interface NoteService {

    NoteResponseDTO createNote(NoteRequestDTO requestDTO);

    List<NoteResponseDTO> getAllNotes();

    NoteResponseDTO getNoteById(Long id);

    NoteResponseDTO updateNote(
            Long id,
            NoteRequestDTO requestDTO);

    void deleteNote(Long id);

    List<NoteResponseDTO> searchNotes(String keyword);

    List<NoteResponseDTO> getNotesByCollection(
            Long collectionId);
}
