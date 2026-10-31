# Solanapay

A mobile-first virtual-wallet prototype built with HTML, CSS, and JavaScript. The home composition preserves the supplied Figma design: blue header, purple balance card, four-column services, and five-item navigation. Supporting screens are adaptations, not a complete reproduction of all design frames.

[Open demo](https://atmajadesna.github.io/solanapay/)

## Run locally

```bash
python3 -m http.server 8099 --bind 127.0.0.1
```

Open `http://127.0.0.1:8099`.

## Features

- Virtual top-ups, transfers, and manually entered merchant payments.
- Integer amount validation and insufficient-balance checks.
- Demo PIN confirmation, cancellation, and local transaction history.
- Local balance visibility and display-name settings.
- Request-text generation without sending messages.
- Clearly labeled simulated utility bills and service catalogs.

## Limitations

No real funds, banking, QR camera scanning, blockchain, server authentication, investments, or actual bill payments. The client-side demo PIN is not a security control. Browser data can be edited with developer tools. Use fictional information only. Promotional artwork is reference content, not an active offer or affiliation guarantee.

## Files and verification

`index.html`, `wallet.css`, and `wallet.js` are active. Earlier prototype files and design exports remain reference-only.

```bash
node --check wallet.js
# With Playwright installed and Chromium configured:
node tests/ui.cjs
```

Browser checks cover virtual top-up, wrong confirmation PIN, cancellation without balance changes, runtime errors, and five viewport widths. Fonts load from Google Fonts. Publication of source and deployment are verified separately.
