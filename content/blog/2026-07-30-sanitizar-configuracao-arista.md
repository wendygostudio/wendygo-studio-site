---
schemaVersion: 1
title: "Como Sanitizar uma Configuração Arista EOS Antes de a Partilhar"
description: "A saída de 'show running-config' no Arista EOS traz enable secrets, community strings SNMP, palavras-passe de vizinho BGP e segredos partilhados de MLAG. Isto é o que remover antes de colar num chat de IA ou num caso de suporte."
date: 2026-07-30
slug: sanitizar-configuracao-arista
locale: pt
translationKey: sanitize-arista-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuração arista eos"
relatedPages: /scrubforge/
---

`show running-config` num switch Arista EOS produz o mesmo tipo de dump tudo-de-uma-vez da CLI de qualquer outro fabricante: VLANs, port-channels, peering BGP, e cada credencial que o switch guarda ficam num único paste. Antes de colocar isso num ticket TAC ou num chat de IA a perguntar sobre um vizinho MLAG instável, vale a pena saber exatamente o que lá está.

## O que uma config Arista EOS realmente contém

- `username admin secret` — uma palavra-passe de utilizador local com hash tipo 5 (ou mais forte)
- Community strings `snmp-server community`, por vezes com acesso de leitura-escrita
- Valores `neighbor ... password` de BGP (baseados em MD5, reversíveis com as ferramentas certas em cifras mais antigas)
- Segredos partilhados `tacacs-server key` e `radius-server host ... key`
- Configuração `peer-address` e `local-interface` de MLAG, por vezes emparelhada com um segredo partilhado na configuração de peering
- `enable secret` para acesso EXEC privilegiado

## Antes e depois

A mesma chave TACACS+ ou palavra-passe de vizinho BGP é sempre mapeada para o mesmo token em toda a saída sanitizada, pelo que as relações entre vizinhos, VLANs e port-channels continuam legíveis — só a credencial literal é substituída.

## Passos

1. Instale o ScrubForge a partir da Chrome Web Store (grátis)
2. Execute `show running-config` no seu switch Arista
3. Cole a saída no ScrubForge
4. Reveja o resultado sanitizado — segredos, community strings e palavras-passe de vizinho ficam tokenizados, a estrutura fica intacta
5. Copie e partilhe, ou continue no chat de IA integrado do ScrubForge

## Porque é que o processamento local importa

Um segredo partilhado de MLAG ou uma chave TACACS+ colados num ticket de suporte ou num log de chat partilhado ficam lá indefinidamente. O ScrubForge sanitiza inteiramente dentro do separador do navegador — nada é enviado antes de decidir partilhar.

## Relacionados

- [Sanitizar uma config de rede antes de a partilhar](/pt/blog/sanitizar-configuracao-rede/)
- [ScrubForge](/pt/scrubforge/)
