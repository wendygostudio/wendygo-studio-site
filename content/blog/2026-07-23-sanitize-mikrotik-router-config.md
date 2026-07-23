---
schemaVersion: 1
title: "Sanitize a MikroTik RouterOS Config Before You Share It"
description: "MikroTik hides passwords in RouterOS exports by default. Topology, comments and server addresses still leak. Here's what to check before sharing."
date: 2026-07-23
slug: sanitize-mikrotik-router-config
locale: en
translationKey: sanitize-mikrotik-router-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize a MikroTik router config before sharing"
relatedPages: /scrubforge/,/blog/share-network-config-support-ticket-safely/,/blog/sanitize-fortigate-config/
sourceUrls: https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters,https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management,https://mikrotik.com/download/changelogs
alternateUrl: https://wendygostudio.com/es/blog/sanitizar-configuracion-mikrotik/
heading: "Sanitize a MikroTik RouterOS Config Before You Share It"
shortTitle: "Sanitize a MikroTik config"
intro: "RouterOS hides passwords in /export by default. That still leaves topology, comments and server addresses in the file you paste into a forum, a ticket or an AI chat."
faqs:
  - question: "Does show-sensitive replace the need to sanitize a MikroTik config?"
    answer: "No. show-sensitive only controls whether RouterOS prints its own predefined list of sensitive fields — passwords, keys, secrets. Everything else in the export, including IP addresses, comments and server addresses, stays visible either way. That's what ScrubForge is for."
  - question: "Will sanitizing break the config if I need to reimport it?"
    answer: "Only sanitize a copy meant for discussion, a forum post, or a support ticket — not the file you plan to reimport. Reimporting a script needs the real credential values, so keep your working export separate from the sanitized one you share publicly."
  - question: "Does ScrubForge recognize RouterOS syntax specifically?"
    answer: "Yes. RouterOS is one of the twelve device configuration syntaxes covered by ScrubForge's pattern library, alongside Cisco, FortiGate, Juniper and Palo Alto, among others."
  - question: "What if I already posted an unsanitized MikroTik config?"
    answer: "Edit or delete the post if the platform allows it, then rotate any credential that was exposed — passwords, pre-shared keys, RADIUS secrets. Replacing values after the fact doesn't undo what was already visible while the post was live."
---

Posting a router config in a forum thread or a support ticket is routine sysadmin work, and MikroTik admins did a lot of it this month: RouterOS 7.21.5 (long-term) and 6.49.20 both shipped on July 6, 2026, and an upgrade usually means pulling a fresh `/export` to compare against the old configuration before and after.

> **What show-sensitive actually hides**
> By default, `/export` masks passwords, keys and secrets in a documented list of menus — WireGuard keys, RADIUS secrets, PPP passwords, SNMP community passwords, and roughly forty other fields. It does not touch IP addresses, comments, or anything outside that list.

## What RouterOS already hides for you

MikroTik's own documentation is specific about this: the `export` command "does not export system user passwords, installed certificates, SSH keys, Dude, or a User-manager database," and everything else considered sensitive is masked unless you add `show-sensitive` to the command. There's an official reference table listing exactly which menu and which field gets hidden: the [list of menus with sensitive parameters](https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters) covers WireGuard `private-key` and `preshared-key`, RADIUS `secret`, SNMP `authentication-password`, PPP `secret`, IPsec keys, VRRP `password`, and more.

That's genuinely useful default behavior. It's also easy to read as "the export is safe to paste anywhere," which isn't quite true.

## What a "clean" export still contains

Masking a fixed list of parameter names doesn't touch free text or anything outside that list. A default `/export` still includes:

<div class="key-points">
  <h3>Still fully visible after show-sensitive masking</h3>
  <ul>
    <li>every configured IP address, subnet and WAN peer endpoint;</li>
    <li>interface and VLAN comments, which often name internal systems or clients;</li>
    <li>RADIUS, NTP, DNS and SNMP server addresses — the address, not just the secret;</li>
    <li>SNMP community names, when they're descriptive strings rather than passwords;</li>
    <li>system identity, routing peers and firewall address-lists.</li>
  </ul>
</div>

None of that is a bug. [MikroTik's own configuration management guide](https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management) shows real-looking internal subnets in its own export examples, because topology is exactly what an import needs to work. It's just not something you want a stranger on a forum, or an outside support queue, to see attached to your public IP.

## Sanitize before show-sensitive even matters

<div class="step-card">
  <span class="step-label">Workflow</span>
  <strong>Export, paste, review, share</strong>
  <p>Run <code>/export file=config</code> as usual — leave out <code>show-sensitive</code>, you don't need it for a support request or a forum post. Open [ScrubForge](/scrubforge/), paste the output, and it flags credential-shaped strings matching RouterOS syntax, replacing each unique value with a consistent token like <code>[RADIUS_SECRET_1]</code>. Everything runs locally in the browser tab; nothing uploads anywhere.</p>
</div>

| Before (raw export) | After (sanitized) |
|---|---|
| `set 0 password=Adm1nR0S!` | `set 0 password=[PASSWORD_1]` |
| `secret="Sup3rShared" address=10.20.0.1` | `secret=[RADIUS_SECRET_1] address=10.20.0.1` |
| `private-key="wG9K...=="` | `private-key=[WG_KEY_1]` |

Notice the peer address stays in place. That's what a forum reader or a support engineer actually needs to help you — not the secret sitting next to it.

## The same habit works for every vendor

We've covered this workflow before for [Cisco and FortiGate configs](/blog/sanitize-fortigate-config/). MikroTik is one of the twelve vendor syntaxes ScrubForge recognizes, alongside Juniper and Palo Alto — same idea, different field names each time. If you're pasting into a [support ticket](/blog/share-network-config-support-ticket-safely/) rather than a public forum, the same sanitize-first habit applies before the file ever leaves your machine.

## Before you post

A one-line note next to the sanitized export helps: "credentials replaced with placeholder tokens; structure is intact." It tells whoever reads the thread that a live password isn't sitting in it, and it takes ten seconds to add.

## Frequently asked questions

### Does show-sensitive replace the need to sanitize a MikroTik config?

No. show-sensitive only controls whether RouterOS prints its own predefined list of sensitive fields — passwords, keys, secrets. Everything else in the export, including IP addresses, comments and server addresses, stays visible either way. That's what ScrubForge is for.

### Will sanitizing break the config if I need to reimport it?

Only sanitize a copy meant for discussion, a forum post, or a support ticket — not the file you plan to reimport. Reimporting a script needs the real credential values, so keep your working export separate from the sanitized one you share publicly.

### Does ScrubForge recognize RouterOS syntax specifically?

Yes. RouterOS is one of the twelve device configuration syntaxes covered by ScrubForge's pattern library, alongside Cisco, FortiGate, Juniper and Palo Alto, among others.

### What if I already posted an unsanitized MikroTik config?

Edit or delete the post if the platform allows it, then rotate any credential that was exposed — passwords, pre-shared keys, RADIUS secrets. Replacing values after the fact doesn't undo what was already visible while the post was live.
