---
schemaVersion: 1
title: "O Que a Falha da SonicWall Ensina Sobre Partilhar Configs"
description: "Os backups na nuvem da SonicWall expuseram dados de config de todos os clientes. Se esse backup não era seguro, um ticket de suporte também não é."
date: 2026-07-25
slug: o-que-a-falha-da-sonicwall-ensina
locale: pt
translationKey: what-the-sonicwall-backup-breach-teaches-about-config-sharing
product: scrubforge
contentType: use-case
primaryKeyword: "é seguro partilhar um backup de configuração de firewall"
relatedPages: /pt/scrubforge/,/pt/blog/sanitizar-configuracao-router-mikrotik/,/pt/recursos/
sourceUrls: https://www.sonicwall.com/support/notices/mysonicwall-cloud-backup-file-incident/kA1VN0000000RoD0AU,https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident
heading: "O Que a Falha da SonicWall Ensina Sobre Partilhar Configs"
shortTitle: "A lição da falha da SonicWall"
intro: "A SonicWall confirmou que um ataque de força bruta ao seu portal MySonicWall.com expôs ficheiros de backup de configuração de firewall de todos os clientes que usaram o serviço de backup na nuvem — não um subconjunto, todos. Os ficheiros vinham diretamente da própria função de backup oficial do fabricante."
faqs:
  - question: "O que aconteceu exatamente no incidente de backups da SonicWall?"
    answer: "Um atacante usou técnicas de força bruta contra o portal de clientes MySonicWall.com e acedeu a ficheiros de backup de configuração (.EXP). A investigação da SonicWall, feita com a Mandiant, estimou inicialmente que menos de 5% dos clientes com backup na nuvem estavam afetados, mas confirmou na atualização final que todos os clientes que tinham usado a função de backup na nuvem foram afetados."
  - question: "Os ficheiros de backup expostos estavam cifrados?"
    answer: "Parcialmente. As credenciais e secrets dentro do ficheiro .EXP estão cifradas individualmente (AES-256 em firewalls Gen 7 e posteriores, o mais antigo 3DES em Gen 6), mas o resto da configuração está apenas codificado, não cifrado — topologia, regras, intervalos de IP e outros detalhes são legíveis após a descodificação. A própria SonicWall recomenda tratar qualquer ficheiro exposto como motivo para redefinir credenciais."
  - question: "Isto significa que os backups na nuvem dos fabricantes não são seguros?"
    answer: "Não, o aviso da SonicWall trata de um portal comprometido por força bruta, não de uma falha no conceito de backup. A lição é mais específica: um export de configuração contém mais detalhe utilizável do que a maioria assume, por isso onde quer que esse ficheiro ou o seu conteúdo viaje — um backup na nuvem do fabricante, um ticket de suporte, um chat de IA — merece o mesmo escrutínio."
  - question: "O que devo verificar na minha própria firewall depois de ler isto?"
    answer: "Se usas a função de backup na nuvem do MySonicWall, inicia sessão e verifica Product Management > Issue List para números de série afetados, depois segue as orientações da SonicWall para a redefinição essencial de credenciais. Separadamente, sanitiza qualquer ficheiro de configuração antes de o colares em qualquer sítio — um ticket de suporte, uma publicação num fórum ou um assistente de IA."
---

O backup de um fabricante devia ser o lugar seguro para a tua configuração. Em setembro de 2025, a SonicWall confirmou que isso não era verdade para os seus clientes de backup na nuvem, e os detalhes merecem ser lidos mesmo que não uses uma firewall SonicWall.

> **O que a SonicWall confirmou**
> Um atacante realizou ataques de força bruta contra o portal de clientes MySonicWall.com e obteve acesso a ficheiros de backup de configuração de firewall. O [aviso de incidente da própria SonicWall](https://www.sonicwall.com/support/notices/mysonicwall-cloud-backup-file-incident/kA1VN0000000RoD0AU), realizado em conjunto com a empresa de resposta a incidentes Mandiant, estimou inicialmente que menos de 5% dos clientes com backup na nuvem estavam afetados, mas confirmou na atualização final que **todos** os clientes que tinham usado a função de backup na nuvem foram afetados. A [CISA emitiu o seu próprio aviso](https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident) instando todos os clientes da SonicWall a verificarem a sua conta.

## O que continham realmente os ficheiros expostos

Esta é a parte que importa para além dos clientes específicos da SonicWall. Um export de configuração de firewall (um ficheiro `.EXP`) é uma imagem completa do dispositivo: não só palavras-passe, mas também topologia, intervalos de IP, regras e detalhes de integração.

<div class="key-points">
  <h3>O que está protegido, e o que não está</h3>
  <ul>
    <li><strong>As credenciais e secrets</strong> estão cifradas individualmente — AES-256 em firewalls Gen 7 e posteriores, o mais antigo 3DES em Gen 6.</li>
    <li><strong>Tudo o resto no ficheiro</strong> — esquema de rede, conjuntos de regras, endereçamento — está apenas codificado, não cifrado, logo legível após uma simples descodificação.</li>
    <li><strong>O propósito completo do ficheiro</strong> é restaurar um dispositivo ao seu estado exato capturado, e é precisamente por isso que é perigoso fora de um canal de confiança: foi concebido para conter tudo o que é necessário para reconstruir a tua configuração.</li>
  </ul>
</div>

O aviso da SonicWall é explícito quanto a isto: mesmo com as credenciais cifradas, "a posse destes ficheiros pode aumentar o risco de ataques direcionados" devido a tudo o resto que o ficheiro revela sobre como a rede está construída.

## Porque é que isto se aplica a mais do que um fabricante

<div class="step-card">
  <span class="step-label">Caso de uso</span>
  <strong>O ficheiro de backup e o excerto do ticket de suporte têm o mesmo problema</strong>
  <p>Quer uma configuração saia do teu controlo através de um portal do fabricante comprometido, uma publicação colada num fórum, uma janela de chat de IA ou um anexo de email ao suporte, o risco é o mesmo: o ficheiro foi construído para conter tudo o necessário para descrever ou reconstruir a tua rede, e a maior parte desse detalhe nunca foi pensada para ser exposta fora de um canal de confiança. O incidente da SonicWall lembra que mesmo o canal "oficial", validado pelo fabricante, pode falhar. Um ticket de suporte ou um chat de IA nem sequer têm a cifragem que um backup na nuvem pelo menos tenta aplicar.</p>
</div>

| O que contém um export de config em bruto | O que é realmente necessário para resolver ou restaurar |
|---|---|
| Todas as regras da firewall, na íntegra | As uma ou duas regras relevantes para o problema |
| Intervalos de IP internos e topologia completos | Estrutura suficiente para explicar o problema, não o mapa inteiro |
| Hostnames, endereços de servidor, endpoints de integração | Marcadores redigidos que preservam a lógica |
| Qualquer credencial ou chave incorporada, mesmo cifrada | Nada — as credenciais nunca pertencem a um ficheiro partilhado |

## Antes de partilhares uma config em qualquer lado

Se vais [partilhar uma config de rede com uma equipa de suporte](/pt/blog/sanitizar-configuracao-router-mikrotik/), o incidente da SonicWall é um bom argumento para a sanitizares primeiro, seja qual for o portal do fabricante, o assistente de IA ou o fórum onde a publicas. O [ScrubForge](/pt/scrubforge/) remove exatamente o detalhe que um ficheiro de backup expõe: credenciais, intervalos de IP, hostnames e topologia, mantendo a estrutura da config suficientemente intacta para conseguires ajuda de verdade.

Se usas a função de backup na nuvem do MySonicWall, verifica a tua conta diretamente em vez de confiares apenas neste artigo: o aviso da SonicWall tem os passos exatos, e a secção Product Management > Issue List na tua conta MySonicWall mostrará se algum dos teus números de série foi assinalado.

## Perguntas frequentes

### O que aconteceu exatamente no incidente de backups da SonicWall?

Um atacante usou técnicas de força bruta contra o portal de clientes MySonicWall.com e acedeu a ficheiros de backup de configuração (.EXP). A investigação da SonicWall, feita com a Mandiant, estimou inicialmente que menos de 5% dos clientes com backup na nuvem estavam afetados, mas confirmou na atualização final que todos os clientes que tinham usado a função de backup na nuvem foram afetados.

### Os ficheiros de backup expostos estavam cifrados?

Parcialmente. As credenciais e secrets dentro do ficheiro .EXP estão cifradas individualmente (AES-256 em firewalls Gen 7 e posteriores, o mais antigo 3DES em Gen 6), mas o resto da configuração está apenas codificado, não cifrado — topologia, regras, intervalos de IP e outros detalhes são legíveis após a descodificação. A própria SonicWall recomenda tratar qualquer ficheiro exposto como motivo para redefinir credenciais.

### Isto significa que os backups na nuvem dos fabricantes não são seguros?

Não, o aviso da SonicWall trata de um portal comprometido por força bruta, não de uma falha no conceito de backup. A lição é mais específica: um export de configuração contém mais detalhe utilizável do que a maioria assume, por isso onde quer que esse ficheiro ou o seu conteúdo viaje — um backup na nuvem do fabricante, um ticket de suporte, um chat de IA — merece o mesmo escrutínio.

### O que devo verificar na minha própria firewall depois de ler isto?

Se usas a função de backup na nuvem do MySonicWall, inicia sessão e verifica Product Management > Issue List para números de série afetados, depois segue as orientações da SonicWall para a redefinição essencial de credenciais. Separadamente, sanitiza qualquer ficheiro de configuração antes de o colares em qualquer sítio — um ticket de suporte, uma publicação num fórum ou um assistente de IA.
</content>
