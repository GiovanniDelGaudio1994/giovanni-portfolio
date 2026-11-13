#!/usr/bin/env python3
"""Check local assets and basic accessibility across *all* built public pages.

This is a build-time smoke test, not a browser/Lighthouse or security audit.
It inspects rendered _site/ output, not only the portfolio landing pages.
"""
from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "_site"
LINK_ATTRIBUTES = ("href", "src", "poster", "data-demo-url")


class PublicPageAudit(HTMLParser):
    def __init__(self, file: Path):
        super().__init__(convert_charrefs=True)
        self.file = file
        self.errors: list[str] = []
        self.ids: list[str] = []
        self.refs: list[tuple[str, str, int]] = []
        self.images = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        line = self.getpos()[0]
        if tag == "img":
            self.images += 1
            if "alt" not in data:
                self.errors.append(f"{line}: image missing alt attribute")
        if data.get("id"):
            self.ids.append(data["id"])
        if tag == "a" and data.get("target") == "_blank":
            rel = set((data.get("rel") or "").lower().split())
            if "noopener" not in rel and "noreferrer" not in rel:
                self.errors.append(f"{line}: target=_blank without noopener/noreferrer")
        for name in LINK_ATTRIBUTES:
            value = data.get(name)
            if value and not (name == "href" and tag in ("meta",)):
                self.refs.append((name, value, line))

    def finish(self) -> list[str]:
        repeated = [id_ for id_, count in Counter(self.ids).items() if count > 1]
        for id_ in repeated:
            self.errors.append(f"duplicate id={id_!r}")
        for attribute, value, line in self.refs:
            split = urlsplit(value)
            if value.startswith("//") or split.scheme or split.netloc:
                continue  # External host, mailto, data, blob, javascript, etc.
            if not split.path:
                continue  # Fragment-only or current-document reference.
            if split.path.startswith("/"):
                target = SITE / unquote(split.path).lstrip("/")
            else:
                target = self.file.parent / unquote(split.path)
            target = target.resolve()
            if not target.is_relative_to(SITE.resolve()):
                self.errors.append(f"{line}: path escapes public site: {attribute}={value!r}")
                continue
            if target.is_file():
                continue
            if target.is_dir() and (target / "index.html").is_file():
                continue
            if target.with_suffix(".html").is_file():
                continue  # GitHub Pages may serve an extensionless .html route.
            self.errors.append(f"{line}: missing local target: {attribute}={value!r}")
        return self.errors


def main() -> int:
    if not SITE.is_dir():
        print("AUDIT FAILED: run python3 scripts/build_pages.py first", file=sys.stderr)
        return 1
    pages = sorted(SITE.rglob("*.html"))
    if len(pages) < 15:
        print(f"AUDIT FAILED: expected at least 15 HTML pages, got {len(pages)}", file=sys.stderr)
        return 1
    failures = 0
    links = 0
    images = 0
    for page in pages:
        audit = PublicPageAudit(page)
        audit.feed(page.read_text(encoding="utf-8"))
        for error in audit.finish():
            print(f"AUDIT FAILED: {page.relative_to(SITE)}: {error}", file=sys.stderr)
            failures += 1
        links += len(audit.refs)
        images += audit.images
    if failures:
        print(f"Found {failures} errors in {len(pages)} public pages.", file=sys.stderr)
        return 1
    print(f"Public pages OK: {len(pages)} HTML, {links} references, "
          f"{images} images (local targets, alt text, duplicate IDs, safe new tabs).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
