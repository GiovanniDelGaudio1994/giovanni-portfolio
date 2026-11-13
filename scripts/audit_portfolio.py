#!/usr/bin/env python3
"""Audit the two published portfolio pages; demos are tested separately.

This is a static regression guard, not a penetration test or a security guarantee.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "_site"
REQUIRED_CSP = (
    "default-src 'none'",
    "script-src 'self'",
    "script-src-attr 'none'",
    "style-src 'self'",
    "style-src-attr 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "frame-src 'self'",
    "upgrade-insecure-requests",
)
CANONICAL = "https://giovannidelgaudio.it/"


class PortfolioAudit(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.errors: list[str] = []
        self.csp = ""
        self.canonical = ""
        self.js_sources: set[str] = set()
        self.css_sources: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if any(key.startswith("on") for key in data):
            self.errors.append(f"Inline event handler on <{tag}>")
        if "style" in data:
            self.errors.append(f"Inline CSS attribute on <{tag}>")
        if tag == "style":
            self.errors.append("Inline <style> block")
        if tag == "script":
            src = data.get("src")
            if src:
                self.js_sources.add(src)
                if "://" in src or not src.endswith(("/site.js", "/theme-init.js")):
                    self.errors.append(f"Unapproved script source: {src}")
            elif data.get("type") != "application/ld+json":
                self.errors.append("Executable inline <script>")
        if tag == "meta" and (data.get("http-equiv") or "").lower() == "content-security-policy":
            self.csp = data.get("content") or ""
        if tag == "link" and data.get("rel") == "canonical":
            self.canonical = data.get("href") or ""
        if tag == "link" and data.get("rel") == "stylesheet":
            href = data.get("href") or ""
            self.css_sources.add(href)
            if "://" in href or not href.endswith("/site.css"):
                self.errors.append(f"Unapproved stylesheet: {href}")
        if tag == "a" and data.get("target") == "_blank":
            rel = set((data.get("rel") or "").split())
            if not {"noopener", "noreferrer"} <= rel:
                self.errors.append("target=_blank missing noopener/noreferrer")
        if tag in {"iframe", "object", "embed"} and tag != "iframe":
            self.errors.append(f"Embedded <{tag}> is not allowed")


def main() -> int:
    errors: list[str] = []
    for path in (
        SITE / "index.html",
        SITE / "portfolio/index.html",
        SITE / "en/index.html",
        SITE / "portfolio/en/index.html",
    ):
        if not path.is_file():
            errors.append(f"Missing generated page: {path}")
            continue
        page = PortfolioAudit()
        page.feed(path.read_text(encoding="utf-8"))
        errors.extend(f"{path}: {msg}" for msg in page.errors)
        for directive in REQUIRED_CSP:
            if directive not in page.csp:
                errors.append(f"{path}: missing CSP directive {directive}")
        if "'unsafe-inline'" in page.csp or "'unsafe-eval'" in page.csp:
            errors.append(f"{path}: unsafe-inline or unsafe-eval in CSP")
        english = path.parent.name == "en"
        expected_canonical = CANONICAL + ("en/" if english else "")
        if page.canonical != expected_canonical:
            errors.append(f"{path}: canonical must be {expected_canonical}")
        html = path.read_text(encoding="utf-8")
        if f'<html lang="{"en" if english else "it"}">' not in html:
            errors.append(f"{path}: incorrect document language")
        if 'hreflang="it"' not in html or 'hreflang="en"' not in html:
            errors.append(f"{path}: bilingual alternate links missing")
        if 'class="locale-switch"' not in html:
            errors.append(f"{path}: language selector missing")
        if html.count('data-rome-clock') != 1 or 'Europe/Rome' not in html:
            errors.append(f"{path}: Europe/Rome live clock missing")
        for field in ('data-clock-time', 'data-clock-date', 'data-clock-zone', 'data-clock-offset'):
            if html.count(field) != 1:
                errors.append(f"{path}: incomplete live clock: {field}")
        if english and ('<h3 id="stack-heading">Languages & technologies' not in html
                        or 'Personal projects' not in html):
            errors.append(f"{path}: essential English translations missing")
        # Validate verified education history and bilingual project release notes.
        for year in ("2014/2015", "2016/2017"):
            if year not in html:
                errors.append(f"{path}: missing education year {year}")
        for institution in ("Leonardo da Vinci", "unisa-seal.svg",
                            "leonardo-da-vinci-sapri-official.png"):
            if institution not in html:
                errors.append(f"{path}: missing education reference {institution}")
        if 'alt="Logo ufficiale dell’Istituto di Istruzione Superiore' not in html and not english:
            errors.append(f"{path}: official logo alt text missing in Italian")
        if 'alt="Official emblem of Leonardo da Vinci Upper Secondary School' not in html and english:
            errors.append(f"{path}: official logo alt text missing in English")
        if 'id="formazione-unisa"' not in html or 'id="formazione-diploma"' not in html:
            errors.append(f"{path}: education timeline incomplete")
        for anchor in ("#progetti", "#aggiornamenti", "#approccio",
                       "#chi-sono", "#certificazioni", "#contatti"):
            if f'href="{anchor}"' not in html:
                errors.append(f"{path}: missing primary navigation target {anchor}")
        if html.count('class="nav-item-icon"') < 6:
            errors.append(f"{path}: primary navigation icons missing")
        if 'Diploma tecnico — Geometra' not in html and not english:
            errors.append(f"{path}: Surveying diploma missing from Italian timeline")
        if 'id="aggiornamenti"' not in html or 'id="release-grid"' not in html:
            errors.append(f"{path}: release notes not rendered")
        if 'data-release-feed' in html or html.count('class="release-card"') < 21:
            errors.append(f"{path}: changelog placeholder or missing published entries")
        if 'id="release-more"' not in html or 'class="release-summary"' not in html:
            errors.append(f"{path}: changelog archive expansion or summary missing")
        if html.count('class="release-evidence"') < 15:
            errors.append(f"{path}: commit provenance missing from historical entries")
        for project in ("portfolio", "legacybridge", "forma-ai", "fit-zone",
                        "signalscope", "meteo-bash2d", "e-wine",
                        "gestione-farmacia", "irem"):
            if f'data-update-filter="{project}"' not in html:
                errors.append(f"{path}: missing archive filter: {project}")
        if 'data-update-filter="legacybridge"' not in html:
            errors.append(f"{path}: missing project release filter")
        if english:
            for item in ("Education & background", "Real updates.", "Release notes",
                         "Technical diploma — Surveying", "2016/2017"):
                if item not in html:
                    errors.append(f"{path}: missing English education/changelog text: {item}")
        else:
            for item in ("Il mio percorso di studi", "Aggiornamenti reali.",
                         "Diploma tecnico — Geometra", "Studi attualmente in corso."):
                if item not in html:
                    errors.append(f"{path}: missing Italian education/changelog text: {item}")
        if len(page.js_sources) != 2 or len(page.css_sources) != 1:
            errors.append(f"{path}: first-party JS/CSS assets missing")
        for asset in page.js_sources | page.css_sources:
            target = path.parent / asset
            if not target.is_file():
                errors.append(f"{path}: missing referenced asset {asset}")
    # LegacyBridge English is a real static route, not an untranslated fallback.
    for path, language, canonical, sample in (
        (SITE / "legacybridge-demo/index.html", "it",
         CANONICAL + "legacybridge-demo/", "Misurare. Capire. Condividere."),
        (SITE / "legacybridge-demo/en/index.html", "en",
         CANONICAL + "legacybridge-demo/en/", "Measure. Understand. Share."),
    ):
        if not path.is_file():
            errors.append(f"Missing localized LegacyBridge page: {path}")
            continue
        html = path.read_text(encoding="utf-8")
        if f'<html lang="{language}">' not in html:
            errors.append(f"{path}: incorrect language")
        if sample not in html:
            errors.append(f"{path}: expected translated content missing")
        if f'<link rel="canonical" href="{canonical}">' not in html:
            errors.append(f"{path}: incorrect canonical")
        if 'hreflang="it"' not in html or 'hreflang="en"' not in html:
            errors.append(f"{path}: bilingual alternate links missing")
        if 'class="locale-switch"' not in html:
            errors.append(f"{path}: language control missing")
        if html.count('aria-current="page"') != 1:
            errors.append(f"{path}: precisely one active language expected")
        if f'data-locale="{language}"' not in html:
            errors.append(f"{path}: locale link missing")
    
    for error in errors:
        print("SECURITY AUDIT FAILED:", error, file=sys.stderr)
    if errors:
        return 1
    print("Portfolio security regression checks passed (not a full security audit).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
