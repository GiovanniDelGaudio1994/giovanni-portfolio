# Handoff — 01-Portfolio & Personal Branding
**Data:** 16 novembre 2026  
**Ambito:** restyling UX homepage e visual orbitale, senza modifiche ai codici proprietari.

## Interventi implementati nel branch
- Dieci copertine dei progetti convertite in link HTML accessibili alle demo locali: sette progetti personali e tre universitari. I pulsanti secondari delle card restano separati.
- Card personali e universitarie più compatte su desktop e smartphone: meno altezza delle immagini, paddings e gap ridotti, gerarchia di titolo e descrizione migliorata.
- Foto originale dell'autore (da CV v4 approvato) in `portfolio/assets/hero-portrait.jpg`; orbite CSS e animazioni esistenti preservate.
- Piccola console `developer.ts` in stile glass davanti al ritratto: codice illustrativo, non un editor interattivo.
- Shader WebGL locale in `portfolio/assets/hero-shader.js`: campi orbitali decorativi, senza dipendenze esterne. Fallback all'esistente grafica CSS in assenza di WebGL, con risparmio dati, su smartphone o con `prefers-reduced-motion`.
- Pulsante CV nella hero già collegato direttamente al PDF HR v4: nuova scheda, nessun download forzato.
- Estensione dei test CI per la sintassi del nuovo script e regressioni sulle copertine/asset.

## Controlli da eseguire
1. Verificare `Portfolio checks` e `Publish portfolio (GitHub Pages)` prima di dichiarare completata la release.
2. Verificare le cover su desktop e mobile, in IT e EN, e il comportamento con tastiera; testare tutti i 10 target.
3. Verificare un browser senza supporto WebGL e un dispositivo con movimento ridotto.
4. Verificare la visualizzazione della foto reale nell'orbita e la sovrapposizione della console sui piccoli schermi.
5. Assicurarsi che il pulsante CV apra direttamente il PDF original v4.

## Confini
- Non modificare demo, repository privati, PDF v4 né le certificazioni.
- L'assistente non ha accesso diretto a un'altra conversazione ChatGPT: questo file è l'handoff riutilizzabile nella chat `01-Portfolio & Personal Branding`.
- Non dichiarare test visivi completi senza browser/device QA.
