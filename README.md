# Giovanni Del Gaudio — Developer Portfolio

**Website:** https://giovannidelgaudio.it/

Bilingual developer portfolio and static public project demos. This repository is the designated home for changes to the website and its GitHub Pages deployment. Open **site-related Pull Requests here**, not in `forma-ai`.

## Contents

- `portfolio/`: Italian/English portfolio source and assets
- `scripts/`: page builder, translations, audited project changelog
- `driveglass-demo/`, `legacybridge-demo/`, etc.: public demonstrations
- `index.html`, `assets/`, `atlante-3d.html`: public static FORMA AI preview inputs
- `.github/workflows/`: CI and GitHub Pages publishing

`python3 scripts/build_pages.py` generates `_site/`, including `/en/`, `/forma-ai-demo/`, `/driveglass-demo/` and the other public demo routes. Run `python3 scripts/audit_portfolio.py` before publishing. Do **not** commit `_site/` or any private application code.

## Project ownership and licensing

This repository publishes **demonstrations**, not the complete proprietary applications. Original portfolio components and presentation material remain reserved to their author unless explicitly licensed otherwise. Software dependencies and third-party assets retain their respective licenses. This notice does not revoke permissions granted under earlier licenses to earlier versions in `forma-ai`; it does not relicense the historical public LegacyBridge AGPLv3 probe.

- [FORMA AI public demo/source location](https://github.com/GiovanniDelGaudio1994/forma-ai)
- [GitHub profile](https://github.com/GiovanniDelGaudio1994)

## History

The initial website snapshot comes from the public `forma-ai` repository. Original commits and PRs remain there; this dedicated repository starts a fresh, website-only history. The migration deliberately excludes `projects/`, tests and the old mixed-license source tree. See `MIGRATION_ORIGIN.md` for the exact snapshot.
