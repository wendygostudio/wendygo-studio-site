---
schemaVersion: 1
title: O Base64 codifica os segredos do Kubernetes localmente (sem ferramenta Web)
description: >-
  Os manifestos secretos do Kubernetes requerem valores codificados em Base64.
  Veja como codificar os seus segredos em bruto localmente no seu browser – sem
  terminal, sem site de terceiros.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-kubernetes-secrets
locale: pt
translationKey: base64-encode-kubernetes-secrets
product: textforge
contentType: how-to
primaryKeyword: como codificar segredos do kubernetes em base64 sem uma ferramenta web
relatedPages: /textforge/
---

# Como codificar segredos do Kubernetes em Base64 sem uma ferramenta Web

O Kubernetes armazena valores confidenciais em manifestos secretos. Ao contrário dos ConfigMaps, que aceitam texto simples, os campos `dados` secretos requerem valores codificados em Base64. Muitos programadores colam palavras-passe brutas e chaves API em ferramentas Base64 online – que enviam essas credenciais para um servidor de terceiros.

Existe uma opção mais segura: codifique diretamente no seu browser utilizando uma extensão do Chrome que nunca transmite os seus dados.

## Porque é que o Kubernetes usa Base64

Os manifestos secretos do Kubernetes são assim:

```yaml
versão api: v1
tipo: Secreto
metadados:
nome: credenciais de base de dados
tipo: Opaco
dados:
password: c3VwZXJzZWNyZXQ=
chave API: c2tfdGVzdF84YzhiNDU2MA==
```

Os valores em `data:` estão codificados em Base64. Os valores brutos (`supersecret`, `sk_test_8c8b4560`) nunca são armazenados diretamente no manifesto.

**Importante:** Base64 não é encriptação. Qualquer pessoa com acesso ao manifesto secreto pode descodificar os valores instantaneamente. Os segredos do Kubernetes fornecem controlo de acesso ao nível do cluster – a codificação Base64 é puramente um requisito de formato da API, não uma medida de segurança.

## Codificação de valores secretos com TextForge

O TextForge é uma extensão do Chrome com mais de 50 utilitários de texto. A codificação Base64 está disponível na versão gratuita e é executada inteiramente localmente.

1. **Abra o TextForge** — clique no ícone da extensão na barra de ferramentas do browser.
2. **Cole o valor secreto em bruto** — a sua palavra-passe, chave API, string de ligação ou qualquer valor que necessite de introduzir no manifesto.
3. **Aplicar codificação Base64** — a string codificada aparece imediatamente.
4. **Copie a saída** e cole-a no bloco `data:` do seu YAML do Kubernetes.

Sem terminal, sem ferramenta web, sem dados a sair da sua máquina.

## Usando `stringData` em vez

O Kubernetes também aceita um campo `stringData` que aceita valores de texto simples — a API codifica-os automaticamente:

```yaml
stringDados:
password: supersecreta
```

`stringData` é adequado para valores que está a criar novos. Mas se estiver a ler um manifesto secreto existente, os valores armazenados estarão sempre em `data:` no formato Base64 — que é quando precisa de os descodificar para inspeção.

## Descodificando para verificar

Para verificar um valor codificado existente num manifesto, cole-o no TextForge e aplique a descodificação Base64. Obtém o valor bruto imediatamente, sem executar:

```bash
kubectl obtém credenciais secretas da base de dados -o jsonpath='{.data.password}' | base64 --descodificar
```

## Perguntas frequentes

**A codificação Base64 é necessária para todos os segredos do Kubernetes?**
Apenas para o campo `data:`. Se utilizar `stringData:`, o Kubernetes encarregar-se-á da codificação. A maioria das ferramentas e tutoriais utilizam `data:` nos exemplos, daí a necessidade de codificar manualmente.

**Posso codificar valores multilinha como certificados TLS?**
Sim. Cole o certificado completo (incluindo o cabeçalho e rodapé `-----BEGIN CERTIFICATE-----`) no TextForge e codifique-o. A string resultante vai para o campo `data:`.

**Esta função é gratuita no TextForge?**
Sim. A codificação e descodificação Base64 estão na versão gratuita – não é necessária conta ou subscrição.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
