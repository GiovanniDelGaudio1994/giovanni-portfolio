"""Update the public CV portrait in the GitHub Pages output only."""
from __future__ import annotations
import base64
from pathlib import Path
import re

def update_cv(cv_dir: Path, photo_file: Path) -> None:
    photo_b64 = photo_file.read_text(encoding="ascii").strip()
    jpeg = base64.b64decode(photo_b64, validate=True)
    if not jpeg.startswith(b"\xff\xd8\xff"):
        raise ValueError("Invalid CV portrait")
    pdf_path = cv_dir / "CV_Giovanni_Del_Gaudio.pdf"
    pdf = pdf_path.read_bytes()
    # Image XObject 11 is the original portrait in the approved public CV.
    obj_id = 11
    m = re.search(rb"(?m)^11 0 obj\s*(<<[\s\S]{0,450}?>>)\s*stream", pdf)
    if not m or b"/Subtype /Image" not in m.group(1):
        raise ValueError("Expected CV photo XObject missing")
    xrefs = list(re.finditer(rb"startxref\s+(\d+)\s+%%EOF", pdf))
    trailers = list(re.finditer(rb"trailer\s*<<(.*?)>>", pdf, flags=re.S))
    if not xrefs or not trailers:
        raise ValueError("PDF trailer/xref missing")
    previous = int(xrefs[-1].group(1))
    trailer = trailers[-1].group(1)
    size = re.search(rb"/Size\s+(\d+)", trailer)
    root = re.search(rb"/Root\s+(\d+\s+\d+\s+R)", trailer)
    if not size or not root:
        raise ValueError("PDF Root/Size missing")
    # Add a new image object version via a standard incremental PDF update.
    header = (f"11 0 obj\n<< /Type /XObject /Subtype /Image /Width 144 /Height 144 "
              f"/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode "
              f"/Length {len(jpeg)} >>\nstream\n").encode()
    offset = len(pdf)
    image_obj = header + jpeg + b"\nendstream\nendobj\n"
    new_xref = offset + len(image_obj)
    xref = (f"xref\n11 1\n{offset:010d} 00000 n \ntrailer\n"
            f"<< /Size {size.group(1).decode()} /Root {root.group(1).decode()} /Prev {previous} >>\n"
            f"startxref\n{new_xref}\n%%EOF\n").encode()
    pdf_path.write_bytes(pdf + image_obj + xref)
    html_path = cv_dir / "index.html"
    html = html_path.read_text(encoding="utf-8")
    pattern = r'(class="photo"><img src="data:image/jpeg;base64,)[A-Za-z0-9+/=]+'
    html, count = re.subn(pattern, lambda m: m.group(1) + photo_b64, html, count=1)
    if count != 1:
        raise ValueError("CV web preview photo missing")
    html_path.write_text(html, encoding="utf-8")
    print("CV public portrait updated in generated PDF and HTML")
