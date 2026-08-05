# Daily SEO policy (effective 2026-08-05)

This policy overrides older wording in historical prompts.

## Required editorial output

Every Daily SEO execution must create exactly one new article. The article
must target a differentiated search intent, use a real product and hub, add
at least two verified internal links, and pass the normal rendering,
translation, sitemap, hreflang and validation gates. Existing content work or
internal linking never replaces this article; those actions are additional.

Every execution must also review at least one already-published article with
useful positioning or impressions. Improve the title/description, depth, FAQ,
internal links or freshness only when the evidence supports it, and record the
URL, signal and change in the daily journal.

## Required external review

After validation, always check both DEV.to and Bluesky:

- DEV.to: publish at most one non-duplicate adaptation of the article created
  that day. If the API is unavailable, save the draft and command under
  `seo-agent/pending-publish/` and set `socialDebt: OPEN`.
- Bluesky: publish at most one concise article summary per day. If publication
  is unavailable, perform only prudent organic engagement (1-3 relevant likes
  and up to 1-3 relevant follows) when the API is available; otherwise record
  the exact blocker. Never simulate publication, likes or follows.

The journal must record the article slug, the existing article reviewed, the
DEV.to result, the Bluesky result and any open queues. Translation debt is
checked separately and must remain closed now that all groups with a valid EN
source are complete.
