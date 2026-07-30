---
schemaVersion: 1
title: "Como Sanitizar uma Configuração Huawei VRP Antes de a Partilhar"
description: "A saída de 'display current-configuration' no Huawei VRP traz hashes de palavra-passe irreversible-cipher, community strings SNMP e chaves de autenticação MD5 de OSPF/BGP. Isto é o que remover antes de colar num chat de IA ou num caso de suporte."
date: 2026-07-30
slug: sanitizar-configuracao-huawei
locale: pt
translationKey: sanitize-huawei-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuração huawei vrp"
relatedPages: /scrubforge/
---

`display current-configuration` num equipamento Huawei VRP (routers e switches da mesma família de SO) mostra interfaces, protocolos de encaminhamento, e cada credencial guardada num único bloco contínuo. Antes de colocar isso num caso de suporte ou num chat de IA a perguntar sobre um vizinho OSPF preso em EXSTART, vale a pena saber exatamente o que lá está.

## O que uma config Huawei VRP realmente contém

- `local-user ... password irreversible-cipher` — palavras-passe de conta local com hash
- `super password` — a palavra-passe do modo privilegiado, guardada como string cifrada
- Community strings `snmp-agent community`, de leitura ou leitura-escrita
- Chaves `authentication-mode md5` de OSPF e BGP, além de palavras-passe de autenticação IS-IS
- Valores `radius-server shared-key` e `hwtacacs-server shared-key`
- Strings `pre-shared-key` de IPsec/IKE para túneis site-to-site

## Antes e depois

A mesma chave partilhada ou community SNMP é sempre mapeada para o mesmo token em toda a saída sanitizada, pelo que as relações entre vizinhos, VLANs e perfis de autenticação continuam legíveis — só a credencial literal é substituída.

## Passos

1. Instale o ScrubForge a partir da Chrome Web Store (grátis)
2. Execute `display current-configuration` no seu equipamento Huawei
3. Cole a saída no ScrubForge
4. Reveja o resultado sanitizado — palavras-passe cifradas, community strings e chaves de autenticação ficam tokenizadas, a estrutura fica intacta
5. Copie e partilhe, ou continue no chat de IA integrado do ScrubForge

## Porque é que o processamento local importa

Um hash `irreversible-cipher` ou uma chave MD5 de OSPF colados num ticket de suporte ou num log de chat partilhado ficam lá indefinidamente. O ScrubForge sanitiza inteiramente dentro do separador do navegador — nada é enviado antes de decidir partilhar.

## Relacionados

- [Sanitizar uma config de rede antes de a partilhar](/pt/blog/sanitizar-configuracao-rede/)
- [ScrubForge](/pt/scrubforge/)
