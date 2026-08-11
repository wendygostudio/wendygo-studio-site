---
schemaVersion: 1
title: Como partilhar a configuração de rede com tickets de suporte em segurança
description: >-
  Quando o seu router Cisco cai ou a firewall FortiGate começa a perder tráfego,
  a primeira chamada é para o suporte do fornecedor. Vão pedir o seu...
date: 2026-07-01T00:00:00.000Z
slug: share-network-config-support-ticket-safely
locale: pt
translationKey: share-network-config-support-ticket
product: scrubforge
contentType: how-to
primaryKeyword: partilhar ticket de suporte de configuração de rede
relatedPages: '/pt/scrubforge/,/pt/blog/scrubforge-chatgpt-network-troubleshooting/'
---

Quando o seu router Cisco cai ou a firewall FortiGate começa a perder tráfego, a primeira chamada é para o suporte do fornecedor. Eles pedirão a sua configuração em execução. É a forma mais rápida de diagnosticar o problema. O problema: a sua configuração contém credenciais ativas que não devem sair da sua rede.

O ScrubForge resolve exatamente isso: higienize localmente e anexe a versão limpa ao seu ticket de suporte.

## Por que razão as configurações brutas nos tickets de suporte são um risco

Quando envia um ficheiro de configuração por e-mail ou o anexa a um caso Cisco TAC, a um ticket Jira ou a um portal de suporte do fornecedor, este ficheiro vai para um sistema que não controla totalmente. Dependendo das práticas de segurança do fornecedor, as suas credenciais podem ser:

- Registado nas bases de dados do sistema de suporte
- Acessível ao pessoal de apoio
- Retido por mais tempo do que o esperado
- Partilhado entre equipas internas para depuração

Nada disto é incomum. A maioria dos sistemas de apoio empresarial são razoavelmente seguros. Mas uma configuração de firewall de produção que contenha chaves VPN ativas e palavras-passe de administrador não precisa de estar numa base de dados de suporte. O fornecedor não precisa das suas credenciais para resolver problemas de configuração — precisa da estrutura.

## O fluxo de trabalho do ticket de suporte ScrubForge+

1. **Exporte a sua configuração** — No Cisco IOS: `show running-config`. No FortiGate: Sistema > Configuração > Download.
2. **Abra o ScrubForge** — Clique no ícone na barra de ferramentas do Chrome.
3. **Colar e higienizar** — Cole a definição em bruto. O ScrubForge substitui as palavras-passe, chaves, tokens e strings SNMP por espaços reservados consistentes como `[PSK_1]` ou `[ADMIN_PASS_1]`.
4. **Revisão** — Verifique a saída em busca de qualquer coisa que pareça credenciais ativas. Uma verificação de 30 segundos é uma boa prática.
5. **Anexar ao ticket** — Copie o resultado limpo para o seu ticket de suporte ou e-mail, ou guarde-o como um ficheiro `. txt` e faça o upload.

## O que incluir no seu ticket de suporte

Ao anexar uma configuração higienizada, adicione uma nota de uma linha:

> "Configuração anexada. As credenciais foram higienizadas (substituídas por tokens de espaço reservado consistentes; a estrutura e a lógica estão intactas)."

Isto informa o engenheiro de suporte do que está a ver e por que razão não verá os valores ativos.

A maioria dos engenheiros de suporte compreenderá imediatamente. Sabem que a estrutura é o que importa para a resolução de problemas: protocolos de encaminhamento, IPs de pares VPN, políticas de firewall, definições de interface. Nada disto são credenciais.

## Antes e depois

```
--- ANTES (cru) ---
chave cripto isakmp T@nn3lS3cr3t endereço 198.51.100.10
nome de utilizador palavra-passe de administrador cisco123
RO público da comunidade snmp-server

--- DEPOIS (higienizado) ---
Isakmp chave encriptada [PSK_1] endereço 198.51.100.10
nome de utilizador palavra-passe de administrador [ADMIN_PASS_1]
comunidade de servidores snmp [SNMP_RO_1] RO
```

O IP do peer, os nomes das interfaces e as políticas mantêm-se. As credenciais não.

## Isto funciona com qualquer fornecedor

Quer seja Cisco, FortiGate, Palo Alto, Juniper ou pfSense, o princípio é o mesmo: higienize as definições baseadas em texto antes de partilhar. O ScrubForge deteta padrões de credenciais comuns em qualquer formato baseado em texto.

---

### Perguntas frequentes

**P: O engenheiro de suporte ainda poderá resolver problemas se as credenciais forem substituídas?**
R: Sim. Os engenheiros de suporte resolvem problemas de lógica de configuração — encaminhamento, definições de VPN, políticas de firewall. Nada disto depende de ver o valor real da credencial. A configuração higienizada oferece tudo o que precisam.

**P: E se o sistema de tickets de suporte armazenar ficheiros indefinidamente?**
R: A vantagem da higienização antes do upload é que, mesmo que o ticket nunca seja eliminado ou acedido posteriormente, não existem credenciais ativas no mesmo. Quebrou o vínculo entre a sua rede em execução e a base de dados de suporte.

**P: O ScrubForge afeta os endereços IP da rede?**
R: Não. Por defeito, o ScrubForge substitui os padrões de credenciais – palavras-passe, chaves, tokens, strings SNMP – e não os endereços IP. A sua topologia de rede, IPs de pares e sub-redes permanecem intactos, e é exatamente isso que os engenheiros de suporte precisam de ver.

---

### Instale o ScrubForge

Higienização local gratuita para qualquer configuração baseada em texto. Cole, retire credenciais e partilhe em segurança com o suporte do fornecedor, fóruns ou qualquer sistema externo — sem conta, sem carregamento, sem servidores de terceiros.

<a href="https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe">Install ScrubForge on Chrome →</a>

**Relacionado:** [Como utilizar o ScrubForge com o ChatGPT para a resolução de problemas de rede](/blog/scrubforge-chatgpt-network-troubleshooting/)
