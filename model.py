
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Hugging Face model identifier
MODEL_ID = "darelphilip/hinglish-toxicity-classifier"

# Select execution device
DEVICE = torch.device("cpu")

print("Initializing CyberShield AI...")

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

# Load pretrained model
model = AutoModelForSequenceClassification.from_pretrained(MODEL_ID)

# Move model to selected device
model.to(DEVICE)

# Set evaluation mode
model.eval()

print("CyberShield AI is ready!")


def analyze_text(text):

    # Convert text into numerical tokens
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True
    )

    # Move inputs to the selected device
    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }

    # Perform inference
    with torch.no_grad():
        outputs = model(**inputs)

    # Convert logits into scores
    scores = torch.sigmoid(outputs.logits)[0]

    # Prepare readable results
    results = {}

    for index, score in enumerate(scores):
        label = model.config.id2label[index]
        results[label] = round(score.item(), 4)

    return results
