package com.ebook.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.ebook.backend.model.Ebook;
import com.ebook.backend.service.EbookService;
import com.ebook.backend.dto.EbookContentRequest;

@RestController
@RequestMapping("/api/ebooks")
@CrossOrigin(origins = "http://localhost:5173")
public class EbookController {

    private final EbookService service;

    public EbookController(EbookService service) {
        this.service = service;
    }

    @PostMapping
    public Ebook create(@RequestBody Ebook ebook) {
        return service.create(ebook);
    }

    @GetMapping
    public List<Ebook> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Ebook getById(@PathVariable String id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        service.delete(id);
        return "eBook deleted";
    }

    @GetMapping("/my")
    public List<Ebook> getMyEbooks() {
        // TEMP: return all ebooks OR filter later
        return service.getAll();
    }

    @PostMapping("/create")
    public Ebook createAfterLogin(
            @RequestBody Ebook ebook,
            Authentication authentication) {
        return service.create(ebook, authentication.getName());
    }

    @PutMapping("/publish/{id}")
    public Ebook publish(@PathVariable String id) {
        return service.publish(id);
    }

    @PutMapping("/{id}/content")
    public Ebook saveContent(
            @PathVariable String id,
            @RequestBody EbookContentRequest request) {
        Ebook ebook = service.getById(id);

        ebook.setTemplateId(request.getTemplateId());
        ebook.setChapters(request.getChapters());

        return service.update(ebook); // SAFE UPDATE
    }

    @PostMapping("/{id}/cover")
    public Ebook uploadCover(
            @PathVariable String id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        Ebook ebook = service.getById(id);

        if (file != null && !file.isEmpty()) {
            // Save file as base64 or URL
            String base64Image = "data:" + file.getContentType() + ";base64," +
                    java.util.Base64.getEncoder().encodeToString(file.getBytes());
            ebook.setCoverImageUrl(base64Image);
        }

        return service.update(ebook);
    }
}