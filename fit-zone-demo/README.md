# Fit Zone — Demo frontend del gestionale palestra

[Apri la demo](https://giovannidelgaudio1994.github.io/forma-ai/fit-zone-demo/) · [Codice PHP/MySQL revisionato](https://github.com/GiovanniDelGaudio1994/GiovanniDelGaudio1994/tree/main/projects/fit-zone/source)

Questa cartella contiene la **demo frontend statica** di Fit Zone, derivata dalle funzionalità e dai contenuti del progetto personale PHP/MySQL. La homepage e il catalogo corsi hanno un'interfaccia aggiornata **ispirata alla copertina grafica del portfolio**, con colori arancione/nero, hero fotografico e layout responsive. La copertina rimane un'illustrazione promozionale, non uno screenshot letterale di una versione deployata.

## Cosa si può esplorare

- **Homepage:** navigazione, presentazione della palestra, corsi in evidenza, servizi, galleria, abbonamenti, contatti e FAQ.
- **Catalogo corsi:** sette corsi realmente previsti nello schema del database originale (Yoga, Spinning, Pilates, HIIT, Zumba, CrossFit e Functional Training), con filtri per tipologia e layout mobile.
- **Altre pagine:** abbonamenti, calendario, prenotazioni, profilo e area accesso, disponibili nelle pagine statiche conservate dalla precedente anteprima.
- **Demo contatti:** interazione locale che non invia e non salva dati.


## Responsive experience (v1.1)

Il sito sfrutta un unico layout fluido per desktop, iPad e tablet Android, iPhone e smartphone Samsung. Sono presenti breakpoint CSS a 1200, 1024, 930, 700, 390 e 340 px, un menu collassabile sotto 931 px, griglie corsi adattive, filtri e pulsanti di dimensione adatta al tocco.

**Test consigliati:** iPad (768 × 1024), iPad Air (820 × 1180), tablet 1024 px, iPhone SE (375 px), iPhone 15/16 (393 px), Samsung Galaxy (360/412 px), piccoli smartphone (320 px) e desktop 1440 px. Controllare che non appaia uno scroll orizzontale, che il menu mobile si apra/chiuda e che i filtri rimangano funzionanti.

L'ottimizzazione è pubblicata nel CSS/JS della demo; **la verifica visiva dal dispositivo reale è ancora da completare**. La precedente schermata fittizia «Smartphone di layout» è stata rimossa dal README del portfolio.

## Limiti della demo e dati

GitHub Pages non esegue PHP o MySQL. **Questa demo non autentica utenti, non gestisce prenotazioni reali, non invia contatti, non processa pagamenti e non conserva informazioni.** Eventuali nomi, orari e disponibilità nelle pagine di anteprima sono dimostrativi. I pulsanti di prenotazione aprono pagine informative statiche: la logica del backend PHP è consultabile separatamente.

Le fotografie provengono dallo ZIP del progetto (ottimizzate in formato WebP); **prima di una pubblicazione commerciale va verificato il diritto di utilizzo e l'eventuale attribuzione**.

## Stack, accessibilità e qualità

HTML5, CSS3 e JavaScript senza framework né servizi esterni. Menu mobile con `aria-expanded`, navigazione da tastiera, link «Salta al contenuto», filtri dei corsi con `aria-pressed`, immagini descrittive, layout adattivo e supporto a `prefers-reduced-motion`.

Controlli locali effettuati con Chromium sulle dimensioni **1440×900, 390×844 e 320×660**: verifica assenza di scroll orizzontale, apertura/chiusura del menu mobile, categorie corsi, invio simulato del modulo e assenza di errori JavaScript.

Consulta [CHANGELOG.md](CHANGELOG.md) per l'elenco delle modifiche e la ragione del fix.
