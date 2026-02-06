package com.ebook.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import com.ebook.backend.model.Ebook;
import com.ebook.backend.service.EbookService;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")

public class BookController {

    private final EbookService service;

    public BookController(EbookService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Ebook createBook(@RequestBody Ebook ebook) {
        return service.create(ebook);
    }

} 