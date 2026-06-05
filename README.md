# Guerriere da Sempre

Sito statico pubblicabile su GitHub Pages.

## Struttura

- `index.html`: markup principale.
- `styles/main.css`: stile visuale e responsive.
- `scripts/`: moduli JavaScript per navigazione, SEO, bacheca Drive, modali e animazioni.
- `assets/images/`: immagini del sito.
- `assets/logos/`: loghi.
- `assets/qr/`: QR code disponibili.
- `.github/workflows/check.yml`: controllo automatico del sito su GitHub Actions.

## Controlli

```bash
npm run check
npm run update:bacheca
```

`npm run check` verifica i riferimenti locali presenti nell'HTML e la sintassi dei moduli JavaScript.
`npm run update:bacheca` rigenera `data/bacheca.json` leggendo la cartella Drive pubblica.

## Bacheca

La bacheca pubblicata legge `data/bacheca.json` e mostra un feed custom scrollabile.
Il manifest viene generato leggendo la cartella Drive pubblica con `npm run update:bacheca`.

## Satispay

Il widget Satispay è configurato in `scripts/config.js`.
Inserire in `SATISPAY_CONFIG.paymentLink` il link copiato dalla Satispay Business app o il link shop ufficiale.
