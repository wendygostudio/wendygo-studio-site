---
schemaVersion: 1
title: "What the SonicWall Breach Teaches About Sharing Configs"
description: "SonicWall's own cloud backups leaked config data for every customer who used them. If a vendor backup isn't safe, neither is a support-ticket paste."
date: 2026-07-25
slug: what-the-sonicwall-backup-breach-teaches-about-config-sharing
locale: en
translationKey: what-the-sonicwall-backup-breach-teaches-about-config-sharing
product: scrubforge
contentType: use-case
primaryKeyword: "is my firewall config backup safe to share"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/,/blog/share-network-config-support-ticket-safely/
sourceUrls: https://www.sonicwall.com/support/knowledge-base/mysonicwall-cloud-backup-file-incident/250915160910330,https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident
alternateUrl: https://wendygostudio.com/es/blog/lo-que-ensena-la-brecha-de-backups-sonicwall-sobre-compartir-configs/
heading: "What the SonicWall Breach Teaches About Sharing Configs"
shortTitle: "SonicWall backup breach lesson"
intro: "SonicWall confirmed that a brute-force attack on its MySonicWall.com portal exposed firewall configuration backup files for every customer who had used its cloud backup service, not a small subset, all of them. The files came straight from the vendor's own official backup feature."
faqs:
  - question: "What actually happened in the SonicWall backup incident?"
    answer: "An attacker used brute-force techniques against the MySonicWall.com customer portal and accessed configuration backup (.EXP) files. SonicWall's investigation, run with Mandiant, initially estimated under 5% of cloud-backup customers were affected, then confirmed in its final update that all customers who had used the cloud backup feature were impacted."
  - question: "Were the exposed backup files encrypted?"
    answer: "Partially. Credentials and secrets inside the .EXP file are individually encrypted, AES-256 on Gen 7 and newer firewalls, 3DES on Gen 6, but the rest of the configuration is only encoded, not encrypted, so topology, rules, IP ranges and other details are readable once decoded. SonicWall itself recommends treating any exposed file as a credential-reset trigger."
  - question: "Does this mean vendor cloud backups are unsafe to use?"
    answer: "No, SonicWall's advisory is about a portal being breached via brute force, not a flaw in backups as a concept. The lesson is narrower: a config export contains more usable detail than most people assume, so anywhere that file or its contents travels, a vendor's cloud backup, a support ticket, an AI chat, deserves the same scrutiny."
  - question: "What should I check on my own firewall after reading this?"
    answer: "If you use MySonicWall's cloud backup feature, log in and check the Product Management > Issue List for affected serial numbers, then follow SonicWall's Essential Credential Reset guidance. Separately, sanitize any config file before pasting it anywhere else, a support ticket, a forum post, or an AI assistant."
---

A vendor's own backup feature is supposed to be the safe place to put your configuration. In September 2025, SonicWall confirmed that wasn't true for its cloud backup customers, and the details are worth reading even if you don't run a SonicWall firewall.

> **What SonicWall confirmed**
> An attacker ran brute-force attacks against the MySonicWall.com customer portal and gained access to firewall configuration backup files. SonicWall's [own incident notice](https://www.sonicwall.com/support/knowledge-base/mysonicwall-cloud-backup-file-incident/250915160910330), run jointly with incident-response firm Mandiant, first estimated under 5% of cloud-backup customers were affected, then confirmed in its final update that **all** customers who had used the cloud backup feature were impacted. [CISA issued its own alert](https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident) urging every SonicWall customer to check their account.

## What was actually inside the exposed files

This is the part that matters beyond SonicWall's specific customers. A firewall configuration export (an `.EXP` file) is a full snapshot of the device: not just passwords, but topology, IP ranges, rules, and integration details.

<div class="key-points">
  <h3>What's protected, and what isn't</h3>
  <ul>
    <li><strong>Credentials and secrets</strong> are individually encrypted, AES-256 on Gen 7+ firewalls, the older 3DES on Gen 6.</li>
    <li><strong>Everything else in the file</strong>, network layout, rule sets, addressing, is only encoded, not encrypted, so it's readable after a simple decode.</li>
    <li><strong>The file's entire purpose</strong> is to restore a device to its exact captured state, which is precisely why it's dangerous outside a trusted channel: it's designed to contain everything needed to reconstruct your setup.</li>
  </ul>
</div>

SonicWall's advisory is explicit that even with credentials encrypted, "possession of these files could increase the risk of targeted attacks" because of everything else the file reveals about how the network is built.

## Why this applies to more than one vendor's backup feature

<div class="step-card">
  <span class="step-label">Use case</span>
  <strong>The backup file and the support-ticket paste have the same problem</strong>
  <p>Whether a config leaves your control through a breached vendor portal, a pasted forum post, an AI chat window, or an email attachment to support, the risk is the same: the file was built to contain everything needed to describe or rebuild your network, and most of that detail was never meant to be exposed outside a channel you trust. SonicWall's incident is a reminder that even the "official," vendor-blessed channel can fail. A support ticket or an AI chat has none of the encryption a cloud backup at least attempts.</p>
</div>

| What a raw config export contains | What's actually needed to troubleshoot or restore |
|---|---|
| Every firewall rule, in full | The one or two rules relevant to the issue |
| Full internal IP ranges and topology | Enough structure to explain the problem, not the whole map |
| Hostnames, server addresses, integration endpoints | Redacted placeholders that preserve the logic |
| Any embedded credentials or keys, even if encrypted | Nothing, credentials never belong in a shared file |

## Before you share a config anywhere

If you're [sharing a network config with a support team](/blog/share-network-config-support-ticket-safely/), the SonicWall incident is a good argument for [sanitizing it first](/blog/sanitize-network-config-before-sharing/), regardless of which vendor's portal, which AI assistant, or which forum you're posting to. [ScrubForge](/scrubforge/) strips exactly the detail a backup file leaks: credentials, IP ranges, hostnames and topology, while keeping the config structure intact enough to actually get help.

If you do use MySonicWall's cloud backup feature, check your account directly rather than relying on this article: SonicWall's advisory has the exact steps, and the Product Management > Issue List in your MySonicWall account will show if any of your serial numbers were flagged.

## Frequently asked questions

### What actually happened in the SonicWall backup incident?

An attacker used brute-force techniques against the MySonicWall.com customer portal and accessed configuration backup (.EXP) files. SonicWall's investigation, run with Mandiant, initially estimated under 5% of cloud-backup customers were affected, then confirmed in its final update that all customers who had used the cloud backup feature were impacted.

### Were the exposed backup files encrypted?

Partially. Credentials and secrets inside the .EXP file are individually encrypted, AES-256 on Gen 7 and newer firewalls, 3DES on Gen 6, but the rest of the configuration is only encoded, not encrypted, so topology, rules, IP ranges and other details are readable once decoded. SonicWall itself recommends treating any exposed file as a credential-reset trigger.

### Does this mean vendor cloud backups are unsafe to use?

No, SonicWall's advisory is about a portal being breached via brute force, not a flaw in backups as a concept. The lesson is narrower: a config export contains more usable detail than most people assume, so anywhere that file or its contents travels, a vendor's cloud backup, a support ticket, an AI chat, deserves the same scrutiny.

### What should I check on my own firewall after reading this?

If you use MySonicWall's cloud backup feature, log in and check the Product Management > Issue List for affected serial numbers, then follow SonicWall's Essential Credential Reset guidance. Separately, sanitize any config file before pasting it anywhere else, a support ticket, a forum post, or an AI assistant.
