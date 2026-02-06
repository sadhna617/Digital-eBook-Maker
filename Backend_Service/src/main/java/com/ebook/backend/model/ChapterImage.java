package com.ebook.backend.model;

public class ChapterImage {
    private String url;
    private int width;
    private String textAlign;

    public ChapterImage() {
    }

    public ChapterImage(String url, int width, String textAlign) {
        this.url = url;
        this.width = width;
        this.textAlign = textAlign;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getTextAlign() {
        return textAlign;
    }

    public void setTextAlign(String textAlign) {
        this.textAlign = textAlign;
    }
}
