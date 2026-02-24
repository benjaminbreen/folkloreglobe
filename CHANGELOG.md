# Changelog - Multi-Dataset Support

## Version 2.0.0 - Multi-Dataset Architecture

### Major Changes

#### 1. **Compact Header Design**
- Removed large "Knocking on Wood" title
- New compact "Gestural Folklore Globe" title
- Moved from showcase-style to utility-focused layout

#### 2. **Dataset Selector System**
- Added horizontal button selector for switching between datasets
- Active dataset highlighted with gradient background
- Real-time dataset description and count display
- Smooth transitions when switching datasets

#### 3. **New Dataset: Mano Fico**
- Added 12 locations documenting the "fig hand" protective gesture
- Includes Italy, Portugal, Brazil, Spain, Russia, Serbia, and more
- Two sub-types: protective (blue) and historical (purple)
- Covers ancient Roman to modern usage

#### 4. **Dynamic Legend System**
- Legend now updates based on active dataset
- Each dataset can define custom types and colors
- Color coding system is fully configurable

#### 5. **Architecture Improvements**
- New `datasets.js` module for dataset management
- Configuration-driven approach via `datasets.json`
- Globe now accepts dynamic color functions
- Easy to add new datasets without code changes

### New Files

- `data/datasets.json` - Master configuration for all datasets
- `data/mano-fico.json` - Mano Fico gesture dataset (12 locations)
- `js/datasets.js` - Dataset management module

### Modified Files

- `index.html` - Compact header, dynamic legend, dataset selector
- `css/style.css` - New dataset button styles, compact header styling
- `js/main.js` - Integrated dataset management system
- `js/globe.js` - Added dynamic color support, updateData method
- `js/traditions.js` - Removed redundant functions

### How to Add New Datasets

1. Create a new JSON file in `data/` folder:
```json
[
  {
    "name": "Location Name",
    "lat": 40.0,
    "lng": -3.0,
    "phrase": "local phrase",
    "description": "Description of practice",
    "source": "Source attribution",
    "type": "category-name"
  }
]
```

2. Add configuration to `data/datasets.json`:
```json
{
  "id": "your-dataset-id",
  "name": "Display Name",
  "icon": "📌",
  "description": "Short description",
  "file": "data/your-file.json",
  "legend": [
    { "type": "category-name", "label": "Display Label", "color": "#hexcolor" }
  ]
}
```

3. Refresh the page - the new dataset button will appear automatically!

### Breaking Changes

None - the original "Knocking on Wood" dataset remains fully functional.

### UI Improvements

- Cleaner, more professional header
- Better use of vertical space
- Improved mobile responsiveness
- Faster dataset switching
- Visual feedback for active dataset

### Performance

- Datasets only load on-demand
- Globe reuses same instance when switching
- Smooth animations maintained
- No impact on load time

### Browser Support

Same as before - all modern browsers with ES6 module support.

---

**Migration Guide**: If you forked this project before v2.0, the old single-dataset version is preserved in git history. The new multi-dataset system is fully backward compatible with your custom data files - just add them to `datasets.json`.
