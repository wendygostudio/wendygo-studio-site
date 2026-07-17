$ErrorActionPreference = 'Stop'

try {
  $Version = Invoke-RestMethod -Uri 'http://127.0.0.1:9222/json/version' -TimeoutSec 3
  $RawTargets = (Invoke-WebRequest -Uri 'http://127.0.0.1:9222/json/list' -UseBasicParsing -TimeoutSec 3).Content
  $ParsedTargets = ConvertFrom-Json -InputObject $RawTargets
  $Targets = @()
  foreach ($Target in $ParsedTargets) { $Targets += $Target }
} catch {
  Write-Error 'El Chrome de pruebas no está abierto o no responde en el puerto local 9222.'
  exit 1
}

$SlimeForge = @($Targets | Where-Object {
  $_.url -like 'chrome-extension://*' -and ($_.title -like '*SlimeForge*' -or $_.url -like '*/sw.js')
})

Write-Host "Chrome: $($Version.Browser)" -ForegroundColor Cyan
Write-Host "Protocolo: $($Version.'Protocol-Version')"
Write-Host "Objetivos visibles: $($Targets.Count)"

if ($SlimeForge.Count -gt 0) {
  Write-Host 'SlimeForge detectada en el perfil de pruebas.' -ForegroundColor Green
  $SlimeForge | Select-Object type, title, url | Format-Table -AutoSize
  exit 0
}

Write-Warning 'Chrome está abierto, pero todavía no aparece SlimeForge. Revisa chrome://extensions/.'
exit 2
