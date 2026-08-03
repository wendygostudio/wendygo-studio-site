---
schemaVersion: 1
title: Como descodificar uma carga útil de token JWT no seu navegador
description: >-
  Inspecione as declarações JWT — ID do utilizador, expiração, funções —
  diretamente no seu browser, sem colar tokens no jwt.io ou numa ferramenta web.
  TextForge descodifica Base64url localmente.
date: 2026-06-26T00:00:00.000Z
slug: decode-jwt-token-browser
locale: pt
translationKey: decode-jwt-token-browser
product: textforge
contentType: how-to
primaryKeyword: como descodificar uma carga útil de token jwt no seu navegador
relatedPages: /pt/textforge/
---

# Como descodificar uma carga útil de token JWT no seu navegador

Os JWT (JSON Web Tokens) são utilizados para autenticação em quase todas as APIs modernas. Parecem ruído aleatório – três secções codificadas em Base64url unidas por pontos – mas a secção de carga útil contém JSON legível: ID do utilizador, expiração, funções, escopos. Só precisa de decodificá-lo.

Ao depurar um fluxo de autenticação, verificar por que razão um pedido está a receber 401s ou verificar quais as declarações que um serviço está a enviar, precisa de ver essa carga útil. Esta é a forma mais rápida de o fazer no seu navegador sem colar tokens num site de terceiros.

## O que está dentro de um JWT

Um JWT tem três secções separadas por pontos:

```
CABEÇALHO.PAYLOAD.ASSINATURA
```

- **Cabeçalho** — tipo de token e algoritmo de assinatura (por exemplo, RS256, HS256)
- **Payload** — as declarações como JSON, codificadas em Base64url
- **Assinatura** — verifica se o token não foi adulterado

A carga útil é a secção que pretende. Não é encriptado – apenas codificado. Não precisa da chave secreta para o ler; só precisa da chave para verificar a sua autenticidade.

## Como descodificar a carga útil com o TextForge

O TextForge é uma extensão do Chrome com mais de 50 funções utilitárias de texto. A descodificação Base64 está incluída na versão gratuita e funciona inteiramente na sua máquina.

1. **Copie o JWT** — do DevTools (separador Rede → Cabeçalho de autorização), do seu cliente API ou de uma variável de ambiente.
2. **Identificar a secção de carga útil** — é o segundo pedaço, entre o primeiro e o segundo ponto.
3. **Abra o TextForge** — clique no ícone da extensão na barra de ferramentas do browser.
4. **Cole a secção de carga útil** na área de entrada.
5. **Aplicar descodificação Base64** — as declarações JSON aparecem imediatamente.

## O que verá

Após a descodificação, obterá JSON como:

```json
{"sub":"user_123","email":"user@example.com","role":"admin","exp":1762000000,"iat":1750000000}
```

Reivindicações comuns a procurar:
- `sub` — assunto (geralmente um ID de utilizador ou nome de utilizador)
- `exp` — expiração como carimbo de data/hora Unix (segundos desde a época)
- `iat` — carimbo de data/hora emitido em
- `aud` — público (a que serviço se destina o token)
- `roles` / `scope` — permissões concedidas ao token

## Porque não usar jwt.io?

jwt.io � a ferramenta padr�o e � conveniente. Mas envia o seu JWT para um servidor. Para tokens que cont�m dados reais de utilizadores, IDs de utilizadores internos ou declara��es de �mbito, col�-los numa ferramenta de terceiros � um h�bito que vale a pena evitar, especialmente na depura��o de produ��o.

O TextForge descodifica localmente. O token nunca sai do seu browser.

## Perguntas frequentes

**Posso descodificar a assinatura JWT desta forma?**
A secção de assinatura também é codificada em Base64url, mas a descodificação fornece binário bruto - não JSON legível por humanos. O que realmente pretende é a carga útil (segunda secção), não a subscrição (terceira).

**O TextForge verifica a assinatura JWT?**
Não. O TextForge descodifica a carga útil para inspeção. A verificação da assinatura requer a chave secreta e é feita do lado do servidor. Para fins de inspeção, a descodificação da carga útil é tudo o que precisa.

**Isto funciona offline?**
Sim. A descodificação Base64 é executada localmente na extensão sem necessidade de rede.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
