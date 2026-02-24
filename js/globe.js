/**
 * Globe.js - Interactive D3 Globe Visualization
 * Displays folklore traditions on a rotatable 3D globe
 */

export class Globe {
  constructor(containerId, data, colorFunction) {
    this.container = d3.select(containerId);
    this.data = data;
    this.colorFunction = colorFunction || this.defaultColorFunction;
    this.rotation = [0, -20, 0]; // Start with slight tilt for better view
    this.scale = 350;
    this.isDragging = false;
    this.worldData = null;
    this.labelsVisible = false;

    this.init();
  }

  /**
   * Default color function if none provided
   */
  defaultColorFunction(type) {
    return '#10b981'; // Default green
  }

  /**
   * Update data and re-render
   */
  updateData(data, colorFunction) {
    this.data = data;
    if (colorFunction) {
      this.colorFunction = colorFunction;
    }
    this.render();
  }

  /**
   * Initialize the globe
   */
  async init() {
    const width = this.container.node().parentElement.clientWidth;
    const height = this.container.node().parentElement.clientHeight;

    this.width = width;
    this.height = height;

    this.svg = this.container
      .attr('width', width)
      .attr('height', height);

    this.projection = d3.geoOrthographic()
      .scale(this.scale)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate(this.rotation);

    this.path = d3.geoPath().projection(this.projection);

    this.setupDrag();
    this.setupZoom();
    this.setupInteractionHandlers();
    await this.loadWorldData();
    this.startAutoRotation();
  }

  /**
   * Setup general interaction handlers
   */
  setupInteractionHandlers() {
    // Stop auto-rotation on any click or touch
    this.svg.on('mousedown touchstart', () => {
      this.stopAutoRotation();
    });
  }

  /**
   * Load world map data from TopoJSON
   */
  async loadWorldData() {
    try {
      const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      this.worldData = world;
      this.render();
    } catch (error) {
      console.error('Failed to load world data:', error);
    }
  }

  /**
   * Setup drag interaction
   */
  setupDrag() {
    const drag = d3.drag()
      .on('start', () => {
        this.isDragging = true;
        this.stopAutoRotation();
        this.hideTooltip();
      })
      .on('drag', (event) => {
        if (this.isDragging) {
          // Use dx/dy for deltas, not absolute x/y
          this.rotation[0] += event.dx * 0.5;
          this.rotation[1] -= event.dy * 0.5;
          // Clamp latitude rotation
          this.rotation[1] = Math.max(-90, Math.min(90, this.rotation[1]));
          this.render();
        }
      })
      .on('end', () => {
        this.isDragging = false;
        // Don't resume auto-rotation after user interaction
      });

    this.svg.call(drag);
  }

  /**
   * Setup mouse wheel zoom
   */
  setupZoom() {
    this.svg.on('wheel', (event) => {
      event.preventDefault();
      this.stopAutoRotation();
      const delta = -event.deltaY;
      const zoomFactor = delta > 0 ? 1.1 : 0.9;
      this.setScale(this.scale * zoomFactor);
    });
  }

  /**
   * Start auto-rotation animation
   */
  startAutoRotation() {
    if (this.autoRotateInterval) return;

    this.autoRotateInterval = setInterval(() => {
      if (!this.isDragging) {
        this.rotation[0] += 0.2;
        this.render();
      }
    }, 50);
  }

  /**
   * Stop auto-rotation animation
   */
  stopAutoRotation() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  /**
   * Main render function
   */
  render() {
    if (!this.worldData) return;

    this.svg.selectAll('*').remove();

    this.projection.rotate(this.rotation);

    const g = this.svg.append('g');

    // Draw ocean sphere
    g.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'ocean')
      .attr('d', this.path)
      .attr('fill', '#0a1929')
      .attr('stroke', '#1e3a5f')
      .attr('stroke-width', 2);

    // Draw graticule (grid lines)
    const graticule = d3.geoGraticule().step([20, 20]);
    g.append('path')
      .datum(graticule())
      .attr('d', this.path)
      .attr('fill', 'none')
      .attr('stroke', '#1e3a5f')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3);

    // Draw land
    const countries = topojson.feature(
      this.worldData,
      this.worldData.objects.countries
    );

    g.selectAll('.land')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'land')
      .attr('d', this.path)
      .attr('fill', '#1a2f4a')
      .attr('stroke', '#2a4f7a')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.7);

    // Draw tradition markers
    this.renderMarkers(g);
  }

  /**
   * Set label visibility
   */
  setLabelsVisible(visible) {
    this.labelsVisible = visible;
    this.render();
  }

  /**
   * Render tradition markers on the globe
   */
  renderMarkers(g) {
    const centerPoint = [-this.rotation[0], -this.rotation[1]];

    // Filter for visible markers (front side of globe)
    const visibleData = this.data.filter((d) => {
      const coords = [d.lng, d.lat];
      const distance = d3.geoDistance(centerPoint, coords);
      return distance <= Math.PI / 2;
    });

    visibleData.forEach((d) => {
      const coords = [d.lng, d.lat];
      const projected = this.projection(coords);

      if (!projected) return;

      const markerGroup = g.append('g').attr('class', 'marker-group');

      // Outer glow ring (pulsing)
      markerGroup
        .append('circle')
        .attr('cx', projected[0])
        .attr('cy', projected[1])
        .attr('r', 12)
        .attr('fill', 'none')
        .attr('stroke', this.getMarkerColor(d.type))
        .attr('stroke-width', 2)
        .attr('opacity', 0.4)
        .attr('class', 'marker-pulse');

      // Main marker dot
      const markerDot = markerGroup
        .append('circle')
        .attr('cx', projected[0])
        .attr('cy', projected[1])
        .attr('r', 6)
        .attr('fill', this.getMarkerColor(d.type))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.95)
        .attr('class', 'marker-dot')
        .style('cursor', 'pointer')
        .style('filter', 'drop-shadow(0 0 8px currentColor)')
        .on('click', () => {
          this.stopAutoRotation();
          this.onMarkerClick(d);
        })
        .on('mouseover', (event) => {
          this.stopAutoRotation();
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 9)
            .attr('stroke-width', 3);

          this.showTooltip(d, event);
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 6)
            .attr('stroke-width', 2);

          this.hideTooltip();
        })
        .on('mousemove', (event) => {
          this.updateTooltipPosition(event);
        });

      // Add label if labels are visible
      if (this.labelsVisible) {
        const labelGroup = markerGroup.append('g').attr('class', 'label-group');

        const textPadding = 8;
        const textX = projected[0] + 16;
        const textY = projected[1] - 6;
        const lineHeight = 14;

        // Truncate phrase to 4-5 words
        const words = d.phrase.split(' ');
        const truncatedPhrase = words.length > 5
          ? words.slice(0, 5).join(' ') + '...'
          : d.phrase;

        // Location name (first line)
        const nameText = labelGroup
          .append('text')
          .attr('x', textX)
          .attr('y', textY)
          .attr('font-size', '12px')
          .attr('font-weight', '600')
          .attr('fill', '#fbbf24')
          .style('pointer-events', 'none')
          .text(d.name);

        // Phrase (second line)
        const phraseText = labelGroup
          .append('text')
          .attr('x', textX)
          .attr('y', textY + lineHeight)
          .attr('font-size', '11px')
          .attr('font-style', 'italic')
          .attr('font-weight', '400')
          .attr('fill', '#cbd5e1')
          .style('pointer-events', 'none')
          .text(`"${truncatedPhrase}"`);

        // Get combined bounding box
        const nameBBox = nameText.node().getBBox();
        const phraseBBox = phraseText.node().getBBox();
        const maxWidth = Math.max(nameBBox.width, phraseBBox.width);
        const totalHeight = nameBBox.height + phraseBBox.height + 4;

        // Add background with gradient-like effect using multiple rectangles
        const bgGroup = labelGroup.insert('g', 'text');

        // Shadow/outer glow
        bgGroup
          .append('rect')
          .attr('x', textX - textPadding - 1)
          .attr('y', textY - nameBBox.height + 2)
          .attr('width', maxWidth + textPadding * 2 + 2)
          .attr('height', totalHeight + textPadding - 2)
          .attr('fill', 'rgba(0, 0, 0, 0.5)')
          .attr('rx', 5)
          .style('pointer-events', 'none');

        // Main background
        bgGroup
          .append('rect')
          .attr('x', textX - textPadding)
          .attr('y', textY - nameBBox.height + 3)
          .attr('width', maxWidth + textPadding * 2)
          .attr('height', totalHeight + textPadding - 3)
          .attr('fill', 'rgba(15, 23, 42, 0.95)')
          .attr('stroke', 'rgba(251, 191, 36, 0.4)')
          .attr('stroke-width', 1.5)
          .attr('rx', 4)
          .style('pointer-events', 'none');

        // Subtle top highlight
        bgGroup
          .append('line')
          .attr('x1', textX - textPadding + 4)
          .attr('y1', textY - nameBBox.height + 5)
          .attr('x2', textX + maxWidth + textPadding - 4)
          .attr('y2', textY - nameBBox.height + 5)
          .attr('stroke', 'rgba(251, 191, 36, 0.2)')
          .attr('stroke-width', 1)
          .style('pointer-events', 'none');
      }
    });
  }

  /**
   * Get color based on tradition type
   */
  getMarkerColor(type) {
    return this.colorFunction(type);
  }

  /**
   * Show tooltip with marker data
   */
  showTooltip(data, event) {
    const tooltip = document.getElementById('marker-tooltip');
    if (!tooltip) return;

    // Populate tooltip content
    const nameEl = tooltip.querySelector('.tooltip-name');
    const phraseEl = tooltip.querySelector('.tooltip-phrase');

    if (nameEl) nameEl.textContent = data.name;
    if (phraseEl) phraseEl.textContent = `"${data.phrase}"`;

    // Show tooltip
    tooltip.classList.remove('hidden');

    // Position tooltip
    this.updateTooltipPosition(event);
  }

  /**
   * Hide tooltip
   */
  hideTooltip() {
    const tooltip = document.getElementById('marker-tooltip');
    if (tooltip) {
      tooltip.classList.add('hidden');
    }
  }

  /**
   * Update tooltip position to follow cursor
   */
  updateTooltipPosition(event) {
    const tooltip = document.getElementById('marker-tooltip');
    if (!tooltip || tooltip.classList.contains('hidden')) return;

    const container = document.querySelector('.globe-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Position relative to container
    let x = event.clientX - containerRect.left + 15;
    let y = event.clientY - containerRect.top + 15;

    // Keep tooltip within container bounds
    if (x + tooltipRect.width > containerRect.width) {
      x = event.clientX - containerRect.left - tooltipRect.width - 15;
    }
    if (y + tooltipRect.height > containerRect.height) {
      y = event.clientY - containerRect.top - tooltipRect.height - 15;
    }

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  /**
   * Handle marker click
   */
  onMarkerClick(data) {
    // Hide tooltip when clicking
    this.hideTooltip();

    // Emit custom event for the main app to handle
    document.dispatchEvent(
      new CustomEvent('markerClick', { detail: data })
    );

    // Animate globe to center on clicked marker
    this.animateToLocation(data.lng, data.lat);
  }

  /**
   * Animate globe rotation to center on a location
   */
  animateToLocation(lng, lat) {
    this.stopAutoRotation();

    const targetRotation = [-lng, -lat, 0];
    const startRotation = [...this.rotation];

    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      this.rotation = [
        startRotation[0] + (targetRotation[0] - startRotation[0]) * eased,
        startRotation[1] + (targetRotation[1] - startRotation[1]) * eased,
        0,
      ];

      this.render();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Don't restart auto-rotation - let user control it
        // or let it restart when info panel is closed
      }
    };

    animate();
  }

  /**
   * Set zoom scale
   */
  setScale(newScale) {
    // Clamp scale between 200 and 800
    this.scale = Math.max(200, Math.min(800, newScale));
    this.projection.scale(this.scale);
    this.render();
  }

  /**
   * Reset view to initial state
   */
  resetView() {
    this.stopAutoRotation();

    const targetRotation = [0, -20, 0];
    const targetScale = 350;
    const startRotation = [...this.rotation];
    const startScale = this.scale;

    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      this.rotation = [
        startRotation[0] + (targetRotation[0] - startRotation[0]) * eased,
        startRotation[1] + (targetRotation[1] - startRotation[1]) * eased,
        0,
      ];

      this.scale = startScale + (targetScale - startScale) * eased;
      this.projection.scale(this.scale);

      this.render();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.startAutoRotation();
      }
    };

    animate();
  }

  /**
   * Handle window resize
   */
  resize() {
    const width = this.container.node().parentElement.clientWidth;
    const height = this.container.node().parentElement.clientHeight;

    this.width = width;
    this.height = height;

    this.svg.attr('width', width).attr('height', height);
    this.projection.translate([width / 2, height / 2]);
    this.render();
  }
}
