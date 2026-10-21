# Content data, Resource Library and release guide

This guide records the current implementation. Read the source before applying a hook, and do not assume a future generator feature already exists.

## 1. Identify the authoring path

| Situation | Procedure |
| --- | --- |
| New, unregistered ID | Complete the verified specification, then use `npm run session:new -- path/to/spec.json` |
| Existing authored lesson | Revise its current pages/data deliberately; the generator refuses overwrites |
| Registered future placeholder with no pages | Preserve its ID, number, stage if assigned, release time and schedule position. The current generator rejects that ID even when no pages exist. Prepare the source brief and homework, then deliberately extend the shared scaffold to populate an empty registered entry before invoking it, if that implementation work is within the authorized task. Otherwise report this specific limitation and deliver the prepared inputs. Do not delete the schedule entry to bypass the check, invent a new session ID, or claim a nonexistent flag works. |

Any generator extension must reuse the shared scaffold, refuse overwriting authored files and preserve existing schedule facts. Changing the registered start time requires an actual user/source instruction.

## 2. Specification and generated files

Fill [templates/SESSION_SPEC.template.json](templates/SESSION_SPEC.template.json) from the current brief. It is intentionally incomplete and must not be run with placeholders.

| Field | Meaning |
| --- | --- |
| `id` | Stable `week-N-day-N` ID |
| `title`, `number`, `objective` | Current lesson identity, session number and one student outcome |
| `start`, `end` | Confirmed ISO timestamps with `+05:30`; end after start when supplied |
| `stage` | One existing production stage: IDEA, BLUEPRINT, CHARACTERS, VISUAL WORLD, STORY, SHOTS, MOTION, EDIT, REVIEW, MOVIE |
| `visual` | Existing topic key: youtube, short, advertisement, story, production |
| `homeworkUrl` | Actual verified official Google Doc URL |
| `steps` | Ordered `{title, instruction, review}` records |
| `homework` | Clearly labelled practice recipes as `{title, prompt}`; `prompt` here means practice instructions, not an invented official generation prompt |
| `tools` | Actual `{name, useCase}` records |
| `prompts` | Only complete supplied `{title, text, source}` records; these populate the session Prompt Vault and Resource Library; use an empty array when none were supplied |
| `checklist` | Observable canonical production review criteria |
| `quiz` | `{question, options, correct, explanation}`; `correct` is a zero-based integer within options |
| `submission` | Supplied destination/instructions, never a guessed group or upload URL |

The generator currently creates the page pair, `lesson-data.js`, `content/<id>.json` and one schedule entry. It defaults `visual` to production, registers the corresponding topic SVG and refuses an existing ID/directory. It does not create a native Google Doc, design a complete cinematic hero or replace source-grounded editorial work.

Runtime lesson data uses `window.BMAI_LESSON` and excludes `start`/`end`; schedule timing stays in `library/schedule.js`. For older playbooks, keep their existing `sessionData.homework` and `sessionData.checklist` current rather than introducing another object.

Avoid accidental source divergence: update the canonical content record, the corresponding runtime data and visible task/checklist wording together. Both website pages and the Homework Doc must agree on actual deliverables and review criteria.

## 3. Resource registration

The Resource Library is generated from session/playbook source and content records.

| Resource | Source format | Destination |
| --- | --- | --- |
| Session reference | Registered, authored session guide | Session resource tab |
| Prompt Vault | `content/<session-id>.json` official prompts plus homework recipes | Locked session Prompt Vault page |
| Tool | Real lesson use; annotate a new tool explicitly | AI Tools tab |
| Full reusable prompt | Complete text in an anchored `pre` element | Full prompt entry with exact source link |
| Practice recipe | Structured `homework[].prompt` | Clearly labelled practice recipe entry |
| Production checklist | Structured `checklist` array | Shared session checklist entry |
| Genuinely missing material | No actual source or authored material yet | Unreleased Content |

Do not place available tools/prompts/checklists in Unreleased Content merely because their layout was not registered. Keep provenance and deduplicate repeated tools and full prompts.

For a new tool, put the unique ID before the attribute and describe its actual role:

```html
<article id="tool-current-use" data-resource-tool="[Actual tool name]">
  <h3>[Actual tool name]</h3>
  <p>[Its concise, specific use in this lesson]</p>
</article>
```

Existing known tools are detected from lesson text. An annotation provides clearer attribution and a source anchor. Keep one consistent tool name so aliases do not create duplicates.

For a full supplied prompt:

```html
<details>
  <summary>[Descriptive prompt title]</summary>
  <pre id="prompt-current-purpose">[Complete escaped official prompt text]</pre>
  <p>Source: [Verified attribution or source link]</p>
</details>
```

The current extractor imports unique `pre` text whose trimmed length is at least 60 characters. A genuine shorter prompt may be imported by marking its `pre` with `data-resource-prompt="true"`; the marker is an explicit registration, not a reason to add incomplete or invented text. Never pad a prompt to pass the threshold. Avoid placing configuration examples, partial snippets or practice recipes in lesson `pre` blocks where they would be misclassified. Use explicit source IDs before generation rather than relying on auto-added IDs whose numbering could change.

Run `npm run resources:build` after lesson content edits, or `npm run build` to rebuild resources and shared bundles together. Never hand-edit the generated `<!-- resources:... -->` blocks in `index.html` or generated `resources/catalog.json`. Inspect the result for correct labels, attribution, deduplication and links.

## 4. Schedule and navigation

- `library/schedule.js` is the single runtime release schedule. Keep the confirmed session/playbook routes, official Doc URL and topic key there.
- Use the same start time for the page pair, official homework navigation and session-specific resources. Do not add dates or hostname bypasses to page scripts.
- Do not add a `homeworkPage` route or a separate HTML worksheet.
- Guides link to playbooks at the beginning and end. Playbooks link to the official Doc at the beginning and submission area. Homepage homework cards link to the relevant playbook `#share`.
- Keep the next scheduled class in both the homepage teaser and Upcoming Sessions. Preserve schedule entries with missing material and label them honestly.
- Website locks do not alter Google Drive sharing permissions. Verify student access independently when authorized.
- Existing deep links and checklist text should remain stable during revisions. If an anchor must change, update all actual inbound references, including generated library sources.

## 5. Local review and release evidence

Start the preview with `npm run preview` from the repository root. If a different port is selected, set `BMAI_BASE_URL` consistently for browser checks.

| Route | Purpose |
| --- | --- |
| `http://127.0.0.1:8766/` | Ordinary preview with scheduled locks |
| `http://127.0.0.1:8766/__review__/` | Local owner review of every authored page, including future lessons |

The preview server derives its review date from the schedule and supplies the override only in its local review namespace. Keep it out of public page scripts and generated bundles. Ordinary preview must still lock future lessons. Google Docs use their own permissions.

For lesson implementation review, use the existing commands at the appropriate stage:

```text
npm run build
npm run qa:cohesion
npm run qa:release
npm run qa:review
npm run qa:visual
npm run qa:fixes
npm run qa:content-review
```

`qa:review` checks the owner review area and ordinary locks. `qa:content-review` covers content captures, input labels, legacy state and full-prompt comparisons. The current existing browser tests contain authored page fixtures: adding a new page requires reviewing relevant test inventories and coverage; an old passing count does not prove a new lesson was exercised. `site:check` and cohesion discover public HTML pages automatically.

Inspect actual screenshots at 320, 390, 820 and 1440 pixels, and exercise the new skill/progress states. Verify clipboard output, keyboard navigation, image decoding, resource anchors, saved-state restoration and the real Homework Doc. Record each check honestly. Do not add/run unrelated tests for documentation-only work.

Local loading times and requested-file totals are not hosted network performance. Remote Actions artifact storage may be full; the workflow keeps uploads opt-in. Local screenshots can still provide evidence without uploading them.

## 6. Handoff and authorization

## Prompt Vault maintenance

Every registered session has a generated `sessions/<session-id>/prompt-vault.html` route in the `promptbook` schedule field. The build derives official prompts from `content/<session-id>.json`, practice recipes from `homework[]`, and a clearly labelled troubleshooting template. Prompt Vault pages use the session's existing `start` value for their release lock, stable prompt anchors, editable bracket fields and one-click copy controls.

Guides and playbooks receive a Prompt Vault link during the build. Each canonical Homework Doc should contain the same session Prompt Vault link near its opening instructions. Run `npm run build` after changing prompts so the pages, schedule, Resource Library and links remain synchronized.

Provide the actual pair of pages, native Google Doc URL, review route, source/data changes, missing facts if any, validation evidence and external access limitations. Preserve originals and unrelated work. Review before changing main or publishing, as required by `AGENTS.md`; use a review branch/draft PR for proposed repository changes when needed.

A pushed source commit is not proof of a live deployment. After an authorized release, check the actual hosted pages and asset versions through the established deployment workflow. Do not switch hosting providers or configure a new public service merely to hide a failed deployment check.

## Student hub and complete review coverage

### Audit improvements (10 October 2026)

Keep prompt display metadata in `content/prompt-metadata.json` or the lesson's explicit prompt fields. An editable field is a named token, not an arbitrary square-bracket region. Structured JSON examples require explicit fields with `format: "json-string"`; multiline fields may use `multiline: true`. The field parser supports named uppercase curly-brace tokens and conservative single-line bracket tokens, and excludes JSON array/object structure. Original templates remain separately copyable. Do not alter the complete official prompt to accommodate a form.

Prompt and resource generation preserve existing identities when their display titles change. Source links return to authored lesson material. Keep the prior manifest and generated source inventory in version control rather than deleting them before a rebuild.

`content/learning-paths.json` owns catch-up preparation and existing guide anchors. `npm run build` validates those anchors and produces `library/learning-paths.js`. The hub offers released lessons; a guide's catch-up path follows the same release as the guide. It supplements the complete playbook and does not reduce assignment requirements. Homework search/results always reach playbook `#share`; scheduled search results must display release status and use the same link guards as authored navigation.

Optional `recording` metadata requires a real HTTPS `url` and `verifiedAccess: true` after student viewing access is checked. An optional `embedUrl` must use a supported HTTPS player host (`www.youtube-nocookie.com`, `player.vimeo.com`, `fast.wistia.net`, or `www.loom.com`). The embedded player loads only after the student chooses to watch. Optional `transcriptUrl` and `chapters: [{title, url}]` must point to actual HTTPS resources. Omit the whole recording object until those inputs exist; do not invent recording URLs, timestamps or viewing-policy claims. Website membership does not grant third-party recording permission automatically.

Run `npm run qa:audit` for source-prompt preservation, original/working copy controls, structured JSON substitution, named research fields, Vault keyboard tabs, dynamic search locks, catch-up links, expanded homework help and storage-failure recovery. `qa:release` pauses its test clock before navigation so release boundaries are independent of machine load, then advances it explicitly for countdown/auto-unlock checks.

CI now checks pull requests, uses `npm ci` with `package-lock.json`, and runs `npm run qa:generated` after building. The generated-output check compares every public HTML page plus manifest, identities, schedule and shared outputs against Git, and rejects untracked generated files. A deliberate uncommitted working revision will fail that Git comparison until its changes are included in an authorized commit. For local review, compare generated-file hashes across two builds; do not commit merely to satisfy the CI comparison.

The hub groups scheduled lessons by week and provides one selected playbook/homework shortcut instead of repeating complete libraries. Future actions display locked status and the schedule-derived start time. Homework continues to route through playbook `#share`.

Generated resources have stable resource IDs, an availability filter, distinct full-prompt/practice-recipe types and version-preserving tool-family filters. Full prompt cards use one disclosure. Known tool source selection prefers the earliest scheduled supporting lesson so an existing resource is not locked by a later reference. Do not manually patch generated blocks.

Use `npm run qa:student` for backup round trips, invalid-file preservation, task-identity migration, resource deep links, exact copying, keyboard menus and expanded 320-pixel layouts. Public-page QA inventories share `scripts/public-pages.cjs`, exclude working artifacts under `tmp/`, and discover authored pages automatically. Cohesion covers 320, 390, 820 and 1440 pixels. Visual fixtures open content in the local review namespace; release tests exercise ordinary preview separately.


### Resource Library card destinations

Owner feedback on 2026-10-11 removes all links from tool cards: the tool name and description are enough. Keep source annotations and release metadata in the source lessons; do not turn the title into a hidden alternative link. Prompt, practice recipe and checklist cards retain one visible Open link to the exact Vault item or source checklist. Preserve stable resource IDs when correcting source attribution. Run `npm run qa:resource-links` against the preview to verify tool cards have zero links, other cards retain exact destinations and expanded cards fit mobile widths.


### Session numbering after Orientation (21 October 2026)

Orientation is a separate, unnumbered entry before Week1. The15 existing teaching sessions are numbered1–15 and labelled Week1 Day1 through Week8 Day1, two per week. `library/schedule.js` owns `week` and `number`; use those fields for display, grouping and search. Existing `id`, route names and storage keys remain compatibility identifiers attached to their original topics. Never derive the displayed week/day from a route or ID. Class start/end and the existing one-hour early `unlock` times stay attached to each topic. Existing Google Docs retain their IDs; titles and internal session labels match the new numbering. Orientation materials and dates must come from the owner’s later template.

For a new lesson, use an unused stable ID and the verified teaching-session number. The shared scaffold derives its display week/day from that number. Do not reuse an occupied old route simply because its name resembles the desired new label.

Run `npm run qa:numbering` for labels, grouping, original links/timing, source prompt preservation, restored progress and the Orientation entry. The review-server navigation labels follow the same teaching-session numbering.
