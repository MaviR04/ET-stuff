<!--
REVISION NOTES: delete this block before submission.
Applied: E1–E12 from CANTUS-REVISIONS.md, plus consistency fixes (§I, §II-A, §V intro, §VIII para 2, Table V wording, Fig. 1 caption).
Still open:
  - Figures 1–3 are in the docx; update Fig. 1 numbers to 181 → 181 → 168 → 150 → 28
  - Renumber the docx references using CANTUS-Citation-Report.md
-->

# Voice-Aware Tokenization for Symbolic Music Generation: A Systematic Review and Proposed Representation Framework

**[Your Name]**
APIIT School of Computing, Colombo, Sri Lanka
[your.email@students.apiit.lk]

---

## Abstract

Transformer language models consume symbolic music as flat token sequences that discard which melodic line each note belongs to. This paper presents a PRISMA 2020 systematic review of tokenization and representation for Transformer-based symbolic music generation. Searches of four digital libraries returned 181 records, from which 28 primary studies were synthesized. The evidence shows that compound representations have substantially mitigated the trade-off between metrical stability and sequence length, and that attention cost is no longer the main limit on long-form generation. It also shows that none of the widely used general-purpose tokenizers supplies voice identity to a generative model as an input field, and that no included study measures whether generated polyphony observes voice-leading convention. Earlier chorale models did order notes by voice, but they assumed exactly four voices that never enter or drop out. Six research gaps are identified. To address them, the paper proposes CANTUS, a four-layer framework that combines a voice-indexed compound representation able to handle a changing number of voices, a tiered voice-annotation pipeline, a contrapuntal evaluation suite, and an ablation and reporting protocol, together with a staged validation plan. Social, legal and ethical implications, including corpus provenance and the cultural bias of Western-derived notation, are critically evaluated.

**Index Terms**—Symbolic music generation, music information retrieval, tokenization, polyphony, voice separation, counterpoint, transformer models, systematic literature review.

---

## I. INTRODUCTION

A score encodes not only which pitches sound when, but how those pitches are grouped into lines. Counterpoint, voice-leading and orchestration are, at bottom, rules governing how such lines may move against one another.

Generalist audio models now generate waveforms from text prompts, but they struggle to control specific musical attributes or to represent culturally diverse music, because continuous acoustic space is disconnected from the discrete, hierarchical logic of music theory. Music Information Retrieval (MIR) has therefore turned to models operating on symbolic representations, in which music is a sequence of symbols modelled with natural language processing techniques [1]. To apply such models a score must be serialized: foundational work flattened scores into streams of note-on, note-off, velocity and time-shift events [2], and relative attention made minute-long coherent generation achievable [3].

This paper argues that serialization discards one property that matters. Widely adopted tokenizations record pitch, duration, velocity and instrument, but not the line a note belongs to, although MusicXML, MEI and \*\*kern encode it explicitly. Two consequences follow. Simultaneous notes carry no line identity, so the tokenizer orders them by pitch, an order that does not follow lines when they cross. And the properties that define good part-writing — parallel fifths, voice crossing, unresolved leading tones — cannot be measured on generated output without knowing which notes belong to which line.

The paper addresses this through a systematic review following PRISMA 2020 [4], guided by three research questions:

- **RQ1:** Which tokenization schemes and representations are used for Transformer-based symbolic music generation, and how are they organized?
- **RQ2:** How effectively do they handle polyphony, metrical structure and long-form coherence, and how is effectiveness measured?
- **RQ3:** What limitations, gaps, and social, legal and ethical concerns emerge from the evidence?

The contribution is fourfold: a synthesis of a literature fragmented across tokenization, attention, multi-track modelling and evaluation; six research gaps traced to their evidence, distinguished from trade-offs already substantially mitigated; CANTUS, a voice-aware representation and evaluation framework that, unlike earlier fixed-voice chorale models, handles voices entering and dropping out, as in fugal writing and piano textures, with a staged validation plan; and a critical evaluation of social, legal and ethical implications, including the cultural assumptions of Western notation. Section II reviews the literature, Section III the method, Section IV the findings, Section V the gaps, Section VI the proposal, Section VII the limitations, and Section VIII concludes.

---

## II. LITERATURE REVIEW

### A. Tokenization and Representation Frameworks

Event-based "MIDI-like" encoding flattens a score into a 388-token vocabulary of note-on, note-off, velocity and time-shift events [2], [3]. It models expressive timing well but carries no notion of beat or bar. REMI anchors events to a metrical grid with bar and position tokens, stabilizing rhythm at the cost of several tokens per event [5]. Compound Word (CP) representations ease this by grouping a note's attributes into one token at a single sequence position [6], as does MusicBERT's eight-field Octuple encoding [7]. Refinements compress super-tokens and learn their internal organization [8], decode sub-tokens sequentially rather than in parallel [9], or model attributes bidirectionally [10]. Two recent tokenizers depart from note events: PerTok encodes expressive microtiming while shortening sequences by up to 59% [11], and BEAT takes a uniform time step as its token unit, grouping all events within a step [12]. MuseTok learns discrete bar-level codes with a residual vector-quantized autoencoder and decodes them to REMI+ events for generation [13], and DadaGP introduces an event-based token format for guitar tablature that encodes instrument, string and fret [14].

Across all of these, compound fields describe a note as an acoustic event — pitch, duration, loudness, instrument. None describes its place in a melodic line.

### B. Attention and Long-Range Structure

Standard self-attention memory grows quadratically, ![][image1], where ![][image2] is sequence length and ![][image3] embedding dimension. The Music Transformer's relative attention reduced the memory needed for relative information to ![][image4] and produced minute-long coherent piano music [3]. Museformer attends finely to structurally related bars and coarsely to the rest, modelling sequences several times longer [15]. Reachable context now exceeds the length of most complete compositions.

### C. Multi-Track and Polyphonic Paradigms

MMM concatenates complete per-track sequences rather than interleaving events, relying on global attention to preserve cross-track coherence while enabling track- and bar-level control [16]. The Multitrack Music Transformer carries instrument identity in a compact multi-dimensional token [17], and REMI-z introduces a structured multitrack tokenization with disentangled content and style for arrangement tasks [18]. Two studies confront polyphony directly: a permutation-invariant language model treats the order of concurrent events as semantically empty [19], and PianoTree VAE learns a tree-structured latent representation of polyphonic texture [20]. These works carry *track* identity successfully, but a track is not a voice: one piano track routinely carries three or four independent lines.

Voice identity has been modelled directly, but only in four-part chorale generation. The Music Transformer serialized JSB Chorales on a sixteenth-note grid in fixed soprano–alto–tenor–bass order [3], and TonicNet preceded each step's four voices with a chord token [21]. DeepBach modelled each voice as its own sequence [22], and Coconet assigned each voice its own piano-roll channel [23]. BachBot, by contrast, ordered notes within a frame by descending pitch, and its authors note that this neglects crossing voices [24]. All of these assume exactly four voices, each sounding one note at every step. None allows voices to enter, drop out or change in number, which is the situation in fugal writing and in most piano music.

### D. Text-Native Formats

Large language models are more compatible with ABC notation than with MIDI-derived encodings. MuPT's Synchronized Multi-Track ABC enforces measure-level alignment across tracks beyond 8,192 tokens and is presented as validating a Symbolic Music Scaling Law, in which performance scales with parameters and data [25]. Datasets such as MetaScore pair large score collections with LLM-generated captions derived from forum metadata [26]. Libretto introduces an LLM-native text grammar with explicit per-bar voice blocks, in which simultaneous pitches within a voice are joined into chords [27]. Its voices, however, are declared source parts that map one-to-one to MIDI tracks, so a piano is a single voice and the voice set is fixed for the whole piece. ABC itself provides a multi-voice (`V:`) syntax, but a controlled comparison found that LLMs rarely emit it [28].

### E. Sequence Compression

Byte-Pair Encoding (BPE), implemented in MidiTok [29], merges frequent token pairs into supertokens, shortening sequences by up to 50% [30]; both BPE and Unigram segmentation improve structural metrics across melody, single-instrument and multi-instrument corpora [31]. BPE is instrumentation-dependent: polyphonic piano needs over ten times as many merges as monophonic music to reach comparable supertoken length [32]. The supertokens remain musically coherent — only 4.2% straddle a phrase boundary against 71% under random splitting, and BPE improves polyphonic phrase segmentation [32] — so the polyphonic difficulty lies in compression efficiency. Whether that cost stems from how simultaneous notes are ordered or from the sheer number of possible vertical pitch combinations is not established [32].

### F. Comparative Studies of Representational Choice

A small group of studies isolates representation as the experimental variable. Making time and duration explicit improves results in a task-dependent way [33], and pitch and metrical-grid encodings [34] and interval-based pitch tokenization [35] have been compared directly. Agogic holds a pretrained language model, data, budget and decoding fixed while swapping seven tokenizations, and finds that representation, not model size, is the binding variable for distributional fidelity [28]. A controlled comparison of three pianoroll-derived encodings finds that vocabulary learnability, not sequence compression, limits self-supervised piano models [36]. The Effectiveness–Losslessness Framework uses predictive codelength to decide what a tokenization should encode [37]. Its *Fact–Token Boundary* admits observation-determined structure into the token interface; its *Token–State Boundary* holds that context-dependent relations should be left to the model. Explicit musical time reduced predictive code, whereas fixed circle-of-fifths coordinates increased it [37]. Section VI-G applies this criterion to the proposal.

### G. Evaluation Methodology

The fuzzy definition of musical creativity has made subjective listening tests appear the only viable evaluation, despite their cost and poor reproducibility [38], while objective metrics capture surface statistics. SyMuRBench benchmarks symbolic representations on downstream tasks [39], Armor meta-evaluates the metrics themselves [40], and perception studies supply listener judgements [41]. None assesses voice-leading conformance. Table II summarizes the included studies.

---

## III. RESEARCH METHODS

This review followed the PRISMA 2020 statement [4] — identification, screening, eligibility and inclusion — because it makes study selection auditable and reproducible.

### A. Scope and Search Strategy

The window was January 2018 to 12 September 2026, starting in the year of the Music Transformer preprint that established relative attention for symbolic music; earlier work concerns recurrent architectures with different representational constraints. The end date is the date the final searches were run. Terms were grouped and joined with AND:

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

Studies were included if published within the window, in English, and reporting primary quantitative, ablation or human-assessment results. Criteria were set per research question. For RQ1 and RQ2, a study's **primary contribution** had to be a symbolic music representation, a comparison or evaluation of representations, or a compression scheme over them. For RQ3, studies whose primary contribution was an evaluation methodology for symbolic music generation, or the expressive scope of symbolic notation formats, were also admitted, because RQ3 concerns how effectiveness is measured and which musics a representation can express.

These criteria were adopted during screening, which is a deviation from a fixed protocol and is reported as such. Two earlier formulations were tried and rejected. The first admitted any generative model that consumes a tokenization, but that does not answer RQ1, since nearly every symbolic generation paper uses some tokenizer. The second admitted any study that investigates representation, which did not separate studies *about* representation from studies that merely *use* one. After the final criteria were fixed, they were re-applied to all 150 full texts. This excluded PianoTree VAE, which is not Transformer-based, and the MidiTok library, which reports no representational comparison and is cited as a software tool. It also admitted MuseTok, whose earlier exclusion was not consistent with the criteria. Exclusions covered audio-only work, studies with no bearing on generation or on representations used for it, applications of existing representations, secondary reviews, superseded versions, front matter and unavailable full texts.

### D. PRISMA Workflow

The four sources identified 181 records, all of which were retrieved. Removing 13 duplicates left 168 records for screening. Title and abstract screening excluded 18 (2 front matter, 16 off-topic), leaving 150 full texts. Of these, 122 were excluded: 14 audio-only; 88 non-generative, or applying an existing representation without proposing, comparing or evaluating one; 8 secondary reviews; 7 superseded versions; 2 on re-application of the final criteria (Section III-C); and 3 records first excluded on date, which were re-screened after the window was extended and excluded on topical grounds. 28 studies were included (Fig. 1).

> **Fig. 1.** PRISMA 2020 flow diagram of study selection (181 → 181 → 168 → 150 → 28).

### E. Data Extraction, Appraisal and Synthesis

A standardized form captured each study's representation, whether voice identity was encoded, corpus and provenance, polyphonic scope, evaluation measures, human assessment and stated limitations. Quality was banded high, medium or low on protocol clarity, dataset provenance, human assessment and reproducibility. Bands were used to weight findings rather than to exclude studies: where studies disagreed, or a finding rested on a single study, the higher-band evidence was given precedence and single low-band findings are flagged as tentative in the text. Heterogeneous metrics precluded meta-analysis, so a narrative synthesis was organized thematically (Fig. 2).

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
| [13] | MuseTok learned bar-level codes | No | Piano-focused |
| [14] | DadaGP tablature token format | By instrument (string, not line) | Guitar-specific |
| [18] | REMI-z multitrack tokens | Track only | Track, not line |
| [19] | Permutation-invariant LM | No | Order discarded, not recovered |
| [25] | MuPT, SMT-ABC | By staff | Corpus-bounded scaling |
| [27] | Libretto text grammar | By track (declared part) | Track, not line; fixed voice set |
| [28] | Agogic: seven-tokenization comparison; PMT stream | No (track/program) | Chords ordered by pitch |
| [30] | BPE for symbolic music | No | Instrumentation-dependent |
| [31] | Subword tokenization study | No | Objective metrics only |
| [32] | BPE mono vs polyphonic | No | Single segmentation task |
| [33] | Time/duration tokenizations | No | Task-dependent benefit |
| [34] | Pitch and grid encodings | No | One generation task |
| [35] | Interval-based pitch tokens | No | Analysis, not generation |
| [36] | Token granularity comparison | No | Understanding, not generation |
| [37] | Effectiveness–Losslessness | No | Limited corpora |
| [39] | SyMuRBench | No | Not generation quality |
| [40] | Armor meta-evaluation | No | Metrics, not music |
| [41] | Listener perception study | No | Not representation |
| [42] | MIDI-to-score conversion | Output only | Transcription, not input |
| [43] | U-MusT cross-modal | Notation-level | Voice not a token field |
| [44] | Polymeter in multiple formats | Format-dependent | Single work |
| [45] | Pentatonic-Net, Guqin | No | Single tradition |

---

## IV. RESULTS AND DISCUSSION

### A. RQ1: Representations and Their Organization

The included studies fall into five families (Table III): event-based [11], [14], [28], building on the MIDI-like encoding of [2]; grid-based [5], [36], [45]; compound [8]–[10], building on [6], [7]; step-based [12]; and text-native [25], [27]. MuseTok's learned bar-level codes [13] sit outside these families but decode to a grid-based stream. The trend is towards more information per sequence position, but that densification has added only *acoustic* attributes. Text-native formats are a partial exception, since staff and track markers exist, yet SMT-ABC synchronizes at measure rather than voice granularity [25], and Libretto's voices are tracks [27].

**TABLE III. TAXONOMY OF REPRESENTATIONS (RQ1)**

| Family | Time model | Attributes per position | Voice identity |
|---|---|---|---|
| Event-based | Relative shift | One | Absent |
| Grid-based | Bar and beat | One | Absent |
| Compound | Either | Four to eight | Absent |
| Step-based | Uniform step | Grouped by step | Absent |
| Text-native | Notated | Character-level | By staff or track [25], [27] |

### B. RQ2: Effectiveness and Its Measurement

Three findings emerge (Table IV). First, the trade-off between metrical stability and sequence economy has been substantially mitigated. Event encodings lack a metrical anchor [11], grid encodings fix this but lengthen sequences [5], and compound tokens, introduced in [6], [7], obtain both, although the order in which sub-tokens are decoded remains an open design question [8]–[10]. Comparative studies confirm the principle that explicit information helps, with task-dependent magnitude [33], [34]. Second, attention is no longer the main limit on length: among included studies, MuPT maintains alignment beyond 8,192 tokens [25], extending the relative and structured attention of earlier work [3], [15].

Third, the bottom row of Table IV is empty. No included study measures whether generated polyphony observes voice-leading convention, one of the most formalized bodies of knowledge in Western art music, because none of the included representations carries the line information such a measure needs. The benchmarking efforts do not close this: SyMuRBench tests representations on downstream tasks [39], Armor tests metrics [40], and perception studies test listeners [41].

**TABLE IV. REPORTED CAPABILITY BY FAMILY (RQ2)**

| Capability | Event | Grid | Compound | Step | Text |
|---|---|---|---|---|---|
| Metrical stability | Weak | Strong | Strong | Strong | Strong |
| Sequence economy | Moderate | Weak | Strong | Strong | Moderate |
| Expressive timing | Strong | Weak | Moderate | Weak | Weak |
| Multi-track control | Absent | Limited | Strong | Limited | Strong |
| Contrapuntal fidelity | Not measured | Not measured | Not measured | Not measured | Not measured |

*Rating rule:* **Strong** means the family's included studies report this capability as a design goal and demonstrate it empirically. **Moderate** means it is demonstrated with qualifications or partial support. **Weak/Limited** means it is not a design goal and reported results show a disadvantage or no support. **Absent** means the capability is not representable. *Sources by family:* Event [11], [14], [28]; Grid [5], [34], [36], [45]; Compound [8]–[10]; Step [12]; Text [25], [27].

### C. RQ3: Limitations, and Social, Legal and Ethical Implications

**TABLE V. CHALLENGES IDENTIFIED (RQ3)**

| Challenge | Evidence | Consequence |
|---|---|---|
| Line identity absent from inputs | [5], [18], [42]; cf. [3], [21]–[23] | Counterpoint unmodellable |
| Pitch-ordered, not line-ordered, simultaneity | [19], [28], [32] | Wasted capacity; BPE cost |
| No agreed evaluation | [38], [40] | Claims unverifiable |
| Corpus scale and licensing | [26], [46] | Scaling claim untestable |
| Long context ≠ musical form | [25]; cf. [15], [47] | Sectional coherence open |
| Western notation assumptions | [44], [45] | Other traditions distorted |

#### 1) Provenance and intellectual property

Large corpora are scraped from user repositories: MetaScore holds roughly 963,000 scores [26] and the Lakh MIDI Dataset on the order of 10⁵ files [46]. Many are user transcriptions of copyrighted works, in which neither the uploader nor the dataset builder holds the rights. No study in the corpus reports the licence status of its training data.

#### 2) Authorship of generated works

Symbolic output is directly editable and publishable, so reproduction of a training phrase is explicit and machine-checkable. Yet no study publishes contamination checks, so the rate of verbatim reproduction is unknown.

#### 3) Cultural bias in representation

Nearly every surveyed representation assumes twelve-tone equal temperament, a bar-and-beat grid and discrete onsets. The corpus supplies direct evidence of the cost: models built for twelve-tone systems produce modal errors on pentatonic Guqin repertoire and needed a modified serialization with scale constraints [45], and encoding one polymetric work in several formats shows that the format silently decides which metrical structures are expressible [44]. Maqam, raga, gamelan and cyclic West African time-lines fit such grids only by distortion. Symbolic representation therefore relocates the cultural failure of audio models into the tokenizer, where it is harder to see — a critique this paper's own proposal must also face (Section VI-G).

#### 4) Deskilling

Symbolic generation targets arrangement and accompaniment writing, the routine work through which early-career arrangers acquire their craft. This paper argues that adoption to cut costs would fall on them first. It is a labour question that none of the included studies raises, and one this review can identify but not measure.

### D. Critical Cross-Study Comparison

Studies differ in metrics, corpora, sequence lengths and decoding, so reported scores describe whole pipelines rather than representations. The comparative studies [28], [33]–[37] are the exception worth following: each holds the pipeline fixed and varies only the representation. Elsewhere, divergent conclusions cannot be adjudicated without a shared benchmark, and SyMuRBench [39] does not extend to generation.

---

## V. GAP IDENTIFICATION AND ANALYSIS

Six gaps follow. Substantially mitigated trade-offs — metrical stability versus length, and attention cost — are deliberately excluded.

**G1: Voice identity is absent from the inputs of general-purpose tokenizers.** None of the widely used general-purpose tokenizers (REMI, Compound Word, Octuple, and their MidiTok implementations) supplies the melodic line of a note as an input field [5], [18], [28], [30], [33]; formats as introduced in [6], [7]. Voice has been supplied as input only in four-part chorale models, as fixed sequence positions, separate per-voice sequences or separate channels [3], [21]–[23], and never as a token field that allows the number of voices to change. The closest recent case, Libretto, labels note blocks by voice, but its voices are tracks declared once per piece [27]. MIDI-to-score conversion already predicts staff assignment and stem direction, which in piano notation encode voice membership [42], and cross-modal translation operates on notation-level structure [43]. Line identity is thus predictable, and predicted as *output*, but in current general-purpose tokenizers it is not supplied to a generative model as *input*, which must instead re-infer it from pitch proximity.

**G2: No widely used tokenizer orders simultaneous notes by persistent voice, and existing remedies collapse lines further.** General-purpose tokenizers order simultaneous notes deterministically, typically by pitch; in the controlled comparison of [28], for example, ties are broken "by ascending pitch so that chord tones follow a canonical low-to-high order". But pitch order changes whenever voices cross, so it does not follow lines. Polyphonic piano needs over ten times as many BPE merges as monophonic music [32], although how much of that cost is due to ordering is unknown. Permutation-invariant modelling [19] and step-based grouping [12] address ordering by treating the vertical slice as unordered or fused. The Music Transformer's chorale serialization did order notes by persistent voice [3], but only for a fixed set of four voices, each sounding in every time step. No representation orders notes by persistent voice when voices enter, drop out or change in number.

**G3: No agreed evaluation methodology exists.** Subjective tests are costly and irreproducible [38], and benchmarking efforts [39]–[41] do not cover contrapuntal generation quality, so results remain incomparable.

**G4: Contrapuntal quality is unmeasurable.** Voice-leading rules are rigorous and automatable, but cannot be applied without line membership. G4 is the joint product of G1 and G3.

**G5: Corpus scale and provenance bound the scaling argument.** The Symbolic Music Scaling Law depends on data [25], yet symbolic corpora are orders of magnitude smaller than text [26], [46] and inconsistently licensed.

**G6: Song-scale form is not solved by longer context.** Attention spans whole pieces [15], [25], but developing and returning to themes is a compositional problem; explicit form modelling offers one route [47], and the right strategy is unresolved.

The gaps interlock. G1 sustains G2, because line identity is exactly what would make ordering follow lines, and current remedies to G2 entrench G1. G1 and G3 produce G4. G5 constrains remedies to G1, since voice-annotated data is scarcer still. Piecemeal fixes are unlikely to succeed.

---

## VI. PROPOSED SOLUTION: THE CANTUS FRAMEWORK

CANTUS (Counterpoint-Aware Notation Tokenization and Understanding Schema) treats voice identity as a structural field equal in standing to pitch and duration (Fig. 3). Making it explicit turns currently unmeasurable properties into computable ones.

> **Fig. 3.** The four CANTUS layers and the gaps each addresses, with REMI, CP and CANTUS token streams compared for one four-voice excerpt.

### A. Layer 1: Voice-Indexed Compound Representation

Layer 1 adds two fields to the compound token [6]–[8]. The **voice index** is a persistent line identifier: each line keeps the same index for its whole duration, and indices are assigned in order of each line's register when it first enters, highest first. Because the index belongs to the line, not to its current height, voice crossings stay visible rather than being silently re-ranked. A voice may hold several simultaneous notes. A left-hand block chord, for example, is one voice sounding three notes, ordered by pitch within the voice. The **voice-state flag** marks whether a note enters, continues or ends its line, so the number of active voices can change through fugal entries, episodes and cadential thinning. This is the capability that fixed-voice chorale models lack [3], [21]–[23]. Notes sharing an onset are emitted in voice-index order, and at unisons the lower index comes first. Unlike fusion or permutation invariance [12], [19], this makes ordering both deterministic and meaningful. Whether it also reduces polyphonic BPE cost [32] is tested as a hypothesis in Stage 1, not assumed. Both fields enter a factorized embedding, so parameters grow linearly with the maximum voice count. **Addresses G1 and G2.**

### B. Layer 2: Voice Annotation and Corpus Construction

**Tier 1** uses natively voiced sources — MusicXML, MEI, \*\*kern and chorale corpora — with annotation confidence 1.0, forming the calibration and evaluation set; transcription systems that predict stem direction [42] can extend it. **Tier 2** applies voice separation to unvoiced MIDI, using contig mapping [48] or graph-based link prediction [49], and records the separator's confidence. **Tier 3** retains unreliable material with a null voice field, degrading gracefully to a standard compound encoding. Every item records source, licence status, tier and confidence, bringing provenance inside corpus construction. **Addresses G1; partly G5.**

### C. Layer 3: Contrapuntal Evaluation Suite

With line membership explicit, five measures become computable and are reported separately: **voice-crossing rate** against the corpus distribution; **voice-count stability**, detecting silently dropped lines; **line independence**, the mean pairwise contour correlation between voices; **rule-violation counts** for parallel fifths and octaves, unresolved leading tones and augmented leaps under a declared idiom rule set; and **interval-class divergence** from the corpus. Contrapuntal measures assume one pitch per line at a time, so they apply directly to single-note voices. For voices sounding chords, only the lowest sounding note of the whole texture is evaluated, as the bass line, following harmonic convention. Upper chordal voices are excluded from contrapuntal measures and reported as such. The measures are diagnostic, not a quality score: passing them does not make music good, but failing them shows it is not in the claimed idiom — a judgement current benchmarks [39], [40] cannot make. **Addresses G3 and G4.**

### D. Layer 4: Ablation Protocol and Representation Card

Following the comparative studies [33]–[35], [37], any representational claim must be reported against a **voice-blind baseline** identical except for the ablated voice fields. Each evaluation emits a **representation card** recording tokenizer configuration, annotation tier distribution and confidence, corpus provenance and licence, decoding settings and contamination checks, making the pipeline the declared unit of evaluation. **Addresses G3; supports G5.**

### E. Mapping to the Identified Gaps

**TABLE VI. MAPPING OF GAPS TO CANTUS COMPONENTS**

| Gap | Component | Expected effect |
|---|---|---|
| G1 Voice absent from inputs | Layers 1, 2 | Line membership becomes a model input |
| G2 Pitch-ordered simultaneity | Layer 1 | Deterministic, line-preserving order |
| G3 No agreed evaluation | Layers 3, 4 | Shared suite and declared protocol |
| G4 Counterpoint unmeasurable | Layers 1, 3 | Voice-leading becomes computable |
| G5 Corpus and provenance | Layers 2, 4 | Provenance recorded; data retained |
| G6 Song-scale form | Not addressed | Architectural, not representational |

CANTUS does not address G6; claiming one mechanism solves every gap would reduce credibility.

### F. Validation Plan

**Stage 1, representation pilot:** train matched models on the fugues of J.S. Bach's *Well-Tempered Clavier* in David Huron's Humdrum encoding, which places each voice of all 48 fugues on its own spine [50], and test on *The Art of Fugue*, a held-out work by the same composer in which voices enter one by one and thin out in episodes and at cadences. Three arms are compared: a voice-blind compound baseline; a fixed-slot baseline that assigns a fixed number of voice positions in the manner of chorale models [3]; and CANTUS with voice-state flags. Measures are held-out likelihood on the shared pitch, duration and onset fields (so that models predicting extra voice fields are not penalized), rule-violation counts and post-BPE sequence length. Because the *Well-Tempered Clavier* is keyboard music, its voice labels come from an editor, not the composer. A stratified sample of 10 fugues (about 20%), drawn from both books and covering every voice count from the two-voice E minor fugue (BWV 855) to the five-voice C♯ minor and B♭ minor fugues (BWV 849, 867), is hand-checked against persistent lines before training, and the agreement rate is reported. *The Art of Fugue*, written in open score, provides composer-given voices for testing. The stage is cheap and falsifiable: if CANTUS improves neither likelihood nor conformance over the fixed-slot baseline, the claimed value of variable voice handling fails. **Stage 2, annotation robustness:** repeat with Tier 2 separated [48], [49] and synthetically degraded annotations to measure how separator error erodes the benefit. **Stage 3, perceptual validation:** test whether each Layer 3 measure correlates with expert ratings of part-writing; a suite that predicts nothing about expert judgement would reproduce G3.

### G. Implementation Challenges

**Token–State Boundary objection.** The Effectiveness–Losslessness Framework holds that context-dependent relations should be left to the model rather than fixed by the tokenizer [37], and inferred voice membership is such a relation. In Tier 1, however, voice is an observation-determined fact written by the composer, on the Fact side where that framework says structure should enter the token — as with explicit musical time, which reduced predictive code. Tier 2 fixes an inferred relation and does fall under the objection, a principled reason to treat it as provisional; Stage 2 tests it.

**Annotation scarcity.** Tier 1 data is small and Tier 2 inherits separator error; confidence recording exposes but does not remove it.

**Cultural specificity.** The discrete contrapuntal voice is a Western category that fits heterophonic traditions poorly, and imposing it would repeat the bias documented for pentatonic repertoire [45]. The voice field is therefore optional, coverage is reported per tradition, and CANTUS is proposed only for line-based idioms.

**Rule-set specificity.** Layer 3 rules encode common-practice conventions, so the rule set is a declared evaluation parameter rather than a fixed component.

---

## VII. LIMITATIONS OF THIS REVIEW

The review covers English-language work in four databases, so other languages, grey literature and industry practice may be missed. ISMIR was searched by indexed web search rather than database query. A single reviewer screened and appraised studies, so inter-rater agreement is unavailable. The search terms contained no voice-, chorale- or counterpoint-specific vocabulary, so the claims in G1, G2 and G4 are bounded by what the queries could retrieve. Four-part chorale models that do encode voice [3], [21]–[24] were identified after screening, outside the systematic search, and are discussed as prior art rather than included studies. Symbolic evaluation toolkits and rule-based chorale evaluation were likewise not systematically searched. The inclusion criteria were adopted during screening rather than pre-registered (Section III-C). Per-record decisions were not logged during the first screening pass, so the stage at which three records were originally excluded is inferred rather than recorded. The corpus is dominated by Western tonal music, which partly explains the prominence of counterpoint here. Finally, CANTUS is not empirically validated, and the effects in Table VI are argued rather than demonstrated.

---

## VIII. CONCLUSION AND FUTURE WORK

This review synthesized 28 primary studies selected under PRISMA 2020. The field has substantially mitigated its most-discussed problems: compound representations eased the trade-off between metrical stability and sequence length, although sub-token decoding order remains an active concern [9], [10], and attention cost is no longer the main limit on long-form generation. What remains is a representational omission with measurement consequences. None of the widely used general-purpose tokenizers supplies a generative model with the line a note belongs to, although source formats carry it and transcription systems predict it. Earlier chorale models ordered notes by voice, but only under a fixed four-voice assumption [3], [21]–[23]. As a result, simultaneous notes are ordered by pitch rather than by line, existing remedies fuse lines rather than recover them, and voice-leading cannot be evaluated on generated output in the representations the field now uses.

Six gaps were identified, and CANTUS was proposed to address the four that sustain one another, centred on a representation that handles a changing number of voices, through a voice-indexed representation, tiered annotation with provenance, a contrapuntal evaluation suite and a voice-blind ablation protocol. Future work begins with the falsifiable fugue pilot of Section VI-F, then extends voice-aware representation to traditions not organized around independent lines, integrates it with explicit form modelling [47], and builds a licensed, provenance-documented symbolic corpus large enough to test the claimed scaling behaviour.

---

## REFERENCES

[1] S. Ji, X. Yang, and J. Luo, "A Survey on Deep Learning for Symbolic Music Generation: Representations, Algorithms, Evaluations, and Challenges," *ACM Computing Surveys*, vol. 56, no. 1, art. 7, 2023. doi: 10.1145/3597493

[2] S. Oore, I. Simon, S. Dieleman, D. Eck, and K. Simonyan, "This Time with Feeling: Learning Expressive Musical Performance," *Neural Computing and Applications*, vol. 32, pp. 955–967, 2020. doi: 10.1007/s00521-018-3758-9

[3] C.-Z. A. Huang, A. Vaswani, J. Uszkoreit, N. Shazeer, I. Simon, C. Hawthorne, A. M. Dai, M. D. Hoffman, M. Dinculescu, and D. Eck, "Music Transformer: Generating Music with Long-Term Structure," in *Proc. Int. Conf. on Learning Representations (ICLR)*, 2019. arXiv:1809.04281

[4] M. J. Page et al., "The PRISMA 2020 Statement: An Updated Guideline for Reporting Systematic Reviews," *BMJ*, vol. 372, p. n71, 2021. doi: 10.1136/bmj.n71

[5] Y.-S. Huang and Y.-H. Yang, "Pop Music Transformer: Beat-based Modeling and Generation of Expressive Pop Piano Compositions," in *Proc. 28th ACM Int. Conf. on Multimedia*, pp. 1180–1188, 2020. doi: 10.1145/3394171.3413671

[6] W.-Y. Hsiao, J.-Y. Liu, Y.-C. Yeh, and Y.-H. Yang, "Compound Word Transformer: Learning to Compose Full-Song Music over Dynamic Directed Hypergraphs," in *Proc. AAAI Conf. on Artificial Intelligence*, vol. 35, no. 1, pp. 178–186, 2021. doi: 10.1609/aaai.v35i1.16091

[7] M. Zeng, X. Tan, R. Wang, Z. Ju, T. Qin, and T.-Y. Liu, "MusicBERT: Symbolic Music Understanding with Large-Scale Pre-Training," in *Findings of ACL-IJCNLP*, pp. 791–800, 2021. doi: 10.18653/v1/2021.findings-acl.70

[8] L. Zhou, L. Yin, and Y. Qian, "A Novel Compressive Compound Word Encoding and Independent Word Attention for Symbolic Music Generation," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, pp. 1–5, 2025. doi: 10.1109/ICASSP49660.2025.10889355

[9] H. Yoo, H.-W. Dong, J. Jung, and D. Jeong, "Nested Music Transformer: Sequentially Decoding Compound Tokens in Symbolic Music and Audio Generation," in *Proc. 25th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2024. arXiv:2408.01180

[10] H. Su, K. Li, L. Yang, H. Zhang, and Y.-Z. Song, "Amadeus: Autoregressive Model with Bidirectional Attribute Modelling for Symbolic Music," arXiv:2508.20665, 2025.

[11] J. Lenz and A. Mani, "PerTok: Expressive Encoding and Modeling of Symbolic Musical Ideas and Variations," arXiv:2410.02060, 2024.

[12] L. Qian, H. Gu, J. Zhao, and Z. Wang, "BEAT: Tokenizing and Generating Symbolic Music by Uniform Temporal Steps," arXiv:2604.19532, 2026.

[13] J. Huang, Z. Novack, P. Long, Y. Hou, K. Chen, T. Berg-Kirkpatrick, and J. McAuley, "MuseTok: Symbolic Music Tokenization for Generation and Semantic Understanding," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, pp. 3956–3960, 2026. doi: 10.1109/ICASSP55912.2026.11463020

[14] P. Sarmento, A. Kumar, C. J. Carr, Z. Zukowski, M. Barthet, and Y.-H. Yang, "DadaGP: A Dataset of Tokenized GuitarPro Songs for Sequence Models," in *Proc. 22nd Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2021. arXiv:2107.14653

[15] B. Yu, P. Lu, R. Wang, W. Hu, X. Tan, W. Ye, S. Zhang, T. Qin, and T.-Y. Liu, "Museformer: Transformer with Fine- and Coarse-Grained Attention for Music Generation," in *Advances in Neural Information Processing Systems (NeurIPS)*, 2022. arXiv:2210.10349

[16] J. Ens and P. Pasquier, "MMM: Exploring Conditional Multi-Track Music Generation with the Transformer," arXiv:2008.06048, 2020.

[17] H.-W. Dong, K. Chen, S. Dubnov, J. McAuley, and T. Berg-Kirkpatrick, "Multitrack Music Transformer," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, pp. 1–5, 2023. doi: 10.1109/ICASSP49357.2023.10094628

[18] L. Ou, J. Zhao, Z. Wang, G. Xia, Q. Liang, T. Hopkins, and Y. Wang, "Unifying Symbolic Music Arrangement: Track-Aware Reconstruction and Structured Tokenization," in *Advances in Neural Information Processing Systems (NeurIPS)*, 2025. arXiv:2408.15176

[19] J. Liu, Y. Dong, Z. Cheng, X. Zhang, X. Li, F. Yu, and M. Sun, "Symphony Generation with Permutation Invariant Language Model," in *Proc. 23rd Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2022. arXiv:2205.05448

[20] Z. Wang et al., "PianoTree VAE: Structured Representation Learning for Polyphonic Music," in *Proc. 21st Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2020.

[21] O. Peracha, "Improving Polyphonic Music Models with Feature-Rich Encoding," in *Proc. 21st Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2020. doi: 10.5281/zenodo.4245396

[22] G. Hadjeres, F. Pachet, and F. Nielsen, "DeepBach: A Steerable Model for Bach Chorales Generation," in *Proc. 34th Int. Conf. on Machine Learning (ICML)*, PMLR vol. 70, pp. 1362–1371, 2017. arXiv:1612.01010

[23] C.-Z. A. Huang, T. Cooijmans, A. Roberts, A. Courville, and D. Eck, "Counterpoint by Convolution," in *Proc. 18th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2017. arXiv:1903.07227

[24] F. T. Liang, M. Gotham, M. Johnson, and J. Shotton, "Automatic Stylistic Composition of Bach Chorales with Deep LSTM," in *Proc. 18th Int. Society for Music Information Retrieval Conf. (ISMIR)*, pp. 449–456, 2017.

[25] X. Qu, Y. Bai, Y. Ma, Z. Zhou, K. M. Lo, J. Liu, R. Yuan, et al., "MuPT: A Generative Symbolic Music Pretrained Transformer," in *Proc. Int. Conf. on Learning Representations (ICLR)*, 2025. arXiv:2404.06393

[26] W. Xu, J. McAuley, T. Berg-Kirkpatrick, S. Dubnov, and H.-W. Dong, "Generating Symbolic Music from Natural Language Prompts using an LLM-Enhanced Dataset," in *Proc. 26th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2025. arXiv:2410.02084

[27] Y. Xu, "Libretto: Giving LLM Agents a Sense of Musical Structure," arXiv:2606.22708, 2026.

[28] J. Chen et al., "Agogic: Performance-Timed Music Tokens for LLM-Native Text-to-Symbolic-Music Generation," arXiv:2608.03999, 2026.

[29] N. Fradet, J.-P. Briot, F. Chhel, A. El Fallah Seghrouchni, and N. Gutowski, "MidiTok: A Python Package for MIDI File Tokenization," in *Extended Abstracts for the Late-Breaking Demo Session, 22nd ISMIR*, 2021. [Online]. Available: https://archives.ismir.net/ismir2021/latebreaking/000005.pdf

[30] N. Fradet, N. Gutowski, F. Chhel, and J.-P. Briot, "Byte Pair Encoding for Symbolic Music," in *Proc. Conf. on Empirical Methods in Natural Language Processing (EMNLP)*, 2023. arXiv:2301.11975

[31] A. Kumar and P. Sarmento, "From Words to Music: A Study of Subword Tokenization Techniques in Symbolic Music Generation," arXiv:2304.08953, 2023.

[32] D.-V.-T. Le, L. Bigo, and M. Keller, "Analyzing Byte-Pair Encoding on Monophonic and Polyphonic Symbolic Music: A Focus on Musical Phrase Segmentation," in *Proc. 3rd Workshop on NLP for Music and Audio (NLP4MusA)*, 2024. arXiv:2410.01448

[33] N. Fradet, N. Gutowski, F. Chhel, and J.-P. Briot, "Impact of Time and Note Duration Tokenizations on Deep Learning Symbolic Music Modeling," in *Proc. 24th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2023. arXiv:2310.08497

[34] Y. Li, S. Li, and G. Fazekas, "A Comparative Analysis of Different Pitch and Metrical Grid Encoding Methods in the Task of Sequential Music Generation," arXiv:2301.13383, 2023.

[35] D.-V.-T. Le, L. Bigo, and M. Keller, "Evaluating Interval-based Tokenization for Pitch Representation in Symbolic Music Analysis," arXiv:2501.04630, 2025.

[36] H. Gu and Q. Liu, "Token Granularity Matters: A Comparative Study of Encoding Schemes for Self-Supervised Piano Music Representation Learning," in *Proc. 7th Int. Conf. on Computer Information and Big Data Applications (CIBDA)*, pp. 200–204, 2026. doi: 10.1145/3813822.3813854

[37] Y. Wang, "How Far Should Tokenization Go? Predictive Effectiveness and Relational Losslessness," arXiv:2608.18025, 2026.

[38] L.-C. Yang and A. Lerch, "On the Evaluation of Generative Models in Music," *Neural Computing and Applications*, vol. 32, no. 9, pp. 4773–4784, 2020. doi: 10.1007/s00521-018-3849-7

[39] P. Strepetov and D. Kovalev, "SyMuRBench: Benchmark for Symbolic Music Representations," in *Proc. 3rd Int. Workshop on Multimedia Content Generation and Evaluation: New Methods and Practice*, pp. 138–146, 2025. doi: 10.1145/3746278.3759392

[40] S. Wang, Z. Bao, and J. E, "Armor: A Benchmark for Meta-evaluation of Artificial Music," in *Proc. 29th ACM Int. Conf. on Multimedia*, pp. 5583–5590, 2021. doi: 10.1145/3474085.3475700

[41] H. Chu, J. Kim, S. Kim, H. Lim, H. Lee, S. Jin, J. Lee, T. Kim, and S. Ko, "An Empirical Study on How People Perceive AI-generated Music," in *Proc. 31st ACM Int. Conf. on Information and Knowledge Management (CIKM)*, pp. 304–314, 2022. doi: 10.1145/3511808.3557235

[42] T. Beyer and A. Dai, "End-to-end Piano Performance-MIDI to Score Conversion with Transformers," in *Proc. 25th Int. Society for Music Information Retrieval Conf. (ISMIR)*, 2024. arXiv:2410.00210

[43] J. Jung et al., "U-MusT: A Unified Framework for Cross-Modal Translation of Score Images, Symbolic Music, and Performance Audio," *IEEE Trans. Audio, Speech and Language Processing*, vol. 34, pp. 1876–1891, 2026. doi: 10.1109/TASLPRO.2025.3648794

[44] L. Hofmann, C. S. Sapp, and F. C. Moss, "Encoding Polymeter: A Corpus of Hugo Distler's 'Der Jahrkreis' op. 5 in Different Symbolic Formats," in *Proc. 13th Int. Conf. on Digital Libraries for Musicology (DLfM)*, pp. 47–55, 2026. doi: 10.1145/3815723.3815729

[45] N. Li, Q. Xiao, and X. Yin, "Pentatonic-Net: Structure-Aware Symbolic Guqin Generation via Constrained Transformer Decoding," in *Proc. 9th Int. Conf. on Artificial Intelligence and Big Data (ICAIBD)*, pp. 422–425, 2026. doi: 10.1109/ICAIBD69640.2026.11637240

[46] C. Raffel, "Learning-Based Methods for Comparing Sequences, with Applications to Audio-to-MIDI Alignment and Matching," Ph.D. dissertation, Columbia University, 2016.

[47] Z. Wang, L. Min, and G. Xia, "Whole-Song Hierarchical Generation of Symbolic Music Using Cascaded Diffusion Models," in *Proc. Int. Conf. on Learning Representations (ICLR)*, 2024. arXiv:2405.09901

[48] E. Chew and X. Wu, "Separating Voices in Polyphonic Music: A Contig Mapping Approach," in *Computer Music Modeling and Retrieval (CMMR)*, LNCS vol. 3310, Springer, pp. 1–20, 2005. doi: 10.1007/978-3-540-31807-1_1

[49] E. Karystinaios, F. Foscarin, and G. Widmer, "Musical Voice Separation as Link Prediction: Modeling a Musical Perception Task as a Multi-Trajectory Tracking Problem," in *Proc. 32nd Int. Joint Conf. on Artificial Intelligence (IJCAI)*, pp. 3866–3874, 2023. arXiv:2304.14848

[50] D. Huron (encoder), "J. S. Bach, The Well-Tempered Clavier, Books I and II: Fugues" [Humdrum \*\*kern digital edition]. [Online]. Available: https://github.com/humdrum-tools/bach-wtc-fugues

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAaCAYAAAAUqxq7AAADzElEQVR4Xu2YW4hOURTHl1DuhFyixiASRQmRPEguuSQUuTwrRskD8TQl5ZKSkEjyICmFJNeHiRd5okiJGhJREkUhl/Vrnf3NPnvO2ecwM8039f3qn761r2evtfbaQ6RGl6O7aqnqqGqWqlu6uevTUzU4NJZkkqpZtVnVQ3Uh+T2qpUubGSi2x3ZjkGqkmGeLYPHLqtVhQ0kmqt6rDie/d6m+qqZXerQdovNuaPwfjqu+qN6qXqt+iYX9AL+TB4dzQ7VbstPioupUIGzb/U5KHzFnMMdZ1RtVfaqHMU91RvVIbH/oirTMfUK1RtXbDfDYqKoLjWVhwkOq/aohnn2R6pPquWq8Z3fsVD2Q9BgfNktE/FT9SX6jvI1OFosm5s06cMYx/oDYfNuS3044CzsHNy0Z4yDFOMR/TrURqntiB5HFWtVv1e2wQexj1oXGgFVim34XNmRwRywai1J7h9ic/cIGZaFYipIFIWQH+ynNNbGFjki2x4CL85JYPx8uUdIvBh/QJDaWSMqDtRuSf2GrampLc4rhqpfSej8+y8XahwZ2CsF31ezAnguTcNJZ6eNg0+fF+vby7Cuk2BtUqI9iKTY3aHMwPyl1WixNtohFKweRBfMwXywi3QGNDewzVN8k7qwKbIBJjkl+9IAfBf4B7ZN8Lzs2iI1rlvyyzRyEPv2cqDh9/U4efBx9rocNHm5dHORDZX4llhFkRhQigLtlcdgQgBfwlh/SLu1YMAYpyLhSGyqBn+44KA+3brg/5+z7qv7ppjR4By8VdSSyiDAWo/Q63EJZl6QPlyUhTWhnUTQ+ZIGYU5slPyJ5P7Gu71Cfc2JRFB5eCveBKLZJ7ibuKBbb69l5/1DeY2OBcU+l9WUJHH5RBQwhalx6+enu0yjW50lgd5Q6IHfxNkn8I6lubrFhnr1MBLEGY1kn646rl/yLOA+injnzLtkxYhWOB27Wy959d+EBAYvkedfBQryPZgZ2d0CxD2RePobSGsJG/YgsC3dhrCLyEGTNvIem2zeHGNt7BQ6AV3KdZ+ORtl4sjyd49hAea3kbJfwPiv1J4F7ZbHiO6qrYRzQl9rLwcYzj7z73Gmav41R7VJ9V8yX7YByu4BS93yosU30Qu0hPiuX4i8RGqYzBYyuMjqySnaeGZEwRS6T1WF8/VDfF3j5FULkJiqLKnQIvcPNzYa4Uy+OYFxxc1LHLshohcp5JyfRqD3glTwmNVQyH0xgaO5KHEv87rtqgKI0OjR0N5fSx5P8XRjXAdXBLOtGRVI/Y07+zoexvCo01atSoUY38BWAc2ubh6FQYAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAaCAYAAACHD21cAAAAs0lEQVR4XmNgGHkgAIjnAvEsNDwTiIWR1GEAXSAOAeKlQPwfiLOhfGcgZkVShxNMYoBoZESXwAc0gfgtEH9FlyAEghggtp1GlyAEYM6cgy6BD/AC8WEGiMZoNDm8ANmZgmhyIMDMgCPACDnTEohZ0AVBNoBswuVMkE2T0QVBADkajNHkQAAkdhxdEATWMkBsA6UamD+kgTgZiD8C8T8gdoGKgwHI3T8ZIJrwYVwBNgpGIgAASSgq5DR3npcAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAABB0lEQVR4XmNgGAWkAk8gngvEF4D4ERDfAOKFQDwLihuBWAWuGg+QB+IQIF4KxP+BOAHKh+GHUPFOIGaFaMEPJjFANKADbiBewQCRK0aTwwBKQPwciN+iS0ABLxAfZoAYBgoKnMCPAaLoNLoEFPAA8QEGiJoiVClU0MoAUQTyHjYgAsRXGSBqytHk4ADZtmhUKTjQZIB4G6TGF00ODpC9JYgmBwKMQDyfAaJmBxBzokojACFvKQLxEwaImgg0OTggxlugMAHJb2bA4xrkaAeFAzbwHohvMUASLk4wmwFiGyhLwAAHEOsD8SIg/gfEEkhyGACk8BMDxBBs+AsDJIC1YBpGwSgY9AAAb5U/Prauc8QAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAaCAYAAAAHfFpPAAADVklEQVR4Xu2YS6jNURSHl1DkGfKui6REGYiQkRTySCjPmYGJgQzIREpKTCQkKRkYKCVJSgY3Jh4TipQMLomQlKKQx/qss911299/T9fp3Mn56tftrL3Xf7/W3mvvK9KmTbMZrBoTjS1kiGp4NP4Po1WTVANjQYZRqquqjbGghUxV3Y7GvnBa9Vn1RvVK9VN1UjXSV3Iw+JuqA6oBoQwuq84FYdvjKzlmq86o7om1jxiY998p+f7MVG2IxroMVR1XHVWNdfYVqk+q52INRPaJddb7eDap9qt+qH43fqMOX8kxTrVeun0OSrcPuii2KF9Uqxs+nmdS/O1CJqruiA00x2bVL9WtWKC8U22JxgCrwuDfxoISVon5TIkFyhzVS9W3WCC2GOdVg2JBEdfFGjoh+RAGPnZFrJ6HzrE9yuBg6hTzZVXrMEws7GN7nvliUcCW8fD7o+pQsBdCI+z3XHgnmJhLYnU5bRPrpHrPpQ4RzktDWREzxKIFnyLSBMRvjlDdFZv0yqwwQWxQp6R49cGvop+AI6p57neO7WJ+XZIP5xxMLD5PY4GDgTNBy2OB2DnBBDKRpdAQe3tlLAikFfEhmbYFqbIMtgh+1K27L5nY5FPELrE6REKErfZVtSAWeNI+I1wImyKIDCKExl47e4qKqjAjTMs6E/3TlsEvNzggkrrE+pSL3LViZfwtJA0AxU54OBs4I/jgYWcn/3PilvlCCmXSW4TOxwyStkyRD+BDnQ+xoEGtCUgHW6eUD4LswMeeqMY7e50IoA18aSe3UtPFziEPKQyfC5L3YeJJ2dThDpIjpd3SCQD2StlMA5cO7gcLgz1NQByAh+/SEfZrhMH5iEo8FPMhEnIwaMq5EfL+yMG4qMNdohIGyC2vw9m4/28T24eznD2yV3qnoQTZ4pjqkXTfEhn0EtU1sQ52NuwJfLBHn8lik8jlZ6uUv0/S4Vy1sP9Yo3ovdlCdFTuBXzRsRauQWCy9V5e0yFuCgVRpd00fFum+akejfhnpgKxK7T1gRjlxOVy4h0+Tes7sxxvS827Q33Av+C7Vqb1pkLLmRmM/wsqTnViclvBAyt8RrYbnMxe8lsI/Qh5LH56hTYQFIEO0bOUjy8QO0P5ikVS/TNu0adPmL38AM/rF5U3V+tcAAAAASUVORK5CYII=>
