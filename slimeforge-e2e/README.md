# Perfil de pruebas de SlimeForge

Este entorno abre una instancia aislada de Google Chrome. No comparte cuentas,
cookies, historial, permisos ni almacenamiento con el Chrome personal.

## Abrir

Haz doble clic en `ABRIR-PRUEBAS.cmd`, o ejecuta desde PowerShell:

```powershell
& "C:\Users\Damian\wendygo-site\slimeforge-e2e\launch-slimeforge-test.ps1"
```

La extensión cargada automáticamente es:

`C:\Users\Damian\wendygo-site\slimeforge-v1.5.1-fresh-test`

Aunque la carpeta conserva su nombre histórico, el manifiesto identifica la
extensión como `SlimeForge 1.7.0 · FRESH TEST`.

## Primera apertura

1. Abre `chrome://extensions/` y confirma que aparece SlimeForge 1.7.0.
2. Fija SlimeForge a la barra de Chrome.
3. Instala y habilita la ChatGPT Chrome Extension en este perfil si quieres que
   Codex controle sus páginas de prueba.
4. No inicies sesión ni actives sincronización: este perfil debe seguir aislado.

## Comprobar

Con el Chrome de pruebas abierto, haz doble clic en
`COMPROBAR-PRUEBAS.cmd`, o ejecuta:

```powershell
& "C:\Users\Damian\wendygo-site\slimeforge-e2e\check-slimeforge-test.ps1"
```

## Cerrar

Haz doble clic en `CERRAR-PRUEBAS.cmd`, o ejecuta:

```powershell
& "C:\Users\Damian\wendygo-site\slimeforge-e2e\close-slimeforge-test.ps1"
```

El cierre conserva el perfil y la partida. La carpeta `chrome-profile` está
excluida del repositorio y nunca debe incluirse en los ZIP de SlimeForge.

## Seguridad

La depuración escucha únicamente en `127.0.0.1:9222`. No se expone a la red
local. El perfil está dentro del workspace y se puede eliminar manualmente
cuando ya no sea necesario.
