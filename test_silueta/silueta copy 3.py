import cv2
import mediapipe as mp
import numpy as np
import os
from math import dist

# Altura real del sujeto (en cm)
altura_real_cm = 170  # ⚠️ AJUSTA ESTO según la persona de la imagen

# Rutas
image_path = "silueta.jpg"
output_txt = "medidas.txt"

# Verificar que la imagen existe
if not os.path.exists(image_path):
    print(f"Error: No se encontró la imagen '{image_path}'")
    exit(1)

# Leer la imagen y convertir a RGB
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

# Calcular altura en píxeles (desde nariz hasta tobillo más bajo)
top_y = NOSE[1]
bottom_y = max(L_ANKLE[1], R_ANKLE[1])
altura_px = bottom_y - top_y
escala_px_to_cm = altura_real_cm / altura_px

# Medidas en píxeles (mejoradas)
ancho_hombros_px = dist(L_ELBOW, R_ELBOW) * 0.65  # más ancho, más realista
biceps_izq_px = dist(L_SHOULDER, L_ELBOW)
biceps_der_px = dist(R_SHOULDER, R_ELBOW)
cintura_px = dist(L_HIP, R_HIP)
espalda_px = dist(L_SHOULDER, R_SHOULDER) * 1.15  # estimado un poco más ancho

# Convertir a centímetros
def px_to_cm(p):
    return round(p * escala_px_to_cm, 2)

medidas_cm = {
    "Ancho de hombros (aprox)": px_to_cm(ancho_hombros_px),
    "Bíceps izquierdo": px_to_cm(biceps_izq_px),
    "Bíceps derecho": px_to_cm(biceps_der_px),
    "Ancho de cintura": px_to_cm(cintura_px),
    "Ancho de espalda (aprox)": px_to_cm(espalda_px)
}

# Guardar medidas en archivo .txt
with open(output_txt, "w") as f:
    f.write("MEDIDAS CORPORALES (cm):\n")
    for k, v in medidas_cm.items():
        f.write(f"{k}: {v} cm\n")

print(f"✅ Medidas guardadas en '{output_txt}'")

# Opcional: visualizar puntos
for p in [L_SHOULDER, R_SHOULDER, L_ELBOW, R_ELBOW, L_HIP, R_HIP, L_ANKLE, R_ANKLE, NOSE]:
    cv2.circle(image, p, 5, (0, 255, 0), -1)

cv2.imshow("Puntos clave del cuerpo", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
