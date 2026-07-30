---
schemaVersion: 1
title: "How to Sanitize a Palo Alto PAN-OS Config Before Sharing"
description: "A PAN-OS 'show config running' or set-format export carries admin password hashes, IKE pre-shared keys, and RADIUS/LDAP bind secrets. Here's what to strip before pasting into an AI chat or a support case."
date: 2026-07-30
slug: sanitize-paloalto-config
locale: en
translationKey: sanitize-paloalto-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize palo alto pan-os config"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

Exporting a Palo Alto firewall config for a support case or an AI-assisted troubleshooting session pulls everything in the candidate or running config at once — zone structure, security rules, NAT, and every secret PAN-OS stores alongside them. Before that goes anywhere outside the box, it's worth knowing exactly what's in it.

## What a PAN-OS Config Actually Contains

- `phash` — the local administrator password hash under `mgt-config users`
- IKE Gateway `pre-shared-key` values for every VPN tunnel
- SNMP `snmp-setting` community strings (v1/v2c) or v3 auth/privacy passwords
- RADIUS, LDAP, and Kerberos `server-profile` secrets and bind passwords used for admin/GlobalProtect authentication
- GlobalProtect portal and gateway pre-shared secrets and certificate passphrases
- API keys embedded in automation scripts pasted alongside the config

## Before and After

The same pre-shared key or bind password always maps to the same token throughout the sanitized output, so relationships between VPN tunnels, zones, and authentication profiles stay readable — only the literal secret is replaced.

## Steps

1. Install ScrubForge from the Chrome Web Store (free)
2. Export with `show config running` (or the `set`-format equivalent) from the PAN-OS CLI or Panorama
3. Paste the output into ScrubForge
4. Review the sanitized result — password hashes, pre-shared keys, and bind secrets are tokenized, structure is untouched
5. Copy and share, or continue in ScrubForge's built-in AI chat

## Why Local Processing Matters

An IKE pre-shared key or an admin password hash pasted into a support ticket or a shared AI chat log sits there indefinitely, outside your control. ScrubForge sanitizes entirely inside the browser tab — nothing is uploaded before you decide to share it.

## Related

- [Sanitize a network config before sharing](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/scrubforge/)
