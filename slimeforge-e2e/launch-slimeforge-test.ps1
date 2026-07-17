$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$Chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$Extension = Join-Path $Root 'slimeforge-v1.5.1-fresh-test'
$Profile = Join-Path $PSScriptRoot 'chrome-profile'

if (-not (Test-Path -LiteralPath $Chrome)) {
  throw "No se encontró Google Chrome en: $Chrome"
}
if (-not (Test-Path -LiteralPath (Join-Path $Extension 'manifest.json'))) {
  throw "No se encontró SlimeForge Fresh Test en: $Extension"
}

New-Item -ItemType Directory -Path $Profile -Force | Out-Null

$Arguments = @(
  "--user-data-dir=$Profile"
  '--profile-directory=Default'
  "--load-extension=$Extension"
  '--remote-debugging-port=9222'
  '--remote-debugging-address=127.0.0.1'
  '--no-first-run'
  '--no-default-browser-check'
  '--disable-sync'
  'chrome://extensions/'
  'https://example.com/'
)

Start-Process -FilePath $Chrome -ArgumentList $Arguments
Write-Host 'Chrome de pruebas iniciado.' -ForegroundColor Green
Write-Host "Perfil: $Profile"
Write-Host "Extensión: $Extension"
Write-Host 'Diagnóstico local: http://127.0.0.1:9222/json/version'
