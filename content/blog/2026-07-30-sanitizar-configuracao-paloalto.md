---
schemaVersion: 1
title: "Como Sanitizar uma Configuração Palo Alto PAN-OS Antes de a Partilhar"
description: "Um export 'show config running' ou em formato set do PAN-OS traz hashes de palavra-passe de admin, chaves pré-partilhadas IKE e segredos de bind RADIUS/LDAP. Isto é o que remover antes de colar num chat de IA ou num caso de suporte."
date: 2026-07-30
slug: sanitizar-configuracao-paloalto
locale: pt
translationKey: sanitize-paloalto-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuração palo alto pan-os"
relatedPages: /scrubforge/
---

Exportar a configuração de uma firewall Palo Alto para um caso de suporte ou uma sessão de resolução de problemas assistida por IA traz de uma vez tudo o que está na config candidata ou em execução — estrutura de zonas, regras de segurança, NAT, e cada segredo que o PAN-OS guarda junto delas. Antes de isso sair do equipamento, vale a pena saber exatamente o que contém.

## O que uma config PAN-OS realmente contém

- `phash` — o hash da palavra-passe do administrador local em `mgt-config users`
- Valores `pre-shared-key` do IKE Gateway para cada túnel VPN
- Community strings `snmp-setting` SNMP (v1/v2c) ou palavras-passe de autenticação/privacidade v3
- Segredos `server-profile` e palavras-passe de bind de RADIUS, LDAP e Kerberos usados para autenticação de admin/GlobalProtect
- Segredos pré-partilhados do portal e gateway GlobalProtect e frases-passe de certificados
- Chaves de API incorporadas em scripts de automação colados junto com a config

## Antes e depois

A mesma chave pré-partilhada ou palavra-passe de bind é sempre mapeada para o mesmo token em toda a saída sanitizada, pelo que as relações entre túneis VPN, zonas e perfis de autenticação continuam legíveis — só o segredo literal é substituído.

## Passos

1. Instale o ScrubForge a partir da Chrome Web Store (grátis)
2. Exporte com `show config running` (ou o equivalente em formato `set`) a partir da CLI do PAN-OS ou Panorama
3. Cole a saída no ScrubForge
4. Reveja o resultado sanitizado — hashes de palavra-passe, chaves pré-partilhadas e segredos de bind ficam tokenizados, a estrutura fica intacta
5. Copie e partilhe, ou continue no chat de IA integrado do ScrubForge

## Porque é que o processamento local importa

Uma chave pré-partilhada IKE ou um hash de palavra-passe de admin colados num ticket de suporte ou num log de chat de IA partilhado ficam lá indefinidamente, fora do seu controlo. O ScrubForge sanitiza inteiramente dentro do separador do navegador — nada é enviado antes de decidir partilhar.

## Relacionados

- [Sanitizar uma config de rede antes de a partilhar](/pt/blog/sanitizar-configuracao-rede/)
- [ScrubForge](/pt/scrubforge/)
