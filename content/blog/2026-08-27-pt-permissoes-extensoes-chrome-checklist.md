---
schemaVersion: 1
title: "Permissões das extensões do Chrome: checklist antes de instalar"
description: "Aprende a ler os avisos de permissões do Chrome, compará-los com a função necessária e testar uma extensão de foco."
date: 2026-08-27
slug: permissoes-extensoes-chrome-checklist
locale: pt
translationKey: chrome-extension-permissions-checklist
product: slimeforge
contentType: how-to
primaryKeyword: "checklist permissões extensões Chrome"
relatedPages: /slimeforge/,/blog/is-your-chrome-extension-spying-on-you/,/blog/best-chrome-extensions-for-students/
sourceUrls: https://support.google.com/chrome_webstore/answer/186213?hl=en,https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy?hl=en,https://developer.chrome.com/docs/extensions/reference/permissions-list?hl=en
faqs:
  - question: "Os avisos de permissões provam que uma extensão é perigosa?"
    answer: "Não. Descrevem o acesso possível. Compare-o com a função, o editor e a política de privacidade."
  - question: "De que permissões precisa um temporizador de foco simples?"
    answer: "Um temporizador pode usar armazenamento local e alarmes. O bloqueio de páginas pode precisar de acesso adicional, que deve ser explicado."
  - question: "Uma extensão pode mudar depois de instalada?"
    answer: "Sim. As atualizações podem alterar o código e o comportamento. Reveja a ficha, a privacidade e as permissões após mudanças importantes."
  - question: "Posso instalar uma extensão numa conta de estudante?"
    answer: "Verifica o acesso pedido, o editor, a privacidade e as regras da escola. Um dispositivo gerido pode limitar instalações."
---

Instalar uma extensão do Chrome parece uma decisão pequena, mas pode dar-lhe acesso a uma parte importante do navegador. O aviso descreve o que ela pode pedir; não decide se esse acesso é justificado para a tarefa. Use este checklist antes de adicionar um temporizador, gestor de separadores ou ferramenta de estudo.

O [checklist de segurança para extensões Chrome](/blog/is-your-chrome-extension-spying-on-you/) parte de um incidente. Aqui, a pergunta é mais simples: o acesso pedido corresponde à função anunciada?

## 1. Começa pela função

Define uma tarefa concreta. Um temporizador, um corretor e um bloqueador de sites não precisam do mesmo acesso. A [ajuda oficial do Chrome sobre permissões](https://support.google.com/chrome_webstore/answer/186213?hl=en) inclui sites, separadores, histórico, marcadores, dados copiados e informações do dispositivo.

A popularidade não substitui a verificação. Se um temporizador pede para ler e alterar os dados de todos os sites, pergunta porquê. Pode ser necessário para uma função de página explicada pelo editor, mas é mais amplo do que uma contagem decrescente.

## 2. Transforma o aviso numa pergunta

Pergunta que páginas podem ser lidas ou alteradas, se são necessários URL e títulos dos separadores, por que motivo o histórico ou a área de transferência são usados e o que fica local ou é sincronizado. A documentação do Chrome recomenda os mínimos necessários e permissões opcionais para funções posteriores.

## 3. Compara três descrições

Compara a ficha da Chrome Web Store, a página de privacidade do editor e o primeiro ecrã da extensão. Se divergirem, espera. Uma política de privacidade é uma declaração, não uma auditoria independente; a publicação na loja também não garante que a extensão seja adequada ao teu caso.

## 4. Testa o fluxo mínimo

Concede apenas o necessário para um teste curto. Num temporizador, começa pelo relógio e pelo progresso local; num bloqueador, confirma os sites realmente analisados. Não introduzas palavras-passe, chaves API ou documentos privados durante a avaliação. Uma função local deve explicar qualquer dependência da rede.

## 5. Volta a verificar após atualizações

Relê as permissões se mudar o editor, surgir uma função nova ou chegar uma atualização estranha. Consulta [as melhores extensões Chrome para estudantes](/blog/best-chrome-extensions-for-students/) e aplica o checklist a cada candidata. O núcleo de foco do [SlimeForge](/slimeforge/) funciona localmente; as funções opcionais em páginas devem ser comparadas com a ficha atual.

## Perguntas frequentes

### Os avisos provam que a extensão é perigosa?

Não. Descrevem o acesso possível. Compara-o com a função, o editor e a privacidade.

### O que precisa um temporizador simples?

Armazenamento local e alarmes podem ser suficientes. Bloqueio ou sobreposições podem exigir mais acesso, que deve ser explicado.

### Pode mudar depois de instalada?

Sim. As atualizações podem alterar o comportamento. Volta a verificar a ficha, a privacidade e as permissões.

### E num dispositivo gerido pela escola?

Respeita a política do administrador e escolhe uma alternativa verificada em vez de contornar a restrição.
