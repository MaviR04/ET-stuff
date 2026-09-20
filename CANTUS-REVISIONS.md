# CANTUS: Revision Edits (E1–E13)

Paste-ready replacement text for `CANTUS-Research-Paper.docx`. Each edit gives the **location**, the **current text** (or its opening words), and the **replacement**.

**Markers used below**
- `[TODO: …]` means you need to supply a number or decision, usually after re-screening.
- `[VERIFY: …]` means a factual claim you should check against the source before submitting.

New references [41]–[44] are listed at the end (E14). Renumber them if your docx numbering differs.

**Order of work:** re-screen the March–September 2026 records and retrieve the 9 missing arXiv records first, so the numbers are known. Then fill in the TODOs in E4/E5, and paste the rest in any order.

---

## E1: Abstract, contribution paragraph (§I), and Conclusion (§VIII)

### E1a. Abstract (replace the whole paragraph)

> Transformer language models consume symbolic music as flat token sequences that discard which melodic line each note belongs to. This paper presents a PRISMA 2020 systematic review of tokenization and representation for Transformer-based symbolic music generation. Searches of four digital libraries returned 181 records, from which 28 primary studies were synthesized. The evidence shows that compound representations have substantially mitigated the trade-off between metrical stability and sequence length, and that attention cost is no longer the main limit on long-form generation. It also shows that none of the widely used general-purpose tokenizers supplies voice identity to a generative model as an input field, and that no included study measures whether generated polyphony observes voice-leading convention. Earlier chorale models did order notes by voice, but they assumed exactly four voices that never enter or drop out. Six research gaps are identified. To address them, the paper proposes CANTUS, a four-layer framework that combines a voice-indexed compound representation able to handle a changing number of voices, a tiered voice-annotation pipeline, a contrapuntal evaluation suite, and an ablation and reporting protocol, together with a staged validation plan. Social, legal and ethical implications, including corpus provenance and the cultural bias of Western-derived notation, are critically evaluated.

### E1b. §I, contribution paragraph (replace the first sentence, from "The contribution is fourfold" up to "…Western notation.")

> The contribution is fourfold: a synthesis of a literature fragmented across tokenization, attention, multi-track modelling and evaluation; six research gaps traced to their evidence, distinguished from trade-offs already substantially mitigated; CANTUS, a voice-aware representation and evaluation framework that, unlike earlier fixed-voice chorale models, handles voices entering and dropping out, as in fugal writing and piano textures, with a staged validation plan; and a critical evaluation of social, legal and ethical implications, including the cultural assumptions of Western notation.

*(Keep the sentence that follows, "Section II reviews the literature…", unchanged.)*

### E1c. §VIII, first paragraph (replace the whole paragraph)

> This review synthesized 28 primary studies selected under PRISMA 2020. The field has substantially mitigated its most-discussed problems: compound representations eased the trade-off between metrical stability and sequence length, although sub-token decoding order remains an active concern [9], [10], and attention cost is no longer the main limit on long-form generation. What remains is a representational omission with measurement consequences. None of the widely used general-purpose tokenizers supplies a generative model with the line a note belongs to, although source formats carry it and transcription systems predict it. Earlier chorale models ordered notes by voice, but only under a fixed four-voice assumption [3], [41]–[43]. As a result, simultaneous notes are ordered by pitch rather than by line, existing remedies fuse lines rather than recover them, and voice-leading cannot be evaluated on generated output in the representations the field now uses.

*(The second paragraph of §VIII can stay. Optionally change "to address the four that sustain one another" to "to address the four that sustain one another, centred on a representation that handles a changing number of voices".)*

---

## E2: §II-C, add the chorale prior art

**Location:** end of the §II-C paragraph, after "…one piano track routinely carries three or four independent lines."

**Add:**

> Voice identity has been modelled directly, but only in four-part chorale generation. The Music Transformer serialized JSB Chorales on a sixteenth-note grid in fixed soprano–alto–tenor–bass order [3], and TonicNet preceded each step's four voices with a chord token [43]. DeepBach modelled each voice as its own sequence [41], and Coconet assigned each voice its own piano-roll channel [42]. BachBot, by contrast, ordered notes within a frame by descending pitch, and its authors note that this neglects crossing voices [44]. All of these assume exactly four voices, each sounding one note at every step. None allows voices to enter, drop out or change in number, which is the situation in fugal writing and in most piano music.

### E2b. §II-D, add Libretto (end of paragraph)

> Libretto introduces an LLM-native text grammar with explicit per-bar voice blocks, in which simultaneous pitches within a voice are joined into chords [45]. Its voices, however, are declared source parts that map one-to-one to MIDI tracks, so a piano is a single voice and the voice set is fixed for the whole piece. ABC itself provides a multi-voice (`V:`) syntax, but a controlled comparison found that LLMs rarely emit it [46].

### E2c. §II-A, add the new representation studies (end of paragraph)

> MuseTok learns discrete bar-level codes with a residual vector-quantized autoencoder and decodes them to REMI+ events for generation [47], and DadaGP introduces an event-based token format for guitar tablature that encodes instrument, string and fret [48].

### E2d. §II-F, add the new comparative studies (after the sentence ending "…compared directly.")

> Agogic holds a pretrained language model, data, budget and decoding fixed while swapping seven tokenizations, and finds that representation, not model size, is the binding variable for distributional fidelity [46]. A controlled comparison of three pianoroll-derived encodings finds that vocabulary learnability, not sequence compression, limits self-supervised piano models [49].

---

## E3: Hedge the ordering and BPE claims

### E3a. §II-E, last sentence

**Current:** "…— so the polyphonic difficulty is compression efficiency, traceable to the arbitrary ordering of simultaneous notes."

**Replace with:**

> …— so the polyphonic difficulty lies in compression efficiency. Whether that cost stems from how simultaneous notes are ordered or from the sheer number of possible vertical pitch combinations is not established [24].

### E3b. §VI-A, BPE sentence
Handled inside the E9 rewrite.

---

## E4: §III, method (window, criteria, PRISMA counts)

### E4a. §III-A, first sentence

**Current:** "The window was January 2018 to September 2026, beginning with the Music Transformer preprint…"

**Replace with:**

> The window was January 2018 to [TODO: exact search date, e.g. 12 September 2026], starting in the year of the Music Transformer preprint that established relative attention for symbolic music; earlier work concerns recurrent architectures with different representational constraints. The end date is the date the final searches were run.

*(The IEEE export filename suggests 12 September 2026. Use the actual date for each source if they differ.)*

### E4b. §III-C, replace the whole paragraph

> Studies were included if published within the window, in English, and reporting primary quantitative, ablation or human-assessment results. Criteria were set per research question. For RQ1 and RQ2, a study's **primary contribution** had to be a symbolic music representation, a comparison or evaluation of representations, or a compression scheme over them. For RQ3, studies whose primary contribution was an evaluation methodology for symbolic music generation, or the expressive scope of symbolic notation formats, were also admitted, because RQ3 concerns how effectiveness is measured and which musics a representation can express.
>
> These criteria were adopted during screening, which is a deviation from a fixed protocol and is reported as such. Two earlier formulations were tried and rejected. The first admitted any generative model that consumes a tokenization, but that does not answer RQ1, since nearly every symbolic generation paper uses some tokenizer. The second admitted any study that investigates representation, which did not separate studies *about* representation from studies that merely *use* one. After the final criteria were fixed, they were re-applied to all 150 full texts. This excluded PianoTree VAE, which is not Transformer-based, and the MidiTok library, which reports no representational comparison and is cited as a software tool. It also admitted MuseTok, whose earlier exclusion was not consistent with the criteria. Exclusions covered audio-only work, studies with no bearing on generation or on representations used for it, applications of existing representations, secondary reviews, superseded versions, front matter and unavailable full texts.

**Decided:** [27] and [49] (Token Granularity) are kept as *comparisons of representations*, even though they evaluate understanding rather than generation. Both use Transformers and isolate the representation as the only variable.

### E4c. §III-D, PRISMA workflow (replace the whole paragraph)

> The four sources identified 181 records, all of which were retrieved. Removing 13 duplicates left 168 records for screening. Title and abstract screening excluded 18 (2 front matter, 16 off-topic), leaving 150 full texts. Of these, 122 were excluded: 14 audio-only; 88 non-generative, or applying an existing representation without proposing, comparing or evaluating one; 8 secondary reviews; 7 superseded versions; 2 on re-application of the final criteria (Section III-C); and 3 records first excluded on date, which were re-screened after the window was extended and excluded on topical grounds. 28 studies were included (Fig. 1).

**Fig. 1 numbers:** 181 identified → 181 retrieved → 13 duplicates removed → **168 screened** → 18 excluded → **150 full texts** → 122 excluded → **28 included**.

*How these were derived:*
- The 9 missing arXiv records were retrieved, and 1 of them duplicated [17], so duplicates rose from 12 to 13.
- The "outside window" category no longer exists, so its 6 records went to full-text assessment.
- **Assumption:** those 6 are taken to include Libretto, Agogic and Token Granularity, which are post-February 2026 records with no other recorded exclusion reason. That leaves 3 excluded on re-screening. The totals (168 screened, 140 excluded, 28 included) hold regardless; only the split between exclusion stages depends on this assumption. State it in the log.
- The 82-record category stays combined, since no per-record decisions exist to split it. It is relabelled so the two reasons are explicit.

### E4d. §III-E, appraisal sentence

**Current:** "Quality was banded high, medium or low on protocol clarity, dataset provenance, human assessment and reproducibility, and used to weight findings rather than to exclude."

**Replace with:**

> Quality was banded high, medium or low on protocol clarity, dataset provenance, human assessment and reproducibility (Table II). Bands were used to weight findings rather than to exclude studies: where studies disagreed, or a finding rested on a single study, the higher-band evidence was given precedence and single low-band findings are flagged as tentative in the text.

---

## E5: Table II

- **Delete** the rows for [18] PianoTree VAE and [21] MidiTok.
- **Add** these five rows:

| Ref. | Principal contribution | Voice encoded | Key limitation |
|---|---|---|---|
| [45] | Libretto text grammar | By track (declared part) | Track, not line; fixed voice set |
| [46] | Agogic: seven-tokenization controlled comparison; PMT stream | No (track/program) | Chords ordered by pitch |
| [47] | MuseTok learned bar-level codes | No | Piano-focused |
| [48] | DadaGP tablature token format | By instrument (string, not line) | Guitar-specific |
| [49] | Token granularity comparison | No | Understanding, not generation |

- **Add a column** "Quality" (High / Medium / Low), filled from your appraisal.
- **Add a column** "Licence reported" (Yes / No). This backs up the §IV-C-1 claim that no study reports licence status (item 16).

| Ref. | Principal contribution | Voice encoded | Quality | Licence reported | Key limitation |
|---|---|---|---|---|---|
| [5] | REMI metrical grid | No | [TODO] | [TODO] | Longer sequences |
| … | … | … | … | … | … |

---

## E6: Tables III–V and §IV: included studies as evidence, others as background

### E6a. §IV-A, first sentence

**Current:** "The corpus falls into five families (Table III): event-based [2], [11]; grid-based [5], [36]; compound [6]–[10]; step-based [12]; and text-native [19]."

**Replace with:**

> The included studies fall into five families (Table III): event-based [11], [46], [48], building on the MIDI-like encoding of [2]; grid-based [5], [36], [49]; compound [8]–[10], building on [6], [7]; step-based [12]; and text-native [19], [45]. MuseTok's learned bar-level codes [47] sit outside these families but decode to a grid-based stream.

### E6b. §IV-B, first paragraph (replace)

> Three findings emerge (Table IV). First, the trade-off between metrical stability and sequence economy has been substantially mitigated. Event encodings lack a metrical anchor [11], grid encodings fix this but lengthen sequences [5], and compound tokens, introduced in [6], [7], obtain both, although the order in which sub-tokens are decoded remains an open design question [8]–[10]. Comparative studies confirm the principle that explicit information helps, with task-dependent magnitude [25], [26]. Second, attention is no longer the main limit on length: among included studies, MuPT maintains alignment beyond 8,192 tokens [19], extending the relative and structured attention of earlier work [3], [13].

### E6c. §IV-B, "Third" paragraph, first two sentences

**Current:** "Third, the bottom row of Table IV is empty. No study measures whether generated polyphony observes voice-leading convention — the most formalized body of knowledge in Western art music — because no representation carries the information such a measure needs."

**Replace with:**

> Third, the bottom row of Table IV is empty. No included study measures whether generated polyphony observes voice-leading convention, one of the most formalized bodies of knowledge in Western art music, because none of the included representations carries the line information such a measure needs.

*(This also softens "the most formalized", from reviewer point P3.)*

### E6d. Table IV: add a rating rule and sources

Add this note directly under Table IV:

> *Rating rule:* **Strong** means the family's included studies report this capability as a design goal and demonstrate it empirically. **Moderate** means it is demonstrated with qualifications or partial support. **Weak/Limited** means it is not a design goal and reported results show a disadvantage or no support. **Absent** means the capability is not representable. *Sources by family:* Event [11]; Grid [5], [26], [36]; Compound [8]–[10]; Step [12]; Text [19].

`[VERIFY: check each cell against those sources. If a cell has no support in the listed studies, change it to "Not reported" rather than keeping a rating.]`

### E6e. Table V, "Evidence" column

| Challenge | Current | Replace with |
|---|---|---|
| Line identity absent from inputs | [6], [16], [33] | [5], [16], [33]; cf. [3], [41]–[43] |
| Long context ≠ musical form | [13], [38] | [19]; cf. [13], [38] |
| Arbitrary simultaneity ordering | [17], [24] | [17], [24], [46]. Also rename the challenge to "Pitch-ordered, not line-ordered, simultaneity". |

**Table III:** change the Text-native row's "Voice identity" cell from "By staff only" to "By staff or track [19], [45]".

*(Other rows only use included studies, or background sources for data claims such as [20] and [37], which is fine for RQ3.)*

---

## E7: §IV-C-4, Deskilling

**Replace the paragraph with:**

> Symbolic generation targets arrangement and accompaniment writing, the routine work through which early-career arrangers acquire their craft. This paper argues that adoption to cut costs would fall on them first. It is a labour question that none of the included studies raises, and one this review can identify but not measure.

*(Optional: if you find a creative-industries or labour source on AI and music work, cite it here and drop "This paper argues that".)*

---

## E8: §V, G1 and G2

### E8a. G1 (replace the whole paragraph)

> **G1: Voice identity is absent from the inputs of general-purpose tokenizers.** None of the widely used general-purpose tokenizers (REMI, Compound Word, Octuple, and their MidiTok implementations) supplies the melodic line of a note as an input field [5], [16], [22], [25], [46]; formats as introduced in [6], [7]. Voice has been supplied as input only in four-part chorale models, as fixed sequence positions, separate per-voice sequences or separate channels [3], [41]–[43], and never as a token field that allows the number of voices to change. The closest recent case, Libretto, labels note blocks by voice, but its voices are tracks declared once per piece [45]. MIDI-to-score conversion already predicts staff assignment and stem direction, which in piano notation encode voice membership [33], and cross-modal translation operates on notation-level structure [34]. Line identity is thus predictable, and predicted as *output*, but in current general-purpose tokenizers it is not supplied to a generative model as *input*, which must instead re-infer it from pitch proximity.

`[VERIFY: that [22] and [25] describe their tokenizations in enough detail, including simultaneous-note ordering, to support this. If not, cite [5] and [16] as review evidence and MidiTok's documentation for implementation behaviour.]`

### E8b. G2 (replace the whole paragraph)

> **G2: No widely used tokenizer orders simultaneous notes by persistent voice, and existing remedies collapse lines further.** General-purpose tokenizers order simultaneous notes deterministically, typically by pitch; in the controlled comparison of [46], for example, ties are broken "by ascending pitch so that chord tones follow a canonical low-to-high order". But pitch order changes whenever voices cross, so it does not follow lines. Polyphonic piano needs over ten times as many BPE merges as monophonic music [24], although how much of that cost is due to ordering is unknown. Permutation-invariant modelling [17] and step-based grouping [12] address ordering by treating the vertical slice as unordered or fused. The Music Transformer's chorale serialization did order notes by persistent voice [3], but only for a fixed set of four voices, each sounding in every time step. No representation orders notes by persistent voice when voices enter, drop out or change in number.

*(The earlier MidiTok check is no longer needed: [46] is an included study that states the pitch-ordering rule directly. Quote verified from arXiv:2608.03999, Section 3.)*

---

## E9: §VI-A, Layer 1 (replace the whole paragraph)

> Layer 1 adds two fields to the compound token [6]–[8]. The **voice index** is a persistent line identifier: each line keeps the same index for its whole duration, and indices are assigned in order of each line's register when it first enters, highest first. Because the index belongs to the line, not to its current height, voice crossings stay visible rather than being silently re-ranked. A voice may hold several simultaneous notes. A left-hand block chord, for example, is one voice sounding three notes, ordered by pitch within the voice. The **voice-state flag** marks whether a note enters, continues or ends its line, so the number of active voices can change through fugal entries, episodes and cadential thinning. This is the capability that fixed-voice chorale models lack [3], [41]–[43]. Notes sharing an onset are emitted in voice-index order, and at unisons the lower index comes first. Unlike fusion or permutation invariance [12], [17], this makes ordering both deterministic and meaningful. Whether it also reduces polyphonic BPE cost [24] is tested as a hypothesis in Stage 1, not assumed. Both fields enter a factorized embedding, so parameters grow linearly with the maximum voice count. **Addresses G1 and G2.**

---

## E10: §VI-C, Layer 3 (hybrid rule)

**Location:** insert after the sentence ending "…interval-class divergence from the corpus."

**Add:**

> Contrapuntal measures assume one pitch per line at a time, so they apply directly to single-note voices. For voices sounding chords, only the lowest sounding note of the whole texture is evaluated, as the bass line, following harmonic convention. Upper chordal voices are excluded from contrapuntal measures and reported as such.

---

## E11: §VI-F, Stage 1 (replace the "Stage 1" sentences, up to "…the premise fails.")

> **Stage 1, representation pilot:** train matched models on the fugues of J.S. Bach's *Well-Tempered Clavier* [TODO: cite the **kern/MEI edition used] and test on *The Art of Fugue*, a held-out work by the same composer in which voices enter one by one and thin out in episodes and at cadences. Three arms are compared: a voice-blind compound baseline; a fixed-slot baseline that assigns a fixed number of voice positions in the manner of chorale models [3]; and CANTUS with voice-state flags. Measures are held-out likelihood on the shared pitch, duration and onset fields (so that models predicting extra voice fields are not penalized), rule-violation counts and post-BPE sequence length. Because the *Well-Tempered Clavier* is keyboard music, its voice labels come from an editor, not the composer. A hand-checked sample of [TODO: e.g. 10] fugues is verified against persistent lines before training, and the agreement rate is reported. *The Art of Fugue*, written in open score, provides composer-given voices for testing. The stage is cheap and falsifiable: if CANTUS improves neither likelihood nor conformance over the fixed-slot baseline, the claimed value of variable voice handling fails.

`[VERIFY: that a voice-separated WTC fugue encoding is available, and that the corpus is large enough for small models.]`

*(Stages 2 and 3 can stay as they are.)*

---

## E12: §VII, Limitations

**Delete** the sentence "Nine records from the largest arXiv query were not retrieved before screening." (they have now been retrieved).

**Location:** insert after "…so inter-rater agreement is unavailable."

**Add:**

> The search terms contained no voice-, chorale- or counterpoint-specific vocabulary, so the claims in G1, G2 and G4 are bounded by what the queries could retrieve. Four-part chorale models that do encode voice [3], [41]–[44] were identified after screening, outside the systematic search, and are discussed as prior art rather than included studies. Symbolic evaluation toolkits and rule-based chorale evaluation were likewise not systematically searched. The inclusion criteria were adopted during screening rather than pre-registered (Section III-C). Per-record decisions were not logged during the first screening pass, so the stage at which three records were originally excluded is inferred rather than recorded.

---

## E13: Screening log (`screening-log.md`)

| Line | Current | Change to |
|---|---|---|
| 57 | "published 2018–2026" | "published January 2018 – [search date] September 2026, per-RQ criteria as in paper §III-C" |
| 59 | "as recorded in Section III-D" | "as recorded in Section III-C" |
| All | — | **Done.** `screening-log.md` has been updated directly: window, criteria, flow, per-record re-screening decisions, the 28 included studies, and the source distribution (**arXiv 17, ACM 6, IEEE 4, ISMIR 1**). |

---

## E14: New references

> [41] G. Hadjeres, F. Pachet, and F. Nielsen, "DeepBach: A Steerable Model for Bach Chorales Generation," in *Proc. 34th Int. Conf. on Machine Learning (ICML)*, PMLR vol. 70, 2017. arXiv:1612.01010
>
> [42] C.-Z. A. Huang, T. Cooijmans, A. Roberts, A. Courville, and D. Eck, "Counterpoint by Convolution," in *Proc. 18th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2017. arXiv:1903.07227
>
> [43] O. Peracha, "Improving Polyphonic Music Models with Feature-Rich Encoding," in *Proc. 21st Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2020. arXiv:1911.11775
>
> [44] F. T. Liang, M. Gotham, M. Johnson, and J. Shotton, "Automatic Stylistic Composition of Bach Chorales with Deep LSTM," in *Proc. 18th Int. Society for Music Information Retrieval Conf. (ISMIR)*, pp. 449–456, 2017.

>
> [45] Y. Xu, "Libretto: Giving LLM Agents a Sense of Musical Structure," arXiv:2606.22708, 2026.
>
> [46] J. Chen et al., "Agogic: Performance-Timed Music Tokens for LLM-Native Text-to-Symbolic-Music Generation," arXiv:2608.03999, 2026.
>
> [47] J. Huang, Z. Novack, P. Long, Y. Hou, K. Chen, T. Berg-Kirkpatrick, and J. McAuley, "MuseTok: Symbolic Music Tokenization for Generation and Semantic Understanding," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, 2026. doi: 10.1109/ICASSP55912.2026.11463020
>
> [48] P. Sarmento, A. Kumar, C. J. Carr, Z. Zukowski, M. Barthet, and Y.-H. Yang, "DadaGP: A Dataset of Tokenized GuitarPro Songs for Sequence Models," in *Proc. 22nd Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2021. arXiv:2107.14653
>
> [49] H. Gu and Q. Liu, "Token Granularity Matters: A Comparative Study of Encoding Schemes for Self-Supervised Piano Music Representation Learning," in *Proc. 7th Int. Conf. on Computer Information and Big Data Applications (CIBDA)*, pp. 200–204, 2026. doi: 10.1145/3813822.3813854

`[VERIFY: page numbers and venue details for [41]–[43] and [48]. The content claims for [41]–[48] were checked against the papers themselves; [49] was checked from its abstract only.]`

**Reference [18] and [21]** stay in the reference list, since they are still cited in §II-C and §II-E, but are no longer included studies.

---

## Remaining checks before submission

- [x] Re-screen March–September 2026 records (done, 37 records; decisions in `screening-log.md`)
- [x] Retrieve the 9 missing arXiv records (done)
- [ ] Update Fig. 1 in the docx: 181 → 181 → 168 → 150 → 28
- [ ] Fill in the Table II "Quality" and "Licence reported" columns for all 28 studies
- [ ] Re-run the six ISMIR queries and check for any 2026 records (no export was saved)
- [ ] All `[VERIFY]` items above
- [ ] Citation check (item 15), especially the 2026 references [12], [28], [34]–[36]. `/ars-citation-check` can do this.
- [ ] Search the docx for any leftover "resolved", "arbitrary" or "no representation" wording
