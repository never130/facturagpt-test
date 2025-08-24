import cv2
import mediapipe as mp
import numpy as np
import os
from math import dist

# Altura real del sujeto en cm (ajústalo según la persona de la foto)
altura_real_cm = 170

# Rutas
image_path = "silueta.jpg"
output_txt = "medidas.txt"

# Verificar que la imagen existe
if not os.path.exists(image_path):
    print(f"Error: No se encontró la imagen '{image_path}'")
    exit(1)

# Leer imagen y convertir a RGB
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
img_height, img_width = image.shape[:2]

# Inicializar MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)
results = pose.process(image_rgb)

if not results.pose_landmarks:
    print("No se detectó cuerpo en la imagen.")
    exit(1)

# Obtener landmarks
landmarks = results.pose_landmarks.landmark
def get_point(name):
    lm = landmarks[mp_pose.PoseLandmark[name]]
    return int(lm.x * img_width), int(lm.y * img_height)

# Puntos clave
L_SHOULDER = get_point("LEFT_SHOULDER")
R_SHOULDER = get_point("RIGHT_SHOULDER")
L_ELBOW = get_point("LEFT_ELBOW")
R_ELBOW = get_point("RIGHT_ELBOW")
L_HIP = get_point("LEFT_HIP")
R_HIP = get_point("RIGHT_HIP")
L_ANKLE = get_point("LEFT_ANKLE")
R_ANKLE = get_point("RIGHT_ANKLE")
NOSE = get_point("NOSE")

# Calcular altura total (de la nariz al tobillo más bajo)
top_y = NOSE[1]
bottom_y = max(L_ANKLE[1], R_ANKLE[1])
altura_px = bottom_y - top_y
escala_px_to_cm = altura_real_cm / altura_px

# Medidas en píxeles (mejoradas)
ancho_hombros_px = dist(L_SHOULDER, R_SHOULDER) * 1.2  # deltoide a deltoide (20% extra)
biceps_izq_px = dist(L_SHOULDER, L_ELBOW)
biceps_der_px = dist(R_SHOULDER, R_ELBOW)
cintura_px = dist(L_HIP, R_HIP)
espalda_px = dist(L_SHOULDER, R_SHOULDER) * 1.15  # aproximación visual de la espalda

# Conversión a cm
def px_to_cm(px):
    return round(px * escala_px_to_cm, 2)

medidas_cm = {
    "Ancho de hombros (deltoide a deltoide)": px_to_cm(ancho_hombros_px),
    "Bíceps izquierdo": px_to_cm(biceps_izq_px),
    "Bíceps derecho": px_to_cm(biceps_der_px),
    "Ancho de cintura": px_to_cm(cintura_px),
    "Ancho de espalda (aprox)": px_to_cm(espalda_px)
}

# Guardar resultados en archivo .txt
with open(output_txt, "w") as f:
    f.write("MEDIDAS CORPORALES (en centímetros):\n\n")
    for k, v in medidas_cm.items():
        f.write(f"{k}: {v} cm\n")

print(f"✅ Medidas guardadas en '{output_txt}'")

# (Opcional) Dibujar puntos
for p in [L_SHOULDER, R_SHOULDER, L_ELBOW, R_ELBOW, L_HIP, R_HIP, L_ANKLE, R_ANKLE, NOSE]:
    cv2.circle(image, p, 5, (0, 255, 0), -1)

# Mostrar la imagen con los puntos clave
cv2.imshow("Puntos clave del cuerpo", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
