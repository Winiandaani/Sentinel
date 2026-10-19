import os
from PIL import Image
from transformers import pipeline

# The models we are comparing
MODELS = {
    "M1": "Ateeqq/ai-vs-human-image-detector",
    "M2": "buildborderless/CommunityForensics-DeepfakeDet-ViT",
}

AI_LABEL_WORDS = ["ai", "fake", "artificial", "generated", "synthetic"]
FOLDERS = {"real": "testset/real", "ai": "testset/ai"}
IMAGE_TYPES = (".jpg", ".jpeg", ".png", ".webp")


def get_ai_score(detector, image):
    predictions = detector(image)
    if len(predictions) == 1:
        return predictions[0]["score"]
    for p in predictions:
        label = p["label"].lower()
        if any(word in label for word in AI_LABEL_WORDS) and "human" not in label:
            return p["score"]
    return 0.0


# Load both models once
print("Loading models...")
detectors = {name: pipeline("image-classification", model=model_id) for name, model_id in MODELS.items()}

# Report cards: M1, M2, and AVG (both models combined)
report = {
    name: {"correct": 0, "total": 0, "false_alarms": 0, "missed": 0}
    for name in list(MODELS) + ["AVG"]
}

print("\nTRUTH | FILE                          | M1    | M2    | AVG")
print("-" * 65)

for truth, folder in FOLDERS.items():
    for filename in sorted(os.listdir(folder)):
        if not filename.lower().endswith(IMAGE_TYPES):
            continue

        image = Image.open(os.path.join(folder, filename)).convert("RGB")

        # Score from each model, plus their average
        scores = {name: get_ai_score(det, image) for name, det in detectors.items()}
        scores["AVG"] = sum(scores.values()) / len(MODELS)

        # Update each report card
        for name, score in scores.items():
            guess = "ai" if score >= 0.5 else "real"
            card = report[name]
            card["total"] += 1
            if guess == truth:
                card["correct"] += 1
            elif truth == "real":
                card["false_alarms"] += 1  # real photo wrongly called AI
            else:
                card["missed"] += 1  # AI image wrongly called real

        print(f"{truth.upper():5} | {filename[:29]:29} | {scores['M1']:.2f}  | {scores['M2']:.2f}  | {scores['AVG']:.2f}")

# Final summary
print("\n===== REPORT CARD =====")
for name, card in report.items():
    accuracy = card["correct"] / card["total"] * 100 if card["total"] else 0
    print(
        f"{name:4} accuracy: {accuracy:5.1f}%  |  "
        f"false alarms (real called AI): {card['false_alarms']}  |  "
        f"missed fakes (AI called real): {card['missed']}"
    )