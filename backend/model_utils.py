# from transformer import pipeline
# sentiment_opipeline=pipeline("sentiment-analysis")
# def predict_sentiment(text):
#     result=sentiment_opipeline(text)[0]
#     return (
#         "sentiment":result["label"],
#         "confidence":round(result["score"],4)
#     )
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyser=SentimentIntensityAnalyzer()
def predict_sentiment(text):
    scores=analyser.polarity_scores(text)
    compound=scores["compound"]
    if compound>=.5:
        sentiment = "POSITIVE"
    elif compound <= -0.05:
        sentiment = "NEGATIVE"
    else:
        sentiment = "NEUTRAL"
    confidence = abs(compound)
    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 4)
    }
