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

    # Clear the previous circular cropped photo. No sidebar text is covered.
    page.draw_rect(fitz.Rect(20, 5, 149, 123),
                   fill=(0.916, 0.957, 0.992), color=None, overlay=True)
    frame = fitz.Rect(27, 10, 143, 120)
    page.insert_image(frame, stream=jpeg, keep_proportion=True, overlay=True)
    page.draw_rect(frame, color=(0.78, 0.85, 0.93), width=0.75, overlay=True)
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
        ".photo{height:42mm;width:38mm;border-radius:7px;margin:0 auto 3mm;overflow:hidden;border:2px solid white;"
    )
    if "height:42mm;width:38mm" not in html:
        raise ValueError("CV preview portrait styling missing")
    if "3456109046" in html or "+39 345" in html:
        raise ValueError("Private phone detected in public CV HTML")
    html_path.write_text(html, encoding="utf-8")
    print("Full-bust, earring-free portrait published in PDF and HTML preview")
