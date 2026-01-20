import os
import time
from google import genai
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# 2. Initialize the Client
# Note: Ensure you have the latest library: pip install -U google-genai
client = genai.Client(api_key=api_key)

def generate_explanation(context_data):
    prompt = f"""
    You are an expert quantitative technical analyst.
    
    The Data:
    {context_data}
    
    Instructions:
    1. Analyze the data and output exactly 6-8 concise bullet points.
    2. COVER THESE TOPICS:
       - **Trend Direction:** Immediate vs. Long-term trend.
       - **Strength:** Interpretation of the Confidence score.
       - **Momentum (RSI):** detailed overbought/oversold status.
       - **Volume/Volatility:** Implied market activity.
       - **Support Level:** Where to buy if it drops.
       - **Resistance Level:** Where to sell/book profit.
       - **Risk Assessment:** High, Medium, or Low risk entry.
       - **Actionable Verdict:** A final clear summary.
    3. FORMATTING: 
       - Start each point with a bullet symbol (•).
       - **CRITICAL: Put each bullet point on a new line.**
       - Do not write an intro or outro.
    
    Generate the insights now:
    """

    # --- RETRY LOGIC ---
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            # FIX: Using the specific versioned ID 'gemini-1.5-flash-001' 
            # If this fails, you can fallback to 'gemini-pro'
            response = client.models.generate_content(
                model="gemini-flash-latest", 
                contents=prompt
            )
            return response.text.strip()

        except Exception as e:
            error_msg = str(e)
            
            # Handle Quota (429) or Overload (503) or Not Found (404 - try fallback)
            if "429" in error_msg or "503" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                wait_time = 5 * (attempt + 1)
                print(f"⚠️ API Busy. Pausing for {wait_time}s...")
                time.sleep(wait_time)
            
            elif "404" in error_msg:
                 # Fallback for 404: Try the standard Pro model if Flash isn't found
                print("⚠️ Flash model not found. Falling back to Gemini Pro...")
                try:
                    response = client.models.generate_content(
                        model="gemini-pro", 
                        contents=prompt
                    )
                    return response.text.strip()
                except:
                    return f"AI Model Error: Could not find compatible model."
            
            else:
                return f"AI Analysis Error: {error_msg}"
    
    return "AI Unavailable: Service overloaded. Please try again later."

# Test Block
if __name__ == "__main__":
    print("Testing AI Connection...")
    test_data = {
        "trend": "UP", 
        "signal": "BUY", 
        "confidence": 0.85, 
        "rsi": 25.5, 
        "risk_lower": 1400, 
        "risk_upper": 1550
    }
    print(generate_explanation(test_data))