package com.ebook.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ebook.backend.model.Ebook;
import com.ebook.backend.repository.EbookRepository;

@Service
public class EbookService {

    private final EbookRepository repo;

    public EbookService(EbookRepository repo) {
        this.repo = repo;
    }

    public List<Ebook> getAll() {
        return repo.findAll();   // ✅ SAFE
    }

    public List<Ebook> getEbooksByUser(String email) {
        return repo.findByCreatedBy(email); // only use if email is NOT null
    }

   
    public Ebook create(Ebook ebook, String userEmail) {
        ebook.setCreatedBy(userEmail);
        ebook.setStatus("DRAFT");
        return repo.save(ebook);
    }

   
    public List<Ebook> getMyEbooks(String username) {
        return repo.findByCreatedBy(username);
    }

  
    public Ebook publish(String id) {
        Ebook ebook = repo.findById(id).orElseThrow();
        ebook.setStatus("PUBLISHED");
        return repo.save(ebook);
    }

  
    public Ebook create(Ebook ebook) {
        return repo.save(ebook);
    }

   
    public Ebook getById(String id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public Ebook update(Ebook ebook) {
        return repo.save(ebook); //  small safe fix
    }
}
