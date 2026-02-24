/**
 * datasets.js - Dataset management and configuration
 */

import { fetchWikipediaForDataset, formatWikipediaContent } from './wikipedia.js';

let currentDatasetConfig = null;
let datasetsConfig = null;

/**
 * Load datasets configuration
 */
export async function loadDatasetsConfig() {
  try {
    const response = await fetch('data/datasets.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    datasetsConfig = await response.json();
    return datasetsConfig;
  } catch (error) {
    console.error('Failed to load datasets config:', error);
    return null;
  }
}

/**
 * Load a specific dataset by ID
 */
export async function loadDataset(datasetId) {
  if (!datasetsConfig) {
    await loadDatasetsConfig();
  }

  const config = datasetsConfig.datasets.find(d => d.id === datasetId);
  if (!config) {
    console.error(`Dataset ${datasetId} not found`);
    return null;
  }

  try {
    const response = await fetch(config.file);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    currentDatasetConfig = config;
    return { data, config };
  } catch (error) {
    console.error(`Failed to load dataset ${datasetId}:`, error);
    return null;
  }
}

/**
 * Get current dataset configuration
 */
export function getCurrentDatasetConfig() {
  return currentDatasetConfig;
}

/**
 * Get all datasets configuration
 */
export function getDatasetsConfig() {
  return datasetsConfig;
}

/**
 * Initialize dataset selector buttons
 */
export function initDatasetSelector(onDatasetChange) {
  const buttonsContainer = document.getElementById('dataset-buttons');
  if (!buttonsContainer || !datasetsConfig) return;

  buttonsContainer.innerHTML = '';

  datasetsConfig.datasets.forEach((dataset, index) => {
    const button = document.createElement('button');
    button.className = 'dataset-btn';
    if (index === 0) button.classList.add('active');
    button.dataset.datasetId = dataset.id;

    button.innerHTML = `
      <span class="icon">${dataset.icon}</span>
      <span>${dataset.name}</span>
    `;

    button.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.dataset-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      // Trigger dataset change
      onDatasetChange(dataset.id);
    });

    buttonsContainer.appendChild(button);
  });
}

/**
 * Update dataset info display
 */
export function updateDatasetInfo(config, count) {
  const descriptionEl = document.getElementById('current-dataset-description');
  const countEl = document.getElementById('tradition-count');
  const iconEl = document.getElementById('info-icon');
  const instructionsEl = document.getElementById('instructions-text');

  if (descriptionEl) {
    descriptionEl.textContent = config.description;
  }

  if (countEl) {
    countEl.textContent = count;
  }

  if (iconEl) {
    iconEl.textContent = config.icon;
  }

  if (instructionsEl && config.instructionText) {
    instructionsEl.textContent = config.instructionText;
  }

  const citationEl = document.getElementById('instructions-citation');
  if (citationEl) {
    if (config.citation) {
      citationEl.innerHTML = `Data derived from a table in <a href="${config.citation.url}" target="_blank" rel="noopener">Schiefenh\u00F6vel (2013)</a>.`;
      citationEl.style.display = 'block';
    } else {
      citationEl.style.display = 'none';
    }
  }
}

/**
 * Update legend with dataset-specific types
 */
export function updateLegend(config) {
  const legendItems = document.getElementById('legend-items');
  if (!legendItems || !config.legend) return;

  legendItems.innerHTML = '';

  config.legend.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <span class="legend-dot" style="background: ${item.color}; color: ${item.color};"></span>
      <span class="legend-label">${item.label}</span>
    `;
    legendItems.appendChild(legendItem);
  });
}

/**
 * Get color for a tradition type from current dataset config
 */
export function getColorForType(type) {
  if (!currentDatasetConfig || !currentDatasetConfig.legend) {
    return '#64748B'; // Default gray
  }

  const legendItem = currentDatasetConfig.legend.find(item => item.type === type);
  return legendItem ? legendItem.color : '#64748B';
}

/**
 * Load and display Wikipedia content for the current dataset
 */
export async function loadWikipediaForDataset(config) {
  const wikiContent = document.getElementById('wiki-content');
  const wikiHeader = document.getElementById('wiki-header');

  if (!wikiContent || !wikiHeader) return;

  // Show loading state
  wikiContent.innerHTML = '<p class="wiki-loading">Loading Wikipedia content...</p>';

  // Fetch Wikipedia content
  const wikipediaData = await fetchWikipediaForDataset(config);
  const formattedContent = formatWikipediaContent(wikipediaData);

  // Update content
  wikiContent.innerHTML = formattedContent.html;

  // Initialize the expand/collapse functionality if content was loaded
  if (formattedContent.hasContent) {
    initWikiExpandCollapse();
  }
}

/**
 * Initialize Wikipedia section expand/collapse functionality
 */
function initWikiExpandCollapse() {
  const wikiHeader = document.getElementById('wiki-header');
  const wikiContent = document.getElementById('wiki-content');

  if (!wikiHeader || !wikiContent) return;

  // Remove any existing listeners by cloning
  const newHeader = wikiHeader.cloneNode(true);
  wikiHeader.parentNode.replaceChild(newHeader, wikiHeader);

  newHeader.addEventListener('click', () => {
    const isExpanded = newHeader.classList.contains('expanded');

    if (isExpanded) {
      newHeader.classList.remove('expanded');
      newHeader.setAttribute('aria-expanded', 'false');
      wikiContent.style.maxHeight = '0';
      wikiContent.style.opacity = '0';
    } else {
      newHeader.classList.add('expanded');
      newHeader.setAttribute('aria-expanded', 'true');
      wikiContent.style.maxHeight = wikiContent.scrollHeight + 'px';
      wikiContent.style.opacity = '1';
    }
  });

  // Also handle keyboard activation (Enter/Space)
  newHeader.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      newHeader.click();
    }
  });

  // Start collapsed by default
  wikiContent.style.maxHeight = '0';
  wikiContent.style.opacity = '0';
  newHeader.classList.remove('expanded');
}
