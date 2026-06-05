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
```

Lo script verifica i riferimenti locali presenti nell'HTML e la sintassi dei moduli JavaScript.

## Bacheca

La bacheca legge le immagini da Google Drive tramite la configurazione in `scripts/config.js`.
Se la API Google Drive risponde con errore o non restituisce immagini, il sito mostra automaticamente la cartella Drive embeddata come fallback.
