# Security Policy

## Supported versions

The latest published minor version receives fixes.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.
Use GitHub's private vulnerability reporting (Security ▸ Report a vulnerability)
or email the maintainer. You'll get an acknowledgement within a few days.

## Scope notes

This package has **zero runtime dependencies** and performs only string parsing
and in-memory lookups — it makes no network calls and reads no files at runtime.
The main "data integrity" concern is the accuracy of the bundled BCEAO registry;
report inaccuracies via the *Data correction* issue template, not as a security
report.
