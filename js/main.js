/**
 * main.js - Application entry point
 * Initializes the globe and handles user interactions
 */

import { Globe } from './globe.js';
import {
  showInfoPanel,
  hideInfoPanel,
  initInfoPanelListeners,
} from './traditions.js';
import {
  loadDatasetsConfig,
  loadDataset,
  initDatasetSelector,
  updateDatasetInfo,
  updateLegend,
  getColorForType,
  loadWikipediaForDataset,
} from './datasets.js';

// Global references
let globe = null;
let currentDatasetId = null;

/**
 * Initialize the application
 */
async function init() {
  try {
    showLoading();

    // Load datasets configuration
    const datasetsConfig = await loadDatasetsConfig();
    if (!datasetsConfig || !datasetsConfig.datasets.length) {
      showError('Failed to load datasets configuration. Please refresh the page.');
      return;
    }

    // Initialize dataset selector
    initDatasetSelector(handleDatasetChange);

    // Load first dataset
    const firstDataset = datasetsConfig.datasets[0];
    await handleDatasetChange(firstDataset.id);

    // Setup event listeners
    setupEventListeners();

    // Initialize info panel listeners
    initInfoPanelListeners();

    hideLoading();

    // Log success
    console.log(`✓ Folklore Globe initialized`);
  } catch (error) {
    console.error('Initialization error:', error);
    showError('An error occurred while loading the application.');
    hideLoading();
  }
}

/**
 * Handle dataset change
 */
async function handleDatasetChange(datasetId) {
  if (currentDatasetId === datasetId) return;

  try {
    // Load the new dataset
    const result = await loadDataset(datasetId);
    if (!result) {
      showError(`Failed to load dataset: ${datasetId}`);
      return;
    }

    const { data, config } = result;
    currentDatasetId = datasetId;

    // Update UI
    updateDatasetInfo(config, data.length);
    updateLegend(config);

    // Load Wikipedia content for this dataset
    loadWikipediaForDataset(config);

    // Create color function for this dataset
    const colorFunction = (type) => getColorForType(type);

    // Update or create globe
    if (globe) {
      globe.updateData(data, colorFunction);
    } else {
      globe = new Globe('#globe', data, colorFunction);
    }

    // Hide info panel when changing datasets
    hideInfoPanel();

    console.log(`✓ Loaded dataset: ${config.name} (${data.length} locations)`);
  } catch (error) {
    console.error('Dataset change error:', error);
    showError('Failed to switch dataset. Please try again.');
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Marker click event from globe
  document.addEventListener('markerClick', (event) => {
    showInfoPanel(event.detail);
  });

  // Control buttons
  const resetBtn = document.getElementById('reset-view');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (globe) {
        globe.stopAutoRotation();
        globe.resetView();
        hideInfoPanel();
      }
    });
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (globe) {
        globe.stopAutoRotation();
        globe.setScale(globe.scale * 1.3);
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      if (globe) {
        globe.stopAutoRotation();
        globe.setScale(globe.scale / 1.3);
      }
    });
  }

  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (globe) {
        globe.resize();
      }
    }, 250);
  });

  // Instructions close button
  const instructionsCloseBtn = document.getElementById('instructions-close');
  if (instructionsCloseBtn) {
    instructionsCloseBtn.addEventListener('click', () => {
      const instructions = document.getElementById('instructions');
      if (instructions) {
        instructions.classList.add('hidden');
      }
    });
  }

  // About modal
  const aboutBtn = document.getElementById('about-btn');
  const aboutModal = document.getElementById('about-modal');
  const aboutCloseBtn = aboutModal?.querySelector('.close-btn');

  if (aboutBtn && aboutModal) {
    aboutBtn.addEventListener('click', () => {
      aboutModal.classList.remove('hidden');
      // Focus the close button for accessibility
      aboutCloseBtn?.focus();
    });

    if (aboutCloseBtn) {
      aboutCloseBtn.addEventListener('click', () => {
        aboutModal.classList.add('hidden');
      });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
        aboutModal.classList.add('hidden');
      }
    });

    // Close on backdrop click
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) {
        aboutModal.classList.add('hidden');
      }
    });
  }

  // Toggle labels button
  const toggleLabelsBtn = document.getElementById('toggle-labels');
  let labelsVisible = false;

  if (toggleLabelsBtn) {
    toggleLabelsBtn.addEventListener('click', () => {
      labelsVisible = !labelsVisible;
      toggleLabelsBtn.setAttribute('aria-pressed', labelsVisible.toString());

      if (globe) {
        globe.setLabelsVisible(labelsVisible);
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // Don't trigger shortcuts if info panel or about modal is open
    const panel = document.getElementById('info-panel');
    const aboutModal = document.getElementById('about-modal');
    if (!panel.classList.contains('hidden') || !aboutModal.classList.contains('hidden')) return;

    switch (event.key.toLowerCase()) {
      case 'r':
        // R - Reset view
        if (globe) {
          globe.stopAutoRotation();
          globe.resetView();
        }
        break;
      case '+':
      case '=':
        // + - Zoom in
        event.preventDefault();
        if (globe) {
          globe.stopAutoRotation();
          globe.setScale(globe.scale * 1.2);
        }
        break;
      case '-':
      case '_':
        // - - Zoom out
        event.preventDefault();
        if (globe) {
          globe.stopAutoRotation();
          globe.setScale(globe.scale / 1.2);
        }
        break;
      case ' ':
        // Space - Toggle auto-rotation
        event.preventDefault();
        if (globe) {
          if (globe.autoRotateInterval) {
            globe.stopAutoRotation();
          } else {
            globe.startAutoRotation();
          }
        }
        break;
    }
  });
}

/**
 * Show error message to user
 */
function showError(message) {
  const container = document.querySelector('.globe-container');
  if (!container) return;

  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid #ef4444;
    border-radius: 0.75rem;
    padding: 2rem;
    color: #fca5a5;
    text-align: center;
    max-width: 400px;
    backdrop-filter: blur(10px);
  `;
  errorDiv.innerHTML = `
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem;">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <p style="font-size: 1rem; line-height: 1.5;">${message}</p>
  `;
  container.appendChild(errorDiv);
}

/**
 * Show loading indicator
 */
function showLoading() {
  const container = document.querySelector('.globe-container');
  if (!container) return;

  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-indicator';
  loadingDiv.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #fbbf24;
  `;
  loadingDiv.innerHTML = `
    <div style="
      width: 48px;
      height: 48px;
      border: 4px solid rgba(251, 191, 36, 0.2);
      border-top-color: #fbbf24;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    "></div>
    <p style="font-size: 1rem;">Loading globe...</p>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  container.appendChild(loadingDiv);
}

/**
 * Hide loading indicator
 */
function hideLoading() {
  const loadingDiv = document.getElementById('loading-indicator');
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.folkloreGlobe = {
  globe,
  showInfoPanel,
  hideInfoPanel,
};
