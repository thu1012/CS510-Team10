import google.generativeai as genai  # type: ignore

# Set your API key here
API_KEY = "AIzaSyBniucNqgWVP89EbCJeh-OPg22Owq5GDV4"

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-lite')

def call_gemini(prompt: str) -> str:
    """
    Sends a prompt to the Gemini API and returns the response as a string.

    Args:
        prompt (str): The input prompt to send to the model.

    Returns:
        str: The AI-generated response text.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error during API request: {e}")
        return ""
