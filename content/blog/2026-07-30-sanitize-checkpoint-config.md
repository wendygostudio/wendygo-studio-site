---
schemaVersion: 1
title: "How to Sanitize a Check Point Config Before Sharing"
description: "A Check Point Gaia/SmartConsole config export carries admin password hashes, SIC activation keys, VPN pre-shared secrets, and RADIUS/TACACS shared secrets. Here's what to strip before pasting into an AI chat or a TAC case."
date: 2026-07-30
slug: sanitize-checkpoint-config
locale: en
translationKey: sanitize-checkpoint-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize check point config"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

A Check Point config export — whether it's a Gaia `show configuration` dump, a `cpconfig` output, or a policy exported from SmartConsole — mixes network objects, security rules, and every credential the gateway or management server holds into one file. Before that goes into a TAC case or an AI chat asking why a VPN tunnel won't come up, it's worth knowing exactly what's in there.

## What a Check Point Config Actually Contains

- Gaia admin `password-hash` values for local accounts
- SIC (Secure Internal Communication) one-time passwords and activation keys used to pair gateways with the management server
- VPN community `pre-shared-secret` values for site-to-site and remote-access tunnels
- SNMP community strings under `set snmp community`
- RADIUS and TACACS+ shared secrets configured for admin or user authentication
- API keys and tokens used by SmartConsole or R8x Management API scripts pasted alongside the config

## Before and After

The same pre-shared secret or SIC key always maps to the same token throughout the sanitized output, so relationships between gateways, VPN communities, and objects stay readable — only the literal credential is replaced.

## Steps

1. Install ScrubForge from the Chrome Web Store (free)
2. Export your config via Gaia CLI, `cpconfig`, or a SmartConsole policy export
3. Paste the output into ScrubForge
4. Review the sanitized result — password hashes, SIC keys, and pre-shared secrets are tokenized, structure is untouched
5. Copy and share, or continue in ScrubForge's built-in AI chat

## Why Local Processing Matters

A SIC activation key or a VPN pre-shared secret pasted into a TAC case or a shared chat log sits there indefinitely, outside your control. ScrubForge sanitizes entirely inside the browser tab — nothing is uploaded before you decide to share it.

## Related

- [Sanitize a network config before sharing](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/scrubforge/)
