from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main import load_data, add_features, run_trend_analysis, run_monte_carlo
from genai_explainer import generate_explanation
# 1. IMPORT THE BACKTESTER
from backtester import run_backtest_strategy
import yfinance as yf
app = FastAPI()

# ==========================================
#  CORS CONFIGURATION
# ==========================================
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:9002",
    "http://127.0.0.1:9002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
#  ENDPOINT 1: REAL-TIME ANALYSIS (Trend Tab)
# ==========================================
@app.get("/technical/{ticker}")
def technical_analysis(ticker: str):
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

# ==========================================
#  ENDPOINT 2: BACKTEST SIMULATOR (Backtest Tab)
# ==========================================
@app.get("/backtest/{ticker}")
def backtest_analysis(ticker: str, period: str = "6mo"):
    """
    Runs the Hybrid ML Backtest.
    Example: /backtest/RELIANCE?period=1y
    """
    try:
        # Calls the function from backtester.py
        # The function now returns { chart_data, stats, tradeLog, summary }
        # We pass this dictionary directly to the frontend
        result = run_backtest_strategy(ticker, period=period)
        return result
    except Exception as e:
        return {"error": str(e)}

# ==========================================
#  ENDPOINT 3: COMPANY OVERVIEW (New!)
# ==========================================
@app.get("/overview/{ticker}")
def get_company_overview(ticker: str):
    try:
        if not ticker.endswith(".NS"):
            ticker = ticker + ".NS"
            
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Extract safely (handle missing data)
        current_price = info.get("currentPrice") or info.get("regularMarketPrice") or 0
        prev_close = info.get("previousClose") or 0
        market_cap = info.get("marketCap") or 0
        pe_ratio = info.get("trailingPE") or 0
        high_52 = info.get("fiftyTwoWeekHigh") or 0
        low_52 = info.get("fiftyTwoWeekLow") or 0
        description = info.get("longBusinessSummary") or "No description available."
        
        # Calculate change
        price_change = current_price - prev_close
        change_percent = (price_change / prev_close) * 100 if prev_close else 0
        
        return {
            "current_price": round(current_price, 2),
            "price_change": round(price_change, 2),
            "change_percent": round(change_percent, 2),
            "market_cap": market_cap,
            "pe_ratio": round(pe_ratio, 2) if pe_ratio else "N/A",
            "high_52": round(high_52, 2),
            "low_52": round(low_52, 2),
            "description": description
        }
    except Exception as e:
        return {"error": str(e)}    
# ... existing imports ...

# ==========================================
#  ENDPOINT 4: HISTORICAL DATA (New!)
# ==========================================
@app.get("/history/{ticker}")
def get_stock_history(ticker: str, period: str = "1y"):
    try:
        if not ticker.endswith(".NS"):
            ticker = ticker + ".NS"
            
        # Fetch daily data
        df = yf.download(ticker, period=period, interval="1d", progress=False)
        
        if df.empty:
            return {"error": "No historical data found"}
            
        # Clean up data for frontend
        df = df[["Close"]].reset_index()
        df.columns = ["Date", "Close"] # Rename for simplicity
        
        # Convert to list of dictionaries
        history_data = []
        for index, row in df.iterrows():
            history_data.append({
                "date": row["Date"].strftime("%Y-%m-%d"),
                "close": round(row["Close"], 2)
            })
            
        return history_data
        
    except Exception as e:
        return {"error": str(e)}
import google.generativeai as genai
import json
import os

# Ensure your API Key is loaded
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ==========================================
#  ENDPOINT 5: AI-SIMULATED LIVE TICKER
# ==========================================
@app.get("/news/ticker")
def live_market_ticker():
    """
    Uses Gemini to generate realistic 'Live' Indian market headlines.
    """
    try:
        # We use Gemini Flash for speed
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """
        Generate 8 short, realistic "breaking news" headlines for the Indian Stock Market (Nifty 50, Sensex, Bank Nifty, and top stocks like Reliance/TCS).
        
        Requirements:
        1. Mix of Positive (Bullish), Negative (Bearish), and Neutral news.
        2. Keep headlines under 10 words.
        3. Output strictly valid JSON format.
        
        Output Structure:
        [
            {"title": "Nifty reclaims 22,000 mark amid heavy buying", "sentiment": "positive"},
            {"title": "TCS shares dip 2% after quarterly results miss", "sentiment": "negative"}
        ]
        
        Return ONLY the JSON array. No markdown formatting.
        """
        
        response = model.generate_content(prompt)
        
        # Clean the response text (remove markdown backticks if Gemini adds them)
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "")
        
        data = json.loads(cleaned_text)
        return data

    except Exception as e:
        print(f"AI Error: {e}")
        # Reliable Fallback if AI fails
        return [
            {"title": "Sensex rallies 500 points on global cues", "sentiment": "positive"},
            {"title": "Banking stocks under pressure ahead of RBI policy", "sentiment": "negative"},
            {"title": "Rupee opens flat against US Dollar", "sentiment": "neutral"},
            {"title": "Reliance Industries hits fresh 52-week high", "sentiment": "positive"},
            {"title": "FIIs sell equities worth ₹2,000 Cr on Monday", "sentiment": "negative"}
        ]