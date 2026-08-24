---
schemaVersion: 1
title: "X (Twitter) Profile Picture and Header Size Guide"
description: "Prepare an X profile picture and header that stay readable: official dimensions, crop-safe composition and a local Chrome workflow."
date: 2026-08-24
slug: x-twitter-profile-header-image-size
locale: en
translationKey: x-twitter-profile-header-image-size
product: frameforge
contentType: how-to
primaryKeyword: "x twitter profile picture header size"
relatedPages: /frameforge/,/blog/resize-image-for-x-twitter-post/
sourceUrls: https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo,https://help.x.com/en/managing-your-account/how-to-customize-your-profile,https://help.x.com/en/using-x/posting-gifs-and-pictures,https://help.x.com/en/using-x/picture-descriptions
faqs:
  - question: "What size should an X profile picture be?"
    answer: "X recommends 400×400 pixels for a profile image. The file must be no larger than 2 MB, and X lists JPEG, GIF and PNG as supported formats for profile photos."
  - question: "What size should an X header image be?"
    answer: "X recommends 1500×500 pixels. X also warns that display differences can crop about 60 pixels from the top and bottom, so keep logos, faces and text away from those edges."
  - question: "Is this the same as the best size for an X post?"
    answer: "No. A profile image and header have different dimensions from a post image. X's help says standard single-photo ratios between 2:1 and 3:4 can display in full; the companion post guide explains the practical 1200×675 workflow."
  - question: "Can I resize X profile images without uploading them?"
    answer: "Yes. FrameForge can prepare the crop locally in Chrome, so you can choose the focal point and export the file before opening X."
---

An X profile has two image jobs that are easy to mix up: the **profile picture** appears beside your posts, while the **header** (or banner) spans the top of your profile. They need different canvases and different crop decisions.

## Official X dimensions at a glance

| Profile asset | Recommended dimensions | Other limits and caveats |
|---|---:|---|
| Profile picture | 400×400 px | Maximum 2 MB; JPEG, GIF or PNG |
| Header / banner | 1500×500 px | X warns that display differences can crop about 60 px from the top and bottom |

These are X's recommended dimensions, not a promise that every screen will display the same pixels. Treat the outer edge of a header as expendable: put a logo, face or short text block in the central area and preview it at both desktop and narrow widths.

## How to compose a header that survives the crop

Start with the full 3:1 header canvas and keep the important content away from the top and bottom edges. Avoid placing a headline across the far left or right if it must remain visible beside the avatar and profile controls. A simple background with one clear focal point usually survives responsive layouts better than a dense collage.

For a profile picture, work on a square canvas even if the source is a portrait. Keep the face, icon or wordmark near the center because the image is presented as an avatar and can be masked by the interface. Export a crisp square rather than stretching a small crop.

## Resize both assets locally in Chrome

1. **Choose the correct canvas.** Use 400×400 for the profile picture or 1500×500 for the header.
2. **Open the source in FrameForge.** The extension processes the image in the browser, without sending it to a remote resizing service.
3. **Set the focal point.** Crop to fill when the subject must reach the edges; use padding when the whole source must remain visible.
4. **Keep the safe area simple.** Leave breathing room around faces, logos and text, especially on the header's top and bottom edges.
5. **Export and inspect.** Check the exported file at its final size before uploading it to X. A header that looks balanced on a wide monitor can feel tight on a narrow one.

The [FrameForge Chrome extension](/frameforge/) is useful when you need several local exports. The file stays on your device during the resize workflow; still check the live extension permissions before installing any browser tool.

## Profile/header images versus X post images

Do not reuse the 400×400 or 1500×500 canvas for a post. X's current help says that a single photo with a standard aspect ratio between 2:1 and 3:4 can display in full, while file-size and format limits still apply. If you need a repeatable 16:9 post export, see [How to Resize an Image for X Posts in Chrome](/blog/resize-image-for-x-twitter-post/). That guide is about post composition; this one is about the persistent images on your profile.

## Add descriptions to post images too

Profile and header images are part of your public identity, but accessibility also matters when you publish photos in posts. X's help center provides an **Add description** flow for post images and documents a 1,000-character limit. Write a concise description of the useful visual information instead of repeating the caption.

## Frequently asked questions

### What size should an X profile picture be?

X recommends 400×400 pixels. Keep the important content centered, and use a JPEG, GIF or PNG under the stated 2 MB maximum.

### What size should an X header image be?

X recommends 1500×500 pixels. Because X warns that about 60 pixels at the top and bottom can be cropped on some displays, keep essential content inside the central area.

### Is the header size the same as the post size?

No. A header is 1500×500 and a profile picture is 400×400. Post images follow a separate set of aspect-ratio and file rules; use the companion post guide for a 1200×675 export workflow.

### Can FrameForge resize images without uploading them?

FrameForge is designed to process the image locally in Chrome. Verify the current extension listing and permissions before installing, then export the canvas you need.
