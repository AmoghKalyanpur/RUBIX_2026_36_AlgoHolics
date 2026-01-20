import pandas as pd
import numpy as np
import json
import sys
import yfinance as yf
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from genai_explainer import generate_explanation


# =====================================================
# DATA LOADING
# =====================================================

def load_data(ticker):

    if not ticker.endswith(".NS"):
        ticker = ticker + ".NS"

    df = yf.download(
        ticker,
        interval="1h",
        period="30d",
        progress=False
    )

    if df.empty:
        raise ValueError("Invalid ticker or no data available")

    # FIX: flatten multi-index columns
    df.columns = df.columns.get_level_values(0)

    df.reset_index(inplace=True)
    return df



# =====================================================
# FEATURE ENGINEERING
# =====================================================

def add_features(df):
    """
    Adds technical features.
    """
    df["Return"] = df["Close"].pct_change()
    df["MA3"] = df["Close"].rolling(3).mean()
    df["MA6"] = df["Close"].rolling(6).mean()
    df["Price_vs_MA"] = df["Close"] - df["MA3"]
    df["Momentum"] = df["Close"] - df["Close"].shift(3)

    # RSI
    delta = df["Close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(14).mean()
    avg_loss = loss.rolling(14).mean()
    rs = avg_gain / avg_loss

    df["RSI"] = 100 - (100 / (1 + rs))

    return df


# =====================================================
# TREND ANALYSIS (ML + RSI)
# =====================================================

def run_trend_analysis(df):
    """
    Runs ML trend prediction and RSI confirmation.
    """

    df["Target"] = (df["Close"].shift(-1) > df["Close"]).astype(int)

    feature_cols = ["Return", "MA3", "MA6", "Price_vs_MA", "Momentum"]

    df_clean = df.dropna(subset=feature_cols + ["RSI"]).copy()

    latest_row = df_clean.iloc[[-1]][feature_cols]
    latest_rsi = df_clean.iloc[-1]["RSI"]
    last_price = df_clean.iloc[-1]["Close"]

    train_df = df_clean.iloc[:-1]

    X = train_df[feature_cols]
    y = train_df["Target"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = LogisticRegression(max_iter=1000)
    model.fit(X_scaled, y)

    latest_scaled = scaler.transform(latest_row)

    prediction = model.predict(latest_scaled)[0]
    confidence = model.predict_proba(latest_scaled).max()

    trend = "UP" if prediction == 1 else "DOWN"

    # RSI confirmation
    if trend == "UP" and latest_rsi < 70:
        signal = "BUY"
    elif trend == "DOWN" and latest_rsi > 30:
        signal = "SELL"
    else:
        signal = "HOLD"

    return {
        "trend": trend,
        "confidence": round(float(confidence), 4),
        "signal": signal,
        "rsi": round(float(latest_rsi), 2),
        "price": round(float(last_price), 2)
    }


# =====================================================
# MONTE CARLO SIMULATION
# =====================================================

def run_monte_carlo(df, hours=6, simulations=1000):
    """
    Risk estimation using Monte Carlo simulation.
    """

    returns = df["Return"].dropna().tail(100)

    mean_return = returns.mean()
    std_return = returns.std()

    last_price = df["Close"].iloc[-1]

    final_prices = []

    for _ in range(simulations):
        price = last_price
        for _ in range(hours):
            r = np.random.normal(mean_return, std_return)
            price *= (1 + r)
        final_prices.append(price)

    return {
        "lower": round(float(np.percentile(final_prices, 5)), 2),
        "upper": round(float(np.percentile(final_prices, 95)), 2),
        "mean": round(float(np.mean(final_prices)), 2),
        "hours": hours
    }


# =====================================================
# MAIN CONTROLLER
# =====================================================

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py TICKER")
        return

    ticker = sys.argv[1]

    df = load_data(ticker)
    df = add_features(df)

    trend_result = run_trend_analysis(df)
    monte_carlo = run_monte_carlo(df)

    final_output = {
        "ui_summary": {
            "trend": trend_result["trend"],
            "confidence": trend_result["confidence"],
            "signal": trend_result["signal"]
        },
        "ai_context": {
            "price": trend_result["price"],
            "rsi": trend_result["rsi"],
            "risk_range": monte_carlo
        }
        
    }
    ai_insight = generate_explanation({
        "trend": trend_result["trend"],
        "signal": trend_result["signal"],
        "confidence": trend_result["confidence"],
        "rsi": trend_result["rsi"],
        "risk_lower": monte_carlo["lower"],
        "risk_upper": monte_carlo["upper"]
    })
    final_output["ai_insight"] = ai_insight

    print(json.dumps(final_output, indent=2))


if __name__ == "__main__":
    main()
