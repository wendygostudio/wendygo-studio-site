---
schemaVersion: 1
title: "How to Sanitize a Huawei VRP Config Before Sharing"
description: "Huawei VRP 'display current-configuration' output carries irreversible-cipher password hashes, SNMP communities, and OSPF/BGP MD5 authentication keys. Here's what to strip before pasting into an AI chat or a support case."
date: 2026-07-30
slug: sanitize-huawei-config
locale: en
translationKey: sanitize-huawei-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize huawei vrp config"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

`display current-configuration` on a Huawei VRP device (routers and switches running the same OS family) dumps interfaces, routing protocols, and every stored credential in one continuous block. Before that goes into a support case or an AI chat asking about an OSPF neighbor stuck in EXSTART, it's worth knowing exactly what's in there.

## What a Huawei VRP Config Actually Contains

- `local-user ... password irreversible-cipher` — hashed local account passwords
- `super password` — the privileged-mode password, stored as a cipher string
- `snmp-agent community` strings, read or read-write
- OSPF and BGP `authentication-mode md5` keys, plus IS-IS authentication passwords
- `radius-server shared-key` and `hwtacacs-server shared-key` values
- IPsec/IKE `pre-shared-key` strings for site-to-site tunnels

## Before and After

The same shared-key or community string always maps to the same token throughout the sanitized output, so relationships between neighbors, VLANs, and authentication profiles stay readable — only the literal credential is replaced.

## Steps

1. Install ScrubForge from the Chrome Web Store (free)
2. Run `display current-configuration` on your Huawei device
3. Paste the output into ScrubForge
4. Review the sanitized result — cipher passwords, community strings, and authentication keys are tokenized, structure is untouched
5. Copy and share, or continue in ScrubForge's built-in AI chat

## Why Local Processing Matters

An `irreversible-cipher` hash or an OSPF MD5 key pasted into a support ticket or a shared chat log sits there indefinitely. ScrubForge sanitizes entirely inside the browser tab — nothing is uploaded before you decide to share it.

## Related

- [Sanitize a network config before sharing](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/scrubforge/)
