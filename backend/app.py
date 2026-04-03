from flask import Flask, request, jsonify
from flask_cors import CORS
from model_utils import predict_sentiment
import pandas as pd

app=Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return "Customer Sentiment Analysis Backend Running!"
@app.route("/analyze",methods=['POST'])
def analyze():
    try:
        data=request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "Text is required"}), 400
        text=data["text"].strip()
        if text=="":
            return jsonify({"error": "Empty text"}), 400
        prediction=predict_sentiment(text)
        return jsonify({
            "text":text,
            "sentiment": prediction["sentiment"],
            "confidence": prediction["confidence"]
        })
    except Exception as e:
        print("Error:",str(e))
        return jsonify({"error":"Something went wrong"}),500
@app.route("/analyze_csv",methods=['POST'])
def analyze_csv():
    try:
        if "file" not in request.files:
            return jsonify({"error":"No file is uploaded"}),400
        file=request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400
        df=pd.read_csv(file)
        print("CSV Columns:", df.columns.tolist())  # debug line
        if "review" not in df.columns:
            return jsonify({"error": "CSV must have 'review' column"}),400
        result=[]
        for text in df['review']:
            text = str(text).strip()
            if text:
                prediction=predict_sentiment(text)
                result.append({
                    "text":text,
                    "sentiment":prediction['sentiment'],
                    "confidence":prediction['confidence']
                })
        return jsonify(result)
    except Exception as e:
        print("CSV error:",str(e))
        return jsonify({"error": "CSV processing failed"}), 500

if __name__=="__main__":
    app.run(debug=True)