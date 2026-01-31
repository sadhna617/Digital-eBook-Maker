package com.ebook.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.ebook.backend.model.Ebook;
import java.util.List;

public interface EbookRepository extends MongoRepository<Ebook, String> {
    List<Ebook> findByCreatedBy(String createdBy);
}
