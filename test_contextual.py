
from contextual import assess_context
print("CyberShield contextual test started!")
# Sample model scores
analysis = {
    "profanity_vulgarity": 0.12,
    "targeted_abuse_harassment": 0.75,
    "discriminatory_hate_speech": 0.08,
    "caste": 0.02,
    "communal_religious": 0.03,
    "regional_xenophobic": 0.01,
    "misogyny_gender": 0.04
}

# Sample questionnaire responses
context = {
    "emotional_impact": "threatened",
    "relationship": "acquaintance",
    "repetition": "repeated",
    "intention": "intimidation"
}

result = assess_context(analysis, context)

print("\nCyberShield Enhanced Analysis\n")

print("Strongest model category:",
      result["strongest_model_category"])

print("Original model score:",
      result["strongest_model_score"])

print("\nContextual observations:")

for observation in result["contextual_observations"]:
    print("-", observation)

print("\nContextual assessment:")
print(result["contextual_assessment"])
