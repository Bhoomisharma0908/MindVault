package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.CollectionRequestDTO;
import com.bhoomi.mindvault.dto.CollectionResponseDTO;

import java.util.List;

public interface CollectionService {

    CollectionResponseDTO createCollection(
            CollectionRequestDTO requestDTO);

    List<CollectionResponseDTO> getAllCollections();

    CollectionResponseDTO getCollectionById(Long id);

    CollectionResponseDTO updateCollection(
            Long id,
            CollectionRequestDTO requestDTO);

    void deleteCollection(Long id);

    List<CollectionResponseDTO> searchCollections(
            String keyword);
}
