
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


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
