package com.ebook.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.ebook.backend")
public class EbookBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EbookBackendApplication.class, args);
    }

}
