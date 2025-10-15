import sys
import whisper

# Get the audio file path from command line
file_path = sys.argv[1]

# Load Whisper model once
model = whisper.load_model("base")

# Transcribe audio
result = model.transcribe(file_path)

# Print text output (Spring Boot will capture this)
print(result["text"])
