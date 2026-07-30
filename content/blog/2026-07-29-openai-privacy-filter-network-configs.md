---
schemaVersion: 1
title: "OpenAI's Privacy Filter Doesn't Know What a BGP Password Is"
description: "OpenAI open-sourced a model that redacts PII before it reaches an AI. Here's exactly what it catches, what it was never built to catch, and why network configs still need a dedicated tool."
date: 2026-07-29
slug: openai-privacy-filter-network-configs
locale: en
translationKey: openai-privacy-filter-network-configs
product: scrubforge
contentType: use-case
primaryKeyword: "openai privacy filter network config"
relatedPages: /scrubforge/
---

OpenAI recently open-sourced Privacy Filter, a small model built to detect and redact personally identifiable information in text, runs locally, on a laptop or directly in a browser, and reports a 96-97% F1 score on PII detection. It's a genuinely useful release. It's also not built to protect the thing most network engineers actually paste into an AI chat: a router or firewall configuration.

## What Privacy Filter is actually for

<div class="key-points">
  <h3>What the model targets</h3>
  <ul>
    <li>Names, emails, phone numbers, addresses — classic PII, the kind that shows up in emails, support tickets, and legal documents.</li>
    <li>Context-aware detection over long documents, up to 128,000 tokens in a single pass, which is a real engineering achievement for that use case.</li>
    <li>Runs on-device, open weights, Apache 2.0 license — no data leaves the machine to redact it, which is the correct privacy model.</li>
  </ul>
</div>

That's a solid tool for what it's built for: legal documents, email threads, customer records. It's a general-purpose PII model, trained on the kind of personal data that appears across every industry.

## What it was never trained to recognize

A network configuration file doesn't look like a legal document or a customer record. It looks like this:

```
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
snmp-server community publicRW RW
router bgp 65001
 neighbor 203.0.113.1 remote-as 65002
 neighbor 203.0.113.1 password 7 08351A5D0713
```

<div class="step-card">
  <span class="step-label">Reality check</span>
  <strong>None of this is PII, and all of it is a credential</strong>
  <p>An SNMP community string, a BGP neighbor password, an OSPF authentication key, a TACACS+ server key, a WPA pre-shared key — none of these match the training distribution of a general PII model, because they aren't names or emails or phone numbers. They're domain-specific secrets that only make sense in the context of network configuration syntax, and a model trained on legal and customer data has no reason to have ever seen one.</p>
</div>

There's a second gap that matters just as much: **credential strength**. `enable secret 5` is an MD5 hash. `password 7` is a Cisco type 7 cipher, trivially reversible with tools that have existed for over a decade. A PII redaction model has no concept of "this hash is weak" or "this encoding is reversible" — it either recognizes a pattern as PII or it doesn't. Distinguishing a strong bcrypt hash from a reversible Cisco type 7 password requires knowing the vendor's encoding schemes, not just recognizing sensitive-looking text.

## Testing the gap

Run a real Cisco, FortiGate, or MikroTik export through a general PII detector and the pattern is consistent: it catches something if there's an email address or a hostname that happens to look like a domain, and it passes straight over the `enable secret`, the SNMP community, the BGP neighbor password, and the pre-shared key. That's not a flaw in the model. It's simply outside what it was trained to look for, the same way a spell-checker isn't broken for not catching a math error.

## What this means if you paste configs into AI tools

The right read on OpenAI's release isn't "redaction is a solved problem now." It's the opposite: general-purpose PII redaction is trending toward free and commoditized, which is genuinely good for anyone dealing with names, emails, and customer data. But it sharpens exactly where the remaining gap is, domain-specific secrets in structured technical formats, network configs being one of the clearest examples.

<table>
<tr><th>Covered by general PII models</th><th>Not covered, needs vendor-aware detection</th></tr>
<tr><td>Names, emails, phone numbers</td><td>SNMP community strings</td></tr>
<tr><td>Physical addresses</td><td>BGP / OSPF / HSRP authentication keys</td></tr>
<tr><td>Credit card numbers</td><td>TACACS+ / RADIUS server keys</td></tr>
<tr><td>Generic API key formats</td><td>Vendor-specific password encodings (e.g. Cisco type 7)</td></tr>
<tr><td>—</td><td>Hash/cipher strength classification</td></tr>
</table>

If you're pasting a config into ChatGPT, Claude, or Gemini to debug a routing issue, a general PII filter running in the background won't catch the part that actually matters. [ScrubForge](/scrubforge/) is built specifically for that gap: 12 vendor profiles, protocol-level secret detection (BGP, OSPF, HSRP, TACACS+, RADIUS, SNMP), and hash-strength classification, running entirely locally, with an optional BYOK chat that only ever sees the tokenized version of your config.

## Frequently asked questions

### Does OpenAI's Privacy Filter protect passwords in a router or firewall config?

Not reliably. It's trained to detect general PII, names, emails, phone numbers, not vendor-specific network credentials like SNMP community strings or BGP neighbor passwords, which follow entirely different syntax and weren't part of its training focus.

### If ChatGPT eventually adds built-in PII redaction, will network configs still be at risk?

Yes, for the same reason. Built-in redaction aimed at general PII compliance won't be tuned to recognize router or firewall config syntax unless a provider specifically trains for it, which is a narrow, low-volume use case compared to the PII patterns that appear across every other document type.

### What's the practical difference between PII redaction and config sanitization?

PII redaction protects personal data, information that identifies a person. Config sanitization protects infrastructure secrets, credentials and topology that identify and grant access to a network. They overlap in almost no cases, and a tool built for one rarely covers the other well.

### Is it still necessary to sanitize configs manually if I trust the AI provider?

Sanitizing before pasting protects you regardless of what any provider promises about data handling, and it protects against the simpler risk of a teammate, a shared screen, or a copy-pasted chat log carrying a live credential somewhere it shouldn't go.
