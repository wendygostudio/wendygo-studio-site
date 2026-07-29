---
schemaVersion: 1
title: "Sanitizar uma configuração FortiGate antes de partilhar"
description: "Verifique localmente excertos FortiGate para segredos e dados sensíveis."
date: 2026-07-26
slug: sanitizar-configuracao-fortigate
locale: pt
translationKey: sanitize-fortigate-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuração FortiGate"
relatedPages: /scrubforge/
---

Uma exportação FortiGate pode conter chaves VPN, palavras-passe, tokens, nomes internos e roteamento. Copie apenas o excerto necessário para [ScrubForge](/pt/scrubforge/), substitua localmente valores sensíveis e confirme o resultado. Marcadores consistentes mantêm relações entre objetos e regras. Remova também comentários e dados desnecessários.
