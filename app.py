
from ocr import extract_text
from PIL import Image
from flask import Flask, request, jsonify, send_from_directory

# Import our ML prediction function
from model import analyze_text

app = Flask(__name__)


@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/style.css")
def stylesheet():
    return send_from_directory(".", "style.css")


@app.route("/script.js")
def javascript():
    return send_from_directory(".", "script.js")


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "message": "CyberShield backend is running!"
    })


@app.route("/api/analyze", methods=["POST"])
def analyze_message():

    # Receive JSON data from frontend
    data = request.get_json(silent=True) or {}

    message = data.get("message", "")

    # Validate input
    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "status": "error",
            "message": "Please provide a valid message."
        }), 400

    # Perform actual AI analysis
    try:
        results = analyze_text(message.strip())

        return jsonify({
            "status": "success",
            "message": "AI analysis completed successfully!",
            "character_count": len(message.strip()),
            "analysis": results
        })

    except Exception as error:
        print("AI analysis error:", error)

        return jsonify({
            "status": "error",
            "message": "Something went wrong during AI analysis."
        }), 500


@app.route("/api/extract", methods=["POST"])
def extract_image_text():

    # Check whether an image was uploaded
    if "image" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No image uploaded."
        }), 400

    image_file = request.files["image"]

    # Check whether the selected file is empty
    if image_file.filename == "":
        return jsonify({
            "status": "error",
            "message": "Please select an image."
        }), 400

    try:
        # Open uploaded image using Pillow
        image = Image.open(image_file.stream)

        # Extract text using our OCR function
        extracted_text = extract_text(image)

        return jsonify({
            "status": "success",
            "extracted_text": extracted_text
        })

    except Exception as error:
        print("OCR error:", error)

        return jsonify({
            "status": "error",
            "message": "Could not extract text from this image."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
