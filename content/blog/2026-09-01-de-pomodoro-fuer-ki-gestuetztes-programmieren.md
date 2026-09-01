---
schemaVersion: 1
title: "Pomodoro für KI-gestütztes Programmieren: Ein Workflow mit Review"
description: "Nutze Fokusintervalle für überprüfbare KI-gestützte Programmierung: Aufgabe begrenzen, kleine Änderungen prüfen, Pausen machen und rechtzeitig aufhören."
date: 2026-09-01
slug: pomodoro-fuer-ki-gestuetztes-programmieren
locale: de
translationKey: ai-assisted-coding-pomodoro-workflow
product: slimeforge
contentType: how-to
primaryKeyword: "Pomodoro für KI-gestütztes Programmieren"
relatedPages: /de/slimeforge/,/de/blog/pomodoro-timer-for-developers/,/de/blog/focus-rituals-pomodoro-chrome/
sourceUrls: https://www.pomodorotechnique.com/,https://news.ycombinator.com/item?id=49491745
faqs:
  - question: "Muss eine KI-Programmiersitzung ein ganzes Pomodoro dauern?"
    answer: "Nutze ein Intervall für ein überprüfbares Ergebnis, nicht für eine endlose Prompt-Schleife. Es kann Planung, eine kleine Umsetzung und Review enthalten oder früher enden, wenn das Ergebnis fertig ist."
  - question: "Was mache ich, wenn der Timer während einer KI-generierten Änderung endet?"
    answer: "Speichere den Stand, notiere den nächsten Schritt und prüfe oder teste die Änderung vor dem nächsten Intervall. Übernimm keinen Code, den du nicht verstanden hast."
  - question: "Ersetzt ein Pomodoro-Timer ein Code-Review?"
    answer: "Nein. Der Timer schafft Grenzen für Fokus und Review, prüft aber weder Korrektheit noch Sicherheit oder Wartbarkeit. Nutze passende Tests und menschliche Prüfung."
---

# Pomodoro für KI-gestütztes Programmieren: Ein Workflow mit Review

KI-gestütztes Programmieren kann eine kleine Aufgabe in eine offene Sitzung verwandeln: Änderung anfordern, Fehler beheben lassen, den nächsten Prompt senden und erst später merken, dass ein großer, schwer prüfbarer Patch entstanden ist. In einer aktuellen Entwicklerdiskussion auf Hacker News wurde genau dieses Muster beschrieben: lange Abende und generierte Änderungen, die mit wachsender Sitzung immer schwerer zu prüfen sind.

Ein Timer löst das Problem nicht allein. Er kann aber eine Grenze für einen Ablauf schaffen, in dem du für Aufgabe, Diff und die Entscheidung zum Weitermachen verantwortlich bleibst.

## Die sinnvolle Einheit ist ein prüfbares Ergebnis

Beginne nicht mit „Programmiere 25 Minuten lang“. Beginne mit einem Ergebnis, das du prüfen kannst:

- eine Validierungsregel samt Tests ergänzen;
- einen fehlgeschlagenen Test erklären und eine kleine Korrektur vorschlagen;
- eine Funktion ohne Änderung ihres öffentlichen Verhaltens refaktorieren;
- einen kurzen Plan schreiben und den ersten Schritt verifizieren.

Die offizielle [Pomodoro®-Technik](https://www.pomodorotechnique.com/) ist mehr als ein Countdown. Ihr Wert liegt im wiederholbaren Wechsel aus Planung, konzentrierter Arbeit, Pausen und Reflexion. Bei KI-gestützter Arbeit gehört das Review in den Zyklus.

## Ein KI-Programmierintervall in vier Teilen

### 1. Grenze vor dem Prompt festlegen

Beschreibe die Aufgabe in einem Satz und nenne die Dateien oder das Verhalten im Umfang. Lege ein Ende fest: „Ich kann den Diff und die relevanten Tests erklären.“ Ein vorgeschlagenes Redesign kommt auf eine Folgeliste, nicht automatisch in dieses Intervall.

### 2. Einen kleinen, prüfbaren Schritt anfordern

Gib den nötigen Kontext, aber bitte um eine begrenzte Änderung. Lass Annahmen und geplante Dateien nennen. Du entscheidest, ob der Umfang sicher ist.

### 3. Zeit für die Prüfung reservieren

Lies den Diff vor Ablauf vollständig. Führe den kleinsten passenden Test aus. Achte auf Änderungen außerhalb der Aufgabe, fehlende Fehlerbehandlung, Geheimnisse in Logs und Tests, die aus dem falschen Grund bestehen. Wenn du die Änderung nicht zusammenfassen kannst, ist das Intervall nicht fertig.

### 4. Den Zyklus schließen

Notiere kurz Änderung, Prüfung und Rest. Mach die Pause anschließend weg vom Editor. Ein sauberer Abschluss erleichtert das nächste Intervall und verhindert einen unkontrollierten Block aus Prompts.

## Wenn der Timer unterbricht

Der Timer markiert eine Grenze, zwingt dich aber nicht zu einem riskanten Abbruch. Bei einer halbfertigen generierten Änderung:

1. Arbeitsstand sichern;
2. nächsten Prüfschritt oder Entscheidung notieren;
3. ungeprüften Code nicht mergen oder deployen;
4. nach der Pause nur fortsetzen, wenn die Aufgabe weiter wichtig ist.

Wenn eine Aufgabe regelmäßig mehrere Intervalle braucht, teile sie nach Verhalten oder Artefakt. 45 oder 60 Minuten können für Deep Work sinnvoll sein, aber auch dann braucht es klare Review-Punkte.

## Eine kurze Sitzungsvorlage

```text
Ergebnis: Parser-Validierung und Tests ergänzen
Umfang: parser.ts, parser.test.ts
Assistent: kleinsten Patch vorschlagen und Annahmen erklären
Review: Diff lesen, Tests ausführen, ungültige Eingaben prüfen
Ende: Verhalten und Testergebnis erklären können
Notiz: Randfall oder Folgeschritt
```

Das funktioniert mit jedem Coding-Assistenten und hält menschliche Entscheidungen sichtbar. Nach einer Pause kannst du leichter weitermachen, ohne eine immer längere Unterhaltung rekonstruieren zu müssen.

## Einen Timer auswählen

Nutze kurze Intervalle für klar begrenzte Aufgaben oder zum Wiedereinstieg. Nutze längere Intervalle, wenn das Laden des Codekontexts der eigentliche Aufwand ist, aber behalte die Review-Struktur bei. Ein lokaler Timer wie [SlimeForge](/de/slimeforge/) kann das Intervall markieren; entscheidend sind Grenze und Review-Gewohnheit, nicht eine bestimmte Dauer.

Wenn du häufig länger arbeitest als geplant, verkleinere die Aufgabe, setze ein festes Tagesende oder mache das Review zum ersten Schritt des nächsten Intervalls. Ziel ist nachhaltiger, verständlicher Fortschritt, nicht der größte Patch vor Mitternacht.

## Häufige Fragen

### Muss eine KI-Programmiersitzung ein ganzes Pomodoro dauern?

Nutze ein Intervall für ein überprüfbares Ergebnis, nicht für eine endlose Prompt-Schleife. Es kann Planung, Umsetzung und Review enthalten oder früher enden.

### Was mache ich bei einem Timer-Ende während einer generierten Änderung?

Speichere den Stand, notiere den nächsten Schritt und prüfe oder teste die Änderung vor dem nächsten Intervall. Übernimm keinen unverstandenen Code.

### Ersetzt ein Pomodoro-Timer ein Code-Review?

Nein. Er setzt Grenzen, prüft aber weder Korrektheit noch Sicherheit oder Wartbarkeit. Nutze passende Tests und menschliche Prüfung.
