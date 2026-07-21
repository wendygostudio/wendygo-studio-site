# Wendygo Studio — Agente Autónomo de Contenido y SEO

## Guía Completa de Configuración

---

## 1. Requisitos Previos

### Software necesario

- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **Git** → probablemente ya lo tienes
- **Claude Code** → CLI agéntica de Anthropic

### Cuentas y API Keys necesarias

| Servicio | Para qué | Coste estimado |
|----------|----------|----------------|
| **Anthropic API** | Claude Code (el cerebro) | ~2-8€/día según uso |
| **GitHub** | Repositorio + deploy | Gratis |
| **Netlify o Vercel** | Hosting con auto-deploy | Gratis (tier free) |
| **Google Search Console** | Datos de SEO | Gratis |
| **Twitter/X API** | Publicación automática | Free tier (limitado) o Basic (100$/mes) |
| **Plausible o Umami** | Analytics respetuoso con privacidad | ~9€/mes o self-hosted gratis |

---

## 2. Instalación Paso a Paso

### 2.1 Instalar Claude Code

```bash
# Instalar Claude Code globalmente
npm install -g @anthropic-ai/claude-code

# Verificar instalación
claude --version
```

### 2.2 Configurar la API Key de Anthropic

```bash
# Opción A: Variable de entorno (recomendado)
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxxx"

# Opción B: Añadir al .bashrc/.zshrc para que persista
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxxx"' >> ~/.bashrc
source ~/.bashrc
```

> **Obtener la API key:**
> 1. Ve a [console.anthropic.com](https://console.anthropic.com)
> 2. Settings → API Keys → Create Key
> 3. Añade saldo (empieza con 10-20€ para probar)

### 2.3 Preparar el Repositorio

```bash
# Crear el repo del sitio web
mkdir wendygo-site && cd wendygo-site
git init

# Estructura básica del sitio (el agente la ampliará)
mkdir -p content/blog content/guides public src
touch src/index.html

# Conectar con GitHub
gh repo create wendygo-studio-site --public --source=. --push
# O manualmente:
# git remote add origin git@github.com:TU_USUARIO/wendygo-studio-site.git
```

### 2.4 Configurar Deploy Automático (Netlify)

```bash
# Opción A: CLI de Netlify
npm install -g netlify-cli
netlify login
netlify init
# Seleccionar: "Create & configure a new site"
# Build command: (dejar vacío si es estático)
# Publish directory: public/

# Opción B: Desde la web de Netlify
# 1. netlify.com → New site from Git
# 2. Conectar repo de GitHub
# 3. Deploy settings: publish dir = "public/"
```

### 2.5 Configurar Twitter/X API (Opcional)

```bash
# 1. Ve a developer.x.com → crea un proyecto
# 2. Genera las 4 claves:
export TWITTER_API_KEY="tu-api-key"
export TWITTER_API_SECRET="tu-api-secret"
export TWITTER_ACCESS_TOKEN="tu-access-token"
export TWITTER_ACCESS_SECRET="tu-access-secret"

# 3. Instalar la dependencia para el script de posting
pip install tweepy --break-system-packages
```

### 2.6 Configurar Google Search Console

1. Ve a [search.google.com/search-console](https://search.google.com/search-console)
2. Añade tu dominio
3. Verifica con DNS TXT record
4. Para acceso API: crea credenciales OAuth2 en Google Cloud Console
5. Descarga el JSON de credenciales y guárdalo como `config/gsc-credentials.json`

---

## 3. Estructura del Proyecto

```
wendygo-agent/
├── config/
│   ├── agent.env              # Variables de entorno
│   └── gsc-credentials.json   # Credenciales Google (no commitear)
├── scripts/
│   ├── orchestrator.sh        # Script principal (lanza el agente)
│   ├── daily-seo.sh           # Rutina diaria de SEO
│   ├── weekly-review.sh       # Revisión semanal
│   ├── twitter-post.py        # Publicación en Twitter/X
│   └── analytics-fetch.py     # Leer analytics
├── prompts/
│   ├── system-prompt.md       # Prompt de sistema del agente
│   ├── daily-seo.md           # Prompt para rutina SEO diaria
│   ├── weekly-review.md       # Prompt para revisión semanal
│   └── twitter-content.md     # Prompt para contenido Twitter
├── logs/
│   └── YYYY-MM-DD.log         # Logs diarios (auto-generados)
├── journal/
│   └── YYYY-MM-DD.md          # Diario público del agente (auto)
└── docs/
    └── SETUP_GUIDE.md          # Esta guía
```

---

## 4. Ejecución

### Primera ejecución (manual, para verificar que todo funciona)

```bash
cd wendygo-agent
chmod +x scripts/*.sh
./scripts/orchestrator.sh --dry-run
```

### Configurar el Cron Job (ejecución automática diaria)

```bash
# Editar crontab
crontab -e

# Añadir estas líneas:

# Rutina SEO diaria a las 8:00 AM (hora Canarias)
0 8 * * * /ruta/a/wendygo-agent/scripts/daily-seo.sh >> /ruta/a/wendygo-agent/logs/cron.log 2>&1

# Revisión semanal los lunes a las 9:00 AM
0 9 * * 1 /ruta/a/wendygo-agent/scripts/weekly-review.sh >> /ruta/a/wendygo-agent/logs/cron-weekly.log 2>&1

# Tweet diario a las 14:00 (hora punta engagement España)
0 14 * * * /ruta/a/wendygo-agent/scripts/twitter-post.py >> /ruta/a/wendygo-agent/logs/twitter.log 2>&1
```

---

## 5. Control de Costes

### Límites de seguridad

El script `orchestrator.sh` incluye:

- **Max tokens por ejecución:** 50.000 (configurable)
- **Max coste diario:** ~5€ (configurable, el script para si se excede)
- **Kill switch:** Crea un archivo `STOP` en la raíz para detener todo

```bash
# Parada de emergencia
touch /ruta/a/wendygo-agent/STOP

# Reanudar
rm /ruta/a/wendygo-agent/STOP
```

### Estimación de costes mensuales

| Componente | Coste |
|-----------|-------|
| Anthropic API (Claude Sonnet) | 60-150€/mes |
| Netlify hosting | 0€ |
| Dominio (si nuevo) | ~12€/año |
| Twitter API (free tier) | 0€ |
| Plausible analytics | 0-9€/mes |
| **Total estimado** | **60-160€/mes** |

> **Tip:** Usa Claude Sonnet en vez de Opus para las tareas rutinarias.
> La calidad es excelente para SEO/contenido y el coste es ~5x menor.

---

## 6. Monitorización

### Ver qué está haciendo el agente

```bash
# Último log
cat logs/$(date +%Y-%m-%d).log

# Último diario público
cat journal/$(date +%Y-%m-%d).md

# Estado general
./scripts/orchestrator.sh --status
```

### Métricas clave a seguir

- **Semana 1-2:** Páginas indexadas en Google (Search Console)
- **Semana 2-4:** Primeras impresiones en Search Console
- **Mes 2-3:** Primeros clics orgánicos, keywords rankeando
- **Mes 3+:** Crecimiento de tráfico, conversiones (instalaciones de extensiones)

---

## 7. Seguridad y Buenas Prácticas

- **Nunca** commitees API keys al repo (usa `.env` y `.gitignore`)
- Revisa los logs al menos 2-3 veces por semana al principio
- El agente NO debe tener acceso a tu cuenta bancaria, email personal, ni nada sensible
- El diario público es tu mecanismo de transparencia — léelo
- Si el agente empieza a generar contenido raro, activa el kill switch y revisa el prompt
