
    // Floating particles animation
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = window.innerWidth < 768 ? 20 : 40;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            const opacity = Math.random() * 0.5 + 0.1;
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = opacity;
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
            
            // Add to container
            particlesContainer.appendChild(particle);
        }
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(10px, 10px); }
                50% { transform: translate(5px, -5px); }
                75% { transform: translate(-5px, 5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize particles
    createParticles();

    // DOM Elements
    const startBtn = document.getElementById('start-btn');
    const playBtn = document.getElementById('play-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.querySelector('.volume-value');
    const gestureCards = document.querySelectorAll('.gesture-card');
    const statusIndicators = document.querySelectorAll('.status-indicator');
    const gestureText = document.querySelector('.gesture-text');
    const gestureConfidence = document.querySelector('.gesture-confidence');
    const translationText = document.querySelector('.translation-text');

    // Translations mapping
    const translations = {
        'Hello': 'Hello, how are you today?',
        'Yes': 'Yes, I agree with that.',
        'Thank You': 'Thank you very much for your help.',
        'Help': 'I need some assistance, please help me.',
        'No': 'No, I don\'t think that\'s correct.',
        'Stop': 'Please stop what you\'re doing.'
    };

    // Gesture recognition simulation
    let isRecognizing = false;
    let recognitionInterval;

    startBtn.addEventListener('click', function() {
        isRecognizing = !isRecognizing;
        
        if (isRecognizing) {
            // Start recognition
            this.innerHTML = '<div class="loading"></div> Recognizing...';
            
            // Update status indicators
            statusIndicators.forEach(indicator => {
                indicator.style.background = 'var(--success)';
            });
            
            // Simulate gesture detection
            recognitionInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * gestureCards.length);
                const randomGesture = gestureCards[randomIndex].dataset.gesture;
                
                gestureText.textContent = randomGesture;
                gestureConfidence.textContent = `Confidence: ${Math.floor(Math.random() * 10) + 85}.${Math.floor(Math.random() * 10)}%`;
                translationText.textContent = `"${translations[randomGesture]}"`;
                
                // Highlight the detected gesture card
                gestureCards.forEach(card => {
                    card.style.background = 'rgba(255, 255, 255, 0.05)';
                    if (card.dataset.gesture === randomGesture) {
                        card.style.background = 'rgba(16, 185, 129, 0.15)';
                    }
                });
            }, 3000);
            
        } else {
            // Stop recognition
            this.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                Start Recognition
            `;
            
            clearInterval(recognitionInterval);
            
            // Reset status indicators
            statusIndicators.forEach(indicator => {
                indicator.style.background = 'var(--warning)';
            });
        }
    });

    // Gesture card interactions
    gestureCards.forEach(card => {
        card.addEventListener('click', function() {
            const gesture = this.dataset.gesture;
            
            gestureText.textContent = gesture;
            gestureConfidence.textContent = `Confidence: ${Math.floor(Math.random() * 10) + 85}.${Math.floor(Math.random() * 10)}%`;
            translationText.textContent = `"${translations[gesture]}"`;
            
            // Highlight selected card
            gestureCards.forEach(c => {
                c.style.background = 'rgba(255, 255, 255, 0.05)';
            });
            this.style.background = 'rgba(16, 185, 129, 0.15)';
        });
    });

    // Play button animation
    playBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        }, 100);
    });

    // Volume slider
    volumeSlider.addEventListener('input', function() {
        volumeValue.textContent = this.value + '%';
    });

    // Add subtle hover effect to all cards
    document.querySelectorAll('.card, .gesture-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('gesture-card') || 
                !card.style.background.includes('rgba(16, 185, 129')) {
                card.style.transform = '';
            }
        });
    });

