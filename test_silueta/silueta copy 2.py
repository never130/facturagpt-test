import cv2
import mediapipe as mp
import numpy as np
import os

# Ruta de la imagen original
image_path = "silueta.jpg"

# Verificar que la imagen existe
if not os.path.exists(image_path):
    print(f"Error: No se encontró la imagen '{image_path}'")
    exit(1)

# Leer la imagen y convertir a RGB
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Inicializar MediaPipe Selfie Segmentation
mp_selfie_segmentation = mp.solutions.selfie_segmentation
with mp_selfie_segmentation.SelfieSegmentation(model_selection=1) as segmenter:
    results = segmenter.process(image_rgb)

# Obtener la máscara de segmentación
mask = results.segmentation_mask

# Crear máscara binaria: cuerpo = negro (0), fondo = blanco (255)
binary_mask = np.where(mask > 0.5, 0, 255).astype(np.uint8)
cv2.imwrite("mascara_silueta.png", binary_mask)

# Crear imagen con cuerpo real sobre fondo blanco
# 1. Convertimos la máscara flotante en binaria booleana (True=cuerpo)
body_mask = mask > 0.5

# 2. Creamos fondo blanco
white_background = np.ones_like(image, dtype=np.uint8) * 255

# 3. Combinar imagen original y fondo blanco usando la máscara
silueted_body = np.where(body_mask[..., None], image, white_background)
cv2.imwrite("silueted_body.png", silueted_body)

print("Archivos generados:")
print("- mascara_silueta.png (silueta negra)")
print("- silueted_body.png (torso recortado con fondo blanco)")

# Mostrar las imágenes (opcional)
cv2.imshow("Original", image)
cv2.imshow("Mascara Silueta", binary_mask)
cv2.imshow("Silueta Recortada", silueted_body)
cv2.waitKey(0)
cv2.destroyAllWindows()
