# How to Remove Sensitive Data from a Cisco IOS Config Before Sharing

**Date:** 2026-06-30  
**Slug:** remove-sensitive-data-cisco-config  
**Product:** ScrubForge  
**Type:** How-to / Tutorial técnico (Tipo C)  
**Keyword:** remove sensitive data from cisco config / cisco config sanitizer  

---

Every time a network engineer opens a TAC case or asks an AI assistant to help debug a routing issue, the support engineer asks for the running-config. The problem: `show running-config` on a Cisco IOS device doesn't just show interfaces and routes — it shows everything. Enable passwords, SNMP community strings, VPN pre-shared keys, RADIUS shared secrets. All in one paste.

## What a Cisco IOS Config Actually Contains

- Enable password / enable secret
- SNMP community strings
- VPN pre-shared keys (crypto isakmp key)
- RADIUS and TACACS+ shared secrets
- Username/password pairs (type-7 encoded = reversible)
- BGP neighbor passwords

## Before and After

The same community string always becomes the same token throughout the sanitized config. Logical structure — interfaces, ACLs, routing — is preserved.

## Steps

1. Install ScrubForge from Chrome Web Store (free)
2. Run `show running-config` on your Cisco device
3. Open ScrubForge, paste config
4. Review sanitized output
5. Copy and share safely

## Why Local Processing Matters

ScrubForge runs entirely in your browser tab. No server, no upload. Critical for production device configs and TAC tickets stored indefinitely in external systems.

## Internal links

- /blog/sanitize-network-config-before-sharing/

## CTA

Install ScrubForge: https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe
