---
schemaVersion: 1
locale: pt
translationKey: sanitize-fortigate-config
xDefaultPath: /blog/sanitize-fortigate-config/
title: "Sanitizar uma configuração FortiGate antes de partilhar"
description: "Verifique localmente excertos FortiGate para segredos e dados sensíveis."
date: 2026-07-26
slug: sanitizar-configuracao-fortigate
product: ScrubForge
contentType: how-to
primaryKeyword: "sanitizar configuração FortiGate"
relatedPages: "/pt/scrubforge/,/blog/sanitize-fortigate-config/"
heading: "Partilhar uma configuração FortiGate com segurança"
intro: "Prepare uma cópia sanitizada para suporte sem publicar o original."
faqs:
  - question: "Sanitizar substitui a revisão?"
    answer: "Não. Confirme sempre nomes, comentários e formatos de segredo invulgares."
---

Uma exportação FortiGate pode conter chaves VPN, palavras-passe, tokens, nomes internos e roteamento. Copie apenas o excerto necessário para [ScrubForge](/pt/scrubforge/), substitua localmente valores sensíveis e confirme o resultado. Marcadores consistentes mantêm relações entre objetos e regras. Remova também comentários e dados desnecessários.
