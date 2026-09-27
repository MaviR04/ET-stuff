// Graphical abstract strip for the CANTUS poster (replaces the headline box).
//   node abstract.js  -> graphical-abstract.pptx + abstract-preview.html
// Sized to the headline slot of the first poster version: 21.586 x 2.75 in.
// Render the PNG with: sh render-abstract.sh

const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const W = 21.586, H = 2.75;
const C = {
  ink: "1B2A41", text: "222831", muted: "5A6270", card: "EEF2F7", line: "C5CEDB",
  gold: "FCEBB6", goldEdge: "E0B43C", white: "FFFFFF", grey: "9AA4B2",
  v0: "D55E00", v1: "0072B2", v2: "009E73",
  strong: "1B2A41", moderate: "5E7292", weak: "BAC5D6",
};
const FONT = "Calibri";

const els = [];
const rect = (x, y, w, h, o = {}) => els.push({ k: "rect", x, y, w, h, ...o });
const line = (x1, y1, x2, y2, o = {}) => els.push({ k: "line", x1, y1, x2, y2, ...o });
const text = (x, y, w, h, paras, o = {}) => els.push({ k: "text", x, y, w, h, paras, ...o });

// ---------- Frame and panel grid ----------
rect(0, 0, W, H, { fill: C.card, r: 0.25 });
const PADX = 0.35, AW = 0.5, N = 5;
const PW = (W - 2 * PADX - (N - 1) * AW) / N;   // panel width
const GY = 0.28, GH = 1.25;                     // graphic zone
const KY = GY + GH + 0.1;                       // kicker
const LY = KY + 0.32;                           // label
const px = (i) => PADX + i * (PW + AW);

const panels = [
  ["THE SCORE", "Scores know which voice each note is in"],
  ["TODAY'S TOKENIZERS", "Notes are sorted by pitch; the voices are lost"],
  ["THE REVIEW", "28 studies: voice-leading is never measured"],
  ["CANTUS", "Adds the voice to each note token, so it can be checked"],
  ["NEXT", "Test on Bach fugues, where voices come and go"],
];
panels.forEach(([kick, lab], i) => {
  if (i === 2) rect(px(i) - 0.12, 0.14, PW + 0.24, H - 0.28, { fill: C.gold, line: C.goldEdge, lw: 2.5, r: 0.15 });
  text(px(i), KY, PW, 0.3, [[{ t: kick, b: true, c: i === 2 ? C.ink : C.muted }]],
       { size: 15, charSpacing: 2, valign: "middle" });
  text(px(i), LY, PW, H - LY - 0.1, [[{ t: lab, b: true, c: C.ink }]], { size: 20, valign: "top" });
  if (i < N - 1) {
    const ax = px(i) + PW + 0.1;
    line(ax, GY + GH / 2, ax + AW - 0.2, GY + GH / 2, { color: C.ink, lw: 4, arrow: true });
  }
});

// piano roll: soprano & alto cross, bass enters (same passage as card 1)
function roll(x, y, w, h, colored, entries) {
  rect(x, y, w, h, { fill: C.white, line: C.line, lw: 1 });
  const lo = 45, hi = 75, beats = 6, nh = 0.14;
  const bx = (b) => x + (b / beats) * w, byP = (p) => y + ((hi - p) / (hi - lo)) * h;
  const voices = entries || {
    v0: [[72, 0, 2], [69, 2, 4], [64, 4, 6]],
    v1: [[64, 0, 2], [65, 2, 4], [67, 4, 6]],
    v2: [[48, 4, 6]],
  };
  for (const [v, ns] of Object.entries(voices)) {
    const col = colored ? C[v] : C.grey;
    ns.forEach(([p, a, b], i) => {
      rect(bx(a) + 0.04, byP(p) - nh / 2, bx(b) - bx(a) - 0.08, nh, { fill: col, r: 0.03 });
      if (i > 0) {
        const [pp, , pb] = ns[i - 1];
        if (pb === a) line(bx(pb) - 0.04, byP(pp), bx(a) + 0.04, byP(p), { color: col, lw: 2.5 });
      }
    });
  }
}

// token box helper
function tok(x, y, w, h, t, fill, fc, bold) {
  rect(x, y, w, h, { fill, line: C.line, lw: 0.75 });
  text(x, y, w, h, [[{ t, b: !!bold, c: fc }]], { size: 15, align: "center", valign: "middle" });
}

// 1. The score: coloured voices
roll(px(0) + 0.1, GY + 0.05, PW - 0.2, GH - 0.1, true);

// 2. Tokenizers: pitch-sorted compound tokens, all grey
{
  const gw = 1.08, gap = (PW - 3 * gw) / 2, ty = GY + 0.2, th = 0.42;
  [48, 64, 67].forEach((p, j) => tok(px(1) + j * (gw + gap), ty, gw, th, "P" + p, C.white, C.muted));
  // the three voice colours drained to grey underneath
  const ly = ty + th + 0.3;
  ["v0", "v1", "v2"].forEach((v, j) => {
    const x = px(1) + j * (gw + gap);
    rect(x + 0.1, ly, gw - 0.2, 0.12, { fill: C.grey, r: 0.03 });
    text(x, ly + 0.14, gw, 0.3, [[{ t: "voice ?", c: C.muted }]], { size: 14, align: "center", valign: "middle" });
  });
}

// 3. The review: 28 + mini rating grid with the empty voice-leading row
{
  text(px(2), GY, 1.25, GH, [[{ t: "28", b: true, c: C.ink }]], { size: 66, valign: "middle", align: "center" });
  const gx = px(2) + 1.35, gw = PW - 1.4, rows = 4, cols = 5, ch = 0.2, cg = 0.04;
  const cw = (gw - (cols - 1) * cg) / cols;
  const shades = ["WSSSS", "MWSSM", "SWMWW", "ALSLS"]; // Table IV rows
  const col = { S: C.strong, M: C.moderate, W: C.weak, L: C.weak, A: C.white };
  shades.forEach((r, i) => [...r].forEach((s, j) =>
    rect(gx + j * (cw + cg), GY + 0.08 + i * (ch + cg), cw, ch, { fill: col[s] })));
  const ry = GY + 0.08 + rows * (ch + cg) + 0.02;
  rect(gx, ry, gw, 0.3, { fill: C.white, line: C.goldEdge, lw: 2 });
  text(gx, ry, gw, 0.3, [[{ t: "voice-leading: none", b: true, c: C.ink }]], { size: 14, align: "center", valign: "middle" });
}

// 4. CANTUS: coloured voice fields in the token
{
  const vw = 0.46, pw = 0.62, gw = vw + pw, gap = (PW - 3 * gw) / 2, ty = GY + 0.2, th = 0.42;
  [["v0", 64], ["v1", 67], ["v2", 48]].forEach(([v, p], j) => {
    const x = px(3) + j * (gw + gap);
    tok(x, ty, vw, th, v, C[v], C.white, true);
    tok(x + vw, ty, pw, th, "P" + p, C.white, C.text);
  });
  const ly = ty + th + 0.3;
  ["v0", "v1", "v2"].forEach((v, j) => {
    const x = px(3) + j * (gw + gap);
    rect(x + 0.05, ly, gw - 0.1, 0.12, { fill: C[v], r: 0.03 });
    text(x, ly + 0.14, gw, 0.3, [[{ t: ["soprano", "alto", "bass"][j], c: C[v], b: true }]], { size: 14, align: "center", valign: "middle" });
  });
}

// 5. Next: fugue entries, voices entering one by one and one dropping out
roll(px(4) + 0.1, GY + 0.05, PW - 0.2, GH - 0.1, true, {
  v0: [[70, 0, 2], [68, 2, 4]],
  v1: [[62, 2, 4], [60, 4, 6]],
  v2: [[52, 4, 6]],
});

// ---------- Renderers ----------
const norm = (paras) => paras.map((p) => (typeof p === "string" ? [{ t: p }] : p));

function toPptx(file) {
  const pres = new pptxgen();
  pres.defineLayout({ name: "STRIP", width: W, height: H });
  pres.layout = "STRIP";
  pres.title = "CANTUS graphical abstract";
  const s = pres.addSlide();
  s.background = { color: C.white };
  for (const e of els) {
    if (e.k === "rect") {
      const o = { x: e.x, y: e.y, w: e.w, h: e.h, fill: { color: e.fill } };
      if (e.r) o.rectRadius = e.r;
      o.line = e.line ? { color: e.line, width: e.lw || 1 } : { type: "none" };
      s.addShape(e.r ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, o);
    } else if (e.k === "line") {
      s.addShape(pres.shapes.LINE, {
        x: Math.min(e.x1, e.x2), y: Math.min(e.y1, e.y2), w: Math.abs(e.x2 - e.x1), h: Math.abs(e.y2 - e.y1),
        flipV: (e.x2 - e.x1) * (e.y2 - e.y1) < 0,
        line: { color: e.color, width: e.lw || 1, endArrowType: e.arrow ? "triangle" : undefined },
      });
    } else if (e.k === "text") {
      const runs = [];
      const ps = norm(e.paras);
      ps.forEach((p, pi) => p.forEach((r, ri) => runs.push({ text: r.t, options: {
        bold: !!r.b, color: r.c || C.text, breakLine: ri === p.length - 1 && pi < ps.length - 1 } })));
      s.addText(runs, { x: e.x, y: e.y, w: e.w, h: e.h, fontFace: FONT, fontSize: e.size, margin: 0,
        align: e.align || "left", valign: e.valign || "top", charSpacing: e.charSpacing, isTextBox: true, fit: "none" });
    }
  }
  return pres.writeFile({ fileName: file });
}

function toHtml(file) {
  const inch = (v) => `${v}in`;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let body = "";
  for (const e of els) {
    if (e.k === "rect") {
      body += `<div style="position:absolute;left:${inch(e.x)};top:${inch(e.y)};width:${inch(e.w)};height:${inch(e.h)};background:#${e.fill};border:${e.line ? `${e.lw || 1}pt solid #${e.line}` : "none"};border-radius:${e.r ? inch(e.r) : 0};box-sizing:border-box"></div>\n`;
    } else if (e.k === "line") {
      body += `<svg style="position:absolute;left:0;top:0;overflow:visible" width="${W * 96}" height="${H * 96}"><defs><marker id="a" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 z" fill="#${e.color}"/></marker></defs><line x1="${e.x1 * 96}" y1="${e.y1 * 96}" x2="${e.x2 * 96}" y2="${e.y2 * 96}" stroke="#${e.color}" stroke-width="${(e.lw || 1) * 96 / 72}" ${e.arrow ? 'marker-end="url(#a)"' : ""}/></svg>\n`;
    } else if (e.k === "text") {
      const jc = { top: "flex-start", middle: "center", bottom: "flex-end" }[e.valign || "top"];
      const ps = norm(e.paras).map((p) => `<p style="margin:0">${p.map((r) =>
        `<span style="color:#${r.c || C.text};font-weight:${r.b ? 700 : 400}">${esc(r.t)}</span>`).join("")}</p>`).join("");
      body += `<div class="tb" style="position:absolute;left:${inch(e.x)};top:${inch(e.y)};width:${inch(e.w)};height:${inch(e.h)};display:flex;flex-direction:column;justify-content:${jc};text-align:${e.align || "left"};font-size:${e.size}pt;letter-spacing:${e.charSpacing || 0}pt"><div class="in">${ps}</div></div>\n`;
    }
  }
  fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#fff}
#p{position:relative;width:${W}in;height:${H}in;font-family:${FONT},sans-serif;line-height:1.2}.bad{outline:3px solid red}</style></head>
<body><div id="p">${body}</div><script>const ov=[];document.querySelectorAll('.tb').forEach(b=>{const i=b.firstElementChild;
if(i.scrollHeight>b.clientHeight+1||i.scrollWidth>b.clientWidth+1){b.classList.add('bad');ov.push(i.textContent.slice(0,40))}});
const o=document.createElement('pre');o.textContent='OVERFLOW '+JSON.stringify(ov);o.style.position='absolute';o.style.top='${H + 1}in';document.body.appendChild(o);</script></body></html>`);
}

toHtml(path.join(__dirname, "abstract-preview.html"));
toPptx(path.join(__dirname, "graphical-abstract.pptx")).then(() => console.log("wrote graphical-abstract.pptx"));
