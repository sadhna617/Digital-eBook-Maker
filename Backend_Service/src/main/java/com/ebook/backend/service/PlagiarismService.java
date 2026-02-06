package com.ebook.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class PlagiarismService {

    @Value("${copyleaks.email}")
    private String email;

    @Value("${copyleaks.key}")
    private String apiKey;

    private static final String RAPIDAPI_KEY = "cdd41faaffman9a9c82af45c2aep1dd998jsn56a0f825bc56b";
    private static final String RAPIDAPI_HOST = "plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com";
    private static final String API_URL = "https://plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com/plagiarism";

    public int checkText(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }

        try {
            // Call RapidAPI Plagiarism Checker
            RestTemplate restTemplate = new RestTemplate();

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-RapidAPI-Key", RAPIDAPI_KEY);
            headers.set("X-RapidAPI-Host", RAPIDAPI_HOST);

            // Prepare request body (simple string format)
            String requestBody = String.format(
                    "{\"text\":\"%s\",\"language\":\"en\",\"includeCitations\":false,\"scrapeSources\":false}",
                    escapeJson(text));

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Make API call
            ResponseEntity<String> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.POST,
                    entity,
                    String.class);

            // Parse response manually (no Jackson needed)
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();

                // Extract plagiarism percentage from JSON response
                int score = extractPlagiarismScore(responseBody);

                if (score >= 0) {
                    return score;
                }
            }

            // If API fails, fallback to basic detection
            return fallbackDetection(text);

        } catch (Exception e) {
            System.err.println("Plagiarism API Error: " + e.getMessage());
            e.printStackTrace();
            // Fallback to basic detection
            return fallbackDetection(text);
        }
    }

    /**
     * Extract plagiarism score from JSON response without Jackson
     */
    private int extractPlagiarismScore(String jsonResponse) {
        try {
            // Look for "percentPlagiarism" field
            if (jsonResponse.contains("\"percentPlagiarism\"")) {
                int startIndex = jsonResponse.indexOf("\"percentPlagiarism\"") + 19;
                int colonIndex = jsonResponse.indexOf(":", startIndex);
                int commaIndex = jsonResponse.indexOf(",", colonIndex);
                int braceIndex = jsonResponse.indexOf("}", colonIndex);

                int endIndex = (commaIndex > 0 && commaIndex < braceIndex) ? commaIndex : braceIndex;

                String scoreStr = jsonResponse.substring(colonIndex + 1, endIndex).trim();
                double score = Double.parseDouble(scoreStr);
                return (int) Math.round(score);
            }

            // Alternative: look for "plagiarismScore"
            if (jsonResponse.contains("\"plagiarismScore\"")) {
                int startIndex = jsonResponse.indexOf("\"plagiarismScore\"") + 17;
                int colonIndex = jsonResponse.indexOf(":", startIndex);
                int commaIndex = jsonResponse.indexOf(",", colonIndex);
                int braceIndex = jsonResponse.indexOf("}", colonIndex);

                int endIndex = (commaIndex > 0 && commaIndex < braceIndex) ? commaIndex : braceIndex;

                String scoreStr = jsonResponse.substring(colonIndex + 1, endIndex).trim();
                double score = Double.parseDouble(scoreStr);
                return (int) Math.round(score);
            }

        } catch (Exception e) {
            System.err.println("Error parsing JSON: " + e.getMessage());
        }

        return -1; // Parsing failed
    }

    /**
     * Escape special characters for JSON
     */
    private String escapeJson(String text) {
        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", " ")
                .replace("\r", " ")
                .replace("\t", " ");
    }

    /**
     * Fallback detection if API fails
     */
    private int fallbackDetection(String text) {
        String normalizedText = text.toLowerCase().trim();
        int score = 0;

        // Check for common copied phrases
        String[] suspiciousPatterns = {
                "lorem ipsum", "wikipedia", "copy", "paste", "sample text",
                "refers to", "also known as", "according to", "for example",
                "in other words", "such as", "including", "consists of"
        };

        for (String pattern : suspiciousPatterns) {
            if (normalizedText.contains(pattern)) {
                score += 15;
            }
        }

        // Long text is more likely copied
        if (text.length() > 500)
            score += 10;
        if (text.length() > 1000)
            score += 10;

        // Check uniqueness
        String[] words = text.split("\\s+");
        java.util.Set<String> uniqueWords = new java.util.HashSet<>(java.util.Arrays.asList(words));
        double uniqueRatio = (double) uniqueWords.size() / words.length;

        if (uniqueRatio < 0.5)
            score += 25;
        else if (uniqueRatio < 0.7)
            score += 15;

        return Math.min(100, score);
    }
}
