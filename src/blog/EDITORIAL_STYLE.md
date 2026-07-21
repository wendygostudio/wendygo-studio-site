# Blog editorial style

Structured articles should feel scannable without becoming a collection of decorative boxes. Use visual components to clarify decisions, steps and takeaways.

## Minimum rhythm

For a typical 600–900 word article, use at least three of these where the content supports them:

1. A Markdown blockquote for one important warning or takeaway.
2. A short list or comparison table.
3. One reusable card (`step-card` or `key-points`).
4. Product/tool cards for comparisons.
5. A decision grid when readers must choose between options.

Do not place two highlighted boxes back-to-back. Keep normal paragraphs between components.

## Highlight

```markdown
> **Key takeaway**
> The useful conclusion in one or two sentences.
```

## Step card

```html
<div class="step-card">
  <span class="step-label">Step 1</span>
  <strong>Preserve the original evidence</strong>
  <p>Keep the explanation short and actionable.</p>
</div>
```

Use localized labels (`Paso`, `Advertencia`, `En resumen`) in Spanish articles.

## Key-points card

```html
<div class="key-points">
  <h3>Before you continue</h3>
  <ul>
    <li>First useful check</li>
    <li>Second useful check</li>
    <li>Third useful check</li>
  </ul>
</div>
```

## Comparisons

Use ordinary Markdown tables. Use `.tool-card`, `.decision-grid` and related classes already defined in `article.css` only when the article genuinely compares tools or choices.

## Avoid

- Decorative callouts that repeat the paragraph immediately above them.
- More than one highlighted component every 150–200 words.
- Emoji as the primary visual system.
- Large raw-HTML sections that make the Markdown difficult to edit.
