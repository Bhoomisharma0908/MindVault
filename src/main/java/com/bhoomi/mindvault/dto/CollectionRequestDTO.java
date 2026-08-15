package com.bhoomi.mindvault.dto;

public class CollectionRequestDTO {

    private String name;
    private String description;

    public CollectionRequestDTO() {
    }

    public CollectionRequestDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
