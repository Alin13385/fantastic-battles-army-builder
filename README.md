# Fantastic Battles — Online Army Builder & Battle Companion

An unofficial, fan-made, zero-dependency web application for building, validating, comparing, playing, sharing, and printing **Fantastic Battles** armies.

## Features

- **Complete Rules Engine**: All 12 base profiles (5 standalone characters + 7 company types), all 53 traits with automatic stat modifiers and bidirectional incompatibility enforcement, all 14 relics (including Mage-only restrictions), all 8 strategies (including *Cloaks and Daggers* unlocking a 2nd Rogue), and all 10 spells with automatic spell-level budgets.
- **38 Built-in Faction Presets (25 Fantasy + 13 Historical)**: Generic fantasy & historical army templates (High Elves, Human Empire, Infernal Dwarfs, Undead, Orcs, Goblins, Ogres, Saurian Legions, Dark Elves, Eastern Shogunate, Mongols, Free Company Mercenaries, Free Men, Inquisitors of the True Faith, Infernal Legions, Pastoral Halflings, Burgher Halflings, Dwarven Kingdoms, Ziggurat Dwarves, Wyld Elves, Beastfolk, Ratkin Hordes, Shadow Legions, The Bacchae, Children of the Mist, plus 13 Historical hosts) — plus **My Presets** for saving your own custom faction templates.
- **Saved Armies Library & Custom Presets**: Save changes, save copies, manage saved armies, reorder units via buttons or drag-and-drop, duplicate units with automatic sequential numbering (`Unit 2`, `Unit 3`, …), and undo/redo (`Ctrl+Z` / `Ctrl+Y`).
- **Live Tabletop Battle Mode & Pre-Game Helper**: Track turns, activations, Resolve pips per base, Scattered vs Break Point, Reload, Warbeasts, Stimulants, Summon Pool, and Prophesy dice.
- **Side-by-Side Army Comparison (Matchup Balance View)**: Compare any two saved armies or faction presets across points, bases, durability, melee, shooting, magic, mobility, special threats, and tactical notes.
- **Unit-Type SVG Icons**: 17 crisp tabletop unit-type icons (bow & arrow, horse head, shields, spears, artillery, dragons, magic, etc.) with automatic detection and manual override.
- **Printable Battle Sheet & Cut-Out Stat Cards**: Ink-friendly roster sheets with optional Rules Appendix, plus printable cut-out tabletop Unit Stat Cards with Resolve checkboxes.
- **Online-Ready Persistence & Sharing**: Saves automatically in `localStorage`, exports/imports JSON backups, copies formatted plain-text rosters, and generates self-contained shareable URL links (`#army=...`).
- **Dark & Light Themes**: Charcoal & Gold War-Table (dark default) and Field Ledger (light).

## Running Locally

Because the app uses standard ES modules, serve the folder with any static HTTP server (such as Python):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Hosting Online

This is a 100% static web application (HTML, CSS, JS, SVG) with no backend or build step required. Deploy only the web application files (`index.html`, `styles.css`, `app.js`, `data.js`, `engine.js`, `battle.js`, `compare.js`, `icons.js`, `favicon.svg`) to any static host such as **Netlify**, **GitHub Pages**, **Cloudflare Pages**, or **Vercel**.

---

*Disclaimer: This is an unofficial fan-made companion tool for Fantastic Battles. All included faction templates use generic fantasy and historical archetypes.*
