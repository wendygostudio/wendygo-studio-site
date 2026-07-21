# Publicación en Dev.to

Hoy es {{TODAY}}. Adapta el artículo principal de hoy y publícalo en Dev.to.

## Proceso

1. Lee el journal de hoy en `{{JOURNAL_DIR}}/{{TODAY}}.md` para saber qué artículo se creó.
2. Lee el artículo principal en `public/blog/`.
3. Crea una versión ADAPTADA (NO copia) para Dev.to:
   - Título: puede ser más casual/clickable que el original
   - Contenido: 400-600 palabras, ángulo ligeramente diferente
   - Formato: Markdown (Dev.to usa Markdown nativo)
   - Al final incluye: "📖 Read the full guide with more details on [wendygostudio.com](https://wendygostudio.com/blog/slug/)"
   - NO copies el artículo entero — resume, cambia el enfoque, o cuenta la misma historia desde otro ángulo
4. Tags: máximo 4, relevantes. Ejemplos: chrome, extension, productivity, webdev, tutorial, javascript, beginners, devtools
5. Publica con el script:

```bash
node {{AGENT_DIR}}/scripts/devto-post.js --file "TITULO" "RUTA_AL_MARKDOWN" "tag1,tag2,tag3,tag4" "URL_CANONICA"
```

6. Documenta en el journal qué publicaste en Dev.to.

## Restricciones
- Máximo 1 publicación en Dev.to por ejecución
- 400-600 palabras, NO más
- NUNCA copies el artículo original completo — Dev.to y Google penalizan contenido duplicado
- La clave DEVTO_API_KEY vive en `{{AGENT_DIR}}/config/agent.env` (NO en la raíz del agente). NO compruebes su existencia leyendo archivos: simplemente ejecuta el script del paso 5. Si la clave falta de verdad, el script fallará con "DEVTO_API_KEY not set" — en ese caso documéntalo en el journal y continúa.
- Si el artículo principal no existe todavía, salta y documéntalo
- NUNCA atribuyas funcionalidades falsas a los productos
- Si el script devto-post.js devuelve error 422, significa que ese canonical ya existe en Dev.to. Documéntalo en el journal y sigue — NO es un error grave.
- Usa siempre el artículo creado HOY como fuente, nunca artículos de días anteriores.
