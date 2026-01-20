import os
import time
from google import genai
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# 2. Initialize the Client
client = genai.Client(api_key=api_key)

def generate_explanation(context_data):
    prompt = f"""
    You are a financial analysis explanation assistant.

    Rules:
    - Do not give financial advice.
    - Do not suggest buying or selling.
    - Explain only what is provided in the data.
    - Keep the explanation under 4 sentences.
    - the currency is INR (Indian Rupee).
    Analysis Data:
    {context_data}

    Explanation:
    """

    # --- RETRY LOGIC (The Fix) ---
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            # We use 'gemini-flash-latest' as it is often the most stable alias
            response = client.models.generate_content(
                model="gemini-flash-latest", 
                contents=prompt
            )
            return response.text.strip()

        except Exception as e:
            error_msg = str(e)
            
            # Check if it is a Speed Limit (429) error
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                wait_time = 40 # Wait 40 seconds (safely more than the 38s required)
                print(f"⚠️ Quota hit. Pausing for {wait_time}s before retry {attempt+1}/{max_retries}...")
                time.sleep(wait_time)
            else:
                # If it's a real crash (not just a timer), fail immediately
                return f"AI Analysis Error: {error_msg}"
    
    return "AI Unavailable: Request timed out after multiple retries."

# Test Block
if __name__ == "__main__":
    print("Testing connection with Retry Logic...")
    test_data = {"trend": "UP", "rsi": 55, "price": 1450}
    print(generate_explanation(test_data))