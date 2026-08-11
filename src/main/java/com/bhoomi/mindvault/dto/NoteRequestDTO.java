package com.bhoomi.mindvault.dto;

import jakarta.validation.constraints.NotBlank;

public class NoteRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String category;

    private String tags;

    public NoteRequestDTO() {
    }

    public NoteRequestDTO(String title, String content, String category, String tags) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.tags = tags;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }
}
