```
                                          . _ .
                                      .-'`   `'-.
                                   .'    .-~~-.   '.
                                  /    .'  /\  '.    \
                                 ;   /   /    \  \    ;
                                |   ;   | ~  ~ |  ;   |
                                |   |   | FOLK |  |   |
                                |   ;   | LORE |  ;   |
                                 ;   \   \ ~~ /  /   ;
                                  \    '.  \/  .'    /
                                   '.    '-__-'    .'
                                     '-._ ~~ _.-'
                                         '~~'

             ╔═══════════════════════════════════════════════════════╗
             ║           G E S T U R A L   F O L K L O R E         ║
             ║                     G L O B E                        ║
             ║                                                       ║
             ║     Interactive 3D visualization of protective        ║
             ║     gestures, superstitions, and linguistic bias      ║
             ║     across human cultures                             ║
             ╚═══════════════════════════════════════════════════════╝
```

An interactive 3D globe built with D3.js that maps protective gestures, superstitions, and cultural associations across 150+ locations worldwide. No build step required — clone it, serve it, explore it.

**[Live Demo](https://folkloreglobe.vercel.app)** | **[Res Obscura post](https://resobscura.substack.com/p/neolithic-habits-machine-age-tools)**

---

## What Is This?

Folklore Globe visualizes how similar ritual practices — knocking on wood, making hand signs against the evil eye, associating "left" with bad luck — emerge independently across geographically distant cultures. Each dataset maps a different tradition onto a rotatable 3D globe, with markers you can click for detailed descriptions, local terminology, and Wikipedia context.

Built for a [Res Obscura](https://resobscura.substack.com/p/neolithic-habits-machine-age-tools) newsletter post about the deep history of human gesture.

## Datasets

| Dataset | Locations | What It Maps |
|---------|-----------|-------------|
| **Knocking on Wood** | 28 | Wood-knocking and iron-touching traditions for warding off bad luck |
| **Mano Fico** | ~15 | The "fig hand" gesture used across Mediterranean cultures against the evil eye |
| **Left/Right Bias** | 30 | Linguistic associations of right (positive) vs. left (negative) in 50 languages, derived from [Schiefenhovel 2013](https://nyaspubs.onlinelibrary.wiley.com/doi/full/10.1111/nyas.12124) |
| **Mano Cornuta** | 60+ | The "horns" gesture for protection, traced from prehistoric origins through Mediterranean diaspora |

## Quick Start

```bash
git clone https://github.com/benjaminbreen/folkloreglobe.git
cd folkloreglobe
./start.sh
```

That's it. The script finds Python 3, Node, or PHP on your machine and starts a local server. Or do it manually:

```bash
python3 -m http.server 8000    # Python
npx serve .                     # Node
php -S localhost:8000            # PHP
```

Open `http://localhost:8000` in your browser.

**No npm install. No build step. No dependencies to manage.** D3.js and TopoJSON load from CDN.

## Deploy

```bash
# Vercel (recommended)
npm install -g vercel && vercel

# Or any static hosting — just upload the files
```

## Project Structure

```
folkloreglobe/
├── index.html                  # Single-page application
├── css/
│   └── style.css               # Dark-mode design system with CSS variables
├── js/
│   ├── main.js                 # Entry point, event handling, dataset switching
│   ├── globe.js                # D3.js orthographic globe renderer
│   ├── datasets.js             # Dataset loading, legend, color mapping
│   ├── traditions.js           # Info panel UI, marker click handling
│   └── wikipedia.js            # Wikipedia API integration
├── data/
│   ├── datasets.json           # Master config for all datasets
│   ├── knocking-traditions.json
│   ├── mano-fico.json
│   ├── left-right-bias.json
│   └── mano-cornuta.json
├── start.sh                    # Cross-platform dev server launcher
└── vercel.json                 # Deployment config with caching headers
```

## Tech Stack

- **D3.js v7** — Orthographic projection, drag/zoom interactions, geographic calculations
- **TopoJSON v3** — World map topology from Natural Earth
- **Vanilla JS (ES6 modules)** — No framework, no bundler
- **CSS3** — Custom properties, backdrop-filter, animations
- **Wikipedia API** — Fetches contextual articles for each tradition

## Features

- **3D globe** with drag-to-rotate, scroll-to-zoom, and gentle auto-rotation
- **Color-coded markers** with pulsing glow animations, filtered to only show the visible hemisphere
- **Click any marker** for local phrases, descriptions, sources, and a Google Books link
- **Wikipedia integration** — expandable panel with article excerpts and thumbnails
- **Dataset switching** — toggle between 4 curated datasets via header buttons
- **Dynamic legend** — updates automatically per dataset
- **Keyboard shortcuts** — R (reset), +/- (zoom), Space (toggle rotation), Esc (close panel)
- **Responsive** — works on desktop, tablet, and mobile
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation

## Adding Your Own Data

### New entries to an existing dataset

Add an object to the relevant JSON file in `data/`:

```json
{
  "name": "Location Name",
  "lat": 40.0,
  "lng": -3.0,
  "phrase": "local phrase or term",
  "description": "What happens here and why it matters.",
  "source": "Your source",
  "type": "one-of-the-legend-types"
}
```

The `type` must match one of the legend entries in `data/datasets.json` for that dataset.

### A whole new dataset

1. Create a new JSON file in `data/` with an array of location entries
2. Add a dataset config to the `datasets` array in `data/datasets.json`:

```json
{
  "id": "your-dataset",
  "name": "Display Name",
  "icon": "🔮",
  "description": "Short description",
  "instructionText": "Click on any marker to explore...",
  "file": "data/your-dataset.json",
  "legend": [
    { "type": "type-a", "label": "Type A", "color": "#dc2626" },
    { "type": "type-b", "label": "Type B", "color": "#3b82f6" }
  ]
}
```

The globe, legend, and color system all update automatically from this config.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Reset view |
| `+` / `=` | Zoom in |
| `-` / `_` | Zoom out |
| `Space` | Toggle auto-rotation |
| `Esc` | Close info panel |

## Browser Support

Requires ES6 module support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.

Must be served over HTTP/HTTPS (not `file://`).

## Credits

- **Data**: Wikipedia contributors, [Schiefenhovel (2013)](https://nyaspubs.onlinelibrary.wiley.com/doi/full/10.1111/nyas.12124), ethnographic sources cited per entry
- **World map**: [Natural Earth](https://www.naturalearthdata.com/) via [World Atlas TopoJSON](https://github.com/topojson/world-atlas)
- **Visualization**: [D3.js](https://d3js.org/) by Mike Bostock
- **Created by**: [Benjamin Breen](https://benjaminpbreen.com) with [Claude](https://www.anthropic.com/claude)

## License

MIT — fork it, remix it, add your own folklore.
