#!/bin/bash
# ═══════════════════════════════════════════════════
# LE FLORENTIN — Script de build images
# Convertit les images source en WebP/AVIF, 3 tailles
# Requiert: sharp-cli (npm i -g sharp-cli) ou squoosh-cli
# ═══════════════════════════════════════════════════

set -e

INPUT_DIR="./img/originals"
OUTPUT_DIR="./img"
WIDTHS=(640 1024 1920)

# Couleurs pour le terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}═══ Le Florentin — Build Images ═══${NC}"
echo ""

# Vérifier que le dossier source existe
if [ ! -d "$INPUT_DIR" ]; then
  echo "Création du dossier source: $INPUT_DIR"
  mkdir -p "$INPUT_DIR"
  echo "Placez vos images originales dans $INPUT_DIR et relancez ce script."
  exit 0
fi

# Vérifier que sharp-cli est installé
if ! command -v sharp &> /dev/null; then
  echo "sharp-cli n'est pas installé."
  echo "Installation: npm install -g sharp-cli"
  echo ""
  echo "Alternative: npx @aspect-build/rules_js sharp-cli"
  exit 1
fi

# Traiter chaque image
for img in "$INPUT_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  [ -f "$img" ] || continue

  filename=$(basename "$img")
  name="${filename%.*}"

  echo -e "${GREEN}Traitement: $filename${NC}"

  for width in "${WIDTHS[@]}"; do
    # JPEG (fallback)
    sharp -i "$img" -o "${OUTPUT_DIR}/${name}-${width}w.jpg" resize "$width" -- --quality 80
    echo "  ✓ ${name}-${width}w.jpg"

    # WebP
    sharp -i "$img" -o "${OUTPUT_DIR}/${name}-${width}w.webp" resize "$width" -- --webp.quality 80
    echo "  ✓ ${name}-${width}w.webp"

    # AVIF
    sharp -i "$img" -o "${OUTPUT_DIR}/${name}-${width}w.avif" resize "$width" -- --avif.quality 65
    echo "  ✓ ${name}-${width}w.avif"
  done

  echo ""
done

echo -e "${YELLOW}═══ Build terminé ═══${NC}"
echo "Images générées dans $OUTPUT_DIR"
echo ""
echo "Tailles générées par image:"
echo "  - 640w  (mobile)"
echo "  - 1024w (tablet)"
echo "  - 1920w (desktop)"
echo ""
echo "Formats générés:"
echo "  - AVIF  (priorité, meilleure compression)"
echo "  - WebP  (fallback navigateurs anciens)"
echo "  - JPEG  (fallback universel)"
