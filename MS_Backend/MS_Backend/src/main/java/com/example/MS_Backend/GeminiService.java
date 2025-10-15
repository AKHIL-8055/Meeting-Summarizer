package com.example.MS_Backend;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    private final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    private final String GEMINI_API_KEY = "AIzaSyAG2OiPFAm-oBb_CKqIAnYXazbAOjA40SE";

    public String summarizeText(String transcript) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            String prompt = """
                    You are a professional meeting summarizer.
                    Summarize the following meeting clearly and structurally.
                    Include:
                    - Topic-wise sections with side headings
                    - Key points and deadlines
                    - Bullet points for readability
                    - If suitable, describe what type of chart or graph could visualize the data (no image required).
                    Meeting transcript:
                    """ + transcript;

            // Gemini expects JSON with "contents"
            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> content = Map.of("parts", new Object[]{textPart});
            Map<String, Object> requestBody = Map.of("contents", new Object[]{content});

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    GEMINI_API_URL + GEMINI_API_KEY,
                    entity,
                    Map.class
            );

            // Extract the generated text
            Map candidate = (Map) ((Map) ((java.util.List) response.getBody().get("candidates")).get(0));
            Map contentResponse = (Map) candidate.get("content");
            java.util.List parts = (java.util.List) contentResponse.get("parts");
            Map part = (Map) parts.get(0);
            return part.get("text").toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error summarizing text: " + e.getMessage();
        }
    }
}
