Perfect 👍
Here’s your **complete, single-block README.md** — clean, simple, and ready to copy in one click.
It’s fully written for your **Meeting Summarizer** project (ReactJS frontend + Spring Boot backend + Python Whisper API).

---

````markdown
# Meeting Summarizer

Meeting Summarizer is a web application that allows users to upload meeting audio files and automatically generates a clear, summarized version of the conversation.  
The frontend is built with **ReactJS**, the backend uses **Spring Boot**, and **Python (Whisper API)** is used for speech-to-text conversion.

---

##  Features

- Upload meeting audio files (`.mp3`, `.wav`, etc.)
- Convert speech to text using **OpenAI Whisper**
- Generate a short, meaningful summary of the meeting
- JWT-based authentication for secure access
- Simple and clean web interface

---

##  Tech Stack

**Frontend:** ReactJS  
**Backend:** Spring Boot (Java)  
**AI Service:** Python + Whisper API  
**Database:** PostgreSQL (or MySQL based on setup)  
**Authentication:** JWT (JSON Web Token)

---

##  Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) – for React frontend  
- [Java 17+](https://www.oracle.com/java/technologies/downloads/) – for Spring Boot backend  
- [Maven](https://maven.apache.org/download.cgi) – to build Spring Boot  
- [Python 3.8+](https://www.python.org/downloads/) – for Whisper API  
- [pip](https://pip.pypa.io/en/stable/installation/) – Python package manager  
- [Git](https://git-scm.com/) – optional, for cloning the repo

---

##  Clone the Repository

```bash
git clone https://github.com/AKHIL-8055/Meeting-Summarizer.git
cd Meeting-Summarizer
````

---

##  Setting up Whisper (Python Speech-to-Text API)

### Step 1: Install Whisper

```bash
pip install -U openai-whisper
```

### Step 2: Install FFmpeg (required for Whisper)

**Windows (using Chocolatey):**

```bash
choco install ffmpeg
```

**macOS (using Homebrew):**

```bash
brew install ffmpeg
```

**Linux (Ubuntu):**

```bash
sudo apt update
sudo apt install ffmpeg
```

### Step 3: Test Whisper (optional)

To verify installation:

```bash
whisper example.mp3 --model small
```

If this runs correctly, Whisper is ready.

---

## ⚙️ Setting up Backend (Spring Boot)

### Step 1: Navigate to backend folder

```bash
cd backend
```

### Step 2: Configure Database (PostgreSQL)

Update `application.properties` with your credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/meetingsummarizer
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=your_jwt_secret_key
```

### Step 3: Build and Run Backend

```bash
mvn clean install
mvn spring-boot:run
```

Backend will start on:

```
http://localhost:8080
```

---

## 💻 Setting up Frontend (ReactJS)

### Step 1: Navigate to frontend folder

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Run the development server

```bash
npm run dev
```

Frontend will start on:

```
http://localhost:5173
```

---

## 🔐 About JWT Authentication

* When a user logs in or registers, the Spring Boot backend generates a **JWT (JSON Web Token)**.
* This token is sent to the frontend and stored securely (usually in localStorage).
* For each API request, the token is included in the headers like this:

```
Authorization: Bearer <your_token_here>
```

* The backend validates the token before processing the request, ensuring security and session management.

---

## 🗄️ Database Design

The application uses **PostgreSQL** with the following main tables:

### `users` table

| Column Name | Type                    | Description          |
| ----------- | ----------------------- | -------------------- |
| id          | BIGSERIAL (Primary Key) | Unique user ID       |
| username    | VARCHAR                 | Username of the user |
| password    | VARCHAR                 | Encrypted password   |
| email       | VARCHAR                 | User email           |
| role        | VARCHAR                 | Role (USER/ADMIN)    |

### `summaries` table

| Column Name      | Type                    | Description                           |
| ---------------- | ----------------------- | ------------------------------------- |
| id               | BIGSERIAL (Primary Key) | Summary ID                            |
| user_id          | BIGINT (Foreign Key)    | References user who uploaded the file |
| audio_file_name  | VARCHAR                 | Uploaded file name                    |
| transcribed_text | TEXT                    | Full transcription of the meeting     |
| summary_text     | TEXT                    | Short summary generated               |
| created_at       | TIMESTAMP               | Timestamp of upload                   |

---

## ⚙️ How the Project Works

1. **User Authentication:**
   The user logs in or registers through the frontend. The backend verifies credentials and issues a JWT token.

2. **Audio Upload:**
   The user uploads a meeting audio file from the ReactJS interface.

3. **Speech-to-Text Conversion:**
   The uploaded file is sent to the Python service where Whisper converts speech to text.

4. **Summarization:**
   The transcribed text is sent to the backend, which generates a summarized version.

5. **Storage:**
   Both the original transcription and summary are stored in the database for later access.

6. **Display:**
   The summary is displayed in the frontend for the user to review or download.


