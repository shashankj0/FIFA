"use strict";

/**
 * ArenaMind 2026 - Sustainability Hub Module
 * Calculates travel emissions, concessional offsets, and updates fan footprint indicators.
 */

/**
 * Emission thresholds for fan sustainability levels.
 * @const {{elite: number, silver: number}}
 */
const CARBON_TIER_THRESHOLDS = {
  elite: 3.0,
  silver: 10.0
};

/**
 * Calculates matchday carbon footprint based on transportation and concessions inputs.
 * @returns {string} Calculated CO2 equivalent value (in kg) rounded to 2 decimal places.
 */
function calculateCarbonFootprint() {
  const transportEl = document.getElementById('transport-type');
  const travelDistanceEl = document.getElementById('travel-distance');
  const foodChoiceEl = document.getElementById('food-choice');
  const wasteOffsetEl = document.getElementById('waste-offset');
  
  if (!transportEl || !travelDistanceEl || !foodChoiceEl || !wasteOffsetEl) return "0.00";

  const transport = transportEl.value;
  const distVal = travelDistanceEl.value;
  const food = foodChoiceEl.value;
  const waste = wasteOffsetEl.value;
  
  const distance = Math.min(300, Math.max(0, parseFloat(distVal) || 0));
  
  // Transport coefficients (kg CO2 per mile)
  const transportCoeffs = {
    train: 0.05,
    bus: 0.08,
    carpool: 0.18,
    single: 0.36
  };
  
  // Food emissions (kg CO2)
  const foodEmissions = {
    plant: 0.4,
    chicken: 1.2,
    beef: 4.8
  };
  
  // Waste offsets (kg CO2)
  const wasteOffsets = {
    none: 0,
    basic: 0.5,
    champion: 1.5
  };

  // Defensive input validation mapping
  if (!Object.prototype.hasOwnProperty.call(transportCoeffs, transport) ||
      !Object.prototype.hasOwnProperty.call(foodEmissions, food) ||
      !Object.prototype.hasOwnProperty.call(wasteOffsets, waste)) {
    return "0.00";
  }
  
  // CO2 calculation formula
  const transportTotal = distance * transportCoeffs[transport];
  const foodTotal = foodEmissions[food];
  const wasteTotal = wasteOffsets[waste];
  
  const totalCO2 = Math.max(0, transportTotal + foodTotal - wasteTotal);
  
  // Update DOM values
  const footprintValue = DOM.carbonFootprintValue || document.getElementById('carbon-footprint-value');
  const footprintDesc = DOM.carbonTierDesc || document.getElementById('carbon-tier-desc');
  const adviceText = DOM.sustainabilityAiAdvice || document.getElementById('sustainability-ai-advice');
  
  if (footprintValue) {
    footprintValue.textContent = totalCO2.toFixed(2);
  }
  
  // Tier definition
  let tier = 'Eco Champion 🟢';
  let className = 'text-primary-color';
  let advice = '';
  
  if (totalCO2 < CARBON_TIER_THRESHOLDS.elite) {
    tier = 'Elite Green Fan Level: Elite Champion 🟢';
    className = 'text-primary-color';
    advice = "Exceptional effort! Choosing high-efficiency public transit and plant-based concessions drastically offsets your matchday footprint. MetLife Stadium grants you a 20% Eco-rewards token. Scan at any merchandise stand!";
  } else if (totalCO2 < CARBON_TIER_THRESHOLDS.silver) {
    tier = 'Active Green Fan Level: Silver Contender 🟡';
    className = 'text-accent-color';
    advice = "Great work! You are helping reduce emissions. Consider carpooling or trying a green concession next match. Transitioning from beef to chicken dining reduces food emissions by 75%.";
  } else {
    tier = 'High Carbon Footprint Level: Needs Action 🔴';
    className = 'text-danger-color';
    advice = "Your estimated matchday emissions are high. To reduce your impact, we recommend checking the Express Rail shuttle lines. Taking public transit saves on average 0.31 kg CO2 per mile over single occupancy travel.";
  }
  
  if (footprintDesc) {
    footprintDesc.textContent = tier;
    footprintDesc.className = `carbon-metric-tier ${className}`;
  }
  
  if (adviceText) {
    adviceText.textContent = advice;
  }

  return totalCO2.toFixed(2);
}

// Bind to window scope
window.calculateCarbonFootprint = calculateCarbonFootprint;
