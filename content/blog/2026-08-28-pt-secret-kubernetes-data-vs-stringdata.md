---
schemaVersion: 1
title: "Secret do Kubernetes: data ou stringData e quando é necessária Base64"
description: "Saiba quando um Secret do Kubernetes exige Base64 em data, quando stringData é mais simples e porque a codificação não substitui a encriptação."
date: 2026-08-28
slug: secret-kubernetes-data-vs-stringdata
locale: pt
translationKey: kubernetes-secret-data-vs-stringdata
product: textforge
contentType: how-to
primaryKeyword: "Secret Kubernetes data ou stringData"
relatedPages: /pt/textforge/,/pt/scrubforge/,/pt/blog/base64-encode-kubernetes-secrets/,/pt/blog/remove-secrets-kubernetes-config/
sourceUrls: https://kubernetes.io/docs/concepts/configuration/secret/,https://kubernetes.io/docs/concepts/security/secrets-good-practices/
faqs:
  - question: "Os valores de data de um Secret do Kubernetes precisam de Base64?"
    answer: "Sim. Os valores no campo data são serializados como cadeias Base64. stringData aceita texto normal e o servidor da API codifica-o ao criar ou atualizar o Secret."
  - question: "Devo usar data ou stringData num manifesto?"
    answer: "Use stringData para texto literal se o seu fluxo de implementação o suportar. Use data quando precisar da representação serializada ou a sua ferramenta exigir valores já codificados."
  - question: "A Base64 protege um Secret do Kubernetes?"
    answer: "Não. Base64 é codificação reversível, não encriptação. Proteja o manifesto e o acesso ao cluster de acordo com as orientações do Kubernetes."
---

# Secret do Kubernetes: data ou stringData e quando é necessária Base64

Os campos `data` e `stringData` de um Secret do Kubernetes representam os mesmos valores lógicos, mas são interfaces de escrita diferentes. `data` espera cadeias codificadas em Base64. `stringData` aceita texto normal e deixa que o servidor da API do Kubernetes faça a codificação.

Esta diferença importa ao escrever, rever ou editar um manifesto. Nenhum dos campos é uma fronteira de segurança: Base64 é codificação, não encriptação.

## A diferença prática

Use `data` quando o valor já estiver serializado para a API de Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: credenciais-app
type: Opaque
data:
  username: YWRtaW4=
  password: c2FtcGxlLXBhc3M=
```

Use `stringData` quando quiser escrever valores literais:

```yaml
stringData:
  username: admin
  password: sample-pass
```

A [documentação do Kubernetes sobre Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) descreve `stringData` como uma forma prática de fornecer valores não codificados. Também avisa que `stringData` não funciona bem com server-side apply; confirme o seu método de implementação.

## Que campo escolher?

`stringData` é normalmente mais legível para um manifesto novo escrito à mão, se o fluxo o suportar. `data` é útil quando outro sistema já gera a forma serializada, quando está a editar um manifesto existente ou quando as suas ferramentas esperam valores codificados.

Não guarde credenciais reais num repositório só porque estão em `data`. Qualquer pessoa que consiga ler o manifesto pode descodificá-las. O Kubernetes separa a segurança do acesso e da distribuição do Secret da sua representação em YAML.

## Codificar ou descodificar localmente

Se um manifesto contiver um valor em `data`, descodifique uma cópia local apenas quando precisar de o inspecionar. Para criar um valor `data`, codifique localmente o valor original e copie apenas o resultado para o manifesto de trabalho.

O TextForge pode codificar e descodificar texto no navegador sem enviar o valor para um servidor da Wendygo. Trabalhe com uma cópia e mantenha o original no ambiente seguro. Para partilhar um manifesto, o [ScrubForge](https://wendygostudio.com/pt/scrubforge/) é mais adequado: limpe primeiro a cópia, em vez de apenas codificar o Secret.

## Lista de decisão

1. Está a criar um Secret a partir de texto literal? Considere `stringData` depois de confirmar o método de aplicação.
2. Está a editar um campo `data` existente? Descodifique apenas uma cópia local quando for necessário inspecioná-lo.
3. A sua pipeline exige `data`? Codifique localmente e valide o YAML.
4. O manifesto vai sair do ambiente seguro? Remova ou substitua as credenciais antes de o partilhar.
5. Uma credencial pode ter sido exposta? Rode-a; codificar ou limpar não desfaz a exposição.

Consulte as [boas práticas do Kubernetes para Secrets](https://kubernetes.io/docs/concepts/security/secrets-good-practices/) juntamente com a sua política de acesso ao cluster.

## Perguntas frequentes

### Os valores de `data` precisam de Base64?

Sim. `data` é serializado como cadeias Base64. `stringData` aceita texto normal e o Kubernetes codifica-o durante a criação ou atualização.

### Devo usar `data` ou `stringData`?

Use `stringData` para texto literal se o seu fluxo o suportar. Use `data` se as suas ferramentas exigirem a forma serializada.

### A Base64 protege um Secret?

Não. É codificação reversível, não encriptação. Proteja o manifesto, o cluster e o repositório.
