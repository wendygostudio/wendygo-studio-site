---
title: "How to Resize an Image for X (Twitter) Posts in Chrome (1200×675)"
date: 2026-06-27
slug: resize-image-for-x-twitter-post
product: FrameForge
type: how-to
keyword: "how to resize image for x twitter post"
description: "Post images at the correct 1200×675 px without anything getting cropped in the X feed. FrameForge resizes in your browser — no upload, no Photoshop."
---

X renders tweet images at a 2:1 crop in the feed preview. Square photos get the bottom half cut off. Portrait shots get squeezed into an awkward center slice. The fix is simple: post at 1200×675 px (16:9) and nothing gets cropped in either the feed preview or the full-size expanded view.

FrameForge is a Chrome extension that resizes images entirely in your browser. No upload, no account, no waiting for a remote server to process your file.

## X (Twitter) Image Size Requirements

| Format | Dimensions | Aspect ratio |
|--------|------------|--------------|
| Standard post image | 1200×675 px | 16:9 |
| Feed preview crop | ~2:1 center | — |
| Max file size | 5 MB (JPG/PNG) | — |
| Accepted formats | JPG, PNG, WebP, GIF | — |

1200×675 is the sweet spot: it fills the 2:1 preview crop exactly, and the full image is shown without letter-boxing or pillar-boxing when the viewer expands it.

## Why Square and Portrait Images Get Cropped

X applies a center-crop when displaying inline images in the feed. A 1:1 square image becomes a 2:1 slice: the top quarter and bottom quarter disappear. Portrait images (9:16) are cropped even harder — you lose roughly 80% of the image height in the feed preview.

Sizing to 1200×675 eliminates the mismatch. The image is already 16:9, so the 2:1 feed preview just shows the full width at normal height — no unexpected cropping.

## Step-by-Step: Resize for X with FrameForge

1. **Install FrameForge** — install from the Chrome Web Store and pin it to your toolbar.
2. **Open your image** — click the FrameForge icon, then open your file or drag it onto the canvas.
3. **Select the X (Twitter) Post preset** — in the Platform dropdown, select X Post. The canvas locks to 1200×675 px.
4. **Adjust the crop** — drag the crop overlay to center your subject in the 16:9 frame.
5. **Export** — click Export. FrameForge saves the resized image to your Downloads folder.

## Handling Portrait Source Images

Portrait photos (9:16, phone camera default) need the most adjustment to fit a 16:9 frame:

- **Crop to fill (recommended):** The 16:9 frame is filled completely. Excess from the top and bottom is trimmed. Drag the crop overlay to keep the key element in frame.
- **Fit with padding:** The full portrait is visible, with black or colored bars on the left and right. Intentional padding can look deliberate, but bare bars usually look like a mistake.
- **Stretch to fill:** Distorts the image horizontally. Avoid unless distortion is a deliberate stylistic choice.

For landscape source images wider than 16:9 (cinema crop, panoramas), excess is trimmed from the left and right. Same logic: drag the overlay to center the subject.

## The Social Platform Resize Workflow

If you cross-post the same content to multiple platforms on the same day, FrameForge covers all of them from one extension:

| Platform | Target size | Preset |
|----------|-------------|--------|
| X (Twitter) | 1200×675 px | X Post |
| YouTube | 1280×720 px | YouTube Thumbnail |
| Instagram (square) | 1080×1080 px | Instagram Post |
| Twitch panels | 320×160 px | Twitch Panel |

Resize once per platform, export each version in a few clicks — without switching tools or uploading to separate services.

## Frequently Asked Questions

**What is the best image size for an X (Twitter) post?**
1200×675 px at 16:9. This fills the feed preview without cropping and displays at full dimensions when expanded. Keep the file under 5 MB for JPG/PNG.

**Does X crop images in the feed?**
Yes. X applies a center-crop to inline images in the tweet feed, rendering them at roughly 2:1. Images posted at 1200×675 px (16:9) match the feed preview proportions and appear without unexpected cropping.

**Does FrameForge upload images to a server?**
No. FrameForge is a Chrome extension that processes images entirely in your browser. Nothing is sent to any server. No account is required.

**Can I use the same image for X and YouTube?**
YouTube thumbnails are 1280×720 px and X posts are 1200×675 px — both are 16:9, so the composition is identical. FrameForge has presets for both, so you can export two versions from the same source image without re-cropping.

**Is FrameForge free?**
Yes. FrameForge is free to install from the Chrome Web Store. The free version includes platform presets and core resizing. Pro adds text overlay and batch processing.
