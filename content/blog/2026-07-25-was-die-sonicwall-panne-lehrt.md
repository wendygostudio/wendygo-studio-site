---
schemaVersion: 1
title: "Was Die SonicWall-Panne Über Config-Sharing Lehrt"
description: "SonicWalls eigene Cloud-Backups leckten Konfigurationsdaten aller Kunden. Wenn dieses Backup nicht sicher war, ist es ein Support-Ticket auch nicht."
date: 2026-07-25
slug: was-die-sonicwall-panne-lehrt
locale: de
translationKey: what-the-sonicwall-backup-breach-teaches-about-config-sharing
product: scrubforge
contentType: use-case
primaryKeyword: "ist mein Firewall-Konfigurations-Backup sicher zu teilen"
relatedPages: /scrubforge/
---

Das eigene Backup eines Herstellers soll eigentlich der sichere Ort für deine Konfiguration sein. Im September 2025 bestätigte SonicWall, dass das für seine Cloud-Backup-Kunden nicht zutraf, und die Details lohnen sich zu lesen, selbst wenn du keine SonicWall-Firewall betreibst.

> **Was SonicWall bestätigte**
> Ein Angreifer führte Brute-Force-Angriffe gegen das Kundenportal MySonicWall.com durch und erhielt Zugriff auf Firewall-Konfigurations-Backup-Dateien. [SonicWalls eigener Vorfallshinweis](https://www.sonicwall.com/support/knowledge-base/mysonicwall-cloud-backup-file-incident/250915160910330), gemeinsam mit der Incident-Response-Firma Mandiant durchgeführt, schätzte zunächst unter 5 % der Cloud-Backup-Kunden als betroffen, bestätigte in der finalen Aktualisierung aber, dass **alle** Kunden betroffen waren, die die Cloud-Backup-Funktion genutzt hatten. [CISA veröffentlichte einen eigenen Hinweis](https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident), der alle SonicWall-Kunden aufforderte, ihr Konto zu prüfen.

## Was tatsächlich in den offengelegten Dateien steckte

Das ist der Teil, der über SonicWalls konkrete Kunden hinaus zählt. Ein Firewall-Konfigurationsexport (eine `.EXP`-Datei) ist eine vollständige Momentaufnahme des Geräts — nicht nur Passwörter, sondern auch Topologie, IP-Bereiche, Regeln und Integrationsdetails.

<div class="key-points">
  <h3>Was geschützt ist, und was nicht</h3>
  <ul>
    <li><strong>Zugangsdaten und Secrets</strong> sind einzeln verschlüsselt — AES-256 bei Gen-7-Firewalls und neuer, das ältere 3DES bei Gen 6.</li>
    <li><strong>Alles andere in der Datei</strong> — Netzwerklayout, Regelwerke, Adressierung — ist nur kodiert, nicht verschlüsselt, also nach einfacher Dekodierung lesbar.</li>
    <li><strong>Der gesamte Zweck der Datei</strong> ist es, ein Gerät auf den exakt erfassten Zustand zurückzusetzen, genau deshalb ist sie außerhalb eines vertrauenswürdigen Kanals gefährlich: Sie ist darauf ausgelegt, alles zu enthalten, was zur Rekonstruktion deines Setups nötig ist.</li>
  </ul>
</div>

SonicWalls Hinweis ist hier eindeutig: Selbst mit verschlüsselten Zugangsdaten könne "der Besitz dieser Dateien das Risiko gezielter Angriffe erhöhen", wegen allem anderen, was die Datei über den Netzwerkaufbau preisgibt.

## Warum das für mehr als einen Hersteller gilt

<div class="step-card">
  <span class="step-label">Anwendungsfall</span>
  <strong>Die Backup-Datei und der Support-Ticket-Auszug haben dasselbe Problem</strong>
  <p>Ob eine Konfiguration durch ein kompromittiertes Herstellerportal, einen eingefügten Forenbeitrag, ein KI-Chatfenster oder einen E-Mail-Anhang an den Support die Kontrolle verlässt — das Risiko ist dasselbe: Die Datei wurde gebaut, um alles zu enthalten, was nötig ist, um dein Netzwerk zu beschreiben oder wiederherzustellen, und die meisten dieser Details waren nie dafür gedacht, außerhalb eines vertrauenswürdigen Kanals offengelegt zu werden. SonicWalls Vorfall erinnert daran, dass selbst der "offizielle", vom Hersteller abgesegnete Kanal versagen kann. Ein Support-Ticket oder ein KI-Chat haben nicht einmal die Verschlüsselung, die ein Cloud-Backup zumindest versucht.</p>
</div>

| Was ein roher Konfigurationsexport enthält | Was zur Fehlersuche oder Wiederherstellung wirklich nötig ist |
|---|---|
| Jede Firewall-Regel, vollständig | Die eine oder zwei relevanten Regeln für das Problem |
| Vollständige interne IP-Bereiche und Topologie | Genug Struktur, um das Problem zu erklären, nicht die gesamte Karte |
| Hostnamen, Serveradressen, Integrations-Endpunkte | Geschwärzte Platzhalter, die die Logik erhalten |
| Jede eingebettete Zugangsdaten oder Schlüssel, auch verschlüsselt | Nichts — Zugangsdaten gehören nie in eine geteilte Datei |

## Bevor du eine Konfiguration irgendwo teilst

Wenn du eine Netzwerkkonfiguration mit einem Support-Team teilst, ist SonicWalls Vorfall ein gutes Argument dafür, sie vorher zu bereinigen, unabhängig davon, welches Herstellerportal, welcher KI-Assistent oder welches Forum es ist. [ScrubForge](/de/scrubforge/) entfernt genau die Details, die eine Backup-Datei preisgibt: Zugangsdaten, IP-Bereiche, Hostnamen und Topologie, während die Struktur der Konfiguration intakt genug bleibt, um tatsächlich Hilfe zu bekommen.

Wenn du die Cloud-Backup-Funktion von MySonicWall nutzt, prüfe dein Konto direkt, statt dich allein auf diesen Artikel zu verlassen: SonicWalls Hinweis enthält die genauen Schritte, und der Bereich Product Management > Issue List in deinem MySonicWall-Konto zeigt, ob eine deiner Seriennummern markiert wurde.

## Häufig gestellte Fragen

### Was ist beim SonicWall-Backup-Vorfall tatsächlich passiert?

Ein Angreifer nutzte Brute-Force-Techniken gegen das Kundenportal MySonicWall.com und griff auf Konfigurations-Backup-Dateien (.EXP) zu. SonicWalls Untersuchung, gemeinsam mit Mandiant durchgeführt, schätzte zunächst unter 5 % der Cloud-Backup-Kunden als betroffen, bestätigte in der finalen Aktualisierung aber, dass alle Kunden betroffen waren, die die Cloud-Backup-Funktion genutzt hatten.

### Waren die offengelegten Backup-Dateien verschlüsselt?

Teilweise. Zugangsdaten und Secrets in der .EXP-Datei sind einzeln verschlüsselt (AES-256 bei Gen-7-Firewalls und neuer, das ältere 3DES bei Gen 6), aber der Rest der Konfiguration ist nur kodiert, nicht verschlüsselt — Topologie, Regeln, IP-Bereiche und andere Details sind nach dem Dekodieren lesbar. SonicWall selbst empfiehlt, jede offengelegte Datei als Anlass für ein Zurücksetzen der Zugangsdaten zu behandeln.

### Bedeutet das, dass Cloud-Backups von Herstellern grundsätzlich unsicher sind?

Nein, SonicWalls Hinweis betrifft ein per Brute-Force kompromittiertes Portal, keinen grundsätzlichen Fehler im Backup-Konzept. Die Lehre ist enger gefasst: Ein Konfigurationsexport enthält mehr nutzbare Details, als die meisten annehmen — überall dort, wo diese Datei oder ihr Inhalt hinreist, ein Cloud-Backup des Herstellers, ein Support-Ticket, ein KI-Chat, verdient dieselbe Vorsicht.

### Was sollte ich an meiner eigenen Firewall nach dieser Lektüre prüfen?

Wenn du die Cloud-Backup-Funktion von MySonicWall nutzt, melde dich an und prüfe unter Product Management > Issue List auf betroffene Seriennummern, dann folge SonicWalls Anleitung zum grundlegenden Zurücksetzen der Zugangsdaten. Unabhängig davon: Bereinige jede Konfigurationsdatei, bevor du sie irgendwo einfügst — ein Support-Ticket, ein Forenbeitrag oder ein KI-Assistent.
