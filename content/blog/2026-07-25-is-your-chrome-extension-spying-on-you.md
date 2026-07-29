---
schemaVersion: 1
title: "Is Your Chrome Extension Spying on You? A 2026 Checklist"
description: "Google and Microsoft just pulled a trusted extension with 1.6M installs over hidden data collection. Here's how to check if any extension you use is safe."
date: 2026-07-25
slug: is-your-chrome-extension-spying-on-you
locale: en
translationKey: is-your-chrome-extension-spying-on-you
product: slimeforge
contentType: how-to
primaryKeyword: "is my chrome extension spying on me"
relatedPages: /slimeforge/,/blog/pomodoro-timer-chrome-extension/,/blog/offline-pomodoro-timer-chrome/
---

If you use a Chrome or Edge extension to manage your focus, your headers, your passwords, or anything else, the ModHeader takedown is worth five minutes of your time. Not because ModHeader itself was a fringe tool, it had 1.6 million installs and a decade of trust, but because of exactly how it hid what it was doing.

> **What actually happened**
> On July 3, 2026, Microsoft removed ModHeader from the Edge Add-ons store. On July 10, Google followed and pulled it from the Chrome Web Store. Security firm [Stripe OLT](https://thehackernews.com/2026/07/google-and-microsoft-pull-modheader.html) found that the official, cryptographically signed extension contained a complete browsing-history collector: it fingerprinted the device, encrypted the domain of every page visited, and was built to upload the list daily to an external server. The collector had not shipped active, an empty internal allow-list kept it switched off, but populating that list required nothing more than a routine update, no new permissions, no click from the user.

## Why this matters even if you don't use ModHeader

ModHeader is a developer tool for editing HTTP headers, not a productivity extension. But the pattern it revealed applies directly to focus timers, tab managers, and any other extension that asks for broad access:

<div class="key-points">
  <h3>Why automated scans missed it</h3>
  <ul>
    <li><strong>Encryption hid the payload</strong> — a scanner sees ciphertext, not a domain list, so nothing readable ever left the device during testing.</li>
    <li><strong>An empty allow-list gated the upload</strong> — the collection code ran, but the network call it fed into simply never fired, so sandboxes saw no outbound traffic.</li>
    <li><strong>The malicious code was minified into a legitimate, working feature</strong> — the extension still did exactly what it advertised, which is what most manual reviews check for.</li>
  </ul>
</div>

Automated risk checkers rated the extension as low risk, some as high as 95 out of 100. A signed listing with years of good reviews told users it was trustworthy. Neither signal caught it.

## A practical checklist before you trust an extension

<div class="step-card">
  <span class="step-label">How-to</span>
  <strong>Five checks that take under two minutes</strong>
  <p>Open <code>chrome://extensions</code>, click "Details" on anything you rely on daily, and check: does it ask for "Read and change all your data on all websites" when its stated job doesn't need that? Has it changed hands or gone from free to "ad-supported" recently, a pattern security researchers have flagged repeatedly since 2021? Does the developer publish a privacy policy that actually matches what the code needs to do? Has it pushed an update in the last few weeks with no changelog? And, if you can, does the extension work with your network connection off, a genuinely local-only tool will keep functioning; one that phones home won't.</p>
</div>

| Sign of a lower-risk extension | Sign worth investigating |
|---|---|
| Requests only the permissions its stated feature needs | Requests broad host access "just in case" |
| Same ownership and clear changelog over time | Recently changed hands or went ad-supported |
| Works fully offline if its feature doesn't need the network | Makes network calls a purely local feature shouldn't need |
| Open about not collecting browsing data | Vague or missing privacy policy |

Google's own [Chrome Web Store policy](https://developer.chrome.com/docs/webstore/program-policies/policies) already tells developers to request the narrowest permissions a feature needs and bars collecting browsing activity outside a disclosed, user-facing purpose. Starting August 1, 2026, [enforcement of stricter data-collection rules](https://developer.chrome.com/blog/cws-policy-updates-2026) takes effect store-wide, but that's a floor, not a guarantee. It only limits what a compliant extension is *allowed* to do, and ModHeader wasn't disclosing what it built either.

## What "local-only" actually buys you

The core [SlimeForge](/slimeforge/) timer, pet progress and session data run on your device without requiring an account. Its manifest declares `storage`, `alarms`, `scripting` and `activeTab` for the timer and optional page-level features. License activation can contact Creem; optional Gemini Nano features run on-device when supported. This is more precise than claiming that the extension never makes a network request.

If you're evaluating any [focus or pomodoro extension](/blog/pomodoro-timer-chrome-extension/), including an [offline-first one](/blog/offline-pomodoro-timer-chrome/), the permissions tab and the "does it still work with no internet" test tell you more in two minutes than a star rating ever will.

## Frequently asked questions

### How did ModHeader pass Chrome's security scans for years?

The collector was encrypted and gated behind an internal allow-list that shipped empty, so the upload step never ran during scanning. A scanner sees ciphertext and no outbound traffic, which is exactly what a clean extension looks like too. Researchers at Stripe OLT only found it by reading the minified code directly.

### What permissions should a focus or productivity extension actually need?

A focus extension should request only the permissions its disclosed features need. SlimeForge declares `storage`, `alarms`, `scripting` and `activeTab`; optional site access is requested only when the user enables page-level features.

### Is a popular, highly-rated extension automatically safe?

No. ModHeader had 1.6 million installs, a long track record, and automated risk scores as high as 95 out of 100 rated low-risk, and still shipped a working data collector. Install count and star rating measure popularity, not what the code does after an update.

### Does uninstalling a bad extension remove the data it already collected?

Uninstalling removes it from your browser and clears its local storage, but it doesn't undo anything already sent to the developer's servers. If you ever pasted API keys, tokens, or passwords into an extension's fields, rotate them regardless of whether that extension turns out to have been compromised.
