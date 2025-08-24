#!/bin/bash

echo "🔍 Análisis profundo de archivos no utilizados..."

SRC_DIR="./src"
EXTENSIONS=("js" "jsx" "ts" "tsx" "css" "scss" "svg")
rm -f all-files.txt used-files.txt unused-files.txt

# Paso 1: Listar todos los archivos con extensiones objetivo
echo "📁 Paso 1: Recolectando archivos reales..."
for ext in "${EXTENSIONS[@]}"; do
  find "$SRC_DIR" -type f -name "*.${ext}" >> all-files.txt
done

# Paso 2: Buscar rutas referenciadas en todo el código
echo "🔍 Paso 2: Detectando rutas referenciadas (import, require, url)..."
grep -rhoE "['\"](\.?\.?\/[^\"']+\.(js|jsx|ts|tsx|css|scss|svg))['\"]" "$SRC_DIR" > matches1.txt
grep -rhoE "url\(([^)]+)\)" "$SRC_DIR" | sed 's/url(//;s/)//;s/["'\'']//g' >> matches2.txt

cat matches1.txt matches2.txt | sort | uniq > referenced-paths.txt

> used-files.txt

# Paso 3: Resolver rutas referenciadas desde su archivo de origen
echo "🧠 Paso 3: Resolviendo rutas absolutas con realpath..."
while read -r path; do
  for ext in "${EXTENSIONS[@]}"; do
    if [ -f "$SRC_DIR/$path" ]; then
      realpath "$SRC_DIR/$path" >> used-files.txt
    elif [ -f "$SRC_DIR/${path%.*}.$ext" ]; then
      realpath "$SRC_DIR/${path%.*}.$ext" >> used-files.txt
    elif [ -f "$SRC_DIR/$path/index.$ext" ]; then
      realpath "$SRC_DIR/$path/index.$ext" >> used-files.txt
    fi
  done
done < referenced-paths.txt

# Paso 4: Añadir manualmente archivos clave
echo "✅ Añadiendo manualmente App.jsx y index.jsx..."
for entry in "$SRC_DIR/App.jsx" "$SRC_DIR/index.jsx"; do
  [ -f "$entry" ] && realpath "$entry" >> used-files.txt
done

# Paso 5: Comparar
sort all-files.txt | uniq | xargs realpath 2>/dev/null > all-files-real.txt
sort used-files.txt | uniq > used-files-real.txt

comm -23 all-files-real.txt used-files-real.txt > unused-files.txt

# Final
echo "--------------------------------------------------"
echo "✅ Archivos POTENCIALMENTE no usados:"
cat unused-files.txt
echo "--------------------------------------------------"
echo "📂 Guardado en unused-files.txt"
