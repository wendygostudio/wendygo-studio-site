---
schemaVersion: 1
locale: pt
translationKey: sanitize-network-config-before-sharing
xDefaultPath: /blog/sanitize-network-config-before-sharing/
title: "Sanitizar uma configuração de rede antes de a partilhar"
description: "Remova localmente segredos de configurações Cisco, FortiGate e cloud antes de enviar ao suporte ou a uma IA."
date: 2026-07-26
slug: sanitizar-configuracao-rede
product: ScrubForge
contentType: how-to
primaryKeyword: "sanitizar configuração de rede"
relatedPages: "/pt/scrubforge/,/blog/sanitize-network-config-before-sharing/"
heading: "Sanitizar uma configuração de rede antes de a partilhar"
intro: "Substitua valores sensíveis localmente sem perder a estrutura necessária para diagnosticar o problema."
faqs:
  - question: "O ScrubForge identifica todos os segredos?"
    answer: "Deteta padrões comuns; reveja sempre o resultado para valores próprios ou fora do padrão."
---

Uma configuração de rede contém mais do que definições técnicas: palavras-passe, tokens de API, strings SNMP, nomes de hosts internos e endereços podem expor acessos e a topologia. Limpe o excerto antes de o enviar a suporte, fóruns ou um assistente de IA.

[ScrubForge](/pt/scrubforge/) processa o texto colado localmente no navegador. O mesmo valor recebe o mesmo marcador, como `[IP_1]` ou `[SECRET_1]`. Assim, as relações entre rotas, ACLs e políticas continuam compreensíveis, sem copiar os dados reais.

1. Copie apenas a parte indispensável da configuração.
2. Cole-a no ScrubForge e escolha o perfil adequado.
3. Reveja a pré-visualização para credenciais, chaves, nomes internos e detalhes de topologia.
4. Partilhe somente a versão sanitizada.

Marcadores consistentes permitem que quem analisa o texto siga um endereço repetido ou uma dependência entre objetos. O original fica no seu dispositivo. Sanitizar não substitui uma revisão: remova também comentários, nomes de clientes e formatos de segredo invulgares, e divulgue só o contexto mínimo necessário.
