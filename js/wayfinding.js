"use strict";

/**
 * ArenaMind 2026 - Stadium Wayfinding Map Module
 * Coordinates active SVG node selections, maps coordinates, and plots Bezier curve routing guides.
 */

/**
 * Coordinate mappings for stadium POIs and Gate entrance nodes.
 * @const {Object<string, {x: number, y: number}>}
 */
const NODE_COORDINATES = {
  'Gate A (North)': { x: 400, y: 30 },
  'Gate B (East)': { x: 760, y: 250 },
  'Gate C (South)': { x: 400, y: 470 },
  'Gate D (West)': { x: 40, y: 250 },
  'Sensory Friendly Room - Concourse 1': { x: 215, y: 105 },
  'Concessions Green Hub - Block 105': { x: 595, y: 125 },
  'Wheelchair Reserved Seating - Block 112': { x: 195, y: 385 },
  'Medical Station 2 - Gate D': { x: 125, y: 165 }
};

/**
 * Selects an interactive SVG map node and populates wayfinding select elements.
 * @param {string} nodeName The name identifier of the selected stadium node.
 * @returns {void}
 */
function selectMapNode(nodeName) {
  if (!DOM.routeStart || !DOM.routeEnd) return;
  
  // Decide start or destination selection logic
  if (nodeName.includes('Gate')) {
    DOM.routeStart.value = nodeName;
    announceAccessibility(`Selected starting gate: ${nodeName}`);
  } else {
    DOM.routeEnd.value = nodeName;
    announceAccessibility(`Selected destination target: ${nodeName}`);
  }
  
  // Auto calculate
  calculateRoute();
}

/**
 * Derives routing directions, walking metrics, and triggers Bezier path overlays on the SVG map.
 * @returns {{directions: string, eta: number, distance: number}|null} Routing solution details, or null if coordinates are missing.
 */
function calculateRoute() {
  if (!DOM.routeStart || !DOM.routeEnd || !DOM.routeOption) return null;

  const startName = DOM.routeStart.value;
  const endName = DOM.routeEnd.value;
  const preference = DOM.routeOption.value;
  
  const startCoord = NODE_COORDINATES[startName];
  const endCoord = NODE_COORDINATES[endName];
  
  if (!startCoord || !endCoord) return null;
  
  // Draw path on SVG using a Bezier curve
  const pathElement = document.getElementById('wayfinding-path-line');
  
  // Calculate curved path to look premium (quadratic bezier)
  const mx = (startCoord.x + endCoord.x) / 2;
  const my = (startCoord.y + endCoord.y) / 2;
  // Offset control point to generate pleasant arc curves
  const controlX = mx - (endCoord.y - startCoord.y) * 0.15;
  const controlY = my + (endCoord.x - startCoord.x) * 0.15;
  
  const pathD = `M ${startCoord.x} ${startCoord.y} Q ${controlX} ${controlY} ${endCoord.x} ${endCoord.y}`;
  if (pathElement) pathElement.setAttribute('d', pathD);
  
  // Calculate simulated metrics
  const dx = Math.abs(endCoord.x - startCoord.x);
  const dy = Math.abs(endCoord.y - startCoord.y);
  const distanceFeet = Math.round(Math.sqrt(dx*dx + dy*dy) * 2.5);
  
  let etaMinutes = Math.round(distanceFeet / 220); // standard walking speed
  if (preference === 'accessible') {
    etaMinutes = Math.round(etaMinutes * 1.15); // wheelchair routes take slightly longer paths
  } else if (preference === 'low-crowd') {
    etaMinutes = Math.round(etaMinutes * 1.3); // quiet routing might detour busy gates
  }
  
  // Build dynamic text routing directions
  let routeDirections = `From **${startName}**, walk along the outer security corridor. `;
  if (preference === 'accessible') {
    routeDirections += `Use the low-gradient accessibility ramp at Elevator Bay 1. Proceed on Level 1 flat surface directly to **${endName}**. (No stairs, step-free access).`;
  } else if (preference === 'low-crowd') {
    routeDirections += `Avoid main concourse line 3. Detour via the outer quiet promenade towards the sensory zone. Arrive at **${endName}**.`;
  } else {
    routeDirections += `Take the express escalator at Concourse A. Walk straight towards Block 105 to arrive at **${endName}**.`;
  }

  // Update UI Panels using classes instead of inline style
  if (DOM.routeResultPanel) DOM.routeResultPanel.classList.remove('hidden');
  if (DOM.routeDirections) DOM.routeDirections.textContent = routeDirections;
  if (DOM.routeEta) DOM.routeEta.textContent = `${etaMinutes} min`;
  if (DOM.routeDistance) DOM.routeDistance.textContent = `${distanceFeet} ft`;
  
  const spokenDirections = `Route calculated. Estimated arrival in ${etaMinutes} minutes. Directions: ${routeDirections}`;
  announceAccessibility(spokenDirections);

  return { directions: routeDirections, eta: etaMinutes, distance: distanceFeet };
}

// Bind to window scope
window.selectMapNode = selectMapNode;
window.calculateRoute = calculateRoute;
