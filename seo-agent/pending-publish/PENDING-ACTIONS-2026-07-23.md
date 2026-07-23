# Pending external actions — 2026-07-23

Neither DEV.to nor Bluesky publication could be executed from this environment.

With direct access to the real repository, both `seo-agent/scripts/devto-post.js` and `seo-agent/scripts/bluesky-tools.js` were actually run (with the exact commands below) rather than just inspected. Both loaded credentials from `config/agent.env` successfully (no "not set" error) and both failed identically at the network call:

```
❌ fetch failed
```

This confirms the blocker is network egress from this Claude sandbox to `dev.to` / `bsky.social`, not missing scripts or missing credentials (`curl` to both domains independently returns HTTP 403 from the sandbox's outbound proxy). Credentials themselves were never read, printed, or copied anywhere in this session — the scripts load them internally, and I only saw their stdout (`❌ fetch failed`), never the key/password values.

Run the exact same commands below from a machine with real internet access (your own) and they should work as-is.

## What's ready to publish, once you run this locally

### DEV.to

Draft adaptation (450 words, different angle from the site article, ends with the canonical link) is at:
`seo-agent/pending-publish/devto-sanitize-mikrotik-router-config.md`

Run from `C:\Users\Damian\Documents\WendygoStudio\.integration`:

```bash
node seo-agent/scripts/devto-post.js --file "MikroTik Hides Your Passwords by Default. Not Your Network Map." "seo-agent/pending-publish/devto-sanitize-mikrotik-router-config.md" "networking,security,sysadmin,tutorial" "https://wendygostudio.com/blog/sanitize-mikrotik-router-config/"
```

If it returns HTTP 422, that means the canonical URL already exists on DEV.to — not a real error, just skip it.

### Bluesky

Last logged post (`seo-agent/logs/bluesky_tracker.json`) was **tipo_2** on 2026-07-21 (2026-07-22 had no post — Codex usage limit, per that day's journal). To respect the "no repeat two days running" rule, today's draft is **tipo_1** (useful tip, no product mention):

> MikroTik tip: /export hides passwords by default, but not comments, IPs, or server addresses. show-sensitive only unmasks a fixed field list — the rest of the file is visible either way. Worth knowing before pasting a config anywhere public.

(241 characters, no link, no hashtags — matches tipo_1 conventions in `prompts/bluesky-content.md`.)

```bash
node seo-agent/scripts/bluesky-tools.js post "MikroTik tip: /export hides passwords by default, but not comments, IPs, or server addresses. show-sensitive only unmasks a fixed field list — the rest of the file is visible either way. Worth knowing before pasting a config anywhere public."
```

Then log it manually in `seo-agent/logs/bluesky_tracker.json`:

```json
{"date": "2026-07-23", "type": "tipo_1", "text": "MikroTik tip: ...", "url": "", "posted": true}
```

### Organic engagement (Bluesky)

Could not be attempted — it depends on the `post` command above succeeding first (needs real network access). Once posting works locally:

```bash
node seo-agent/scripts/bluesky-tools.js search "sysadmin" 10
node seo-agent/scripts/bluesky-tools.js search "networking" 10
```

Review the real results yourself and like/follow 3-5 genuinely relevant, active, non-spam accounts per `prompts/bluesky-content.md` criteria — this needs a human (or an agent with live Bluesky access) looking at actual current posts, not something safe to pre-script with invented handles.
