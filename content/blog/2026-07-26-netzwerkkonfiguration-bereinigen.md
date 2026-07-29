---
schemaVersion: 1
title: "Netzwerkkonfiguration vor dem Teilen bereinigen"
description: "Cisco-, FortiGate- und Cloud-Konfigurationen lokal von Zugangsdaten bereinigen, bevor du sie an Support oder KI weitergibst."
date: 2026-07-26
slug: netzwerkkonfiguration-bereinigen
locale: de
translationKey: sanitize-network-config-before-sharing
product: scrubforge
contentType: how-to
primaryKeyword: "Netzwerkkonfiguration bereinigen"
relatedPages: /scrubforge/
---

Eine Konfiguration enthält oft mehr als technische Einstellungen: Passwörter, API-Tokens, SNMP-Community-Strings, interne Hostnamen und Adressen zeigen, wie deine Infrastruktur aufgebaut ist. Bevor du einen Auszug an Support, ein Forum oder einen KI-Assistenten sendest, solltest du ihn bereinigen.

[ScrubForge](/de/scrubforge/) verarbeitet den eingefügten Text lokal im Browser. Wiederkehrende Werte erhalten denselben Platzhalter, zum Beispiel `[IP_1]` oder `[SECRET_1]`. Dadurch bleiben Abhängigkeiten in ACLs, Routen und Policies lesbar, während die echten Werte nicht mitkopiert werden.

1. Kopiere nur den für die Frage notwendigen Konfigurationsabschnitt.
2. Füge ihn in ScrubForge ein und wähle das passende Profil.
3. Prüfe die Vorschau auf Zugangsdaten, Schlüssel, interne Namen und Topologieangaben.
4. Teile ausschließlich die bereinigte Fassung.

Die konsistenten Platzhalter sind besonders nützlich: Wenn dieselbe Adresse mehrfach vorkommt, kann der Empfänger die Beziehung weiterhin nachvollziehen. Das Original und eine mögliche Zuordnung bleiben bei dir. Bereinigung ist jedoch kein Freifahrtschein: Entferne auch Kommentare, Kundennamen oder ungewöhnliche Geheimnisformate manuell und gib nur den kleinsten nötigen Ausschnitt weiter.
