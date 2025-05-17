// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const questionBtns = document.querySelectorAll('.question-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    // Robot elements
    const robotElement = document.querySelector('.fixed-robot');
    const robotMouth = document.querySelector('.robot-mouth');
    const robotEyes = document.querySelectorAll('.eye');
    const robotArms = document.querySelectorAll('.arm');
    const robotAntenna = document.querySelector('.robot-antenna');
    const speechBubble = document.querySelector('.speech-bubble');

    // API Key Modal Elements
    let apiKeyModal;
    let apiKeyInput;
    let apiKeySaveBtn;
    let apiKeyCloseBtn;

    // Create API Key Modal
    function createApiKeyModal() {
        // Create modal container
        apiKeyModal = document.createElement('div');
        apiKeyModal.className = 'api-key-modal';
        apiKeyModal.innerHTML = `
            <div class="api-key-modal-content">
                <h3>Enter OpenRouter API Key</h3>
                <p>Please enter your OpenRouter API key to enable the chatbot.</p>
                <p>You can get an API key from <a href="https://openrouter.ai" target="_blank">openrouter.ai</a></p>
                <div class="api-key-input-container">
                    <input type="password" id="api-key-input" placeholder="Enter your API key">
                    <button id="api-key-save-btn" class="btn">Save</button>
                </div>
                <button id="api-key-close-btn" class="close-btn">&times;</button>
            </div>
        `;
        document.body.appendChild(apiKeyModal);

        // Get modal elements
        apiKeyInput = document.getElementById('api-key-input');
        apiKeySaveBtn = document.getElementById('api-key-save-btn');
        apiKeyCloseBtn = document.getElementById('api-key-close-btn');

        // Set existing API key if available
        if (window.OpenRouterAPI && window.OpenRouterAPI.getApiKey()) {
            apiKeyInput.value = window.OpenRouterAPI.getApiKey();
        }

        // Add event listeners
        apiKeySaveBtn.addEventListener('click', saveApiKey);
        apiKeyCloseBtn.addEventListener('click', closeApiKeyModal);

        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .api-key-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }
            .api-key-modal-content {
                background-color: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                max-width: 500px;
                width: 90%;
                position: relative;
            }
            .api-key-modal h3 {
                margin-top: 0;
                color: var(--text-color);
            }
            .api-key-modal p {
                margin-bottom: 20px;
                color: var(--text-muted);
            }
            .api-key-input-container {
                display: flex;
                gap: 10px;
            }
            .api-key-input-container input {
                flex-grow: 1;
                padding: 12px;
                border: 1px solid var(--input-border);
                border-radius: var(--border-radius-md);
            }
            .close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text-muted);
            }
        `;
        document.head.appendChild(style);
    }

    // Show API Key Modal
    function showApiKeyModal() {
        if (!apiKeyModal) {
            createApiKeyModal();
        }
        apiKeyModal.style.display = 'flex';
    }

    // Close API Key Modal
    function closeApiKeyModal() {
        apiKeyModal.style.display = 'none';
    }

    // Save API Key
    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            window.OpenRouterAPI.setApiKey(apiKey);
            closeApiKeyModal();
            // Add a message to the chat
            addMessage("API key saved successfully! You can now chat with the AI assistant.", false);
        } else {
            alert("Please enter a valid API key");
        }
    }

    // Check if API key is set
    function checkApiKey() {
        // API key is now pre-configured, so always return true
        return true;
    }

    // Initial robot animation
    setTimeout(() => {
        activateRobot();
    }, 1000);

    // Add random messages for the robot to say
    const robotMessages = [
        "Hi there!",
        "Need help?",
        "Ask me anything!",
        "Hello!",
        "I'm here to help",
        "Bhairahawa info?",
        "Explore Lumbini!",
        "Travel tips?",
        "Welcome!"
    ];

    // Function to change the robot's speech bubble text randomly
    function changeRobotMessage() {
        const randomMessage = robotMessages[Math.floor(Math.random() * robotMessages.length)];
        speechBubble.querySelector('span').textContent = randomMessage;
    }

    // Change message every 10 seconds
    setInterval(changeRobotMessage, 10000);

    // Robot animation functions
    function activateRobot() {
        // Show speech bubble
        speechBubble.style.animation = 'none';
        void speechBubble.offsetWidth; // Trigger reflow
        speechBubble.style.animation = 'fadeInOut 4s ease-in-out';

        // Animate robot arms
        robotArms.forEach(arm => {
            arm.style.animation = 'none';
            void arm.offsetWidth; // Trigger reflow
            if (arm.classList.contains('left')) {
                arm.style.animation = 'waveLeft 0.5s ease-in-out 3';
            } else {
                arm.style.animation = 'waveRight 0.5s ease-in-out 3';
            }
        });

        // Animate robot mouth
        robotMouth.style.animation = 'none';
        void robotMouth.offsetWidth; // Trigger reflow
        robotMouth.style.animation = 'smile 1s ease-in-out 2';

        // Faster eye blinking
        robotEyes.forEach(eye => {
            eye.style.animation = 'blink 1s infinite';
        });

        // Reset animations after 3 seconds
        setTimeout(() => {
            robotArms.forEach(arm => {
                if (arm.classList.contains('left')) {
                    arm.style.animation = 'waveLeft 3s infinite';
                } else {
                    arm.style.animation = 'waveRight 3s infinite';
                }
            });

            robotMouth.style.animation = 'smile 8s infinite';

            robotEyes.forEach(eye => {
                eye.style.animation = 'blink 4s infinite';
                if (eye.classList.contains('left')) {
                    eye.style.animationDelay = '0.5s';
                }
            });
        }, 3000);
    }

    // Focus animation when user clicks on input
    userInput.addEventListener('focus', () => {
        // Slightly scale up the robot
        robotElement.style.transform = 'scale(1.05) translateY(-5px)';

        // Make eyes brighter
        robotEyes.forEach(eye => {
            eye.style.boxShadow = '0 0 15px var(--robot-glow)';
            eye.style.height = '14px';
        });

        // Change speech bubble
        speechBubble.querySelector('span').textContent = "How can I help?";
        speechBubble.style.animation = 'none';
        void speechBubble.offsetWidth; // Trigger reflow
        speechBubble.style.animation = 'fadeInOut 10s ease-in-out';
    });

    userInput.addEventListener('blur', () => {
        // Reset robot scale
        robotElement.style.transform = '';

        // Reset eyes
        robotEyes.forEach(eye => {
            eye.style.boxShadow = '';
            eye.style.height = '';
        });
    });

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        // For bot messages, add a typewriter effect
        if (!isUser) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p class="typewriter"></p>
                </div>
                <span class="message-time">${timeString}</span>
            `;

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Animate robot when bot responds
            activateRobot();

            // Typewriter effect
            const typewriterElement = messageDiv.querySelector('.typewriter');
            const textToType = message.replace(/\n/g, '<br>');
            let i = 0;
            const typeSpeed = 10; // milliseconds per character

            function typeWriter() {
                if (i < textToType.length) {
                    if (textToType.substring(i, i+4) === '<br>') {
                        typewriterElement.innerHTML += '<br>';
                        i += 4;
                    } else {
                        typewriterElement.innerHTML += textToType.charAt(i);
                        i++;
                    }
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    setTimeout(typeWriter, typeSpeed);
                } else {
                    // Add a blinking cursor at the end
                    typewriterElement.innerHTML += '<span class="cursor">|</span>';

                    // Add a style for the cursor
                    const style = document.createElement('style');
                    style.textContent = `
                        .cursor {
                            animation: cursorBlink 1s infinite;
                            font-weight: bold;
                        }
                        @keyframes cursorBlink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);

                    // Remove cursor after 3 seconds
                    setTimeout(() => {
                        const cursor = typewriterElement.querySelector('.cursor');
                        if (cursor) {
                            cursor.remove();
                        }
                    }, 3000);
                }
            }

            setTimeout(typeWriter, 500); // Start typing after a small delay
        } else {
            // User messages appear immediately
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
                <span class="message-time">${timeString}</span>
            `;

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Add a "hacker" effect to the user message
            const userMessageContent = messageDiv.querySelector('.message-content');
            userMessageContent.style.opacity = '0';

            // Glitch effect
            let glitchCount = 0;
            const maxGlitches = 3;
            const glitchInterval = setInterval(() => {
                userMessageContent.style.transform = `translateX(${Math.random() * 4 - 2}px) translateY(${Math.random() * 4 - 2}px)`;
                userMessageContent.style.opacity = (glitchCount / maxGlitches).toString();

                glitchCount++;
                if (glitchCount > maxGlitches) {
                    clearInterval(glitchInterval);
                    userMessageContent.style.transform = 'none';
                    userMessageContent.style.opacity = '1';
                }
            }, 50);
        }
    }

    // Function to add a typing indicator
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="hacker-typing">
                    <span class="hacker-text">PROCESSING REQUEST</span>
                    <span class="hacker-cursor">_</span>
                </div>
            </div>
        `;

        // Add styles for the hacker typing indicator
        const style = document.createElement('style');
        style.textContent = `
            .hacker-typing {
                display: flex;
                align-items: center;
                font-family: 'Courier New', monospace;
            }
            .hacker-text {
                color: #0f0;
                text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
            }
            .hacker-cursor {
                color: #0f0;
                animation: blink 0.7s infinite;
                margin-left: 2px;
                font-weight: bold;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add a random character typing effect
        const hackerText = typingDiv.querySelector('.hacker-text');
        const originalText = hackerText.textContent;
        let randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";

        let charIndex = 0;
        const randomCharInterval = setInterval(() => {
            if (charIndex < originalText.length) {
                let randomText = originalText.substring(0, charIndex);
                for (let i = charIndex; i < originalText.length; i++) {
                    randomText += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                hackerText.textContent = randomText;
                charIndex++;
            } else {
                clearInterval(randomCharInterval);
                hackerText.textContent = originalText;
            }
        }, 50);

        return typingDiv;
    }

    // Function to remove typing indicator
    function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    // Function to process user input and generate response
    async function processInput(input) {
        const userText = input.trim();

        if (userText === '') return;

        // Add user message to chat
        addMessage(userText, true);

        // Excited animation
        robotElement.style.animation = 'float 0.5s ease-in-out 3';

        // Show excited speech bubble
        speechBubble.querySelector('span').textContent = "I got this!";
        speechBubble.style.animation = 'none';
        void speechBubble.offsetWidth; // Trigger reflow
        speechBubble.style.animation = 'fadeInOut 3s ease-in-out';

        // Check if API key is set
        if (!checkApiKey()) {
            return;
        }

        // Robot starts "thinking"
        robotElement.style.animation = 'float 3s ease-in-out infinite';

        // Make eyes pulse while thinking
        robotEyes.forEach(eye => {
            eye.style.animation = 'none';
            void eye.offsetWidth; // Trigger reflow
            eye.style.animation = 'blink 1.5s infinite';
            eye.style.boxShadow = '0 0 12px var(--robot-glow)';
        });

        // Make mouth smaller while thinking
        robotMouth.style.height = '3px';
        robotMouth.style.width = '10px';
        robotMouth.style.borderRadius = '50%';

        // Add typing indicator
        const typingIndicator = addTypingIndicator();

        try {
            // Get response from OpenRouter API
            const response = await window.OpenRouterAPI.sendMessage(userText);

            // Remove typing indicator
            removeTypingIndicator(typingIndicator);

            // Add bot response to chat
            addMessage(response);
        } catch (error) {
            console.error('Error getting response:', error);

            // Remove typing indicator
            removeTypingIndicator(typingIndicator);

            // Add error message to chat
            addMessage("I'm sorry, I encountered an error. Please try again or check your API key.", false);
        } finally {
            // Reset robot animations
            setTimeout(() => {
                robotElement.style.animation = 'float 3s ease-in-out infinite';

                // Reset eyes
                robotEyes.forEach(eye => {
                    eye.style.animation = 'blink 4s infinite';
                    eye.style.boxShadow = '';
                    if (eye.classList.contains('left')) {
                        eye.style.animationDelay = '0.5s';
                    }
                });

                // Reset mouth
                robotMouth.style.height = '';
                robotMouth.style.width = '';
                robotMouth.style.borderRadius = '';
                robotMouth.style.animation = 'smile 8s infinite';

                // Show happy speech bubble
                speechBubble.querySelector('span').textContent = "Hope that helps!";
                speechBubble.style.animation = 'none';
                void speechBubble.offsetWidth; // Trigger reflow
                speechBubble.style.animation = 'fadeInOut 4s ease-in-out';
            }, 500);
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', () => {
        const input = userInput.value;
        if (input.trim() !== '') {
            processInput(input);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = userInput.value;
            if (input.trim() !== '') {
                processInput(input);
                userInput.value = '';
            }
        }
    });

    // Suggested question buttons
    questionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            processInput(question);
        });
    });

    // Add API key button to the chat header
    const chatbotHeader = document.querySelector('.chatbot-header');
    const apiKeyButton = document.createElement('button');
    apiKeyButton.className = 'api-key-button';
    apiKeyButton.innerHTML = '<i class="bx bx-key"></i>';
    apiKeyButton.title = 'Set API Key';
    apiKeyButton.addEventListener('click', showApiKeyModal);
    chatbotHeader.appendChild(apiKeyButton);

    // Add styles for the API key button
    const style = document.createElement('style');
    style.textContent = `
        .api-key-button {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            transition: all 0.3s;
        }
        .api-key-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        .typing-dots span {
            width: 8px;
            height: 8px;
            background-color: var(--text-muted);
            border-radius: 50%;
            animation: typingAnimation 1.5s infinite ease-in-out;
        }
        .typing-dots span:nth-child(1) {
            animation-delay: 0s;
        }
        .typing-dots span:nth-child(2) {
            animation-delay: 0.3s;
        }
        .typing-dots span:nth-child(3) {
            animation-delay: 0.6s;
        }
        @keyframes typingAnimation {
            0%, 100% {
                transform: translateY(0);
                opacity: 0.5;
            }
            50% {
                transform: translateY(-5px);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Focus input on page load
    setTimeout(() => {
        userInput.focus();

        // Add welcome message
        addMessage("Welcome! I'm your AI-powered tourism assistant for Bhairahawa and Lumbini. I can provide information about local attractions, transportation, accommodation, and more. How can I help you today?", false);
    }, 1000);
});
