---
schemaVersion: 1
title: Remover segredos dos ficheiros de configuração do Kubernetes
description: >-
  Limpe o YAML do Kubernetes antes de o partilhar com o suporte ou assistentes
  de IA. Remova chaves API, credenciais e tokens localmente com ScrubForge.
date: 2026-07-31T00:00:00.000Z
slug: remove-secrets-kubernetes-config
locale: pt
translationKey: remove-secrets-kubernetes-config
product: scrubforge
contentType: use-case
primaryKeyword: remover segredos da configuração do Kubernetes
relatedPages: /pt/scrubforge/
---

# Remover segredos dos ficheiros de configuração do Kubernetes

O YAML do Kubernetes mistura frequentemente a estrutura de implementação com informações que devem permanecer dentro do cluster: tokens de serviço, chaves API, palavras-passe codificadas em base64 e credenciais de registo privado. Antes de colar um manifesto num ticket de suporte ou assistente de IA, remova estes valores sem destruir o contexto técnico.

> **Importante:** base64 é codificação, não encriptação. Um valor em `data:` pode ainda ser uma credencial recuperável.

## O que rever

- Campos `Secret` e `stringData` contendo passwords ou tokens.
- Variáveis ​​de ambiente como `AWS_SECRET_ACCESS_KEY`, `GITHUB_TOKEN` ou chaves internas.
- URLs com nomes de utilizador e palavras-passe incorporados.
- ConfigMaps que contêm terminais privados ou material de autenticação.

O objetivo é manter os nomes, as relações e o recuo legíveis enquanto se substitui os literais confidenciais. A eliminação de blocos inteiros pode parecer simples, mas pode ocultar a causa do problema que está a tentar diagnosticar.

## Higienize antes de partilhar

1. Exporte uma cópia funcional do manifesto, nunca o ficheiro utilizado pelo cluster.
2. Cole a cópia em [ScrubForge](/scrubforge/).
3. Reveja a visualização: as chaves e os tokens devem tornar-se espaços reservados consistentes.
4. Confirme se os nomes dos recursos, namespaces, portas e referências permanecem visíveis.
5. Partilhe apenas o resultado higienizado e mantenha o original no seu ambiente seguro.

O ScrubForge processa o texto localmente no browser. Deteta padrões comuns de segredo de serviço e mantém o mesmo token para a mesma correspondência, para que um revisor possa compreender as relações sem ver o valor real.

<div class="key-points">
<h3>Before sharing the result</h3>
<ul>
<li><strong>Check comments:</strong> credentials can hide outside YAML values.</li>
<li><strong>Review base64:</strong> encoding does not make a secret safe to share.</li>
<li><strong>Read the output:</strong> ensure the YAML still explains the problem.</li>
</ul>
</div>

## Quando a higienização não é suficiente

Se já tiver sido publicada uma credencial real, trate-a como comprometida: revogue-a e emita uma substituta. A higienização evita uma nova exposição, mas não substitui a rotação ou a revisão das permissões do cluster.

## Perguntas frequentes

### O ScrubForge descodifica todos os segredos do Kubernetes?

Deteta padrões confidenciais e formatos comuns, mas ainda deve rever manualmente os campos específicos da organização.

### O Base64 é seguro para partilhar?

Não. Base64 é codificação reversível, não proteção.

### O manifesto foi carregado?

O ScrubForge higieniza-o localmente. Deve ainda rever o texto final antes de o enviar a terceiros.
