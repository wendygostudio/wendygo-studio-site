---
schemaVersion: 1
title: "How to Sanitize a Ubiquiti UniFi / EdgeOS Config Before Sharing"
description: "A UniFi controller backup or EdgeOS 'show configuration' export carries WiFi pre-shared keys, admin passwords, RADIUS secrets, and site-to-site VPN keys. Here's what to strip before pasting into an AI chat or a forum post."
date: 2026-07-30
slug: sanitize-ubiquiti-config
locale: en
translationKey: sanitize-ubiquiti-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize ubiquiti unifi config"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

A Ubiquiti setup usually means troubleshooting across two overlapping systems: the UniFi controller's exported site backup or `config.gateway.json`, and EdgeOS's `show configuration` on EdgeRouter hardware. Both dump network topology, WiFi settings, and credentials in one file. Before that goes into a community forum post or an AI chat asking why a VLAN won't route, it's worth knowing exactly what's in there.

## What a UniFi / EdgeOS Config Actually Contains

- WiFi network `x_passphrase` — the WPA2/WPA3 pre-shared key, stored in cleartext in UniFi site backups
- Local admin account passwords (hashed in the controller database, sometimes present in cleartext in support-export bundles)
- `radius profile` shared secrets used for 802.1X or hotspot authentication
- Site-to-site and remote-user VPN `pre-shared-key` values under `vpn ipsec` (EdgeOS) or the UniFi VPN configuration
- SNMP community strings under `snmp community`
- Guest portal and hotspot voucher secrets, and any third-party API keys embedded in integrations

## Before and After

The same WiFi passphrase or VPN pre-shared key always maps to the same token throughout the sanitized output, so relationships between sites, VLANs, and tunnels stay readable — only the literal credential is replaced.

## Steps

1. Install ScrubForge from the Chrome Web Store (free)
2. Export a UniFi site backup or run `show configuration` on your EdgeRouter
3. Paste the relevant section into ScrubForge
4. Review the sanitized result — passphrases, admin passwords, and shared secrets are tokenized, structure is untouched
5. Copy and share, or continue in ScrubForge's built-in AI chat

## Why Local Processing Matters

A WiFi pre-shared key or a VPN secret pasted into a public forum thread or a shared AI chat log is effectively public the moment it's posted. ScrubForge sanitizes entirely inside the browser tab — nothing is uploaded before you decide to share it.

## Related

- [Sanitize a network config before sharing](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/scrubforge/)
