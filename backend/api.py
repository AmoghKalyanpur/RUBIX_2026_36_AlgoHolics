from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- 1. Import this
from main import load_data, add_features, run_trend_analysis, run_monte_carlo
from genai_explainer import generate_explanation

app = FastAPI()

# ==========================================
#  CORS CONFIGURATION (Add this block)
# ==========================================
origins = [
    "http://localhost:3000",  # Your Next.js Frontend
    "http://127.0.0.1:3000",
    "http://localhost:9002",
    "http://127.0.0.1:9002",  # Alternative localhost URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, etc.
    allow_headers=["*"],  # Allows all headers
)
# ==========================================

@app.get("/technical/{ticker}")
def technical_analysis(ticker: str):
    # (Your existing code below is perfect, no changes needed here)
    try:
        df = load_data(ticker)
        df = add_features(df)

        trend = run_trend_analysis(df)
        mc = run_monte_carlo(df)

        ai_text = generate_explanation({
            "trend": trend["trend"],
            "signal": trend["signal"],
            "confidence": trend["confidence"],
            "rsi": trend["rsi"],
            "risk_lower": mc["lower"],
            "risk_upper": mc["upper"]
        })

        return {
            "trend": trend["trend"],
            "confidence": trend["confidence"],
            "signal": trend["signal"],
            "ai_insight": ai_text
        }
    except Exception as e:
        return {"error": str(e)}