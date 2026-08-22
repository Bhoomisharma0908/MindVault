package com.bhoomi.mindvault.dto;

public class NoteRequestDTO {

    private String title;
    private String content;
    private String category;
    private String tags;
    private Long collectionId;

    public NoteRequestDTO() {
    }

    public NoteRequestDTO(
            String title,
            String content,
            String category,
            String tags,
            Long collectionId) {

        this.title = title;
        this.content = content;
        this.category = category;
        this.tags = tags;
        this.collectionId = collectionId;
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

    public Long getCollectionId() {
        return collectionId;
    }

    public void setCollectionId(Long collectionId) {
        this.collectionId = collectionId;
    }
}
