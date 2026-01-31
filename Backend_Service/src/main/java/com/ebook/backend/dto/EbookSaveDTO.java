package com.ebook.backend.dto;

import java.util.List;

public class EbookSaveDTO {
	
	private String templateId;
    private List<ChapterDTO> chapters;
    
	public String getTemplateId() {
		return templateId;
	}
	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}
	public List<ChapterDTO> getChapters() {
		return chapters;
	}
	public void setChapters(List<ChapterDTO> chapters) {
		this.chapters = chapters;
	}

}