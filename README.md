# Giovanni Del Gaudio — Developer Portfolio

**Sito ufficiale:** https://www.giovannidelgaudio.it/ · [Dominio senza www](https://giovannidelgaudio.it/) · [Repository dedicato](https://github.com/GiovanniDelGaudio1994/giovanni-portfolio)

Bilingual developer portfolio and static public project demos. This repository is the designated home for changes to the website and its GitHub Pages deployment. Open **site-related Pull Requests here**, not in `forma-ai`.

## GitHub Pages e workflow

**Dominio personalizzato trasferito il 13 novembre 2026:** `www.giovannidelgaudio.it`, dal precedente repository `forma-ai` a `giovanni-portfolio`. GitHub ha accettato l'assegnazione sul nuovo Pages; verificare periodicamente il certificato HTTPS e il reindirizzamento del dominio apex.

**Apri qui le Pull Request relative al sito**, alla navbar, alle traduzioni, ai progetti mostrati e agli aggiornamenti. Il repository `forma-ai` rimane dedicato al progetto FORMA AI e conserva la storia delle precedenti PR. I repository delle applicazioni complete restano privati.

Il workflow `.github/workflows/pages.yml` pubblica automaticamente i commit su `main`. Il workflow di controllo verifica le modifiche anche nelle Pull Request.

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
