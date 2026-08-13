# Habilitar la medición

## Estado actual

- **Search Console:** operativo mediante la cuenta de servicio y el fichero
  `config/google-service-account.json`. No necesitas crear otra OAuth para el
  flujo normal.
- **GA4:** la API y el refrescador están preparados, pero la cuenta de servicio
  todavía necesita acceso Viewer/Lector en las seis propiedades.
- **Chrome Web Store:** no se obtiene mediante este refrescador. Hay que añadir
  la exportación oficial del Developer Dashboard.

## 1. GA4: acción que falta

En Google Analytics, repite estos pasos para cada propiedad de la lista:

1. Selecciona la propiedad de Chrome Web Store.
2. Abre **Administrador → Gestión de accesos a la propiedad**.
3. Pulsa **+ → Añadir usuarios**.
4. Introduce exactamente:

   `wendygo-seo-reader@project-d87fed0e-c2d8-4b88-9ae.iam.gserviceaccount.com`

5. Asigna **Lector / Viewer** y guarda.

Hazlo para estas seis propiedades: `545660427`, `545672353`, `545687208`,
`545699943`, `545719916` y `545724339`.

Comprueba también en Google Cloud, en el proyecto
`project-d87fed0e-c2d8-4b88-9ae`, que **Google Analytics Data API** está
habilitada. No hace falta dar permisos de Editor ni Administrador.

Después, desde la raíz del repositorio, ejecuta:

```powershell
node .integration/seo-agent/scripts/fetch-analytics.mjs
```

El resultado esperado es `GA4 6 properties`. Si una propiedad falla con 403,
ese correo no tiene Viewer en ella. Si falla con 401, revisa la clave de la
cuenta de servicio o el proyecto. El script no borra una exportación anterior
cuando la consulta falla.

## 2. Search Console: qué comprobar

No cambies nada mientras el refrescador funcione. La cuenta de servicio ya debe
estar añadida como **Usuario restringido** o con lectura en la propiedad
`https://wendygostudio.com/`:

`wendygo-seo-reader@project-d87fed0e-c2d8-4b88-9ae.iam.gserviceaccount.com`

Ejecuta el mismo comando anterior. Debe mostrar páginas y consultas GSC. Si
devuelve 403, vuelve a añadir ese correo en Search Console; si devuelve 401,
revisa la cuenta de servicio. La inspección de cobertura por idioma se hace
después con el sitemap actualizado; no requiere otra API distinta.

## 3. Chrome Web Store: dato que falta

Para cada extensión:

1. Entra en **Chrome Web Store Developer Dashboard**.
2. Abre la extensión y su sección de **Analytics/Statistics**.
3. Elige el mismo intervalo semanal que use el Daily.
4. Exporta el informe CSV/XLSX disponible.
5. Guarda los archivos fuera de `public/`, preferentemente en
   `.integration/measurement/cws/`.

El export debe conservar, cuando estén disponibles: extensión, periodo,
impresiones de ficha, instalaciones, desinstalaciones, usuarios activos,
país/idioma y versión publicada. Nómbralo, por ejemplo,
`slimeforge-2026-08-13.csv`.

Chrome Web Store es la fuente oficial de instalaciones; GA4 sirve para el
comportamiento dentro de la extensión y no lo sustituye.

## No hacer

- No añadir una cuenta OAuth personal como sustituto de la cuenta de servicio
  sin documentarlo.
- No asignar roles Editor/Administrador.
- No interpretar un error de permisos como cero usuarios.
- No commitear `agent.env`, tokens, claves JSON ni secretos.
