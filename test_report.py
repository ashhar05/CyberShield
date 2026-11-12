
from report import generate_report

# Sample conversation for testing
message = """
You are stupid and worthless.
Stop messaging me.
"""

# Sample scores for testing the PDF layout
# These are dummy values, not model predictions.
analysis = {
    "profanity_vulgarity": 0.1562,
    "targeted_abuse_harassment": 0.8489,
    "discriminatory_hate_speech": 0.0197,
    "caste": 0.0078,
    "communal_religious": 0.0172,
    "regional_xenophobic": 0.0169,
    "misogyny_gender": 0.0105
}

# Generate PDF
output = generate_report(
    message=message,
    analysis=analysis,
    output_path="test_report.pdf",
    screenshot_path="sample.png"
)

print("PDF generated successfully!")
print("File:", output)
