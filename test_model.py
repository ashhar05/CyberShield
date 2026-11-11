
from model import analyze_text

message = "Tum bahut kamine ho"

print("Analysing message:", message)

results = analyze_text(message)

print("\nCyberShield Analysis Results:")

for category, score in results.items():
    print(f"{category}: {score}")
