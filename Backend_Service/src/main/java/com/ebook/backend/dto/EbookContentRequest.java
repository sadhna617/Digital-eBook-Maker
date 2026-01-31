 package com.ebook.backend.dto;

import java.util.List;
import com.ebook.backend.model.Chapter;

public class EbookContentRequest {

    private String templateId;
    private List<Chapter> chapters;

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
    }
}  