import cv2
import mediapipe as mp
import numpy as np
import os

# Ruta de la imagen
image_path = "silueta.jpg"

# Verificar que la imagen existe
if not os.path.exists(image_path):
    print(f"Error: No se encontró la imagen '{image_path}'")
    exit(1)

# Leer la imagen y convertir a RGB
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Inicializar el modelo de segmentación de MediaPipe
mp_selfie_segmentation = mp.solutions.selfie_segmentation
with mp_selfie_segmentation.SelfieSegmentation(model_selection=1) as segmenter:
    results = segmenter.process(image_rgb)

# Obtener la máscara de segmentación
mask = results.segmentation_mask

# Crear una máscara binaria: cuerpo = negro (0), fondo = blanco (255)
binary_mask = np.where(mask > 0.5, 0, 255).astype(np.uint8)

# Guardar la máscara en disco
output_path = "mascara_silueta.png"
cv2.imwrite(output_path, binary_mask)

print(f"Mascara generada correctamente y guardada como '{output_path}'")

# Mostrar las imágenes (opcional)
cv2.imshow("Imagen original", image)
cv2.imshow("Mascara Silueta", binary_mask)
cv2.waitKey(0)
cv2.destroyAllWindows()
