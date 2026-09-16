---
schemaVersion: 1
title: "Como sanitizar logs do GitHub antes de partilhar"
description: "Checklist prático para remover tokens, URLs de repositórios e contexto privado dos logs do GitHub antes de os partilhar com o suporte ou uma ferramenta de IA."
date: 2026-09-16
slug: sanitizar-logs-github-antes-partilhar
locale: pt
translationKey: sanitize-github-logs-before-sharing
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar logs do GitHub"
relatedPages: /pt/scrubforge/,/pt/blog/sanitizar-configuracao-paloalto/,/pt/blog/permissoes-extensoes-chrome-checklist/
sourceUrls: https://docs.github.com/en/code-security/tutorials/remediate-leaked-secrets/remediating-a-leaked-secret,https://docs.github.com/en/actions/reference/security/secrets,https://docs.github.com/en/actions/reference/security/secure-use,https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
faqs:
  - question: "É suficiente apagar um token de um log do GitHub?"
    answer: "Não. Considere comprometido um segredo ativo exposto, revogue-o ou faça a rotação junto do fornecedor e depois remova ou oculte a cópia que vai partilhar."
  - question: "O GitHub oculta todos os segredos nos logs do Actions?"
    answer: "Não. O GitHub documenta a ocultação automática de valores suportados, mas valores transformados ou estruturados podem ficar visíveis; reveja os logs e mascare os valores sensíveis gerados."
  - question: "O que devo remover antes de partilhar um log do GitHub?"
    answer: "Remova tokens, cabeçalhos de autorização, URLs de repositórios privados, nomes de hosts internos, dados pessoais e payloads que não sejam necessários para reproduzir o problema."
  - question: "Posso sanitizar logs do GitHub localmente?"
    answer: "Sim. Um fluxo local para texto e configurações reduz a exposição durante o envio, mas o resultado deve ser revisto manualmente e os segredos ativos tratados separadamente."
---

# Como sanitizar logs do GitHub antes de partilhar

Os logs do GitHub Actions são uma evidência útil quando uma compilação falha, mas também podem conter mais contexto do que o suporte ou um assistente de IA precisa: URL do repositório, branch, host interno, caminho local, título de pull request, email, cabeçalho de autorização ou um token impresso por um comando.

Trabalhe numa cópia, remova o contexto privado desnecessário, reveja o resultado e só depois o partilhe. Isto reduz a divulgação, mas não substitui a resposta a incidentes: se aparecer um segredo ativo no log, revogue-o ou faça a rotação junto do fornecedor primeiro.

## O que verificar

Procure na cópia:

- tokens, chaves API, JWT, chaves privadas e cabeçalhos `Authorization`;
- URLs de repositórios privados, hosts internos, IDs de contas cloud e caminhos locais;
- nomes de deployments, clusters, bases de dados e variáveis de ambiente;
- emails, nomes de utilizador, texto de tickets ou payloads com dados pessoais;
- relatórios e corpos de pedidos que não sejam necessários para reproduzir o erro.

Mantenha a mensagem de erro, o código de saída, as versões relevantes e o input mínimo. Substitua os valores por marcadores estáveis como `<GITHUB_TOKEN>` ou `<HOST_INTERNO>`, preservando a forma do problema sem revelar o valor literal.

## Fluxo local

1. Copie o log para um ficheiro local temporário e mantenha o original no ambiente seguro.
2. Procure `token`, `secret`, `password`, `Authorization`, `BEGIN PRIVATE KEY`, URLs, hosts e emails. Reveja também cadeias opacas longas.
3. Substitua os valores sensíveis por marcadores tipificados, reutilizando o mesmo marcador para valores repetidos.
4. Remova passos sem relação, corpos de pedidos e dumps do ambiente.
5. Leia o ficheiro final do princípio ao fim, incluindo blocos de código, linhas próximas e anexos.
6. Partilhe a cópia sanitizada no canal de suporte aprovado e registe os tipos de valores removidos.

O ScrubForge pode ajudar na limpeza local de uma cópia de log ou configuração. O rascunho fica no separador do navegador até decidir copiar o resultado. Reveja-o na mesma: nenhuma ferramenta sabe automaticamente que identificadores internos a sua organização pode divulgar.

## O que o masking do GitHub não garante

O [manual de Secrets do GitHub](https://docs.github.com/en/actions/reference/security/secrets) documenta a ocultação automática de valores secretos suportados nos logs dos workflows, mas isso não é uma revisão completa. Valores transformados, codificados, divididos ou estruturados podem não ser reconhecidos. O GitHub recomenda também mascarar valores sensíveis que não estejam guardados como GitHub Secrets e evitar comandos que imprimam segredos.

Se um workflow tiver de usar um segredo externo para um diagnóstico, mascare-o antes de qualquer comando o poder imprimir. Mesmo assim, reveja o log antes de o exportar: pode revelar nomes de repositórios, topologia, dados de utilizadores ou um valor reconstruído.

## Se um segredo já foi exposto

Revogue-o ou faça a rotação segundo o procedimento do fornecedor, descubra onde o log foi guardado e reveja os acessos. Apagar uma linha da vista atual não remove cópias em artefactos, caches, tickets, exportações de chat ou no histórico do repositório. Se o segredo entrou no histórico Git, siga depois da revogação os passos de coordenação e reescrita indicados pelo GitHub.

## Checklist final

1. Todos os valores semelhantes a credenciais foram removidos ou substituídos?
2. Os segredos ativos expostos foram revogados ou rodados?
3. URLs, hosts internos e dados pessoais são necessários para o diagnóstico?
4. Anexos, capturas de ecrã e comandos colados também foram revistos?
5. O log mantém o erro, as versões e o contexto de reprodução?

Veja também [como sanitizar uma configuração Palo Alto PAN-OS antes de a partilhar](/pt/blog/sanitizar-configuracao-paloalto/) e o [ScrubForge](/pt/scrubforge/).

## Perguntas frequentes

### É suficiente apagar um token de um log do GitHub?

Não. Considere o segredo ativo comprometido, revogue-o ou faça a rotação e depois limpe a cópia a partilhar.

### O GitHub oculta todos os segredos nos logs do Actions?

Não. Valores suportados podem ser mascarados, mas os transformados ou estruturados podem escapar. Reveja os logs e mascare explicitamente os valores gerados.

### O que devo remover antes de partilhar um log?

Tokens, cabeçalhos de autorização, URLs privadas, hosts internos, dados pessoais e payloads desnecessários.

### Posso sanitizar logs localmente?

Sim, mas reveja manualmente o resultado e trate os segredos ativos separadamente.
