package com.ebook.backend.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ebooks")
public class Ebook {

    @Id
    private String id;

    private String title;
    private String author;
    private String description;
    private boolean isFree;
    private String coverImageUrl;

    private String createdBy; // logged-in user
    private String status; // DRAFT / PUBLISHED

    private String templateType; // PREDEFINED / CUSTOM
    private String templateId; // classic-book, science-modern etc.
    private Design customDesign; // for custom template

    private List<Chapter> chapters;

    // 🔹 ADD THESE TWO FIELDS (NO BREAKING CHANGE)
    private String category;
    private boolean published;

    // 🔹 DEMO CHANGE: Adding a new field WITHOUT touching the Database
    private Double rating; // 0.0 to 5.0

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public Design getCustomDesign() {
        return customDesign;
    }

    public void setCustomDesign(Design customDesign) {
        this.customDesign = customDesign;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}
