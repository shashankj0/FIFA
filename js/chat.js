/**
 * ArenaMind 2026 - Multilingual GenAI Chatbot Module
 * Handles recommended prompt submissions, manual prompt processing, and language translation hooks.
 */

/**
 * Inserts a quick prompt option text into the chat field and executes standard submission.
 * @param {string} promptText The pre-defined prompt query text.
 * @returns {void}
 */
function submitQuickPrompt(promptText) {
  if (DOM.chatTextField) {
    DOM.chatTextField.value = promptText;
    handleChatSubmit();
  }
}

/**
 * Captures chat input values, appends user bubble, and triggers AI text streaming outputs.
 * @returns {void}
 */
function handleChatSubmit() {
  if (!DOM.chatTextField || !DOM.chatMessagesBox || !DOM.chatLangSelect || !DOM.chatTextField.value.trim()) return;
  
  const query = DOM.chatTextField.value;
  DOM.chatTextField.value = '';
  
  // Render user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble bubble-user';
  userBubble.textContent = query; // Escaped text insertion
  DOM.chatMessagesBox.appendChild(userBubble);
  DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;
  
  // Render placeholder AI bubble for streaming
  const aiBubble = document.createElement('div');
  aiBubble.className = 'chat-bubble bubble-ai';
  aiBubble.textContent = '...';
  DOM.chatMessagesBox.appendChild(aiBubble);
  DOM.chatMessagesBox.scrollTop = DOM.chatMessagesBox.scrollHeight;

  // Retrieve current simulator values for contextual reasoning
  const simState = window.stadiumSimulator ? window.stadiumSimulator.state : {};
  const lang = DOM.chatLangSelect.value;
  
  // Call AI response generation
  setTimeout(() => {
    const responseText = window.stadiumAIEngine.generateResponse(query, lang, simState);
    window.stadiumAIEngine.streamText(responseText, aiBubble, () => {
      announceAccessibility(aiBubble.textContent);
    });
  }, 300);
}

/**
 * Handles changes to language options and streams corresponding localized notifications.
 * @returns {void}
 */
function updateChatLanguage() {
  if (!DOM.chatLangSelect || !DOM.chatMessagesBox) return;
  const lang = DOM.chatLangSelect.value;
  announceAccessibility(`AI assistant language switched to ${lang}.`);
  
  // Stream translation change notice
  const noticeBubble = document.createElement('div');
  noticeBubble.className = 'chat-bubble bubble-ai';
  DOM.chatMessagesBox.appendChild(noticeBubble);
  
  const baseNotices = {
    en: "Language set to English 🇺🇸. Ready for your query.",
    es: "Idioma configurado en Español 🇲🇽. Listo para su consulta.",
    fr: "Langue configurée en Français 🇨🇦. Prêt pour votre question.",
    ar: "تم تعيين اللغة إلى العربية 🇸🇦. جاهز لاستفسارك.",
    de: "Sprache auf Deutsch eingestellt 🇩🇪. Bereit für Ihre Anfrage.",
    ja: "言語を日本語に設定しました 🇯🇵。質問を入力してください。",
    pt: "Idioma definido como Português 🇧🇷. Pronto para sua consulta."
  };
  
  const noticeText = baseNotices[lang] || baseNotices['en'];
  window.stadiumAIEngine.streamText(noticeText, noticeBubble);
}
