from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create the app
app = FastAPI(title="Sentinel API")

# Allow the frontend (port 3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# A simple check to see if the backend is running
@app.get("/")
def home():
    return {"status": "Sentinel backend online"}


# PHOTO: receives an image file
@app.post("/analyze/photo")
async def analyze_photo(file: UploadFile = File(...)):
    return {
        "verdict": "likely_ai",
        "confidence": 87,
        "evidence": [
            f"Received file: {file.filename}",
            "Backend connected (fake result for now)",
        ],
    }


# VIDEO: receives a video file
@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    return {
        "verdict": "uncertain",
        "confidence": 54,
        "evidence": [
            f"Received file: {file.filename}",
            "Backend connected (fake result for now)",
        ],
    }


# TEXT: receives text, not a file
class TextRequest(BaseModel):
    text: str


@app.post("/analyze/text")
def analyze_text(request: TextRequest):
    word_count = len(request.text.split())
    return {
        "verdict": "likely_real",
        "confidence": 72,
        "evidence": [
            f"Received {word_count} words",
            "Backend connected (fake result for now)",
        ],
    }