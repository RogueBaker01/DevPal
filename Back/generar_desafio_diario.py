import time
from google import genai



def generar_desafio_diario(client, user_info, historia_desafios):
    
    lista_historial = ", ".join(historia_desafios) if historia_desafios else "Ninguno"

    lenguajes_disponibles = ", ".join(user_info["lenguajes"])

    prompt = f"""
    Actúa como una API de Generación de Desafíos de Código (Backend).

    INPUT_PARAMS:
    - Perfil del Candidato: Nivel {user_info["nivel"]}, Intereses: {", ".join(user_info["intereses"])}
    - Lenguajes Disponibles: {lenguajes_disponibles} (Elige el más adecuado para el problema)
    
    HISTORY CONSTRAINT (CRITICAL):
    El usuario YA ha resuelto los siguientes desafíos. ESTÁ PROHIBIDO generar ejercicios similares o repetidos a estos títulos:
    [{lista_historial}]

    TASK:
    Genera un micro-desafío de programación técnica NUEVO y original.

    OUTPUT FORMAT:
    Devuelve SOLAMENTE un objeto JSON válido (RFC 8259).

    SCHEMA:
    {{
      "lenguaje_seleccionado": "string (El lenguaje que elegiste de la lista)",
      "titulo": "string (Título corto)",
      "contexto_negocio": "string (Escenario real)",
      "definicion_problema": "string (Instrucción técnica)",
      "firma_funcion": "string (Código base)",
      "restricciones": {{
          "tiempo": "string",
          "memoria": "string"
      }},
      "casos_prueba": [
        {{ "input": "string", "output": "string", "tipo": "Normal" }},
        {{ "input": "string", "output": "string", "tipo": "Edge Case" }}
      ],
      "pista": "string"
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt
    )
    return response.text, time.time()