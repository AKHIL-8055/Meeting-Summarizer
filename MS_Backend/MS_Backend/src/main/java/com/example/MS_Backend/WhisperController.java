package com.example.MS_Backend;

import com.example.MS_Backend.Entity.Summaries;
import com.example.MS_Backend.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/whisper")
public class WhisperController {

    @Autowired
    private WhisperPythonService whisperService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private  summariesRepo s;

    @Autowired
    private UserRepo ur;

    /**
     * Endpoint to upload an audio file and get transcription
     */
    @PostMapping("/transcribe")
    public ResponseEntity<String> transcribe(@RequestParam("file") MultipartFile file,@RequestParam int userId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty!");
        }

        try {
            // Save the uploaded file temporarily
            File tempFile = File.createTempFile("audio-", "-" + file.getOriginalFilename());
            file.transferTo(tempFile);

            // Call Python service
            String transcription = whisperService.transcribeUsingPython(tempFile.getAbsolutePath());

            // Delete temp file
            tempFile.delete();

            String x =  geminiService.summarizeText(transcription);

            //add to the summarise table
            Summaries temp = new Summaries();

            Optional<User> tempuser = ur.findById(userId);
            temp.setUser(tempuser.get());
            temp.setAudioFilePath(String.valueOf(file));
            temp.setSummarizedText(x);

            s.save(temp);

            return ResponseEntity.ok(x);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error during transcription: " + e.getMessage());
        }
    }

    @GetMapping("/allSummaries/{id}")
    public List<Summaries> allSummaries(@PathVariable int id){
        Optional<User> x = ur.findById(id);
         return s.findByUser(x.get());
    }

}
