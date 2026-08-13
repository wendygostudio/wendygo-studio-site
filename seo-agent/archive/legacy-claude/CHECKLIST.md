# Checklist Rápido de Puesta en Marcha

## Pre-requisitos
- [ ] Node.js v18+ instalado
- [ ] Git instalado y configurado
- [ ] Cuenta en console.anthropic.com con saldo (mínimo 10€)

## Paso 1: Instalar Claude Code
```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

## Paso 2: API Key de Anthropic
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-TU-KEY"' >> ~/.bashrc
source ~/.bashrc
```

## Paso 3: Clonar y configurar el agente
```bash
git clone TU-REPO wendygo-agent
cd wendygo-agent
cp config/agent.env.example config/agent.env
nano config/agent.env   # Rellena tu API key
```

## Paso 4: Crear el repo del sitio web
```bash
mkdir ~/wendygo-site && cd ~/wendygo-site
git init
mkdir -p content/blog content/guides public
git remote add origin git@github.com:TU_USER/wendygo-site.git
```

## Paso 5: Conectar Netlify
```bash
npm install -g netlify-cli
cd ~/wendygo-site
netlify init
# publish directory: public/
```

## Paso 6: Test
```bash
cd ~/wendygo-agent
./scripts/orchestrator.sh --dry-run
```

## Paso 7: Primera ejecución real
```bash
./scripts/orchestrator.sh daily
```

## Paso 8: Automatizar con cron
```bash
crontab -e
# Añadir:
0 8 * * * /home/TU_USER/wendygo-agent/scripts/daily-seo.sh
0 9 * * 1 /home/TU_USER/wendygo-agent/scripts/weekly-review.sh
0 14 * * * /home/TU_USER/wendygo-agent/scripts/orchestrator.sh twitter
```

## Paso 9 (opcional): Twitter/X
1. Crear app en developer.x.com
2. Rellenar las 4 keys en agent.env
3. `pip install tweepy --break-system-packages`
4. Test: `python3 scripts/twitter-post.py "Test tweet"`

## Paso 10 (opcional): Analytics
1. Añadir sitio a Google Search Console
2. Crear credenciales OAuth2 en Google Cloud Console
3. Guardar en config/gsc-credentials.json
4. `pip install google-auth google-auth-oauthlib google-api-python-client --break-system-packages`
5. Primera ejecución manual: `python3 scripts/analytics-fetch.py`
