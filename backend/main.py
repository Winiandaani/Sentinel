from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import HTTPException
from detectors.photo import check_metadata, check_with_models, check_content_credentials
from detectors.video import analyze_video

MAX_VIDEO_BYTES = 100 * 1024 * 1024  # 100 MB
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
    image_bytes = await file.read()

    try:
        credentials = check_content_credentials(image_bytes, file.content_type)
        metadata = check_metadata(image_bytes)
        scores = check_with_models(image_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this image")

    evidence = credentials["findings"] + metadata["findings"] + [
        f"{name} score: {score:.2f} (0 = human, 1 = AI)" for name, score in scores.items()
    ]

    lowest = min(scores.values())
    highest = max(scores.values())

    # Layer 1: signed content credentials saying AI = strongest proof
    if credentials["signal"] == "ai":
        verdict = "likely_ai"
        confidence = 99

    # Layer 2: an AI tool's name in the metadata
    elif metadata["signal"] == "ai":
        verdict = "likely_ai"
        confidence = 90

    # Layer 3: both models agree it's AI
    elif lowest >= 0.80:
        verdict = "likely_ai"
        confidence = round(lowest * 100)

    # Both models agree it's real
    elif highest <= 0.20:
        verdict = "likely_real"
        confidence = round((1 - highest) * 100)

    # The models disagree, so be honest about it
    else:
        verdict = "uncertain"
        confidence = 50
        evidence.append("The two models disagree on this image")

    return {"verdict": verdict, "confidence": confidence, "evidence": evidence}

# VIDEO: receives a video file
@app.post("/analyze/video")
async def video_route(file: UploadFile = File(...)):
    video_bytes = await file.read()

    if len(video_bytes) > MAX_VIDEO_BYTES:
        raise HTTPException(status_code=400, detail="Video is too big (max 100 MB)")

    try:
              return analyze_video(video_bytes, file.filename, file.content_type)  
    except ValueError as problem:
        raise HTTPException(status_code=400, detail=str(problem))


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