#!/usr/bin/env node
// Bluesky CLI tools for Wendygo Studio daily content routine.
// Commands: post, search, like, find-people, follow
// Requires: BLUESKY_HANDLE and BLUESKY_APP_PASSWORD env vars

const https = require('https');

const HANDLE = process.env.BLUESKY_HANDLE;
const PASSWORD = process.env.BLUESKY_APP_PASSWORD;
const PDS = 'https://bsky.social';

function request(method, url, body, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function login() {
  const res = await request('POST', `${PDS}/xrpc/com.atproto.server.createSession`, {
    identifier: HANDLE,
    password: PASSWORD,
  });
  if (res.status !== 200) throw new Error(`Login failed: ${JSON.stringify(res.body)}`);
  return res.body; // { accessJwt, did, handle }
}

function findUrlByteRange(text, url) {
  const textBuf = Buffer.from(text, 'utf8');
  const urlBuf = Buffer.from(url, 'utf8');
  const idx = textBuf.indexOf(urlBuf);
  if (idx === -1) return null;
  return { byteStart: idx, byteEnd: idx + urlBuf.length };
}

async function post(text, url) {
  const session = await login();

  let fullText = text;
  if (url && !fullText.includes(url)) {
    fullText = `${text}\n${url}`;
  }

  if (fullText.length > 300) {
    throw new Error(`Post exceeds 300 chars (${fullText.length})`);
  }

  const record = {
    $type: 'app.bsky.feed.post',
    text: fullText,
    createdAt: new Date().toISOString(),
    langs: ['en'],
  };

  const linkUrl = url || (fullText.match(/https?:\/\/\S+/) || [])[0];
  if (linkUrl) {
    const range = findUrlByteRange(fullText, linkUrl);
    if (range) {
      record.facets = [{
        $type: 'app.bsky.richtext.facet',
        index: { $type: 'app.bsky.richtext.facet#byteSlice', ...range },
        features: [{ $type: 'app.bsky.richtext.facet#link', uri: linkUrl }],
      }];
    }
  }

  const res = await request('POST', `${PDS}/xrpc/com.atproto.repo.createRecord`, {
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record,
  }, session.accessJwt);

  if (res.status !== 200) throw new Error(`Post failed: ${JSON.stringify(res.body)}`);
  console.log(`Posted: ${res.body.uri}`);
}

async function search(query, limit) {
  const session = await login();
  const url = `${PDS}/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await request('GET', url, null, session.accessJwt);
  if (res.status !== 200) throw new Error(`Search failed: ${JSON.stringify(res.body)}`);

  const posts = res.body.posts || [];
  if (posts.length === 0) {
    console.log('No posts found.');
    return;
  }
  posts.forEach((p, i) => {
    const text = (p.record && p.record.text) ? p.record.text.replace(/\n/g, ' ').slice(0, 120) : '';
    console.log(`\n[${i + 1}] @${p.author.handle}`);
    console.log(`  Text: ${text}`);
    console.log(`  URI:  ${p.uri}`);
    console.log(`  CID:  ${p.cid}`);
    console.log(`  Likes: ${p.likeCount || 0}  Reposts: ${p.repostCount || 0}`);
  });
}

async function like(uri, cid) {
  const session = await login();
  const res = await request('POST', `${PDS}/xrpc/com.atproto.repo.createRecord`, {
    repo: session.did,
    collection: 'app.bsky.feed.like',
    record: {
      $type: 'app.bsky.feed.like',
      subject: { uri, cid },
      createdAt: new Date().toISOString(),
    },
  }, session.accessJwt);
  if (res.status !== 200) throw new Error(`Like failed: ${JSON.stringify(res.body)}`);
  console.log(`Liked: ${uri}`);
}

async function findPeople(query, limit) {
  const session = await login();
  const url = `${PDS}/xrpc/app.bsky.actor.searchActors?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await request('GET', url, null, session.accessJwt);
  if (res.status !== 200) throw new Error(`Find people failed: ${JSON.stringify(res.body)}`);

  const actors = res.body.actors || [];
  if (actors.length === 0) {
    console.log('No people found.');
    return;
  }
  actors.forEach((a, i) => {
    const bio = (a.description || '').replace(/\n/g, ' ').slice(0, 100);
    const already = a.viewer && a.viewer.following ? ' [already following]' : '';
    console.log(`\n[${i + 1}] @${a.handle}${already}`);
    console.log(`  Display: ${a.displayName || '(none)'}`);
    console.log(`  Bio: ${bio}`);
    console.log(`  Followers: ${a.followersCount || 0}  Posts: ${a.postsCount || 0}`);
  });
}

async function follow(handle) {
  const session = await login();

  const profileRes = await request('GET',
    `${PDS}/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
    null, session.accessJwt);
  if (profileRes.status !== 200) throw new Error(`Profile not found: ${handle}`);
  const did = profileRes.body.did;

  const res = await request('POST', `${PDS}/xrpc/com.atproto.repo.createRecord`, {
    repo: session.did,
    collection: 'app.bsky.graph.follow',
    record: {
      $type: 'app.bsky.graph.follow',
      subject: did,
      createdAt: new Date().toISOString(),
    },
  }, session.accessJwt);
  if (res.status !== 200) throw new Error(`Follow failed: ${JSON.stringify(res.body)}`);
  console.log(`Following: @${handle} (${did})`);
}

// CLI dispatch
const [,, command, ...args] = process.argv;

if (!HANDLE || !PASSWORD) {
  console.error('Error: BLUESKY_HANDLE and BLUESKY_APP_PASSWORD env vars are required');
  process.exit(1);
}

switch (command) {
  case 'post':
    post(args[0], args[1]).catch(e => { console.error(e.message); process.exit(1); });
    break;
  case 'search':
    search(args[0], parseInt(args[1], 10) || 10).catch(e => { console.error(e.message); process.exit(1); });
    break;
  case 'like':
    like(args[0], args[1]).catch(e => { console.error(e.message); process.exit(1); });
    break;
  case 'find-people':
    findPeople(args[0], parseInt(args[1], 10) || 10).catch(e => { console.error(e.message); process.exit(1); });
    break;
  case 'follow':
    follow(args[0]).catch(e => { console.error(e.message); process.exit(1); });
    break;
  default:
    console.error(`Unknown command: ${command || '(none)'}`);
    console.error('Usage: node bluesky-tools.js <post|search|like|find-people|follow> [args...]');
    process.exit(1);
}
