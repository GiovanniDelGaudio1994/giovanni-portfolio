## 2026-11-11 — v1.1.0 · Responsive UI Fix (iPad / iPhone / Android)

**Commit associati:** rimozione nel README della galleria obsoleta (repository portfolio); ottimizzazione CSS responsive e menu adattivo (repository demo).

- Allineate le griglie dei corsi e dei servizi ai diversi viewport, con passaggio 3 → 2 → 1 colonne e immagini proporzionate.
- Aggiornato il catalogo dei corsi: card su una colonna per smartphone, fotografie leggibili, pulsanti touch più grandi e filtri disposti su due colonne.
- Migliorati header e menu a comparsa per iPad/tablet; il menu si richiude passando a desktop, usando il tasto Esc o navigando a un'ancora.
- Rifiniti hero, tipografia fluida, margini, form, galleria e footer per telefoni piccoli (320–390 px) e tablet (768–1024 px).
- Nessuna modifica al database, al codice PHP originale o alle funzioni server: la demo rimane solo frontend.
- Nel README portfolio sono state eliminate le anteprime della precedente demo scura, sostituite con una descrizione dell'esperienza responsive.

**Verifiche di codice:** presenza dei breakpoint CSS e dei riferimenti JS. **Da verificare su dispositivi reali:** rendering visivo su iPhone Safari, iPad Safari e Samsung Internet/Chrome; non considerare questi test conclusi finché non sono effettuati.

---

# Fit Zone — Registro modifiche demo

## 2026-11-11 — `fix(fit-zone): allinea il frontend alla copertina del portfolio`

**Problema.** La copertina approvata mostrava un sito Fit Zone con header antracite, accent color arancione, hero fotografico «La tua palestra, sempre con te», tre corsi in evidenza e catalogo smartphone. La precedente anteprima originale non aveva ancora questa impaginazione e risultava poco coerente con il materiale promozionale.

**Correzioni.**

- Restyling della homepage con navigazione scura/arancione, hero fotografico basato sull'asset originale `header`, CTA per esplorare i corsi e prime schede Spinning, HIIT e Functional Training.
- Catalogo corsi con sette attività **verificate nello schema MySQL originale** e immagini già usate dal progetto, filtri Cardio / Functional / Benessere, card responsive per smartphone.
- Responsive design con menu hamburger accessibile, leggibilità mobile e navigazione da tastiera; nuove regole CSS isolate per non alterare le altre pagine dell'anteprima.
- Note di trasparenza: la demo resta statica, non simula operazioni server completate e non invia dati dei moduli.
- Conservate senza modifiche le altre sezioni e gli altri percorsi statici (abbonamenti, calendario, profilo, prenotazioni e login).

**Verifica locale.** Chromium 1440×900 / 390×844 / 320×660; menu aperto/chiuso; filtri 7 → 3 Cardio → 2 Functional → 2 Benessere; invio contatti simulato; console senza errori JS; nessuno scroll orizzontale rilevato.

**Limiti noti.** La copertina è un render illustrativo, quindi non contiene screenshot pixel-identici del prodotto. Il PHP/MySQL non è eseguito da GitHub Pages; l'implementazione server originale revisionata rimane nel repository portfolio e verrà aggiornata separatamente quando sarà pronta la relativa branch di sviluppo.
