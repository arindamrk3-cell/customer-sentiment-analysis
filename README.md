# Customer Sentiment Analysis Dashboard

A modern AI-powered customer sentiment analysis web app built using **Flask + React + Tailwind CSS**.

## 🚀 Features

- Single review sentiment analysis
- CSV upload for bulk review analysis
- Smart keyword insights
- Review history tracking
- Modern premium UI dashboard
- Positive / Negative / Neutral sentiment classification

## 🛠 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Flask
- Flask-CORS
- VaderSentiment
- Pandas

## 📂 Project Structure

```bash
customer_sentiment_analysis/
│
├── backend/
│   ├── app.py
│   ├── model_utils.py
│   └── requirements.txt
│
├── frontend/
│   └── sentiment-ui/
│       ├── src/
│       ├── package.json
│       └── ...
│
├── .gitignore
└── README.md
```

## ▶️ How to Run

### Backend
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend/sentiment-ui
npm install
npm run dev
```

## 📌 Sample CSV Format

```csv
review
This product is amazing
Worst experience ever
Good but expensive
```

## 📈 Future Improvements

- User authentication
- Admin dashboard
- Download reports
- Advanced NLP insights
- Deployment on Render / Vercel

---
Made with Flask + React