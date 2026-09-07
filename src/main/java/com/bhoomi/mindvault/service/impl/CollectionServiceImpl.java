package com.bhoomi.mindvault.service.impl;

import com.bhoomi.mindvault.dto.CollectionRequestDTO;
import com.bhoomi.mindvault.dto.CollectionResponseDTO;
import com.bhoomi.mindvault.entity.Collection;
import com.bhoomi.mindvault.entity.User;
import com.bhoomi.mindvault.repository.CollectionRepository;
import com.bhoomi.mindvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CollectionServiceImpl implements CollectionService {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private UserRepository userRepository;

    private String getLoggedInUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getName() == null) {

            throw new RuntimeException("User is not authenticated");
        }

        return authentication.getName();
    }

    // =========================
    // CREATE COLLECTION
    // =========================

    @Override
    public CollectionResponseDTO createCollection(
            CollectionRequestDTO requestDTO) {

        if (requestDTO == null ||
                requestDTO.getName() == null ||
                requestDTO.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Collection name is required");
        }

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String name = requestDTO.getName().trim();

        // Prevent duplicate collection names
        if (collectionRepository.existsByNameAndUserEmail(
                name,
                email)) {

            throw new RuntimeException(
                    "A collection with this name already exists");
        }

        Collection collection = new Collection();

        collection.setName(name);
        collection.setDescription(
                requestDTO.getDescription()
        );
        collection.setUser(user);

        Collection savedCollection =
                collectionRepository.save(collection);

        return convertToResponse(savedCollection);
    }

    // =========================
    // GET ALL COLLECTIONS
    // =========================

    @Override
    public List<CollectionResponseDTO> getAllCollections() {

        String email = getLoggedInUserEmail();

        List<Collection> collections =
                collectionRepository.findByUserEmail(email);

        List<CollectionResponseDTO> response =
                new ArrayList<>();

        for (Collection collection : collections) {

            response.add(
                    convertToResponse(collection)
            );
        }

        return response;
    }

    // =========================
    // GET COLLECTION BY ID
    // =========================

    @Override
    public CollectionResponseDTO getCollectionById(Long id) {

        String email = getLoggedInUserEmail();

        Collection collection =
                collectionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Collection not found"));

        verifyOwnership(collection, email);

        return convertToResponse(collection);
    }

    // =========================
    // UPDATE COLLECTION
    // =========================

    @Override
    public CollectionResponseDTO updateCollection(
            Long id,
            CollectionRequestDTO requestDTO) {

        if (requestDTO == null ||
                requestDTO.getName() == null ||
                requestDTO.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "Collection name is required");
        }

        String email = getLoggedInUserEmail();

        Collection collection =
                collectionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Collection not found"));

        verifyOwnership(collection, email);

        collection.setName(
                requestDTO.getName().trim()
        );

        collection.setDescription(
                requestDTO.getDescription()
        );

        Collection updatedCollection =
                collectionRepository.save(collection);

        return convertToResponse(updatedCollection);
    }

    // =========================
    // DELETE COLLECTION
    // =========================

    @Override
    public void deleteCollection(Long id) {

        String email = getLoggedInUserEmail();

        Collection collection =
                collectionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Collection not found"));

        verifyOwnership(collection, email);

        collectionRepository.delete(collection);
    }

    // =========================
    // SEARCH COLLECTIONS
    // =========================

    @Override
    public List<CollectionResponseDTO> searchCollections(
            String keyword) {

        String email = getLoggedInUserEmail();

        List<Collection> collections =
                collectionRepository
                        .findByUserEmailAndNameContainingIgnoreCase(
                                email,
                                keyword
                        );

        List<CollectionResponseDTO> response =
                new ArrayList<>();

        for (Collection collection : collections) {

            response.add(
                    convertToResponse(collection)
            );
        }

        return response;
    }

    // =========================
    // SECURITY CHECK
    // =========================

    private void verifyOwnership(
            Collection collection,
            String email) {

        if (collection.getUser() == null ||
                collection.getUser().getEmail() == null ||
                !collection.getUser()
                        .getEmail()
                        .equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to access this collection");
        }
    }

    // =========================
    // ENTITY → DTO
    // =========================

    private CollectionResponseDTO convertToResponse(
            Collection collection) {

        return new CollectionResponseDTO(
                collection.getId(),
                collection.getName(),
                collection.getDescription()
        );
    }
}
