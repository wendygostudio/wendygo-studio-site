---
schemaVersion: 1
title: >-
  Extensão do Chrome para conversor de ficheiros local: imagens, áudio,
  documentos - sem carregamento
description: >-
  O ConvertForge converte imagens HEIC, ficheiros de áudio, documentos (OCR) e
  formatos de dados inteiramente no seu browser. Sem upload de servidor, sem
  conta, funciona offline.
date: 2026-07-08T00:00:00.000Z
slug: local-file-converter-chrome-extension
locale: pt
translationKey: local-file-converter-chrome-extension
product: convertforge
contentType: use-case
primaryKeyword: extensão do cromo do conversor de ficheiros local
relatedPages: /pt/convertforge/
---

# Extensão do Chrome para conversor de ficheiros local: imagens, áudio, documentos - sem carregamento

A maioria dos conversores online pega no seu ficheiro, envia-o para um servidor, processa-o lá e devolve um resultado. A sua foto, documento ou folha de cálculo permanece brevemente na infraestrutura de outra pessoa. O ConvertForge converte ficheiros inteiramente dentro do seu browser – nada sai da sua máquina.

## O que o ConvertForge converte

O ConvertForge é um router de conversão universal com interface de arrastar e largar. Solte um ficheiro e ele deteta o tipo automaticamente:

- **Imagens** — HEIC de iPhones e outros formatos de imagem, convertidos localmente sem serviço de cloud
- **Áudio** — Extraia áudio de ficheiros de vídeo ou converta entre formatos de áudio
- **Documentos** — OCR local utilizando Tesseract, extraindo texto de PDFs e imagens no dispositivo
- **Dados** — Converte entre JSON, CSV, YAML e XLSX para pipelines de dados ou importações de folhas de cálculo

## Como converter um ficheiro localmente

1. Instale o ConvertForge na página do ConvertForge – sem conta, sem registo
2. Clique no ícone do ConvertForge na barra de ferramentas do Chrome para o abrir como um painel local
3. Arraste e largue o seu ficheiro no router universal
4. O ConvertForge deteta o tipo de ficheiro e mostra os formatos de saída disponíveis
5. Selecione o formato de destino e converta – o ficheiro é descarregado diretamente para o seu dispositivo

Todo o processamento utiliza APIs nativas do browser: Tesseract para OCR, WebAssembly para processamento de áudio e imagem.

## Local vs nuvem: o que muda

| Feature | Cloud converter | ConvertForge |
|---------|----------------|--------------|
| File leaves your machine | Yes | No |
| Works offline | No | Yes |
| File size limits | Often (10–25 MB) | None (RAM-bound) |
| Account required | Usually | No |
| Works from browser | Yes | Yes |

Se lida com fotografias com dados de localização EXIF, documentos com informações pessoais ou ficheiros de dados proprietários, a diferença entre cloud e local não é apenas conveniência – é um limite de privacidade.

## Perguntas frequentes

**O ConvertForge carrega os meus ficheiros para qualquer servidor?**
Não. O ConvertForge é executado inteiramente no seu browser utilizando as APIs do browser e o WebAssembly. Nada é carregado para os servidores do Wendygo Studio ou de terceiros.

**Funciona offline?**
Sim. Como o processamento é local, o ConvertForge funciona totalmente offline depois de instalado – num avião, sem Wi-Fi ou numa máquina com acesso restrito à rede.

**É gratuito?**
O ConvertForge tem um nível gratuito sem necessidade de conta. Visite a página do ConvertForge para ver os preços atuais.

**Como difere dos conversores online?**
Os conversores online carregam o seu ficheiro para um servidor remoto e processam-no aí. O ConvertForge faz tudo isto no seu próprio browser – o seu ficheiro nunca sai da sua máquina.
