---
schemaVersion: 1
title: "A Tua Extensão Chrome Está a Espiar-te? Checklist 2026"
description: "Google e Microsoft retiraram uma extensão de confiança com 1,6M instalações por recolha oculta de dados. Como verificar se as tuas são seguras."
date: 2026-07-25
slug: extensao-chrome-esta-a-espiar-te
locale: pt
translationKey: is-your-chrome-extension-spying-on-you
product: slimeforge
contentType: how-to
primaryKeyword: "a minha extensão Chrome está a espiar-me"
relatedPages: /slimeforge/
sourceUrls: https://support.google.com/chrome_webstore/answer/186213?hl=en,https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy?hl=en
---

Se usas uma extensão do Chrome ou do Edge para gerir o teu foco, os teus cabeçalhos HTTP, as tuas palavras-passe ou outra coisa qualquer, a retirada do ModHeader merece cinco minutos do teu tempo. Não porque o ModHeader fosse uma ferramenta marginal — tinha 1,6 milhões de instalações e uma década de confiança — mas pela forma exata como escondia o que fazia. Para rever uma instalação antes de conceder acesso, consulta também o novo [checklist de permissões das extensões Chrome](/blog/chrome-extension-permissions-checklist/).

> **O que realmente aconteceu**
> A 3 de julho de 2026, a Microsoft retirou o ModHeader da loja de extras do Edge. A 10 de julho, a Google fez o mesmo, retirando-o da Chrome Web Store. A empresa de segurança [Stripe OLT](https://thehackernews.com/2026/07/google-and-microsoft-pull-modheader.html) descobriu que a extensão oficial, assinada criptograficamente, continha um recoletor completo de histórico de navegação: gerava uma impressão digital do dispositivo, cifrava o domínio de cada página visitada, e estava preparada para carregar a lista diariamente para um servidor externo. O recoletor não estava ativo — uma lista de permissões interna vazia mantinha-o desligado — mas ativá-lo só precisaria de uma atualização de rotina, sem novas permissões, sem qualquer clique do utilizador.

## Porque é que isto importa mesmo que não uses o ModHeader

O ModHeader é uma ferramenta para programadores editarem cabeçalhos HTTP, não uma extensão de produtividade. Mas o padrão que revelou aplica-se diretamente a temporizadores de foco, gestores de separadores, e qualquer outra extensão que peça acesso amplo:

<div class="key-points">
  <h3>Porque é que as verificações automatizadas não o detetaram</h3>
  <ul>
    <li><strong>A cifragem escondia os dados</strong> — um verificador vê texto cifrado, não uma lista de domínios, por isso nada legível saiu do dispositivo durante os testes.</li>
    <li><strong>Uma lista de permissões vazia bloqueava o envio</strong> — o código de recolha era executado, mas a chamada de rede que alimentava simplesmente nunca disparava, por isso as sandboxes não viam tráfego de saída.</li>
    <li><strong>O código malicioso estava minificado dentro de uma funcionalidade legítima e funcional</strong> — a extensão continuava a fazer exatamente o que anunciava, o que a maioria das revisões manuais verifica.</li>
  </ul>
</div>

Os verificadores de risco automatizados classificaram a extensão como baixo risco, alguns com até 95 em 100. Uma ficha assinada com anos de boas avaliações indicava aos utilizadores que era de confiança. Nenhum dos dois sinais a detetou.

## Um checklist prático antes de confiares numa extensão

<div class="step-card">
  <span class="step-label">Como fazer</span>
  <strong>Cinco verificações que demoram menos de dois minutos</strong>
  <p>Abre <code>chrome://extensions</code>, clica em "Detalhes" em tudo o que uses diariamente, e verifica: pede para "ler e alterar todos os teus dados em todos os sites" quando a sua função declarada não precisa disso? Mudou de dono recentemente, ou passou de gratuita a "suportada por publicidade", um padrão que os investigadores de segurança assinalam repetidamente desde 2021? O programador publica uma política de privacidade que corresponde mesmo ao que o código precisa de fazer? Teve uma atualização nas últimas semanas sem registo de alterações? E, se possível, a extensão funciona com a ligação de rede desativada? Uma ferramenta genuinamente local continuará a funcionar; uma que telefona para casa, não.</p>
</div>

| Sinal de uma extensão de menor risco | Sinal que merece investigação |
|---|---|
| Só pede as permissões que a sua função declarada precisa | Pede acesso amplo a hosts "por precaução" |
| Mesmo proprietário e registo de alterações claro ao longo do tempo | Mudou de dono recentemente ou passou a ter publicidade |
| Funciona totalmente offline se a sua função não precisar de rede | Faz chamadas de rede que uma função puramente local não devia precisar |
| Transparente sobre não recolher dados de navegação | Política de privacidade vaga ou inexistente |

A própria [política da Chrome Web Store](https://developer.chrome.com/docs/webstore/program-policies/policies) da Google já pede aos programadores para solicitarem as permissões mais restritas que uma função precisa, e proíbe recolher atividade de navegação fora de um propósito declarado e visível ao utilizador. A partir de 1 de agosto de 2026, entra em vigor a [aplicação de regras mais rígidas de recolha de dados](https://developer.chrome.com/blog/cws-policy-updates-2026) em toda a loja — mas isso é uma base mínima, não uma garantia. Só limita o que uma extensão em conformidade está *autorizada* a fazer, e o ModHeader também não declarava o que tinha construído.

## O que "só local" te dá realmente

O núcleo do [SlimeForge](/pt/slimeforge/) — temporizador, progresso do animal e dados de sessão — funciona no dispositivo sem exigir uma conta. O manifesto declara `storage`, `alarms`, `scripting` e `activeTab` para o temporizador e as funções opcionais dentro das páginas. A ativação da licença pode contactar a Creem; as funções opcionais do Gemini Nano são executadas localmente quando suportadas. Isto é mais preciso do que afirmar que a extensão nunca faz um pedido de rede.

## Perguntas frequentes

### Como é que o ModHeader passou as verificações de segurança do Chrome durante anos?

O recoletor estava cifrado e bloqueado atrás de uma lista de permissões interna publicada vazia, por isso o passo de envio nunca era executado durante as verificações. Um verificador vê texto cifrado e nenhum tráfego de saída, exatamente o aspeto de uma extensão limpa. Os investigadores da Stripe OLT só o encontraram lendo diretamente o código minificado.

### De que permissões precisa realmente uma extensão de foco ou produtividade?

Uma extensão de foco deve pedir apenas as permissões necessárias às funções declaradas. O SlimeForge declara `storage`, `alarms`, `scripting` e `activeTab`; o acesso opcional a sites só é pedido quando o utilizador ativa funções dentro das páginas.

### Uma extensão popular e bem avaliada é automaticamente segura?

Não. O ModHeader tinha 1,6 milhões de instalações, um longo histórico, e pontuações de risco automatizadas até 95 em 100 que a classificavam como baixo risco — e mesmo assim incluía um recoletor de dados funcional. O número de instalações e a avaliação medem popularidade, não o que o código faz depois de uma atualização.

### Desinstalar uma extensão maliciosa remove os dados já recolhidos?

Desinstalá-la remove-a do teu navegador e apaga o seu armazenamento local, mas não desfaz nada já enviado para os servidores do programador. Se alguma vez colaste chaves de API, tokens ou palavras-passe nos campos de uma extensão, roda-as independentemente de essa extensão se revelar comprometida ou não.
