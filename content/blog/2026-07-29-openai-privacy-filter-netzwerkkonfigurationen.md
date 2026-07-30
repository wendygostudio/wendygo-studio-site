---
schemaVersion: 1
title: "OpenAIs Privacy Filter Weiß Nicht, Was Ein BGP-Passwort Ist"
description: "OpenAI hat ein Modell als Open Source veröffentlicht, das PII erkennt und schwärzt, bevor sie eine KI erreicht. Das erkennt es genau, das wurde es nie trainiert zu erkennen, und deshalb brauchen Netzwerkkonfigurationen weiterhin ein dediziertes Tool."
date: 2026-07-29
slug: openai-privacy-filter-netzwerkkonfigurationen
locale: de
translationKey: openai-privacy-filter-network-configs
product: scrubforge
contentType: use-case
primaryKeyword: "openai privacy filter netzwerkkonfiguration"
relatedPages: /scrubforge/
---

OpenAI hat kürzlich Privacy Filter als Open Source veröffentlicht, ein kleines Modell, das persönlich identifizierbare Informationen in Text erkennt und schwärzt, lokal läuft, auf einem Laptop oder direkt im Browser, und einen F1-Score von 96-97% bei der PII-Erkennung erreicht. Es ist eine echt nützliche Veröffentlichung. Sie ist auch nicht dafür gebaut, das zu schützen, was die meisten Netzwerktechniker tatsächlich in einen KI-Chat einfügen: eine Router- oder Firewall-Konfiguration.

## Wofür Privacy Filter eigentlich gedacht ist

<div class="key-points">
  <h3>Worauf das Modell abzielt</h3>
  <ul>
    <li>Namen, E-Mails, Telefonnummern, Adressen — klassische PII, wie sie in E-Mails, Support-Tickets und Rechtsdokumenten vorkommt.</li>
    <li>Kontextbewusste Erkennung über lange Dokumente hinweg, bis zu 128.000 Tokens in einem einzigen Durchgang, eine echte ingenieurtechnische Leistung für diesen Anwendungsfall.</li>
    <li>Läuft auf dem Gerät, offene Gewichte, Apache-2.0-Lizenz — keine Daten verlassen die Maschine, um sie zu schwärzen, das richtige Datenschutzmodell.</li>
  </ul>
</div>

Das ist ein solides Tool für das, wofür es gebaut wurde: Rechtsdokumente, E-Mail-Threads, Kundendatensätze. Es ist ein universelles PII-Modell, trainiert auf die Art persönlicher Daten, die branchenübergreifend vorkommen.

## Was es nie zu erkennen gelernt hat

Eine Netzwerkkonfigurationsdatei sieht nicht aus wie ein Rechtsdokument oder ein Kundendatensatz. Sie sieht so aus:

```
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
snmp-server community publicRW RW
router bgp 65001
 neighbor 203.0.113.1 remote-as 65002
 neighbor 203.0.113.1 password 7 08351A5D0713
```

<div class="step-card">
  <span class="step-label">Realitätscheck</span>
  <strong>Nichts davon ist PII, und alles davon ist eine Anmeldedaten</strong>
  <p>Ein SNMP-Community-String, ein BGP-Nachbar-Passwort, ein OSPF-Authentifizierungsschlüssel, ein TACACS+-Serverschlüssel, ein WPA-Pre-Shared-Key — nichts davon entspricht der Trainingsverteilung eines allgemeinen PII-Modells, weil es keine Namen, E-Mails oder Telefonnummern sind. Es sind domänenspezifische Geheimnisse, die nur im Kontext der Netzwerkkonfigurationssyntax Sinn ergeben, und ein auf Rechts- und Kundendaten trainiertes Modell hatte nie einen Grund, so etwas gesehen zu haben.</p>
</div>

Es gibt eine zweite, ebenso wichtige Lücke: **Anmeldedaten-Stärke**. `enable secret 5` ist ein MD5-Hash. `password 7` ist eine Cisco-Typ-7-Verschlüsselung, trivial umkehrbar mit Tools, die es seit über einem Jahrzehnt gibt. Ein PII-Redaktionsmodell hat kein Konzept von "dieser Hash ist schwach" oder "diese Kodierung ist umkehrbar" — es erkennt ein Muster entweder als PII oder nicht. Einen starken bcrypt-Hash von einem umkehrbaren Cisco-Typ-7-Passwort zu unterscheiden erfordert Wissen über die Kodierungsschemata des Herstellers, nicht nur das Erkennen von sensibel wirkendem Text.

## Die Lücke testen

Führt man einen echten Cisco-, FortiGate- oder MikroTik-Export durch einen allgemeinen PII-Detektor, ist das Muster konsistent: er erkennt etwas, wenn eine E-Mail-Adresse oder ein Hostname vorhanden ist, der wie eine Domain aussieht, und geht glatt über das `enable secret`, die SNMP-Community, das BGP-Nachbar-Passwort und den Pre-Shared-Key hinweg. Das ist kein Fehler im Modell. Es liegt schlicht außerhalb dessen, wofür es trainiert wurde zu suchen, genauso wie eine Rechtschreibprüfung nicht defekt ist, weil sie einen Rechenfehler nicht erkennt.

## Was das bedeutet, wenn man Konfigurationen in KI-Tools einfügt

Die richtige Lesart der OpenAI-Veröffentlichung ist nicht "Redaktion ist jetzt ein gelöstes Problem". Es ist das Gegenteil: allgemeine PII-Redaktion wird zunehmend kostenlos und zur Ware, was für jeden, der mit Namen, E-Mails und Kundendaten zu tun hat, tatsächlich gut ist. Aber es schärft genau die Stelle, an der die verbleibende Lücke liegt: domänenspezifische Geheimnisse in strukturierten technischen Formaten, wobei Netzwerkkonfigurationen eines der klarsten Beispiele sind.

<table>
<tr><th>Von allgemeinen PII-Modellen abgedeckt</th><th>Nicht abgedeckt, benötigt herstellerbewusste Erkennung</th></tr>
<tr><td>Namen, E-Mails, Telefonnummern</td><td>SNMP-Community-Strings</td></tr>
<tr><td>Physische Adressen</td><td>BGP-/OSPF-/HSRP-Authentifizierungsschlüssel</td></tr>
<tr><td>Kreditkartennummern</td><td>TACACS+-/RADIUS-Serverschlüssel</td></tr>
<tr><td>Generische API-Schlüsselformate</td><td>Herstellerspezifische Passwortkodierungen (z. B. Cisco Typ 7)</td></tr>
<tr><td>—</td><td>Klassifizierung von Hash-/Verschlüsselungsstärke</td></tr>
</table>

Wer eine Konfiguration in ChatGPT, Claude oder Gemini einfügt, um ein Routing-Problem zu debuggen, dem hilft ein im Hintergrund laufender allgemeiner PII-Filter nicht bei dem Teil, der tatsächlich zählt. [ScrubForge](/de/scrubforge/) ist speziell für diese Lücke gebaut: 12 Herstellerprofile, Secret-Erkennung auf Protokollebene (BGP, OSPF, HSRP, TACACS+, RADIUS, SNMP) und Hash-Stärke-Klassifizierung, läuft vollständig lokal, mit optionalem BYOK-Chat, der immer nur die tokenisierte Version der Konfiguration sieht.

## Häufig gestellte Fragen

### Schützt OpenAIs Privacy Filter Passwörter in einer Router- oder Firewall-Konfiguration?

Nicht zuverlässig. Es ist trainiert, um allgemeine PII zu erkennen, Namen, E-Mails, Telefonnummern, nicht herstellerspezifische Netzwerk-Anmeldedaten wie SNMP-Community-Strings oder BGP-Nachbar-Passwörter, die einer völlig anderen Syntax folgen und nicht Teil des Trainingsfokus waren.

### Falls ChatGPT irgendwann integrierte PII-Redaktion bekommt, bleiben Netzwerkkonfigurationen dann gefährdet?

Ja, aus demselben Grund. Integrierte Redaktion, die auf allgemeine PII-Compliance zielt, wird nicht darauf abgestimmt sein, Router- oder Firewall-Konfigurationssyntax zu erkennen, sofern ein Anbieter nicht gezielt dafür trainiert — ein enger, geringvolumiger Anwendungsfall im Vergleich zu den PII-Mustern, die in jedem anderen Dokumenttyp vorkommen.

### Was ist der praktische Unterschied zwischen PII-Redaktion und Konfigurations-Bereinigung?

PII-Redaktion schützt persönliche Daten, Informationen, die eine Person identifizieren. Konfigurations-Bereinigung schützt Infrastruktur-Geheimnisse, Anmeldedaten und Topologie, die ein Netzwerk identifizieren und Zugang dazu gewähren. Sie überschneiden sich fast nie, und ein für das eine gebautes Tool deckt das andere selten gut ab.

### Ist es weiterhin notwendig, Konfigurationen manuell zu bereinigen, wenn ich dem KI-Anbieter vertraue?

Das Bereinigen vor dem Einfügen schützt unabhängig davon, was ein Anbieter über den Umgang mit Daten verspricht, und schützt vor dem einfacheren Risiko, dass ein Teammitglied, ein geteilter Bildschirm oder ein kopiertes Chat-Protokoll eine aktive Anmeldedaten irgendwohin trägt, wo sie nicht hingehört.
