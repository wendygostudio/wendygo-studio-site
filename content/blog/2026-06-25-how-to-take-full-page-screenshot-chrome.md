---
title: "How to Take a Full Page Screenshot in Chrome"
description: "Three ways to capture a full-page screenshot in Chrome — the built-in DevTools method, native shortcuts, and the one-click FrameForge extension for power users."
date: 2026-06-25
keywords:
  - how to take full page screenshot chrome
  - screenshot entire webpage chrome
  - chrome full page screenshot shortcut
  - capture full page chrome without extension
  - full page screenshot chrome extension
type: guide
slug: how-to-take-full-page-screenshot-chrome
---

# How to Take a Full Page Screenshot in Chrome

Chrome has three ways to capture a screenshot of an entire webpage — not just what's
visible on screen, but everything from the top to the bottom of the page.

## Method 1: Chrome DevTools (No Extensions Required)

Chrome ships with a hidden full-page screenshot command buried in DevTools. No install
needed — it just works.

### Steps

1. Open the page you want to capture.
2. Open DevTools: press `F12` (or `Ctrl+Shift+I` on Windows/Linux, `Cmd+Option+I` on Mac).
3. Open the Command Menu: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac).
4. Type **screenshot** in the search box.
5. Select **"Capture full size screenshot"** from the dropdown.
6. Chrome saves the image automatically to your Downloads folder.

### Limitations

- No annotation tools.
- No custom filename or path.
- Requires three separate keyboard shortcuts to access.
- Pages with lazy-loaded images (content that loads as you scroll) may be missing
  sections unless you manually scroll through the whole page first.
- Captures at 1× resolution by default — can look blurry on HiDPI/Retina screens.

**Best for:** Occasional one-off screenshots when you don't want to install anything.

---

## Method 2: Native OS Screenshot Shortcuts (Visible Area Only)

These capture what's visible in the browser window — not the full scrollable page.

| OS      | Shortcut             | Result                           |
|---------|----------------------|----------------------------------|
| Windows | `PrtScn`             | Full screen → clipboard          |
| Windows | `Win + Shift + S`    | Region select → clipboard        |
| Mac     | `Cmd + Shift + 3`    | Full screen → file               |
| Mac     | `Cmd + Shift + 4`    | Region select → file             |

These are useful for UI mockups and quick captures, but they stop at the bottom of the
viewport. Not a solution for long pages.

---

## Method 3: FrameForge Chrome Extension (Fastest Method)

If you take screenshots regularly — for documentation, QA testing, design reviews, or
content creation — the DevTools method gets tedious fast. FrameForge is a Chrome extension
built specifically for this workflow.

### What it adds over DevTools

- **One-click capture** from the toolbar icon.
- **Custom keyboard shortcut** — set it once, use it everywhere.
- **Handles lazy-loaded content** automatically by scrolling the page before stitching.
- **HiDPI-aware** — captures at your screen's native pixel density.
- **Optional annotations** — arrows, highlights, text boxes on top of the screenshot.
- **Custom filename patterns** — e.g., `{domain}-{date}` auto-names each file.
- **PNG or JPEG output** with adjustable quality.

### How to use it

1. Install FrameForge from the Chrome Web Store (link in the CTA below).
2. Navigate to any page.
3. Click the FrameForge icon in the toolbar — or press your custom shortcut.
4. The full page is captured and ready to download, copy to clipboard, or annotate.

---

## Troubleshooting Common Issues

### Screenshot cuts off at the bottom

The page is probably using lazy loading. The DevTools method captures only what's in the
DOM at capture time, so if images load on scroll, they appear as blank space. Fix: use
FrameForge (auto-scrolls before capture), or manually scroll to the bottom and back before
triggering the DevTools command.

### Screenshot looks blurry on a HiDPI screen

DevTools defaults to 1× device pixel ratio. Before running "Capture full size screenshot",
open the Device Toolbar (`Ctrl+Shift+M`), set DPR to **2**, then capture. FrameForge reads
your screen's actual DPR automatically.

### Page renders in mobile layout

Happens when DevTools Device Toolbar (emulation mode) is active. Close the Device Toolbar
before capturing — it was changing the User-Agent and viewport width.

---

## Comparison

|                         | DevTools | OS Shortcut | FrameForge |
|-------------------------|:--------:|:-----------:|:----------:|
| No install required     | ✓        | ✓           |            |
| Full scrollable page    | ✓        |             | ✓          |
| One-click capture       |          |             | ✓          |
| Custom shortcut         |          |             | ✓          |
| Annotation tools        |          |             | ✓          |
| Lazy-load support       | partial  |             | ✓          |
| HiDPI / Retina          |          |             | ✓          |
| Batch capture           |          |             | ✓          |

---

## The Bottom Line

Use the **DevTools method** if you only need a screenshot occasionally and want zero setup.

Use an **OS shortcut** if you only need the visible area.

Use **FrameForge** if you do this regularly, work with long or lazy-loaded pages, or need
annotations and reliable filenames.

---

*Try FrameForge free on the Chrome Web Store — no signup, no account required.*
