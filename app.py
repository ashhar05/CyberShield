
from ocr import extract_text
from PIL import Image, UnidentifiedImageError
from flask import Flask, request, jsonify, send_from_directory
# Import our ML prediction function
from model import analyze_text
import io
import json
import tempfile
from flask import send_file
from report import generate_report

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

        # Check whether OCR found any readable text
        if not extracted_text.strip():
            return jsonify({
                "status": "error",
                "message": "No readable text found in the uploaded image."
            }), 422

        return jsonify({
            "status": "success",
            "extracted_text": extracted_text
        })

    except UnidentifiedImageError:
        return jsonify({
            "status": "error",
            "message": "Invalid image file. Please upload a valid screenshot."
        }), 400

    except Exception as error:
        print("OCR error:", error)

        return jsonify({
            "status": "error",
            "message": "Could not extract text from this image."
        }), 500

@app.route("/api/report", methods=["POST"])
def download_report():

    # Receive data from the frontend
    data = request.get_json(silent=True) or {}

    message = data.get("message", "")
    analysis = data.get("analysis", {})

    # Validate incoming data
    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "status": "error",
            "message": "No conversation text provided."
        }), 400

    if not isinstance(analysis, dict) or not analysis:
        return jsonify({
            "status": "error",
            "message": "No analysis results provided."
        }), 400

    try:
        # Create an in-memory PDF buffer
        pdf_buffer = io.BytesIO()

        # Generate the PDF using actual AI results
        generate_report(
            message=message,
            analysis=analysis,
            output_path=pdf_buffer
        )

        # Move to the beginning of the PDF buffer
        pdf_buffer.seek(0)

        # Send PDF to the browser as a download
        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="CyberShield_Analysis_Report.pdf"
        )

    except Exception as error:
        print("PDF generation error:", error)

        return jsonify({
            "status": "error",
            "message": "Could not generate the PDF report."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
