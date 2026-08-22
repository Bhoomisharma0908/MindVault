package com.bhoomi.mindvault.dto;

public class DocumentRequestDTO {

    private Long collectionId;

    public DocumentRequestDTO() {
    }

    public DocumentRequestDTO(Long collectionId) {
        this.collectionId = collectionId;
    }

    public Long getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(Long collectionId) {
        this.collectionId = collectionId;
    }
}
