
from flask import Flask, request, jsonify, send_from_directory

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
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "status": "error",
            "message": "Please provide a valid message."
        }), 400

    return jsonify({
        "status": "success",
        "message": "Input received by the Python backend.",
        "character_count": len(message.strip())
    })


if __name__ == "__main__":
    app.run(debug=True)
