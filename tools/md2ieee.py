"""Convert CANTUS-Research-Paper-revised.md into the IEEE-template docx (reusing the old package's styles)."""
import re, shutil, os, zipfile, sys
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_MD = os.path.join(ROOT, "CANTUS-Research-Paper-revised.md")
TEMPLATE_DOCX = os.path.join(ROOT, "CANTUS-Research-Paper.docx")  # original IEEE-template docx; its styles are reused
OUT = os.path.join(ROOT, "CANTUS-Research-Paper-revised.docx")
SCR = os.path.join(ROOT, "tools", "_build")
COL_W = 5040  # one IEEE column (3.5 in) in DXA

md = open(SRC_MD, encoding="utf-8").read()
md = re.sub(r"<!--.*?-->", "", md, flags=re.S)
md = md.split("\n[image1]:")[0]

# equations: the md embeds them as images; write them as text runs instead
EQ = {
    "![][image1]": "\x00EQ1\x00", "![][image2]": "\x00EQL\x00",
    "![][image3]": "\x00EQD\x00", "![][image4]": "\x00EQ2\x00",
}
for k, v in EQ.items():
    md = md.replace(k, v)


def r(text, b=False, i=False, sz=None, upright=False):
    props = ""
    if b: props += "<w:b/>"
    if i: props += "<w:i/>"
    if upright: props += '<w:i w:val="0"/>'
    if sz: props += f'<w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/>'
    rpr = f"<w:rPr>{props}</w:rPr>" if props else ""
    return f'<w:r>{rpr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def eq_runs(code, sz=None):
    O = lambda t: r(t, upright=True, sz=sz)
    I = lambda t: r(t, i=True, sz=sz)
    if code == "EQ1": return O("O(") + I("L") + O("²") + I("D") + O(")")
    if code == "EQ2": return O("O(") + I("LD") + O(")")
    if code == "EQL": return I("L")
    if code == "EQD": return I("D")


def inline(text, sz=None, base_b=False, base_i=False):
    """Markdown inline -> runs: **bold**, *italic*, `code`, escaped \\* and equation markers."""
    text = text.replace("\\*", "\x01")
    out = []
    pos = 0
    pat = re.compile(r"\x00(EQ\w*)\x00|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`")
    for m in pat.finditer(text):
        if m.start() > pos:
            out.append(r(text[pos:m.start()].replace("\x01", "*"), b=base_b, i=base_i, sz=sz))
        if m.group(1):
            out.append(eq_runs(m.group(1), sz))
        elif m.group(2) is not None:
            out.append(inline(m.group(2), sz, base_b=True, base_i=base_i))
        elif m.group(3) is not None:
            out.append(inline(m.group(3), sz, base_b=base_b, base_i=True))
        else:
            out.append(r(m.group(4).replace("\x01", "*"), b=base_b, i=base_i, sz=sz))
        pos = m.end()
    if pos < len(text):
        out.append(r(text[pos:].replace("\x01", "*"), b=base_b, i=base_i, sz=sz))
    return "".join(out)


def para(style, runs, extra_ppr=""):
    return f'<w:p><w:pPr><w:pStyle w:val="{style}"/>{extra_ppr}</w:pPr>{runs}</w:p>'


def table(rows):
    ncol = len(rows[0])
    # proportional widths by longest cell text, with a floor
    lens = [max(len(re.sub(r"[*`]", "", row[c])) for row in rows) for c in range(ncol)]
    lens = [max(l, 6) for l in lens]
    tot = sum(lens)
    widths = [int(COL_W * l / tot) for l in lens]
    widths[-1] += COL_W - sum(widths)
    grid = "".join(f'<w:gridCol w:w="{w}"/>' for w in widths)
    x = (f'<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:type="dxa" w:w="{COL_W}"/>'
         f'<w:jc w:val="center"/><w:tblLayout w:type="fixed"/>'
         f'<w:tblCellMar><w:left w:w="57" w:type="dxa"/><w:right w:w="57" w:type="dxa"/></w:tblCellMar>'
         f'<w:tblLook w:firstColumn="1" w:firstRow="1" w:lastColumn="0" w:lastRow="0" w:noHBand="0" w:noVBand="1" w:val="04A0"/>'
         f'</w:tblPr><w:tblGrid>{grid}</w:tblGrid>')
    for ri, row in enumerate(rows):
        hdr = ri == 0
        x += "<w:tr>" + ('<w:trPr><w:tblHeader/></w:trPr>' if hdr else "")
        for c, cell in enumerate(row):
            x += (f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{widths[c]}"/></w:tcPr>'
                  f'<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:jc w:val="{"center" if hdr else "left"}"/></w:pPr>'
                  f'{inline(cell.strip(), sz=16, base_b=hdr)}</w:p></w:tc>')
        x += "</w:tr>"
    return x + "</w:tbl>"


def ref_para(line):
    m = re.match(r"\[(\d+)\] (.*)", line)
    num, rest = m.group(1), m.group(2)
    runs = r(f"[{num}]\t") + inline(rest)
    ppr = '<w:tabs><w:tab w:val="left" w:pos="360"/></w:tabs><w:ind w:left="360" w:hanging="360"/>'
    return para("references", runs, ppr)


blocks = []
lines = md.split("\n")
i = 0
section = None
title_done = False
while i < len(lines):
    ln = lines[i].rstrip()
    if not ln or ln == "---":
        i += 1; continue
    if ln.startswith("# ") and not title_done:
        blocks.append(para("papertitle", r(ln[2:].strip()))); title_done = True
        i += 1
        # author block: following non-empty lines until '---'
        auth = []
        while i < len(lines) and lines[i].strip() != "---":
            if lines[i].strip(): auth.append(lines[i].strip())
            i += 1
        for k, a in enumerate(auth):
            a = a.strip("*")
            blocks.append(para("Author" if k == 0 else "Affiliation", r(a)))
        continue
    if ln.startswith("## "):
        h = ln[3:].strip()
        section = h
        if h == "Abstract":
            i += 1
            while not lines[i].strip(): i += 1
            blocks.append(para("Abstract", r("Abstract—", b=True, i=True) + inline(lines[i].strip(), base_b=True)))
            i += 1; continue
        if h == "REFERENCES":
            blocks.append(para("Heading1", r("References")))
        else:
            blocks.append(para("Heading1", r(h)))
        i += 1; continue
    if ln.startswith("### "):
        blocks.append(para("Heading2", inline(ln[4:].strip()))); i += 1; continue
    if ln.startswith("#### "):
        blocks.append(para("Heading3", inline(ln[5:].strip()))); i += 1; continue
    if ln.startswith("**Index Terms**"):
        rest = ln.split("**Index Terms**", 1)[1].lstrip("—").strip()
        blocks.append(para("Keywords", r("Index Terms", b=True, i=True) + r("—", b=True) + r(rest, b=True)))
        i += 1; continue
    m = re.match(r"\*\*(TABLE [IVX]+)\. (.+)\*\*$", ln)
    if m:
        blocks.append(para("tablehead", r(f"{m.group(1)}. {m.group(2)}")))
        i += 1; continue
    if ln.startswith("|"):
        rows = []
        while i < len(lines) and lines[i].startswith("|"):
            cells = [c for c in lines[i].strip().strip("|").split("|")]
            if not re.match(r"^\s*:?-+:?\s*$", cells[0]):
                rows.append(cells)
            i += 1
        blocks.append(table(rows))
        blocks.append('<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr></w:p>')
        continue
    m = re.match(r"> \*\*(Fig\. \d+\.)\*\* (.+)", ln)
    if m:
        blocks.append(para("figurecaption", r(m.group(1)) + r(" ") + inline(m.group(2))))
        i += 1; continue
    if section == "REFERENCES" and re.match(r"\[\d+\] ", ln):
        blocks.append(ref_para(ln)); i += 1; continue
    if ln.startswith("- "):
        # RQ list: IEEE style, indented paragraphs without bullet glyphs
        blocks.append(para("BodyText", inline(ln[2:].strip()), '<w:ind w:left="288" w:hanging="0"/>'))
        i += 1; continue
    blocks.append(para("BodyText", inline(ln.strip())))
    i += 1

# assemble from the template package
tmp = os.path.join(SCR, "newdocx")
if os.path.exists(tmp): shutil.rmtree(tmp)
os.makedirs(tmp)
zipfile.ZipFile(TEMPLATE_DOCX).extractall(tmp)
sp = os.path.join(tmp, "word", "settings.xml")  # schema fix: w:zoom needs w:percent
st = open(sp, encoding="utf-8").read().replace('<w:zoom w:val="bestFit"/>', '<w:zoom w:val="bestFit" w:percent="100"/>')
open(sp, "w", encoding="utf-8").write(st)
doc_path = os.path.join(tmp, "word", "document.xml")
old = open(doc_path, encoding="utf-8").read()
head = old[:old.index("<w:body>") + len("<w:body>")]
sect = re.findall(r"<w:sectPr.*?</w:sectPr>", old, re.S)[-1]
open(doc_path, "w", encoding="utf-8").write(head + "".join(blocks) + sect + "</w:body></w:document>")
if os.path.exists(OUT): os.remove(OUT)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    # [Content_Types].xml first
    z.write(os.path.join(tmp, "[Content_Types].xml"), "[Content_Types].xml")
    for root, _, files in os.walk(tmp):
        for f in files:
            full = os.path.join(root, f)
            arc = os.path.relpath(full, tmp).replace("\\", "/")
            if arc != "[Content_Types].xml":
                z.write(full, arc)
print("blocks:", len(blocks), "->", OUT)
