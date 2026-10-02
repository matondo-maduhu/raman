from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({
        "app": "Raman",
        "status": "running",
        "message": "Karibu Raman!"
    })

@app.route("/api/forms")
def forms():
    return jsonify([
        {
            "id": "birth-certificate",
            "name": "Birth Certificate",
            "description": "Jaza taarifa za cheti cha kuzaliwa"
        },
        {
            "id": "aadhaar-update",
            "name": "Aadhaar Update",
            "description": "Sasisha taarifa"
        },
        {
            "id": "pan-card",
            "name": "PAN Card",
            "description": "Jaza taarifa za PAN Card"
        }
    ])

if __name__ == "__main__":
    app.run()
