"""
Generate NIRAKSHAN Shield extension icons as real PNG files.

Written with only the Python standard library (zlib + struct) because Pillow is
not guaranteed to be installed. Renders a rounded shield with the brand
cyan -> indigo gradient and a white check, with 3x3 supersampling for smooth
edges.

Run:  python extension/tools/make_icons.py
"""

import math
import os
import struct
import zlib

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "icons")

# Brand colours (cyan -> indigo), matching the web app's accent.
C_TOP = (34, 211, 238)    # #22d3ee
C_BOTTOM = (79, 70, 229)  # #4f46e5
SS = 3                    # supersampling factor


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def inside_shield(x, y):
    """Normalised (0..1) point-in-shield test, tuned for a classic crest."""
    cx = 0.5

    # Rounded top: the upper 10% tapers in at the shoulders.
    top = 0.10
    if y < top:
        t = y / top
        half = 0.5 - 0.5 * math.cos(t * math.pi / 2) * 0.22
    elif y <= 0.55:
        half = 0.5
    else:
        # Lower body tapers toward a point at the bottom.
        t = (y - 0.55) / 0.45
        half = 0.5 * math.sqrt(max(0.0, 1.0 - t * t)) * (1 - t * 0.18)

    if y < 0.04 or y > 0.985:
        return False
    return abs(x - cx) <= half


def inside_check(x, y):
    """Two-segment tick mark, normalised."""
    def seg(px, py, ax, ay, bx, by, r):
        vx, vy = bx - ax, by - ay
        wx, wy = px - ax, py - ay
        L2 = vx * vx + vy * vy
        t = 0.0 if L2 == 0 else max(0.0, min(1.0, (wx * vx + wy * vy) / L2))
        dx, dy = wx - t * vx, wy - t * vy
        return dx * dx + dy * dy <= r * r

    r = 0.055
    return seg(x, y, 0.36, 0.52, 0.46, 0.63, r) or seg(x, y, 0.46, 0.63, 0.66, 0.40, r)


def render(size):
    px = bytearray()
    for py in range(size):
        px.append(0)  # PNG filter type 0 for this scanline
        for pxi in range(size):
            acc_r = acc_g = acc_b = 0
            hits = 0
            for sy in range(SS):
                for sx in range(SS):
                    x = (pxi + (sx + 0.5) / SS) / size
                    y = (py + (sy + 0.5) / SS) / size
                    if not inside_shield(x, y):
                        continue
                    hits += 1
                    if inside_check(x, y):
                        acc_r, acc_g, acc_b = acc_r + 255, acc_g + 255, acc_b + 255
                    else:
                        r, g, b = lerp(C_TOP, C_BOTTOM, y)
                        acc_r, acc_g, acc_b = acc_r + r, acc_g + g, acc_b + b
            total = SS * SS
            if hits == 0:
                px.extend((0, 0, 0, 0))
            else:
                # Average colour over covered samples, alpha over all samples,
                # so the anti-aliased edge keeps its shape.
                px.extend((
                    round(acc_r / hits),
                    round(acc_g / hits),
                    round(acc_b / hits),
                    round(255 * hits / total),
                ))
    return bytes(px)


def chunk(tag, data):
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def write_png(path, size):
    raw = render(size)
    header = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)  # 8-bit RGBA
    data = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )
    with open(path, "wb") as fh:
        fh.write(data)
    return len(data)


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    for s in (16, 32, 48, 128):
        target = os.path.join(OUT_DIR, "icon-%d.png" % s)
        n = write_png(target, s)
        print("wrote %s (%d bytes)" % (os.path.normpath(target), n))
