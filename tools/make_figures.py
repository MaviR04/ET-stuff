"""Regenerate Fig. 1 (PRISMA 2020 flow) and Fig. 2 (included studies by theme and year).

    python tools/make_figures.py

Fig. 2 is computed, not typed: themes come from the "INCLUDED STUDIES" table in
screening-log.md and years from the reference list of CANTUS-Research-Paper-revised.md.
Fig. 1 uses the PRISMA counts from screening-log.md (kept here as constants; the script
checks that they add up). Output: figures/fig1.png, figures/fig2.png (300 dpi), and a copy
of each at the repository root, where the earlier figure files live.
"""
import re
import shutil
from collections import Counter
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "figures"
DPI = 300

plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["Times New Roman", "Times", "DejaVu Serif"],
    "font.size": 10,
})

BLUE = "#4C72B0"      # bar colour used in the original Fig. 2
EDGE = "#555555"
FILL = "#F2F2F2"      # box fill used in Fig. 3
PHASE = "#DCE6F2"
NAVY = "#2F5597"


# ---------------------------------------------------------------- data
def included_studies():
    """[(ref, theme)] from the INCLUDED STUDIES table in screening-log.md."""
    log = (ROOT / "screening-log.md").read_text(encoding="utf-8")
    section = log.split("## INCLUDED STUDIES", 1)[1].split("\n## ", 1)[0]
    rows = re.findall(r"^\| \[(\d+)\] \|[^|]+\|[^|]+\| ([^|]+?) \|$", section, re.M)
    return [(int(ref), theme) for ref, theme in rows]


def reference_years():
    """{ref: year} from the paper's reference list (year of the cited version)."""
    paper = (ROOT / "CANTUS-Research-Paper-revised.md").read_text(encoding="utf-8")
    refs = paper.split("## REFERENCES", 1)[1]
    years = {}
    for m in re.finditer(r"^\[(\d+)\] (.+)$", refs, re.M):
        # a year not inside an arXiv ID, DOI or page range
        found = re.findall(r"(?<![\d.:/])((?:19|20)\d\d)(?![\d]|\.\d)", m.group(2))
        if found:
            years[int(m.group(1))] = int(found[-1])
    return years


# ---------------------------------------------------------------- Fig. 1
PRISMA = {
    "sources": [("IEEE Xplore", 27), ("ACM Digital Library", 50), ("arXiv", 81),
                ("ISMIR Proceedings Archive", 23)],
    "duplicates": 13,
    "screen_excluded": [("Front matter", 2), ("Outside topic scope", 16)],
    "fulltext_excluded": [
        ("Audio-only, no symbolic intermediate", 14),
        ("Non-generative, or applies an existing\nrepresentation without proposing,\ncomparing or evaluating one", 88),
        ("Secondary review", 8),
        ("Superseded version", 7),
        ("Excluded on re-applying final criteria", 2),
        ("First excluded on date; off-topic\non re-screening", 3),
    ],
    "included": 28,
}


def fig1(path):
    p = PRISMA
    identified = sum(n for _, n in p["sources"])
    screened = identified - p["duplicates"]
    fulltext = screened - sum(n for _, n in p["screen_excluded"])
    excluded = sum(n for _, n in p["fulltext_excluded"])
    assert (identified, screened, fulltext, fulltext - excluded) == (181, 168, 150, p["included"]), \
        "PRISMA counts do not add up"

    W, H = 7.0, 5.75
    fig = plt.figure(figsize=(W, H))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(0, H)
    ax.invert_yaxis()
    ax.axis("off")

    def box(x, y, w, h, lines, fill=FILL, edge=EDGE, lw=1.0, bold_first=True, align="left", size=9.5):
        ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=0.06",
                                    fc=fill, ec=edge, lw=lw))
        tx = x + 0.12 if align == "left" else x + w / 2
        # first line bold, the rest regular, stacked from the vertical centre
        lh = size / 72 * 1.28
        n = sum(l.count("\n") + 1 for l in lines)
        ty = y + h / 2 - n * lh / 2 + lh / 2
        for i, l in enumerate(lines):
            k = l.count("\n") + 1
            ax.text(tx, ty + (k - 1) * lh / 2, l, ha=align, va="center", fontsize=size,
                    fontweight="bold" if (i == 0 and bold_first) else "normal", linespacing=1.28)
            ty += k * lh

    def arrow(x1, y1, x2, y2):
        ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>", mutation_scale=11,
                                     lw=1.0, color=EDGE, shrinkA=0, shrinkB=0))

    def phase(y, h, label):
        ax.add_patch(FancyBboxPatch((0.1, y), 0.34, h, boxstyle="round,pad=0,rounding_size=0.06",
                                    fc=PHASE, ec=NAVY, lw=0.8))
        ax.text(0.27, y + h / 2, label, rotation=90, ha="center", va="center",
                fontsize=10, fontweight="bold", color=NAVY)

    LX, LW = 0.6, 2.95          # main column
    RX, RW = 3.95, 2.95         # side column
    ind = "   "

    # Identification
    y1, h1 = 0.15, 1.35
    box(LX, y1, LW, h1, [f"Records identified from databases (n = {identified})"]
        + [f"{ind}{s} (n = {n})" for s, n in p["sources"]] + [f"All {identified} records retrieved"])
    box(RX, y1 + 0.35, RW, 0.65, ["Records removed before screening",
                                  f"{ind}Duplicate records (n = {p['duplicates']})"])
    arrow(LX + LW, y1 + h1 / 2, RX, y1 + h1 / 2)

    # Screening
    y2, h2 = y1 + h1 + 0.35, 0.45
    box(LX, y2, LW, h2, [f"Records screened (n = {screened})"])
    arrow(LX + LW / 2, y1 + h1, LX + LW / 2, y2)
    ye, he = y2 - 0.15, 0.75
    box(RX, ye, RW, he, [f"Records excluded (n = {screened - fulltext})"]
        + [f"{ind}{s} (n = {n})" for s, n in p["screen_excluded"]])
    arrow(LX + LW, y2 + h2 / 2, RX, y2 + h2 / 2)

    y3, h3 = ye + he + 0.45, 0.45
    box(LX, y3, LW, h3, [f"Full-text reports assessed (n = {fulltext})"])
    arrow(LX + LW / 2, y2 + h2, LX + LW / 2, y3)
    yx, hx = y3 - 0.2, 1.85
    box(RX, yx, RW, hx, [f"Reports excluded (n = {excluded})"]
        + [f"{ind}{s.replace(chr(10), chr(10) + ind)} (n = {n})" for s, n in p["fulltext_excluded"]], size=9)
    arrow(LX + LW, y3 + h3 / 2, RX, y3 + h3 / 2)

    # Included
    y4, h4 = yx + hx + 0.3, 0.75
    box(LX, y4, LW, h4, [f"Studies included in review (n = {p['included']})"], fill=PHASE, edge=NAVY, lw=1.4)
    ax.plot([LX + LW / 2] * 2, [y3 + h3, y4 - 0.02], color=EDGE, lw=1.0)
    arrow(LX + LW / 2, y4 - 0.3, LX + LW / 2, y4)

    phase(y1, h1, "Identification")
    phase(y2 - 0.15, y4 - 0.2 - (y2 - 0.15), "Screening")
    phase(y4, h4, "Included")

    assert y4 + h4 < H - 0.05, "figure too short"
    fig.savefig(path, dpi=DPI)
    plt.close(fig)


# ---------------------------------------------------------------- Fig. 2
def fig2(path):
    studies = included_studies()
    years = reference_years()
    assert len(studies) == PRISMA["included"], f"expected {PRISMA['included']} studies, found {len(studies)}"
    missing = [r for r, _ in studies if r not in years]
    assert not missing, f"no year found for {missing}"

    by_theme = Counter(t for _, t in studies)
    by_year = Counter(years[r] for r, _ in studies)
    span = list(range(2018, 2027))

    fig, (a, b) = plt.subplots(1, 2, figsize=(6.84, 2.6), gridspec_kw={"width_ratios": [1.35, 1]})
    themes = sorted(by_theme, key=lambda t: (-by_theme[t], t))
    vals = [by_theme[t] for t in themes]
    a.barh(themes, vals, color=BLUE, height=0.6)
    a.invert_yaxis()
    for i, v in enumerate(vals):
        a.text(v + 0.12, i, str(v), va="center", fontsize=9)
    a.set_xlim(0, max(vals) + 1)
    a.set_xlabel("Number of studies")
    a.set_title("(a) By theme", loc="left", fontsize=10)

    yv = [by_year.get(y, 0) for y in span]
    b.bar([str(y) for y in span], yv, color=BLUE, width=0.6)
    for i, v in enumerate(yv):
        if v:
            b.text(i, v + 0.15, str(v), ha="center", fontsize=9)
    b.set_ylim(0, max(yv) + 1.5)
    b.set_ylabel("Number of studies")
    b.tick_params(axis="x", rotation=45)
    b.set_title("(b) By year of publication", loc="left", fontsize=10)

    for axis in (a, b):
        axis.spines[["top", "right"]].set_visible(False)
        axis.tick_params(labelsize=9)
    fig.tight_layout()
    fig.savefig(path, dpi=DPI)
    plt.close(fig)
    return by_theme, by_year


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    fig1(OUT / "fig1.png")
    by_theme, by_year = fig2(OUT / "fig2.png")
    for name in ("fig1.png", "fig2.png"):
        shutil.copyfile(OUT / name, ROOT / name)
    print("themes:", dict(sorted(by_theme.items(), key=lambda kv: -kv[1])), "total", sum(by_theme.values()))
    print("years: ", dict(sorted(by_year.items())), "total", sum(by_year.values()))
    print("wrote figures/fig1.png, figures/fig2.png (+ copies at repo root)")
