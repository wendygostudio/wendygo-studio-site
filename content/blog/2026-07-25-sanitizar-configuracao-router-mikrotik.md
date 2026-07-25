---
schemaVersion: 1
title: "Sanitizar uma Config de Router MikroTik Antes de Partilhar"
description: "O MikroTik esconde palavras-passe nos exports RouterOS. Topologia, comentários e endereços do servidor continuam visíveis. Eis o que verificar."
date: 2026-07-25
slug: sanitizar-configuracao-router-mikrotik
locale: pt
translationKey: sanitize-mikrotik-router-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar uma config de router MikroTik antes de partilhar"
relatedPages: /pt/scrubforge/,/pt/blog/o-que-a-falha-da-sonicwall-ensina/,/pt/recursos/
sourceUrls: https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters,https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management,https://mikrotik.com/download/changelogs
heading: "Sanitizar uma Config de Router MikroTik Antes de Partilhar"
shortTitle: "Sanitizar uma config MikroTik"
intro: "O RouterOS esconde palavras-passe em /export por predefinição. Mesmo assim, ficam topologia, comentários e endereços de servidor no ficheiro que colas num fórum, num ticket ou num chat de IA."
faqs:
  - question: "O show-sensitive substitui a necessidade de sanitizar uma config MikroTik?"
    answer: "Não. O show-sensitive controla apenas se o RouterOS imprime a sua própria lista predefinida de campos sensíveis — palavras-passe, chaves, secrets. Tudo o resto no export, incluindo endereços IP, comentários e endereços de servidor, continua visível de qualquer forma. É para isso que serve o ScrubForge."
  - question: "A sanitização vai partir a config se precisar de a reimportar?"
    answer: "Sanitiza apenas uma cópia destinada à discussão, a uma publicação num fórum ou a um ticket de suporte — não o ficheiro que planeias reimportar. Reimportar um script precisa dos valores reais das credenciais, por isso mantém o teu export de trabalho separado da versão sanitizada que partilhas publicamente."
  - question: "O ScrubForge reconhece especificamente a sintaxe RouterOS?"
    answer: "Sim. O RouterOS é uma das doze sintaxes de configuração de dispositivos abrangidas pela biblioteca de padrões do ScrubForge, ao lado de Cisco, FortiGate, Juniper e Palo Alto, entre outras."
  - question: "E se já tiver publicado uma config MikroTik não sanitizada?"
    answer: "Edita ou apaga a publicação se a plataforma permitir, depois roda qualquer credencial exposta — palavras-passe, chaves pré-partilhadas, secrets RADIUS. Substituir valores depois do facto não desfaz o que esteve visível enquanto a publicação esteve ativa."
---

Publicar um export de configuração de router numa thread de fórum ou num ticket de suporte é trabalho rotineiro de administração, e os administradores MikroTik fizeram muito disso este mês: o RouterOS 7.21.5 (long-term) e o 6.49.20 foram lançados a 6 de julho de 2026, e uma atualização normalmente significa extrair um `/export` novo para comparar antes e depois.

> **O que o show-sensitive esconde realmente**
> Por predefinição, o `/export` mascara palavras-passe, chaves e secrets numa lista documentada de menus — chaves WireGuard, secrets RADIUS, palavras-passe PPP, palavras-passe de community SNMP, e cerca de mais quarenta campos. Não toca em endereços IP, comentários, ou qualquer coisa fora dessa lista.

## O que o RouterOS já esconde por ti

A documentação do próprio MikroTik é específica quanto a isto: o comando `export` "não exporta palavras-passe de utilizador do sistema, certificados instalados, chaves SSH, nem a base de dados do Dude ou User-manager", e tudo o resto considerado sensível é mascarado a menos que adiciones `show-sensitive` ao comando. Existe uma tabela de referência oficial que lista exatamente qual menu e qual campo é escondido: a [lista de menus com parâmetros sensíveis](https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters) abrange `private-key` e `preshared-key` do WireGuard, `secret` RADIUS, `authentication-password` SNMP, `secret` PPP, chaves IPsec, `password` VRRP, e mais.

Este é um comportamento predefinido genuinamente útil. Também é fácil interpretá-lo como "o export é seguro para colar em qualquer lado", o que não é bem verdade.

## O que um export "limpo" ainda contém

Mascarar uma lista fixa de nomes de parâmetros não toca em texto livre nem em nada fora dessa lista. Um `/export` predefinido continua a incluir:

<div class="key-points">
  <h3>Continua totalmente visível após o mascaramento show-sensitive</h3>
  <ul>
    <li>todos os endereços IP configurados, sub-redes e endpoints de peers WAN;</li>
    <li>comentários de interfaces e VLANs, que muitas vezes nomeiam sistemas internos ou clientes;</li>
    <li>endereços de servidores RADIUS, NTP, DNS e SNMP — o endereço, não só o secret;</li>
    <li>nomes de community SNMP, quando são strings descritivas em vez de palavras-passe;</li>
    <li>identidade do sistema, peers de routing e listas de endereços da firewall.</li>
  </ul>
</div>

Nada disto é um erro. O [guia de gestão de configuração do próprio MikroTik](https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management) mostra sub-redes internas com aspeto real nos seus próprios exemplos de export, porque a topologia é exatamente o que uma importação precisa. Simplesmente não é algo que queiras mostrar a um desconhecido num fórum, ou a uma fila de suporte externa, associado ao teu IP público.

## Sanitizar antes de o show-sensitive sequer importar

<div class="step-card">
  <span class="step-label">Método</span>
  <strong>Exportar, colar, rever, partilhar</strong>
  <p>Executa <code>/export file=config</code> como habitualmente — omite o <code>show-sensitive</code>, não precisas dele para um pedido de suporte ou uma publicação de fórum. Abre o [ScrubForge](/pt/scrubforge/), cola o resultado, e ele assinala strings com aspeto de credenciais correspondentes à sintaxe RouterOS, substituindo cada valor único por um token consistente como <code>[RADIUS_SECRET_1]</code>. Tudo corre localmente no separador do navegador; nada é carregado para lado nenhum.</p>
</div>

| Antes (export bruto) | Depois (sanitizado) |
|---|---|
| `set 0 password=Adm1nR0S!` | `set 0 password=[PASSWORD_1]` |
| `secret="Sup3rShared" address=10.20.0.1` | `secret=[RADIUS_SECRET_1] address=10.20.0.1` |
| `private-key="wG9K...=="` | `private-key=[WG_KEY_1]` |

Repara que o endereço do peer se mantém. É isso que um leitor do fórum ou um técnico de suporte realmente precisa para te ajudar — não o secret ao lado.

## O mesmo hábito funciona para qualquer fabricante

Já abordámos este processo para configs Cisco e FortiGate. O MikroTik é uma das doze sintaxes de fabricantes que o ScrubForge reconhece, ao lado de Juniper e Palo Alto — mesma ideia, nomes de campos diferentes de cada vez. Se estiveres a colar num ticket de suporte em vez de num fórum público, aplica-se o mesmo hábito de sanitizar primeiro, antes de o ficheiro sequer sair da tua máquina.

## Antes de publicares

Uma nota curta ao lado do export sanitizado ajuda: "credenciais substituídas por tokens de marcador; a estrutura está intacta." Diz a quem lê a thread que não há uma palavra-passe ativa ali dentro, e demora dez segundos a acrescentar.

## Perguntas frequentes

### O show-sensitive substitui a necessidade de sanitizar uma config MikroTik?

Não. O show-sensitive controla apenas se o RouterOS imprime a sua própria lista predefinida de campos sensíveis — palavras-passe, chaves, secrets. Tudo o resto no export, incluindo endereços IP, comentários e endereços de servidor, continua visível de qualquer forma. É para isso que serve o ScrubForge.

### A sanitização vai partir a config se precisar de a reimportar?

Sanitiza apenas uma cópia destinada à discussão, a uma publicação num fórum ou a um ticket de suporte — não o ficheiro que planeias reimportar. Reimportar um script precisa dos valores reais das credenciais, por isso mantém o teu export de trabalho separado da versão sanitizada que partilhas publicamente.

### O ScrubForge reconhece especificamente a sintaxe RouterOS?

Sim. O RouterOS é uma das doze sintaxes de configuração de dispositivos abrangidas pela biblioteca de padrões do ScrubForge, ao lado de Cisco, FortiGate, Juniper e Palo Alto, entre outras.

### E se já tiver publicado uma config MikroTik não sanitizada?

Edita ou apaga a publicação se a plataforma permitir, depois roda qualquer credencial exposta — palavras-passe, chaves pré-partilhadas, secrets RADIUS. Substituir valores depois do facto não desfaz o que esteve visível enquanto a publicação esteve ativa.
