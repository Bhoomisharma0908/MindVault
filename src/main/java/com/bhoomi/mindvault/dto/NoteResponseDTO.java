package com.bhoomi.mindvault.dto;

public class NoteResponseDTO {

    private Long id;
    private String title;
    private String content;
    private String category;
    private String tags;

    public NoteResponseDTO() {
    }

    public NoteResponseDTO(Long id, String title, String content, String category, String tags) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
