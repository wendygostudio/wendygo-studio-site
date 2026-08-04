---
schemaVersion: 1
title: Como redimensionar uma imagem para posts X (Twitter) no Chrome (1200×675)
description: >-
  Publique imagens nos 1200×675 px corretos sem que nada seja cortado no feed X.
  O FrameForge é redimensionado no seu browser — sem upload, sem Photoshop.
date: 2026-06-27T00:00:00.000Z
slug: resize-image-for-x-twitter-post
locale: pt
translationKey: resize-image-for-x-twitter-post
product: frameforge
contentType: how-to
primaryKeyword: como redimensionar imagem para x post no Twitter
relatedPages: /pt/frameforge/
---

X renderiza imagens de tweet num corte de 2:1 na visualização do feed. As fotos quadradas têm a metade inferior cortada. As fotos de retrato ficam espremidas numa estranha fatia central. A correção é simples: publique a 1200×675 px (16:9) e nada será cortado na vista de feed ou na vista expandida em tamanho real.

O FrameForge é uma extensão do Chrome que redimensiona as imagens inteiramente no seu browser. Sem upload, sem conta, sem espera que um servidor remoto processe o seu ficheiro.

## Requisitos de tamanho de imagem X (Twitter)

| Format | Dimensions | Aspect ratio |
|--------|------------|--------------|
| Standard post image | 1200×675 px | 16:9 |
| Feed preview crop | ~2:1 center | — |
| Max file size | 5 MB (JPG/PNG) | — |
| Accepted formats | JPG, PNG, WebP, GIF | — |

1200×675 é o ponto ideal: preenche exatamente o corte de visualização 2:1 e a imagem completa é mostrada sem caixa de correio ou caixa de pilar quando o visualizador a expande.

## Por que razão as imagens quadradas e em retrato são cortadas

X aplica um corte central ao exibir imagens incorporadas no feed. Uma imagem quadrada 1:1 transforma-se numa fatia 2:1: o quarto superior e o quarto inferior desaparecem. As imagens de retrato (9:16) são ainda mais cortadas – perde cerca de 80% da altura da imagem na visualização do feed.

O dimensionamento para 1200×675 elimina a incompatibilidade. A imagem já está em 16:9, pelo que a pré-visualização do feed 2:1 mostra apenas a largura total à altura normal – sem cortes inesperados.

## Passo a passo: Redimensionar para X com o FrameForge

1. **Instale o FrameForge** — instale a partir da Chrome Web Store e fixe-o na sua barra de ferramentas.
2. **Abra a sua imagem** — clique no ícone do FrameForge e abra o seu ficheiro ou arraste-o para o ecrã.
3. **Selecione a predefinição X (Twitter) Post** — no menu suspenso Plataforma, selecione X Post. O ecrã é bloqueado em 1200×675 px.
4. **Ajuste o corte** — arraste a sobreposição de corte para centrar o motivo no fotograma 16:9.
5. **Exportar** — clique em Exportar. O FrameForge guarda a imagem redimensionada na pasta Downloads.

## Tratamento de imagens de origem em retrato

As fotografias de retrato (9:16, padr�o da c�mara do telefone) precisam de mais ajustes para caber num enquadramento 16:9:

- **Cortar para preencher (recomendado):** O quadro 16:9 é preenchido na íntegra. O excesso de cima e de baixo é cortado. Arraste a sobreposição de corte para manter o elemento-chave no quadro.
- **Ajuste com preenchimento:** O retrato completo é visível, com barras pretas ou coloridas à esquerda e à direita. O preenchimento intencional pode parecer deliberado, mas as barras vazias parecem muitas vezes um erro.
- **Alongar para preencher:** Distorce a imagem horizontalmente. Evite, a menos que a distorção seja uma escolha estilística deliberada.

Para imagens de fonte de paisagem maiores que 16:9 (recorte de cinema, panoramas), o excesso é cortado da esquerda e da direita. A mesma lógica: arraste a sobreposição para centrar o assunto.

## O fluxo de trabalho de redimensionamento da plataforma social

Se publicar o mesmo conteúdo em várias plataformas no mesmo dia, o FrameForge cobre todas elas a partir de uma extensão:

| Platform | Target size | Preset |
|----------|-------------|--------|
| X (Twitter) | 1200×675 px | X Post |
| YouTube | 1280×720 px | YouTube Thumbnail |
| Instagram (square) | 1080×1080 px | Instagram Post |
| Twitch panels | 320×160 px | Twitch Panel |

Redimensione uma vez por plataforma, exporte cada versão com apenas alguns cliques, sem trocar de ferramentas ou fazer o upload para serviços separados.

## Perguntas frequentes

**Qual o melhor tamanho de imagem para um post X (Twitter)?**
1200×675px em 16:9. Este preenche a visualização do feed sem cortar e é apresentado em dimensões completas quando expandido. Mantenha o ficheiro com menos de 5 MB para JPG/PNG.

**O X corta imagens no feed?**
Sim. X aplica um corte central às imagens incorporadas no feed do tweet, renderizando-as aproximadamente em 2:1. As imagens publicadas a 1200×675 px (16:9) correspondem às proporções de visualização do feed e aparecem sem cortes inesperados.

**O FrameForge carrega imagens para um servidor?**
Não. O FrameForge é uma extensão do Chrome que processa imagens inteiramente no seu browser. Nada é enviado para nenhum servidor. Nenhuma conta é necessária.

**Posso usar a mesma imagem para o X e YouTube?**
As miniaturas do YouTube têm 1280×720 px e os posts X têm 1200×675 px – ambos têm 16:9, pelo que a composição é idêntica. O FrameForge tem predefinições para ambos, para que possa exportar duas versões da mesma imagem de origem sem cortar.

**O FrameForge é gratuito?**
Sim. O FrameForge pode ser instalado gratuitamente na Chrome Web Store. A versão gratuita inclui predefinições de plataforma e redimensionamento central. O Pro adiciona sobreposição de texto e processamento em lote.
