package com.ebook.backend.model;

import java.util.List;

public class Chapter {

    private String title;
    private String content;
    private List<Page> pages;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Page> getPages() {
        return pages;
    }

    public void setPages(List<Page> pages) {
        this.pages = pages;
    }

    private List<ChapterImage> images;

    public List<ChapterImage> getImages() {
        return images;
    }

    public void setImages(List<ChapterImage> images) {
        this.images = images;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}