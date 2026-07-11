/**
 * ArenaMind 2026 - Accessibility Controller Module
 * Manages high-contrast visual filters, font scaling utilities, text-to-speech toggling,
 * and ARIA screen reader announcements.
 */

/**
 * Toggles high contrast visual theme layout parameters on document body.
 * @returns {void}
 */
function toggleHighContrast() {
  const body = document.body;
  body.classList.toggle('high-contrast');
  
  const isActive = body.classList.contains('high-contrast');
  
  if (DOM.btnContrast) {
    if (isActive) {
      DOM.btnContrast.textContent = '☀️ Normal Contrast';
      announceAccessibility("High contrast mode enabled.");
    } else {
      DOM.btnContrast.textContent = '🌗 High Contrast Mode';
      announceAccessibility("High contrast mode disabled.");
    }
  }
}

/**
 * Adjusts font size scaling percentage on document root structure.
 * @param {boolean} increase True to upscale font size, false to downscale.
 * @returns {void}
 */
function adjustTextScale(increase) {
  const html = document.documentElement;
  
  if (increase) {
    currentFontSizePercent = Math.min(150, currentFontSizePercent + 10);
  } else {
    currentFontSizePercent = Math.max(85, currentFontSizePercent - 10);
  }
  
  html.style.fontSize = `${currentFontSizePercent}%`;
  announceAccessibility(`Text size scaled to ${currentFontSizePercent} percent.`);
}

/**
 * Toggles speech synthesis assistive navigation voice overlays.
 * @returns {void}
 */
function toggleTextToSpeech() {
  isTextToSpeechActive = !isTextToSpeechActive;
  
  if (DOM.btnSpeech) {
    if (isTextToSpeechActive) {
      DOM.btnSpeech.textContent = '🔇 Text-to-Speech (On)';
      DOM.btnSpeech.classList.add('active');
      announceAccessibility("Text to speech navigation aids activated.");
    } else {
      DOM.btnSpeech.textContent = '🔊 Text-to-Speech (Off)';
      DOM.btnSpeech.classList.remove('active');
      // Stop any ongoing speaking
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }
}

/**
 * Broadcasts dynamic instructions to ARIA live-announcer region for screen readers.
 * @param {string} text The spoken message instruction string.
 * @returns {void}
 */
function announceAccessibility(text) {
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = text;
  }
  
  // Optional Text-To-Speech
  if (isTextToSpeechActive && 'speechSynthesis' in window) {
    // Stop ongoing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}
