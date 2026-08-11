---
schemaVersion: 1
title: Come ridimensionare un'immagine per X post (Twitter) in Chrome (1200×675)
description: >-
  Pubblica immagini alla dimensione corretta di 1200×675 px senza che nulla
  venga ritagliato nel feed X. FrameForge si ridimensiona nel tuo browser: senza
  caricamento, senza Photoshop.
date: 2026-06-27T00:00:00.000Z
slug: resize-image-for-x-twitter-post
locale: it
translationKey: resize-image-for-x-twitter-post
product: frameforge
contentType: how-to
primaryKeyword: come ridimensionare l'immagine per x post su Twitter
relatedPages: /it/frameforge/
---X esegue il rendering delle immagini dei tweet con un ritaglio 2:1 nell'anteprima del feed. Nelle foto quadrate viene tagliata la metà inferiore. I ritratti vengono compressi in una scomoda sezione centrale. La soluzione è semplice: pubblica a 1200×675 px (16:9) e nulla verrà ritagliato né nell'anteprima del feed né nella visualizzazione espansa a dimensione intera.

FrameForge è un'estensione di Chrome che ridimensiona completamente le immagini nel tuo browser. Nessun caricamento, nessun account, nessuna attesa per un server remoto per elaborare il tuo file.

## Requisiti relativi alle dimensioni delle immagini X (Twitter).

| Format | Dimensions | Aspect ratio |
|--------|------------|--------------|
| Standard post image | 1200×675 px | 16:9 |
| Feed preview crop | ~2:1 center | — |
| Max file size | 5 MB (JPG/PNG) | — |
| Accepted formats | JPG, PNG, WebP, GIF | — |

1200×675 è il punto debole: riempie esattamente il ritaglio dell'anteprima 2:1 e l'immagine completa viene mostrata senza letter-boxing o pillar-boxing quando lo spettatore la espande.

## Perché le immagini quadrate e verticali vengono ritagliate

X applica un ritaglio centrale durante la visualizzazione di immagini in linea nel feed. Un'immagine quadrata 1:1 diventa una sezione 2:1: il quarto superiore e quello inferiore scompaiono. Le immagini con ritratto (9:16) vengono ritagliate ancora più duramente: perdi circa l'80% dell'altezza dell'immagine nell'anteprima del feed.

Il dimensionamento a 1200×675 elimina la mancata corrispondenza. L'immagine è già in formato 16:9, quindi l'anteprima del feed in formato 2:1 mostra solo l'intera larghezza ad altezza normale, senza ritagli imprevisti.

## Passo dopo passo: ridimensiona per X con FrameForge

1. **Installa FrameForge**: installalo dal Chrome Web Store e aggiungilo alla barra degli strumenti.
2. **Apri la tua immagine**: fai clic sull'icona FrameForge, quindi apri il file o trascinalo sull'area di disegno.
3. **Seleziona la preimpostazione X Post (Twitter)**: nel menu a discesa Piattaforma, seleziona X Post. La tela si blocca a 1200×675 px.
4. **Regola il ritaglio**: trascina la sovrapposizione del ritaglio per centrare il soggetto nel fotogramma 16:9.
5. **Esporta**: fai clic su Esporta. FrameForge salva l'immagine ridimensionata nella cartella Download.

## Gestione delle immagini di origine verticale

Le foto di ritratti (9:16, impostazione predefinita della fotocamera del telefono) richiedono la massima regolazione per adattarsi a un fotogramma 16:9:

- **Ritaglia per riempire (consigliato):** Il fotogramma 16:9 viene riempito completamente. L'eccesso dalla parte superiore e inferiore viene tagliato. Trascina la sovrapposizione del ritaglio per mantenere l'elemento chiave nella cornice.
- **Compatibile con imbottitura:** È visibile il ritratto completo, con barre nere o colorate a sinistra e a destra. L'imbottitura intenzionale può sembrare intenzionale, ma le barre nude di solito sembrano un errore.
- **Allunga per riempire:** Distorce l'immagine orizzontalmente. Da evitare a meno che la distorsione non sia una scelta stilistica deliberata.

Per le immagini di origine paesaggio più larghe di 16:9 (ritaglio cinematografico, panorami), l'eccesso viene tagliato da sinistra e destra. Stessa logica: trascina la sovrapposizione per centrare il soggetto.

## Il flusso di lavoro di ridimensionamento della piattaforma social

Se pubblichi lo stesso contenuto su più piattaforme nello stesso giorno, FrameForge li copre tutti da un'unica estensione:

| Platform | Target size | Preset |
|----------|-------------|--------|
| X (Twitter) | 1200×675 px | X Post |
| YouTube | 1280×720 px | YouTube Thumbnail |
| Instagram (square) | 1080×1080 px | Instagram Post |
| Twitch panels | 320×160 px | Twitch Panel |

Ridimensiona una volta per piattaforma, esporta ogni versione in pochi clic, senza cambiare strumento o caricare su servizi separati.

## Domande frequenti

**Qual è la dimensione migliore dell'immagine per un post su X (Twitter)?**
1200×675px a 16:9. Ciò riempie l'anteprima del feed senza ritagliarla e viene visualizzata a dimensioni intere quando viene espansa. Mantieni il file sotto i 5 MB per JPG/PNG.

**X ritaglia le immagini nel feed?**
SÌ. X applica un ritaglio centrale alle immagini in linea nel feed tweet, rendendole a circa 2:1. Le immagini pubblicate a 1200×675 px (16:9) corrispondono alle proporzioni dell'anteprima del feed e vengono visualizzate senza ritagli imprevisti.

**FrameForge carica immagini su un server?**
No. FrameForge è un'estensione di Chrome che elabora le immagini interamente nel tuo browser. Niente viene inviato a nessun server. Non è richiesto alcun account.

**Posso utilizzare la stessa immagine per X e YouTube?**
Le miniature di YouTube sono 1280×720 px e i post X sono 1200×675 px: entrambi sono 16:9, quindi la composizione è identica. FrameForge ha preimpostazioni per entrambi, quindi puoi esportare due versioni dalla stessa immagine sorgente senza ritagliare nuovamente.

**FrameForge è gratuito?**
SÌ. FrameForge può essere installato gratuitamente dal Chrome Web Store. La versione gratuita include preimpostazioni della piattaforma e ridimensionamento del core. Pro aggiunge la sovrapposizione di testo e l'elaborazione batch.
