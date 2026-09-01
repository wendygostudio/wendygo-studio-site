---
schemaVersion: 1
title: "Kubernetes Secret data vs. stringData: Wann Base64 erforderlich ist"
description: "Erfahren Sie, wann Kubernetes Secrets in data Base64 benötigen, wann stringData einfacher ist und warum Codierung keine Verschlüsselung ersetzt."
date: 2026-08-28
slug: kubernetes-secret-data-vs-stringdata
locale: de
translationKey: kubernetes-secret-data-vs-stringdata
product: textforge
contentType: how-to
primaryKeyword: "Kubernetes Secret data vs stringData"
relatedPages: /de/textforge/,/de/scrubforge/,/de/blog/base64-encode-kubernetes-secrets/,/de/blog/remove-secrets-kubernetes-config/
sourceUrls: https://kubernetes.io/docs/concepts/configuration/secret/,https://kubernetes.io/docs/concepts/security/secrets-good-practices/
faqs:
  - question: "Benötigen Werte in data eines Kubernetes Secrets Base64?"
    answer: "Ja. Werte im Feld data werden als Base64-Zeichenketten serialisiert. stringData akzeptiert normalen Text, den der API-Server beim Erstellen oder Aktualisieren codiert."
  - question: "Soll ich in einem Manifest data oder stringData verwenden?"
    answer: "Verwenden Sie stringData für literale Texte, wenn Ihr Deployment-Workflow es unterstützt. Verwenden Sie data, wenn Sie die serialisierte Darstellung benötigen oder Ihr Tool bereits codierte Werte erwartet."
  - question: "Schützt Base64 ein Kubernetes Secret?"
    answer: "Nein. Base64 ist reversible Codierung und keine Verschlüsselung. Schützen Sie Manifest, Clusterzugriff und Repository gemäß der Kubernetes-Dokumentation."
---

# Kubernetes Secret data vs. stringData: Wann Base64 erforderlich ist

Die Felder `data` und `stringData` in einem Kubernetes Secret enthalten dieselben logischen Werte, sind aber unterschiedliche Eingabeschnittstellen. `data` erwartet Base64-codierte Zeichenketten. `stringData` nimmt normalen Text an und lässt den Kubernetes-API-Server die Codierung übernehmen.

Das ist wichtig beim Schreiben, Prüfen oder Ändern eines Manifests. Keines der beiden Felder ist jedoch eine Sicherheitsgrenze: Base64 ist Codierung, keine Verschlüsselung.

## Der praktische Unterschied

Verwenden Sie `data`, wenn ein Wert bereits für die Secret-API serialisiert ist:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-zugangsdaten
type: Opaque
data:
  username: YWRtaW4=
  password: c2FtcGxlLXBhc3M=
```

Verwenden Sie `stringData`, wenn Sie literale Werte schreiben möchten:

```yaml
stringData:
  username: admin
  password: sample-pass
```

Die [Kubernetes-Dokumentation zu Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) beschreibt `stringData` als bequeme Eingabe für nicht codierte Werte. Sie weist auch darauf hin, dass `stringData` mit server-side apply nicht gut funktioniert. Prüfen Sie daher Ihre Deployment-Methode.

## Welches Feld passt?

`stringData` ist oft am lesbarsten, wenn Sie ein neues Manifest mit literalen Werten schreiben und Ihr Workflow das Feld unterstützt. `data` ist sinnvoll, wenn ein anderes System bereits die serialisierte Form erzeugt, Sie ein vorhandenes `data`-Manifest bearbeiten oder Ihre Werkzeuge codierte Werte erwarten.

Speichern Sie echte Zugangsdaten nicht im Repository, nur weil sie unter `data` stehen. Wer das Manifest lesen kann, kann die Werte decodieren. Kubernetes behandelt Zugriff, Speicherung und Verteilung eines Secrets getrennt von der YAML-Darstellung.

## Lokal codieren oder decodieren

Wenn ein Manifest einen Wert unter `data` enthält, decodieren Sie bei Bedarf nur eine lokale Kopie zur Prüfung. Für einen neuen `data`-Wert codieren Sie den Rohwert lokal und übernehmen nur das Ergebnis in das Arbeitsmanifest.

TextForge kann Text im Browser codieren und decodieren, ohne den Wert an einen Wendygo-Server zu senden. Arbeiten Sie mit einer Kopie und bewahren Sie das Original im sicheren Umfeld auf. Wenn Sie ein Manifest teilen müssen, ist [ScrubForge](https://wendygostudio.com/de/scrubforge/) geeigneter: Bereinigen Sie zuerst die Kopie, statt das Secret nur zu codieren.

## Kurze Entscheidungshilfe

1. Schreiben Sie ein neues Secret aus literalen Werten? Erwägen Sie `stringData`, nachdem Sie den Apply-Workflow geprüft haben.
2. Ändern Sie ein vorhandenes `data`-Feld? Decodieren Sie nur eine lokale Kopie, wenn die Prüfung nötig ist.
3. Verlangt Ihre Pipeline `data`? Codieren Sie lokal und validieren Sie das YAML.
4. Verlässt das Manifest die sichere Umgebung? Entfernen oder ersetzen Sie Zugangsdaten vor dem Teilen.
5. Könnten Zugangsdaten bereits offengelegt sein? Rotieren Sie sie; Codierung oder Bereinigung macht die Offenlegung nicht rückgängig.

Lesen Sie die [Kubernetes-Empfehlungen für Secret-Sicherheit](https://kubernetes.io/docs/concepts/security/secrets-good-practices/) zusammen mit Ihrer eigenen Richtlinie für Clusterzugriff und Secret-Management.

## Häufige Fragen

### Brauchen Werte in `data` Base64?

Ja. `data` wird als Base64-Zeichenketten serialisiert. `stringData` akzeptiert normalen Text und Kubernetes codiert ihn beim Erstellen oder Aktualisieren.

### Soll ich `data` oder `stringData` verwenden?

Verwenden Sie `stringData` für literalen Text, wenn Ihr Workflow es unterstützt. Verwenden Sie `data`, wenn Ihre Werkzeuge die serialisierte Form benötigen.

### Schützt Base64 ein Secret?

Nein. Base64 ist reversible Codierung, keine Verschlüsselung. Schützen Sie Manifest, Clusterzugriff und Repository.
