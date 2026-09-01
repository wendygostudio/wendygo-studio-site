---
schemaVersion: 1
title: "Berechtigungen von Chrome-Erweiterungen: Checkliste vor der Installation"
description: "So liest du Berechtigungswarnungen in Chrome, vergleichst sie mit der gewünschten Funktion und testest eine Fokus-Erweiterung sicher."
date: 2026-08-27
slug: chrome-erweiterungs-berechtigungen-checkliste
locale: de
translationKey: chrome-extension-permissions-checklist
product: slimeforge
contentType: how-to
primaryKeyword: "Chrome Erweiterungen Berechtigungen Checkliste"
relatedPages: /slimeforge/,/blog/is-your-chrome-extension-spying-on-you/,/blog/best-chrome-extensions-for-students/
sourceUrls: https://support.google.com/chrome_webstore/answer/186213?hl=en,https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy?hl=en,https://developer.chrome.com/docs/extensions/reference/permissions-list?hl=en
faqs:
  - question: "Beweisen Berechtigungswarnungen, dass eine Erweiterung unsicher ist?"
    answer: "Nein. Sie beschreiben den möglichen Zugriff. Vergleiche ihn mit der Funktion, dem Herausgeber und der Datenschutzerklärung."
  - question: "Welche Berechtigungen braucht ein einfacher Fokus-Timer?"
    answer: "Ein Timer kann mit lokalem Speicher und Alarmfunktionen auskommen. Seitenblockierung kann zusätzlichen, erklärungsbedürftigen Zugriff benötigen."
  - question: "Kann sich eine Erweiterung nach der Installation ändern?"
    answer: "Ja. Updates können Code und Verhalten ändern. Prüfe Eintrag, Datenschutz und Berechtigungen nach wichtigen Änderungen erneut."
  - question: "Darf ich eine Erweiterung auf einem Schulgerät installieren?"
    answer: "Prüfe Zugriff, Herausgeber, Datenschutz und die Schulrichtlinie. Verwaltete Geräte können Installationen einschränken."
---

Eine Chrome-Erweiterung zu installieren wirkt harmlos, kann ihr aber weitreichenden Browserzugriff geben. Die Warnung beschreibt, was eine Erweiterung anfordern kann; sie ist kein unabhängiges Sicherheitsurteil. Diese Checkliste hilft dir vor der Installation eines Fokus-Timers, Tab-Managers oder Lernwerkzeugs.

Die [Sicherheits-Checkliste für Chrome-Erweiterungen](/blog/is-your-chrome-extension-spying-on-you/) behandelt einen Vorfall. Hier geht es um die kleinere Entscheidung: Passt der angeforderte Zugriff zur Funktion?

## 1. Beginne mit der Aufgabe

Definiere eine konkrete Aufgabe. Ein Timer, ein Schreibassistent und ein Seitenblocker brauchen nicht denselben Zugriff. Die [offizielle Chrome-Hilfe zu Berechtigungen](https://support.google.com/chrome_webstore/answer/186213?hl=en) nennt unter anderem Websites, Tabs, Verlauf, Lesezeichen, kopierte Daten und Geräteinformationen.

Beliebtheit ersetzt keine Prüfung. Wenn ein Timer Zugriff auf alle Daten aller Websites verlangt, frage nach dem Grund. Das kann für eine erklärte Seitenfunktion nötig sein, ist aber für eine reine Zeitmessung ungewöhnlich breit.

## 2. Mache aus jeder Warnung eine Frage

Frage, welche Websites gelesen oder verändert werden, ob Tab-URLs nötig sind, warum Zwischenablage oder Verlauf gebraucht werden und was lokal gespeichert beziehungsweise synchronisiert wird. Die Chrome-Dokumentation empfiehlt die geringsten nötigen Berechtigungen und optionale Berechtigungen für spätere Funktionen.

## 3. Vergleiche drei Angaben

Vergleiche Chrome-Web-Store-Eintrag, Datenschutzseite des Herausgebers und den ersten Bildschirm der Erweiterung. Bei Widersprüchen solltest du warten. Eine Datenschutzerklärung ist eine Angabe, keine unabhängige Prüfung; die Veröffentlichung im Store ist ebenfalls keine Garantie für eine passende Erweiterung.

## 4. Teste den kleinsten sinnvollen Ablauf

Erteile nur die nötigen Rechte für einen kurzen Test. Bei einem Timer testest du zuerst Uhr und lokalen Fortschritt, bei einem Blocker die tatsächlich benötigten Seiten. Gib während der Prüfung keine Passwörter, API-Schlüssel oder privaten Dokumente ein. Eine lokale Funktion sollte jede notwendige Netzwerkverbindung erklären.

## 5. Prüfe Updates erneut

Bei neuem Eigentümer, neuen Funktionen oder ungewöhnlichen Updates solltest du Zugriff und Datenschutz erneut lesen. Für Lernende gibt es [die besten Chrome-Erweiterungen für Studierende](/blog/best-chrome-extensions-for-students/); wende diese Checkliste auf jede Kandidatin an. [SlimeForge](/slimeforge/) hält den Kern des Fokusablaufs lokal, optionale Seitenfunktionen müssen aber zur aktuellen Store-Anzeige passen.

## Häufige Fragen

### Sind Berechtigungswarnungen ein Beweis für Unsicherheit?

Nein. Sie beschreiben möglichen Zugriff. Vergleiche ihn mit Funktion, Herausgeber und Datenschutzerklärung.

### Was braucht ein einfacher Fokus-Timer?

Meist lokalen Speicher und Alarmfunktionen. Seitenblockierung oder Overlays können mehr Zugriff benötigen, der erklärt werden sollte.

### Kann sich eine Erweiterung nach der Installation ändern?

Ja. Updates können Verhalten ändern. Prüfe Eintrag, Datenschutz und Berechtigungen nach wichtigen Änderungen.

### Was gilt auf einem verwalteten Schulgerät?

Halte dich an die Administratorrichtlinie und nutze eine geprüfte Alternative, statt eine Gerätesperre zu umgehen.
