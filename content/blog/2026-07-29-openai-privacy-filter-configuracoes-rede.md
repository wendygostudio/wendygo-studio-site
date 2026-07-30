---
schemaVersion: 1
title: "O Privacy Filter da OpenAI Não Sabe o Que É uma Palavra-Passe BGP"
description: "A OpenAI lançou como open source um modelo que redige PII antes de chegar a uma IA. Isto é exatamente o que ele deteta, o que nunca foi construído para detetar, e porque as configs de rede continuam a precisar de uma ferramenta dedicada."
date: 2026-07-29
slug: openai-privacy-filter-configuracoes-rede
locale: pt
translationKey: openai-privacy-filter-network-configs
product: scrubforge
contentType: use-case
primaryKeyword: "openai privacy filter configuração de rede"
relatedPages: /scrubforge/
---

A OpenAI lançou recentemente o Privacy Filter como open source, um modelo pequeno construído para detetar e redigir informação pessoal identificável em texto, que corre localmente, num portátil ou diretamente no navegador, e reporta um F1 de 96-97% na deteção de PII. É um lançamento genuinamente útil. Também não foi construído para proteger o que a maioria dos engenheiros de rede realmente cola num chat de IA: uma configuração de router ou firewall.

## Para que serve realmente o Privacy Filter

<div class="key-points">
  <h3>O que o modelo visa</h3>
  <ul>
    <li>Nomes, emails, números de telefone, moradas — PII clássica, do tipo que aparece em emails, tickets de suporte e documentos legais.</li>
    <li>Deteção consciente do contexto em documentos longos, até 128.000 tokens numa única passagem, uma conquista de engenharia real para esse caso de uso.</li>
    <li>Corre no dispositivo, pesos abertos, licença Apache 2.0 — nenhum dado sai da máquina para ser redigido, o modelo de privacidade correto.</li>
  </ul>
</div>

É uma ferramenta sólida para aquilo para que foi construída: documentos legais, threads de email, registos de clientes. É um modelo de PII de propósito geral, treinado no tipo de dados pessoais que aparece em qualquer indústria.

## O que nunca foi treinado para reconhecer

Um ficheiro de configuração de rede não se parece com um documento legal ou um registo de cliente. Parece-se com isto:

```
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
snmp-server community publicRW RW
router bgp 65001
 neighbor 203.0.113.1 remote-as 65002
 neighbor 203.0.113.1 password 7 08351A5D0713
```

<div class="step-card">
  <span class="step-label">Verificação da realidade</span>
  <strong>Nada disto é PII, e tudo isto é uma credencial</strong>
  <p>Uma community string SNMP, uma palavra-passe de vizinho BGP, uma chave de autenticação OSPF, uma chave de servidor TACACS+, uma chave pré-partilhada WPA — nada disto corresponde à distribuição de treino de um modelo de PII genérico, porque não são nomes, emails ou telefones. São segredos específicos de domínio que só fazem sentido no contexto da sintaxe de configuração de rede, e um modelo treinado com dados legais e de clientes nunca teve motivo para ter visto um.</p>
</div>

Existe uma segunda lacuna igualmente importante: **a robustez da credencial**. `enable secret 5` é um hash MD5. `password 7` é uma cifra Cisco tipo 7, trivialmente reversível com ferramentas que existem há mais de uma década. Um modelo de redação de PII não tem qualquer conceito de "este hash é fraco" ou "esta codificação é reversível" — ou reconhece um padrão como PII ou não reconhece. Distinguir um hash bcrypt forte de uma palavra-passe Cisco tipo 7 reversível requer conhecer os esquemas de codificação do fabricante, não apenas reconhecer texto com aspeto sensível.

## Testar a lacuna

Passe um export real de Cisco, FortiGate ou MikroTik por um detetor de PII genérico e o padrão é consistente: apanha algo se houver um endereço de email ou um hostname que pareça um domínio, e passa completamente ao lado do `enable secret`, da community SNMP, da palavra-passe de vizinho BGP e da chave pré-partilhada. Isto não é uma falha do modelo. Está simplesmente fora daquilo para que foi treinado a procurar, da mesma forma que um corretor ortográfico não está avariado por não detetar um erro matemático.

## O que isto significa se cola configs em ferramentas de IA

A leitura correta do lançamento da OpenAI não é "a redação já é um problema resolvido". É o oposto: a redação de PII de propósito geral está a caminhar para ser gratuita e comoditizada, o que é genuinamente bom para quem lida com nomes, emails e dados de clientes. Mas torna ainda mais nítido onde está a lacuna que resta: segredos específicos de domínio em formatos técnicos estruturados, sendo as configs de rede um dos exemplos mais claros.

<table>
<tr><th>Coberto por modelos de PII genéricos</th><th>Não coberto, precisa de deteção consciente do fabricante</th></tr>
<tr><td>Nomes, emails, telefones</td><td>Community strings SNMP</td></tr>
<tr><td>Moradas físicas</td><td>Chaves de autenticação BGP / OSPF / HSRP</td></tr>
<tr><td>Números de cartão de crédito</td><td>Chaves de servidor TACACS+ / RADIUS</td></tr>
<tr><td>Formatos genéricos de chaves de API</td><td>Codificações de palavra-passe específicas de fabricante (ex. Cisco tipo 7)</td></tr>
<tr><td>—</td><td>Classificação de robustez de hash/cifra</td></tr>
</table>

Se está a colar uma config no ChatGPT, Claude ou Gemini para depurar um problema de encaminhamento, um filtro de PII genérico a correr em segundo plano não vai apanhar a parte que realmente importa. O [ScrubForge](/pt/scrubforge/) foi construído especificamente para essa lacuna: 12 perfis de fabricante, deteção de segredos ao nível do protocolo (BGP, OSPF, HSRP, TACACS+, RADIUS, SNMP), e classificação de robustez de hash, a correr inteiramente em local, com um chat BYOK opcional que só vê a versão tokenizada da sua config.

## Perguntas frequentes

### O Privacy Filter da OpenAI protege palavras-passe numa config de router ou firewall?

Não de forma fiável. Está treinado para detetar PII genérica, nomes, emails, telefones, não credenciais de rede específicas de fabricante como community strings SNMP ou palavras-passe de vizinho BGP, que seguem uma sintaxe completamente diferente e não fizeram parte do seu foco de treino.

### Se o ChatGPT vier a adicionar redação de PII integrada, as configs de rede continuarão em risco?

Sim, pelo mesmo motivo. Uma redação integrada orientada para a conformidade geral de PII não estará calibrada para reconhecer a sintaxe de configuração de router ou firewall a menos que um fornecedor treine especificamente para isso, o que é um caso de uso estreito e de baixo volume comparado com os padrões de PII que aparecem em qualquer outro tipo de documento.

### Qual é a diferença prática entre redação de PII e sanitização de configs?

A redação de PII protege dados pessoais, informação que identifica uma pessoa. A sanitização de configs protege segredos de infraestrutura, credenciais e topologia que identificam e concedem acesso a uma rede. Sobrepõem-se em quase nenhum caso, e uma ferramenta construída para uma raramente cobre bem a outra.

### Continua a ser necessário sanitizar configs manualmente se confiar no fornecedor de IA?

Sanitizar antes de colar protege-o independentemente do que qualquer fornecedor prometa sobre o tratamento de dados, e protege contra o risco mais simples de um colega, um ecrã partilhado, ou um log de chat copiado e colado levar uma credencial ativa para algum sítio onde não deveria ir.
