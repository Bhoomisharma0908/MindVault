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

    // Get logged-in user's email
    private String getLoggedInUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }

    // Create Collection
    @Override
    public CollectionResponseDTO createCollection(
            CollectionRequestDTO requestDTO) {

        String email = getLoggedInUserEmail();

        // Check duplicate collection name
        if (collectionRepository.existsByNameAndUserEmail(
                requestDTO.getName(), email)) {

            throw new RuntimeException(
                    "Collection with this name already exists");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Collection collection = new Collection();

        collection.setName(requestDTO.getName());
        collection.setDescription(requestDTO.getDescription());
        collection.setUser(user);

        Collection savedCollection =
                collectionRepository.save(collection);

        return new CollectionResponseDTO(
                savedCollection.getId(),
                savedCollection.getName(),
                savedCollection.getDescription()
        );
    }

    // Get all collections
    @Override
    public List<CollectionResponseDTO> getAllCollections() {

        String email = getLoggedInUserEmail();

        List<Collection> collections =
                collectionRepository.findByUserEmail(email);

        List<CollectionResponseDTO> response =
                new ArrayList<>();

        for (Collection collection : collections) {

            response.add(new CollectionResponseDTO(
                    collection.getId(),
                    collection.getName(),
                    collection.getDescription()
            ));
        }

        return response;
    }

    // Get collection by ID
    @Override
    public CollectionResponseDTO getCollectionById(Long id) {

        String email = getLoggedInUserEmail();

        Collection collection =
                collectionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Collection not found"));

        // Security check
        if (!collection.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to access this collection");
        }

        return new CollectionResponseDTO(
                collection.getId(),
                collection.getName(),
                collection.getDescription()
        );
    }

    // Update collection
    @Override
    public CollectionResponseDTO updateCollection(
            Long id,
            CollectionRequestDTO requestDTO) {

        String email = getLoggedInUserEmail();

        Collection collection =
                collectionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Collection not found"));

        // Security check
        if (!collection.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to update this collection");
        }

        collection.setName(requestDTO.getName());
        collection.setDescription(requestDTO.getDescription());

        Collection updatedCollection =
                collectionRepository.save(collection);

        return new CollectionResponseDTO(
                updatedCollection.getId(),
                updatedCollection.getName(),
                updatedCollection.getDescription()
        );
    }

    // Delete collection
    @Override
    public void deleteCollection(Long id) {

        String email = getLoggedInUserEmail();

        Collection collection =
                collectionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Collection not found"));

        // Security check
        if (!collection.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "You are not allowed to delete this collection");
        }

        collectionRepository.delete(collection);
    }

    // Search collections
    @Override
    public List<CollectionResponseDTO> searchCollections(
            String keyword) {

        String email = getLoggedInUserEmail();

        List<Collection> collections =
                collectionRepository
                        .findByUserEmailAndNameContainingIgnoreCase(
                                email,
                                keyword);

        List<CollectionResponseDTO> response =
                new ArrayList<>();

        for (Collection collection : collections) {

            response.add(new CollectionResponseDTO(
                    collection.getId(),
                    collection.getName(),
                    collection.getDescription()
            ));
        }

        return response;
    }
}
