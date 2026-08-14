package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.DocumentResponseDTO;
import com.bhoomi.mindvault.entity.Document;
import com.bhoomi.mindvault.entity.User;
import com.bhoomi.mindvault.repository.DocumentRepository;
import com.bhoomi.mindvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    private final String uploadDirectory = "uploads/";

    // Get logged-in user's email
    private String getLoggedInUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }

    // Upload Document
    @Override
    public DocumentResponseDTO uploadDocument(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File cannot be empty");
        }

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        try {

            Path uploadPath = Paths.get(uploadDirectory);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = file.getOriginalFilename();

            if (fileName == null || fileName.isBlank()) {
                throw new RuntimeException("Invalid file name");
            }

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            Document document = new Document();

            document.setFileName(fileName);
            document.setFileType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setFilePath(filePath.toString());
            document.setUser(user);

            Document savedDocument =
                    documentRepository.save(document);

            return new DocumentResponseDTO(
                    savedDocument.getId(),
                    savedDocument.getFileName(),
                    savedDocument.getFileType(),
                    savedDocument.getFileSize()
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload file",
                    e
            );
        }
    }

    // Get all documents of logged-in user
    @Override
    public List<DocumentResponseDTO> getAllDocuments() {

        String email = getLoggedInUserEmail();

        List<Document> documents =
                documentRepository.findByUserEmail(email);

        List<DocumentResponseDTO> response =
                new ArrayList<>();

        for (Document document : documents) {

            response.add(new DocumentResponseDTO(
                    document.getId(),
                    document.getFileName(),
                    document.getFileType(),
                    document.getFileSize()
            ));
        }

        return response;
    }

    // Get document by ID
    @Override
    public DocumentResponseDTO getDocumentById(Long id) {

        String email = getLoggedInUserEmail();

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found"));

        if (!document.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to access this document");
        }

        return new DocumentResponseDTO(
                document.getId(),
                document.getFileName(),
                document.getFileType(),
                document.getFileSize()
        );
    }

    // Delete document
    @Override
    public void deleteDocument(Long id) {

        String email = getLoggedInUserEmail();

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found"));

        if (!document.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to delete this document");
        }

        try {

            Path filePath =
                    Paths.get(document.getFilePath());

            Files.deleteIfExists(filePath);

            documentRepository.delete(document);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to delete document",
                    e
            );
        }
    }

    // Search documents
    @Override
    public List<DocumentResponseDTO> searchDocuments(
            String keyword) {

        String email = getLoggedInUserEmail();

        List<Document> documents =
                documentRepository
                        .findByUserEmailAndFileNameContainingIgnoreCase(
                                email,
                                keyword
                        );

        List<DocumentResponseDTO> response =
                new ArrayList<>();

        for (Document document : documents) {

            response.add(new DocumentResponseDTO(
                    document.getId(),
                    document.getFileName(),
                    document.getFileType(),
                    document.getFileSize()
            ));
        }

        return response;
    }

    // Download document
    @Override
    public byte[] downloadDocument(Long id) {

        String email = getLoggedInUserEmail();

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Document not found"));

        if (!document.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to download this document");
        }

        try {

            Path filePath =
                    Paths.get(document.getFilePath());

            return Files.readAllBytes(filePath);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to download document",
                    e
            );
        }
    }
}
