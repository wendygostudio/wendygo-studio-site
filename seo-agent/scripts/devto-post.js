#!/usr/bin/env node
// ============================================================
// Wendygo Studio — Dev.to Post Script
// ============================================================
// Usage: node devto-post.js "Title" "markdown_content" "tag1,tag2,tag3"
//
// Get your free API key at: https://dev.to/settings/extensions
// Set DEVTO_API_KEY in config/agent.env (NOT the repo root)
// ============================================================

let DEVTO_API_KEY = process.env.DEVTO_API_KEY;

// Fallback: self-load from config/agent.env if the var didn't propagate
if (!DEVTO_API_KEY) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envFile = path.join(__dirname, '..', 'config', 'agent.env');
    const content = fs.readFileSync(envFile, 'utf8');
    const m = content.match(/^DEVTO_API_KEY=["']?([^"'\r\n]+)["']?/m);
    if (m) DEVTO_API_KEY = m[1];
  } catch (e) { /* file not found — fall through to error below */ }
}

if (!DEVTO_API_KEY) {
  console.error('❌ DEVTO_API_KEY not set. Get one free at https://dev.to/settings/extensions');
  process.exit(1);
}

const title = process.argv[2];
const body = process.argv[3];
const tags = process.argv[4] || '';

if (!title || !body) {
  console.error('Usage: node devto-post.js "Title" "markdown_body" "tag1,tag2,tag3"');
  process.exit(1);
}

async function post() {
  const tagList = tags
    .split(',')
    .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 4); // Dev.to allows max 4 tags

  const article = {
    article: {
      title: title,
      body_markdown: body,
      published: true,
      tags: tagList,
      canonical_url: '', // Will be set by the agent if cross-posting
    },
  };

  // Check if canonical_url was passed in the body as a footer link
  const canonicalMatch = body.match(
    /\[wendygostudio\.com\]\((https:\/\/wendygostudio\.com\/[^\)]+)\)/
  );
  if (canonicalMatch) {
    article.article.canonical_url = canonicalMatch[1];
  }

  const res = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': DEVTO_API_KEY,
    },
    body: JSON.stringify(article),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Dev.to post failed (${res.status}): ${err}`);
  }

  const result = await res.json();
  console.log(`🚀 Published on Dev.to!`);
  console.log(`   Title: ${result.title}`);
  console.log(`   URL: ${result.url}`);
  console.log(`   Tags: ${tagList.join(', ')}`);
  if (article.article.canonical_url) {
    console.log(`   Canonical: ${article.article.canonical_url}`);
  }

  return result;
}

post().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
