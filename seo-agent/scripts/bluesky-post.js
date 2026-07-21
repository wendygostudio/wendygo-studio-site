#!/usr/bin/env node
// ============================================================
// Wendygo Studio — Bluesky Post Script
// ============================================================
// Usage: node bluesky-post.js "Your post text here"
//        node bluesky-post.js "Check out our guide" "https://wendygostudio.com/blog/article/"
// ============================================================

const BLUESKY_HANDLE = process.env.BLUESKY_HANDLE || 'wendygostudio.bsky.social';
const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;
const BLUESKY_API = 'https://bsky.social/xrpc';

if (!BLUESKY_APP_PASSWORD) {
  console.error('❌ BLUESKY_APP_PASSWORD not set in environment');
  process.exit(1);
}

const text = process.argv[2];
const url = process.argv[3]; // Optional URL to embed as card

if (!text) {
  console.error('Usage: node bluesky-post.js "Post text" ["https://optional-url.com"]');
  process.exit(1);
}

// ── Auth ─────────────────────────────────────────────────

async function createSession() {
  const res = await fetch(`${BLUESKY_API}/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: BLUESKY_HANDLE,
      password: BLUESKY_APP_PASSWORD,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth failed (${res.status}): ${err}`);
  }

  return res.json();
}

// ── Facets (links and mentions in text) ──────────────────

function detectFacets(text) {
  const facets = [];

  // Detect URLs in text
  const urlRegex = /https?:\/\/[^\s)>\]]+/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    // Bluesky uses byte offsets, not character offsets
    const byteStart = Buffer.byteLength(text.substring(0, match.index), 'utf8');
    const byteEnd = byteStart + Buffer.byteLength(url, 'utf8');
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    });
  }

  // Detect mentions (@handle.bsky.social)
  const mentionRegex = /@([a-zA-Z0-9._-]+\.[a-zA-Z]+)/g;
  while ((match = mentionRegex.exec(text)) !== null) {
    const byteStart = Buffer.byteLength(text.substring(0, match.index), 'utf8');
    const byteEnd = byteStart + Buffer.byteLength(match[0], 'utf8');
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#mention', did: '' }], // DID resolved later if needed
    });
  }

  return facets;
}

// ── Embed URL card ───────────────────────────────────────

async function fetchUrlCard(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WendygoBot/1.0' },
      redirect: 'follow',
    });

    if (!res.ok) return null;

    const html = await res.text();

    // Extract basic meta tags
    const getMetaContent = (name) => {
      const patterns = [
        new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${name}["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m) return m[1];
      }
      return null;
    };

    const title = getMetaContent('og:title') ||
                  getMetaContent('twitter:title') ||
                  (html.match(/<title>([^<]+)<\/title>/i) || [])[1] ||
                  url;

    const description = getMetaContent('og:description') ||
                        getMetaContent('twitter:description') ||
                        getMetaContent('description') ||
                        '';

    return {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title: title.substring(0, 300),
        description: description.substring(0, 1000),
      },
    };
  } catch (e) {
    console.warn(`⚠️  Could not fetch URL card for ${url}: ${e.message}`);
    return null;
  }
}

// ── Post ─────────────────────────────────────────────────

async function post() {
  // Authenticate
  const session = await createSession();
  console.log(`✅ Authenticated as ${session.handle}`);

  // Build post record
  const record = {
    $type: 'app.bsky.feed.post',
    text: text,
    createdAt: new Date().toISOString(),
    langs: ['en'],
  };

  // Add facets (links/mentions detected in text)
  const facets = detectFacets(text);
  if (facets.length > 0) {
    record.facets = facets;
  }

  // Add URL card embed if URL provided
  if (url) {
    const card = await fetchUrlCard(url);
    if (card) {
      record.embed = card;
      console.log(`📎 Embedded link card: ${card.external.title}`);
    }
  }

  // Publish
  const res = await fetch(`${BLUESKY_API}/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record: record,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Post failed (${res.status}): ${err}`);
  }

  const result = await res.json();
  console.log(`🚀 Posted successfully!`);
  console.log(`   URI: ${result.uri}`);
  console.log(`   URL: https://bsky.app/profile/${session.handle}/post/${result.uri.split('/').pop()}`);

  return result;
}

// ── Run ──────────────────────────────────────────────────

post().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
