package com.ebook.backend.controller;

import com.ebook.backend.dto.PlagiarismRequest;
import com.ebook.backend.dto.PlagiarismResponse;
import com.ebook.backend.service.PlagiarismService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plagiarism")
@CrossOrigin(origins = "http://localhost:5173")
public class PlagiarismController {

    private final PlagiarismService service;

    public PlagiarismController(PlagiarismService service) {
        this.service = service;
    }

    @PostMapping("/check")
    public PlagiarismResponse check(@RequestBody PlagiarismRequest request) {
        int score = service.checkText(request.getText());
        return new PlagiarismResponse(score);
    }
}
