# PRISMA Screening Log

Auditable record of study selection for *Voice-Aware Tokenization for Symbolic Music Generation*.

**Search date (all sources):** 12 September 2026. **Window:** January 2018 – 12 September 2026.
**Revision history:** first screening pass, then a revision pass on 18 September 2026. The revision pass retrieved the 9 missing arXiv records, extended the window, re-screened all 2026 records, and re-applied the final criteria to all full texts (see "Revision pass" below).

## Source counts

| Source | Method | Records |
|---|---|---|
| IEEE Xplore | Representation AND Task, All Metadata, plain-text export | 27 |
| ACM Digital Library | Representation AND Task, Anywhere, BibTeX export | 50 |
| arXiv | Six conjunctive advanced-search queries, cs categories (incl. cross-lists) | 81 |
| ISMIR Proceedings Archive | Supplementary indexed web search, six query variants, archive-hosted results only | 23 |
| **Total identified** | | **181** |

### arXiv query breakdown

| Query | Results |
|---|---|
| "symbolic music" AND tokenization | 59 |
| "symbolic music" AND "ABC notation" | 12 |
| "symbolic music" AND "byte pair encoding" | 5 |
| "symbolic music" AND REMI | 3 |
| "symbolic music" AND "compound word" | 1 |
| "polyphonic music" AND tokenization | 1 |
| **Total** | **81** |

**Resolved (revision pass):** results 51–59 of the first query were originally not retrieved. The query was re-run with the end date fixed to the original search date (2026-09-12) and `size=100`. It returned the same 59 results, and all 9 missing records were retrieved and screened (see below).

## PRISMA flow

- Records identified: **181**
- Records retrieved: **181**
- Duplicates removed: **13** (6 within arXiv; 7 arXiv ↔ other sources)
- Unique records screened: **168**
- Excluded at title/abstract: **18** (2 front matter; 16 outside topic scope)
- Full texts assessed: **150**
- Excluded at full text: **122**
  - Audio-domain, no symbolic intermediate: 14
  - Non-generative task, or applies an existing representation without proposing/comparing/evaluating one: 88
  - Secondary review without primary data: 8
  - Superseded by a more complete version of the same work: 7
  - Excluded on re-application of final criteria: 2 ([20] PianoTree VAE, [29] MidiTok)
  - First excluded on date, excluded on topical grounds at re-screening: 3
- **Studies included: 28**

**Changes from the first pass (25 included):**
- +8 unique records from the 9 retrieved (1 duplicate of [19]): 7 excluded, 1 included (DadaGP).
- The "outside window" category (6 records) was removed when the window was extended; those records went to full-text assessment.
- **Assumption:** per-record decisions were not logged in the first pass. The 6 date-excluded records are taken to include Libretto, Agogic and Token Granularity Matters: post-February 2026, on-topic, and with no other recorded exclusion reason. The remaining 3 were excluded on topical grounds. Totals are unaffected by this assumption; only the stage split is.
- MuseTok, previously excluded at full text with no recorded reason, was included on re-application of the final criteria.
- [20] and [29] were excluded on re-application of the final criteria.
- Net: 25 − 2 + 5 = **28**.

### Cross-source duplicates resolved

| Work | Versions | Retained |
|---|---|---|
| Symphony Generation, Permutation Invariant LM | arXiv 2205.05448 / ISMIR 2022 | ISMIR (ref [19]); arXiv copy retrieved in revision pass |
| MidiTok | arXiv 2310.17202 / ISMIR 2021 LBD | ISMIR (ref [29]); now excluded on re-application |
| Unified Cross-modal Translation / U-MusT | arXiv 2505.12863 / IEEE TASLP 2026 | IEEE journal version (ref [43]) |
| MuseTok | arXiv 2510.16273 / IEEE ICASSP 2026 | IEEE version (ref [13]); **included** in revision pass |
| EMelodyGen | arXiv 2309.13259 / IEEE | excluded at full text |
| Event-Based Token Sequences | arXiv 2607.09095 / ACM | excluded (off-topic: music-game levels) |

## Eligibility criteria (final)

**Common:** published January 2018 – 12 September 2026; English; reports primary quantitative, ablation or human-assessment results.

**RQ1/RQ2:** the study's *primary contribution* is a symbolic music representation, a comparison or evaluation of such representations, or a compression scheme operating over them, used with Transformer-based models.

**RQ3 (additionally):** the study's primary contribution is an evaluation methodology for symbolic music generation, or the expressive scope of symbolic notation formats.

The criterion was refined during screening (reported as a protocol deviation in paper §III-C):
1. *Rejected:* "any generative model consuming a symbolic representation". Does not answer RQ1, since nearly every generation paper uses some tokenizer.
2. *Rejected:* "representation as an object of investigation". Did not separate studies *about* representation from studies that *use* one.
3. *Adopted:* "representation as primary contribution", with the RQ3 extension above. Re-applied to all 150 full texts in the revision pass.

---

## Revision pass: per-record re-screening decisions (37 records)

Scope: the 9 newly retrieved arXiv records, plus every 2026 record (and two IEEE records with no year in the export) from the IEEE, ACM and arXiv exports.

| # | Source | ID / DOI | Title | Decision | Reason |
|---|---|---|---|---|---|
| 1 | arXiv (retrieved) | 2210.10349 | Museformer | Exclude (FT) | Applies existing representation (attention contribution); cited as background [15] |
| 2 | arXiv (retrieved) | 2209.07974 | musicaiz | Exclude (FT) | Software library, no representational comparison (consistent with MidiTok) |
| 3 | arXiv (retrieved) | 2208.05162 | Controlling Perceived Emotion with MCTS | Exclude (FT) | Applies existing representation (decoding method) |
| 4 | arXiv (retrieved) | 2207.00760 | Unsupervised Symbolic Music Segmentation | Exclude (FT) | Non-generative |
| 5 | arXiv (retrieved) | 2205.05448 | Symphony Generation (PILM) | Duplicate | Duplicate of included [19] |
| 6 | arXiv (retrieved) | 2203.16165 | Generation conditioned on continuous-valued emotions | Exclude (FT) | Applies existing representation (conditioning) |
| 7 | arXiv (retrieved) | 2111.01216 | Piano Music With Sustain Pedals | Exclude (FT) | Applies existing representation (extends CP with pedal tokens) |
| 8 | arXiv (retrieved) | 2107.14653 | DadaGP | **Include (RQ1/2) [14]** | Token format is a stated primary contribution; Transformer generation |
| 9 | arXiv (retrieved) | 2010.08091 | PiRhDy | Exclude (FT) | Non-generative (embeddings) |
| 10 | arXiv | 2608.30694 | Inferring Value Criteria from Ordinal Preferences | Exclude | Applies existing representation (ABC) |
| 11 | arXiv | 2605.13431 | Text2Score | Exclude | Applies existing representation (generation framework) |
| 12 | arXiv | 2601.21740 | MIDI-LLaMA | Exclude | Non-generative (understanding) |
| 13 | arXiv | 2608.18025 | How Far Should Tokenization Go? | Include (already [37]) | — |
| 14 | arXiv | 2608.03999 | Agogic | **Include (RQ1/2) [28]** | Controlled comparison of seven tokenizations |
| 15 | arXiv | 2607.11124 | BeatEdit | Exclude | Applies existing representation (builds on BEAT) |
| 16 | arXiv | 2607.10003 | ARIMA | Exclude | Non-generative (self-supervised representation learning) |
| 17 | arXiv | 2607.09095 | Event-Based Token Sequences | Exclude | Off-topic (music-game levels) |
| 18 | arXiv | 2606.22708 | Libretto | **Include (RQ1/2) [27]** | New LLM-native grammar with validated round-trip fidelity |
| 19 | arXiv | 2606.05345 | PJ-RoPE | Exclude | Off-topic (general attention positions) |
| 20 | arXiv | 2604.19532 | BEAT | Include (already [12]) | — |
| 21 | arXiv | 2604.10628 | BMdataset / LilyBERT | Exclude | Non-generative (dataset + understanding model) |
| 22 | arXiv | 2604.10283 | Descriptor-Injected Cross-Modal Learning | Exclude | Off-topic (audio–MIDI retrieval) |
| 23 | arXiv | 2604.05343 | Anchored Cyclic Generation | Exclude | Applies existing representation (generation paradigm) |
| 24 | ACM | 10.1145/3816020 | Survey: Video-to-Music Generation | Exclude | Secondary review |
| 25 | ACM | 10.1145/3800682 | Survey: Music Generation, Single/Cross/Multi-Modal | Exclude | Secondary review |
| 26 | ACM | 10.1145/3805622.3810723 | Zero-Effort Image-to-Music Generation | Exclude | Off-topic (image-to-music) |
| 27 | ACM | 10.1145/3813822.3813854 | Token Granularity Matters | **Include (RQ1/2) [36]** | Controlled comparison of encodings (understanding; kept consistent with [35]) |
| 28 | ACM | 10.1145/3805622.3810623 | Event-Based Token Sequences | Duplicate | Duplicate of #17 |
| 29 | ACM | 10.1145/3815723.3815729 | Encoding Polymeter (Distler) | Include (already [44]) | — |
| 30 | ACM | 10.1145/3812539 | Survey and Typology of CAC Systems | Exclude | Secondary review |
| 31 | IEEE | 10.1109/TCSS.2024.3486536 | AE-AMT | Exclude | Applies existing representation (affective generation) |
| 32 | IEEE | 10.1109/ICAIBD69640.2026.11637240 | Pentatonic-Net | Include (already [45]) | — |
| 33 | IEEE | 10.1109/EESPE68405.2026.11648903 | Steerable Rhythmic Complexity | Exclude | Applies existing representation (REMI+ conditioning) |
| 34 | IEEE | 10.1109/ICASSP55912.2026.11463020 | MuseTok | **Include (RQ1/2) [13]** | Proposes a tokenization method for generation (earlier exclusion reversed) |
| 35 | IEEE | 10.1109/ICASSP55912.2026.11460519 | Etude | Exclude | Applies existing representation (REMI-based) |
| 36 | IEEE | 10.1109/TASLPRO.2025.3648794 | U-MusT | Include (already [43]) | — |
| 37 | IEEE | 10.1109/TCSS.2024.3521445 | MusicAOG | Exclude | Not Transformer-based (consistent with PianoTree VAE) |

Screening note: *Token Granularity Matters* was assessed from its abstract and metadata; full text requires institutional access.

---

## INCLUDED STUDIES (28)

| Ref. | Study | Source | Theme |
|---|---|---|---|
| [5] | Pop Music Transformer (REMI) | ACM | Representation frameworks |
| [8] | Compressive Compound Word Encoding | IEEE | Representation frameworks |
| [9] | Nested Music Transformer | arXiv | Representation frameworks |
| [10] | Amadeus: Bidirectional Attribute Modelling | arXiv | Representation frameworks |
| [11] | PerTok: Expressive Encoding | arXiv | Representation frameworks |
| [12] | BEAT: Uniform Temporal Steps | arXiv | Representation frameworks |
| [13] | MuseTok: learned bar-level codes | IEEE | Representation frameworks |
| [14] | DadaGP: tablature token format | arXiv | Representation frameworks |
| [18] | REMI-z / Unifying Symbolic Music Arrangement | arXiv | Multi-track and polyphonic |
| [19] | Symphony Generation, Permutation Invariant LM | ISMIR | Multi-track and polyphonic |
| [25] | MuPT / SMT-ABC | arXiv | Text-native formats |
| [27] | Libretto: LLM-native grammar | arXiv | Text-native formats |
| [30] | Byte Pair Encoding for Symbolic Music | arXiv | Sequence compression |
| [31] | From Words to Music: Subword Tokenization | arXiv | Sequence compression |
| [32] | Analyzing BPE on Monophonic and Polyphonic Music | arXiv | Sequence compression |
| [33] | Impact of Time and Note Duration Tokenizations | arXiv | Comparative studies |
| [34] | Comparative Analysis of Pitch and Metrical Grid Encodings | arXiv | Comparative studies |
| [35] | Evaluating Interval-based Tokenization | arXiv | Comparative studies |
| [37] | How Far Should Tokenization Go? | arXiv | Comparative studies |
| [28] | Agogic: seven-tokenization controlled comparison | arXiv | Comparative studies |
| [36] | Token Granularity Matters | ACM | Comparative studies |
| [39] | SyMuRBench | ACM | Evaluation methodology |
| [40] | Armor: Meta-evaluation of Artificial Music | ACM | Evaluation methodology |
| [41] | How People Perceive AI-generated Music | ACM | Evaluation methodology |
| [42] | Performance-MIDI to Score Conversion | arXiv | Notation-level structure |
| [43] | U-MusT Cross-Modal Translation | IEEE | Notation-level structure |
| [44] | Encoding Polymeter across Symbolic Formats | ACM | Format and cultural scope |
| [45] | Pentatonic-Net (Guqin) | IEEE | Format and cultural scope |

Source distribution: **arXiv 17, ACM 6, IEEE 4, ISMIR 1** (total 28).

**Excluded on re-application of final criteria (cited as background only):** [20] PianoTree VAE (not Transformer-based; learned latent, not a tokenization); [29] MidiTok (software library; no representational comparison; cited as a tool).

## Author actions required

1. Update Fig. 1: 181 → 181 → 13 duplicates → 168 screened → 18 excluded → 150 full texts → 122 excluded → 28 included.
2. Re-run the six ISMIR queries and check for any 2026 records (no export of ISMIR results was saved).
