In September 2025, SonicWall confirmed that a brute-force attack against its MySonicWall.com customer portal had exposed firewall configuration backup files. The first estimate was under 5% of cloud-backup customers. The final, closed-investigation number, reached with Mandiant, was all of them.

## What was actually in the files

A SonicWall config export (`.EXP`) is a full device snapshot, built specifically to restore a firewall to its exact captured state. That's the whole point of a backup, but it's also why exposure is worse than a single leaked password.

- Credentials and secrets are individually encrypted (AES-256 on Gen 7+ firewalls, 3DES on Gen 6).
- Everything else, topology, rule sets, IP ranges, integration endpoints, is only *encoded*, not encrypted. Readable after a basic decode.

SonicWall's own advisory is blunt about this: even with credentials protected, "possession of these files could increase the risk of targeted attacks" because of everything else the file reveals about how the network is built.

## The part that generalizes past SonicWall

This wasn't a flaw in the concept of vendor backups. It was a brute-forced portal. But it's a useful reminder of something people underestimate constantly: a raw config file, whether it's sitting in a vendor's cloud backup, pasted into a support ticket, or dropped into an AI chat for troubleshooting, contains far more than the one detail you actually need to share.

A support engineer or an AI assistant helping you debug one firewall rule doesn't need your entire internal IP range, every other rule in the file, or your integration endpoints. They need the two or three lines relevant to the problem, with the rest redacted.

If SonicWall's own "official" channel could expose a full config to an attacker who never touched your network directly, treat every other place a config file travels with at least that much suspicion, a support ticket has none of the encryption a cloud backup at least attempts.

We build tooling around exactly this gap, stripping credentials, IPs, and identifying details from network configs before they leave your machine: [wendygostudio.com](https://wendygostudio.com/blog/what-the-sonicwall-backup-breach-teaches-about-config-sharing/)
