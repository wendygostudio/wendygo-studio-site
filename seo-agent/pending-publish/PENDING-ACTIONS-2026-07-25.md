# Pending external actions — 2026-07-25 (2 cycles)

Same blocker as every previous day: DEV.to and Bluesky publication could not be executed from this sandbox. Both scripts were run for real (not simulated) for both of today's articles and failed identically at the network layer:

```
❌ fetch failed
```

This is a fixed outbound-proxy allowlist on this environment, confirmed exhaustively in earlier sessions — not a credentials or script problem. Run the commands below from a machine with real internet access.

**Note:** the 2026-07-24 ODR post is still pending too (see `PENDING-ACTIONS-2026-07-24.md`). You now have 3 posts queued across 2 real articles-days: 07-24 (ODR), and today's two (Chrome extension privacy + SonicWall backup breach).

## DEV.to

Run each from `C:\Users\Damian\Documents\WendygoStudio\.integration`:

### Chrome extension privacy (SlimeForge)

```bash
node seo-agent/scripts/devto-post.js --file "Is Your Chrome Extension Spying on You? A 2026 Checklist" "seo-agent/pending-publish/devto-chrome-extension-privacy.md" "privacy,security,chrome,productivity" "https://wendygostudio.com/blog/is-your-chrome-extension-spying-on-you/"
```

### SonicWall backup breach (ScrubForge)

```bash
node seo-agent/scripts/devto-post.js --file "What the SonicWall Breach Teaches About Sharing Configs" "seo-agent/pending-publish/devto-sonicwall-backup-breach.md" "security,networking,firewall,infosec" "https://wendygostudio.com/blog/what-the-sonicwall-backup-breach-teaches-about-config-sharing/"
```

Both can run the same day — DEV.to has no daily post limit. If either returns HTTP 422, the canonical URL already exists — not a real error, skip it.

## Bluesky

Last **logged successful** post in `seo-agent/logs/bluesky_tracker.json` is still **tipo_2** on 2026-07-21 — nothing since has actually posted. Per the rotation rule, the next type due is **tipo_1**.

Bluesky's own rule caps this at **1 post per day**, regardless of how many site articles published that day. So even though both articles below are dated 2026-07-25 on the site, post them on **different real days**:

1. Post the 07-24 ODR text first (from `PENDING-ACTIONS-2026-07-24.md`) as **tipo_1**. Log it.
2. On a separate day, post the Chrome-extension text below as **tipo_2**. Log it.
3. On another separate day, post the SonicWall text below as **tipo_3**. Log it.

If you'd rather skip the backlog and only post the most recent topic, that's fine — just log whichever one you actually post.

### Chrome extension privacy text (tipo_2 if posted second)

```bash
node seo-agent/scripts/bluesky-tools.js post "Google just pulled a Chrome extension with 1.6M installs (July 2026) after finding a hidden data collector inside the official, signed version. If you use browser extensions for focus or productivity, check chrome://extensions: does it ask for more access than its job needs?"
```

(255 characters, no link.)

### SonicWall backup breach text (tipo_3 if posted third)

```bash
node seo-agent/scripts/bluesky-tools.js post "SonicWall confirmed its own cloud backup files leaked config data for every customer who used the feature, not a small subset. If a vendor's official backup channel can leak topology and IP ranges, treat any config you paste into a support ticket the same way: strip it first."
```

(305 characters, no link.)

After each successful post, log it:

```json
{"date": "<real date posted>", "type": "tipo_2", "text": "Google just pulled a Chrome extension...", "url": "", "posted": true}
{"date": "<real date posted>", "type": "tipo_3", "text": "SonicWall confirmed its own cloud backup...", "url": "", "posted": true}
```

### Organic engagement (Bluesky)

Depends on the `post` commands above succeeding first:

```bash
node seo-agent/scripts/bluesky-tools.js search "browser privacy" 10
node seo-agent/scripts/bluesky-tools.js search "network security" 10
```

Review real results and like/follow 3-5 genuinely relevant, active, non-spam accounts once posting works locally.
