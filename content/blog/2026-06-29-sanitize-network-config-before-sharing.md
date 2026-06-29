---
title: "How to Sanitize Network Configs Before Sharing with AI Assistants"
description: "Share Cisco, FortiGate, or AWS configs with AI assistants without exposing real credentials. ScrubForge replaces IPs, passwords, and secrets with consistent tokens — locally, no upload."
date: 2026-06-29
slug: sanitize-network-config-before-sharing
product: ScrubForge
type: how-to
keyword: "sanitize network config"
---

# How to Sanitize Network Configs Before Sharing with AI Assistants

You're debugging a Cisco ACL or tracing a FortiGate policy issue and you want to paste the config into ChatGPT or Claude to get a second opinion. But the config has real IP addresses, hostnames, shared secrets, and SNMP community strings in it. Sharing any of those is a security incident waiting to happen.

ScrubForge is a Chrome extension that solves this problem. Paste your config, and ScrubForge detects sensitive values — IPs, passwords, keys, hostnames, credentials — and replaces each one with a consistent placeholder token. The structure of the config stays intact; the sensitive data does not leave your machine.

## Why Configs Are Sensitive

A network configuration file is not just settings. It contains:

- **Real IP addresses** — internal subnets, management IPs, next-hops — that map your topology
- **Shared secrets** — IPsec pre-shared keys, RADIUS secrets, SNMP community strings
- **Credentials** — local usernames, enable passwords, API keys
- **Hostnames and domain names** — internal naming conventions that reveal infrastructure layout
- **Route maps and ACL targets** — which hosts talk to which, effectively a map of your network segmentation

Handing a config file to an AI assistant that sends data to a cloud provider means all of that information leaves your network perimeter. Even if the AI service encrypts transit and doesn't store prompts, you've created a disclosure event.

## What ScrubForge Does

ScrubForge processes the config locally in your browser. Nothing is uploaded. The extension scans the text for patterns that match sensitive categories and replaces each detected value with a stable token.

The key property: **consistency**. If the same IP address appears five times in your config, ScrubForge replaces all five occurrences with the same placeholder — `[IP_1]`. The AI can read the sanitized config, understand the relationships between network objects, and give you useful feedback. It just can't see the real values.

## How to Sanitize a Config with ScrubForge

1. **Install ScrubForge** from the Chrome Web Store. Pin it to your toolbar from the Extensions menu.
2. **Open your config file** in any text editor or terminal window.
3. **Select all and copy** the configuration text.
4. **Click the ScrubForge icon** in your browser toolbar to open the extension panel.
5. **Paste the config** into the input area.
6. **Apply the sanitizer.** ScrubForge processes the text locally and displays the sanitized version with all sensitive values replaced by consistent tokens.
7. **Copy the sanitized output** and paste it into your AI assistant.

When you receive suggestions from the AI that reference `[IP_1]` or `[SECRET_1]`, you know exactly which real values those tokens correspond to — they're in the original config on your screen.

## Practical Example

Say you have this FortiGate snippet:

```
config router static
    edit 1
        set dst 10.0.0.0/8
        set gateway 192.168.1.1
        set device "wan1"
    next
end
```

After ScrubForge processes it:

```
config router static
    edit 1
        set dst [SUBNET_1]
        set gateway [IP_1]
        set device "wan1"
    next
end
```

You can paste the sanitized version and ask: "Why would a static route to [SUBNET_1] via [IP_1] not be preferred over the default route?" The AI understands the question. Your real subnets stay on your machine.

## Use Cases

**Asking AI for help debugging routing or firewall rules.** This is the most common scenario — you want a second opinion on a policy, ACL, or route map without exposing what's inside.

**Sharing configs with external consultants or support forums.** You can post to a vendor's support forum or hand a config to a contractor without redacting manually — ScrubForge handles it in seconds.

**Preparing configs for documentation.** Internal docs often need sanitized examples. ScrubForge makes it fast to produce a version with no real data.

**Reviewing configs with a team member over a shared chat.** Slack, Teams, or Discord channels may be logged. Sanitizing before sharing ensures the live secrets don't appear in logs.

## Frequently Asked Questions

**Does ScrubForge send my config to any server?**
No. ScrubForge is a Chrome extension that runs entirely in your browser. The text you paste is processed locally. Nothing is transmitted to Wendygo Studio servers or any external service.

**Does it work with Cisco IOS, FortiGate, and AWS configs?**
ScrubForge is designed for infrastructure configuration files. It detects patterns common across vendor formats: IP addresses, subnet masks, pre-shared keys, SNMP strings, and similar values. It works on plain text from any source you can copy from.

**What if ScrubForge misses a sensitive value?**
The sanitizer detects known patterns. For unusual or custom secret formats, review the sanitized output before sharing. ScrubForge does not guarantee 100% coverage of every possible secret format.

**Is ScrubForge free?**
Yes. ScrubForge is free to install and use from the Chrome Web Store. No account or subscription required.

**Can I use the sanitized output to get back to the original values?**
The sanitized file alone cannot be reversed — ScrubForge does not upload a mapping anywhere. The mapping exists only in your original file and in the in-browser session. If you close the extension, you'll need to re-sanitize if you need the tokens again.
