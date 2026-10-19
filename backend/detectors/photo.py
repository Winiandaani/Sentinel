import io
from PIL import Image, ExifTags
from transformers import pipeline

# Two detectors that make different kinds of mistakes
MODELS = {
    "Model A": "Ateeqq/ai-vs-human-image-detector",
    "Model B": "buildborderless/CommunityForensics-DeepfakeDet-ViT",
}
detectors = {name: pipeline("image-classification", model=model_id) for name, model_id in MODELS.items()}

# Words that mean "AI" in a model's labels
AI_LABEL_WORDS = ["ai", "fake", "artificial", "generated", "synthetic"]

# Names of AI tools that sometimes appear inside image metadata
AI_TOOL_NAMES = [
    "midjourney", "dall-e", "dall·e", "stable diffusion", "firefly",
    "imagen", "flux", "ideogram", "leonardo", "openai", "chatgpt", "gemini",
]


def check_metadata(image_bytes):
    findings = []
    signal = "none"  # "ai", "real" or "none"

    image = Image.open(io.BytesIO(image_bytes))

    # EXIF: camera information saved by phones and cameras
    exif = image.getexif()
    tags = {ExifTags.TAGS.get(key, key): value for key, value in exif.items()}
    make = str(tags.get("Make", "")).strip("\x00 ")
    model = str(tags.get("Model", "")).strip("\x00 ")
    software = str(tags.get("Software", ""))

    # Extra text some AI tools hide inside PNG files
    hidden_text = " ".join(str(v) for v in image.info.values() if isinstance(v, str))

    # Look for AI tool names
    all_text = (software + " " + hidden_text).lower()
    for name in AI_TOOL_NAMES:
        if name in all_text:
            findings.append(f"Metadata mentions an AI tool: '{name}'")
            signal = "ai"
            break

    # Look for camera info
    if make or model:
        findings.append(f"Camera info found: {make or ''} {model or ''}".strip())
        if signal != "ai":
            signal = "real"
    else:
        findings.append("No camera information in metadata")

    if "parameters" in image.info:
        findings.append("Image contains a saved generation prompt")
        signal = "ai"

    return {"signal": signal, "findings": findings}


def get_ai_score(detector, image):
    predictions = detector(image)

    # Some models give one number: the chance the image is AI
    if len(predictions) == 1:
        return predictions[0]["score"]

    # Others give two labels; find the "AI" one
    for p in predictions:
        label = p["label"].lower()
        if any(word in label for word in AI_LABEL_WORDS) and "human" not in label:
            return p["score"]
    return 0.0


def check_with_models(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return {name: get_ai_score(det, image) for name, det in detectors.items()}