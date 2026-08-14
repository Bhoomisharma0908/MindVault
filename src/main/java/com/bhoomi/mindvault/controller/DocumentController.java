package com.bhoomi.mindvault.controller;

import com.bhoomi.mindvault.dto.DocumentResponseDTO;
import com.bhoomi.mindvault.service.impl.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // Upload Document
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public DocumentResponseDTO uploadDocument(
            @RequestParam("file") MultipartFile file) {

        return documentService.uploadDocument(file);
    }

    // Get all documents
    @GetMapping
    public List<DocumentResponseDTO> getAllDocuments() {

        return documentService.getAllDocuments();
    }

    // Get document by ID
    @GetMapping("/{id}")
    public DocumentResponseDTO getDocumentById(
            @PathVariable Long id) {

        return documentService.getDocumentById(id);
    }

    // Search documents
    @GetMapping("/search")
    public List<DocumentResponseDTO> searchDocuments(
            @RequestParam String keyword) {

        return documentService.searchDocuments(keyword);
    }

    // Download document
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable Long id) {

        byte[] file = documentService.downloadDocument(id);

        DocumentResponseDTO document =
                documentService.getDocumentById(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                document.getFileName() + "\""
                )
                .body(file);
    }

    // Delete document
    @DeleteMapping("/{id}")
    public String deleteDocument(
            @PathVariable Long id) {

        documentService.deleteDocument(id);

        return "Document deleted successfully";
    }
}
