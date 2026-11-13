# Registro aggiornamenti · Release notes workflow

Il sito personale pubblica una sezione **Aggiornamenti / Patch Notes** sia in italiano sia in inglese.

Il registro è mantenuto nel file [project_updates.json](project_updates.json). Ogni nuovo rilascio o correzione pubblicata sul sito deve avere una nuova voce in questo file. La pubblicazione tramite GitHub Actions genera automaticamente le note in:

- `https://giovannidelgaudio.it/#aggiornamenti`
- `https://giovannidelgaudio.it/en/#aggiornamenti`

Il build `scripts/build_pages.py` usa `scripts/render_updates.py` per rendere le note statiche, accessibili e indicizzabili. Il JavaScript offre soltanto filtri interattivi. Le note restano leggibili anche senza JavaScript.

**Archivio storico:** sono state documentate retroattivamente modifiche verificate del 10–13 novembre 2026 su portfolio, LegacyBridge, FORMA AI, Fit Zone, SignalScope, Meteo Bash 2D, e-Wine, GestioneFarmacia e iRem. Il sito presenta sei note iniziali, con un pulsante per espandere lo storico completo; senza JavaScript tutte le note restano visibili. La pubblicazione delle note richiede una voce nel JSON, non avviene automaticamente per ogni commit.

## Come aggiungere una patch

1. Verifica che la funzionalità o il fix sia **effettivamente completato**, non soltanto progettato.
2. Aggiungi un elemento in cima a `entries` in `project_updates.json`.
3. Indica la data reale (`YYYY-MM-DD`), l'identificatore del progetto (`project`) e un riferimento di versione **reale e verificabile**.
4. Seleziona `type`: `feature`, `fix`, `documentation`, `release`.
5. Compila `title.it`, `title.en`, `changes.it` e `changes.en` (liste di modifiche effettive).
6. Specifica `url` HTTPS alla pagina pubblica del progetto oppure alla relativa release GitHub.
   Per una correzione verificabile, aggiungi anche `evidence_url` con il link al commit pubblico `https://github.com/GiovanniDelGaudio1994/forma-ai/commit/<SHA>`. Il sito mostrerà un link **Vedi commit**.
7. Esegui `python3 scripts/build_pages.py` e `python3 scripts/audit_portfolio.py`. I controlli vengono ripetuti anche da GitHub Actions.
8. Pubblica le modifiche. Le patch notes appariranno su entrambe le lingue.

Esempio **illustrativo**: non è un aggiornamento realmente pubblicato.

```json
{
  "date": "2026-11-13",
  "project": "example-app",
  "project_name": "Example App",
  "version": "v1.2.1",
  "type": "fix",
  "title": {
    "it": "Corretto il caricamento della dashboard",
    "en": "Fixed dashboard loading"
  },
  "changes": {
    "it": ["Eliminato un errore verificato nell'apertura della dashboard."],
    "en": ["Fixed a verified error when opening the dashboard."]
  },
  "url": "https://giovannidelgaudio.it/"
}
```

**Non pubblicare segreti, credenziali, identificatori personali o il codice dei repository privati nelle note di rilascio.** Il registro descrive i cambiamenti visibili, non diffonde materiale riservato.

## English

Add one entry to `project_updates.json` for every **verified, published** project update. Supply a genuine release date/version and both Italian and English descriptions. Use `feature`, `fix`, `documentation` or `release` as the update type. Commit the entry together with the project change; GitHub Actions will render both language versions and validate the release notes.

Do not invent completed features, test results or versions; do not expose credentials or private code.
