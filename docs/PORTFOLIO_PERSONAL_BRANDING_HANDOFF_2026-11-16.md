# Handoff — 01-Portfolio & Personal Branding
**Data:** 16 novembre 2026  
**Ambito:** restyling UX homepage e visual orbitale, senza modifiche ai codici proprietari.

## Aggiornamento pianificato UX 2.5 — 16 novembre 2026
- **Ambito:** sezione Aggiornamenti del portfolio e interazioni grafiche leggere, senza modifiche ad applicazioni proprietarie.
- **Changelog bilingue:** quattro note del 16/11 su CV HR v4, UX 2.4 (orbite, foto precedente e cover), correzione mobile e UX 2.5.
- **Novità UI:** fondale Aurora nella sezione Aggiornamenti; effetto luce al passaggio sulle copertine; affordance "Apri progetto"; microinterazioni della griglia stack.
- **Accessibilità:** elementi decorativi senza intercettare i clic; contrasto e hover/focus; supporto `prefers-reduced-motion`, schermate mobili senza animazione continua.
- **Conservazione:** fotografia del profilo GitHub precedente, PDF v4 originale (nuova scheda), shader WebGL preesistente, demo pubbliche e link delle dieci card.
- **Prova:** changelog e controlli CI devono passare prima di integrare il branch; test manuali su dispositivo reale ancora aperti.
- **Limite tecnico:** non è possibile scrivere direttamente nella chat separata `01-Portfolio & Personal Branding`; questa nota è il registro centrale riutilizzabile.

## Stato verificato della release
- **Release pubblicata:** Portfolio UX 2.4, commit `dd2ce6074` su `main` il 16 novembre 2026.
- **Build & security checks:** conclusi con successo — [CI](https://github.com/GiovanniDelGaudio1994/giovanni-portfolio/actions/runs/43908414543).
- **GitHub Pages:** deploy concluso con successo — [pubblicazione](https://github.com/GiovanniDelGaudio1994/giovanni-portfolio/actions/runs/43908414641).
- **CV:** collegamento diretto al PDF v4 originale dalla hero (nuova scheda, senza download automatico).
- **Verifica live su browser/dispositivo reale:** ancora da confermare; il sito non è accessibile tramite il browser di verifica automatico.
- **Workflow 01-Portfolio & Personal Branding:** questo documento è il passaggio di consegne; le chat ChatGPT non sono aggiornabili direttamente da altre conversazioni.

## Interventi implementati e pubblicati
- Dieci copertine dei progetti convertite in link HTML accessibili alle demo locali: sette progetti personali e tre universitari. I pulsanti secondari delle card restano separati.
- Card personali e universitarie più compatte su desktop e smartphone: meno altezza delle immagini, paddings e gap ridotti, gerarchia di titolo e descrizione migliorata.
- Fotografia precedente del profilo GitHub ripristinata in homepage; il ritratto tratto dal CV non è più mostrato nella hero. Orbite CSS e WebGL preservati.
- Piccola console `developer.ts` in stile glass davanti al ritratto: codice illustrativo, non un editor interattivo.
- Shader WebGL locale in `portfolio/assets/hero-shader.js`: campi orbitali decorativi, senza dipendenze esterne. Fallback all'esistente grafica CSS in assenza di WebGL, con risparmio dati, su smartphone o con `prefers-reduced-motion`.
- Pulsante CV nella hero già collegato direttamente al PDF HR v4: nuova scheda, nessun download forzato.
- Estensione dei test CI per la sintassi del nuovo script e regressioni sulle copertine/asset.

## QA manuale post-release da eseguire
1. Verificare `Portfolio checks` e `Publish portfolio (GitHub Pages)` prima di dichiarare completata la release.
2. Verificare le cover su desktop e mobile, in IT e EN, e il comportamento con tastiera; testare tutti i 10 target.
3. Verificare un browser senza supporto WebGL e un dispositivo con movimento ridotto.
4. Verificare la precedente foto profilo GitHub nell'orbita e la console compatta (PR #15) su iPhone e Android.
5. Assicurarsi che il pulsante CV apra direttamente il PDF original v4.

## Confini
- Non modificare demo, repository privati, PDF v4 né le certificazioni.
- L'assistente non ha accesso diretto a un'altra conversazione ChatGPT: questo file è l'handoff riutilizzabile nella chat `01-Portfolio & Personal Branding`.
- Non dichiarare test visivi completi senza browser/device QA.
