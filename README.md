Meeting Summarizer

This project allows you to upload a meeting audio file and get a clear summary of the discussion.
It uses OpenAI Whisper for speech-to-text conversion and a summarization model to generate a short and useful summary.

Features

Upload meeting audio files (like .mp3 or .wav)

Convert speech to text using Whisper

Get a short and clear summary of the meeting

Simple and clean web interface

Prerequisites

Make sure you have the following installed on your system:

Node.js
 (for frontend)

Python
 (for Whisper and backend)

pip
 (Python package manager)

Git (optional, for cloning the repo)

Clone the Repository
git clone https://github.com/AKHIL-8055/Meeting-Summarizer.git
cd Meeting-Summarizer

Setting up Whisper
Step 1: Install Whisper
pip install -U openai-whisper


If you get errors related to FFmpeg, install it using:

Windows (using Chocolatey):

choco install ffmpeg


macOS (using Homebrew):

brew install ffmpeg


Linux (Ubuntu):

sudo apt update
sudo apt install ffmpeg

Step 2: Test Whisper (optional)

You can check if Whisper works by running:

whisper example.mp3 --model small


If it works fine, you’re ready to go.

Setting up Backend

Go to your backend folder (if it’s in Python):

cd backend


Install required libraries:

pip install flask openai-whisper


Run the backend:

python app.py

Setting up Frontend

Go to the frontend folder:

cd frontend


Install dependencies:

npm install


Run the frontend:

npm start


Now open your browser and go to:

http://localhost:3000

How It Works

Upload an audio file of your meeting.

The backend converts it into text using Whisper.

The text is summarized into short points.

You’ll see the summary on the screen.
