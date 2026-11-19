"""Add a full-bust photo to the published CV PDF and web preview.

Public CV only: the private telephone is never added to this build.
The canonical source PDF is retained; the rendered Pages copy is adjusted.
"""
from __future__ import annotations
import base64
from pathlib import Path
import re
import fitz


def update_cv(cv_dir: Path, photo_file: Path) -> None:
    photo_b64 = photo_file.read_text(encoding="ascii").strip()
    jpeg = base64.b64decode(photo_b64, validate=True)
    if not jpeg.startswith(b"\xff\xd8\xff") or not jpeg.endswith(b"\xff\xd9"):
        raise ValueError("Invalid or incomplete CV JPEG image")
    pic = fitz.Pixmap(jpeg)
    if pic.width < 140 or pic.height < 150:
        raise ValueError("Portrait resolution too small")

    pdf_path = cv_dir / "CV_Giovanni_Del_Gaudio.pdf"
    doc = fitz.open(pdf_path)
    if len(doc) < 1:
        raise ValueError("Missing CV pages")
    page = doc[0]
    if page.rect.width < 590:
        raise ValueError("Unexpected CV page size")

    # IMPORTANT: remove the existing photo image objects, not just cover them.
    # Covering only with a rectangle had left the old circular photo visible
    # under the new portrait in iOS PDF previews.
    old_photo_xrefs = set()
    for image in page.get_images(full=True):
        xref = image[0]
        for rect in page.get_image_rects(xref):
            if (rect.x0 >= 18 and rect.x1 <= 180
                    and rect.y0 < 130 and rect.y1 <= 135
                    and rect.width > 40 and rect.height > 40):
                old_photo_xrefs.add(xref)
    if not old_photo_xrefs:
        raise ValueError("Existing CV portrait not located; refusing to overlay")
    for xref in old_photo_xrefs:
        page.delete_image(xref)  # replaces original image object with transparent pixel

    # Erase the old circular border and shadow within the photo area only.
    # Keep the contact heading and all sidebar copy untouched.
    page.draw_rect(fitz.Rect(31, 6, 141, 124),
                   fill=(0.925, 0.963, 0.990), color=None, overlay=True)
    frame = fitz.Rect(36, 9, 136, 113)  # Leave a clear gap above Contatti
    page.insert_image(frame, stream=jpeg, keep_proportion=True, overlay=True)
    page.draw_rect(frame, color=(0.73, 0.83, 0.91), width=0.7, overlay=True)

    visible_photo_count = 0
    for image in page.get_images(full=True):
        xref, width, height = image[0], image[2], image[3]
        if width <= 1 or height <= 1:
            continue
        rects = page.get_image_rects(xref)
        if any(q.x0 >= 18 and q.x1 <= 180 and q.y0 < 130 and
               q.y1 <= 135 and q.width > 40 for q in rects):
            visible_photo_count += 1
    if visible_photo_count != 1:
        raise ValueError(f"Expected one portrait image, found {visible_photo_count}")
    data = doc.tobytes(garbage=4, deflate=True)
    doc.close()
    if b"+39 345" in data or b"3456109046" in data:
        raise ValueError("Private phone detected in public PDF")
    pdf_path.write_bytes(data)

    # Browser CV mirrors the rectangular full-bust framing instead of the old circle.
    html_path = cv_dir / "index.html"
    html = html_path.read_text(encoding="utf-8")
    pattern = r'(class="photo"><img src="data:image/jpeg;base64,)[A-Za-z0-9+/=]+'
    html, count = re.subn(pattern, lambda m: m.group(1) + photo_b64, html, count=1)
    if count != 1:
        raise ValueError("CV preview portrait element missing")
    html = html.replace(
        ".photo{height:36.5mm;width:36.5mm;border-radius:50%;margin:0 auto 6.7mm;overflow:hidden;border:3px solid white;",
        ".photo{height:40mm;width:38mm;border-radius:5px;margin:0 auto 5mm;overflow:hidden;border:2px solid white;"
    )
    # The photo is a rectangular portrait, never cropped into another circle.
    html = html.replace("object-fit:cover;object-position:center",
                        "object-fit:contain;object-position:center")
    # Keep the original contact icons, but avoid awkward multiline URLs.
    html = html.replace(
        ".contact{display:flex;align-items:flex-start;gap:6px;font-size:7.5pt;",
        ".contact{display:flex;align-items:flex-start;gap:3px;font-size:6.9pt;"
    ).replace(
        ".contact .ico{height:12px;width:12px;margin-top:1px}",
        ".contact .ico{height:10px;width:10px;margin-top:1px}"
    )
    html = html.replace(
        '>github.com/GiovanniDelGaudio1994</a>',
        '>GitHub: GiovanniDelGaudio1994</a>'
    )
    if 'GitHub: GiovanniDelGaudio1994</a>' not in html:
        raise ValueError("GitHub contact label not updated")
    if "height:40mm;width:38mm" not in html:
        raise ValueError("CV preview portrait styling missing")
    if "3456109046" in html or "+39 345" in html:
        raise ValueError("Private phone detected in public CV HTML")
    html_path.write_text(html, encoding="utf-8")
    print("Full-bust, earring-free portrait published in PDF and HTML preview")
