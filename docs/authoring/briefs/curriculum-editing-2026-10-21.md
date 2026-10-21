# Approved curriculum revision — 21 October 2026

Scope: local website preparation and a content-only workshop-slide refinement prompt. User approval is still required before publishing. Preserve the concurrently authored orientation material; it is separate from the 16 numbered teaching sessions.

## Approved changes

- Keep Weeks 1–6 in order. Make the existing first-movie Filmora section explicitly Editing Essentials, with a checked finished export as the immediate outcome. Repeat basic editing in later projects; do not imply students must wait for Week 7.
- Session 13 / Week 7 Day 1: Advanced Editing: Finish Your Film, 15 November 2026, 20:00–22:00 IST.
- Session 14 / Week 7 Day 2: Advanced VFX, 21 November 2026, 20:00–22:00 IST.
- Session 15 / Week 8 Day 1: Automobile Advertisement Production, 22 November 2026, 20:00–22:00 IST.
- Session 16 / Week 8 Day 2: Portfolio Website & Final Showcase, 28 November 2026, 20:00–22:00 IST.
- Existing lesson IDs, routes, canonical homework URLs, full source prompts and saved checkpoint identities remain stable. Dates and labels move together for the three existing final lessons.
- Add eight weekly outcome summaries, the early-to-advanced editing progression, an automobile-to-portfolio handoff and final showcase guidance.

## Deferred instructor material

The user will supply the Advanced Editing lesson details and homework later. It is registered as a material-pending slot, not an authored teaching page or an official assignment. No invented teaching transcript, official prompt or homework link is exposed. Its internal compatibility ID is `week-7-day-3`; the visible identity is Session 13 / Week 7 Day 1. The existing `week-7-day-1` ID belongs to AI Twin and must not be reused.

A preliminary native homework draft was created before the user clarified this deferral. It is titled “DRAFT — Week 7 Day 1 — Advanced Editing — Awaiting Instructor Material”, ID `1WOsuhyEskgBrklSPMXyS8lxzRA4FAKsfBWpxxn814sU`, and was moved to the established homework folder. It is not registered as the official assignment or linked from student pages. No sharing was changed. Native text was read back; final native layout and controls are not approved.

Existing Google Docs were not edited by this curriculum revision. The earlier renumbering had already been applied, but the new Week 7–8 labels still need reconciliation with the three existing Docs. Detailed new homework instructions remain deferred.

## Verification evidence

- Build initially passed for 49 authored pages and 16 registered teaching slots; the separate orientation integration subsequently adds its own pages and registration.
- `qa:numbering` now checks the explicit approved dates, eight pairs of numbered lessons, stable lesson routes/Docs, exact official prompts, existing checkpoint identities and four viewport widths. Passed with the separate orientation registration preserved.
- Owner-review check passed for all 49 then-authored pages; ordinary future access remained locked.
- Fixes check passed for saved progress, shared resource checks, exact copying, quizzes, narrow layouts and avatar tips before the concurrent orientation registration.
- Content review passed: 294 viewport captures, accessible field names, legacy progress restoration and 56 exact source prompt comparisons before the concurrent orientation registration.
- Reviewed the new curriculum panel screenshots at 320, 390, 820 and 1440 pixels.
- The broad cohesion check exposed an unrelated non-square orientation hero avatar while the orientation material was being authored in the same checkout. Do not count that run as a full-site pass.
- Focused visual and release-boundary checks are recorded separately as they complete. The initial full visual run was interrupted in favour of the affected pages; do not claim all 209 tests passed.
- `qa:generated` compares the working copy against Git, so it intentionally fails on these uncommitted edits. It is not evidence of a non-reproducible build. No commit was made to satisfy that check.

## Handoff

Latest checks: the combined build passed for 52 pages / orientation plus 16 numbered slots, and a second build changed no tracked or untracked source/output hashes. Curriculum QA passed again with orientation present. All 45 timed authored routes passed the release-boundary, countdown, auto-unlock and guarded-homework checks. Focused visual review completed for the 40 affected page/viewport cases: 39 passed on the first attempt; the 320-pixel homepage exceeded its first timeout and passed its retry. A subsequent full owner-review run failed its review-access flag assertion on `sessions/week-3-day-2/index.html` while concurrent orientation changes were present; the earlier 49-page run passed. This latest full owner-review run is not a pass and must be resolved before live release. The first cohesion run's lazy-avatar check was corrected to wait for the visibility observer; its next failure concerned the separately authored orientation hero's non-square dimensions. No full-site cohesion pass is claimed for this combined working copy.

The new orientation supporting resources exposed a shared resource-card ID collision. The decorator now avoids reusing an already assigned ID within a build, retaining existing IDs where possible; the build's duplicate-ID check passes and a repeat build is stable.

Local review: http://127.0.0.1:8781/__review__/index.html#sessions

Content-only slide prompt and Zoom-session CSV are saved in the current task's outputs directory. Neither creates slides nor changes the source PDF. No push, merge or deployment was performed.
