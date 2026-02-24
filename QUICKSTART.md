# 🚀 Quick Start Guide

Get your Folklore Globe running in 60 seconds!

## Option 1: Local Development (10 seconds)

### Using the start script (easiest):
```bash
cd folkloreglobe
./start.sh
```

Then open: **http://localhost:8000**

### Manual start:
```bash
# Python 3
cd folkloreglobe
python3 -m http.server 8000

# Node.js
cd folkloreglobe
npx serve

# PHP
cd folkloreglobe
php -S localhost:8000
```

## Option 2: Deploy to Vercel (30 seconds)

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Deploy
cd folkloreglobe
vercel
```

Follow the prompts. Your site will be live at a URL like:
`https://folklore-globe-xyz.vercel.app`

## Option 3: Drag & Drop Deploy (60 seconds)

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `folkloreglobe` folder onto the page
3. Done! Your site is live

## What You'll See

A beautiful dark blue globe with 28 glowing markers representing wood-knocking traditions worldwide.

### Try These:
- **Drag** the globe to rotate
- **Scroll** to zoom in/out
- **Click** a marker to learn about that tradition
- Press **R** to reset view
- Press **Space** to pause/resume auto-rotation

## Troubleshooting

### "Failed to load traditions data"
- You're opening `index.html` directly in the browser
- **Solution**: Use a local server (see Option 1 above)

### Globe doesn't appear
- Check internet connection (needs D3.js from CDN)
- Open browser DevTools Console (F12) to see errors

### Markers don't show
- Try zooming in with the + button
- Check `data/knocking-traditions.json` exists

## Next Steps

- Read `README.md` for full documentation
- Read `DEPLOY.md` for deployment options
- Edit `data/knocking-traditions.json` to add traditions
- Customize colors in `css/style.css`

## Need Help?

1. Check the browser console (F12) for errors
2. Review `README.md` and `DEPLOY.md`
3. All code is commented - read the source!

---

**Enjoy exploring global folklore traditions!** 🌍✨
