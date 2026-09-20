# Citation Audit Report: CANTUS (revised)

**File checked:** `CANTUS-Research-Paper-revised.md` · **Style:** IEEE (numbered, order of first appearance) · **Date:** 18 September 2026
**Method:** each in-text citation was cross-checked against the reference list, and every reference's metadata was verified live against Crossref (via DOI or a title search) and the arXiv API (title, authors, date, and the venue given in the paper's own arXiv comment field).

## Summary

| Metric | Count |
|---|---|
| Total in-text citations (occurrences) | 208 |
| Total reference list entries | 49 |
| Orphan in-text citations (no reference) | 0 |
| Orphan references (never cited) | 0 |
| References that could not be verified to exist | **0**: all 49 matched a Crossref or arXiv record |
| Order-of-appearance violations (IEEE) | 37 references out of order → **auto-corrected** (renumbered) |
| Format/metadata errors (auto-corrected) | 14 |
| Items flagged for review | 7 |
| References with neither DOI nor arXiv ID | 4 ([20], [24], [29], [46]); none has a DOI registered in Crossref |
| arXiv-only references | 26 (acceptable in IEEE; published versions checked, see correction 9) |
| Self-citation ratio | 0% |
| Sources from the last 5 years (2021–2026) | 37 / 49 (76%) |

## Corrections made

### A. Renumbering (IEEE order of first appearance)

The references added during revision ([41]–[49] in the previous numbering) are cited earlier in the text than [13]–[40], which breaks IEEE's rule that references are numbered in order of first citation. All in-text citations, the reference list, the notes block and **`screening-log.md`** were renumbered. Citation ranges were rebuilt after renumbering; for example, "[25]–[28], [46], [49]" in §IV-D became "[28], [33]–[37]".

**Old → new numbers (only changed ones).** Use this to renumber the docx.

| Old | New | Work | | Old | New | Work |
|---|---|---|---|---|---|---|
| 47 | 13 | MuseTok | | 27 | 35 | Interval-based tokenization |
| 48 | 14 | DadaGP | | 49 | 36 | Token Granularity |
| 13 | 15 | Museformer | | 28 | 37 | How Far Should Tokenization Go? |
| 14 | 16 | MMM | | 29 | 38 | Yang & Lerch |
| 15 | 17 | Multitrack Music Transformer | | 30 | 39 | SyMuRBench |
| 16 | 18 | REMI-z | | 31 | 40 | Armor |
| 17 | 19 | Symphony PILM | | 32 | 41 | Perception study |
| 18 | 20 | PianoTree VAE | | 33 | 42 | MIDI-to-score |
| 43 | 21 | TonicNet | | 34 | 43 | U-MusT |
| 41 | 22 | DeepBach | | 35 | 44 | Polymeter (Distler) |
| 42 | 23 | Coconet | | 36 | 45 | Pentatonic-Net |
| 44 | 24 | BachBot | | 37 | 46 | Raffel thesis |
| 19 | 25 | MuPT | | 38 | 47 | Whole-song diffusion |
| 20 | 26 | MetaScore | | 39 | 48 | Contig mapping |
| 45 | 27 | Libretto | | 40 | 49 | Voice separation link prediction |
| 46 | 28 | Agogic | | | | |
| 21 | 29 | MidiTok | | | | |
| 22 | 30 | BPE for symbolic music | | | | |
| 23 | 31 | Subword tokenization | | | | |
| 24 | 32 | BPE mono vs polyphonic | | | | |
| 25 | 33 | Time/duration tokenizations | | | | |
| 26 | 34 | Pitch/grid encodings | | | | |

[1]–[12] are unchanged. Table II rows were re-sorted by the new numbers.

> `CANTUS-REVISIONS.md` still uses the **old** numbering. Treat it as a historical record; the revised paper is now the source of truth.

### B. Reference metadata (new numbering)

| # | Ref | Error | Correction |
|---|---|---|---|
| 1 | [2] Oore et al. | No pages or DOI; cited only as arXiv although the journal version exists | Added pp. 955–967 and doi: 10.1007/s00521-018-3758-9 (replaces the arXiv ID) |
| 2 | [5] Pop Music Transformer | Missing pages | Added pp. 1180–1188 (Crossref) |
| 3 | [7] MusicBERT | Missing DOI | Added doi: 10.18653/v1/2021.findings-acl.70 |
| 4 | [9] Nested Music Transformer | Cited as arXiv preprint, but accepted at ISMIR 2024 (arXiv comment) | Changed to *Proc. 25th ISMIR*, 2024 |
| 5 | [17] Multitrack Music Transformer | Missing pages and DOI | Added pp. 1–5 and doi: 10.1109/ICASSP49357.2023.10094628 |
| 6 | [29] MidiTok | arXiv:2310.17202 is a 2023 "updated report", not the 2021 late-breaking demo being cited | Replaced with the archive URL of the original 2021 LBD paper |
| 7 | [38] Yang & Lerch | Missing issue number | Added no. 9 |
| 8 | [39] SyMuRBench | Incomplete workshop name; missing pages | Full title "…: New Methods and Practice"; pp. 138–146 |
| 9 | [40] Armor | Missing pages | Added pp. 5583–5590 |
| 10 | [41] Perception study | Missing pages | Added pp. 304–314 |
| 11 | [44] Polymeter (Distler) | Missing pages | Added pp. 47–55 |
| 12 | [22] DeepBach | Missing pages | Added pp. 1362–1371 (PMLR 70) |
| 13 | [21] TonicNet | No DOI | Added doi: 10.5281/zenodo.4245396 (ISMIR/Zenodo), replacing the arXiv ID |
| 14 | [13] MuseTok | Missing pages | Added pp. 3956–3960 |

## Items flagged for review

| # | Location | Issue | Suggested action |
|---|---|---|---|
| 1 | **The docx** | All numbers from [13] onward changed | Renumber the docx using the mapping table above, or regenerate it from the revised .md |
| 2 | [14] DadaGP | The venue (ISMIR 2021) isn't stated in the arXiv record, so it couldn't be machine-verified | Confirm on the ISMIR 2021 proceedings page |
| 3 | [34] Li, Li & Fazekas | The arXiv title reads "**An** Comparative Analysis…"; the paper cites it as "A Comparative…" | Keep the corrected article, which is standard for obvious typos, or match the source exactly if your marker is strict |
| 4 | [11] PerTok, in §IV-B | Claim-level check: "Event encodings lack a metrical anchor [11]". The citation exists, but whether PerTok says this is unverified | Check the source or cut the clause (still marked `[VERIFY]` in the text) |
| 5 | [30], [33] in G1 | Claim-level check: these are cited as evidence that the tokenizers carry no voice field | Confirm both describe their tokenization (still marked `[VERIFY]`) |
| 6 | Journal names | IEEE style usually abbreviates journal names (e.g. *Neural Comput. Appl.*, *ACM Comput. Surv.*); the paper uses full names consistently | Optional. Consistent full names are acceptable for coursework; check whether your module specifies |
| 7 | [48] Chew & Wu (2005) | Older than 10 years | Keep: it's the foundational voice-separation method that Layer 2 depends on |

**No problems found:**
- No retracted sources.
- Author lists match the records (IEEE "et al." is used correctly for [4], [20], [28] and [43]).
- All years match the published versions. [38]'s online-first date is 2018, but it correctly uses the 2020 volume year.
- Every 2026 reference ([12], [13], [27], [28], [36], [37], [43]–[45]) resolves to a real record whose title and authors match.
- The four references without a DOI ([20] PianoTree VAE, [24] BachBot, [29] MidiTok LBD and [46] Raffel's thesis) are ISMIR papers or a dissertation with no Crossref DOI, which is acceptable.
