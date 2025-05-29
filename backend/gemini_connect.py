import requests
import json

def generate_text_with_gemini(prompt: str, api_key: str) -> str:
    """
    Connects to the Gemini API to generate a text response based on a given prompt.

    Args:
        prompt (str): The text prompt to send to the Gemini model.
        api_key (str): Your Google Cloud API key with access to the Gemini API.

    Returns:
        str: The generated text response from the Gemini model, or an error message.
    """
    # The API endpoint for the Gemini 2.0 Flash model
    # Note: Replace 'gemini-2.0-flash' with other models if needed,
    # e.g., 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-pro'
    # Ensure you have access to the specified model.
    api_url = f"https://generativelang      uage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

    # Prepare the chat history for the payload
    # The Gemini API expects a list of content objects, each with a role and parts.
    # For a simple prompt, we just send one user message.
    chat_history = []
    chat_history.append({"role": "user", "parts": [{"text": prompt}]})

    # Construct the payload for the API request
    payload = {
        "contents": chat_history
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        # Make the POST request to the Gemini API
        response = requests.post(api_url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)

        # Parse the JSON response
        result = response.json()

        # Extract the generated text from the response
        if result.get("candidates") and len(result["candidates"]) > 0 and \
                result["candidates"][0].get("content") and \
                result["candidates"][0]["content"].get("parts") and \
                len(result["candidates"][0]["content"]["parts"]) > 0:
            generated_text = result["candidates"][0]["content"]["parts"][0]["text"]
            return generated_text
        else:
            return f"Error: Unexpected response structure from Gemini API. Response: {json.dumps(result, indent=2)}"

    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error occurred: {http_err} - Response: {response.text}"
    except requests.exceptions.ConnectionError as conn_err:
        return f"Connection error occurred: {conn_err}"
    except requests.exceptions.Timeout as timeout_err:
        return f"Timeout error occurred: {timeout_err}"
    except requests.exceptions.RequestException as req_err:
        return f"An error occurred during the API request: {req_err}"
    except json.JSONDecodeError as json_err:
        return f"Error decoding JSON response: {json_err} - Response text: {response.text}"

# --- Example Usage ---
if __name__ == "__main__":
    # IMPORTANT: Replace "YOUR_API_KEY_HERE" with your actual Google Cloud API Key.
    # Ensure this API key has access to the Generative Language API.
    # You can get an API key from the Google Cloud Console.
    my_api_key = "e"

    if my_api_key == "YOUR_API_KEY_HERE":
        print("Please replace 'YOUR_API_KEY_HERE' with your actual Google Cloud API Key.")
        print("You can obtain one from the Google Cloud Console.")
    else:
        prompt_text = "Tell me a short story about a brave knight and a wise dragon."
        print(f"Sending prompt: '{prompt_text}' to Gemini...")
        response_text = generate_text_with_gemini(prompt_text, my_api_key)
        print("\n--- Gemini's Response ---")
        print(response_text)

        print("\n--- Another Example ---")
        prompt_text_2 = "Explain the concept of quantum entanglement in simple terms."
        print(f"Sending prompt: '{prompt_text_2}' to Gemini...")
        response_text_2 = generate_text_with_gemini(prompt_text_2, my_api_key)
        print("\n--- Gemini's Response ---")
        print(response_text_2)
