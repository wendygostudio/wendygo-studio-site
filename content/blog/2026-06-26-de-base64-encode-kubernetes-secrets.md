---
schemaVersion: 1
title: Base64 Kubernetes-Geheimnisse lokal kodieren (kein Web-Tool)
description: >-
  Kubernetes Secret-Manifeste erfordern Base64-codierte Werte. So verschlüsseln
  Sie Ihre rohen Geheimnisse lokal in Ihrem Browser – kein Terminal, keine
  Website eines Drittanbieters.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-kubernetes-secrets
locale: de
translationKey: base64-encode-kubernetes-secrets
product: textforge
contentType: how-to
primaryKeyword: So kodieren Sie Kubernetes-Geheimnisse mit Base64 ohne ein Web-Tool
relatedPages: /textforge/
---

# So kodieren Sie Kubernetes-Geheimnisse mit Base64 ohne ein Web-Tool

Kubernetes speichert vertrauliche Werte in Secret-Manifesten. Im Gegensatz zu ConfigMaps, die einfachen Text akzeptieren, erfordern geheime „Daten“-Felder Base64-codierte Werte. Viele Entwickler fügen Rohkennwörter und API-Schlüssel in Online-Base64-Tools ein – wodurch diese Anmeldeinformationen an einen Server eines Drittanbieters gesendet werden.

Es gibt eine sicherere Option: Codieren Sie direkt in Ihrem Browser mit einer Chrome-Erweiterung, die Ihre Daten niemals überträgt.

## Warum Kubernetes Base64 verwendet

Kubernetes Secret-Manifeste sehen folgendermaßen aus:

```yaml
APIVersion: v1
Art: Geheimnis
Metadaten:
Name: Datenbank-Anmeldeinformationen
Typ: Undurchsichtig
Daten:
Passwort: c3VwZXJzZWNyZXQ=
API-Schlüssel: c2tfdGVzdF84YzhiNDU2MA==
```

Die Werte unter „data:“ sind Base64-kodiert. Die Rohwerte („supersecret“, „sk_test_8c8b4560“) werden niemals direkt im Manifest gespeichert.

**Wichtig:** Base64 ist keine Verschlüsselung. Jeder, der Zugriff auf das geheime Manifest hat, kann die Werte sofort entschlüsseln. Kubernetes-Geheimnisse ermöglichen die Zugriffskontrolle auf Clusterebene – die Base64-Codierung ist eine reine Formatanforderung der API und keine Sicherheitsmaßnahme.

## Geheime Werte mit TextForge kodieren

TextForge ist eine Chrome-Erweiterung mit über 50 Textdienstprogrammen. Base64-Kodierung ist in der kostenlosen Version verfügbar und läuft vollständig lokal.

1. **Öffnen Sie TextForge** – klicken Sie auf das Erweiterungssymbol in der Symbolleiste Ihres Browsers.
2. **Fügen Sie den rohen geheimen Wert ein** – Ihr Passwort, API-Schlüssel, Verbindungszeichenfolge oder einen beliebigen Wert, der in das Manifest aufgenommen werden muss.
3. **Base64-Kodierung anwenden** – die kodierte Zeichenfolge wird sofort angezeigt.
4. **Kopieren Sie die Ausgabe** und fügen Sie sie in den „data:“-Block Ihres Kubernetes YAML ein.

Kein Terminal, kein Web-Tool, keine Daten verlassen Ihren Computer.

## Verwenden Sie stattdessen „stringData“.

Kubernetes akzeptiert auch ein „stringData“-Feld, das Klartextwerte annimmt – die API kodiert sie automatisch:

```yaml
stringData:
Passwort: supergeheim
```

„stringData“ eignet sich gut für Werte, die Sie neu erstellen. Wenn Sie jedoch ein vorhandenes geheimes Manifest lesen, befinden sich die gespeicherten Werte immer unter „data:“ im Base64-Format – dann müssen Sie sie zur Überprüfung entschlüsseln.

## Dekodierung zur Überprüfung

Um einen vorhandenen codierten Wert in einem Manifest zu überprüfen, fügen Sie ihn in TextForge ein und wenden Sie Base64 Decode an. Sie erhalten sofort den Rohwert, ohne Folgendes ausführen zu müssen:

```bash
kubectl holt geheime Datenbank-Anmeldeinformationen -o jsonpath='{.data.password}' | base64 --decode
```

## Häufig gestellte Fragen

**Ist Base64-Codierung für alle Kubernetes-Geheimnisse erforderlich?**
Nur für das Feld „data:“. Wenn Sie „stringData:“ verwenden, übernimmt Kubernetes die Kodierung. Die meisten Tools und Tutorials verwenden „data:“ in Beispielen, weshalb die manuelle Codierung erforderlich ist.

**Kann ich mehrzeilige Werte wie TLS-Zertifikate kodieren?**
Ja. Fügen Sie das vollständige Zertifikat (einschließlich der Kopf- und Fußzeile „-----BEGIN CERTIFICATE-----“) in TextForge ein und kodieren Sie es. Die resultierende Zeichenfolge wird in das Feld „data:“ eingefügt.

**Ist diese Funktion in TextForge kostenlos?**
Ja. Base64-Kodierung und -Dekodierung sind in der kostenlosen Version verfügbar – kein Konto oder Abonnement erforderlich.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
