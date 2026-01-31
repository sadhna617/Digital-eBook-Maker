package com.ebook.backend.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ebook.backend.dto.EbookContentRequest;
import com.ebook.backend.model.Design;
import com.ebook.backend.model.Ebook;
import com.ebook.backend.service.EbookService;

@RestController
@RequestMapping("/api/ebooks/editor")
@CrossOrigin(origins = "http://localhost:5173")

public class EbookEditorController {

    private final EbookService service;

    // ✅ Safe upload directory
    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + "/uploads/";

    public EbookEditorController(EbookService service) {
        this.service = service;
    }

    // ===== JSON-only endpoint (Postman) =====
    @PostMapping("/json")
    public Ebook create(@RequestBody Ebook ebook) {
        return service.create(ebook);
    }

    // ===== UI endpoint (React + file upload) =====
    @PostMapping
    public Ebook createWithCover(
            @RequestParam String title,
            @RequestParam String author,
            @RequestParam String category,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile cover
    ) throws IOException {

        String coverPath = null;

        if (cover != null && !cover.isEmpty()) {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + cover.getOriginalFilename();
            File file = new File(UPLOAD_DIR + fileName);
            cover.transferTo(file);

            coverPath = "/uploads/" + fileName;
        }

        Ebook ebook = new Ebook();
        ebook.setTitle(title);
        ebook.setAuthor(author);
        ebook.setCategory(category);
        ebook.setDescription(description);
        ebook.setCoverImageUrl(coverPath);

        return service.create(ebook);
    }

    // ===== READ =====
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
        return "Ebook deleted";
    }

    // ===== TEMPLATE SELECTION =====
    @PutMapping("/{id}/template")
    public Ebook selectTemplate(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        Ebook ebook = service.getById(id);
        ebook.setTemplateId(body.get("templateId"));
        return service.create(ebook);
    }

    // ===== CUSTOM TEMPLATE =====
    @PutMapping("/{id}/custom-template")
    public Ebook selectCustomTemplate(@PathVariable String id) {
        Ebook ebook = service.getById(id);
        ebook.setTemplateType("CUSTOM");
        ebook.setTemplateId(null);
        return service.create(ebook);
    }

    // ===== SAVE CUSTOM DESIGN =====
    @PutMapping("/{id}/custom-design")
    public Ebook saveCustomDesign(
            @PathVariable String id,
            @RequestBody Design design
    ) {
        Ebook ebook = service.getById(id);
        ebook.setCustomDesign(design);
        ebook.setTemplateType("CUSTOM");
        return service.update(ebook); // THIS LINE
    }


    // ===== SAVE BOOK CONTENT =====
    @PutMapping("/{id}/content")
    public Ebook saveContent(
            @PathVariable String id,
            @RequestBody EbookContentRequest request
    ) {
        Ebook ebook = service.getById(id);
        ebook.setTemplateId(request.getTemplateId());
        ebook.setChapters(request.getChapters());
        return service.create(ebook);
    }
} 