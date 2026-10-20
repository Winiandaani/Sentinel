import os
from detectors.text import check_with_text_model

FOLDERS = {"human": "testset/text_human", "ai": "testset/text_ai"}
MIN_WORDS = 80

report = {"correct": 0, "total": 0, "false_alarms": 0, "missed": 0}

print("\nTRUTH | FILE            | WORDS | SCORE | GUESS")
print("-" * 52)

for truth, folder in FOLDERS.items():
    for filename in sorted(os.listdir(folder)):
        if not filename.endswith(".txt"):
            continue

        with open(os.path.join(folder, filename), encoding="utf-8") as f:
            text = f.read().strip()

        words = len(text.split())
        if words < MIN_WORDS:
            print(f"{truth.upper():5} | {filename[:15]:15} | {words:5} | skipped (needs {MIN_WORDS}+ words)")
            continue

        score = check_with_text_model(text)
        guess = "ai" if score >= 0.5 else "human"

        report["total"] += 1
        if guess == truth:
            report["correct"] += 1
            mark = "✅"
        elif truth == "human":
            report["false_alarms"] += 1  # human text wrongly called AI
            mark = "❌"
        else:
            report["missed"] += 1  # AI text wrongly called human
            mark = "❌"

        print(f"{truth.upper():5} | {filename[:15]:15} | {words:5} | {score:.2f}  | {guess} {mark}")

print("\n===== TEXT REPORT CARD =====")
if report["total"]:
    accuracy = report["correct"] / report["total"] * 100
    print(f"Accuracy: {accuracy:.1f}%  ({report['correct']} of {report['total']})")
    print(f"False alarms (human called AI): {report['false_alarms']}")
    print(f"Missed (AI called human):       {report['missed']}")
else:
    print("No texts with enough words yet.")