# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import joblib
import json
import os

# Load trained models
label_model = joblib.load("label_model.pkl")
type_model = joblib.load("type_model.pkl")

# Configure Gemini API
genai.configure(api_key="AIzaSyDg_EbxqAGrgiAAOBN1jZIoPVzjeeJaXvk")

app = Flask(__name__)
CORS(app)

def gemini_refine_text(text):
    prompt = f"""
    Classify the following complaint as 'urgent' or 'non-urgent'.
    Then specify a type:
    Urgent → [medical emergency, fire emergency, fights]
    Non-Urgent → [infrastructure, noise, waste]

    Text: "{text}"

    Respond ONLY with valid JSON:
    {{"label": "urgent", "type": "fire emergency"}}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)

    try:
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except:
        return {"label": "unknown", "type": "unknown"}

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()
    message = data.get("message", "")

    # Local ML predictions
    label_pred = label_model.predict([message])[0]
    type_pred = type_model.predict([message])[0]

    # Gemini refinement
    gem = gemini_refine_text(message)
    final_label = gem.get("label", label_pred)
    final_type = gem.get("type", type_pred)

    return jsonify({
        "message": message,
        "label": final_label,
        "type": final_type
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
