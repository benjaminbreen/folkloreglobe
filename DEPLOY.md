# 🚀 Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project folder
cd folkloreglobe

# Deploy (will prompt for login on first use)
vercel

# For production deployment
vercel --prod
```

That's it! Your globe will be live at a Vercel URL like: `https://folklore-globe-xyz.vercel.app`

### Method 2: Vercel Web Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (GitHub, GitLab, or Bitbucket)
3. Click "Add New Project"
4. Import your Git repository OR drag & drop the `folkloreglobe` folder
5. Vercel auto-detects settings - just click "Deploy"
6. Done! Live in ~30 seconds

## Alternative Hosting Options

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd folkloreglobe
netlify deploy

# Production deployment
netlify deploy --prod
```

Or use drag-and-drop at [netlify.com/drop](https://app.netlify.com/drop)

### GitHub Pages

1. Create a new GitHub repository
2. Push the `folkloreglobe` folder to the repo
3. Go to Settings → Pages
4. Select "Deploy from branch" → `main` branch
5. Save and wait a few minutes
6. Your site will be live at `https://yourusername.github.io/repository-name`

### Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your Git repository or upload directly
3. Click "Create project"
4. Deploy settings are auto-detected
5. Deploy!

### Local Development Server

#### Python (simplest)
```bash
cd folkloreglobe
python3 -m http.server 8000
```
Open: `http://localhost:8000`

#### Node.js (serve)
```bash
npx serve folkloreglobe
```
Open: `http://localhost:3000`

#### PHP
```bash
cd folkloreglobe
php -S localhost:8000
```
Open: `http://localhost:8000`

## Post-Deployment Checklist

- [ ] Test on desktop browser
- [ ] Test on mobile device
- [ ] Verify all markers are clickable
- [ ] Check that globe rotates smoothly
- [ ] Confirm info panel displays correctly
- [ ] Test zoom in/out functionality
- [ ] Verify reset button works

## Custom Domain Setup

### Vercel
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update your DNS records as instructed
5. SSL is automatic!

### Netlify
1. Go to "Domain settings"
2. Add custom domain
3. Follow DNS setup instructions
4. Free SSL included

## Performance Tips

1. **CDN Caching**: Vercel/Netlify handle this automatically
2. **Image Optimization**: Already optimized (SVG-based)
3. **Compression**: Enabled by default on modern hosts
4. **HTTPS**: Automatic with Vercel, Netlify, Cloudflare

## Troubleshooting

### Issue: "Failed to load traditions data"
- **Cause**: JSON file not found
- **Fix**: Ensure `data/knocking-traditions.json` is in the correct location
- **Check**: File paths are relative, not absolute

### Issue: Globe doesn't render
- **Cause**: D3.js or TopoJSON failed to load
- **Fix**: Check browser console for errors
- **Check**: Internet connection (needs CDN access)

### Issue: Markers don't appear
- **Cause**: Data coordinates invalid or globe scale too small
- **Fix**: Verify lat/lng values in JSON
- **Check**: Try zooming in with + button

### Issue: CORS errors in development
- **Cause**: Opening index.html directly without a server
- **Fix**: Use a local server (see options above)
- **Why**: ES6 modules require HTTP protocol

## Environment-Specific Notes

### Development
- Use local server for testing
- Browser devtools for debugging
- Edit files and refresh to see changes

### Staging (Vercel)
```bash
vercel  # Creates preview deployment
```
Every push gets a unique preview URL!

### Production (Vercel)
```bash
vercel --prod  # Deploys to production domain
```

## Monitoring & Analytics

### Add Google Analytics
In `index.html`, add before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics
Already built-in! Check your dashboard for:
- Page views
- Visitor locations
- Device types
- Performance metrics

## Updating Content

1. Edit `data/knocking-traditions.json`
2. Commit and push changes
3. Vercel auto-deploys in ~30 seconds
4. Changes are live!

## Cost

- **Vercel Free Tier**: 100GB bandwidth/month (plenty for most sites)
- **Netlify Free Tier**: 100GB bandwidth/month
- **GitHub Pages**: Unlimited (for public repos)
- **Cloudflare Pages**: Unlimited bandwidth

All options include free SSL and are free forever for small projects!

---

**Need help?** Open an issue or check the main README.md
