# CyberShield 🛡️

**AI-Assisted Cyberbullying Detection and Digital Evidence Analysis**

CyberShield is a web-based application designed to analyse potentially harmful online communication using Natural Language Processing (NLP) and Machine Learning.

The application allows users to submit text or upload screenshots of conversations. It can extract text from screenshots using Optical Character Recognition (OCR), analyse the extracted or manually entered text using a pretrained multilingual toxicity classification model, and generate a downloadable PDF analysis report.

CyberShield aims to support the identification and documentation of potentially harmful online interactions. It is an analysis assistant, not a system for making definitive judgments about individuals.

## Key Features

### 1. Text-Based Analysis
- Submit text directly through the web interface.
- Analyse potentially harmful or abusive language using a pretrained machine learning model.
- Display scores across seven classification categories.

### 2. Screenshot-Based Text Extraction
- Upload screenshots of online conversations.
- Preview uploaded images before extraction.
- Extract text using Tesseract OCR.
- Review and edit extracted text before submitting it for analysis.

### 3. Seven-Category Classification

CyberShield analyses submitted text across the following categories:

1. Profanity and Vulgarity
2. Targeted Abuse and Harassment
3. Discriminatory Hate Speech
4. Caste-Based Hate
5. Communal and Religious Hate
6. Regional and Xenophobic Hate
7. Misogyny and Gender-Based Hate

### 4. PDF Report Generation
- Generate a downloadable PDF report.
- Include the submitted conversation.
- Display the seven classification scores.
- Include the report generation date and an important disclaimer.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| Machine Learning | PyTorch, Hugging Face Transformers |
| NLP Model | XLM-RoBERTa-based Hinglish Toxicity Classifier |
| OCR | Tesseract OCR, Pytesseract |
| Image Processing | Pillow |
| PDF Generation | ReportLab |
| Version Control | Git and GitHub |

## Machine Learning Model

CyberShield currently uses the pretrained model:

**`darelphilip/hinglish-toxicity-classifier`**

The model is based on XLM-RoBERTa and produces seven classification scores for submitted text.

The model is used for inference; it has not been trained from scratch as part of this project.

The displayed scores represent model outputs and should not be interpreted as calibrated probabilities or definitive evidence of cyberbullying.

## Supported Language Scope

The current implementation focuses on:
- English
- Romanized Hindi
- Hinglish written using Latin characters

Screenshot text extraction currently uses the English Tesseract language configuration. Devanagari Hindi OCR and broader regional language support are planned improvements.

## Project Architecture

The application follows a simple frontend-backend architecture:

1. The user enters text or uploads a screenshot through the frontend.
2. JavaScript sends the input to the Flask backend.
3. For screenshots, the OCR module extracts text using Tesseract.
4. The extracted or manually entered text is passed to the machine learning model.
5. The model generates classification scores.
6. The backend returns the results to the frontend.
7. The user can request a PDF report containing the submitted conversation and analysis results.

## Project Structure

```text
CyberShield/
│
├── app.py              # Flask application and API endpoints
├── model.py            # Machine learning model and text analysis
├── ocr.py              # Screenshot text extraction
├── report.py           # PDF report generation
│
├── index.html          # Main frontend page
├── style.css           # Frontend styling
├── script.js           # Frontend functionality and API requests
│
├── test_model.py       # Model testing
├── test_ocr.py         # OCR testing
├── test_report.py      # PDF generation testing
│
├── sample.png          # Sample screenshot for testing
├── README.md
└── .venv/              # Python virtual environment (not committed)
```

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Python
- Git
- Tesseract OCR
- A code editor such as Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/ashhar05/CyberShield.git
cd CyberShield
```

### 2. Create a Virtual Environment

```bash
python3 -m venv .venv
```

Activate it on macOS/Linux:

```bash
source .venv/bin/activate
```

On Windows:

```bash
.venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
pip install flask torch transformers pytesseract pillow reportlab
```

### 4. Install Tesseract OCR

On macOS, using Homebrew:

```bash
brew install tesseract
```

On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install tesseract-ocr
```

Verify the installation:

```bash
tesseract --version
```

### 5. Run the Application

Start the Flask application:

```bash
python app.py
```

Open the following address in your browser:

**http://127.0.0.1:5000**

The machine learning model weights are downloaded from Hugging Face when required and may take additional time to load on the first run.

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Serves the main application |
| `/api/health` | GET | Checks backend availability |
| `/api/analyze` | POST | Analyses submitted text |
| `/api/extract` | POST | Extracts text from an uploaded screenshot |
| `/api/report` | POST | Generates and downloads a PDF report |

## Current Limitations

- Model predictions may contain false positives and false negatives.
- The model does not fully understand sarcasm, friendly banter, or complex conversational context.
- Scores are not calibrated probabilities.
- Text Hindi OCR is not currently implemented.
- The current system does not independently establish