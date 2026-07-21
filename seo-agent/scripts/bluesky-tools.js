#!/usr/bin/env node
// ============================================================
// Wendygo Studio — Bluesky Tools
// ============================================================
// Commands:
//   node bluesky-tools.js post "Text" ["https://url"]
//   node bluesky-tools.js search "query" [limit]
//   node bluesky-tools.js like <uri> <cid>
//   node bluesky-tools.js follow <handle>
//   node bluesky-tools.js find-people "query" [limit]
// ============================================================

const BLUESKY_HANDLE = process.env.BLUESKY_HANDLE || 'wendygostudio.bsky.social';
const BLUESKY_APP_PASSWORD = process.env.BLUESKY_APP_PASSWORD;
const API = 'https://bsky.social/xrpc';
const PUBLIC_API = 'https://public.api.bsky.app/xrpc';

if (!BLUESKY_APP_PASSWORD) {
  console.error('❌ BLUESKY_APP_PASSWORD not set in environment');
  process.exit(1);
}

// ── Auth ─────────────────────────────────────────────────

let sessionCache = null;

async function getSession() {
  if (sessionCache) return sessionCache;

  const res = await fetch(`${API}/com.atproto.server.createSession`, {
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

  sessionCache = await res.json();
  return sessionCache;
}

function authHeaders(session) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.accessJwt}`,
  };
}

// ── Facets (detect links in text) ────────────────────────

function detectFacets(text) {
  const facets = [];
  const urlRegex = /https?:\/\/[^\s)>\]]+/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const byteStart = Buffer.byteLength(text.substring(0, match.index), 'utf8');
    const byteEnd = byteStart + Buffer.byteLength(url, 'utf8');
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }],
    });
  }
  return facets;
}

// ── Fetch URL card for embeds ────────────────────────────

async function fetchUrlCard(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WendygoBot/1.0' },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const html = await res.text();

    const getMeta = (name) => {
      const patterns = [
        new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${name}["']`, 'i'),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m) return m[1];
      }
      return null;
    };

    return {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title: (getMeta('og:title') || (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || url).substring(0, 300),
        description: (getMeta('og:description') || getMeta('description') || '').substring(0, 1000),
      },
    };
  } catch (e) {
    console.warn(`⚠️  Could not fetch card: ${e.message}`);
    return null;
  }
}

// ── Commands ─────────────────────────────────────────────

async function cmdPost(text, url) {
  const session = await getSession();

  const record = {
    $type: 'app.bsky.feed.post',
    text,
    createdAt: new Date().toISOString(),
    langs: ['en'],
  };

  const facets = detectFacets(text);
  if (facets.length > 0) record.facets = facets;

  if (url) {
    const card = await fetchUrlCard(url);
    if (card) {
      record.embed = card;
      console.log(`📎 Embedded: ${card.external.title}`);
    }
  }

  const res = await fetch(`${API}/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  });

  if (!res.ok) throw new Error(`Post failed: ${await res.text()}`);
  const result = await res.json();
  const postId = result.uri.split('/').pop();
  console.log(`🚀 Posted: https://bsky.app/profile/${session.handle}/post/${postId}`);
  return result;
}

async function cmdSearch(query, limit = 10) {
  const session = await getSession();
  const params = new URLSearchParams({ q: query, limit: String(limit) });

  const res = await fetch(`${API}/app.bsky.feed.searchPosts?${params}`, {
    headers: authHeaders(session),
  });

  if (!res.ok) throw new Error(`Search failed: ${await res.text()}`);
  const data = await res.json();

  if (!data.posts || data.posts.length === 0) {
    console.log('No posts found.');
    return [];
  }

  const results = data.posts.map((p) => ({
    uri: p.uri,
    cid: p.cid,
    author: p.author.handle,
    text: p.record.text.substring(0, 120),
    likes: p.likeCount || 0,
    reposts: p.repostCount || 0,
    replies: p.replyCount || 0,
    createdAt: p.record.createdAt,
  }));

  results.forEach((r, i) => {
    console.log(`\n[${i + 1}] @${r.author} (❤️${r.likes} 🔁${r.reposts} 💬${r.replies})`);
    console.log(`    ${r.text}${r.text.length >= 120 ? '...' : ''}`);
    console.log(`    URI: ${r.uri}`);
    console.log(`    CID: ${r.cid}`);
  });

  // Output JSON for agent to parse
  console.log('\n---JSON---');
  console.log(JSON.stringify(results));

  return results;
}

async function cmdLike(uri, cid) {
  const session = await getSession();

  const res = await fetch(`${API}/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.like',
      record: {
        $type: 'app.bsky.feed.like',
        subject: { uri, cid },
        createdAt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) throw new Error(`Like failed: ${await res.text()}`);
  console.log(`❤️  Liked: ${uri}`);
}

async function cmdFollow(handle) {
  const session = await getSession();

  // Resolve handle to DID
  const resolveRes = await fetch(`${PUBLIC_API}/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`, {
    headers: authHeaders(session),
  });

  if (!resolveRes.ok) throw new Error(`Could not find user: ${handle}`);
  const profile = await resolveRes.json();

  // Check if already following
  if (profile.viewer && profile.viewer.following) {
    console.log(`⏭️  Already following @${handle}`);
    return;
  }

  const res = await fetch(`${API}/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: authHeaders(session),
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.graph.follow',
      record: {
        $type: 'app.bsky.graph.follow',
        subject: profile.did,
        createdAt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) throw new Error(`Follow failed: ${await res.text()}`);
  console.log(`✅ Followed @${handle} (${profile.displayName || handle})`);
}

async function cmdFindPeople(query, limit = 10) {
  const session = await getSession();
  const params = new URLSearchParams({ q: query, limit: String(limit) });

  const res = await fetch(`${API}/app.bsky.actor.searchActors?${params}`, {
    headers: authHeaders(session),
  });

  if (!res.ok) throw new Error(`Search failed: ${await res.text()}`);
  const data = await res.json();

  if (!data.actors || data.actors.length === 0) {
    console.log('No people found.');
    return [];
  }

  const results = data.actors.map((a) => ({
    handle: a.handle,
    displayName: a.displayName || '',
    description: (a.description || '').substring(0, 100),
    followers: a.followersCount || 0,
    following: a.followsCount || 0,
    posts: a.postsCount || 0,
    alreadyFollowing: !!(a.viewer && a.viewer.following),
  }));

  results.forEach((r, i) => {
    const status = r.alreadyFollowing ? ' [FOLLOWING]' : '';
    console.log(`\n[${i + 1}] @${r.handle}${status} — ${r.displayName}`);
    console.log(`    ${r.description}${r.description.length >= 100 ? '...' : ''}`);
    console.log(`    Followers: ${r.followers} | Posts: ${r.posts}`);
  });

  console.log('\n---JSON---');
  console.log(JSON.stringify(results));

  return results;
}

// ── CLI Router ───────────────────────────────────────────

const command = process.argv[2];

const commands = {
  post: () => cmdPost(process.argv[3], process.argv[4]),
  search: () => cmdSearch(process.argv[3], parseInt(process.argv[4]) || 10),
  like: () => cmdLike(process.argv[3], process.argv[4]),
  follow: () => cmdFollow(process.argv[3]),
  'find-people': () => cmdFindPeople(process.argv[3], parseInt(process.argv[4]) || 10),
};

if (!command || !commands[command]) {
  console.log(`Wendygo Bluesky Tools

Commands:
  post "text" ["url"]         Post to Bluesky (optional URL embed)
  search "query" [limit]      Search posts by keyword
  like <uri> <cid>            Like a post
  follow <handle>             Follow a user
  find-people "query" [limit] Search for users
  `);
  process.exit(0);
}

commands[command]().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
