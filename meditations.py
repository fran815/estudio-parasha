import os
import json

directorio = os.path.dirname(__file__)
ruta = os.path.join(directorio, "meditations.json")

def buscar_archivo_json(ruta):
    if os.path.exists(ruta):
        with open(ruta, "r", encoding="utf-8") as f:
            return json.load(f)