# Voice-Aware Tokenization for Symbolic Music Generation: A Systematic Review and Proposed Representation Framework

**[Your Name]**
APIIT School of Computing, Colombo, Sri Lanka
[your.email@students.apiit.lk]

---

## Abstract

Transformer language models consume symbolic music as flat token sequences that discard which melodic line each note belongs to. This paper presents a PRISMA 2020 systematic review of tokenization and representation for Transformer-based symbolic music generation. Searches of four digital libraries returned 181 records, from which 25 primary studies were synthesized. The evidence shows that compound representations have resolved the trade-off between metrical stability and sequence length, and that attention cost no longer limits long-form generation. It also shows that no representation supplies voice identity to a generative model as an input field, that the ordering of simultaneous notes is arbitrary and measurably costly, and that no study measures whether generated polyphony observes voice-leading convention. Six research gaps are identified. To address them, the paper proposes CANTUS, a four-layer framework combining a voice-indexed compound representation, a tiered voice-annotation pipeline, a contrapuntal evaluation suite, and an ablation and reporting protocol, together with a staged validation plan. Social, legal and ethical implications, including corpus provenance and the cultural bias of Western-derived notation, are critically evaluated.

**Index Terms**—Symbolic music generation, music information retrieval, tokenization, polyphony, voice separation, counterpoint, transformer models, systematic literature review.

---

## I. INTRODUCTION

A score encodes not only which pitches sound when, but how those pitches are grouped into lines. Counterpoint, voice-leading and orchestration are, at bottom, rules governing how such lines may move against one another.

Generalist audio models now generate waveforms from text prompts, but they struggle to control specific musical attributes or to represent culturally diverse music, because continuous acoustic space is disconnected from the discrete, hierarchical logic of music theory. Music Information Retrieval (MIR) has therefore turned to models operating on symbolic representations, in which music is a sequence of symbols modelled with natural language processing techniques [1]. To apply such models a score must be serialized: foundational work flattened scores into streams of note-on, note-off, velocity and time-shift events [2], and relative attention made minute-long coherent generation achievable [3].

This paper argues that serialization discards one property that matters. Widely adopted tokenizations record pitch, duration, velocity and instrument, but not the line a note belongs to, although MusicXML, MEI and \*\*kern encode it explicitly. Two consequences follow. Simultaneous notes carry no line identity, so the tokenizer imposes an arbitrary order that the model must learn. And the properties that define good part-writing — parallel fifths, voice crossing, unresolved leading tones — cannot be measured on generated output without knowing which notes belong to which line.

The paper addresses this through a systematic review following PRISMA 2020 [4], guided by three research questions:

- **RQ1:** Which tokenization schemes and representations are used for Transformer-based symbolic music generation, and how are they organized?
- **RQ2:** How effectively do they handle polyphony, metrical structure and long-form coherence, and how is effectiveness measured?
- **RQ3:** What limitations, gaps, and social, legal and ethical concerns emerge from the evidence?

The contribution is fourfold: a synthesis of a literature fragmented across tokenization, attention, multi-track modelling and evaluation; six research gaps traced to their evidence, distinguished from trade-offs already resolved; CANTUS, a voice-aware representation and evaluation framework with a staged validation plan; and a critical evaluation of social, legal and ethical implications, including the cultural assumptions of Western notation. Section II reviews the literature, Section III the method, Section IV the findings, Section V the gaps, Section VI the proposal, Section VII the limitations, and Section VIII concludes.

---

## II. LITERATURE REVIEW

### A. Tokenization and Representation Frameworks

Event-based "MIDI-like" encoding flattens a score into a 388-token vocabulary of note-on, note-off, velocity and time-shift events [2], [3]. It models expressive timing well but carries no notion of beat or bar. REMI anchors events to a metrical grid with bar and position tokens, stabilizing rhythm at the cost of several tokens per event [5]. Compound Word (CP) representations resolve this by grouping a note's attributes into one token at a single sequence position [6], as does MusicBERT's eight-field Octuple encoding [7]. Refinements compress super-tokens and learn their internal organization [8], decode sub-tokens sequentially rather than in parallel [9], or model attributes bidirectionally [10]. Two recent tokenizers depart from note events: PerTok encodes expressive microtiming while shortening sequences by up to 59% [11], and BEAT takes a uniform time step as its token unit, grouping all events within a step [12].

Across all of these, compound fields describe a note as an acoustic event — pitch, duration, loudness, instrument. None describes its place in a melodic line.

### B. Attention and Long-Range Structure

Standard self-attention memory grows quadratically, ![][image1], where ![][image2] is sequence length and ![][image3] embedding dimension. The Music Transformer's relative attention reduced the memory needed for relative information to ![][image4] and produced minute-long coherent piano music [3]. Museformer attends finely to structurally related bars and coarsely to the rest, modelling sequences several times longer [13]. Reachable context now exceeds the length of most complete compositions.

### C. Multi-Track and Polyphonic Paradigms

MMM concatenates complete per-track sequences rather than interleaving events, relying on global attention to preserve cross-track coherence while enabling track- and bar-level control [14]. The Multitrack Music Transformer carries instrument identity in a compact multi-dimensional token [15], and REMI-z introduces a structured multitrack tokenization with disentangled content and style for arrangement tasks [16]. Two studies confront polyphony directly: a permutation-invariant language model treats the order of concurrent events as semantically empty [17], and PianoTree VAE learns a tree-structured latent representation of polyphonic texture [18]. These works carry *track* identity successfully, but a track is not a voice: one piano track routinely carries three or four independent lines.

### D. Text-Native Formats

Large language models are more compatible with ABC notation than with MIDI-derived encodings. MuPT's Synchronized Multi-Track ABC enforces measure-level alignment across tracks beyond 8,192 tokens and is presented as validating a Symbolic Music Scaling Law, in which performance scales with parameters and data [19]. Datasets such as MetaScore pair large score collections with LLM-generated captions derived from forum metadata [20].

### E. Sequence Compression

Byte-Pair Encoding (BPE), implemented in MidiTok [21], merges frequent token pairs into supertokens, shortening sequences by up to 50% [22]; both BPE and Unigram segmentation improve structural metrics across melody, single-instrument and multi-instrument corpora [23]. BPE is instrumentation-dependent: polyphonic piano needs over ten times as many merges as monophonic music to reach comparable supertoken length [24]. The supertokens remain musically coherent — only 4.2% straddle a phrase boundary against 71% under random splitting, and BPE improves polyphonic phrase segmentation [24] — so the polyphonic difficulty is compression efficiency, traceable to the arbitrary ordering of simultaneous notes.

### F. Comparative Studies of Representational Choice

A small group of studies isolates representation as the experimental variable. Making time and duration explicit improves results in a task-dependent way [25], and pitch and metrical-grid encodings [26] and interval-based pitch tokenization [27] have been compared directly. The Effectiveness–Losslessness Framework uses predictive codelength to decide what a tokenization should encode [28]. Its *Fact–Token Boundary* admits observation-determined structure into the token interface; its *Token–State Boundary* holds that context-dependent relations should be left to the model. Explicit musical time reduced predictive code, whereas fixed circle-of-fifths coordinates increased it [28]. Section VI-G applies this criterion to the proposal.

### G. Evaluation Methodology

The fuzzy definition of musical creativity has made subjective listening tests appear the only viable evaluation, despite their cost and poor reproducibility [29], while objective metrics capture surface statistics. SyMuRBench benchmarks symbolic representations on downstream tasks [30], Armor meta-evaluates the metrics themselves [31], and perception studies supply listener judgements [32]. None assesses voice-leading conformance. Table II summarizes the included studies.

---

## III. RESEARCH METHODS

This review followed the PRISMA 2020 statement [4] — identification, screening, eligibility and inclusion — because it makes study selection auditable and reproducible.

### A. Scope and Search Strategy

The window was January 2018 to September 2026, beginning with the Music Transformer preprint that established relative attention for symbolic music; earlier work concerns recurrent architectures with different representational constraints. Terms were grouped and joined with AND:

**Representation:** ("tokenization" OR "tokenisation" OR "symbolic representation" OR "MIDI encoding" OR "REMI" OR "compound word" OR "Octuple" OR "ABC notation" OR "byte pair encoding")

**Task:** ("symbolic music generation" OR "music generation" OR "polyphonic music" OR "multi-track music" OR "music transformer" OR "counterpoint generation")

**Evaluation:** ("evaluation" OR "benchmark" OR "metric" OR "listening test" OR "voice separation" OR "voice leading")

### B. Databases

IEEE Xplore and the ACM Digital Library cover peer-reviewed computing literature. arXiv was included because much primary work on symbolic representation appears there first; preprints were admitted only with primary empirical data. The ISMIR Proceedings Archive holds much MIR work that is inconsistently indexed elsewhere. arXiv's advanced search cannot group Boolean terms, so its search was decomposed into six conjunctive queries and merged; ISMIR has no Boolean interface and was searched by domain-restricted indexed search with six query variants, which does not guarantee exhaustive retrieval.

**TABLE I. SEARCH RESULTS ACROSS SOURCES**

| Source | Query focus | Records |
|---|---|---|
| IEEE Xplore | Representation AND Task | 27 |
| ACM Digital Library | Representation AND Task | 50 |
| arXiv | Six conjunctive queries | 81 |
| ISMIR Archive | Six indexed-search variants | 23 |
| **Total** | | **181** |

### C. Eligibility Criteria

Studies were included if published 2018–2026, in English, reporting primary quantitative, ablation or human-assessment results, and if their **primary contribution** was a symbolic music representation, a comparison or evaluation of representations, or a compression scheme over them. This criterion was refined during screening: admitting any generative model that consumes a tokenization retained 25 of 27 records from one source, since nearly every symbolic generation paper uses some tokenizer, and admitting any study that investigates representation retained 42 across sources. Exclusions covered audio-only work, non-generative tasks, applications of existing representations, secondary reviews, superseded versions, front matter and unavailable full texts.

### D. PRISMA Workflow

The four sources identified 181 records. Nine from the largest arXiv query were not retrieved (Section VII), leaving 172. Removing 12 duplicates left 160 for screening. Title and abstract screening excluded 24 (6 outside the window, 2 front matter, 16 off-topic), leaving 136 full texts. Of these, 111 were excluded: 14 audio-only, 82 non-generative or without representational contribution, 8 secondary reviews and 7 superseded versions. 25 studies were included (Fig. 1).

> **Fig. 1.** PRISMA 2020 flow diagram of study selection (181 → 172 → 160 → 136 → 25).

### E. Data Extraction, Appraisal and Synthesis

A standardized form captured each study's representation, whether voice identity was encoded, corpus and provenance, polyphonic scope, evaluation measures, human assessment and stated limitations. Quality was banded high, medium or low on protocol clarity, dataset provenance, human assessment and reproducibility, and used to weight findings rather than to exclude. Heterogeneous metrics precluded meta-analysis, so a narrative synthesis was organized thematically (Fig. 2).

> **Fig. 2.** Included studies by theme and year of publication.

**TABLE II. OVERVIEW OF INCLUDED PRIMARY STUDIES**

| Ref. | Principal contribution | Voice encoded | Key limitation |
|---|---|---|---|
| [5] | REMI metrical grid | No | Longer sequences |
| [8] | Compressive compound word | No | No line identity |
| [9] | Sequential compound decoding | No | Heuristic sub-token order |
| [10] | Bidirectional attribute model | No | Attribute axis only |
| [11] | PerTok expressive encoding | No | Expressive, not structural |
| [12] | BEAT time-step tokens | No | Fuses concurrent events |
| [16] | REMI-z multitrack tokens | Track only | Track, not line |
| [17] | Permutation-invariant LM | No | Order discarded, not recovered |
| [18] | PianoTree VAE | No | Latent, short excerpts |
| [19] | MuPT, SMT-ABC | By staff | Corpus-bounded scaling |
| [21] | MidiTok library | No | No representational claim |
| [22] | BPE for symbolic music | No | Instrumentation-dependent |
| [23] | Subword tokenization study | No | Objective metrics only |
| [24] | BPE mono vs polyphonic | No | Single segmentation task |
| [25] | Time/duration tokenizations | No | Task-dependent benefit |
| [26] | Pitch and grid encodings | No | One generation task |
| [27] | Interval-based pitch tokens | No | Analysis, not generation |
| [28] | Effectiveness–Losslessness | No | Limited corpora |
| [30] | SyMuRBench | No | Not generation quality |
| [31] | Armor meta-evaluation | No | Metrics, not music |
| [32] | Listener perception study | No | Not representation |
| [33] | MIDI-to-score conversion | Output only | Transcription, not input |
| [34] | U-MusT cross-modal | Notation-level | Voice not a token field |
| [35] | Polymeter in multiple formats | Format-dependent | Single work |
| [36] | Pentatonic-Net, Guqin | No | Single tradition |

---

## IV. RESULTS AND DISCUSSION

### A. RQ1: Representations and Their Organization

The corpus falls into five families (Table III): event-based [2], [11]; grid-based [5], [36]; compound [6]–[10]; step-based [12]; and text-native [19]. The trend is towards more information per sequence position, but that densification has added only *acoustic* attributes. Text-native ABC is a partial exception, since staff markers exist, yet SMT-ABC synchronizes at measure rather than voice granularity [19].

**TABLE III. TAXONOMY OF REPRESENTATIONS (RQ1)**

| Family | Time model | Attributes per position | Voice identity |
|---|---|---|---|
| Event-based | Relative shift | One | Absent |
| Grid-based | Bar and beat | One | Absent |
| Compound | Either | Four to eight | Absent |
| Step-based | Uniform step | Grouped by step | Absent |
| Text-native | Notated | Character-level | By staff only |

### B. RQ2: Effectiveness and Its Measurement

Three findings emerge (Table IV). First, the trade-off between metrical stability and sequence economy is resolved: event encodings drift without a metrical anchor [2], grid encodings fix drift but lengthen sequences [5], and compound tokens obtain both [6]–[8]. Comparative studies confirm the principle that explicit information helps, with task-dependent magnitude [25], [26]. Second, attention no longer binds: relative and hierarchical attention reach sequence lengths beyond most complete works [3], [13], [19].

Third, the bottom row of Table IV is empty. No study measures whether generated polyphony observes voice-leading convention — the most formalized body of knowledge in Western art music — because no representation carries the information such a measure needs. The benchmarking efforts do not close this: SyMuRBench tests representations on downstream tasks [30], Armor tests metrics [31], and perception studies test listeners [32].

**TABLE IV. REPORTED CAPABILITY BY FAMILY (RQ2)**

| Capability | Event | Grid | Compound | Step | Text |
|---|---|---|---|---|---|
| Metrical stability | Weak | Strong | Strong | Strong | Strong |
| Sequence economy | Moderate | Weak | Strong | Strong | Moderate |
| Expressive timing | Strong | Weak | Moderate | Weak | Weak |
| Multi-track control | Absent | Limited | Strong | Limited | Strong |
| Contrapuntal fidelity | Not measured | Not measured | Not measured | Not measured | Not measured |

### C. RQ3: Limitations, and Social, Legal and Ethical Implications

**TABLE V. CHALLENGES IDENTIFIED (RQ3)**

| Challenge | Evidence | Consequence |
|---|---|---|
| Line identity absent from inputs | [6], [16], [33] | Counterpoint unmodellable |
| Arbitrary simultaneity ordering | [17], [24] | Wasted capacity; BPE cost |
| No agreed evaluation | [29], [31] | Claims unverifiable |
| Corpus scale and licensing | [20], [37] | Scaling claim untestable |
| Long context ≠ musical form | [13], [38] | Sectional coherence open |
| Western notation assumptions | [35], [36] | Other traditions distorted |

#### 1) Provenance and intellectual property

Large corpora are scraped from user repositories: MetaScore holds roughly 963,000 scores [20] and the Lakh MIDI Dataset on the order of 10⁵ files [37]. Many are user transcriptions of copyrighted works, in which neither the uploader nor the dataset builder holds the rights. No study in the corpus reports the licence status of its training data.

#### 2) Authorship of generated works

Symbolic output is directly editable and publishable, so reproduction of a training phrase is explicit and machine-checkable. Yet no study publishes contamination checks, so the rate of verbatim reproduction is unknown.

#### 3) Cultural bias in representation

Nearly every surveyed representation assumes twelve-tone equal temperament, a bar-and-beat grid and discrete onsets. The corpus supplies direct evidence of the cost: models built for twelve-tone systems produce modal errors on pentatonic Guqin repertoire and needed a modified serialization with scale constraints [36], and encoding one polymetric work in several formats shows that the format silently decides which metrical structures are expressible [35]. Maqam, raga, gamelan and cyclic West African time-lines fit such grids only by distortion. Symbolic representation therefore relocates the cultural failure of audio models into the tokenizer, where it is harder to see — a critique this paper's own proposal must also face (Section VI-G).

#### 4) Deskilling

Symbolic generation targets arrangement and accompaniment writing, the routine work through which early-career arrangers acquire their craft. Adoption to cut costs falls on them first, a labour question the technical literature does not raise.

### D. Critical Cross-Study Comparison

Studies differ in metrics, corpora, sequence lengths and decoding, so reported scores describe whole pipelines rather than representations. The comparative studies [25]–[28] are the exception worth following: each holds the pipeline fixed and varies only the representation. Elsewhere, divergent conclusions cannot be adjudicated without a shared benchmark, and SyMuRBench [30] does not extend to generation.

---

## V. GAP IDENTIFICATION AND ANALYSIS

Six gaps follow. Resolved trade-offs — metrical stability versus length, and attention cost — are deliberately excluded.

**G1: Voice identity is absent from generation inputs.** No representation supplies the melodic line of a note as an input field [6], [7], [16]. The gap is narrower than blanket absence: MIDI-to-score conversion already predicts staff assignment and stem direction, which in piano notation encode voice membership [33], and cross-modal translation operates on notation-level structure [34]. Line identity is thus predictable and predicted as *output*, but never supplied to a generative model as *input*, which must instead re-infer it from pitch proximity.

**G2: Simultaneity ordering is arbitrary, and existing remedies collapse lines further.** Flattening imposes a meaningless order on concurrent notes, costing BPE over ten times as many merges on polyphonic piano [24]. Permutation-invariant modelling [17] and step-based grouping [12] address ordering, but by treating the vertical slice as unordered or fused. None orders notes by line membership — the one principle that is deterministic and musically meaningful.

**G3: No agreed evaluation methodology exists.** Subjective tests are costly and irreproducible [29], and benchmarking efforts [30]–[32] do not cover contrapuntal generation quality, so results remain incomparable.

**G4: Contrapuntal quality is unmeasurable.** Voice-leading rules are rigorous and automatable, but cannot be applied without line membership. G4 is the joint product of G1 and G3.

**G5: Corpus scale and provenance bound the scaling argument.** The Symbolic Music Scaling Law depends on data [19], yet symbolic corpora are orders of magnitude smaller than text [20], [37] and inconsistently licensed.

**G6: Song-scale form is not solved by longer context.** Attention spans whole pieces [13], [19], but developing and returning to themes is a compositional problem; explicit form modelling offers one route [38], and the right strategy is unresolved.

The gaps interlock. G1 sustains G2, because line identity is exactly what would make ordering canonical, and current remedies to G2 entrench G1. G1 and G3 produce G4. G5 constrains remedies to G1, since voice-annotated data is scarcer still. Piecemeal fixes are unlikely to succeed.

---

## VI. PROPOSED SOLUTION: THE CANTUS FRAMEWORK

CANTUS (Counterpoint-Aware Notation Tokenization and Understanding Schema) treats voice identity as a structural field equal in standing to pitch and duration (Fig. 3). Making it explicit turns currently unmeasurable properties into computable ones.

> **Fig. 3.** The four CANTUS layers and the gaps each addresses, with REMI, CP and CANTUS token streams compared for one four-voice excerpt.

### A. Layer 1: Voice-Indexed Compound Representation

Layer 1 adds two fields to the compound token [6]–[8]. The **voice index** identifies a note's line, ordinal from the highest-sounding voice downwards and consistent across the piece. The **voice-state flag** marks whether the note continues, enters or ends a line, since voice count changes through fugal entries and cadential thinning. Notes sharing an onset are then emitted in ascending voice order. Unlike fusion or permutation invariance [12], [17], this makes ordering deterministic *and* meaningful, and should reduce polyphonic BPE cost [24] by collapsing the orderings a merge must cover to one. Both fields enter a factorized embedding, so parameters grow linearly with voice count. **Addresses G1 and G2.**

### B. Layer 2: Voice Annotation and Corpus Construction

**Tier 1** uses natively voiced sources — MusicXML, MEI, \*\*kern and chorale corpora — with annotation confidence 1.0, forming the calibration and evaluation set; transcription systems that predict stem direction [33] can extend it. **Tier 2** applies voice separation to unvoiced MIDI, using contig mapping [39] or graph-based link prediction [40], and records the separator's confidence. **Tier 3** retains unreliable material with a null voice field, degrading gracefully to a standard compound encoding. Every item records source, licence status, tier and confidence, bringing provenance inside corpus construction. **Addresses G1; partly G5.**

### C. Layer 3: Contrapuntal Evaluation Suite

With line membership explicit, five measures become computable and are reported separately: **voice-crossing rate** against the corpus distribution; **voice-count stability**, detecting silently dropped lines; **line independence**, the mean pairwise contour correlation between voices; **rule-violation counts** for parallel fifths and octaves, unresolved leading tones and augmented leaps under a declared idiom rule set; and **interval-class divergence** from the corpus. They are diagnostic, not a quality score: passing them does not make music good, but failing them shows it is not in the claimed idiom — a judgement current benchmarks [30], [31] cannot make. **Addresses G3 and G4.**

### D. Layer 4: Ablation Protocol and Representation Card

Following the comparative studies [25]–[28], any representational claim must be reported against a **voice-blind baseline** identical except for the ablated voice fields. Each evaluation emits a **representation card** recording tokenizer configuration, annotation tier distribution and confidence, corpus provenance and licence, decoding settings and contamination checks, making the pipeline the declared unit of evaluation. **Addresses G3; supports G5.**

### E. Mapping to the Identified Gaps

**TABLE VI. MAPPING OF GAPS TO CANTUS COMPONENTS**

| Gap | Component | Expected effect |
|---|---|---|
| G1 Voice absent from inputs | Layers 1, 2 | Line membership becomes a model input |
| G2 Arbitrary ordering | Layer 1 | Deterministic, line-preserving order |
| G3 No agreed evaluation | Layers 3, 4 | Shared suite and declared protocol |
| G4 Counterpoint unmeasurable | Layers 1, 3 | Voice-leading becomes computable |
| G5 Corpus and provenance | Layers 2, 4 | Provenance recorded; data retained |
| G6 Song-scale form | Not addressed | Architectural, not representational |

CANTUS does not address G6; claiming one mechanism solves every gap would reduce credibility.

### F. Validation Plan

**Stage 1, representation pilot:** train matched models on Bach chorales, where voice annotation is exact, with and without voice fields, comparing held-out likelihood, rule-violation counts and post-BPE length. The stage is cheap and falsifiable: if voice indexing improves neither likelihood nor conformance, the premise fails. **Stage 2, annotation robustness:** repeat with Tier 2 separated [39], [40] and synthetically degraded annotations to measure how separator error erodes the benefit. **Stage 3, perceptual validation:** test whether each Layer 3 measure correlates with expert ratings of part-writing; a suite that predicts nothing about expert judgement would reproduce G3.

### G. Implementation Challenges

**Token–State Boundary objection.** The Effectiveness–Losslessness Framework holds that context-dependent relations should be left to the model rather than fixed by the tokenizer [28], and inferred voice membership is such a relation. In Tier 1, however, voice is an observation-determined fact written by the composer, on the Fact side where that framework says structure should enter the token — as with explicit musical time, which reduced predictive code. Tier 2 fixes an inferred relation and does fall under the objection, a principled reason to treat it as provisional; Stage 2 tests it.

**Annotation scarcity.** Tier 1 data is small and Tier 2 inherits separator error; confidence recording exposes but does not remove it.

**Cultural specificity.** The discrete contrapuntal voice is a Western category that fits heterophonic traditions poorly, and imposing it would repeat the bias documented for pentatonic repertoire [36]. The voice field is therefore optional, coverage is reported per tradition, and CANTUS is proposed only for line-based idioms.

**Rule-set specificity.** Layer 3 rules encode common-practice conventions, so the rule set is a declared evaluation parameter rather than a fixed component.

---

## VII. LIMITATIONS OF THIS REVIEW

The review covers English-language work in four databases, so other languages, grey literature and industry practice may be missed. Nine records from the largest arXiv query were not retrieved before screening. ISMIR was searched by indexed web search rather than database query. A single reviewer screened and appraised studies, so inter-rater agreement is unavailable. The corpus is dominated by Western tonal music, which partly explains the prominence of counterpoint here. Finally, CANTUS is not empirically validated, and the effects in Table VI are argued rather than demonstrated.

---

## VIII. CONCLUSION AND FUTURE WORK

This review synthesized 25 primary studies selected under PRISMA 2020. The field has resolved its most-discussed problems: compound representations dissolved the trade-off between metrical stability and sequence length, and attention cost no longer limits long-form generation. What remains is a representational omission with measurement consequences. No tokenization supplies a generative model with the line a note belongs to, although source formats carry it and transcription systems predict it. As a result, simultaneity ordering is arbitrary, existing remedies fuse lines rather than recover them, and voice-leading — the most formalized knowledge in Western music — cannot be evaluated on generated output.

Six gaps were identified, and CANTUS was proposed to address the four that sustain one another, through a voice-indexed representation, tiered annotation with provenance, a contrapuntal evaluation suite and a voice-blind ablation protocol. Future work begins with the falsifiable chorale pilot of Section VI-F, then extends voice-aware representation to traditions not organized around independent lines, integrates it with explicit form modelling [38], and builds a licensed, provenance-documented symbolic corpus large enough to test the claimed scaling behaviour.

---

## REFERENCES

[1] S. Ji, X. Yang, and J. Luo, "A Survey on Deep Learning for Symbolic Music Generation: Representations, Algorithms, Evaluations, and Challenges," *ACM Computing Surveys*, vol. 56, no. 1, art. 7, 2023. doi: 10.1145/3597493

[2] S. Oore, I. Simon, S. Dieleman, D. Eck, and K. Simonyan, "This Time with Feeling: Learning Expressive Musical Performance," *Neural Computing and Applications*, vol. 32, 2020. arXiv:1808.03715

[3] C.-Z. A. Huang, A. Vaswani, J. Uszkoreit, N. Shazeer, I. Simon, C. Hawthorne, A. M. Dai, M. D. Hoffman, M. Dinculescu, and D. Eck, "Music Transformer: Generating Music with Long-Term Structure," in *Proc. Int. Conf. on Learning Representations (ICLR)*, 2019. arXiv:1809.04281

[4] M. J. Page et al., "The PRISMA 2020 Statement: An Updated Guideline for Reporting Systematic Reviews," *BMJ*, vol. 372, p. n71, 2021. doi: 10.1136/bmj.n71

[5] Y.-S. Huang and Y.-H. Yang, "Pop Music Transformer: Beat-based Modeling and Generation of Expressive Pop Piano Compositions," in *Proc. 28th ACM Int. Conf. on Multimedia*, 2020. doi: 10.1145/3394171.3413671

[6] W.-Y. Hsiao, J.-Y. Liu, Y.-C. Yeh, and Y.-H. Yang, "Compound Word Transformer: Learning to Compose Full-Song Music over Dynamic Directed Hypergraphs," in *Proc. AAAI Conf. on Artificial Intelligence*, vol. 35, no. 1, pp. 178–186, 2021. doi: 10.1609/aaai.v35i1.16091

[7] M. Zeng, X. Tan, R. Wang, Z. Ju, T. Qin, and T.-Y. Liu, "MusicBERT: Symbolic Music Understanding with Large-Scale Pre-Training," in *Findings of ACL-IJCNLP*, pp. 791–800, 2021.

[8] L. Zhou, L. Yin, and Y. Qian, "A Novel Compressive Compound Word Encoding and Independent Word Attention for Symbolic Music Generation," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, pp. 1–5, 2025. doi: 10.1109/ICASSP49660.2025.10889355

[9] H. Yoo, H.-W. Dong, J. Jung, and D. Jeong, "Nested Music Transformer: Sequentially Decoding Compound Tokens in Symbolic Music and Audio Generation," arXiv:2408.01180, 2024.

[10] H. Su, K. Li, L. Yang, H. Zhang, and Y.-Z. Song, "Amadeus: Autoregressive Model with Bidirectional Attribute Modelling for Symbolic Music," arXiv:2508.20665, 2025.

[11] J. Lenz and A. Mani, "PerTok: Expressive Encoding and Modeling of Symbolic Musical Ideas and Variations," arXiv:2410.02060, 2024.

[12] L. Qian, H. Gu, J. Zhao, and Z. Wang, "BEAT: Tokenizing and Generating Symbolic Music by Uniform Temporal Steps," arXiv:2604.19532, 2026.

[13] B. Yu, P. Lu, R. Wang, W. Hu, X. Tan, W. Ye, S. Zhang, T. Qin, and T.-Y. Liu, "Museformer: Transformer with Fine- and Coarse-Grained Attention for Music Generation," in *Advances in Neural Information Processing Systems (NeurIPS)*, 2022. arXiv:2210.10349

[14] J. Ens and P. Pasquier, "MMM: Exploring Conditional Multi-Track Music Generation with the Transformer," arXiv:2008.06048, 2020.

[15] H.-W. Dong, K. Chen, S. Dubnov, J. McAuley, and T. Berg-Kirkpatrick, "Multitrack Music Transformer," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, 2023.

[16] L. Ou, J. Zhao, Z. Wang, G. Xia, Q. Liang, T. Hopkins, and Y. Wang, "Unifying Symbolic Music Arrangement: Track-Aware Reconstruction and Structured Tokenization," in *Advances in Neural Information Processing Systems (NeurIPS)*, 2025. arXiv:2408.15176

[17] J. Liu, Y. Dong, Z. Cheng, X. Zhang, X. Li, F. Yu, and M. Sun, "Symphony Generation with Permutation Invariant Language Model," in *Proc. 23rd Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2022. arXiv:2205.05448

[18] Z. Wang et al., "PianoTree VAE: Structured Representation Learning for Polyphonic Music," in *Proc. 21st Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2020.

[19] X. Qu, Y. Bai, Y. Ma, Z. Zhou, K. M. Lo, J. Liu, R. Yuan, et al., "MuPT: A Generative Symbolic Music Pretrained Transformer," in *Proc. Int. Conf. on Learning Representations (ICLR)*, 2025. arXiv:2404.06393

[20] W. Xu, J. McAuley, T. Berg-Kirkpatrick, S. Dubnov, and H.-W. Dong, "Generating Symbolic Music from Natural Language Prompts using an LLM-Enhanced Dataset," in *Proc. 26th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2025. arXiv:2410.02084

[21] N. Fradet, J.-P. Briot, F. Chhel, A. El Fallah Seghrouchni, and N. Gutowski, "MidiTok: A Python Package for MIDI File Tokenization," in *Extended Abstracts for the Late-Breaking Demo Session, 22nd ISMIR*, 2021. arXiv:2310.17202

[22] N. Fradet, N. Gutowski, F. Chhel, and J.-P. Briot, "Byte Pair Encoding for Symbolic Music," in *Proc. Conf. on Empirical Methods in Natural Language Processing (EMNLP)*, 2023. arXiv:2301.11975

[23] A. Kumar and P. Sarmento, "From Words to Music: A Study of Subword Tokenization Techniques in Symbolic Music Generation," arXiv:2304.08953, 2023.

[24] D.-V.-T. Le, L. Bigo, and M. Keller, "Analyzing Byte-Pair Encoding on Monophonic and Polyphonic Symbolic Music: A Focus on Musical Phrase Segmentation," in *Proc. 3rd Workshop on NLP for Music and Audio (NLP4MusA)*, 2024. arXiv:2410.01448

[25] N. Fradet, N. Gutowski, F. Chhel, and J.-P. Briot, "Impact of Time and Note Duration Tokenizations on Deep Learning Symbolic Music Modeling," in *Proc. 24th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2023. arXiv:2310.08497

[26] Y. Li, S. Li, and G. Fazekas, "A Comparative Analysis of Different Pitch and Metrical Grid Encoding Methods in the Task of Sequential Music Generation," arXiv:2301.13383, 2023.

[27] D.-V.-T. Le, L. Bigo, and M. Keller, "Evaluating Interval-based Tokenization for Pitch Representation in Symbolic Music Analysis," arXiv:2501.04630, 2025.

[28] Y. Wang, "How Far Should Tokenization Go? Predictive Effectiveness and Relational Losslessness," arXiv:2608.18025, 2026.

[29] L.-C. Yang and A. Lerch, "On the Evaluation of Generative Models in Music," *Neural Computing and Applications*, vol. 32, pp. 4773–4784, 2020. doi: 10.1007/s00521-018-3849-7

[30] P. Strepetov and D. Kovalev, "SyMuRBench: Benchmark for Symbolic Music Representations," in *Proc. 3rd Int. Workshop on Multimedia Content Generation and Evaluation*, 2025. doi: 10.1145/3746278.3759392

[31] S. Wang, Z. Bao, and J. E, "Armor: A Benchmark for Meta-evaluation of Artificial Music," in *Proc. 29th ACM Int. Conf. on Multimedia*, 2021. doi: 10.1145/3474085.3475700

[32] H. Chu, J. Kim, S. Kim, H. Lim, H. Lee, S. Jin, J. Lee, T. Kim, and S. Ko, "An Empirical Study on How People Perceive AI-generated Music," in *Proc. 31st ACM Int. Conf. on Information and Knowledge Management (CIKM)*, 2022. doi: 10.1145/3511808.3557235

[33] T. Beyer and A. Dai, "End-to-end Piano Performance-MIDI to Score Conversion with Transformers," in *Proc. 25th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2024. arXiv:2410.00210

[34] J. Jung et al., "U-MusT: A Unified Framework for Cross-Modal Translation of Score Images, Symbolic Music, and Performance Audio," *IEEE Trans. Audio, Speech and Language Processing*, vol. 34, pp. 1876–1891, 2026. doi: 10.1109/TASLPRO.2025.3648794

[35] L. Hofmann, C. S. Sapp, and F. C. Moss, "Encoding Polymeter: A Corpus of Hugo Distler's 'Der Jahrkreis' op. 5 in Different Symbolic Formats," in *Proc. 13th Int. Conf. on Digital Libraries for Musicology (DLfM)*, 2026. doi: 10.1145/3815723.3815729

[36] N. Li, Q. Xiao, and X. Yin, "Pentatonic-Net: Structure-Aware Symbolic Guqin Generation via Constrained Transformer Decoding," in *Proc. 9th Int. Conf. on Artificial Intelligence and Big Data (ICAIBD)*, pp. 422–425, 2026. doi: 10.1109/ICAIBD69640.2026.11637240

[37] C. Raffel, "Learning-Based Methods for Comparing Sequences, with Applications to Audio-to-MIDI Alignment and Matching," Ph.D. dissertation, Columbia University, 2016.

[38] Z. Wang, L. Min, and G. Xia, "Whole-Song Hierarchical Generation of Symbolic Music Using Cascaded Diffusion Models," in *Proc. Int. Conf. on Learning Representations (ICLR)*, 2024. arXiv:2405.09901

[39] E. Chew and X. Wu, "Separating Voices in Polyphonic Music: A Contig Mapping Approach," in *Computer Music Modeling and Retrieval (CMMR)*, LNCS vol. 3310, Springer, pp. 1–20, 2005. doi: 10.1007/978-3-540-31807-1_1

[40] E. Karystinaios, F. Foscarin, and G. Widmer, "Musical Voice Separation as Link Prediction: Modeling a Musical Perception Task as a Multi-Trajectory Tracking Problem," in *Proc. 32nd Int. Joint Conf. on Artificial Intelligence (IJCAI)*, pp. 3866–3874, 2023. arXiv:2304.14848

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAaCAYAAAAUqxq7AAADzElEQVR4Xu2YW4hOURTHl1DuhFyixiASRQmRPEguuSQUuTwrRskD8TQl5ZKSkEjyICmFJNeHiRd5okiJGhJREkUhl/Vrnf3NPnvO2ecwM8039f3qn761r2evtfbaQ6RGl6O7aqnqqGqWqlu6uevTUzU4NJZkkqpZtVnVQ3Uh+T2qpUubGSi2x3ZjkGqkmGeLYPHLqtVhQ0kmqt6rDie/d6m+qqZXerQdovNuaPwfjqu+qN6qXqt+iYX9AL+TB4dzQ7VbstPioupUIGzb/U5KHzFnMMdZ1RtVfaqHMU91RvVIbH/oirTMfUK1RtXbDfDYqKoLjWVhwkOq/aohnn2R6pPquWq8Z3fsVD2Q9BgfNktE/FT9SX6jvI1OFosm5s06cMYx/oDYfNuS3044CzsHNy0Z4yDFOMR/TrURqntiB5HFWtVv1e2wQexj1oXGgFVim34XNmRwRywai1J7h9ic/cIGZaFYipIFIWQH+ynNNbGFjki2x4CL85JYPx8uUdIvBh/QJDaWSMqDtRuSf2GrampLc4rhqpfSej8+y8XahwZ2CsF31ezAnguTcNJZ6eNg0+fF+vby7Cuk2BtUqI9iKTY3aHMwPyl1WixNtohFKweRBfMwXywi3QGNDewzVN8k7qwKbIBJjkl+9IAfBf4B7ZN8Lzs2iI1rlvyyzRyEPv2cqDh9/U4efBx9rocNHm5dHORDZX4llhFkRhQigLtlcdgQgBfwlh/SLu1YMAYpyLhSGyqBn+44KA+3brg/5+z7qv7ppjR4By8VdSSyiDAWo/Q63EJZl6QPlyUhTWhnUTQ+ZIGYU5slPyJ5P7Gu71Cfc2JRFB5eCveBKLZJ7ibuKBbb69l5/1DeY2OBcU+l9WUJHH5RBQwhalx6+enu0yjW50lgd5Q6IHfxNkn8I6lubrFhnr1MBLEGY1kn646rl/yLOA+injnzLtkxYhWOB27Wy959d+EBAYvkedfBQryPZgZ2d0CxD2RePobSGsJG/YgsC3dhrCLyEGTNvIem2zeHGNt7BQ6AV3KdZ+ORtl4sjyd49hAea3kbJfwPiv1J4F7ZbHiO6qrYRzQl9rLwcYzj7z73Gmav41R7VJ9V8yX7YByu4BS93yosU30Qu0hPiuX4i8RGqYzBYyuMjqySnaeGZEwRS6T1WF8/VDfF3j5FULkJiqLKnQIvcPNzYa4Uy+OYFxxc1LHLshohcp5JyfRqD3glTwmNVQyH0xgaO5KHEv87rtqgKI0OjR0N5fSx5P8XRjXAdXBLOtGRVI/Y07+zoexvCo01atSoUY38BWAc2ubh6FQYAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAaCAYAAACHD21cAAAAs0lEQVR4XmNgGHkgAIjnAvEsNDwTiIWR1GEAXSAOAeKlQPwfiLOhfGcgZkVShxNMYoBoZESXwAc0gfgtEH9FlyAEghggtp1GlyAEYM6cgy6BD/AC8WEGiMZoNDm8ANmZgmhyIMDMgCPACDnTEohZ0AVBNoBswuVMkE2T0QVBADkajNHkQAAkdhxdEATWMkBsA6UamD+kgTgZiD8C8T8gdoGKgwHI3T8ZIJrwYVwBNgpGIgAASSgq5DR3npcAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAABB0lEQVR4XmNgGAWkAk8gngvEF4D4ERDfAOKFQDwLihuBWAWuGg+QB+IQIF4KxP+BOAHKh+GHUPFOIGaFaMEPJjFANKADbiBewQCRK0aTwwBKQPwciN+iS0ABLxAfZoAYBgoKnMCPAaLoNLoEFPAA8QEGiJoiVClU0MoAUQTyHjYgAsRXGSBqytHk4ADZtmhUKTjQZIB4G6TGF00ODpC9JYgmBwKMQDyfAaJmBxBzokojACFvKQLxEwaImgg0OTggxlugMAHJb2bA4xrkaAeFAzbwHohvMUASLk4wmwFiGyhLwAAHEOsD8SIg/gfEEkhyGACk8BMDxBBs+AsDJIC1YBpGwSgY9AAAb5U/Prauc8QAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAaCAYAAAAHfFpPAAADVklEQVR4Xu2YS6jNURSHl1DkGfKui6REGYiQkRTySCjPmYGJgQzIREpKTCQkKRkYKCVJSgY3Jh4TipQMLomQlKKQx/qss911299/T9fp3Mn56tftrL3Xf7/W3mvvK9KmTbMZrBoTjS1kiGp4NP4Po1WTVANjQYZRqquqjbGghUxV3Y7GvnBa9Vn1RvVK9VN1UjXSV3Iw+JuqA6oBoQwuq84FYdvjKzlmq86o7om1jxiY998p+f7MVG2IxroMVR1XHVWNdfYVqk+q52INRPaJddb7eDap9qt+qH43fqMOX8kxTrVeun0OSrcPuii2KF9Uqxs+nmdS/O1CJqruiA00x2bVL9WtWKC8U22JxgCrwuDfxoISVon5TIkFyhzVS9W3WCC2GOdVg2JBEdfFGjoh+RAGPnZFrJ6HzrE9yuBg6hTzZVXrMEws7GN7nvliUcCW8fD7o+pQsBdCI+z3XHgnmJhLYnU5bRPrpHrPpQ4RzktDWREzxKIFnyLSBMRvjlDdFZv0yqwwQWxQp6R49cGvop+AI6p57neO7WJ+XZIP5xxMLD5PY4GDgTNBy2OB2DnBBDKRpdAQe3tlLAikFfEhmbYFqbIMtgh+1K27L5nY5FPELrE6REKErfZVtSAWeNI+I1wImyKIDCKExl47e4qKqjAjTMs6E/3TlsEvNzggkrrE+pSL3LViZfwtJA0AxU54OBs4I/jgYWcn/3PilvlCCmXSW4TOxwyStkyRD+BDnQ+xoEGtCUgHW6eUD4LswMeeqMY7e50IoA18aSe3UtPFziEPKQyfC5L3YeJJ2dThDpIjpd3SCQD2StlMA5cO7gcLgz1NQByAh+/SEfZrhMH5iEo8FPMhEnIwaMq5EfL+yMG4qMNdohIGyC2vw9m4/28T24eznD2yV3qnoQTZ4pjqkXTfEhn0EtU1sQ52NuwJfLBHn8lik8jlZ6uUv0/S4Vy1sP9Yo3ovdlCdFTuBXzRsRauQWCy9V5e0yFuCgVRpd00fFum+akejfhnpgKxK7T1gRjlxOVy4h0+Tes7sxxvS827Q33Av+C7Vqb1pkLLmRmM/wsqTnViclvBAyt8RrYbnMxe8lsI/Qh5LH56hTYQFIEO0bOUjy8QO0P5ikVS/TNu0adPmL38AM/rF5U3V+tcAAAAASUVORK5CYII=>
