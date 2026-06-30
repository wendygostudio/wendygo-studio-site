# How to Safely Share a FortiGate Firewall Config

A FortiGate running-config contains far more than firewall rules. It holds VPN tunnels, interface IP blocks, admin credentials, HTTPS inspection certificates, and API tokens — all at risk when the config is shared raw with support.

## What a FortiGate Config Actually Contains

When you run `show` or export a full config from a FortiGate, you get:

- **Admin and user passwords** — encrypted, but still sensitive data in the file
- **VPN tunnel pre-shared keys and certificates** — active credentials
- **API tokens** — used for automation and third-party integrations
- **HTTPS inspection certificates** — private keys that decrypt traffic
- **DNS forwarding zones** and dynamic DNS credentials
- **Email and alert authentication strings**

Sharing the entire config — even to Fortinet support or an AI assistant — exposes all of these simultaneously.

## Before and After: FortiGate Sanitization

Here's what a small section looks like:

**Raw:**
```
config vpn ipsec phase1
    edit "site-to-site-main"
        set psk "Tunnel@KeySecure#2026"
        set peer "203.0.113.5"
    next
end

config system admin
    edit "backup-admin"
        set password "F@rtinet2026"
    next
end
```

**Sanitized:**
```
config vpn ipsec phase1
    edit "site-to-site-main"
        set psk "[VPNKEY_1]"
        set peer "203.0.113.5"
    next
end

config system admin
    edit "backup-admin"
        set password "[ADMIN_PASS_1]"
    next
end
```

The tunnel name and peer IP stay visible for troubleshooting — the secrets are replaced with consistent tokens. Support engineers see the structure; they never see the real credentials.

## How to Sanitize FortiGate Configs with ScrubForge

1. **Export your config** — Log into FortiGate > System Settings > Configuration > Download. Save the full config file locally.
2. **Open ScrubForge** — Click the extension in your browser toolbar.
3. **Paste and clean** — Copy the config contents and paste into ScrubForge. It replaces sensitive patterns instantly, in your browser.
4. **Review the output** — Scan for any remaining exposed values — FortiGate uses many custom secret formats. Always review before sharing.
5. **Share safely** — Copy the sanitized text into your Fortinet TAC ticket or email. No credentials left behind.

## Why This Matters

Fortinet support cases are stored indefinitely in their systems. Configs pasted into ChatGPT or Claude are logged and may be used for model training. A sanitized version gives support exactly what they need — the config structure and logic — without the active credentials.

## When to Sanitize

- Before opening a TAC case with Fortinet support
- Before pasting into AI assistants for config debugging
- Before sharing with vendors or contractors
- Before storing configs in shared repositories or documentation systems

ScrubForge is free and works on any text — FortiGate, Cisco, Palo Alto, Juniper, or cloud configs. All processing happens in your browser. No upload. No account.

**[Install ScrubForge — Free](https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe)**

Learn also: [How to Remove Sensitive Data from a Cisco IOS Config](/blog/remove-sensitive-data-cisco-config/)
