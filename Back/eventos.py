from google import genai
import time

def encontrar_eventos(client, user_info):
    prompt = f"""
    
    """
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt
    )
    return response.text, time.time()    
