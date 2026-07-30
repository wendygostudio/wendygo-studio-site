---
schemaVersion: 1
title: "How to Sanitize an Arista EOS Config Before Sharing"
description: "Arista EOS 'show running-config' output carries enable secrets, SNMP communities, BGP neighbor passwords, and MLAG shared secrets. Here's what to strip before pasting into an AI chat or a support case."
date: 2026-07-30
slug: sanitize-arista-config
locale: en
translationKey: sanitize-arista-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize arista eos config"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

`show running-config` on an Arista EOS switch produces the same kind of everything-at-once dump as any other vendor's CLI: VLANs, port-channels, BGP peering, and every credential the switch holds sit in one paste. Before that goes into a TAC case or an AI chat asking about a flapping MLAG peer, it's worth knowing exactly what's in there.

## What an Arista EOS Config Actually Contains

- `username admin secret` — a type-5 (or stronger) hashed local user password
- `snmp-server community` strings, sometimes scoped read-write
- BGP `neighbor ... password` values (MD5-based, reversible with the right tooling for older ciphers)
- `tacacs-server key` and `radius-server host ... key` shared secrets
- MLAG `peer-address` and `local-interface` configuration, occasionally paired with a shared secret in the peering setup
- `enable secret` for privileged EXEC access

## Before and After

The same TACACS+ key or BGP neighbor password always maps to the same token throughout the sanitized output, so relationships between peers, VLANs, and port-channels stay readable — only the literal credential is replaced.

## Steps

1. Install ScrubForge from the Chrome Web Store (free)
2. Run `show running-config` on your Arista switch
3. Paste the output into ScrubForge
4. Review the sanitized result — secrets, community strings, and neighbor passwords are tokenized, structure is untouched
5. Copy and share, or continue in ScrubForge's built-in AI chat

## Why Local Processing Matters

An MLAG shared secret or a TACACS+ key pasted into a support ticket or a shared chat log sits there indefinitely. ScrubForge sanitizes entirely inside the browser tab — nothing is uploaded before you decide to share it.

## Related

- [Sanitize a network config before sharing](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/scrubforge/)
