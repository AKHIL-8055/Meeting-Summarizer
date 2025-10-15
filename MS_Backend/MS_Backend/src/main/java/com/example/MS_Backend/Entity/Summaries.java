package com.example.MS_Backend.Entity;

import jakarta.persistence.*;

@Entity
public class Summaries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int summariesId;

    @ManyToOne
    @JoinColumn(name = "user_id") // this is the foreign key column
    private User user;  // <-- use User entity, NOT int

    private String audioFilePath;


    @Lob // Large Object (tells JPA to store as TEXT / LONGTEXT)
    @Column(columnDefinition = "LONGTEXT")
    private String summarizedText;

    public Summaries() {}

    public int getSummariesId() {
        return summariesId;
    }

    public void setSummariesId(int summariesId) {
        this.summariesId = summariesId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAudioFilePath() {
        return audioFilePath;
    }

    public void setAudioFilePath(String audioFilePath) {
        this.audioFilePath = audioFilePath;
    }

    public String getSummarizedText() {
        return summarizedText;
    }

    public void setSummarizedText(String summarizedText) {
        this.summarizedText = summarizedText;
    }
}
