package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.DocumentResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    DocumentResponseDTO uploadDocument(
            MultipartFile file,
            Long collectionId
    );

    List<DocumentResponseDTO> getAllDocuments();

    DocumentResponseDTO getDocumentById(Long id);

    void deleteDocument(Long id);

    List<DocumentResponseDTO> searchDocuments(String keyword);

    byte[] downloadDocument(Long id);
}
