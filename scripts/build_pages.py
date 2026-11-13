#!/usr/bin/env python3
"""Publish the portfolio at the site root while preserving every public demo.

GitHub Pages previously served the FORMA AI showcase at / and the personal
portfolio at /portfolio/. This build makes the portfolio the landing page and
moves only the *published copy* of the FORMA AI showcase to /forma-ai-demo/.
The repository source remains unchanged and is still published with the
existing GitHub Actions workflow. No private application source is included.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urlsplit

from translate_pages import translate_portfolio, translate_legacybridge
from render_updates import inject_updates

SOURCE = Path(__file__).resolve().parents[1]
OUTPUT = SOURCE / "_site"
DOMAIN = "https://giovannidelgaudio.it/"
OLD_BASE = "https://giovannidelgaudio1994.github.io/forma-ai/"

PUBLIC_DIRS = (
    "assets",
    "portfolio",
    "ewine-demo",
    "fit-zone-demo",
    "gestione-farmacia-demo",
    "meteo-bash2d-demo",
    "signalscope-demo",
    "legacybridge-demo",
    "driveglass-demo",
)
PUBLIC_FILES = (".nojekyll", "atlante-3d.html", "privacy.html")


def adapt_portfolio(html: str, root: bool) -> str:
    """Rewrite relative URLs for an index at / or /portfolio/."""
    folder = "" if root else "../"
    path_to_assets = "portfolio/" if root else ""
    if root:
        # The source markup lives in /portfolio/, but the generated copy is at /.
        for attr in ("src", "href"):
            html = html.replace(f'{attr}="assets/', f'{attr}="{path_to_assets}assets/')
        html = html.replace('data-demo-url="demos/', 'data-demo-url="portfolio/demos/')
        html = html.replace('data-demo-url="../', 'data-demo-url="')
    else:
        html = html.replace('href="sitemap.xml"', 'href="../sitemap.xml"')

    for name in ("fit-zone-demo", "signalscope-demo", "meteo-bash2d-demo",
                 "gestione-farmacia-demo", "ewine-demo", "legacybridge-demo"):
        html = html.replace(OLD_BASE + name + "/", folder + name + "/")

    # Preserve the main FORMA AI demo on its new dedicated URL.
    html = html.replace(OLD_BASE + "portfolio/", DOMAIN)
    html = html.replace(OLD_BASE, folder + "forma-ai-demo/")

    # Search engines should index the new site homepage, not duplicate paths.
    return html



def adapt_portfolio_english(html: str, root: bool) -> str:
    """Place the English portfolio at /en/ and /portfolio/en/."""
    result = adapt_portfolio(html, root=root)
    if root:
        for attr in ("src", "href"):
            result = result.replace(
                f'{attr}="portfolio/assets/', f'{attr}="../portfolio/assets/'
            )
        result = result.replace(
            'data-demo-url="portfolio/demos/', 'data-demo-url="../portfolio/demos/'
        )
        for name in ("gestione-farmacia-demo", "ewine-demo"):
            result = result.replace(
                f'data-demo-url="{name}/', f'data-demo-url="../{name}/'
            )
        for name in (
            "forma-ai-demo", "fit-zone-demo", "signalscope-demo",
            "meteo-bash2d-demo", "gestione-farmacia-demo", "ewine-demo",
            "legacybridge-demo",
        ):
            result = result.replace(f'href="{name}/', f'href="../{name}/')
        result = result.replace('href="sitemap.xml"', 'href="../sitemap.xml"')
    else:
        # /portfolio/en/ is one directory deeper than /portfolio/.
        for attr in ("src", "href"):
            result = result.replace(f'{attr}="assets/', f'{attr}="../assets/')
        result = result.replace(
            'data-demo-url="../', 'data-demo-url="../../'
        )
        result = result.replace(
            'data-demo-url="demos/', 'data-demo-url="../demos/'
        )
        for name in (
            "forma-ai-demo", "fit-zone-demo", "signalscope-demo",
            "meteo-bash2d-demo", "gestione-farmacia-demo", "ewine-demo",
            "legacybridge-demo",
        ):
            result = result.replace(f'href="../{name}/', f'href="../../{name}/')
        result = result.replace('href="../sitemap.xml"', 'href="../../sitemap.xml"')
    return result


def adapt_legacybridge_english(html: str) -> str:
    """English demo lives at /legacybridge-demo/en/."""
    return (
        html.replace('href="site.css"', 'href="../site.css"')
        .replace('src="site.js"', 'src="../site.js"')
        .replace('src="../portfolio/assets/', 'src="../../portfolio/assets/')
        .replace('href="hp-550/"', 'href="../hp-550/en/"')
    )


def adapt_forma(html: str) -> str:
    html = html.replace('href="assets/', 'href="../assets/')
    html = html.replace('src="assets/', 'src="../assets/')
    html = html.replace('"atlante-3d.html"', '"../atlante-3d.html"')
    html = html.replace('"privacy.html"', '"../privacy.html"')
    return html


class References(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        for key, value in attrs:
            if key in ("src", "href", "data-demo-url") and value:
                self.references.append(value)


def verify_local_references(page: Path) -> None:
    parser = References()
    parser.feed(page.read_text(encoding="utf-8"))
    missing = []
    for value in parser.references:
        parsed = urlsplit(value)
        if (parsed.scheme or parsed.netloc or not parsed.path
                or value.startswith(("#", "/", "mailto:", "javascript:"))):
            continue
        # Only local file references are validated; external websites are separate.
        target = (page.parent / unquote(parsed.path)).resolve()
        try:
            target.relative_to(OUTPUT.resolve())
        except ValueError:
            raise ValueError(f"Unsafe relative link in {page.name}: {value}") from None
        if not target.exists():
            missing.append(value)
    if missing:
        raise ValueError(f"Missing assets in {page}: {sorted(set(missing))}")


def build() -> None:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    for name in PUBLIC_DIRS:
        source = SOURCE / name
        if not source.is_dir():
            raise FileNotFoundError(f"Missing public folder: {source}")
        shutil.copytree(source, OUTPUT / name)
    for name in PUBLIC_FILES:
        src = SOURCE / name
        if src.is_file():
            shutil.copy2(src, OUTPUT / name)

    template = (SOURCE / "portfolio/index.html").read_text(encoding="utf-8")
    (OUTPUT / "index.html").write_text(inject_updates(adapt_portfolio(template, root=True)), encoding="utf-8")
    (OUTPUT / "portfolio/index.html").write_text(
        inject_updates(adapt_portfolio(template, root=False)), encoding="utf-8"
    )

    english = translate_portfolio(template)
    (OUTPUT / "en").mkdir(exist_ok=True)
    (OUTPUT / "en/index.html").write_text(
        inject_updates(adapt_portfolio_english(english, root=True)), encoding="utf-8"
    )
    (OUTPUT / "portfolio/en").mkdir(exist_ok=True)
    (OUTPUT / "portfolio/en/index.html").write_text(
        inject_updates(adapt_portfolio_english(english, root=False)), encoding="utf-8"
    )

    legacy = (SOURCE / "legacybridge-demo/index.html").read_text(encoding="utf-8")
    (OUTPUT / "legacybridge-demo/en").mkdir(exist_ok=True)
    (OUTPUT / "legacybridge-demo/en/index.html").write_text(
        adapt_legacybridge_english(translate_legacybridge(legacy)),
        encoding="utf-8",
    )

    forma = (SOURCE / "index.html").read_text(encoding="utf-8")
    (OUTPUT / "forma-ai-demo").mkdir(exist_ok=True)
    (OUTPUT / "forma-ai-demo/index.html").write_text(adapt_forma(forma), encoding="utf-8")

    # Both existing top-level demo utilities still belong to FORMA AI.
    for name in ("atlante-3d.html", "privacy.html"):
        page = OUTPUT / name
        if page.is_file():
            content = page.read_text(encoding="utf-8")
            if name == "atlante-3d.html":
                content = content.replace('href="./"', 'href="./forma-ai-demo/"')
            else:
                content = content.replace('href="index.html"', 'href="forma-ai-demo/"')
            page.write_text(content, encoding="utf-8")

    # A single canonical sitemap covers the homepage and the public demos.
    from xml.sax.saxutils import escape
    paths = ("", "en/", "forma-ai-demo/", "ewine-demo/", "fit-zone-demo/",
             "gestione-farmacia-demo/", "meteo-bash2d-demo/",
             "signalscope-demo/", "legacybridge-demo/", "legacybridge-demo/en/",
             "legacybridge-demo/hp-550/", "legacybridge-demo/hp-550/en/",
             "atlante-3d.html", "driveglass-demo/")
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for path in paths:
        sitemap += f"  <url><loc>{escape(DOMAIN + path)}</loc></url>\n"
    sitemap += "</urlset>\n"
    (OUTPUT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    (OUTPUT / "portfolio/sitemap.xml").write_text(sitemap, encoding="utf-8")
    (OUTPUT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nSitemap: " + DOMAIN + "sitemap.xml\n",
        encoding="utf-8",
    )

    for page in (
        OUTPUT / "index.html",
        OUTPUT / "portfolio/index.html",
        OUTPUT / "en/index.html",
        OUTPUT / "portfolio/en/index.html",
        OUTPUT / "forma-ai-demo/index.html",
        OUTPUT / "legacybridge-demo/index.html",
        OUTPUT / "legacybridge-demo/en/index.html",
        OUTPUT / "legacybridge-demo/hp-550/index.html",
        OUTPUT / "legacybridge-demo/hp-550/en/index.html",
    ):
        verify_local_references(page)

    assert (OUTPUT / "ewine-demo/index.html").exists()
    assert (OUTPUT / "fit-zone-demo/index.html").exists()
    assert (OUTPUT / "gestione-farmacia-demo/index.html").exists()
    assert (OUTPUT / "signalscope-demo/index.html").exists()
    assert (OUTPUT / "meteo-bash2d-demo/index.html").exists()
    assert (OUTPUT / "legacybridge-demo/index.html").exists()
    assert (OUTPUT / "driveglass-demo/index.html").exists()
    assert (OUTPUT / "driveglass-demo/assets/driveglass-real-demo-2026.mp4").exists()
    assert (OUTPUT / "driveglass-demo/assets/driveglass-real-demo-poster.webp").exists()
    assert (OUTPUT / "legacybridge-demo/en/index.html").exists()
    assert (OUTPUT / "legacybridge-demo/hp-550/index.html").exists()
    assert (OUTPUT / "legacybridge-demo/hp-550/en/index.html").exists()
    assert (OUTPUT / "en/index.html").exists()
    print("Site prepared: / = portfolio; /forma-ai-demo/ = FORMA AI; other demos preserved.")


if __name__ == "__main__":
    build()
