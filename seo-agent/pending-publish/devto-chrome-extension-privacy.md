On July 10, 2026, Google pulled ModHeader from the Chrome Web Store. Microsoft had already pulled the Edge version a week earlier. Combined, the two listings had about 1.6 million installs.

## What was actually inside it

Security firm Stripe OLT found that the official, signed release of ModHeader, a popular developer tool for editing HTTP headers, shipped with a complete, dormant browsing-history collector. On every page load, it fingerprinted the device, grabbed the domain, encrypted it, and stored it locally, up to 1,000 domains. A daily scheduler was built to bundle that list with the fingerprint and upload it to an external server.

It never actually ran. The upload was gated behind an internal allow-list, and that list shipped empty. The check failed every time, so nothing left the device. But turning it on required nothing more than a routine update, no new permission prompt, no click from the user.

## Why automated scanners missed it

- The payload was encrypted, so a scanner reading network traffic saw ciphertext, not domains.
- The upload path was gated off, so a sandbox saw zero outbound calls.
- The malicious code was minified into a legitimate, fully working feature set.

Automated risk checkers had rated the extension low risk, some scoring it as high as 95 out of 100.

## The part worth remembering

Popularity and a long track record aren't a safety signal on their own. ModHeader had a decade of trust and 1.6 million users. What actually matters is what an extension is permitted to access versus what its stated feature needs, and whether it still works if you cut its network access entirely.

If you use a browser extension for something that doesn't inherently need the network, a text tool, a timer, a local utility, that's a two-minute test worth running: disable your connection and see if it still works. If it does, it was probably never phoning home anyway. If it doesn't, ask why.

We went through this exercise for our own focus timer, because "no accounts, no tracking" isn't a claim worth making unless it also holds up unplugged. Full writeup with a permission checklist: [wendygostudio.com](https://wendygostudio.com/blog/is-your-chrome-extension-spying-on-you/)
