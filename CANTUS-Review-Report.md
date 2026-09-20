# Simulated Peer Review — "Voice-Aware Tokenization for Symbolic Music Generation: A Systematic Review and Proposed Representation Framework" (CANTUS)

**Mode:** full (5-seat panel + editorial synthesis) · **Date:** 2026-09-15
**Materials examined:** `CANTUS-Research-Paper.md` (manuscript), `screening-log.md` (supplementary PRISMA log). The manuscript was not modified.

**Panel provenance disclosure.** All five seats were produced by one model family (Claude Opus 5) in a single invocation context, with sequential role separation. The seats are personas, not independent reviewers: shared-model, correlated-error risk applies, and agreement between seats should not be read as independent corroboration. No criteria binding to a specific target venue was supplied (`criteria_binding_unavailable`), so venue-fit remarks are general. Calibration status: `NOT_CALIBRATED`. The Phase 0 configuration was not paused for user confirmation; ask for a re-run with adjusted personas if you want different ones.

---

## Phase 0 — Field Analysis and Reviewer Configuration

| Item | Assessment |
|---|---|
| Primary discipline | Music Information Retrieval (symbolic music generation) |
| Secondary disciplines | NLP tokenization; evidence-synthesis methodology; computational musicology |
| Paper type | Hybrid: PRISMA systematic review plus a conceptual framework proposal with no empirical validation |
| Plausible venues | TISMIR (review article), ISMIR (would likely want a pilot result), IEEE Access / IEEE conference (review track), student research conference |
| Maturity | Advanced draft. Figures 1–3 and the author block are still placeholders; equations are embedded as images. |

| Seat | Configured identity |
|---|---|
| Journal-Fit Reviewer (EIC) | Associate editor at TISMIR who handles review articles and cares about whether a review generalizes beyond its own proposal |
| R1 Methodology | Evidence-synthesis methodologist (PRISMA/SLR in software engineering and computing) |
| R2 Domain | Symbolic music generation researcher who has worked on chorale harmonization and tokenizers |
| R3 Perspective | Computational ethnomusicologist / music-AI ethics researcher |
| DA | Devil's Advocate (fixed seat) |

---

## Phase 1 — Reviewer Reports

### 1. Journal-Fit Reviewer (EIC)

**Summary.** The paper argues that tokenizations for Transformer-based symbolic music generation leave out voice (line) identity. It supports this with a 25-study PRISMA review and proposes CANTUS, a four-layer framework: representation, annotation, evaluation and an ablation protocol.

**Strengths**
- The thesis is clear and well framed. The track-versus-voice distinction (§II-C) is sharp and useful.
- The paper is disciplined about scope. It says CANTUS does not address G6 (Table VI) and gives a falsifiable pilot (§VI-F).
- Engaging the Effectiveness–Losslessness objection directly (§VI-G) is unusually self-critical for a proposal paper.
- A supplementary screening log is provided, which is good practice.

**Concerns**
- **Genre tension.** The review is written to motivate the proposal: gaps are framed so that CANTUS fills them. Readers of a review venue will ask whether the gap analysis would survive without the proposal attached. For an empirical venue (ISMIR), an unvalidated framework without even the Stage 1 pilot is hard to place.
- **Headline claims depend on absence-of-evidence.** "No representation supplies voice identity" and "no study measures voice-leading" are only as strong as the search. The methodology and domain seats examine this.
- **Presentation completeness.** Figures 1–3 are missing and the author block is a placeholder. Equations are embedded as base64 images with no text fallback ($O(L^2D)$, $O(LD)$).

**Recommendation signal:** Major Revision.

---

### 2. Reviewer 1 — Methodology (Systematic Review Protocol)

**M1 (Major) — The search strategy cannot support the paper's central absence claims.** §III-A lists a three-block query (Representation AND Task AND Evaluation), and the Evaluation block holds "voice separation" and "voice leading". But Table I and the log show that IEEE and ACM ran only *Representation AND Task*. All six arXiv queries require the phrase "symbolic music" plus a representation term (log, arXiv breakdown). No executed query contains *voice*, *counterpoint*, *chorale*, *voice leading* or *voice separation*. The findings that matter most (G1, G2, G4) are therefore claims about literature the search was not built to retrieve.
*Fix:* Run a supplementary targeted search (for example "voice" OR "chorale" OR "counterpoint" OR "part-writing" AND "generation") plus backward and forward citation chasing from [3], [6], [17] and [18]. Report the results as a separate identification stream in the PRISMA diagram, and scope every absence claim to what was searched.

**M2 (Major) — The date window is applied inconsistently.** §III-A sets the window as January 2018 to February 2026, and the log shows records excluded at title/abstract as "outside window" (for example arXiv 2607.09095). Yet several included studies are dated after February 2026: [12] BEAT (arXiv:2604.19532, April 2026) and [28] (arXiv:2608.18025, August 2026). [28] is one of the four comparative studies and grounds the Token–State argument in §VI-G. [35] and [36] (2026 proceedings) also need date checks.
*Fix:* Either extend the window and re-run every search to the new end date, or move post-window studies into a clearly labelled "additional sources identified outside the search" stream.

**M3 (Major) — The synthesis draws on studies that are not in the included set.** Table II lists 25 included studies. It does not include [2], [3], [6], [7], [13], [14] or [15]. Yet the RQ1 taxonomy (§IV-A: "compound [6]–[10]"), the RQ2 findings ("compound tokens obtain both [6]–[8]"; "[3], [13], [19]"), Table V (evidence "[6], [16], [33]") and G1 ("[6], [7], [16]") all rest partly on them. In a PRISMA review, results must come from the included set. Compound Word [6] (AAAI 2021) appears to meet the eligibility criterion, so its absence from the included set also signals a retrieval gap (see M1).
*Fix:* Either include these studies through a documented stream (citation chasing) or confine them to background and re-derive the Results from included studies only.

**M4 (Major) — The eligibility criterion was changed after screening began and is not applied consistently.** §III-C says the criterion was "refined during screening". The rationale given is that earlier versions retained too many records, which is a selection decision driven by outcome volume. This is a protocol deviation with no pre-registered protocol behind it. The adopted criterion is "primary contribution is a representation, a comparison/evaluation of representations, or a compression scheme". Several included studies do not fit it by the paper's own descriptions:
- [32] listener perception study ("Not representation", Table II)
- [31] Armor metric meta-evaluation ("Metrics, not music")
- [33] performance-MIDI-to-score transcription ("Transcription, not input")
- [36] Pentatonic-Net (a constrained-decoding generation model, which looks like the excluded "application of existing representations")
- [27] (Table II: "Analysis, not generation", against the "non-generative tasks" exclusion)
- [18] PianoTree VAE, which is not Transformer-based even though RQ1 is restricted to Transformers
- [21] MidiTok, a late-breaking demo abstract with "No representational claim". Does it report primary quantitative results?

*Fix:* State the final criterion together with the scope of RQ3, which plausibly justifies the evaluation and cultural-scope studies, and apply it to all 136 full texts. Report the criterion change as a deviation.

**M5 (Major) — Single reviewer, no agreement check, and appraisal results are not reported.** Single-reviewer screening is acknowledged (§VII). Mitigation is still expected: for example, a second rater on a random 20% sample at both screening stages with Cohen's κ, or at least a re-screen by the same rater after a delay. §III-E says quality bands were "used to weight findings", yet no band is reported for any study and no finding shows a visible weighting.
*Fix:* Add a quality-band column to Table II. Also add the extraction form and appraisal rubric as an appendix.

**M6 (Minor) — PRISMA flow irregularities.**
- (a) "Not retrieved" records belong after screening in PRISMA 2020 (reports sought / not retrieved). Removing nine search hits before deduplication is non-standard. The better remedy is the log's own action item: re-run the query with `size=200`.
- (b) 82 of 111 full-text exclusions fall in one composite category ("non-generative *or* without representational contribution"). Split it.
- (c) Only 16 of 160 records were excluded as off-topic at title/abstract, so most filtering happened at full text. This is unusual and suggests that title/abstract screening applied a looser criterion than full-text screening.

**M7 (Minor) — Reproducibility details.** Search dates, field restrictions for arXiv (the log says "cs categories", but eess.AS and cs.SD matter), and the exact ISMIR query strings should be given. The log's source distribution (arXiv 13, ACM 6) does not match its own included-studies table, which gives arXiv 14 and ACM 5. The log also points to "Section III-D" for criterion refinement, but the paper records it in §III-C.

**M8 (Minor) — Table IV is not traceable.** "Reported capability" ratings (Strong/Weak/Limited) have no per-cell citation or rating rule. Step-based "Strong" metrical stability, for example, appears to rest on one 2026 preprint. Add a footnote with the sources and the rating rule.

**Recommendation signal:** Major Revision.

---

### 3. Reviewer 2 — Domain (Symbolic Music Generation)

**D1 (Major) — Voice-ordered serialization and voice-channel inputs predate this review.** The Bach-chorale generation literature has long given models line identity. Please verify each case against the source; this reviewer is working from memory:
- **Music Transformer [3]** was itself evaluated on JSB Chorales, where each time step's four voices were serialized in a fixed soprano-to-bass order. That is ordering by line membership, the "one principle" that G2 says no work uses.
- **Coconet** (Huang et al., ISMIR 2017) represents each voice as its own piano-roll channel.
- **DeepBach** (Hadjeres et al., ICML 2017) models each voice as its own sequence.
- **BachBot** (Liang et al., ISMIR 2017) and **TonicNet** (Peracha, 2019) serialize chorales in fixed voice order.

These are mostly pre-2018 or non-Transformer, so they may fall outside the window. But G1 and G2 are stated as universal claims ("No representation…", "None orders notes by line membership"). The accurate and still valuable claim is narrower: *general-purpose, widely adopted tokenizers (REMI/CP/Octuple/MidiTok) for multi-instrument and piano corpora lack a voice field.* The chorale literature is prior art that CANTUS generalizes, not a gap it discovers. Engaging it would strengthen the novelty argument, which then becomes variable voice count, voice-state flags and tiered annotation.

**D2 (Major) — "Arbitrary ordering" is overstated.** Mainstream tokenizers, including MidiTok's REMI/TSD/CP implementations, sort concurrent notes deterministically (usually by pitch). The order is deterministic but not line-aware; it is not arbitrary. For piano and most homophonic textures, pitch-descending order equals "ascending voice order" whenever voices do not cross. So CANTUS's ordering differs from current practice only at voice crossings and unisons. Two consequences follow:
- The prediction that CANTUS "should reduce polyphonic BPE cost [24] by collapsing the orderings a merge must cover to one" does not hold, because current orderings are already one ordering. The BPE cost in [24] more plausibly comes from the combinatorics of vertical pitch sets than from order variability.
- §II-E's claim that the polyphonic difficulty is "traceable to the arbitrary ordering" is a causal inference [24] does not appear to make.

*Fix:* Recast G2 as "ordering is not line-aware". Drop or hedge the BPE prediction, or add it as a Stage 1 hypothesis with a stated null.

**D3 (Major) — The Layer 1 voice-index definition contradicts itself.** The voice index is "ordinal from the highest-sounding voice downwards *and* consistent across the piece". These two conditions cannot both hold when voices cross, and voice crossing is exactly what Layer 3's "voice-crossing rate" measures. If the index is re-ranked by height at each onset, crossings cannot be observed. If it is a persistent line ID, it cannot be defined by height. The same problem appears when voices enter and exit (fugal entries): does a new entering voice renumber the others?
*Fix:* Define the index as a persistent line identifier, ordered by each line's mean or initial register. Specify the emission order at crossings and unisons, and specify how IDs behave for piano (where voice count varies from beat to beat) and for divisi in ensembles.

**D4 (Major) — "Resolved" trade-offs are overclaimed.** The abstract and §IV-B say compound representations "resolved" the trade-off between metrical stability and length. Yet the included studies [9] (Nested Music Transformer) and [10] (Amadeus) exist because parallel sub-token decoding in CP degrades quality. The paper's own Table II lists "Heuristic sub-token order" as a limitation. Similarly, "attention cost no longer limits long-form generation" sits uneasily with G6 and with Museformer's sparsity being a design compromise. Reframe as "substantially mitigated".

**D5 (Minor) — Evaluation literature is incomplete.** Symbolic evaluation toolkits (MusPy metrics, Yang & Lerch's [29] feature set) and rule-based chorale evaluation (for example music21-based checks of parallel fifths and octaves used in harmonization papers) should be discussed before claiming that "no study measures voice-leading". If they are excluded as out of window or non-Transformer, say so.

**D6 (Minor) — Layer 3 metric details.**
- Contour correlation between voices is undefined when onsets are asynchronous. Specify the sampling grid.
- "Interval-class divergence from the corpus" needs a named divergence (JS or KL) and a smoothing rule.
- Voice-crossing "against the corpus distribution" needs a statistical test.
- The Stage 1 comparison of held-out likelihood between voice-aware and voice-blind models is not like-for-like: the voice-aware model predicts extra fields. Compare on the marginal likelihood of shared fields (pitch/duration/onset) or report bits per note.

**D7 (Minor) — Claims that need a citation or verification.** "MetaScore holds roughly 963,000 scores" [20]; "388-token vocabulary" [2] (the 388 figure comes from the Music Transformer piano setup; confirm attribution); "4.2% vs 71%" [24]; "up to 59%" [11]. Run a citation check. Several 2026 references (arXiv 2604.x, 2608.x, DOIs for [34]–[36]) should be verified as resolving.

**Recommendation signal:** Major Revision.

---

### 4. Reviewer 3 — Perspective (Cultural, Ethical, Cross-disciplinary)

**Strengths.** Section IV-C is more substantive than most technical reviews. It argues that symbolic representation "relocates the cultural failure… into the tokenizer" and then turns the same critique on CANTUS (§VI-G), which is well done.

**P1 (Major) — The ethics analysis asserts more than the evidence shows.**
- "No study in the corpus reports the licence status of its training data" is a checkable claim. Include it as an extraction field in Table II so readers can audit it.
- The deskilling paragraph (§IV-C-4) has no citation; draw on labour or creative-industries literature or mark it as the author's argument.
- "Many are user transcriptions of copyrighted works" needs a source (dataset documentation or an audit).

**P2 (Minor) — Cultural scoping of CANTUS is sound but slightly defensive.** Making the voice field optional and restricting CANTUS to line-based idioms is sensible. Useful cross-disciplinary connections that go further:
- Heterophony and stream segregation (auditory scene analysis, Bregman) give a perceptual rather than notational definition of a "line", which could generalize beyond Western notation.
- *Kern/Humdrum's spine model already represents non-voice streams.
- The polymeter case [35] suggests the voice field should allow per-voice metrical frames, not just per-voice pitch streams.

**P3 (Minor) — "The most formalized body of knowledge in Western art music"** (§IV-B, §VIII) is rhetorical and debatable; tuning theory and harmony treatises are equally formalized. Soften it.

**P4 (Minor) — Practical impact is not articulated.** Who benefits from contrapuntal diagnostics? Pedagogy (automated part-writing feedback), arranger tools and musicology corpus QA are concrete audiences and would strengthen the "so what".

**P5 (Minor) — Provenance in Layer 2 needs an enforcement point.** Recording licence status is good, but say what is done with unlicensed or unknown items: exclusion, a separate split, or reporting only. Otherwise "bringing provenance inside corpus construction" is only documentation.

**Recommendation signal:** Minor-to-Major Revision (defers to R1/R2 on the rigor of the review).

---

### 5. Devil's Advocate

**Strongest counter-argument (≈250 words).**
The paper's gap is partly produced by how it searched. The executed queries never mention voices, chorales or counterpoint, and the inclusion criterion was tightened mid-screening until 25 records remained. Under those conditions, "no representation supplies voice identity" is close to guaranteed by construction. The generative literature that *does* supply voice identity is the chorale-harmonization tradition. Music Transformer's own JSB experiments serialized soprano-alto-tenor-bass order, and DeepBach and Coconet use per-voice streams or channels. That tradition mostly sits outside the search terms and the window, but it shows the idea is old. The field's shift to piano and multitrack pop corpora did not *overlook* voices. It moved to data where voices are not annotated and often not well defined: a piano left hand playing Alberti bass is not a set of lines. On that reading, the absence of a voice field is a rational response to data availability (the paper's own G5), not an omission. CANTUS then reduces to "use voice-annotated data when you have it", which chorale models already do. The one genuinely new question — whether *inferred* voices (Tier 2) help at scale — is the one the paper admits falls under the Token–State objection and leaves to Stage 2. Meanwhile the "arbitrary ordering" premise is weak, because tokenizers already sort concurrent notes deterministically by pitch, which matches voice order except at crossings. The framework's predicted benefits (BPE efficiency, likelihood gains) may therefore be near-zero on exactly the corpora where it is applicable.

**Issue list**

| ID | Severity | Dimension | Location | Issue |
|---|---|---|---|---|
| DA-1 | **CRITICAL** | Evidence / logic chain | §III-A vs Table I and log; §IV-B; G1, G2, G4 | Universal absence claims ("no representation", "no study", "none orders by line") rest on searches with no voice, counterpoint or chorale terms, plus known counterexamples in the chorale generation literature. The claims as stated are not supported. |
| DA-2 | MAJOR | Confirmation bias | §III-C | Criterion refined after seeing counts, with the stated goal of reducing volume. Whatever the intent, this risks shaping the corpus towards the thesis. |
| DA-3 | MAJOR | Premise | §II-E, G2, §VI-A | "Arbitrary ordering" is false for mainstream deterministic (pitch-sorted) tokenizers, so the predicted BPE benefit likely does not follow. |
| DA-4 | MAJOR | Internal consistency | §VI-A vs §VI-C | The voice index cannot be both height-ordinal and piece-consistent if voice crossing is to be measurable. |
| DA-5 | MAJOR | Overgeneralization | Abstract, §IV-B, §VIII | "Resolved" trade-offs, contradicted by included studies [9], [10]. |
| DA-6 | MINOR | Alternative path | §V | A voice-agnostic alternative is not considered: models may learn implicit line structure, which can be probed (for example, linear probes for voice ID on REMI-trained models) without changing the tokenizer. This is cheaper and would test whether G1 matters. |
| DA-7 | MINOR | "So what?" | §VI-F | Stage 1 on Bach chorales largely replicates known chorale setups; a positive result there would say little about piano or multitrack corpora, where the argument matters. |

**Ignored alternative explanations:** data availability (not oversight) explains the missing voice fields; the polyphonic BPE cost may come from vertical combinatorics, not order; implicit learning of voice structure.
**Missing stakeholders:** performers and arrangers who treat voicing as a performance choice (for example piano voicing is interpretive); dataset contributors whose transcriptions become Tier 1/2 data.
**Observations (non-defects):** the explicit non-coverage of G6 and the falsifiability statement are real strengths, and they make the paper easier to critique honestly.

---

## Phase 2 — Editorial Decision

**Decision: MAJOR REVISION**

Dear Author,

The panel finds the thesis clear, relevant and well written. The track-versus-voice distinction, the self-critical use of the Effectiveness–Losslessness framework, and the explicit scoping of CANTUS are genuine merits. The paper is not yet acceptable, however, because its central evidential claims outrun the review that is meant to establish them.

**Consensus (raised by 3 or more seats; shared-model caveat applies):**
1. **Absence claims vs search design** (EIC, R1-M1, R2-D1, DA-1). The executed queries contain no voice, counterpoint or chorale terms. Prior generative work that orders or channels notes by voice appears to exist. G1, G2 and G4 must be re-scoped, and a targeted supplementary search added.
2. **The corpus-construction protocol has integrity problems** (R1-M2, M3, M4; DA-2): post-window inclusions ([12], [28]), a synthesis resting on non-included studies ([6], [7], [3], [13]), a criterion changed during screening and applied inconsistently.
3. **Overclaiming** (R2-D2, D4; R3-P3; DA-3, DA-5): "arbitrary ordering", "resolved", "most formalized".

**Disputed or single-seat points:**
- *Genre (review vs proposal).* The EIC seat sees tension; R3 and DA see the pairing as defensible. Editorial view: keep the hybrid, but separate the evidence from the argument. Sections IV–V should stand without Section VI.
- *DA-6 (probing for implicit voice learning).* Only DA raised it. Editorial view: recommended, not required. Discussing it as an alternative route strengthens G1.

**Devil's Advocate CRITICAL adjudication**
- **DA-1 — VALIDATED (in part).** The search-design component is verified directly from Table I and the screening log: no executed query contains voice-related terms. The prior-art component (Music Transformer JSB serialization, DeepBach, Coconet, BachBot, TonicNet) is flagged for the author to verify against the sources, since the panel worked from memory. Either component alone invalidates the universal wording of G1, G2 and G4. This issue blocks acceptance until resolved.

---

## Revision Roadmap

Items are listed in source order and are not a ranking. The author decides triage (`will_address` / `wont_address` / `not_on_point`).

| # | Source | Item | Minimum remedy | Stronger option |
|---|---|---|---|---|
| 1 | DA-1, M1, D1 | Absence claims vs search | Re-scope G1, G2 and G4 to "widely adopted general-purpose tokenizers" and state the search limits in §VII | Supplementary voice/chorale/counterpoint search plus citation chasing, shown as a separate PRISMA stream; discuss chorale prior art in §II-C |
| 2 | M2 | Post-window studies [12], [28] (check [35], [36]) | Move them to a labelled "outside search" stream | Extend the window and re-run all searches |
| 3 | M3 | Results rely on non-included [2], [3], [6], [7], [13]–[15] | Confine them to Background; re-derive Tables III–V from included studies | Admit them through documented citation chasing |
| 4 | M4, DA-2 | Criterion changed mid-screening; misfits [18], [27], [31]–[33], [36], [21] | Report as a protocol deviation; justify each borderline inclusion against RQ3 | Re-apply the final criterion to all 136 full texts and report changes |
| 5 | M5 | Single rater; appraisal not reported | Add a quality-band column to Table II and the rubric in an appendix | Second rater on a 20% sample with κ |
| 6 | M6, M7 | PRISMA flow and log inconsistencies | Retrieve the 9 missing records; split the 82-item category; fix log counts (arXiv 14 / ACM 5) and the section cross-reference | Add search dates and exact strings for all sources |
| 7 | M8 | Table IV untraceable | Add per-cell citations and a rating rule | — |
| 8 | D2, DA-3 | "Arbitrary ordering"; BPE prediction | Recast as "not line-aware"; hedge the BPE claim | Make the BPE effect a Stage 1 hypothesis with a stated null |
| 9 | D3, DA-4 | Voice-index definition contradiction | Define a persistent line ID; specify crossing and unison emission order | Worked example in Fig. 3 showing a crossing and a fugal entry |
| 10 | D4, DA-5 | "Resolved" overclaims | Change to "substantially mitigated" in the Abstract, §IV-B and §VIII | — |
| 11 | D5 | Missing evaluation literature | Discuss MusPy, [29] features and rule-based chorale checks | — |
| 12 | D6 | Layer 3 metrics and likelihood comparability | Specify grid, divergence and tests; compare shared-field likelihood | Pre-register Stage 1 analyses |
| 13 | D7 | Unverified figures and 2026 references | Run a citation check | — |
| 14 | P1 | Ethics claims need support | Add a licence field to Table II; cite or flag the deskilling argument | — |
| 15 | P2, P4, P5 | Cross-disciplinary depth, impact, provenance enforcement | State the policy for unlicensed items; name the audiences who benefit | Perceptual (stream-segregation) definition of a line |
| 16 | DA-6, DA-7 | Alternative path; generality of Stage 1 | Discuss implicit-voice probing as an alternative | Add a piano Tier 1 subset (for example ASAP / score-aligned corpora) to Stage 1 |
| 17 | EIC | Presentation | Draw Figs 1–3; replace placeholders; give equations as text or LaTeX | — |

*Phase 2.5 (Socratic revision coaching) is available on request. Say "just fix it" to skip coaching and move to revision.*
