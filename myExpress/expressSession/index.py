import os
import json

# Ruta de la carpeta que contiene los archivos JSON
carpeta_respuestas = "respuestasAndroid"

# Inicializamos variables para el cálculo
total_respuestas = 0
respuestas_correctas = 0
contador_respuestas = {}
tiempos = []

# Itera sobre los archivos en la carpeta
for archivo in os.listdir(carpeta_respuestas):
    if archivo.endswith(".json"):
        ruta_archivo = os.path.join(carpeta_respuestas, archivo)

        # Abre y carga el archivo JSON
        with open(ruta_archivo, "r") as archivo_json:
            datos_lista = json.load(archivo_json)

            # Procesa cada objeto en la lista
            for datos in datos_lista:
                total_respuestas += 1
                pregunta = datos.get("pregunta")
                correcta = datos.get("correcta")
                tiempo = datos.get("tiempo")

                # Agrega el tiempo a la lista
                tiempos.append(tiempo)

                if correcta:
                    respuestas_correctas += 1

                # Actualiza el contador de respuestas
                if pregunta in contador_respuestas:
                    contador_respuestas[pregunta] += 1
                else:
                    contador_respuestas[pregunta] = 1

# Calcula el porcentaje de respuestas correctas 
porcentaje_correctas = (respuestas_correctas / total_respuestas) * 100 if total_respuestas > 0 else 0


# Encuentra la pregunta más acertada y la menos acertada
pregunta_mas_acertada = max(contador_respuestas, key=contador_respuestas.get)
pregunta_menos_acertada = min(contador_respuestas, key=contador_respuestas.get)

# TIEMPO TOTAL 
tiempo_total = sum(tiempos)
media_por_pregunta = tiempo_total / total_respuestas if total_respuestas > 0 else 0


# Crea una cadena de texto con los resultados separados por saltos de línea
resultados = []
resultados.append("Porcentaje medio de preguntas correctas: {:.2f}%".format(porcentaje_correctas))
# Agrega las preguntas más y menos acertadas a la lista de resultados
resultados.append("Pregunta mas acertada: {}".format(pregunta_mas_acertada))
resultados.append("Pregunta menos acertada: {}".format(pregunta_menos_acertada))

# Agrega los resultados de tiempo
resultados.append("Tiempo total de todas las preguntas: {} segundos".format(tiempo_total))
resultados.append("Media por pregunta: {:.2f} segundos".format(media_por_pregunta))

# Combina los resultados en una sola cadena separada por saltos de línea
resultados_completos = "\n".join(resultados)

# Imprime los resultados
print(resultados_completos)