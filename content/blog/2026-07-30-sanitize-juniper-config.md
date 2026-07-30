---
schemaVersion: 1
title: "How to Sanitize a Juniper JunOS Config Before Sharing"
description: "JunOS 'show configuration' output carries root-authentication hashes, SNMP communities, and BGP/OSPF authentication keys. Here's what to strip before pasting into an AI chat or a ticket."
date: 2026-07-30
slug: sanitize-juniper-config
locale: en
translationKey: sanitize-juniper-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize juniper junos config"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

`show configuration` on a Juniper device is a single flat dump of the entire box: interfaces, routing policy, firewall filters, and every credential the device holds, all in the same paste. Before that goes into a TAC case or an AI chat asking "why is this OSPF adjacency stuck," it's worth knowing exactly what's in there.

## What a JunOS Config Actually Contains

- `root-authentication encrypted-password` — a `$9$`-prefixed Juniper hash for the root account
- `snmp community` strings, often with `authorization read-write`
- BGP `authentication-key` and OSPF/IS-IS `authentication-key` (MD5, sometimes cleartext in older configs)
- IPsec `ike proposal` pre-shared keys under `security ike policy ... pre-shared-key`
- RADIUS and TACACS+ `secret` values under `system radius-server` / `system tacplus-server`
- Local user `authentication encrypted-password` hashes for every configured account

## Before and After

The same SNMP community or shared secret always maps to the same token across the whole sanitized output, so relationships between interfaces, policies, and neighbors stay intact — only the literal credential is replaced.

## Steps

1. Install ScrubForge from the Chrome Web Store (free)
2. Run `show configuration | display set` or the plain hierarchical form on your Juniper device
3. Paste the output into ScrubForge
4. Review the sanitized result — hashes, keys, and community strings are tokenized, structure is untouched
5. Copy and share, or continue in ScrubForge's built-in AI chat

## Why Local Processing Matters

A `$9$` root hash or a BGP MD5 key pasted into a TAC case or a shared chat log sits there indefinitely. ScrubForge sanitizes entirely inside the browser tab — nothing is uploaded before you decide to share it.

## Related

- [Sanitize a network config before sharing](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/scrubforge/)
