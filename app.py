from flask import Flask, render_template, request, jsonify
from tehilim import buscar_salmo
import os
import json
from google import genai

app = Flask(__name__)
client = genai.Client()

DOCUMENT_CACHE = "cache_data.json"


@app.route('/')
def index():
    get_daily_tehilim = buscar_salmo()
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
        
        Por favor, proporciona un análisis breve (no mas de 10 renglones) estructurado exactamente en tres partes:
        1. **Perspectiva Reformada:** Una interpretación contemporánea y progresista de los versículos, enfocada en los valores éticos universales.
        2. **Aplicación Individual:** Cómo puede una persona aplicar esta enseñanza en su crecimiento personal, espiritualidad y vida diaria (resaltando la autonomía de la conciencia).
        3. **Aplicación Social (Tikún Olam):** Cómo se traduce esta enseñanza en responsabilidad comunitaria, justicia social, inclusión y mejora de la sociedad.
        
        Mantén un tono inspirador, respetuoso y conciso. Separa los puntos con saltos de linea cuando finalice cada uno para distinguirlos.
        Evita decir "aqui esta un analisis" o palabras de ese estilo, por favor.
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        final_analisis = response.text

        new_cache = {
            "idRead": id_reading_today,
            "analisis": final_analisis
        }
        with open(DOCUMENT_CACHE, "w", encoding="utf-8") as f:
            json.dump(new_cache, f, ensure_ascii=False, indent=4)
    
    return jsonify({"analisis": final_analisis})



if __name__ == '__main__':
    app.run(debug=True)