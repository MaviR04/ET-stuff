# CANTUS: Revision Edits (E1–E14)

Record of the edits made in response to the simulated peer review (`CANTUS-Review-Report.md`) and to supervisor feedback (E15–E16). Each edit gives the location, the original text where relevant, and the final text as it now appears in the paper.

**Status (27 September 2026): E1–E14 are applied. E15–E16, from supervisor feedback, are proposed and not yet in the paper.**
- The source of truth is `CANTUS-Research-Paper-revised.md`. `CANTUS-Research-Paper-revised.docx` is generated from it with `python tools/md2ieee.py`.
- Every `[TODO]` has been filled and every `[VERIFY]` claim confirmed; none remain in the paper.
- **Numbering:** all citations in the final text below use the new IEEE numbering (order of first appearance, 50 references), matching the revised paper, `screening-log.md` and `CANTUS-Citation-Report.md`.
- Quotes marked *Original* come from the pre-review `CANTUS-Research-Paper.md` and keep its old numbers. The old → new mapping is in `CANTUS-Citation-Report.md`, §A.

---

## E1: Abstract, contribution paragraph (§I), and Conclusion (§VIII)

### E1a. Abstract (whole paragraph replaced)

> Transformer language models consume symbolic music as flat token sequences that discard which melodic line each note belongs to. This paper presents a PRISMA 2020 systematic review of tokenization and representation for Transformer-based symbolic music generation. Searches of four digital libraries returned 181 records, from which 28 primary studies were synthesized. The evidence shows that compound representations have substantially mitigated the trade-off between metrical stability and sequence length, and that attention cost is no longer the main limit on long-form generation. It also shows that none of the widely used general-purpose tokenizers supplies voice identity to a generative model as an input field, and that no included study measures whether generated polyphony observes voice-leading convention. Earlier chorale models did order notes by voice, but they assumed exactly four voices that never enter or drop out. Six research gaps are identified. To address them, the paper proposes CANTUS, a four-layer framework that combines a voice-indexed compound representation able to handle a changing number of voices, a tiered voice-annotation pipeline, a contrapuntal evaluation suite, and an ablation and reporting protocol, together with a staged validation plan. Social, legal and ethical implications, including corpus provenance and the cultural bias of Western-derived notation, are critically evaluated.

### E1b. §I, contribution paragraph (first sentence replaced; "Section II reviews the literature…" kept)

> The contribution is fourfold: a synthesis of a literature fragmented across tokenization, attention, multi-track modelling and evaluation; six research gaps traced to their evidence, distinguished from trade-offs already substantially mitigated; CANTUS, a voice-aware representation and evaluation framework that, unlike earlier fixed-voice chorale models, handles voices entering and dropping out, as in fugal writing and piano textures, with a staged validation plan; and a critical evaluation of social, legal and ethical implications, including the cultural assumptions of Western notation.

### E1c. §VIII, first paragraph (replaced)

> This review synthesized 28 primary studies selected under PRISMA 2020. The field has substantially mitigated its most-discussed problems: compound representations eased the trade-off between metrical stability and sequence length, although sub-token decoding order remains an active concern [9], [10], and attention cost is no longer the main limit on long-form generation. What remains is a representational omission with measurement consequences. None of the widely used general-purpose tokenizers supplies a generative model with the line a note belongs to, although source formats carry it and transcription systems predict it. Earlier chorale models ordered notes by voice, but only under a fixed four-voice assumption [3], [21]–[23]. As a result, simultaneous notes are ordered by pitch rather than by line, existing remedies fuse lines rather than recover them, and voice-leading cannot be evaluated on generated output in the representations the field now uses.

**§VIII, second paragraph:** now includes the optional wording "…to address the four that sustain one another, centred on a representation that handles a changing number of voices, …".

---

## E2: Literature review additions

### E2a. §II-C, chorale prior art (new second paragraph)

> Voice identity has been modelled directly, but only in four-part chorale generation. The Music Transformer serialized JSB Chorales on a sixteenth-note grid in fixed soprano–alto–tenor–bass order [3], and TonicNet preceded each step's four voices with a chord token [21]. DeepBach modelled each voice as its own sequence [22], and Coconet assigned each voice its own piano-roll channel [23]. BachBot, by contrast, ordered notes within a frame by descending pitch, and its authors note that this neglects crossing voices [24]. All of these assume exactly four voices, each sounding one note at every step. None allows voices to enter, drop out or change in number, which is the situation in fugal writing and in most piano music.

### E2b. §II-D, Libretto (end of paragraph)

> Libretto introduces an LLM-native text grammar with explicit per-bar voice blocks, in which simultaneous pitches within a voice are joined into chords [27]. Its voices, however, are declared source parts that map one-to-one to MIDI tracks, so a piano is a single voice and the voice set is fixed for the whole piece. ABC itself provides a multi-voice (`V:`) syntax, but a controlled comparison found that LLMs rarely emit it [28].

### E2c. §II-A, new representation studies (end of first paragraph)

> MuseTok learns discrete bar-level codes with a residual vector-quantized autoencoder and decodes them to REMI+ events for generation [13], and DadaGP introduces an event-based token format for guitar tablature that encodes instrument, string and fret [14].

### E2d. §II-F, new comparative studies (after "…have been compared directly.")

> Agogic holds a pretrained language model, data, budget and decoding fixed while swapping seven tokenizations, and finds that representation, not model size, is the binding variable for distributional fidelity [28]. A controlled comparison of three pianoroll-derived encodings finds that vocabulary learnability, not sequence compression, limits self-supervised piano models [36].

---

## E3: Hedge the ordering and BPE claims

### E3a. §II-E, last sentence

*Original:* "…— so the polyphonic difficulty is compression efficiency, traceable to the arbitrary ordering of simultaneous notes."

**Final:**

> …— so the polyphonic difficulty lies in compression efficiency. Whether that cost stems from how simultaneous notes are ordered or from the sheer number of possible vertical pitch combinations is not established [32].

### E3b. §VI-A, BPE sentence

Handled in the E9 rewrite, which turns the BPE saving into a Stage 1 hypothesis.

---

## E4: §III, method (window, criteria, PRISMA counts)

### E4a. §III-A, first sentence

*Original:* "The window was January 2018 to September 2026, beginning with the Music Transformer preprint…"

**Final:**

> The window was January 2018 to 12 September 2026, starting in the year of the Music Transformer preprint that established relative attention for symbolic music; earlier work concerns recurrent architectures with different representational constraints. The end date is the date the final searches were run.

### E4b. §III-C, eligibility (whole section replaced)

> Studies were included if published within the window, in English, and reporting primary quantitative, ablation or human-assessment results. Criteria were set per research question. For RQ1 and RQ2, a study's **primary contribution** had to be a symbolic music representation, a comparison or evaluation of representations, or a compression scheme over them. For RQ3, studies whose primary contribution was an evaluation methodology for symbolic music generation, or the expressive scope of symbolic notation formats, were also admitted, because RQ3 concerns how effectiveness is measured and which musics a representation can express.
>
> These criteria were adopted during screening, which is a deviation from a fixed protocol and is reported as such. Two earlier formulations were tried and rejected. The first admitted any generative model that consumes a tokenization, but that does not answer RQ1, since nearly every symbolic generation paper uses some tokenizer. The second admitted any study that investigates representation, which did not separate studies *about* representation from studies that merely *use* one. After the final criteria were fixed, they were re-applied to all 150 full texts. This excluded PianoTree VAE, which is not Transformer-based, and the MidiTok library, which reports no representational comparison and is cited as a software tool. It also admitted MuseTok, whose earlier exclusion was not consistent with the criteria. Exclusions covered audio-only work, studies with no bearing on generation or on representations used for it, applications of existing representations, secondary reviews, superseded versions, front matter and unavailable full texts.

**Decided:** [35] Interval-based tokenization and [36] Token Granularity are kept as *comparisons of representations*, even though they evaluate understanding rather than generation. Both use Transformers and isolate the representation as the only variable.

### E4c. §III-D, PRISMA workflow (whole paragraph replaced)

> The four sources identified 181 records, all of which were retrieved. Removing 13 duplicates left 168 records for screening. Title and abstract screening excluded 18 (2 front matter, 16 off-topic), leaving 150 full texts. Of these, 122 were excluded: 14 audio-only; 88 non-generative, or applying an existing representation without proposing, comparing or evaluating one; 8 secondary reviews; 7 superseded versions; 2 on re-application of the final criteria (Section III-C); and 3 records first excluded on date, which were re-screened after the window was extended and excluded on topical grounds. 28 studies were included (Fig. 1).

**Fig. 1 numbers:** 181 identified → 181 retrieved → 13 duplicates removed → 168 screened → 18 excluded → 150 full texts → 122 excluded → 28 included.

*How these were derived (details in `screening-log.md`):*
- The 9 missing arXiv records were retrieved. One duplicated [19], raising duplicates from 12 to 13. Of the other 8, seven were excluded at full text and DadaGP was included.
- The "outside window" category no longer exists, so its 6 records went to full-text assessment.
- **Assumption:** those 6 are taken to include Libretto, Agogic and Token Granularity, which are post-February 2026 records with no other recorded exclusion reason. That leaves 3 excluded on re-screening. The totals (168 screened, 140 excluded, 28 included) hold regardless; only the split between exclusion stages depends on this assumption. It is stated in the log and in §VII.
- The "non-generative or applies an existing representation" category stays combined, since no per-record decisions exist to split it. It is relabelled so both reasons are explicit, and it grew from 82 to 88: +7 new arXiv exclusions, −1 for MuseTok (now included).
- Net change in included studies: 25 − 2 ([20] PianoTree VAE, [29] MidiTok) + 5 (Libretto, Agogic, MuseTok, DadaGP, Token Granularity) = 28.

### E4d. §III-E, appraisal sentence

*Original:* "Quality was banded high, medium or low on protocol clarity, dataset provenance, human assessment and reproducibility, and used to weight findings rather than to exclude."

**Final:**

> Quality was banded high, medium or low on protocol clarity, dataset provenance, human assessment and reproducibility. Bands were used to weight findings rather than to exclude studies: where studies disagreed, or a finding rested on a single study, the higher-band evidence was given precedence and single low-band findings are flagged as tentative in the text.

*(The draft pointed to Table II here. The pointer went when the Quality column was dropped; see E5.)*

---

## E5: Table II

- **Deleted** the rows for [20] PianoTree VAE and [29] MidiTok.
- **Added** five rows, placed in reference order:

| Ref. | Principal contribution | Voice encoded | Key limitation |
|---|---|---|---|
| [13] | MuseTok learned bar-level codes | No | Piano-focused |
| [14] | DadaGP tablature token format | By instrument (string, not line) | Guitar-specific |
| [27] | Libretto text grammar | By track (declared part) | Track, not line; fixed voice set |
| [28] | Agogic: seven-tokenization comparison; PMT stream | No (track/program) | Chords ordered by pitch |
| [36] | Token granularity comparison | No | Understanding, not generation |

- **Not added:** the proposed "Quality" and "Licence reported" columns. The user dropped them as unnecessary for coursework, so the table keeps four columns: Ref., Principal contribution, Voice encoded, Key limitation.

---

## E6: Tables III–V and §IV: included studies as evidence, others as background

### E6a. §IV-A, first sentence

*Original:* "The corpus falls into five families (Table III): event-based [2], [11]; grid-based [5], [36]; compound [6]–[10]; step-based [12]; and text-native [19]."

**Final:**

> The included studies fall into five families (Table III): event-based [11], [14], [28], building on the MIDI-like encoding of [2]; grid-based [5], [36], [45]; compound [8]–[10], building on [6], [7]; step-based [12]; and text-native [25], [27]. MuseTok's learned bar-level codes [13] sit outside these families but decode to a grid-based stream.

### E6b. §IV-B, first paragraph (replaced)

> Three findings emerge (Table IV). First, the trade-off between metrical stability and sequence economy has been substantially mitigated. Event encodings lack a metrical anchor [11], grid encodings fix this but lengthen sequences [5], and compound tokens, introduced in [6], [7], obtain both, although the order in which sub-tokens are decoded remains an open design question [8]–[10]. Comparative studies confirm the principle that explicit information helps, with task-dependent magnitude [33], [34]. Second, attention is no longer the main limit on length: among included studies, MuPT maintains alignment beyond 8,192 tokens [25], extending the relative and structured attention of earlier work [3], [15].

### E6c. §IV-B, "Third" paragraph, first two sentences

*Original:* "Third, the bottom row of Table IV is empty. No study measures whether generated polyphony observes voice-leading convention — the most formalized body of knowledge in Western art music — because no representation carries the information such a measure needs."

**Final:**

> Third, the bottom row of Table IV is empty. No included study measures whether generated polyphony observes voice-leading convention, one of the most formalized bodies of knowledge in Western art music, because none of the included representations carries the line information such a measure needs.

*(This also softens "the most formalized", from reviewer point P3.)*

### E6d. Table IV: rating rule and sources (note added under the table)

> *Rating rule:* **Strong** means the family's included studies report this capability as a design goal and demonstrate it empirically. **Moderate** means it is demonstrated with qualifications or partial support. **Weak/Limited** means it is not a design goal and reported results show a disadvantage or no support. **Absent** means the capability is not representable. *Sources by family:* Event [11], [14], [28]; Grid [5], [34], [36], [45]; Compound [8]–[10]; Step [12]; Text [25], [27].

The user checked each cell against the listed sources.

### E6e. Table V, "Evidence" column, and Table III

| Challenge | *Original (old numbers)* | Final |
|---|---|---|
| Line identity absent from inputs | [6], [16], [33] | [5], [18], [42]; cf. [3], [21]–[23] |
| Long context ≠ musical form | [13], [38] | [25]; cf. [15], [47] |
| Arbitrary simultaneity ordering | [17], [24] | [19], [28], [32]; challenge renamed "Pitch-ordered, not line-ordered, simultaneity" |

**Table III:** the Text-native row's "Voice identity" cell changed from "By staff only" to "By staff or track [25], [27]".

*(Other Table V rows use only included studies, or background sources for data claims such as [26] and [46], which is fine for RQ3.)*

---

## E7: §IV-C-4, Deskilling (paragraph replaced)

> Symbolic generation targets arrangement and accompaniment writing, the routine work through which early-career arrangers acquire their craft. This paper argues that adoption to cut costs would fall on them first. It is a labour question that none of the included studies raises, and one this review can identify but not measure.

*(Still optional: if a creative-industries or labour source on AI and music work turns up, cite it here and drop "This paper argues that".)*

---

## E8: §V, G1 and G2

### E8a. G1 (whole paragraph replaced)

> **G1: Voice identity is absent from the inputs of general-purpose tokenizers.** None of the widely used general-purpose tokenizers (REMI, Compound Word, Octuple, and their MidiTok implementations) supplies the melodic line of a note as an input field [5], [18], [28], [30], [33]; formats as introduced in [6], [7]. Voice has been supplied as input only in four-part chorale models, as fixed sequence positions, separate per-voice sequences or separate channels [3], [21]–[23], and never as a token field that allows the number of voices to change. The closest recent case, Libretto, labels note blocks by voice, but its voices are tracks declared once per piece [27]. MIDI-to-score conversion already predicts staff assignment and stem direction, which in piano notation encode voice membership [42], and cross-modal translation operates on notation-level structure [43]. Line identity is thus predictable, and predicted as *output*, but in current general-purpose tokenizers it is not supplied to a generative model as *input*, which must instead re-infer it from pitch proximity.

The user confirmed that [30] and [33] describe their tokenizations in enough detail to support this.

### E8b. G2 (whole paragraph replaced)

> **G2: No widely used tokenizer orders simultaneous notes by persistent voice, and existing remedies collapse lines further.** General-purpose tokenizers order simultaneous notes deterministically, typically by pitch; in the controlled comparison of [28], for example, ties are broken "by ascending pitch so that chord tones follow a canonical low-to-high order". But pitch order changes whenever voices cross, so it does not follow lines. Polyphonic piano needs over ten times as many BPE merges as monophonic music [32], although how much of that cost is due to ordering is unknown. Permutation-invariant modelling [19] and step-based grouping [12] address ordering by treating the vertical slice as unordered or fused. The Music Transformer's chorale serialization did order notes by persistent voice [3], but only for a fixed set of four voices, each sounding in every time step. No representation orders notes by persistent voice when voices enter, drop out or change in number.

*(Agogic [28] states the pitch-ordering rule directly; quote verified from arXiv:2608.03999, Section 3. That made the planned check of MidiTok's behaviour unnecessary.)*

---

## E9: §VI-A, Layer 1 (whole paragraph replaced)

> Layer 1 adds two fields to the compound token [6]–[8]. The **voice index** is a persistent line identifier: each line keeps the same index for its whole duration, and indices are assigned in order of each line's register when it first enters, highest first. Because the index belongs to the line, not to its current height, voice crossings stay visible rather than being silently re-ranked. A voice may hold several simultaneous notes. A left-hand block chord, for example, is one voice sounding three notes, ordered by pitch within the voice. The **voice-state flag** marks whether a note enters, continues or ends its line, so the number of active voices can change through fugal entries, episodes and cadential thinning. This is the capability that fixed-voice chorale models lack [3], [21]–[23]. Notes sharing an onset are emitted in voice-index order, and at unisons the lower index comes first. Unlike fusion or permutation invariance [12], [19], this makes ordering both deterministic and meaningful. Whether it also reduces polyphonic BPE cost [32] is tested as a hypothesis in Stage 1, not assumed. Both fields enter a factorized embedding, so parameters grow linearly with the maximum voice count. **Addresses G1 and G2.**

---

## E10: §VI-C, Layer 3 (hybrid rule)

**Location:** inserted after the sentence ending "…interval-class divergence from the corpus."

> Contrapuntal measures assume one pitch per line at a time, so they apply directly to single-note voices. For voices sounding chords, only the lowest sounding note of the whole texture is evaluated, as the bass line, following harmonic convention. Upper chordal voices are excluded from contrapuntal measures and reported as such.

---

## E11: §VI-F, Stage 1 (the "Stage 1" sentences replaced; Stages 2 and 3 unchanged)

> **Stage 1, representation pilot:** train matched models on the fugues of J.S. Bach's *Well-Tempered Clavier* in David Huron's Humdrum encoding, which places each voice of all 48 fugues on its own spine [50], and test on *The Art of Fugue*, a held-out work by the same composer in which voices enter one by one and thin out in episodes and at cadences. Three arms are compared: a voice-blind compound baseline; a fixed-slot baseline that assigns a fixed number of voice positions in the manner of chorale models [3]; and CANTUS with voice-state flags. Measures are held-out likelihood on the shared pitch, duration and onset fields (so that models predicting extra voice fields are not penalized), rule-violation counts and post-BPE sequence length. Because the *Well-Tempered Clavier* is keyboard music, its voice labels come from an editor, not the composer. A stratified sample of 10 fugues (about 20%), drawn from both books and covering every voice count from the two-voice E minor fugue (BWV 855) to the five-voice C♯ minor and B♭ minor fugues (BWV 849, 867), is hand-checked against persistent lines before training, and the agreement rate is reported. *The Art of Fugue*, written in open score, provides composer-given voices for testing. The stage is cheap and falsifiable: if CANTUS improves neither likelihood nor conformance over the fixed-slot baseline, the claimed value of variable voice handling fails.

Both TODOs are filled: the edition is cited as [50], and the sample is 10 stratified fugues. The Humdrum edition puts each voice on its own spine, which confirms that a voice-separated WTC encoding exists.

---

## E12: §VII, Limitations

- **Deleted:** "Nine records from the largest arXiv query were not retrieved before screening." (they have since been retrieved).
- **Inserted** after "…so inter-rater agreement is unavailable.":

> The search terms contained no voice-, chorale- or counterpoint-specific vocabulary, so the claims in G1, G2 and G4 are bounded by what the queries could retrieve. Four-part chorale models that do encode voice [3], [21]–[24] were identified after screening, outside the systematic search, and are discussed as prior art rather than included studies. Symbolic evaluation toolkits and rule-based chorale evaluation were likewise not systematically searched. The inclusion criteria were adopted during screening rather than pre-registered (Section III-C). Per-record decisions were not logged during the first screening pass, so the stage at which three records were originally excluded is inferred rather than recorded.

---

## E13: Screening log (`screening-log.md`)

**Done.** `screening-log.md` was updated directly and uses the new numbering. It covers:
- the window (to 12 September 2026) and the per-RQ criteria,
- the corrected flow,
- per-record decisions for the 37 re-screened records,
- the 28 included studies,
- the source distribution: arXiv 17, ACM 6, IEEE 4, ISMIR 1.

---

## E14: New references (new numbers)

These were added during revision and are now numbered by first appearance. Metadata was verified against Crossref and arXiv (see `CANTUS-Citation-Report.md`).

> [13] J. Huang, Z. Novack, P. Long, Y. Hou, K. Chen, T. Berg-Kirkpatrick, and J. McAuley, "MuseTok: Symbolic Music Tokenization for Generation and Semantic Understanding," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, pp. 3956–3960, 2026. doi: 10.1109/ICASSP55912.2026.11463020
>
> [14] P. Sarmento, A. Kumar, C. J. Carr, Z. Zukowski, M. Barthet, and Y.-H. Yang, "DadaGP: A Dataset of Tokenized GuitarPro Songs for Sequence Models," in *Proc. 22nd Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2021. arXiv:2107.14653
>
> [21] O. Peracha, "Improving Polyphonic Music Models with Feature-Rich Encoding," in *Proc. 21st Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2020. doi: 10.5281/zenodo.4245396
>
> [22] G. Hadjeres, F. Pachet, and F. Nielsen, "DeepBach: A Steerable Model for Bach Chorales Generation," in *Proc. 34th Int. Conf. on Machine Learning (ICML)*, PMLR vol. 70, pp. 1362–1371, 2017. arXiv:1612.01010
>
> [23] C.-Z. A. Huang, T. Cooijmans, A. Roberts, A. Courville, and D. Eck, "Counterpoint by Convolution," in *Proc. 18th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2017. arXiv:1903.07227
>
> [24] F. T. Liang, M. Gotham, M. Johnson, and J. Shotton, "Automatic Stylistic Composition of Bach Chorales with Deep LSTM," in *Proc. 18th Int. Society for Music Information Retrieval Conf. (ISMIR)*, pp. 449–456, 2017.
>
> [27] Y. Xu, "Libretto: Giving LLM Agents a Sense of Musical Structure," arXiv:2606.22708, 2026.
>
> [28] J. Chen et al., "Agogic: Performance-Timed Music Tokens for LLM-Native Text-to-Symbolic-Music Generation," arXiv:2608.03999, 2026.
>
> [36] H. Gu and Q. Liu, "Token Granularity Matters: A Comparative Study of Encoding Schemes for Self-Supervised Piano Music Representation Learning," in *Proc. 7th Int. Conf. on Computer Information and Big Data Applications (CIBDA)*, pp. 200–204, 2026. doi: 10.1145/3813822.3813854
>
> [50] D. Huron (encoder), "J. S. Bach, The Well-Tempered Clavier, Books I and II: Fugues" [Humdrum \*\*kern digital edition]. [Online]. Available: https://github.com/humdrum-tools/bach-wtc-fugues

- **Checks:** content claims for [13], [14], [21]–[24], [27] and [28] were checked against the papers themselves. [36] was assessed from its abstract only (ACM paywall). DadaGP's venue (ISMIR 2021) was confirmed by the user.
- **[20] PianoTree VAE and [29] MidiTok** stay in the reference list. They are still cited in §II-C and §II-E, but are no longer included studies.

---

## E15: Abstract, add a statistic (supervisor feedback)

**Location:** abstract, the sentence beginning "It also shows that none of the widely used general-purpose tokenizers…".

*Current:* "It also shows that none of the widely used general-purpose tokenizers supplies voice identity to a generative model as an input field, and that no included study measures whether generated polyphony observes voice-leading convention."

**Proposed:**

> It also shows that none of the widely used general-purpose tokenizers supplies voice identity to a generative model as an input field. Of the 28 included studies, 21 encode no voice information at all, and none measures whether generated polyphony observes voice-leading convention.

- **Source of the figure:** Table II, "Voice encoded" column. 21 rows read "No", including [28] "No (track/program)". The other seven are marked by instrument, track, staff, output only, notation-level or format-dependent: [14], [18], [25], [27], [42], [43], [44].
- **Length:** the abstract grows from 202 to 209 words, within IEEE's 150–250.
- **Optional second statistic:** the growth figure from E16b ("23 of them (82%) published in 2023 or later") could follow "…28 primary studies were synthesized". Leaving it out keeps the abstract to one statistic.

---

## E16: §I, more domain context (supervisor feedback)

### E16a. §I, first paragraph (add at the end)

**Location:** after "…rules governing how such lines may move against one another."

**Proposed:**

> In a four-part chorale the lines are soprano, alto, tenor and bass. In a fugue they enter one at a time, and in piano music one hand often carries two.

### E16b. §I, new third paragraph

**Location:** between the paragraph ending "…relative attention made minute-long coherent generation achievable [3]." and the paragraph beginning "This paper argues that serialization discards one property that matters."

**Proposed:**

> The field has grown quickly. Of the 28 studies included in this review, 23 (82%) were published in 2023 or later. Large language models now read and write text-based notation [25], [27], [28], and MuPT reports that performance scales with model size and training data [25]. Score collections reach hundreds of thousands of pieces, with MetaScore holding roughly 963,000 [26]. MidiTok packages the common tokenizers, including REMI, Compound Word and Octuple, in one open library [29]. Symbolic output is notation, so a composer or arranger can edit, orchestrate and publish it directly. What a tokenizer records about a score therefore limits what these tools can learn and what their users can control.

- **Sources:** every claim restates something the paper already cites later: MuPT's scaling law and text-native formats (§II-D), MetaScore's size (§IV-C-1), MidiTok (§II-E, G1), and editable symbolic output (§IV-C-2). The 23-of-28 figure comes from the Fig. 2 data, counting the year of the cited version (so REMI-z [18] counts as 2025).
- **Consequence for numbering:** these citations would appear in §I, before [5]. IEEE numbers references by first appearance, so applying E16b as written moves [25]–[29] to [5]–[9] and shifts the old [5]–[24] to [10]–[29]. The paper, Table II, `screening-log.md`, `CANTUS-Citation-Report.md` and this file would all need renumbering, which is mechanical but touches every section.
- **Alternative without renumbering:** replace the citations with section pointers, for example "Large language models now read and write text-based notation (Section II-D)…". This keeps the numbering stable, but uncited claims in the introduction are weaker than cited ones.

---

## Remaining checks before submission

- [x] Re-screen March–September 2026 records (37 records; decisions in `screening-log.md`)
- [x] Retrieve the 9 missing arXiv records
- [x] Fill all `[TODO]` items (search date, WTC edition [50], spot-check sample of 10 fugues)
- [x] Confirm all `[VERIFY]` items (none remain in the paper)
- [x] Citation check: all 50 references verified, renumbered, 14 metadata fixes (`CANTUS-Citation-Report.md`)
- [x] Search for leftover "resolved", "arbitrary" or "no representation" wording (only the narrowed G2 claim remains, as intended)
- [x] Table II Quality/Licence columns: dropped by decision (E5)
- [x] Regenerate Fig. 1 (PRISMA 2020 flow, 181 → 168 → 150 → 28) and Fig. 2 (28 studies by theme and year): `python tools/make_figures.py` writes `figures/fig1.png` and `figures/fig2.png`
- [ ] Apply E15 and E16 to `CANTUS-Research-Paper-revised.md` (decide first: E16b with citations and renumbering, or with section pointers), then rebuild the docx
- [ ] In the docx: paste Figures 1–3 above their captions
- [ ] Optional: re-run the six ISMIR queries for 2026 records (no ISMIR export was saved)
- [ ] Optional, not agreed: §VI-B gives Tier 1 "annotation confidence 1.0", slightly at odds with the editorial WTC labels. Possible wording: "1.0 where voices are composer-given or hand-verified".
