package com.bhoomi.mindvault.controller;

import com.bhoomi.mindvault.dto.CollectionRequestDTO;
import com.bhoomi.mindvault.dto.CollectionResponseDTO;
import com.bhoomi.mindvault.service.impl.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;

    // Create collection
    @PostMapping
    public CollectionResponseDTO createCollection(
            @RequestBody CollectionRequestDTO requestDTO) {

        return collectionService.createCollection(requestDTO);
    }

    // Get all collections
    @GetMapping
    public List<CollectionResponseDTO> getAllCollections() {

        return collectionService.getAllCollections();
    }

    // Search collections
    @GetMapping("/search")
    public List<CollectionResponseDTO> searchCollections(
            @RequestParam String keyword) {

        return collectionService.searchCollections(keyword);
    }

    // Get collection by ID
    @GetMapping("/{id}")
    public CollectionResponseDTO getCollectionById(
            @PathVariable Long id) {

        return collectionService.getCollectionById(id);
    }

    // Update collection
    @PutMapping("/{id}")
    public CollectionResponseDTO updateCollection(
            @PathVariable Long id,
            @RequestBody CollectionRequestDTO requestDTO) {

        return collectionService.updateCollection(
                id,
                requestDTO
        );
    }

    // Delete collection
    @DeleteMapping("/{id}")
    public String deleteCollection(
            @PathVariable Long id) {

        collectionService.deleteCollection(id);

        return "Collection deleted successfully";
    }
}
