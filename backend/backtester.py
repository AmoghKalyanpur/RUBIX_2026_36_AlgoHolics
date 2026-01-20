import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# =====================================================
# FEATURE ENGINEERING (Same as main.py)
# =====================================================
def add_features(df):
    df["Return"] = df["Close"].pct_change()
    df["MA3"] = df["Close"].rolling(3).mean()
    df["MA6"] = df["Close"].rolling(6).mean()
    df["Price_vs_MA"] = df["Close"] - df["MA3"]
    df["Momentum"] = df["Close"] - df["Close"].shift(3)
    
    # RSI Calculation
    delta = df["Close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(14).mean()
    avg_loss = loss.rolling(14).mean()
    rs = avg_gain / avg_loss
    df["RSI"] = 100 - (100 / (1 + rs))
    
    # Target for training (Did price go up next hour?)
    df["Target"] = (df["Close"].shift(-1) > df["Close"]).astype(int)
    
    return df.dropna()

# =====================================================
# BACKTEST ENGINE
# =====================================================
def run_backtest_strategy(ticker, period="6mo", initial_capital=100000):
    # 1. Fetch Data
    if not ticker.endswith(".NS"):
        ticker = ticker + ".NS"
        
    df = yf.download(ticker, period=period, interval="1h", progress=False)
    
    if df.empty:
        return {"error": "No data found"}
        
    # Flatten columns fix
    df.columns = df.columns.get_level_values(0)
    df.reset_index(inplace=True)

    # Date Column Standardization
    if 'Datetime' in df.columns:
        df.rename(columns={'Datetime': 'Date'}, inplace=True)
    
    # 2. Add AI Features
    df = add_features(df)
    
    # 3. Setup Backtest Variables
    feature_cols = ["Return", "MA3", "MA6", "Price_vs_MA", "Momentum"]
    scaler = StandardScaler()
    model = LogisticRegression(max_iter=1000)
    
    signals = []
    
    # 4. The Loop (Walk-Forward Validation)
    start_index = 100
    retrain_frequency = 50 
    
    print(f"Starting backtest for {ticker} with {len(df)} rows...")

    for i in range(start_index, len(df)):
        
        # A. Retrain periodically
        if (i - start_index) % retrain_frequency == 0:
            train_data = df.iloc[:i] 
            X_train = train_data[feature_cols]
            y_train = train_data["Target"]
            X_train_scaled = scaler.fit_transform(X_train)
            model.fit(X_train_scaled, y_train)
        
        # B. Predict
        current_row = df.iloc[[i]][feature_cols]
        current_rsi = df.iloc[i]["RSI"]
        current_scaled = scaler.transform(current_row)
        prediction = model.predict(current_scaled)[0] 
        
        # C. Strategy Rules
        if prediction == 1 and current_rsi < 70:
            signal = 1 # BUY
        elif prediction == 0 and current_rsi > 30:
            signal = -1 # SELL
        else:
            signal = 0 # HOLD
            
        signals.append(signal)

    # 5. Calculate Returns
    padding = [0] * start_index
    df['Signal'] = padding + signals
    
    # Shift signal by 1 (trade execution delay)
    df['Strategy_Returns'] = df['Signal'].shift(1) * df['Return']
    
    # Cumulative Returns (With the Fix for Zero-Bug)
    df['Buy_Hold_Value'] = initial_capital * (1 + df['Return']).cumprod()
    df['Strategy_Returns'] = df['Strategy_Returns'].fillna(0)
    df['Strategy_Value'] = initial_capital * (1 + df['Strategy_Returns']).cumprod()
    
    # =====================================================
    # NEW: GENERATE TRADE LOG & STATS
    # =====================================================
    trade_log = []
    active_trade = None
    win_count = 0
    total_trades = 0
    
    # Extract arrays for fast looping
    signal_col = df['Signal'].values
    prices = df['Close'].values
    dates = df['Date'].dt.strftime('%Y-%m-%d %H:%M').values
    
    # Loop to find Buy/Sell events
    for i in range(start_index, len(df)):
        current_signal = signal_col[i]
        prev_signal = signal_col[i-1]
        price = round(float(prices[i]), 2)
        date = dates[i]

        # BUY EVENT: Signal changes to 1
        if current_signal == 1 and prev_signal != 1:
            active_trade = {"entry_price": price}
            trade_log.append({
                "date": date, 
                "signal": "BUY", 
                "price": price, 
                "quantity": 10, 
                "profitLoss": None 
            })

        # SELL EVENT: Signal changes from 1 to something else
        elif (current_signal == 0 or current_signal == -1) and prev_signal == 1:
            if active_trade:
                pnl = (price - active_trade["entry_price"]) * 10
                trade_log.append({
                    "date": date, 
                    "signal": "SELL", 
                    "price": price, 
                    "quantity": 10, 
                    "profitLoss": round(pnl, 2)
                })
                total_trades += 1
                if pnl > 0: win_count += 1
                active_trade = None

    # Calculate Summaries
    final_balance = df['Strategy_Value'].iloc[-1]
    total_return = ((final_balance - initial_capital) / initial_capital) * 100
    market_return = ((df['Buy_Hold_Value'].iloc[-1] - initial_capital) / initial_capital) * 100
    win_rate = (win_count / total_trades * 100) if total_trades > 0 else 0

    # 6. Format for Frontend
    result_chart = []
    for index, row in df.iloc[start_index::4].iterrows(): 
        result_chart.append({
            "date": row["Date"].strftime("%Y-%m-%d %H"),
            "ai_strategy": round(row['Strategy_Value'], 2),
            "buy_hold": round(row['Buy_Hold_Value'], 2)
        })
        
    return {
        "chart_data": result_chart,
        "stats": {
            "totalProfit": round(final_balance - initial_capital, 2),
            "profitPercent": round(total_return, 2),
            "vsMarket": round(final_balance - df['Buy_Hold_Value'].iloc[-1], 2),
            "vsMarketPercent": round(total_return - market_return, 2),
            "tradesExecuted": total_trades
        },
        "tradeLog": trade_log[-50:], # Return only last 50 trades
        "summary": {
            "totalTrades": total_trades,
            "winRate": round(win_rate, 1),
            "avgProfitLoss": round((final_balance - initial_capital) / total_trades, 2) if total_trades > 0 else 0
        }
    }