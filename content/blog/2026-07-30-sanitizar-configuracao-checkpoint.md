---
schemaVersion: 1
title: "Como Sanitizar uma Configuração Check Point Antes de a Partilhar"
description: "Um export de config Check Point Gaia/SmartConsole traz hashes de palavra-passe de admin, chaves de ativação SIC, segredos pré-partilhados de VPN e segredos partilhados RADIUS/TACACS. Isto é o que remover antes de colar num chat de IA ou num caso TAC."
date: 2026-07-30
slug: sanitizar-configuracao-checkpoint
locale: pt
translationKey: sanitize-checkpoint-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuração check point"
relatedPages: /scrubforge/
---

Um export de configuração Check Point — seja um dump `show configuration` do Gaia, uma saída `cpconfig`, ou uma política exportada do SmartConsole — mistura objetos de rede, regras de segurança, e cada credencial que a gateway ou o servidor de gestão guardam num único ficheiro. Antes de colocar isso num caso TAC ou num chat de IA a perguntar porque é que um túnel VPN não sobe, vale a pena saber exatamente o que lá está.

## O que uma config Check Point realmente contém

- Valores `password-hash` de admin do Gaia para contas locais
- Palavras-passe de uso único e chaves de ativação SIC (Secure Internal Communication) usadas para emparelhar gateways com o servidor de gestão
- Valores `pre-shared-secret` da community VPN para túneis site-to-site e de acesso remoto
- Community strings SNMP em `set snmp community`
- Segredos partilhados RADIUS e TACACS+ configurados para autenticação de admin ou utilizador
- Chaves de API e tokens usados por scripts do SmartConsole ou da Management API R8x colados junto com a config

## Antes e depois

O mesmo segredo pré-partilhado ou chave SIC é sempre mapeado para o mesmo token em toda a saída sanitizada, pelo que as relações entre gateways, communities VPN e objetos continuam legíveis — só a credencial literal é substituída.

## Passos

1. Instale o ScrubForge a partir da Chrome Web Store (grátis)
2. Exporte a sua config via CLI do Gaia, `cpconfig`, ou um export de política do SmartConsole
3. Cole a saída no ScrubForge
4. Reveja o resultado sanitizado — hashes de palavra-passe, chaves SIC e segredos pré-partilhados ficam tokenizados, a estrutura fica intacta
5. Copie e partilhe, ou continue no chat de IA integrado do ScrubForge

## Porque é que o processamento local importa

Uma chave de ativação SIC ou um segredo pré-partilhado de VPN colados num caso TAC ou num log de chat partilhado ficam lá indefinidamente, fora do seu controlo. O ScrubForge sanitiza inteiramente dentro do separador do navegador — nada é enviado antes de decidir partilhar.

## Relacionados

- [Sanitizar uma config de rede antes de a partilhar](/pt/blog/sanitizar-configuracao-rede/)
- [ScrubForge](/pt/scrubforge/)
