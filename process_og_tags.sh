#!/bin/bash

# Arrays de archivos a procesar
files=(
    "public/blog/base64-encode-kubernetes-secrets/index.html"
    "public/blog/extract-emails-from-text/index.html"
    "public/blog/extract-urls-from-text/index.html"
    "public/blog/frameforge-vs-canva-thumbnails/index.html"
    "public/blog/free-thumbnail-tool-no-login/index.html"
    "public/blog/remove-duplicate-lines-online/index.html"
    "public/blog/resize-image-for-instagram-chrome/index.html"
    "public/blog/resize-image-for-linkedin-post/index.html"
    "public/blog/resize-image-for-twitch-panel-chrome/index.html"
    "public/blog/resize-image-for-x-twitter-post/index.html"
    "public/blog/resize-image-youtube-thumbnail-chrome/index.html"
    "public/blog/sort-lines-alphabetically-online/index.html"
    "public/tools/youtube-thumbnail-checker/index.html"
    "public/es/blog/base64-codificador-decodificador-online/index.html"
    "public/es/blog/extraer-correos-desde-texto/index.html"
    "public/es/blog/ordenar-lineas-alfabeticamente-online/index.html"
    "public/es/blog/redimensionar-imagen-instagram-chrome/index.html"
    "public/es/blog/redimensionar-imagen-para-x-twitter/index.html"
    "public/blog/clean-pasted-text-formatting/index.html"
    "public/blog/resize-image-for-pinterest-pin/index.html"
    "public/es/blog/frameforge-vs-canva-thumbnails/index.html"
    "public/tools/ip-extractor/index.html"
    "public/guides/image-resizing-social-media/index.html"
    "public/guides/base64-encoding/index.html"
    "public/guides/text-data-extraction/index.html"
    "public/tools/regex-tester/index.html"
    "public/es/tools/index.html"
    "public/blog/sanitize-network-config-before-sharing/index.html"
    "public/blog/resize-image-for-tiktok-profile-picture/index.html"
    "public/es/blog/frameforge-vs-canva-miniaturas/index.html"
    "public/blog/sanitize-fortigate-config/index.html"
    "public/es/blog/remover-datos-sensibles-cisco-config/index.html"
    "public/blog/remove-sensitive-data-cisco-config/index.html"
    "public/privacy.html"
    "public/terms.html"
    "public/blog/share-network-config-support-ticket-safely/index.html"
    "public/blog/scrubforge-chatgpt-network-troubleshooting/index.html"
    "public/es/index.html"
    "public/blog/eu-warranty-rights-explained/index.html"
    "public/blog/share-network-config-reddit-safely/index.html"
    "public/es/blog/scrubforge-chatgpt-troubleshooting-red/index.html"
    "public/blog/index.html"
    "public/es/blog/index.html"
    "public/index.html"
    "public/textforge/index.html"
    "public/frameforge/index.html"
    "public/scrubforge/index.html"
    "public/claimforge/index.html"
    "public/tools/uuid-generator/index.html"
    "public/tools/index.html"
    "public/goodbye/index.html"
)

processed=0
modified=0
already_have_tags=0
modified_files=()
already_files=()

# Funciones helper
extract_title() {
    local file="$1"
    grep -oP '<title>\K[^<]+' "$file" 2>/dev/null | head -1
}

extract_description() {
    local file="$1"
    grep -oP 'name="description"\s+content="\K[^"]+' "$file" 2>/dev/null | head -1
}

calculate_url() {
    local file="$1"
    local relative="${file#public/}"
    
    if [ "$file" = "public/index.html" ]; then
        echo "https://wendygostudio.com/"
    elif [[ "$relative" == */index.html ]]; then
        relative="${relative%/index.html}"
        echo "https://wendygostudio.com/$relative"
    else
        echo "https://wendygostudio.com/$relative"
    fi
}

determine_og_type() {
    local url="$1"
    if [[ "$url" == */blog/* ]]; then
        echo "article"
    else
        echo "website"
    fi
}

check_og_tags() {
    local file="$1"
    if grep -q 'og:type\|og:title\|twitter:card' "$file" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

add_og_tags() {
    local file="$1"
    local title="$2"
    local description="$3"
    local url="$4"
    local og_type="$5"
    
    # Escapar caracteres especiales en título y descripción para sed
    local title_esc=$(printf '%s\n' "$title" | sed 's/[&/\]/\&/g')
    local desc_esc=$(printf '%s\n' "$description" | sed 's/[&/\]/\&/g')
    
    local og_tags="<meta property=\"og:type\" content=\"$og_type\">\n<meta property=\"og:title\" content=\"$title_esc\">\n<meta property=\"og:description\" content=\"$desc_esc\">\n<meta property=\"og:url\" content=\"$url\">\n<meta property=\"og:image\" content=\"https://wendygostudio.com/og-image.png\">\n<meta name=\"twitter:card\" content=\"summary_large_image\">\n<meta name=\"twitter:title\" content=\"$title_esc\">\n<meta name=\"twitter:description\" content=\"$desc_esc\">\n<meta name=\"twitter:image\" content=\"https://wendygostudio.com/og-image.png\">"
    
    sed -i "s|</head>|$og_tags\n</head>|" "$file"
}

# Procesamiento
for file in "${files[@]}"; do
    ((processed++))
    
    if [ ! -f "$file" ]; then
        echo "[$processed/51] FALTA: $file"
        continue
    fi
    
    # Verificar si ya tiene tags
    if check_og_tags "$file"; then
        echo "[$processed/51] YA TIENE TAGS: $file"
        already_files+=("$file")
        ((already_have_tags++))
        continue
    fi
    
    # Extraer datos
    title=$(extract_title "$file")
    description=$(extract_description "$file")
    
    if [ -z "$title" ] || [ -z "$description" ]; then
        echo "[$processed/51] FALTA TITLE/DESC: $file"
        continue
    fi
    
    url=$(calculate_url "$file")
    og_type=$(determine_og_type "$url")
    
    # Añadir tags
    add_og_tags "$file" "$title" "$description" "$url" "$og_type"
    
    echo "[$processed/51] MODIFICADO: $file"
    modified_files+=("$file")
    ((modified++))
done

echo ""
echo "========== RESUMEN =========="
echo "Total archivos procesados: $processed"
echo "Archivos modificados: $modified"
echo "Archivos que ya tenían tags: $already_have_tags"

if [ $modified -gt 0 ]; then
    echo ""
    echo "Archivos modificados:"
    for f in "${modified_files[@]}"; do
        echo "  - $f"
    done
fi

if [ $already_have_tags -gt 0 ]; then
    echo ""
    echo "Archivos que ya tenían tags:"
    for f in "${already_files[@]}"; do
        echo "  - $f"
    done
fi

