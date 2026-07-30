---
schemaVersion: 1
title: "Como Sanitizar uma Configuração Juniper JunOS Antes de a Partilhar"
description: "A saída de 'show configuration' no JunOS traz hashes de root-authentication, community strings SNMP e chaves de autenticação BGP/OSPF. Isto é o que remover antes de colar num chat de IA ou num ticket."
date: 2026-07-30
slug: sanitizar-configuracao-juniper
locale: pt
translationKey: sanitize-juniper-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuração juniper junos"
relatedPages: /scrubforge/
---

`show configuration` num equipamento Juniper produz um dump plano de todo o aparelho: interfaces, política de encaminhamento, filtros de firewall, e cada credencial que o dispositivo guarda, tudo no mesmo paste. Antes de colocar isso num ticket TAC ou num chat de IA a perguntar "porque é que esta adjacência OSPF está presa", vale a pena saber exatamente o que lá está.

## O que uma config JunOS realmente contém

- `root-authentication encrypted-password` — um hash Juniper com prefixo `$9$` para a conta root
- Community strings `snmp community`, muitas vezes com `authorization read-write`
- `authentication-key` de BGP e OSPF/IS-IS (MD5, por vezes em texto simples em configs antigas)
- Chaves pré-partilhadas IPsec `ike proposal` em `security ike policy ... pre-shared-key`
- Valores `secret` de RADIUS e TACACS+ em `system radius-server` / `system tacplus-server`
- Hashes `authentication encrypted-password` de utilizador local para cada conta configurada

## Antes e depois

A mesma community SNMP ou o mesmo segredo partilhado é sempre mapeado para o mesmo token em toda a saída sanitizada, pelo que as relações entre interfaces, políticas e vizinhos permanecem intactas — só a credencial literal é substituída.

## Passos

1. Instale o ScrubForge a partir da Chrome Web Store (grátis)
2. Execute `show configuration | display set` ou a forma hierárquica simples no seu equipamento Juniper
3. Cole a saída no ScrubForge
4. Reveja o resultado sanitizado — hashes, chaves e communities ficam tokenizados, a estrutura fica intacta
5. Copie e partilhe, ou continue no chat de IA integrado do ScrubForge

## Porque é que o processamento local importa

Um hash root `$9$` ou uma chave MD5 de BGP colados num ticket TAC ou num log de chat partilhado ficam lá indefinidamente. O ScrubForge sanitiza inteiramente dentro do separador do navegador — nada é enviado antes de decidir partilhar.

## Relacionados

- [Sanitizar uma config de rede antes de a partilhar](/pt/blog/sanitizar-configuracao-rede/)
- [ScrubForge](/pt/scrubforge/)
