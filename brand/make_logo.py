"""Draw the square FKarim Web Design logo as a self-contained SVG.

The composition is basilicalabs.ai's square logo (assets/brand/logo-square-*.png
in that site's repository): the three sparkle stars stacked over the wordmark,
at the same proportions. Here the stars are emerald, "FKarim" is white on
ink, and "Web Design" sits centred underneath in Instrument Serif, as it does
in the site's header. The lettering is shaped with HarfBuzz and converted to
outlines, so the file needs no fonts.

    pip install uharfbuzz fonttools brotli
    python3 brand/make_logo.py brand/logo-square.svg
"""
import io, sys, json
from pathlib import Path
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS = Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'fonts'
CANVAS = 1080                                   # Instagram's full-size square
COLOURS = dict(ground='#111114', name='#F6F3EC', line='#2DD4A0', stars='#10B981')   # ink, paper, accent-bright, accent
# the sparkle cluster from basilicalabs.ai (assets/site-header.js): one star, three placements in a 100 x 96 box
STAR = 'M50 0C54 32 68 46 100 50 68 54 54 68 50 100 46 68 32 54 0 50 32 46 46 32 50 0Z'
STARS = [((52, 0), .30), ((0, 22), .60), ((60, 56), .40)]
# measured from basilicalabs.ai's square logo at 1024 px: the cluster is 368 px wide, the wordmark
# 145.3 px (its letters 103 px tall), with 94 px from the foot of the cluster to the tops of the letters
CLUSTER, NAME, GAP = 368 / 1024, 145.3 / 1024, 94 / 1024


def load(name):
    t = TTFont(FONTS / name); t.flavor = None; b = io.BytesIO(); t.save(b)
    return t, hb.Font(hb.Face(b.getvalue()))


def run(font_pair, text, tracking):
    """Shape one line; return glyphs [(name, x, y)] in font units, CSS letter-spacing after every character."""
    t, f = font_pair; upm = t['head'].unitsPerEm; order = t.getGlyphOrder()
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); hb.shape(f, buf, {'kern': True})
    x, out = 0.0, []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        out.append((order[info.codepoint], x + pos.x_offset, pos.y_offset))
        x += pos.x_advance + tracking * upm
    return out


def draw(font_pair, glyphs, size, x0, baseline):
    """Outline a shaped line at `size` px; return the SVG path data and its ink box [left, top, right, bottom]."""
    t, _ = font_pair; gs = t.getGlyphSet(); s = size / t['head'].unitsPerEm
    fmt = lambda v: ('%.2f' % v).rstrip('0').rstrip('.')
    d, box = [], [1e9, 1e9, -1e9, -1e9]
    for name, gx, gy in glyphs:
        aff = (s, 0, 0, -s, x0 + gx * s, baseline - gy * s)
        pen = SVGPathPen(gs, ntos=fmt); gs[name].draw(TransformPen(pen, aff)); d.append(pen.getCommands())
        bp = BoundsPen(gs); gs[name].draw(TransformPen(bp, aff))
        if bp.bounds:
            a, b, c, e = bp.bounds; box = [min(box[0], a), min(box[1], b), max(box[2], c), max(box[3], e)]
    return ''.join(d), box


def line_top_to_baseline(font_pair, size):
    """Where CSS puts the baseline in a line box with line-height 1: half-leading plus the hhea ascent."""
    hh, upm = font_pair[0]['hhea'], font_pair[0]['head'].unitsPerEm
    return (size - (hh.ascent - hh.descent) / upm * size) / 2 + hh.ascent / upm * size


def build(canvas=CANVAS, colours=COLOURS):
    flux, serif = load('flux.woff2'), load('instrument-serif-latin.woff2')
    S = NAME * canvas; D = .675 * S                  # the site's lockup: "Web Design" at .675 of the name
    B = CLUSTER * canvas; H = .96 * B                # the cluster's ink fills its 100 x 96 box
    name = run(flux, 'FKarim', .004); line = run(serif, 'Web Design', .01)
    _, bw = draw(flux, name, S, 0, 0); _, bd = draw(serif, line, D, 0, 0)    # ink boxes at the origin
    # stacked as in the site's CSS: the two line boxes .08em (of "Web Design") apart
    step = S - line_top_to_baseline(flux, S) + .08 * D + line_top_to_baseline(serif, D)
    height = H + GAP * canvas - bw[1] + step + bd[3]  # foot of the "g" is the lowest ink
    top, cx = (canvas - height) / 2, canvas / 2       # the whole group centred, as in the original
    base_w = top + H + GAP * canvas - bw[1]; base_d = base_w + step
    dw, iw = draw(flux, name, S, cx - (bw[0] + bw[2]) / 2, base_w)
    dd, idd = draw(serif, line, D, cx - (bd[0] + bd[2]) / 2, base_d)
    stars = ''.join(f'<path transform="translate({x} {y}) scale({k})" d="{STAR}"/>' for (x, y), k in STARS)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {canvas} {canvas}" width="{canvas}" height="{canvas}">\n'
           f'  <title>FKarim Web Design</title>\n'
           f'  <rect width="{canvas}" height="{canvas}" fill="{colours["ground"]}"/>\n'
           f'  <g fill="{colours["stars"]}" transform="translate({cx - B / 2:.2f} {top:.2f}) scale({B / 100:.5f})">{stars}</g>\n'
           f'  <path fill="{colours["name"]}" d="{dw}"/>\n'
           f'  <path fill="{colours["line"]}" d="{dd}"/>\n'
           f'</svg>\n')
    r = lambda v: round(v, 1)
    info = dict(name_px=r(S), line_px=r(D), cluster=[r(cx - B / 2), r(top), r(cx + B / 2), r(top + H)],
                name_ink=[r(v) for v in iw], line_ink=[r(v) for v in idd])
    return svg, info


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit('usage: python3 brand/make_logo.py OUTPUT.svg')
    svg, info = build()
    Path(sys.argv[1]).write_text(svg); print(sys.argv[1], json.dumps(info), len(svg), 'bytes')
