/**
 * OpenRouter API Integration for Bhairahawa Tourism Chatbot
 * This file handles the communication with the OpenRouter API
 */

// OpenRouter API key
let OPENROUTER_API_KEY = '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';

// Default system message with tourism information about Bhairahawa and Lumbini
const SYSTEM_MESSAGE = `You are a helpful tourism assistant for Bhairahawa, Nepal - the gateway to Lumbini, birthplace of Lord Buddha.

Key information about the area:
1. Lumbini is approximately 27 kilometers from Bhairahawa, taking about 45 minutes by car.
2. The best time to visit is from October to March when the weather is pleasant (15-25°C).
3. Main attractions include:
   - Lumbini (UNESCO World Heritage Site with Maya Devi Temple, Ashoka Pillar, and international monasteries)
   - Lumbini Aqua Park (water park with various attractions)
   - Lumbini Cable Car (scenic ride with panoramic views)
   - Siddha Baba Mandir (sacred temple with spiritual significance)
   - Daunne (beautiful hill station with panoramic views)
   - Nuwakot (historical site with cultural importance)
4. Transportation options:
   - Bike Rentals: From NPR 500/day
   - Bus Services: From NPR 100/ticket
   - Car Rentals: From NPR 3000/day
   - E-Rickshaw: From NPR 150/ride
5. Accommodation ranges from budget guesthouses to luxury hotels, with monasteries in Lumbini offering affordable lodging.

Provide helpful, concise information to tourists. If asked about something outside this scope, politely redirect to tourism-related topics about Bhairahawa and Lumbini.`;

// OpenRouter API configuration
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-3-haiku';

// Chat history to maintain context
let chatHistory = [
  { role: 'system', content: SYSTEM_MESSAGE }
];

/**
 * Set the OpenRouter API key
 * @param {string} apiKey - The OpenRouter API key
 */
function setApiKey(apiKey) {
  OPENROUTER_API_KEY = apiKey;
  // Save API key to localStorage for persistence
  localStorage.setItem('openrouter_api_key', apiKey);
}

/**
 * Get the OpenRouter API key from localStorage
 * @returns {string} The OpenRouter API key or empty string if not found
 */
function getApiKey() {
  return localStorage.getItem('openrouter_api_key') || '';
}

/**
 * Check if the API key is set
 * @returns {boolean} True if the API key is set, false otherwise
 */
function isApiKeySet() {
  return !!OPENROUTER_API_KEY;
}

/**
 * Send a message to the OpenRouter API
 * @param {string} message - The user's message
 * @returns {Promise<string>} The AI's response
 */
async function sendMessage(message) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('API key not set');
  }

  // Add user message to chat history
  chatHistory.push({ role: 'user', content: message });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin, // Required for OpenRouter
        'X-Title': 'Bhairahawa Tourism Chatbot' // Optional but recommended
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: chatHistory,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error communicating with OpenRouter API');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Add AI response to chat history
    chatHistory.push({ role: 'assistant', content: aiResponse });

    // Limit chat history to last 10 messages (plus system message)
    if (chatHistory.length > 11) {
      chatHistory = [
        chatHistory[0], // Keep system message
        ...chatHistory.slice(chatHistory.length - 10) // Keep last 10 messages
      ];
    }

    return aiResponse;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

/**
 * Reset the chat history
 */
function resetChat() {
  chatHistory = [
    { role: 'system', content: SYSTEM_MESSAGE }
  ];
}

// Initialize API key from localStorage if available
document.addEventListener('DOMContentLoaded', function() {
  const savedApiKey = getApiKey();
  if (savedApiKey) {
    OPENROUTER_API_KEY = savedApiKey;
  }
});

// Export the API functions
window.OpenRouterAPI = {
  sendMessage,
  setApiKey,
  getApiKey,
  isApiKeySet,
  resetChat
};
