package com.example.MS_Backend;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class WhisperPythonService {

    // Absolute path to your Python script
    private static final String PYTHON_SCRIPT_PATH = "C:\\Users\\V.AKHIL\\.idlerc\\extensions\\Desktop\\MS_Backend\\MS_Backend\\whisper_transcriber.py";

    /**
     * Transcribes audio using the Python Whisper script
     * @param audioFilePath absolute path to audio file
     * @return transcribed text
     */
    public String transcribeUsingPython(String audioFilePath) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
                "python",
                PYTHON_SCRIPT_PATH,
                audioFilePath
        );

        pb.redirectErrorStream(true);
        Process process = pb.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Python script exited with code " + exitCode);
        }

        return output.toString().trim();
    }
}
