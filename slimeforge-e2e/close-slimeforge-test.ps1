$ErrorActionPreference = 'Stop'

$Profile = Join-Path $PSScriptRoot 'chrome-profile'
$ResolvedProfile = [System.IO.Path]::GetFullPath($Profile)
$Processes = @(Get-CimInstance Win32_Process | Where-Object {
  $_.Name -eq 'chrome.exe' -and $_.CommandLine -and $_.CommandLine.Contains($ResolvedProfile)
})

if ($Processes.Count -eq 0) {
  Write-Host 'El Chrome de pruebas no está abierto.'
  exit 0
}

$Processes | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Write-Host 'Chrome de pruebas cerrado. El perfil se conserva.' -ForegroundColor Green

