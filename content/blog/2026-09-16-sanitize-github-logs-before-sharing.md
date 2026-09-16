---
schemaVersion: 1
title: "How to Sanitize GitHub Logs Before Sharing"
description: "A practical checklist for removing tokens, repository URLs and private context from GitHub logs before sharing them with support or an AI tool."
date: 2026-09-16
slug: sanitize-github-logs-before-sharing
locale: en
translationKey: sanitize-github-logs-before-sharing
product: scrubforge
contentType: how-to
primaryKeyword: "sanitize GitHub logs"
relatedPages: /scrubforge/,/blog/sanitize-paloalto-config/,/blog/chrome-extension-permissions-checklist/
sourceUrls: https://docs.github.com/en/code-security/tutorials/remediate-leaked-secrets/remediating-a-leaked-secret,https://docs.github.com/en/actions/reference/security/secrets,https://docs.github.com/en/actions/reference/security/secure-use,https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
faqs:
  - question: "Is deleting a token from a GitHub log enough?"
    answer: "No. Treat an exposed active secret as compromised, revoke or rotate it with the provider, then remove or redact the copy you are sharing."
  - question: "Does GitHub redact every secret in Actions logs?"
    answer: "No. GitHub documents automatic redaction for supported values, but transformed or structured values may not be masked; review logs and register generated sensitive values."
  - question: "What should I remove before sharing a GitHub log?"
    answer: "Remove tokens, authorization headers, private repository URLs, internal hostnames, personal data, and payloads not needed to reproduce the issue."
  - question: "Can I sanitize GitHub logs locally?"
    answer: "Yes. A local text and configuration workflow can reduce upload exposure, but you must manually review the result and handle active secrets separately."
---

# How to Sanitize GitHub Logs Before Sharing

GitHub Actions logs are useful evidence when a build fails, but they can also contain more context than a support engineer or AI assistant needs. A log may include a repository URL, branch name, internal hostname, file path, pull-request title, email address, authorization header, or a token printed by a noisy command.

The safest workflow is to create a copy, remove unnecessary private context, inspect the result, and only then share it. This is a disclosure-reduction step, not a substitute for incident response: if an active secret appears in a log, revoke or rotate it with the provider first.

## What to check before sharing

Use this short inventory on the copied log:

- access tokens, API keys, JWTs, private keys and `Authorization` headers;
- cloud account IDs, private repository URLs, internal hostnames and file paths;
- deployment names, cluster addresses, database names and environment variables;
- email addresses, usernames, issue text or payloads containing personal data;
- generated reports or request bodies that are not needed to reproduce the failure.

Keep the error message, command exit code, relevant tool versions and the smallest input needed to explain the problem. Replacing a value with a stable placeholder such as `<GITHUB_TOKEN>` or `<INTERNAL_HOST>` preserves the shape of the failure without exposing the literal value.

## A safe local workflow

1. Download or copy the log into a temporary local working file. Keep the original in the secure environment where it was produced.
2. Search the copy for `token`, `secret`, `password`, `Authorization`, `BEGIN PRIVATE KEY`, URLs, hostnames and email addresses. Also inspect long opaque strings; not every secret has an obvious name.
3. Replace sensitive values with typed placeholders. Use the same placeholder for repeated values so a reviewer can still follow the sequence.
4. Remove unrelated job steps, request bodies and environment dumps. A shorter log is easier to audit and less likely to reveal context accidentally.
5. Read the final file from top to bottom and check nearby lines, code blocks and attached artifacts. Do not rely only on a regex or a masking feature.
6. Share the sanitized copy through the approved support channel and record which values were removed.

ScrubForge can help with the local text-cleaning pass for a copied log or configuration. It keeps the draft inside the browser tab until you choose to copy the result. Review the output yourself; no automated sanitizer can know which internal identifier is safe for your organization to disclose.

## What GitHub masking does — and does not — guarantee

GitHub's [Secrets reference](https://docs.github.com/en/actions/reference/security/secrets) documents automatic redaction for supported secret values in workflow logs, but masking is not a complete review. Transformed, encoded, split or structured values may not be recognized. GitHub also recommends masking sensitive values that are not stored as GitHub secrets and avoiding commands that print secrets.

If a workflow needs to expose a non-GitHub secret to a log-safe diagnostic, mask that value before any command can print it. Even then, treat the log as potentially sensitive and inspect it before exporting it. A masked log can still disclose repository names, topology, user data or a value reconstructed by a transformation.

## If a secret was already exposed

Stop treating the log as a redaction-only problem. Follow the credential provider's process to revoke or rotate the secret, determine where the log was retained, and review access. Deleting a line from the current view does not remove copies in job artifacts, caches, tickets, chat exports or repository history. If the secret entered Git history, GitHub's [leaked-secret remediation guidance](https://docs.github.com/en/code-security/tutorials/remediate-leaked-secrets/remediating-a-leaked-secret) covers the additional coordination and history-rewrite steps required after revocation.

## Final review checklist

Before pressing send, confirm:

1. Every credential-like value has been removed or replaced.
2. Any exposed active credential has been revoked or rotated.
3. Internal URLs, hostnames and personal data are necessary for the diagnosis.
4. Artifacts, screenshots and pasted commands received the same review as the main log.
5. The sanitized copy still includes the error, versions and reproduction context.

For a related infrastructure example, see [how to sanitize a Palo Alto PAN-OS config before sharing](/blog/sanitize-paloalto-config/). For the browser-side workflow, see [ScrubForge](/scrubforge/).

## Frequently asked questions

### Is deleting a token from a GitHub log enough?

No. Treat an exposed active secret as compromised, revoke or rotate it with the provider, then remove or redact the copy you are sharing.

### Does GitHub redact every secret in Actions logs?

No. Supported values may be masked, but transformed or structured values can escape automatic masking. Review logs and mask generated sensitive values explicitly when needed.

### What should I remove before sharing a GitHub log?

Remove tokens, authorization headers, private repository URLs, internal hostnames, personal data and payloads that are not needed to reproduce the issue.

### Can I sanitize GitHub logs locally?

Yes. A local text and configuration workflow can reduce upload exposure, but manually review the result and handle active secrets separately.
