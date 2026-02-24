/**
 * traditions.js - Data loading and info panel management
 */

import { getCurrentDatasetConfig } from './datasets.js';

/**
 * Load traditions data from JSON file
 */
export async function loadTraditions() {
  try {
    const response = await fetch('data/knocking-traditions.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load traditions data:', error);
    // Return empty array as fallback
    return [];
  }
}

/**
 * Show the info panel with tradition details
 */
export function showInfoPanel(data) {
  const panel = document.getElementById('info-panel');
  const instructions = document.getElementById('instructions');
  const citationDiv = document.getElementById('info-citation');

  // Update panel content
  document.getElementById('info-country').textContent = data.name;
  document.getElementById('info-phrase').textContent = `"${data.phrase}"`;
  document.getElementById('info-description').textContent = data.description;
  document.getElementById('info-source').textContent = data.source;

  // Update Google Books search link
  const googleBooksLink = document.getElementById('google-books-link');
  if (googleBooksLink && data.phrase) {
    const encodedPhrase = encodeURIComponent(`"${data.phrase}"`);
    googleBooksLink.href = `https://www.google.com/search?udm=36&q=${encodedPhrase}`;
  }

  // Handle citation display based on current dataset config
  const config = getCurrentDatasetConfig();
  if (config && config.citation && citationDiv) {
    citationDiv.innerHTML = `<a href="${config.citation.url}" target="_blank" rel="noopener">${config.citation.text}</a>`;
    citationDiv.style.display = 'block';
  } else if (citationDiv) {
    citationDiv.style.display = 'none';
  }

  // Hide instructions when showing panel
  if (instructions) {
    instructions.classList.add('hidden');
  }

  // Show panel with animation
  panel.classList.remove('hidden');

  // Add click outside to close
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 100);
}

/**
 * Hide the info panel
 */
export function hideInfoPanel() {
  const panel = document.getElementById('info-panel');
  const instructions = document.getElementById('instructions');

  panel.classList.add('hidden');

  // Show instructions again
  if (instructions) {
    instructions.classList.remove('hidden');
  }

  // Remove outside click listener
  document.removeEventListener('click', handleOutsideClick);
}

/**
 * Handle clicks outside the info panel
 */
function handleOutsideClick(event) {
  const panel = document.getElementById('info-panel');
  const isClickInside = panel.contains(event.target);

  if (!isClickInside && !panel.classList.contains('hidden')) {
    hideInfoPanel();
  }
}

/**
 * Format tradition data for display
 */
export function formatTraditionData(data) {
  return {
    name: data.name || 'Unknown',
    phrase: data.phrase || '',
    description: data.description || 'No description available.',
    source: data.source || 'Unknown source',
    type: data.type || 'wood',
    coordinates: [data.lng || 0, data.lat || 0],
  };
}

/**
 * Get tradition type label
 */
export function getTraditionTypeLabel(type) {
  const labels = {
    wood: 'Wood Knocking',
    iron: 'Iron/Metal Touching',
    mixed: 'Mixed Variation',
  };
  return labels[type] || labels.wood;
}

/**
 * Get tradition type color
 */
export function getTraditionTypeColor(type) {
  const colors = {
    wood: '#10b981',
    iron: '#8b5cf6',
    mixed: '#f59e0b',
  };
  return colors[type] || colors.wood;
}

/**
 * Initialize info panel event listeners
 */
export function initInfoPanelListeners() {
  const closeBtn = document.querySelector('.close-btn');
  const panel = document.getElementById('info-panel');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideInfoPanel();
    });
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
      hideInfoPanel();
    }
  });

  // Prevent clicks inside panel from closing it
  if (panel) {
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

