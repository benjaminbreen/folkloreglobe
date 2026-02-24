/**
 * wikipedia.js - Wikipedia API integration
 * Fetches and displays Wikipedia content for folklore gestures
 */

const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/w/api.php';

/**
 * Search term mappings for folklore gestures
 * Maps dataset-specific gesture names to Wikipedia article titles
 */
const WIKIPEDIA_SEARCH_TERMS = {
  // Common gesture terms
  'knocking on wood': 'Knocking_on_wood',
  'touch wood': 'Knocking_on_wood',
  'knock on wood': 'Knocking_on_wood',
  'mano fico': 'Fig_sign',
  'fig sign': 'Fig_sign',
  'fig hand': 'Fig_sign',
  'mano cornuta': 'Sign_of_the_horns',
  'horns': 'Sign_of_the_horns',
  'horn gesture': 'Sign_of_the_horns',
  'left/right bias': 'Bias_against_left-handed_people',
  'left right': 'Bias_against_left-handed_people',
  'evil eye': 'Evil_eye',
  'nazar': 'Nazar_(amulet)',
  'hamsa': 'Hamsa',
  'crossed fingers': 'Crossing_fingers',
  'touching iron': 'Knocking_on_wood',
  'touch iron': 'Knocking_on_wood',
  'spitting': 'Spitting',
  'throwing salt': 'Salt#Superstition',
};

/**
 * Get Wikipedia article title from dataset config
 */
function getWikipediaTitleFromDataset(config) {
  if (!config) return 'Knocking_on_wood';

  const searchName = (config.name || '').toLowerCase();
  const searchDesc = (config.description || '').toLowerCase();

  // Check for exact matches in search terms
  for (const [key, value] of Object.entries(WIKIPEDIA_SEARCH_TERMS)) {
    if (searchName.includes(key) || searchDesc.includes(key)) {
      return value;
    }
  }

  // Default to knocking on wood if no match found
  return 'Knocking_on_wood';
}

/**
 * Get Wikipedia article title from gesture data (for individual markers)
 */
function getWikipediaTitle(data) {
  // Try to match the phrase or type to a known Wikipedia article
  const phrase = (data.phrase || '').toLowerCase();
  const type = (data.type || '').toLowerCase();
  const name = (data.name || '').toLowerCase();

  // Check for exact matches in search terms
  for (const [key, value] of Object.entries(WIKIPEDIA_SEARCH_TERMS)) {
    if (phrase.includes(key) || type.includes(key) || name.includes(key)) {
      return value;
    }
  }

  // Default to knocking on wood if no match found
  return 'Knocking_on_wood';
}

/**
 * Fetch Wikipedia content based on dataset configuration
 */
export async function fetchWikipediaForDataset(config) {
  const title = getWikipediaTitleFromDataset(config);
  return await fetchWikipediaByTitle(title);
}

/**
 * Fetch Wikipedia extract and URL for a given article title
 */
export async function fetchWikipediaContent(data) {
  const title = getWikipediaTitle(data);
  return await fetchWikipediaByTitle(title);
}

/**
 * Core function to fetch Wikipedia data by title
 */
async function fetchWikipediaByTitle(title) {

  try {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: title,
      prop: 'extracts|pageimages|info',
      exintro: true,
      explaintext: true,
      exsectionformat: 'plain',
      piprop: 'thumbnail',
      pithumbsize: 300,
      inprop: 'url',
      origin: '*', // Enable CORS
    });

    const url = `${WIKIPEDIA_API_BASE}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    const result = await response.json();
    const pages = result.query?.pages;

    if (!pages) {
      throw new Error('No pages found in Wikipedia response');
    }

    // Get the first (and only) page from the response
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    // Check if page was found (pageId -1 means not found)
    if (pageId === '-1' || !page.extract) {
      return null;
    }

    // Extract the first 2 paragraphs (approximately 800 characters)
    let extract = page.extract;

    // Limit to first ~800 chars and end at sentence boundary for two paragraphs
    if (extract.length > 800) {
      extract = extract.substring(0, 800);
      const lastPeriod = extract.lastIndexOf('.');
      if (lastPeriod > 400) {
        extract = extract.substring(0, lastPeriod + 1);
      }
    }

    return {
      title: page.title,
      extract: extract,
      url: page.fullurl || `https://en.wikipedia.org/wiki/${title}`,
      thumbnail: page.thumbnail?.source || null,
    };
  } catch (error) {
    console.error('Failed to fetch Wikipedia content:', error);
    return null;
  }
}

/**
 * Format Wikipedia content for display in the info panel
 */
export function formatWikipediaContent(content) {
  if (!content) {
    return {
      html: '<p class="wiki-error">Wikipedia information not available.</p>',
      hasContent: false,
    };
  }

  let html = '';

  // Add thumbnail if available
  if (content.thumbnail) {
    html += `
      <div class="wiki-thumbnail">
        <img src="${content.thumbnail}" alt="${content.title}" />
      </div>
    `;
  }

  // Add extract text
  html += `<p class="wiki-extract">${content.extract}</p>`;

  // Add read more link
  html += `
    <a href="${content.url}" target="_blank" rel="noopener" class="wiki-link">
      Read more on Wikipedia
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  `;

  return {
    html,
    hasContent: true,
  };
}
