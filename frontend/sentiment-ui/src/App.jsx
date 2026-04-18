import { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [file, setFile] = useState(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      alert("Please enter some review text.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        text: text,
      });

      const analysisResult = response.data;
      setResult(analysisResult);
      setHistory((prev) => [analysisResult, ...prev]);
      setText("");
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      alert("Something went wrong while analyzing sentiment.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please upload a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/analyze_csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      
      setHistory(data);

      if (data.length > 0) {
        setResult(data[0]);
      }

      alert("CSV uploaded successfully!");
    } catch (error) {
      console.error("CSV Upload Error:", error);
      alert(error.response?.data?.error || "CSV upload failed");
    } finally {
      setLoading(false);
    }
  };

  const positiveCount = history.filter(
    (item) => item.sentiment === "POSITIVE"
  ).length;

  const negativeCount = history.filter(
    (item) => item.sentiment === "NEGATIVE"
  ).length;

  const neutralCount = history.filter(
    (item) => item.sentiment === "NEUTRAL"
  ).length;

  const chartData = [
    { name: "Positive", value: positiveCount },
    { name: "Negative", value: negativeCount },
    { name: "Neutral", value: neutralCount },
  ];

  const COLORS = ["#10B981", "#F43F5E", "#F59E0B"];

  const getSentimentStyle = (sentiment) => {
    switch (sentiment) {
      case "POSITIVE":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30";
      case "NEGATIVE":
        return "bg-rose-500/20 text-rose-300 border border-rose-400/30";
      default:
        return "bg-amber-500/20 text-amber-300 border border-amber-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-sky-300 mb-4 backdrop-blur-md">
            ✨ AI-Powered Customer Insight Engine
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-300 to-violet-400 bg-clip-text text-transparent">
            Sentiment Analysis Dashboard
          </h1>

          <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
            Analyze customer reviews instantly with a sleek AI-powered dashboard.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Input Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-2">📝 Analyze Review</h2>
            <p className="text-slate-400 text-sm mb-6">
              Paste customer feedback and detect sentiment instantly.
            </p>

            <textarea
              rows="8"
              placeholder="Type or paste customer review here..."
              className="w-full rounded-2xl bg-slate-900/80 border border-white/10 p-5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={analyzeSentiment}
              className="mt-6 w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all py-4 rounded-2xl text-lg font-semibold"
            >
              {loading ? "Analyzing..." : "🚀 Analyze Sentiment"}
            </button>

            <div className="mt-6">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700"
              />

              <button
                onClick={handleFileUpload}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition-all py-3 rounded-xl font-semibold"
              >
                Upload and Analyze CSV
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-2">📊 Latest Result</h2>
            <p className="text-slate-400 text-sm mb-6">
              Real-time AI sentiment prediction output.
            </p>

            {result ? (
              <div className="space-y-5">
                <div
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-lg font-bold ${getSentimentStyle(
                    result.sentiment
                  )}`}
                >
                  {result.sentiment}
                </div>

                <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5">
                  <p className="text-slate-300 text-lg">
                    <span className="font-semibold text-white">Confidence:</span>{" "}
                    {(result.confidence * 100).toFixed(2)}%
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5">
                  <p className="text-slate-300 leading-relaxed">
                    <span className="font-semibold text-white">Review:</span>{" "}
                    {result.text}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-slate-900/40 text-slate-400">
                No sentiment result yet. Analyze a review to see insights.
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl">
            <p className="text-slate-400 mb-3">📌 Total Reviews</p>
            <h3 className="text-4xl font-bold">{history.length}</h3>
          </div>

          <div className="rounded-3xl p-6 bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-xl">
            <p className="text-emerald-200 mb-3">😊 Positive</p>
            <h3 className="text-4xl font-bold">{positiveCount}</h3>
          </div>

          <div className="rounded-3xl p-6 bg-rose-500/10 border border-rose-400/20 backdrop-blur-xl">
            <p className="text-rose-200 mb-3">😠 Negative</p>
            <h3 className="text-4xl font-bold">{negativeCount}</h3>
          </div>

          <div className="rounded-3xl p-6 bg-amber-500/10 border border-amber-400/20 backdrop-blur-xl">
            <p className="text-amber-200 mb-3">😐 Neutral</p>
            <h3 className="text-4xl font-bold">{neutralCount}</h3>
          </div>
        </div>

        {/* Charts */}
        {/* Analytics Section */}
{history.length > 0 && (
  <div className="grid lg:grid-cols-2 gap-8 mb-10">
    {/* Sentiment Distribution */}
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-2">📈 Sentiment Distribution</h2>
      <p className="text-slate-400 text-sm mb-6">
        Visual percentage breakdown of customer sentiment.
      </p>

      <div className="space-y-6">
        {/* Positive */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-emerald-300 font-medium">Positive</span>
            <span className="text-white font-semibold">
              {history.length > 0
                ? ((positiveCount / history.length) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{
                width: `${
                  history.length > 0
                    ? (positiveCount / history.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Negative */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-rose-300 font-medium">Negative</span>
            <span className="text-white font-semibold">
              {history.length > 0
                ? ((negativeCount / history.length) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-700"
              style={{
                width: `${
                  history.length > 0
                    ? (negativeCount / history.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Neutral */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-amber-300 font-medium">Neutral</span>
            <span className="text-white font-semibold">
              {history.length > 0
                ? ((neutralCount / history.length) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700"
              style={{
                width: `${
                  history.length > 0
                    ? (neutralCount / history.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    {/* Count Summary */}
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-2">📊 Sentiment Summary</h2>
      <p className="text-slate-400 text-sm mb-6">
        Quick numeric overview of analyzed reviews.
      </p>

      <div className="grid grid-cols-1 gap-5">
        <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-5">
          <p className="text-emerald-300 text-sm mb-2">Positive Reviews</p>
          <h3 className="text-4xl font-bold">{positiveCount}</h3>
        </div>

        <div className="bg-rose-500/10 border border-rose-400/20 rounded-2xl p-5">
          <p className="text-rose-300 text-sm mb-2">Negative Reviews</p>
          <h3 className="text-4xl font-bold">{negativeCount}</h3>
        </div>

        <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-5">
          <p className="text-amber-300 text-sm mb-2">Neutral Reviews</p>
          <h3 className="text-4xl font-bold">{neutralCount}</h3>
        </div>
      </div>
    </div>
  </div>
)}

        {/* History */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-2">🕘 Recent Review History</h2>
          <p className="text-slate-400 text-sm mb-6">
            Track previously analyzed customer reviews.
          </p>

          {history.length === 0 ? (
            <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-slate-900/40 text-slate-400">
              No reviews analyzed yet.
            </div>
          ) : (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-900/70 border border-white/10 p-5 rounded-2xl hover:border-sky-400/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold w-fit ${getSentimentStyle(
                        item.sentiment
                      )}`}
                    >
                      {item.sentiment}
                    </div>

                    <span className="text-slate-400 text-sm">
                      Confidence: {(item.confidence * 100).toFixed(2)}%
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;