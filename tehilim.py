import os
import json
from datetime import datetime as dt, timedelta

directorio = os.path.dirname(__file__)
ruta = os.path.join(directorio, "tehilim.json")

def buscar_archivo_json(ruta):
    if os.path.exists(ruta):
        with open(ruta, "r", encoding="utf-8") as f:
            return json.load(f)

cantidad_salmos = 150
data = buscar_archivo_json(ruta)

hoy = dt.now()
dia_del_anio = hoy.strftime("%j")
dia_del_anio_int = int(hoy.strftime("%j"))

def buscar_salmo():
    if hoy.weekday() == 6:
        return "Hoy no se proporcionara salmo"
    else:
        inicio_anio = dt(hoy.year, 1, 1)
        dias_transcurridos = (hoy - inicio_anio).days + 1
        fechas_del_anio = [inicio_anio + timedelta(days=x) for x in range(dias_transcurridos)]
        domingos_pasados = sum(1 for fecha in fechas_del_anio if fecha.weekday() == 6)
        dia_efectivo = dias_transcurridos - domingos_pasados

        if dia_efectivo > cantidad_salmos:
            residuo = dia_efectivo % cantidad_salmos
            salmo_actual = str(cantidad_salmos if residuo == 0 else residuo)
        else:
            salmo_actual = str(dia_efectivo)

        if len(salmo_actual) >= 1:
            return data[salmo_actual]
        else:
            return False