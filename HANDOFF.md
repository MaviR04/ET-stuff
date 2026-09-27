# HANDOFF: CANTUS paper revision

Last updated 21 September 2026. Covers the chat that ran from 15 to 18 September 2026.

## What this is

The user is a student at APIIT School of Computing, Colombo. The paper is **their first**, written for a **module assignment** (not a journal submission). Title: *Voice-Aware Tokenization for Symbolic Music Generation: A Systematic Review and Proposed Representation Framework*. It is a PRISMA 2020 systematic review plus a proposal, **CANTUS**: a voice-aware tokenization framework.

- **AI use is fully allowed** by the module, including writing text directly.
- **Target format:** IEEE conference style. The user sets up the two-column layout in Word themselves.
- **Scope is coursework.** Items judged over-proportionate for coursework were deliberately dropped (see "Decisions").

## Files: which one is the source of truth

| File | Role |
|---|---|
| `CANTUS-Research-Paper-revised.md` | **Source of truth.** Full revised paper with all edits and citation fixes applied. |
| `CANTUS-Research-Paper-revised.docx` | IEEE-template Word version, generated from the revised .md by `tools/md2ieee.py`. Single column; figures not embedded. |
| `tools/md2ieee.py` | Converter from .md to .docx. Reuses the styles of `CANTUS-Research-Paper.docx` (IEEE conference template: `papertitle`, `Author`, `Abstract`, `Keywords`, `Heading1–3`, `BodyText`, `tablehead`, `figurecaption`, `references`). |
| `CANTUS-Research-Paper.md` / `.docx` | **Original** pre-review versions. Keep the .docx: it is the style template the converter reads. |
| `screening-log.md` | PRISMA log. Updated with the revision pass, per-record decisions for 37 re-screened records, the final 28 included studies, and **new reference numbering**. |
| `CANTUS-Review-Report.md` | Simulated 5-reviewer peer review (outcome: Major Revision). |
| `CANTUS-REVISIONS.md` | Edit-by-edit revision instructions (E1–E14). **Historical: uses OLD reference numbers.** Don't paste from it any more. |
| `CANTUS-Citation-Report.md` | IEEE citation audit, including the **old → new reference number mapping**. |
| `rescreening-sheet.md` | Working sheet: abstracts for the 37 re-screened records (decisions now live in the screening log). |
| `acm.bib`, `IEEE Xplore Citation Plain Text Download 2026.9.12.22.35.40.txt`, `arxiv/*.html` | Raw search exports (all saved 12 September 2026). There is **no ISMIR export**. |

Rebuild the docx after editing the .md:

```bash
python tools/md2ieee.py
```

## What was done (in order)

1. **Simulated peer review** (academic-paper-reviewer skill, full mode): Major Revision. The critical issue was that the headline claims ("no representation encodes voice", "no study orders by voice") rested on searches that contained no voice, chorale or counterpoint terms.
2. **Prior art verified from the papers themselves.** Music Transformer serialized JSB Chorales S-A-T-B; DeepBach uses per-voice sequences; Coconet uses one channel per voice; TonicNet puts a chord token before S, B, A, T; BachBot orders by *descending pitch*, not voice. All assume **exactly four fixed voices**.
3. **Socratic revision coaching.** The user reframed the contribution as *handling variable voice counts (voices entering and dropping out: piano, fugues)*, which is what the CANTUS voice-state flag provides and fixed-voice models lack.
4. **Revision plan scoped to coursework**, then edits E1–E14 written up.
5. **Search fixes.**
   - The 9 missing arXiv records were retrieved: the query was re-run with the date fixed to 2026-09-12, giving the same 59 results.
   - The window was extended to **12 September 2026** (the actual search date).
   - All 2026 records were re-screened (37 in total).
   - The final criteria were re-applied to all full texts.
6. **Included set changed from 25 to 28.**
   - Removed: PianoTree VAE (not Transformer-based) and MidiTok (a library; now cited as a tool).
   - Added: Libretto, Agogic, MuseTok, DadaGP, Token Granularity Matters.
7. **Revised paper assembled** as `CANTUS-Research-Paper-revised.md`.
8. **IEEE citation check.**
   - All 49 references (50 after the WTC edition was added) were verified against Crossref and arXiv; none is fabricated or orphaned.
   - Renumbered to IEEE order of first appearance.
   - 14 metadata fixes: DOIs, pages, the Nested Music Transformer's ISMIR 2024 venue, and MidiTok cited as its 2021 LBD paper.
9. Table II's Quality and Licence columns were **removed** at the user's request (unnecessary at this level).
10. **All `[VERIFY]` claims were confirmed by the user.** DadaGP's venue (ISMIR 2021) is confirmed. The WTC edition and spot-check size were added (see below).
11. **IEEE .docx generated** from the revised .md.

## Key decisions (and why)

| Decision | Rationale |
|---|---|
| **Lighter search fix** instead of a new database search plus citation chasing | Coursework scope. The gap is disclosed honestly in §VII; the chorale models are cited as prior art, not included studies. |
| G1/G2 narrowed to "**widely used general-purpose tokenizers** (REMI, CP, Octuple, MidiTok)" | Chorale models falsified the universal wording. G2 now names Music Transformer's fixed-four-voice limit and quotes Agogic's ascending-pitch ordering rule as evidence. |
| Voice index = **persistent line ID**, ordered by register at first entry; a voice may hold chords | Fixes the "height-ordinal vs piece-consistent" contradiction; handles piano block chords. |
| Layer 3 **hybrid rule**: contrapuntal measures on single-note voices; for chordal textures only the lowest sounding note (the bass line) is evaluated | Chosen over single-note-only so the piano bass line is not skipped. |
| **Stage 1 pilot:** train on WTC fugues (David Huron's Humdrum \*\*kern edition, [50]), test on *The Art of Fugue*; three arms (voice-blind / fixed-slot / CANTUS); hand-check a **stratified sample of 10 fugues** (BWV 855 two-voice to BWV 849/867 five-voice) | Tests variable voice counts, which chorales cannot. WTC labels are editorial, so the spot-check is needed. |
| Per-RQ inclusion criteria; the mid-screening criterion change is **reported as a deviation** | Justifies the evaluation and format studies under RQ3 and answers the "tuned corpus" critique honestly. |
| [35] Interval-based tokenization and [36] Token Granularity **kept** | Both are comparisons of representations (understanding, not generation); kept together for consistency. |
| Skipped: second rater, quality appendix, Layer 3 statistics, the implicit-voice-probing alternative, extra evaluation literature, deeper cultural section | Out of proportion for coursework. |

## Current numbers (must stay consistent everywhere)

- **PRISMA flow:** 181 identified → 181 retrieved → 13 duplicates → **168 screened** → 18 excluded → **150 full texts** → 122 excluded → **28 included**.
- **Full-text exclusions:** 14 audio-only; 88 non-generative or applying an existing representation; 8 secondary reviews; 7 superseded; 2 on re-application of the final criteria; 3 first excluded on date, then excluded on topic.
- **Stated assumption:** per-record decisions were not logged in the first pass. The 6 old "outside window" exclusions are *assumed* to include Libretto, Agogic and Token Granularity. Totals don't depend on this; only the stage split does. It is disclosed in §VII and in the log.
- **References:** 50, IEEE-numbered in order of first appearance. Sources of the 28 included studies: arXiv 17, ACM 6, IEEE 4, ISMIR 1.

## Open tasks (user side)

1. **In the docx:**
   - Paste Figures 1–3 above their captions. They exist in the user's own working docx, not in the generated file.
   - Update the Fig. 1 diagram to 181 → 181 → 168 → 150 → 28.
2. Replace `[Your Name]` and the email placeholder in the author block.
3. Switch to the IEEE two-column layout: a continuous section break after Index Terms, with the title block in one column.
4. **Optional:** re-run the six ISMIR archive queries for 2026 records. No ISMIR export was saved, so this was never re-checked.
5. **Optional, raised but not agreed:** §VI-B gives Tier 1 (MusicXML/MEI/\*\*kern) "annotation confidence 1.0", which sits slightly at odds with the WTC labels being editorial. Possible wording: "1.0 where voices are composer-given or hand-verified".

## Gotchas for the next session

- **Two numbering schemes exist.** `CANTUS-REVISIONS.md` and the original `CANTUS-Research-Paper.md` use the old reference numbers. The revised .md and .docx, `screening-log.md` and `CANTUS-Citation-Report.md` use the **new** ones. The mapping table is in the citation report.
- **Edit the .md, then rerun the converter.** Don't hand-edit the generated docx if the text may change again; changes would be lost on rebuild.
- **No visual render is possible on this machine:** there's no LibreOffice or Word COM, and pdftoppm is missing. Docx checks have been structural only (the validator passes; all 8 sections, 6 tables, 3 captions and 50 references are present). Ask the user to eyeball it in Word.
- **Tables are sized to one IEEE column (5040 DXA ≈ 3.5″).** Table II (28 rows) may break across a column. That's acceptable, and its header row repeats.
- **Token Granularity Matters [36]** was assessed from its abstract only (ACM paywall).
- **Git:** the folder is now a git repo with one commit (`initial commit`). This session's `tools/` folder and the regenerated docx are **uncommitted**. Don't commit unless the user asks.
