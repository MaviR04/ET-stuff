"""Extract clef and brace outlines from Segoe UI Symbol (ships with Windows)
into glyphs.json, so build.js can draw them as native vector shapes.

Ops are in font units, y pointing up:
  ["M", x, y] ["L", x, y] ["Q", x1, y1, x, y] ["C", x1, y1, x2, y2, x, y] ["Z"]
"""
import json
from pathlib import Path

from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont

FONT = r"C:\Windows\Fonts\seguisym.ttf"
GLYPHS = {"gClef": 0x1D11E, "fClef": 0x1D122, "brace": 0x1D114}


class OpsPen(BasePen):
    def __init__(self, glyphset):
        super().__init__(glyphset)
        self.ops = []

    def _moveTo(self, p):
        self.ops.append(["M", *p])

    def _lineTo(self, p):
        self.ops.append(["L", *p])

    def _qCurveToOne(self, p1, p2):
        self.ops.append(["Q", *p1, *p2])

    def _curveToOne(self, p1, p2, p3):
        self.ops.append(["C", *p1, *p2, *p3])

    def _closePath(self):
        self.ops.append(["Z"])


font = TTFont(FONT)
cmap = font.getBestCmap()
gs = font.getGlyphSet()
out = {}
for name, cp in GLYPHS.items():
    g = gs[cmap[cp]]
    pen = OpsPen(gs)
    g.draw(pen)
    xs = [v for op in pen.ops for v in op[1::2]]
    ys = [v for op in pen.ops for v in op[2::2]]
    out[name] = {"bbox": [min(xs), min(ys), max(xs), max(ys)], "ops": pen.ops}
    print(name, out[name]["bbox"], len(pen.ops), "ops")

Path(__file__).with_name("glyphs.json").write_text(json.dumps(out))
