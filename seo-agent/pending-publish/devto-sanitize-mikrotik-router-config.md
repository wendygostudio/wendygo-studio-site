MikroTik just shipped RouterOS 7.21.5 (long-term) and 6.49.20 on July 6, which means a lot of sysadmins pulled a fresh `/export` this month to diff against their old config. Good moment to check what's actually in that file.

Here's the thing: RouterOS already hides your passwords. By default, `/export` masks everything on a documented list of "sensitive" fields — WireGuard keys, RADIUS secrets, PPP passwords, SNMP community passwords, IPsec keys, VRRP passwords, around forty fields total. You only see the real values if you explicitly add `show-sensitive` to the command.

That's a genuinely good default. It also creates a false sense of security, because masking a fixed list of parameter names doesn't touch anything outside that list.

**What's still sitting in a "clean" export:**

- every IP address, subnet and WAN peer endpoint you've configured
- interface and VLAN comments — the ones where someone typed the client's name or an internal system label
- RADIUS, NTP, DNS and SNMP server addresses (the address, not the secret — but still not nothing)
- SNMP community *names*, when they're descriptive strings instead of passwords
- system identity, routing peers, firewall address-lists

None of that is a bug on MikroTik's side. Their own configuration management docs show real-looking internal subnets in the export examples, because topology is exactly what an import needs to reconstruct. It's just not something you necessarily want sitting in a public forum thread next to your WAN IP.

**The habit that actually closes the gap**

Export like normal — you don't need `show-sensitive` for a support request or a forum post, so just leave it out. Then run the output through something that catches credential-shaped strings specifically, not just RouterOS's predefined field list. I built this into ScrubForge (a config sanitizer I work on) specifically because the "twelve vendor syntaxes, one workflow" problem shows up constantly: Cisco, FortiGate, MikroTik, Juniper, Palo Alto configs all have this same shape — real secrets sitting next to real topology, and only the topology is actually useful to whoever's helping you debug.

Before:
```
secret="Sup3rShared" address=10.20.0.1
private-key="wG9K...=="
```

After:
```
secret=[RADIUS_SECRET_1] address=10.20.0.1
private-key=[WG_KEY_1]
```

The peer address stays. That's what matters for troubleshooting. The secret doesn't need to be there at all.

One-line habit: whatever platform you're posting to — a vendor forum, a support ticket, a Slack channel with an AI bot in it — sanitize before you paste, not after someone points out you shouldn't have.

📖 Read the full guide with more details on [wendygostudio.com](https://wendygostudio.com/blog/sanitize-mikrotik-router-config/)
