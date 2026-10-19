import re
import statistics

import torch
import torch.nn as nn
from transformers import AutoConfig, AutoModel, AutoTokenizer, PreTrainedModel

MODEL_NAME = "desklib/ai-text-detector-v1.01"


# The model's custom "wrapper", as described on its model card
class DesklibAIDetectionModel(PreTrainedModel):
    config_class = AutoConfig

    def __init__(self, config):
        super().__init__(config)
        self.model = AutoModel.from_config(config)
        self.classifier = nn.Linear(config.hidden_size, 1)
        self.post_init()

    def forward(self, input_ids, attention_mask=None):
        outputs = self.model(input_ids, attention_mask=attention_mask)
        hidden = outputs[0]
        # Average the meaning of all words into one summary
        mask = attention_mask.unsqueeze(-1).expand(hidden.size()).float()
        pooled = (hidden * mask).sum(dim=1) / mask.sum(dim=1).clamp(min=1e-9)
        return self.classifier(pooled)


# Load once, when the backend starts
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
text_model = DesklibAIDetectionModel.from_pretrained(MODEL_NAME)
text_model.eval()


def check_with_text_model(text):
    encoded = tokenizer(text, truncation=True, max_length=768, return_tensors="pt")
    with torch.no_grad():
        logits = text_model(encoded["input_ids"], attention_mask=encoded["attention_mask"])
    return torch.sigmoid(logits).item()  # 0 = human, 1 = AI


def check_writing_style(text):
    # Split into sentences at . ! or ?
    sentences = [s for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s.split()]
    lengths = [len(s.split()) for s in sentences]

    if len(lengths) < 3:
        return ["Too few sentences to measure writing rhythm"]

    variation = statistics.pstdev(lengths) / statistics.mean(lengths)

    if variation >= 0.5:
        style = "varied, more human-like"
    elif variation < 0.3:
        style = "very even, more AI-like"
    else:
        style = "moderate"

    return [
        f"Sentences: {len(lengths)}, average length {statistics.mean(lengths):.0f} words",
        f"Sentence length variation: {variation:.2f} ({style})",
    ]