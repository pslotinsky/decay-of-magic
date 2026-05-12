# DOD-0026: Improve Poe and Zok

| Field     | Value                                                   |
| --------- | ------------------------------------------------------- |
| Status    | Done                                                    |
| Milestone | [Tidy Up II](../milestones/Milestone-006_tidy-up-ii.md) |
| Created   | 2026-05-12                                              |

## Description

The project's two in-house doc tools — Poe (the inspector, [ADR-002](../adr/ADR-002_zok-for-doc.md), extended by [DOD-0014](./DOD-0014_layer-aware-poe-reports.md)) and Zok (the archivist) — have accumulated small ergonomic gaps. Poe's reports are useful but the surface is rough: section headers carry no role information, parameter blocks are dense, the doc-drift assertion in CI lives in a shell `git diff` step, and generated files lack an identity marker. Zok's commands repeat the protocol name even when the document id already carries it.

This task polishes both tools' surface and replaces the CI workaround with a first-class Poe mode.

## Scope

### Poe — report content

- Render the workspace `package.json` description at the top of each generated README. Use it as the anchor for a generated table of contents.
- Split function and method parameters into discrete entries — one per parameter, with type and short description — instead of the current single-line signature dump.
- Link each referenced type to its source at `path:line` (or `path:line:column`) so editors jump to the definition.
- Replace the generic `## Classes` section header. Either omit it when there is only one section in scope, or render the section's role (the same information `LAYER_SPLIT_THRESHOLD` in `PackageReport.ts` already discriminates on).
- Append a footer signature to every generated file: `> This document was inspected and assembled by Inspector Poe.` Marks the file as generated; consistent across packages.

### Poe — CI workflow

- Add a `poe inspect --check` (or `--dry-run`) mode that regenerates output in memory, compares against on-disk files, and exits non-zero with a per-file diff when content differs.
- Replace the `git diff --quiet` step in the `docs` job of `.github/workflows/ci.yml` with `poe inspect --check`. The failure message points to the specific stale README rather than dumping the full repo diff.

### Zok — protocol inference

- Commands that operate on an existing document (`close`, `reopen`, `cancel`, `rename`, `delete`, `move`) currently require both the protocol and the id (`zok close milestone Milestone-006`). The id prefix already identifies the protocol unambiguously.
- Make the protocol argument optional on these commands: `zok close Milestone-006`, `zok rename DOD-0025 "New title"`, `zok move DOD-0025 Milestone-006`. Infer the protocol from the id prefix (`DOD-`, `Milestone-`, `ADR-`, `DevLog-`, `Design-`, …).
- Keep the explicit form working — existing scripts and the documented examples continue to function.
- `create` and `list` are unaffected: they take a protocol _name_, not a document id, so there is nothing to infer.

## Result

Poe-generated READMEs are easier to scan (TOC, structured parameters, role-aware section headers, signed footer) and CI gives precise feedback when documentation drifts. Zok commands match how the documents are referred to in conversation — `zok close Milestone-006` instead of restating the protocol that the id already encodes.
