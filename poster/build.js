// Builds the CANTUS A1 research poster.
//   node build.js            -> CANTUS-Poster-A1.pptx + preview.html
// The layout is described once as a list of primitive elements (inches, pt)
// and rendered twice: to PowerPoint via pptxgenjs, and to an HTML preview
// used for visual QA (no LibreOffice/PowerPoint on this machine).
//
// Design: the page is a grand staff. The treble system holds the review
// (cards 1-3), the bass system holds the proposal (cards 4-6). Clef and
// brace outlines come from glyphs.json (run glyphs.py to regenerate).

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const GLYPHS = require("./glyphs.json");

// ---------- Canvas: A1 portrait, 594 x 841 mm ----------
const W = 594 / 25.4; // 23.386 in
const H = 841 / 25.4; // 33.110 in
const M = 0.75;       // outer margin (~19 mm)
const GAP = 0.4;      // vertical gap between blocks
const GUT = 0.5;      // horizontal gutter between cards
const PAD = 0.4;      // inner card padding

// Grand-staff column on the left
const BRACE_X = M, BRACE_W = 0.4;
const SYS_X = M + 0.5;             // system barline; staves start here
const CLEF_X = SYS_X + 0.15;
const CLEF_W = 2.45;                // treble clef width; sets the staff size
const X0 = CLEF_X + CLEF_W + 0.3;  // content left edge
const CW = W - M - X0;              // content width
const STAFF_END = W - 0.4;          // staves run into the right margin

// ---------- Palette ----------
const C = {
  ink: "1B2A41", text: "222831", muted: "5A6270",
  card: "EEF2F7", line: "C5CEDB", staff: "AEB9CA",
  gold: "FCEBB6", goldEdge: "E0B43C", white: "FFFFFF", sub: "C9D6EA",
  // Okabe-Ito, reserved for voices only
  v0: "D55E00", v1: "0072B2", v2: "009E73",
  // rating scale (single hue)
  strong: "1B2A41", moderate: "5E7292", weak: "BAC5D6", absent: "FFFFFF",
};
const FONT = "Calibri";

// ---------- Type scale (pt) ----------
const T = { kicker: 36, title: 60, subtitle: 28, author: 22, headline: 46,
            h: 36, small: 24, rq: 22, caption: 20, token: 20 };

// ---------- Element list ----------
const els = [];
const rect = (x, y, w, h, o = {}) => els.push({ k: "rect", x, y, w, h, ...o });
const oval = (x, y, w, h, o = {}) => els.push({ k: "oval", x, y, w, h, ...o });
const line = (x1, y1, x2, y2, o = {}) => els.push({ k: "line", x1, y1, x2, y2, ...o });
// paras: string | array of paragraphs; paragraph: string | array of runs {t, b, i, c, s}
const text = (x, y, w, h, paras, o = {}) => els.push({ k: "text", x, y, w, h, paras, ...o });

// Glyph with its bbox top-left at (x, y), scaled sx/sy inches per font unit; y flipped.
function glyph(name, x, y, sx, sy, fill) {
  const g = GLYPHS[name], [bx0, by0, bx1, by1] = g.bbox;
  const ops = g.ops.map(([op, ...v]) => {
    const p = [];
    for (let i = 0; i < v.length; i += 2) p.push((v[i] - bx0) * sx, (by1 - v[i + 1]) * sy);
    return [op, ...p];
  });
  els.push({ k: "path", x, y, w: (bx1 - bx0) * sx, h: (by1 - by0) * sy, ops, fill });
}

function card(x, y, w, h, num, title) {
  rect(x, y, w, h, { fill: C.card, r: 0.25 });
  const d = 0.7;
  oval(x + PAD, y + PAD, d, d, { fill: C.ink });
  text(x + PAD, y + PAD, d, d, [[{ t: String(num), b: true, c: C.white }]],
       { size: 28, align: "center", valign: "middle", m: 0 });
  text(x + PAD + d + 0.22, y + PAD - 0.05, w - 2 * PAD - d - 0.22, d + 0.1,
       [[{ t: title, b: true, c: C.ink }]], { size: T.h, valign: "middle", m: 0 });
  return y + PAD + d + 0.22; // y where content starts
}

// small label chip: RQ tags are ink, gap tags are gold
function chip(x, y, w, h, label, kind = "rq") {
  rect(x, y, w, h, { fill: kind === "rq" ? C.ink : C.gold, r: 0.08 });
  text(x, y, w, h, [[{ t: label, b: true, c: kind === "rq" ? C.white : C.ink }]],
       { size: 18, m: 0, align: "center", valign: "middle" });
}

// Staff: five lines from SYS_X to STAFF_END, top line at yTop, spacing sp.
function staff(yTop, sp, final) {
  for (let k = 0; k < 5; k++) line(SYS_X, yTop + k * sp, STAFF_END, yTop + k * sp, { color: C.staff, lw: 1.75 });
  line(STAFF_END, yTop, STAFF_END, yTop + 4 * sp, { color: C.ink, lw: 1.5 });
  if (final) rect(STAFF_END + 0.08, yTop, 0.14, 4 * sp, { fill: C.ink });
}

// =====================================================================
// 1. Title panel
// =====================================================================
const TITLE_H = 4.35;
rect(0, 0, W, TITLE_H, { fill: C.ink });
const TW = W - 2 * M;
text(M, 0.45, TW, 0.6, [[{ t: "CANTUS", b: true, c: C.goldEdge }]],
     { size: T.kicker, m: 0, charSpacing: 6 });
text(M, 1.0, TW, 2.1,
     [[{ t: "Voice-Aware Tokenization for", b: true, c: C.white }],
      [{ t: "Symbolic Music Generation", b: true, c: C.white }]],
     { size: T.title, m: 0, valign: "top" });
text(M, 3.12, TW, 0.5,
     [[{ t: "A PRISMA 2020 systematic review of 28 studies, and a proposed framework", c: C.sub }]],
     { size: T.subtitle, m: 0 });
text(M, 3.62, TW, 0.42,
     [[{ t: "[Your Name]", b: true, c: C.white },
       { t: "   ·   APIIT School of Computing, Colombo, Sri Lanka   ·   [your.email@students.apiit.lk]", c: C.sub }]],
     { size: T.author, m: 0 });

// motif: the card-1 voices on a faint staff, right of the title
{
  const mx0 = 14.2, mx1 = W - M, my = 0.75, msp = 0.62;
  for (let k = 0; k < 5; k++) line(mx0, my + k * msp, mx1, my + k * msp, { color: "3B4B66", lw: 1.5 });
  const lo = 44, hi = 76, top = my - 0.25, hgt = 4 * msp + 0.5, beats = 6;
  const bx = (b) => mx0 + 0.2 + (b / beats) * (mx1 - mx0 - 0.4);
  const byP = (p) => top + ((hi - p) / (hi - lo)) * hgt;
  const voices = { v0: [[72, 0, 2], [69, 2, 4], [64, 4, 6]], v1: [[64, 0, 2], [65, 2, 4], [67, 4, 6]], v2: [[48, 4, 6]] };
  const col = { v0: C.v0, v1: "56B4E9", v2: C.v2 }; // sky blue keeps alto legible on navy
  for (const [v, ns] of Object.entries(voices)) {
    ns.forEach(([p, a, b], i) => {
      rect(bx(a) + 0.06, byP(p) - 0.13, bx(b) - bx(a) - 0.12, 0.26, { fill: col[v], r: 0.08 });
      if (i > 0) {
        const [pp, , pb] = ns[i - 1];
        line(bx(pb) - 0.06, byP(pp), bx(a) + 0.06, byP(p), { color: col[v], lw: 4 });
      }
    });
  }
}

// =====================================================================
// 2. Headline finding
// =====================================================================
let y = TITLE_H + GAP;
const HEAD_H = 2.0;
rect(M, y, TW, HEAD_H, { fill: C.gold, r: 0.25 });
text(M + 0.6, y, TW - 1.2, HEAD_H,
     [[{ t: "Widely used music-AI tokenizers throw away which voice each note belongs to, so voice-leading can be neither modelled nor measured.", b: true, c: C.ink }]],
     { size: T.headline, align: "center", valign: "middle", m: 0 });
y += HEAD_H + GAP;

// =====================================================================
// 3. Treble system: the review
// =====================================================================
const TREBLE_Y = y;
const LW = 7.3;                 // left column width
const RX = X0 + LW + GUT;       // right column x
const RW = W - M - RX;          // right column width
const ROW_A_H = 12.6;

// ---- Card 1: the problem + research questions ----
const C1_H = 7.75;
let cy = card(X0, TREBLE_Y, LW, C1_H, 1, "The problem");
const iw = LW - 2 * PAD;
text(X0 + PAD, cy, iw, 1.35,
     ["Transformers read music as a flat stream of tokens. Scores say which line each note is on; tokenizers drop it and sort notes by pitch."],
     { size: T.small, m: 0, c: C.text });
cy += 1.45;
// mini piano roll: soprano & alto cross at beat 4, bass enters
{
  const labW = 0.45, px = X0 + PAD + labW, pw = iw - labW, ph = 1.45, py = cy;
  const lo = 45, hi = 75, beats = 6;
  const bx = (b) => px + (b / beats) * pw;
  const byP = (p) => py + ((hi - p) / (hi - lo)) * ph;
  rect(px, py, pw, ph, { fill: C.white, line: C.line, lw: 1 });
  rect(bx(4), py, bx(6) - bx(4), ph, { fill: C.gold });
  const nh = 0.2;
  const voices = {
    v0: ["S", [[72, 0, 2], [69, 2, 4], [64, 4, 6]]],
    v1: ["A", [[64, 0, 2], [65, 2, 4], [67, 4, 6]]],
    v2: ["B", [[48, 4, 6]]],
  };
  for (const [v, [lab, ns]] of Object.entries(voices)) {
    text(X0 + PAD, byP(ns[0][0]) - 0.2, labW - 0.08, 0.4, [[{ t: lab, b: true, c: C[v] }]],
         { size: 20, m: 0, align: "right", valign: "middle" });
    ns.forEach(([p, a, b], i) => {
      rect(bx(a) + 0.05, byP(p) - nh / 2, bx(b) - bx(a) - 0.1, nh, { fill: C[v], r: 0.05 });
      if (i > 0) { // join consecutive notes so each line's path is visible
        const [pp, , pb] = ns[i - 1];
        line(bx(pb) - 0.05, byP(pp), bx(a) + 0.05, byP(p), { color: C[v], lw: 3 });
      }
    });
  }
  cy = py + ph + 0.4;
}
text(X0 + PAD, cy, iw, 0.5, [[{ t: "Research questions", b: true, c: C.ink }]], { size: 26, m: 0, valign: "middle" });
cy += 0.62;
{
  const rqs = [["RQ1", "What representations exist?", 0.45],
               ["RQ2", "How well do they work, and how is that judged?", 0.8],
               ["RQ3", "What is missing, and what are the ethical risks?", 0.8]];
  for (const [id, q, h] of rqs) {
    chip(X0 + PAD, cy + 0.02, 0.8, 0.42, id);
    text(X0 + PAD + 0.98, cy, iw - 0.98, h, [q], { size: T.rq, m: 0, c: C.text, valign: "top" });
    cy += h + 0.12;
  }
}

// ---- Card 2: method ----
const C2_Y = TREBLE_Y + C1_H + GUT;
const C2_H = ROW_A_H - C1_H - GUT;
cy = card(X0, C2_Y, LW, C2_H, 2, "How the review worked");
text(X0 + PAD, cy, iw, 0.72,
     ["PRISMA 2020 · IEEE Xplore, ACM DL, arXiv, ISMIR · Jan 2018 to Sep 2026"],
     { size: T.caption, m: 0, c: C.muted });
cy += 0.82;
{
  const stages = [[181, "identified"], [168, "screened"], [150, "full texts read"], [28, "included"]];
  const bh = 0.42, bgap = 0.12, labW = 0.95;
  const maxW = iw - labW - 0.15;
  stages.forEach(([n, lab], i) => {
    const by = cy + i * (bh + bgap);
    const bw = Math.max(0.35, (n / 181) * maxW);
    const last = i === stages.length - 1;
    text(X0 + PAD, by, labW, bh, [[{ t: String(n), b: true, c: C.ink }]],
         { size: 24, m: 0, align: "right", valign: "middle" });
    rect(X0 + PAD + labW + 0.15, by, bw, bh, { fill: last ? C.goldEdge : C.moderate, r: 0.06 });
    text(X0 + PAD + labW + 0.15 + (last ? bw + 0.15 : 0.15), by, maxW - (last ? bw + 0.15 : 0.15), bh,
         [[{ t: lab, b: last, c: last ? C.ink : C.white }]],
         { size: T.caption, m: 0, valign: "middle" });
  });
}

// ---- Card 3: findings + gaps ----
cy = card(RX, TREBLE_Y, RW, ROW_A_H, 3, "What the review found");
const rIW = RW - 2 * PAD;
const x0 = RX + PAD;
text(x0, cy, rIW, 1.25,
     ["The 28 studies fall into five main families. None gives the model a note's voice as an input; text formats mark only staffs or tracks."],
     { size: T.small, m: 0, c: C.text });
cy += 1.3;
{
  const fams = ["Event", "Grid", "Compound", "Step", "Text"];
  const labW = 2.85, cw = (rIW - labW) / fams.length, rh = 0.68;
  const R = { S: ["Strong", C.strong, C.white], M: ["Moderate", C.moderate, C.white],
              W: ["Weak", C.weak, C.text], L: ["Limited", C.weak, C.text], A: ["Absent", C.absent, C.muted] };
  const rows = [
    ["Metrical stability",  "WSSSS"],
    ["Sequence economy",    "MWSSM"],
    ["Expressive timing",   "SWMWW"],
    ["Multi-track control", "ALSLS"],
  ];
  chip(x0, cy + (rh - 0.42) / 2, 0.8, 0.42, "RQ1");
  fams.forEach((f, j) => text(x0 + labW + j * cw, cy, cw, rh, [[{ t: f, b: true, c: C.ink }]],
                               { size: 19, m: 0, align: "center", valign: "middle" }));
  rows.forEach(([lab, codes], i) => {
    const ry = cy + (i + 1) * rh;
    text(x0, ry, labW, rh, [lab], { size: 19, m: 0, valign: "middle", c: C.text });
    [...codes].forEach((cd, j) => {
      const [word, fill, fc] = R[cd];
      rect(x0 + labW + j * cw + 0.03, ry + 0.03, cw - 0.06, rh - 0.06,
           { fill, line: cd === "A" ? C.line : undefined, lw: 1 });
      text(x0 + labW + j * cw, ry, cw, rh, [[{ t: word, c: fc }]],
           { size: 18, m: 0, align: "center", valign: "middle" });
    });
  });
  const ry = cy + 5 * rh + 0.05;
  text(x0, ry, labW, rh + 0.1, [[{ t: "Voice-leading quality", b: true, c: C.ink }]],
       { size: 19, m: 0, valign: "middle" });
  rect(x0 + labW + 0.03, ry + 0.03, fams.length * cw - 0.06, rh + 0.04,
       { fill: C.gold, line: C.goldEdge, lw: 2.5 });
  text(x0 + labW, ry, fams.length * cw, rh + 0.1,
       [[{ t: "Not measured by any included study", b: true, c: C.ink }]],
       { size: 21, m: 0, align: "center", valign: "middle" });
  cy = ry + rh + 0.4;
}
chip(x0, cy + 0.03, 0.8, 0.42, "RQ2");
text(x0 + 0.98, cy, rIW - 0.98, 1.5, [
  [{ t: "Largely solved: ", b: true, c: C.ink }, { t: "steady beat, short sequences (compound tokens)." }],
  [{ t: "Largely solved: ", b: true, c: C.ink }, { t: "long pieces (attention reaches 8,192+ tokens)." }],
  [{ t: "Open: ", b: true, c: C.ink }, { t: "voice-leading; no representation carries the line it needs." }],
], { size: T.rq, m: 0, c: C.text, paraAfter: 6 });
cy += 1.75;
chip(x0, cy + 0.04, 0.8, 0.42, "RQ3");
text(x0 + 0.98, cy, rIW - 0.98, 0.5, [[{ t: "Six research gaps", b: true, c: C.ink }]], { size: 26, m: 0, valign: "middle" });
cy += 0.65;
{
  const gaps = [
    ["G1", "Voice missing from tokenizer inputs", "hl"],
    ["G2", "Notes ordered by pitch, not by line", "hl"],
    ["G3", "No agreed evaluation method", ""],
    ["G4", "Voice-leading cannot be measured", "hl"],
    ["G5", "Small, poorly licensed corpora", ""],
    ["G6", "Song-length form (not addressed)", "off"],
  ];
  const g = 0.18, cw = (rIW - 2 * g) / 3, ch = 1.1;
  gaps.forEach(([id, lab, kind], i) => {
    const gx = x0 + (i % 3) * (cw + g), gy = cy + Math.floor(i / 3) * (ch + g);
    rect(gx, gy, cw, ch, { fill: kind === "hl" ? C.gold : C.white,
         line: kind === "hl" ? C.goldEdge : C.line, lw: kind === "hl" ? 2.5 : 1, r: 0.12 });
    text(gx + 0.16, gy, cw - 0.32, ch,
         [[{ t: id + "  ", b: true, c: kind === "off" ? C.muted : C.ink },
           { t: lab, c: kind === "off" ? C.muted : C.text }]],
         { size: 19, m: 0, valign: "middle" });
  });
}

// =====================================================================
// 4. Bass system: the proposal
// =====================================================================
const BASS_Y = TREBLE_Y + ROW_A_H + 0.5;
y = BASS_Y;

// ---- Card 4: CANTUS ----
const CAN_H = 7.6;
cy = card(X0, y, CW, CAN_H, 4, "CANTUS: make the voice part of every note token");
{
  const FX = X0 + PAD;
  const labW = 1.55, bh = 0.6, sw = 0.7, stw = 0.95, grpG = 0.2;
  const FW = labW + 3 * (4 * sw + stw) + 2 * grpG;
  text(FX, cy, FW, 0.45,
       [[{ t: "The shaded moment from panel 1: soprano and alto have crossed, and the bass enters.", i: true, c: C.muted }]],
       { size: T.caption, m: 0 });
  const rowGap = 1.18;
  let ry = cy + 0.6;
  const box = (x, y0, w, t, fill, fc, bold) => {
    rect(x, y0, w, bh, { fill, line: C.line, lw: 1 });
    text(x, y0, w, bh, [[{ t, b: !!bold, c: fc }]], { size: T.token, m: 0, align: "center", valign: "middle" });
  };
  const rowLabel = (t) => text(FX, ry, labW, bh, [[{ t, b: true, c: C.ink }]], { size: 22, m: 0, valign: "middle" });
  const note = (t) => text(FX + labW, ry + bh + 0.04, FW - labW, 0.4, [[{ t, c: C.muted }]], { size: 18, m: 0 });

  // REMI: one token per attribute, simultaneous notes sorted low -> high
  rowLabel("REMI");
  let x = FX + labW;
  ["Pos", "P48", "Dur", "P64", "Dur", "P67", "Dur"].forEach((t) => { box(x, ry, sw, t, C.white, C.text); x += sw + 0.08; });
  note("7 tokens (velocity omitted), sorted by pitch: the voices are lost.");
  ry += rowGap;

  // CP: compound tokens, same pitch sort
  rowLabel("CP");
  x = FX + labW;
  [48, 64, 67].forEach((p) => {
    ["Pos", "P" + p, "Dur"].forEach((t) => { box(x, ry, sw, t, C.white, C.text); x += sw; });
    x += grpG;
  });
  note("3 compound tokens: shorter, same pitch sort, voices still lost.");
  ry += rowGap;

  // CANTUS: compound tokens ordered by persistent voice, with state flag
  rowLabel("CANTUS");
  x = FX + labW;
  [["v0", "cont", 64], ["v1", "cont", 67], ["v2", "enter", 48]].forEach(([v, st, p]) => {
    box(x, ry, sw, "Pos", C.white, C.text); x += sw;
    box(x, ry, sw, v, C[v], C.white, true); x += sw;
    box(x, ry, stw, st, C.gold, C.ink, true); x += stw;
    box(x, ry, sw, "P" + p, C.white, C.text); x += sw;
    box(x, ry, sw, "Dur", C.white, C.text); x += sw;
    x += grpG;
  });
  note("Ordered by voice: the crossing stays visible and the entry is flagged.");
  const figBottom = ry + bh + 0.5;

  // token key, right of the figure
  const KX = FX + FW + 0.4, KW = X0 + CW - PAD - KX;
  const KY = cy + 0.6, KH = 2.35;
  rect(KX, KY, KW, KH, { fill: C.white, line: C.line, lw: 1, r: 0.12 });
  text(KX + 0.22, KY + 0.12, KW - 0.44, KH - 0.24, [
    [{ t: "Reading the tokens", b: true, c: C.ink }],
    [{ t: "Pos ", b: true, c: C.ink }, { t: "position in the bar" }],
    [{ t: "P64 ", b: true, c: C.ink }, { t: "pitch (MIDI 64 = E4)" }],
    [{ t: "Dur ", b: true, c: C.ink }, { t: "duration" }],
    [{ t: "v0 ", b: true, c: C.ink }, { t: "voice ID" }],
    [{ t: "cont / enter ", b: true, c: C.ink }, { t: "voice state" }],
  ], { size: 18, m: 0, c: C.text, paraAfter: 4, valign: "middle" });

  // Layers: a row of four
  const layers = [
    ["Layer 1", "Voice-indexed tokens", "voice ID + enter / continue / end flag", "G1 G2"],
    ["Layer 2", "Tiered voice annotation", "from scores, voice separators, or blank", "G1 G5"],
    ["Layer 3", "Counterpoint checks", "crossings, parallel 5ths/8ves, independence", "G3 G4"],
    ["Layer 4", "Ablation + report card", "always compared with a voice-blind twin", "G3 G5"],
  ];
  const lg = 0.2, lw = (CW - 2 * PAD - 3 * lg) / 4, lh = 1.6, ly = figBottom + 0.3;
  layers.forEach(([n, t1, t2, gp], i) => {
    const lx = FX + i * (lw + lg);
    rect(lx, ly, lw, lh, { fill: C.white, line: C.line, lw: 1, r: 0.12 });
    text(lx + 0.2, ly + 0.12, lw - 1.4, 0.4, [[{ t: n, b: true, c: C.muted }]], { size: 18, m: 0, valign: "middle" });
    chip(lx + lw - 1.15, ly + 0.12, 0.95, 0.4, gp, "gap");
    text(lx + 0.2, ly + 0.55, lw - 0.4, lh - 0.65,
         [[{ t: t1, b: true, c: C.ink }], [{ t: t2, c: C.text }]], { size: 18, m: 0, valign: "top" });
  });
}
y += CAN_H + GAP;

// ---- Bottom row: pilot + ethics/limits/conclusion ----
const BOT_H = H - 0.8 - y;
const bw1 = 7.0, bw2 = CW - bw1 - GUT;
cy = card(X0, y, bw1, BOT_H, 5, "Testing it: a fugue pilot");
{
  const steps = [["Train", "48 fugues, Well-Tempered Clavier"], ["Test", "The Art of Fugue (held out)"],
                 ["Compare", "voice-blind, fixed-slot, CANTUS"]];
  const aw = 0.32, sw = (bw1 - 2 * PAD - 2 * aw) / 3, sh = 1.45;
  steps.forEach(([a, b], i) => {
    const sx = X0 + PAD + i * (sw + aw);
    rect(sx, cy, sw, sh, { fill: C.white, line: C.line, lw: 1, r: 0.12 });
    text(sx + 0.08, cy, sw - 0.16, sh, [[{ t: a, b: true, c: C.ink }], [{ t: b, c: C.text }]],
         { size: 18, m: 0, valign: "middle", align: "center" });
    if (i < 2) line(sx + sw + 0.04, cy + sh / 2, sx + sw + aw - 0.04, cy + sh / 2, { color: C.ink, lw: 3, arrow: true });
  });
  text(X0 + PAD, cy + sh + 0.15, bw1 - 2 * PAD, BOT_H - (cy - y) - sh - 0.15 - PAD + 0.15,
       [[{ t: "It fails if ", b: true, c: C.ink }, { t: "CANTUS beats the fixed-slot model on neither likelihood nor rule violations." }]],
       { size: 19, m: 0, c: C.text, valign: "top" });
}
const E_X = X0 + bw1 + GUT;
cy = card(E_X, y, bw2, BOT_H, 6, "Ethics, limits and conclusion");
{
  const inner = bw2 - 2 * PAD, colG = 0.4, lcw = 5.0, rcw = inner - lcw - colG;
  const bodyH = BOT_H - (cy - y) - PAD + 0.1;
  text(E_X + PAD, cy, lcw, bodyH, [
    [{ t: "Provenance: ", b: true, c: C.ink }, { t: "scraped, often unlicensed scores." }],
    [{ t: "Authorship: ", b: true, c: C.ink }, { t: "no checks for copied phrases." }],
    [{ t: "Cultural bias: ", b: true, c: C.ink }, { t: "12-tone grids distort other musics." }],
    [{ t: "Deskilling: ", b: true, c: C.ink }, { t: "junior arrangers are hit first." }],
    [{ t: "Limits: ", b: true, c: C.muted }, { t: "one reviewer; no voice search terms; CANTUS untested.", c: C.muted }],
  ], { size: 18, m: 0, c: C.text, paraAfter: 3 });
  const RCX = E_X + PAD + lcw + colG;
  rect(RCX, cy, rcw, bodyH, { fill: C.gold, r: 0.12 });
  text(RCX + 0.2, cy, rcw - 0.4, bodyH, [
    [{ t: "Tokenizers now handle rhythm and length well; what they lack is the voice. CANTUS adds it as a token field, making voice-leading measurable. The fugue pilot tests whether it helps.", c: C.ink }],
  ], { size: 20, m: 0, valign: "middle" });
}

text(X0, H - 0.68, CW, 0.3, [
  "Key references: Huang et al., Music Transformer, ICLR 2019 · Huang & Yang, REMI, ACM MM 2020 · Hsiao et al., Compound Word Transformer, AAAI 2021 · Page et al., PRISMA 2020, BMJ 2021",
], { size: 14, m: 0, c: C.muted, valign: "middle" });

// =====================================================================
// 5. Grand staff: staves, clefs, brace (moved to the back so cards sit on top)
// =====================================================================
const G_SP_U = 278, F_SP_U = 445;                   // staff space in font units
const SP = CLEF_W / (GLYPHS.gClef.bbox[2] - GLYPHS.gClef.bbox[0]) * G_SP_U; // staff space (in)
const G_TOP_U = 1254, F_TOP_U = 1357;               // top staff line in font units
const gS = SP / G_SP_U, fS = SP / F_SP_U;           // inches per font unit
const trebleTop = TREBLE_Y + ROW_A_H / 2 - 2 * SP;  // centre each staff on its system
const BASS_H = H - 0.8 - BASS_Y;
const bassTop = BASS_Y + BASS_H / 2 - 2 * SP;
{
  const n0 = els.length;
  staff(trebleTop, SP, false);
  staff(bassTop, SP, true);
  line(SYS_X, trebleTop, SYS_X, bassTop + 4 * SP, { color: C.ink, lw: 2 });
  const gb = GLYPHS.gClef.bbox, fb = GLYPHS.fClef.bbox, bb = GLYPHS.brace.bbox;
  glyph("gClef", CLEF_X, trebleTop - (gb[3] - G_TOP_U) * gS, gS, gS, C.ink);
  glyph("fClef", CLEF_X + 0.1, bassTop - (fb[3] - F_TOP_U) * fS, fS, fS, C.ink);
  const braceH = bassTop + 4 * SP - trebleTop;
  glyph("brace", BRACE_X, trebleTop, BRACE_W / (bb[2] - bb[0]), braceH / (bb[3] - bb[1]), C.ink);
  const sysName = (t, yy) => text(SYS_X + 0.12, yy, X0 - SYS_X - 0.3, 0.9, [[{ t, b: true, c: C.ink }]],
                                   { size: 22, m: 0, charSpacing: 3, valign: "top" });
  sysName("THE REVIEW", TREBLE_Y + 0.1);
  sysName("THE PROPOSAL", BASS_Y + 0.1);
  els.unshift(...els.splice(n0));
}

// =====================================================================
// Renderers
// =====================================================================
function normParas(paras) {
  if (typeof paras === "string") paras = [paras];
  return paras.map((p) => (typeof p === "string" ? [{ t: p }] : p));
}

function toPptx(file) {
  const pres = new pptxgen();
  pres.defineLayout({ name: "A1_PORTRAIT", width: W, height: H });
  pres.layout = "A1_PORTRAIT";
  pres.title = "CANTUS research poster (A1)";
  const s = pres.addSlide();
  s.background = { color: C.white };
  for (const e of els) {
    if (e.k === "rect" || e.k === "oval") {
      const shape = e.k === "oval" ? pres.shapes.OVAL : e.r ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE;
      const o = { x: e.x, y: e.y, w: e.w, h: e.h, fill: { color: e.fill || C.white } };
      if (e.r) o.rectRadius = e.r;
      o.line = e.line ? { color: e.line, width: e.lw || 1, dashType: e.dash || "solid" } : { type: "none" };
      s.addShape(shape, o);
    } else if (e.k === "path") {
      const points = [];
      for (const [op, ...v] of e.ops) {
        if (op === "M") points.push({ x: v[0], y: v[1], moveTo: true });
        else if (op === "L") points.push({ x: v[0], y: v[1] });
        else if (op === "Q") points.push({ x: v[2], y: v[3], curve: { type: "quadratic", x1: v[0], y1: v[1] } });
        else if (op === "C") points.push({ x: v[4], y: v[5], curve: { type: "cubic", x1: v[0], y1: v[1], x2: v[2], y2: v[3] } });
        else if (op === "Z") points.push({ close: true });
      }
      s.addShape(pres.shapes.CUSTOM_GEOMETRY, { x: e.x, y: e.y, w: e.w, h: e.h, points,
        fill: { color: e.fill }, line: { type: "none" } });
    } else if (e.k === "line") {
      s.addShape(pres.shapes.LINE, {
        x: Math.min(e.x1, e.x2), y: Math.min(e.y1, e.y2), w: Math.abs(e.x2 - e.x1), h: Math.abs(e.y2 - e.y1),
        flipV: (e.x2 - e.x1) * (e.y2 - e.y1) < 0,
        line: { color: e.color, width: e.lw || 1, endArrowType: e.arrow ? "triangle" : undefined },
      });
    } else if (e.k === "text") {
      const ps = normParas(e.paras);
      const runs = [];
      ps.forEach((p, pi) => p.forEach((r, ri) => {
        const o = { bold: !!r.b, italic: !!r.i, color: r.c || e.c || C.text };
        if (r.s) o.fontSize = r.s;
        if (ri === p.length - 1 && pi < ps.length - 1) o.breakLine = true;
        if (e.paraAfter && ri === 0) o.paraSpaceAfter = e.paraAfter;
        runs.push({ text: r.t, options: o });
      }));
      s.addText(runs, {
        x: e.x, y: e.y, w: e.w, h: e.h, fontFace: FONT, fontSize: e.size, color: e.c || C.text,
        align: e.align || "left", valign: e.valign || "top", margin: e.m ?? 0, isTextBox: true,
        charSpacing: e.charSpacing, fit: "none",
      });
    }
  }
  return pres.writeFile({ fileName: file });
}

function toHtml(file) {
  const px = (v) => `${v}in`;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svgLayer = (inner) => `<svg style="position:absolute;left:0;top:0" width="${W * 96}" height="${H * 96}">${inner}</svg>\n`;
  let body = "";
  for (const e of els) {
    if (e.k === "rect" || e.k === "oval") {
      const br = e.k === "oval" ? "50%" : e.r ? px(e.r) : "0";
      const bd = e.line ? `${e.lw || 1}pt ${e.dash ? "dashed" : "solid"} #${e.line}` : "none";
      body += `<div style="position:absolute;left:${px(e.x)};top:${px(e.y)};width:${px(e.w)};height:${px(e.h)};background:#${e.fill || "FFFFFF"};border:${bd};border-radius:${br};box-sizing:border-box"></div>\n`;
    } else if (e.k === "path") {
      const d = e.ops.map(([op, ...v]) => op + " " + v.map((n, i) => ((i % 2 ? e.y : e.x) + n) * 96).join(" ")).join(" ");
      body += svgLayer(`<path d="${d}" fill="#${e.fill}"/>`);
    } else if (e.k === "line") {
      body += svgLayer(`<defs><marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 z" fill="#${C.ink}"/></marker></defs><line x1="${e.x1 * 96}" y1="${e.y1 * 96}" x2="${e.x2 * 96}" y2="${e.y2 * 96}" stroke="#${e.color}" stroke-width="${(e.lw || 1) * 96 / 72}" ${e.arrow ? 'marker-end="url(#arr)"' : ""}/>`);
    } else if (e.k === "text") {
      const ps = normParas(e.paras).map((p, pi, all) =>
        `<p style="margin:0 0 ${pi < all.length - 1 ? e.paraAfter || 0 : 0}pt">` +
        p.map((r) => `<span style="color:#${r.c || e.c || C.text};font-weight:${r.b ? 700 : 400};font-style:${r.i ? "italic" : "normal"};${r.s ? `font-size:${r.s}pt` : ""}">${esc(r.t)}</span>`).join("") +
        "</p>").join("");
      const jc = { top: "flex-start", middle: "center", bottom: "flex-end" }[e.valign || "top"];
      const m = e.m ?? 0;
      body += `<div class="tb" style="position:absolute;left:${px(e.x)};top:${px(e.y)};width:${px(e.w)};height:${px(e.h)};padding:${m}pt;box-sizing:border-box;display:flex;flex-direction:column;justify-content:${jc};text-align:${e.align || "left"};font-size:${e.size}pt;letter-spacing:${(e.charSpacing || 0)}pt"><div class="in">${ps}</div></div>\n`;
    }
  }
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Poster preview</title>
<style>body{margin:0;background:#888}#p{position:relative;width:${W}in;height:${H}in;background:#fff;font-family:${FONT},Carlito,sans-serif;line-height:1.2;overflow:hidden}
.tb .in{overflow-wrap:normal;word-break:normal}.bad{outline:4px solid red!important}</style></head><body>
<div id="p">${body}</div>
<script>
window.overflow=[];document.querySelectorAll('.tb').forEach(b=>{const i=b.firstElementChild;const cs=getComputedStyle(b);const ih=b.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);const iw=b.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
if(i.scrollHeight>ih+1||i.scrollWidth>iw+1){b.classList.add('bad');overflow.push({text:i.textContent.slice(0,50),h:[i.scrollHeight,Math.round(ih)],w:[i.scrollWidth,Math.round(iw)]})}});
const o=document.createElement('pre');o.id='ov';o.textContent='OVERFLOW '+JSON.stringify(overflow);document.body.appendChild(o);
</script></body></html>`;
  fs.writeFileSync(file, html);
}

// word count (poster text only)
const words = els.filter((e) => e.k === "text")
  .flatMap((e) => normParas(e.paras).flat().map((r) => r.t))
  .join(" ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;

const out = path.join(__dirname, "CANTUS-Poster-A1.pptx");
toHtml(path.join(__dirname, "preview.html"));
toPptx(out).then(() => console.log(`wrote ${out}\nwords on poster: ${words}\nbottom row height: ${BOT_H.toFixed(2)} in`));
