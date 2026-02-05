from google import genai
from google.genai import types
from google.genai.errors import ClientError
import time
from credenciales import api_key
from noticias import generar_noticias
from generar_desafio_diario import generar_desafio_diario
from review_code import review_code
from generar_pista import generar_pista

client = genai.Client(api_key=api_key())

informacion_usuario = {
    "nombre": "Bernardo",
    "edad": 21,
    "intereses": ["Machine Learning", "Sim Racing", "AWS", "Backend"],
    "nivel": "Intermedio", 
    "lenguajes": ["Python", "C++", "C# (Unity)"] 
}

desafios_anteriores = [
    "Calculadora de Propinas",
    "Filtro de Ruido en Telemetría",
    "Validación de Palíndromos"
]

urls_noticias = [
    "https://cnnespanol.cnn.com/ciencia/tecnologia",
    "https://www.xataka.com",
    "https://www.kdnuggets.com/",
    "https://medium.com/",
    "https://www.forbes.com/technology/"
]
codigo = """
def buscar_elemento(lista, elemento):
    for i in range(len(lista)):
        if lista[i] == elemento:
            return i
    return -1
"""
lenguaje = "Python"
noticias = generar_noticias(client, urls_noticias, informacion_usuario)
respuesta_desafio = generar_desafio_diario(client, informacion_usuario, desafios_anteriores)
revisar_codigo = review_code(codigo, lenguaje, client, informacion_usuario)
pista = generar_pista(codigo, lenguaje, client, informacion_usuario)

