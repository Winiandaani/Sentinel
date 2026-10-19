import glob
import json
import os
import subprocess
import tempfile

from PIL import Image
from detectors.photo import detectors, get_ai_score, check_content_credentials

MAX_SECONDS = 60
MAX_FRAMES = 20

# Names of AI video tools that sometimes appear in video metadata
AI_VIDEO_TOOLS = [
    "sora", "veo", "runway", "kling", "pika", "luma", "hailuo",
    "minimax", "openai", "synthesia", "heygen",
]


def get_video_info(video_path):
    # Ask ffprobe to describe the video as JSON
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json",
         "-show_format", "-show_streams", video_path],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0 or not result.stdout:
        raise ValueError("Could not read this video")
    return json.loads(result.stdout)


def check_video_metadata(info):
    findings = []
    signal = "none"  # "ai", "real" or "none"

    # Collect all the text tags from the file and its streams
    tags = {}
    for key, value in info.get("format", {}).get("tags", {}).items():
        tags[key.lower()] = str(value)
    for stream in info.get("streams", []):
        for key, value in stream.get("tags", {}).items():
            tags.setdefault(key.lower(), str(value))

    # Look for AI tool names
    all_text = " ".join(tags.values()).lower()
    for name in AI_VIDEO_TOOLS:
        if name in all_text:
            findings.append(f"Video metadata mentions an AI tool: '{name}'")
            signal = "ai"
            break

    # Look for the recording device (phones save make/model)
    device = " ".join(
        value for key, value in tags.items()
        if key.endswith(("manufacturer", "make", "model"))
    )
    if device:
        findings.append(f"Recording device found: {device}")
        if signal != "ai":
            signal = "real"
    else:
        findings.append("No recording device info in metadata")

    return {"signal": signal, "findings": findings}


def extract_frames(video_path, folder, duration):
    # Spread up to MAX_FRAMES evenly across the video
    fps = min(1, MAX_FRAMES / max(duration, 1))
    subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", video_path,
         "-vf", f"fps={fps}", os.path.join(folder, "frame_%03d.jpg")],
        capture_output=True,
    )
    return sorted(glob.glob(os.path.join(folder, "frame_*.jpg")))[:MAX_FRAMES]


def check_frames(frame_paths):
    ai_frames = real_frames = disagree_frames = 0

    for path in frame_paths:
        image = Image.open(path).convert("RGB")
        scores = [get_ai_score(det, image) for det in detectors.values()]

        if min(scores) >= 0.80:
            ai_frames += 1  # both models say AI
        elif max(scores) <= 0.20:
            real_frames += 1  # both models say real
        else:
            disagree_frames += 1

    return ai_frames, real_frames, disagree_frames


def analyze_video(video_bytes, filename, mime_type):
    extension = os.path.splitext(filename or "")[1] or ".mp4"

    # A temporary folder that deletes itself when we're done
    with tempfile.TemporaryDirectory() as folder:
        video_path = os.path.join(folder, "upload" + extension)
        with open(video_path, "wb") as f:
            f.write(video_bytes)

        info = get_video_info(video_path)
        duration = float(info.get("format", {}).get("duration", 0))
        if duration > MAX_SECONDS:
            raise ValueError(f"Video is too long ({duration:.0f}s). Max is {MAX_SECONDS}s.")

        credentials = check_content_credentials(video_bytes, mime_type or "video/mp4")
        metadata = check_video_metadata(info)

        frame_paths = extract_frames(video_path, folder, duration)
        if not frame_paths:
            raise ValueError("Could not extract frames from this video")
        ai, real, disagree = check_frames(frame_paths)
        total = len(frame_paths)

        evidence = (
            [f"Video length: {duration:.1f} seconds"]
            + credentials["findings"]
            + metadata["findings"]
            + [
                f"Frames checked: {total}",
                f"{ai} of {total} frames: both models say AI",
                f"{real} of {total} frames: both models say real",
                f"{disagree} of {total} frames: models disagree",
            ]
        )

        # Strongest evidence first
        if credentials["signal"] == "ai":
            verdict, confidence = "likely_ai", 99
        elif metadata["signal"] == "ai":
            verdict, confidence = "likely_ai", 90
        elif ai / total >= 0.5:
            verdict, confidence = "likely_ai", round(ai / total * 100)
        elif real / total >= 0.7 and ai == 0:
            verdict, confidence = "likely_real", round(real / total * 100)
        else:
            verdict, confidence = "uncertain", 50

        return {"verdict": verdict, "confidence": confidence, "evidence": evidence}