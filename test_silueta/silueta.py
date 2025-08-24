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
output_image = "silueted_lines.png"

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
NOSE = get_point("NOSE")
L_ANKLE = get_point("LEFT_ANKLE")
R_ANKLE = get_point("RIGHT_ANKLE")

# Calcular altura total (de la nariz al tobillo más bajo)
top_y = NOSE[1]
bottom_y = max(L_ANKLE[1], R_ANKLE[1])
altura_px = bottom_y - top_y
escala_px_to_cm = altura_real_cm / altura_px

def px_to_cm(px):
    return round(px * escala_px_to_cm, 2)

# Ancho de hombros (deltoide a deltoide)
ancho_hombros_px = dist(L_SHOULDER, R_SHOULDER)

# Función para medir ancho del bíceps (horizontal entre hombro y codo), luego multiplicar por 2 para contorno
def medir_contorno_biceps(shoulder, elbow):
    y_medio = (shoulder[1] + elbow[1]) // 2
    x_izq = min(shoulder[0], elbow[0])
    x_der = max(shoulder[0], elbow[0])
    ancho_biceps_px = x_der - x_izq
    contorno = ancho_biceps_px * 2  # multiplicar por 2 para contorno
    # Puntos para línea horizontal en bíceps (desde x_izq a x_der a la altura y_medio)
    pt1 = (x_izq, y_medio)
    pt2 = (x_der, y_medio)
    return contorno, pt1, pt2

cont_biceps_izq_px, biceps_izq_pt1, biceps_izq_pt2 = medir_contorno_biceps(L_SHOULDER, L_ELBOW)
cont_biceps_der_px, biceps_der_pt1, biceps_der_pt2 = medir_contorno_biceps(R_SHOULDER, R_ELBOW)

# Línea de cintura justo debajo del ombligo, de extremo a extremo de la imagen
# Definimos ombligo como punto medio entre ambas caderas
y_ombligo = int((L_HIP[1] + R_HIP[1]) / 2)
# Bajamos 5% de la altura de la imagen para situar la línea justo debajo del ombligo
y_cintura = y_ombligo + int(0.05 * img_height)
cintura_pt1 = (0, y_cintura)
cintura_pt2 = (img_width - 1, y_cintura)
ancho_cintura_px = cinturan_pt2[0] - cinturan_pt1[0]

# Ancho de espalda (deltoide a deltoide, sin ampliación)
ancho_espalda_px = ancho_hombros_px * 1.15

# Convertir a cm
medidas_cm = {
    "Hombros": px_to_cm(ancho_hombros_px),
    "Bíceps Izquierdo": px_to_cm(cont_biceps_izq_px),
    "Bíceps Derecho": px_to_cm(cont_biceps_der_px),
    "Cintura": px_to_cm(ancho_cintura_px),
    "Espalda": px_to_cm(ancho_espalda_px)
}

def draw_line_with_measure(img, pt1, pt2, medida_cm, color=(0, 0, 255)):
    cv2.line(img, pt1, pt2, color, 3)
    mid_x = (pt1[0] + pt2[0]) // 2
    mid_y = (pt1[1] + pt2[1]) // 2
    texto = f"{medida_cm} cm"
    (w, h), _ = cv2.getTextSize(texto, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
    # Fondo blanco para legibilidad
    cv2.rectangle(img, (mid_x - w//2 - 5, mid_y - h - 5), (mid_x + w//2 + 5, mid_y + 5), (255, 255, 255), -1)
    cv2.putText(img, texto, (mid_x - w//2, mid_y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

# Dibujo líneas y medidas

# Hombros (deltoide a deltoide)
draw_line_with_measure(image, L_SHOULDER, R_SHOULDER, medidas_cm["Hombros"])

# Bíceps Izquierdo
draw_line_with_measure(image, biceps_izq_pt1, biceps_izq_pt2, medidas_cm["Bíceps Izquierdo"])

# Bíceps Derecho
draw_line_with_measure(image, biceps_der_pt1, biceps_der_pt2, medidas_cm["Bíceps Derecho"])

# Cintura (línea horizontal)
draw_line_with_measure(image, cintura_pt1, cintura_pt2, medidas_cm["Cintura"])

# Espalda (línea deltoide a deltoide un poco arriba)
espalda_pt1 = (L_SHOULDER[0], L_SHOULDER[1] - 10)
espalda_pt2 = (R_SHOULDER[0], R_SHOULDER[1] - 10)
draw_line_with_measure(image, espalda_pt1, espalda_pt2, medidas_cm["Espalda"])

# Guardar imagen con líneas y medidas
cv2.imwrite(output_image, image)
print(f"Imagen guardada como '{output_image}' con líneas y medidas.")

# Guardar medidas en archivo txt
with open(output_txt, "w") as f:
    f.write("MEDIDAS CORPORALES (en centímetros):\n\n")
    for k, v in medidas_cm.items():
        f.write(f"{k}: {v} cm\n")

print(f"Medidas guardadas en '{output_txt}'")
