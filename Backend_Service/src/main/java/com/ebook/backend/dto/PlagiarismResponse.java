package com.ebook.backend.dto;

public class PlagiarismResponse {
    private int score;

    public PlagiarismResponse(int score) {
        this.score = score;
    }

    public int getScore() {
        return score;
    }
}
