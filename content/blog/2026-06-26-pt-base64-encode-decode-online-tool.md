---
schemaVersion: 1
title: 'Codificação e descodificação Base64 online – sem upload, sem linha de comandos'
description: >-
  Codifique e descodifique o Base64 no seu browser sem fazer upload de nada. O
  TextForge é uma extensão gratuita do Chrome com conversão instantânea para
  Base64, além de mais de 50 outros utilitários de texto.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-decode-online-tool
locale: pt
translationKey: base64-encode-decode-online-tool
product: textforge
contentType: how-to
primaryKeyword: 'codificação e descodificação base64 online – sem upload, sem linha de comandos'
relatedPages: /textforge/
---

# Codifique e descodifique o Base64 diretamente no seu navegador

O Base64 aparece em todo o lado no desenvolvimento: tokens JWT, chaves API em ficheiros de configuração, URIs de dados de imagem em CSS, cabeçalhos HTTP Basic Auth, anexos MIME de e-mail. O problema não é perceber o que é o Base64 - é o atrito de realmente codificar ou descodificar uma string quando necessário.

As duas soluções alternativas mais comuns são um comando de terminal (`echo -n "text" | base64`) ou uma ferramenta web aleatória. Os comandos de terminal são adequados se estiver numa máquina Unix com um terminal aberto, mas são desajeitados no Windows e requerem troca de contexto. As ferramentas web aleatórias funcionam, mas está a enviar os seus dados (geralmente chaves API, tokens ou valores de configuração) para um servidor desconhecido.

Existe uma opção mais limpa: uma extensão de browser que faz a conversão localmente, sem uploads, sem sair do browser.

## O que é o Base64?

O Base64 é um esquema de codificação binária para texto. Converte dados arbitrários numa string constituída por 64 caracteres ASCII imprimíveis (A – Z, a – z, 0–9, `+`, `/`), sendo `=` utilizado como preenchimento. A saída codificada é aproximadamente 33% superior à entrada.

O objetivo não é a compressão ou a segurança. É para transmitir dados em segurança através de sistemas que apenas lidam com texto ou para incorporar dados binários em formatos que esperam strings (como JSON, XML ou CSS). Qualquer pessoa com a string codificada pode descodificá-la.

## Quando realmente precisa do Base64

**Tokens JWT:** Um JSON Web Token tem três secções codificadas em Base64url unidas por pontos. O cabeçalho e a carga útil não são encriptados – a descodificação da secção intermédia revela as declarações JSON em bruto: expiração, ID do utilizador, funções, escopos.

**HTTP Basic Auth:** O cabeçalho `Authorization: Basic <value>` contém uma string `username:password` codificada em Base64. Decodificá-lo é uma forma rápida de verificar quais as credenciais que um pedido está realmente a enviar.

**URIs de dados:** As imagens pequenas e os SVGs podem ser incorporados diretamente em CSS ou HTML como URIs `data:image/png;base64,…`. É necessário codificar em Base64 o conteúdo do ficheiro para produzir a string incorporada.

**Ficheiros de configuração:** segredos do Kubernetes, variáveis ​​de ambiente de CI e muitas outras ferramentas armazenam valores confidenciais como strings codificadas em Base64 em YAML ou JSON. Codifica o valor bruto antes de o colar na configuração.

**E-mail MIME:** Os anexos de e-mail são codificados em Base64 no corpo da mensagem em bruto. Ao depurar a entrega de e-mail ou analisar mensagens MIME em bruto, terá de descodificar a carga do anexo.

## Porque não usar apenas o terminal ou uma ferramenta Web?

| Method | The friction |
|--------|-------------|
| `echo -n "…" \| base64` | Only works on macOS/Linux. Requires a terminal and the exact syntax (`-n` is critical — without it you encode a trailing newline). |
| `certutil -encode` (Windows) | Adds a header/footer you have to strip. Writes to a file, not stdout. Awkward for quick one-offs. |
| Online web tools | Your data goes to a remote server. Fine for generic text; bad habit for tokens, credentials, or keys. |
| Python one-liner | Requires Python installed and a terminal — more steps than it should be for something this common. |

Uma extensão de browser resolve tudo isto: sempre disponível, sem necessidade de terminal, funciona inteiramente na sua máquina.

## Como codificar e descodificar Base64 com TextForge

O TextForge é uma extensão do Chrome com mais de 50 funções utilitárias de texto. A codificação e descodificação Base64 estão incluídas. Nenhum dado sai da sua máquina — tudo é executado no contexto local da extensão.

### Codificação: Texto → Base64

1. **Instale o TextForge** na Chrome Web Store. Fixe o �cone na sua barra de ferramentas para que esteja sempre � dist�ncia de um clique.
2. **Abra a extensão** clicando no ícone TextForge na barra de ferramentas do browser.
3. **Cole o seu texto** — a string que pretende codificar. Pode ser texto simples, URL, JSON ou qualquer string necessária no formato Base64.
4. **Aplicar codificação Base64** — selecione a função no menu de ferramentas. A saída codificada aparece imediatamente.
5. **Copie o resultado** para a sua área de transferência. Pronto – sem carregamento de página, sem ida e volta do servidor.

### Descodificação: Base64 → Texto

O processo é idêntico ao contrário: cole a string Base64, seleccione Base64 Decode e copie o texto original.

## Exemplos práticos

**Inspeção de uma carga JWT.** Divida qualquer JWT em pontos. A segunda secção é a carga útil – JSON codificado em Base64url. Cole-o no TextForge, descodifique-o e verá as afirmações em bruto. (O Base64url usa `-` em vez de `+` e `_` em vez de `/`, mas para a inspeção da carga útil descodifica perfeitamente.)

**Criação de um segredo Kubernetes.** O Kubernetes armazena os valores secretos como strings codificadas em Base64 no manifesto. Codifique a sua palavra-passe bruta ou chave API com TextForge e cole o resultado diretamente no bloco `data:` do seu YAML secreto.

**Verificação de um cabeçalho de autenticação básica.** Capture o cabeçalho `Authorization` do DevTools, retire o prefixo `Basic ` inicial, cole o restante no TextForge, descodifique-o e confirme se o par `username:password` está correcto.

## Outros utilitários de texto no TextForge

O Base64 é uma das mais de 50 funções do TextForge. Se trabalhar com texto no browser, também encontrará uma utilização frequente para: limpar espaços em branco, converter maiúsculas e minúsculas, classificar linhas, extrair e-mails ou URLs de um bloco de texto, gerar UUIDs e criar slugs a partir de títulos. É um kit de ferramentas de texto de uso geral que se mantém útil muito para além do Base64.

---

O TextForge é gratuito para instalar. A codificação e descodificação Base64 estão disponíveis na versão gratuita – sem necessidade de conta ou subscrição.

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
