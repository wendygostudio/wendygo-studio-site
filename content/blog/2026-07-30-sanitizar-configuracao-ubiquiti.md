---
schemaVersion: 1
title: "Como Sanitizar uma Configuração Ubiquiti UniFi / EdgeOS Antes de a Partilhar"
description: "Um backup do controlador UniFi ou um export 'show configuration' do EdgeOS traz chaves pré-partilhadas WiFi, palavras-passe de admin, segredos RADIUS e chaves de VPN site-to-site. Isto é o que remover antes de colar num chat de IA ou num post de fórum."
date: 2026-07-30
slug: sanitizar-configuracao-ubiquiti
locale: pt
translationKey: sanitize-ubiquiti-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuração ubiquiti unifi"
relatedPages: /scrubforge/
---

Uma instalação Ubiquiti normalmente implica resolver problemas em dois sistemas sobrepostos: o backup do site exportado do controlador UniFi ou o `config.gateway.json`, e o `show configuration` do EdgeOS em hardware EdgeRouter. Ambos mostram topologia de rede, definições de WiFi e credenciais num único ficheiro. Antes de colocar isso num post de fórum comunitário ou num chat de IA a perguntar porque é que uma VLAN não encaminha, vale a pena saber exatamente o que lá está.

## O que uma config UniFi / EdgeOS realmente contém

- `x_passphrase` da rede WiFi — a chave pré-partilhada WPA2/WPA3, guardada em texto simples nos backups de site do UniFi
- Palavras-passe de conta de admin local (com hash na base de dados do controlador, por vezes presentes em texto simples em pacotes de export de suporte)
- Segredos partilhados `radius profile` usados para autenticação 802.1X ou hotspot
- Valores `pre-shared-key` de VPN site-to-site e de utilizador remoto em `vpn ipsec` (EdgeOS) ou na configuração de VPN do UniFi
- Community strings SNMP em `snmp community`
- Segredos de portal de convidados e vouchers de hotspot, e quaisquer chaves de API de terceiros incorporadas em integrações

## Antes e depois

A mesma frase-passe WiFi ou chave pré-partilhada de VPN é sempre mapeada para o mesmo token em toda a saída sanitizada, pelo que as relações entre sites, VLANs e túneis continuam legíveis — só a credencial literal é substituída.

## Passos

1. Instale o ScrubForge a partir da Chrome Web Store (grátis)
2. Exporte um backup de site UniFi ou execute `show configuration` no seu EdgeRouter
3. Cole a secção relevante no ScrubForge
4. Reveja o resultado sanitizado — frases-passe, palavras-passe de admin e segredos partilhados ficam tokenizados, a estrutura fica intacta
5. Copie e partilhe, ou continue no chat de IA integrado do ScrubForge

## Porque é que o processamento local importa

Uma chave pré-partilhada WiFi ou um segredo de VPN colados num tópico de fórum público ou num log de chat de IA partilhado tornam-se efetivamente públicos no momento em que são publicados. O ScrubForge sanitiza inteiramente dentro do separador do navegador — nada é enviado antes de decidir partilhar.

## Relacionados

- [Sanitizar uma config de rede antes de a partilhar](/pt/blog/sanitizar-configuracao-rede/)
- [ScrubForge](/pt/scrubforge/)
