from flask import Flask, render_template, request, jsonify
from tehilim import buscar_salmo
import os
import json
from google import genai
from google.genai import types

app = Flask(__name__)
client = genai.Client()

DOCUMENT_CACHE = "cache_data.json"


@app.route('/')
def index():
    get_daily_tehilim = buscar_salmo()
    if get_daily_tehilim == "Hoy no se proporcionara salmo":
        tehilim_number = "Hoy no hay lectura"
        tehilim_content = " "
    else:
        tehilim_number = get_daily_tehilim["nombre"]
        tehilim_content = get_daily_tehilim["descripcion"]

    return render_template('index.html', te_number=tehilim_number,
                                        te_cont=tehilim_content)


@app.route('/obtener-analisis', methods=['POST'])
def obtener_analisis():
    data_received = request.get_json()
    id_reading_today = data_received.get('idRead')

    cache = {}
    if os.path.exists(DOCUMENT_CACHE):
        with open(DOCUMENT_CACHE, "r", encoding="utf-8") as f:
            cache = json.load(f)

    if cache.get('idRead') == id_reading_today:
        final_analisis = cache["analisis"]
    else:
        prompt = f"""
        Eres un erudito y rabino del Judaísmo Reformado. 
        Analiza la Parashá del siguiente fragmento:
        
        Versículos a analizar:
        "{id_reading_today}"
        
        Por favor, proporciona un análisis breve (no mas de 6 renglones en total) estructurado exactamente en tres partes.
        Devuelve la respuesta estrictamente en un formato JSON con la siguiente estructura de llaves:
        {{
            "perspectiva_reformada": "Tu texto aquí...",
            "aplicacion_individual": "Tu texto aquí...",
            "aplicacion_social": "Tu texto aquí..."
        }}

        Mantén un tono inspirador, respetuoso y conciso. 
        Evita introducciones como "aquí está el análisis". Devuelve solo el objeto JSON directo.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        final_analisis = response.text

        new_cache = {
            "idRead": id_reading_today,
            "analisis": final_analisis
        }
        with open(DOCUMENT_CACHE, "w", encoding="utf-8") as f:
            json.dump(new_cache, f, ensure_ascii=False, indent=4)
    
    analisis_obj = json.loads(final_analisis)
    
    return jsonify(analisis_obj)



if __name__ == '__main__':
    app.run(debug=True)