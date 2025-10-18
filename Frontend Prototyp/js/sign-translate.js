    // DOM Elements
    
    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.style.display = 'none';
    document.body.appendChild(video);
    let stream = null;

    const canvas = document.getElementById('cameraFeed');
    const ctx = canvas.getContext('2d');
    const cameraStatus = document.getElementById('cameraStatus');
    const cameraSelect = document.getElementById('cameraSelect');    
    const startBtn = document.getElementById('start-btn');
    const gestureCards = document.querySelectorAll('.gesture-card');
    const statusIndicators = document.querySelectorAll('.status-indicator');
    const gestureText = document.querySelector('.gesture-text');
    const gestureConfidence = document.querySelector('.gesture-confidence');
    const translationText = document.querySelector('.translation-text');
    const loadCsvBtn = document.getElementById('load-csv-btn');
    const csvFile = document.getElementById('csvFile');
    const captionOutput = document.getElementById('captionDisplay');
    //speech recognition variables
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let speechRecognitionInstance = null;
    let isListeningToSpeech = false;
    let lastSpeechError = null;
    let userStoppedSpeech = false;
    

    // Translations mapping
    const translations = {
        'Hello': 'Hello, how are you today?',
        'Yes': 'Yes, I agree with that.',
        'Thank You': 'Thank you very much for your help.',
        'Help': 'I need some assistance, please help me.',
        'No': 'No, I don\'t think that\'s correct.',
        'Stop': 'Please stop what you\'re doing.'
    };
     // Gesture recognition variables
    let isRecognizing = false;
    let trainingData = [];
    let lastRecognizedGesture = null;
    let currentGestureConfidence = 0;
    const smoothingFactor = 0.5;
    const MaxDistance = 5; // Adjust based on needs
    
    let signStarted = false;
    let speechStarted = false;
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

// Camera and MediaPipe Logic
//MediaPipe Hands setup
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});
    hands.onResults((results) => {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }   
        const lastLandmarks = results.multiHandLandmarks[0];
        if (isRecognizing && trainingData.length > 0) {
            const result = recognizeGesture(lastLandmarks);
            if (result.confidence > 70) {
                gestureText.textContent = result.gesture || 'Unknown';
                gestureConfidence.textContent = `Confidence: ${result.confidence.toFixed(1)}%`;
                setCaption(`Sign: "${translations[result.gesture] || 'No translation available'}"`);
                
                gestureCards.forEach(card => {
                    card.style.background = 'rgba(255, 255, 255, 0.05)';
                    if (card.dataset.gesture === result.gesture) {
                        card.style.background = 'rgba(16, 185, 129, 0.15)';
                    }
                });
            } else {
                gestureText.textContent = 'No hand detected';
                gestureConfidence.textContent = 'Confidence: 0%';
                setCaption('');
                gestureCards.forEach(card => card.style.background = 'rgba(255, 255, 255, 0.05)');
            }
        }
    } else {
        if (isRecognizing) {
            gestureText.textContent = 'No hand detected';
            gestureConfidence.textContent = 'Confidence: 0%';
            setCaption('');
            gestureCards.forEach(card => card.style.background = 'rgba(255, 255, 255, 0.05)');
        }
    }
    ctx.restore();
});
async function processCameraFeed(){
    if (!video.paused && !video.ended) {
        await hands.send({image: video});
    }
    requestAnimationFrame(processCameraFeed);
}

//List cameras
async function getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    cameraSelect.innerHTML = '';
    videoDevices.forEach((device, i) => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${i + 1}`;
        cameraSelect.appendChild(option);
    });
}
// Start stream from selected camera
async function startCamera(deviceId) {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    try{
        const constraints = deviceId
            ? { video: { deviceId: { exact: deviceId } } }
            : { video: true };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            await video.play();
            cameraStatus.textContent = 'Connected';
            processCameraFeed();
        } catch (err) {
            cameraStatus.textContent = 'Error';
            console.error('Camera error:', err);
        }
}
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    return lines.map(line => {
        const values = line.split(',');
        const landmarks = [];
        for (let i = 0; i < 63; i++) {
            landmarks.push(parseFloat(values[i]));
        }
        const label = values[63];
        return { landmarks, label };
    });
} 
function calculateDistance(features1, features2) {
    let sum = 0;
    for (let i = 0; i < features1.length; i++) {
        sum += Math.pow(features1[i] - features2[i], 2);
    }
    return Math.sqrt(sum);
}
function recognizeGesture(landmarks) {
    const currentFeatures = [];
    landmarks.forEach(lm => {
        currentFeatures.push(lm.x, lm.y, lm.z);
    });

    let bestMatch = null;
    let bestDistance = Infinity;
    trainingData.forEach(item => {
        const distance = calculateDistance(currentFeatures, item.landmarks);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = item.label;
        }
    });
    const confidence = Math.max(0, Math.min(100, (1 - bestDistance / MaxDistance) * 100));

    // Smoothing
    if (lastRecognizedGesture === bestMatch) {
        currentGestureConfidence = currentGestureConfidence * smoothingFactor + confidence * (1 - smoothingFactor);
    } else {
        currentGestureConfidence = confidence;
    }
    lastRecognizedGesture = bestMatch;

    return {
        gesture: bestMatch,
        confidence: currentGestureConfidence,
        distance: bestDistance
    };
}

// Event Listeners and Initialization
window.addEventListener('DOMContentLoaded', async () => {
    await getCameras();
    if (cameraSelect.options.length > 0) {
        startCamera(cameraSelect.value);
        } else {
        startCamera();
    }
    drawFrame();
    // Handle camera selection change
    cameraSelect.addEventListener('change', () => {
    startCamera(cameraSelect.value);
    });
    // CSV loading
    loadCsvBtn.addEventListener('click', () => csvFile.click());
    csvFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                trainingData = parseCSV(csv);
                startBtn.disabled = false;
                alert(`Loaded ${trainingData.length} training samples`);
                captionOutput.textContent = `Training data loaded. Click 'Start Recognition' to begin.`;
            } catch (error) {
                alert('Error parsing CSV: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    });
    startBtn.addEventListener('click', () => {
    if (isRecognizing || isListeningToSpeech) {
        isRecognizing = false;
        signStarted = false;
        speechStarted = false;
        if (speechRecognitionInstance) {
            try {
                // Abort is more deterministic than stop for immediate user-initiated cancellation
                speechRecognitionInstance.abort();
            } catch (_) {}
            // Mark that this was an intentional stop to prevent auto-restart
            userStoppedSpeech = true;
            // Drop the old instance to avoid stale state on next start
            speechRecognitionInstance = null;
        }
        isListeningToSpeech = false;
        
        // Reset the button and main UI elements immediately
            startBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                Start Recognition
            `;
        startBtn.classList.remove('btn-secondary');
        startBtn.classList.add('btn-primary');
        gestureText.textContent = 'Awaiting Gesture...';
            setCaption('Recognition stopped. Click Start to resume.'); // Neutral stop message
        
        return; // Exit the function after stopping
    } 
    else {
        let startedFeatures = []; 
        // A. Start Sign Language Recognition (Requires training data)
        if (trainingData.length > 0) {
            isRecognizing = true;
            signStarted = true;
            startedFeatures.push("Sign Language");
            gestureText.textContent = 'Detecting...';
        }

        // B. Start Speech Recognition (Requires API support and user permission)
        if (SpeechRecognition) {
            // Recreate a fresh instance each time we start to avoid stale internal state
            initSpeechRecognition();
            try {
                // Defer start a bit more to avoid InvalidStateError in Chrome after recreation
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        try { speechRecognitionInstance && speechRecognitionInstance.start(); } catch (e) {
                            if (e.name !== 'InvalidStateError') { console.error('Error starting speech recognition:', e); }
                        }
                    });
                }, 200);
                // startedFeatures.push("Voice Captions");
                speechStarted = true;
            } catch (e) {
                // Catch error if the microphone is already in use or access is denied
                if (e.name !== 'InvalidStateError') {
                    console.error("Error starting speech recognition:", e);
                }
            }
        }
        
        // C. Update UI based on what was successfully started
        if (signStarted || speechStarted) {
            startBtn.innerHTML = `... Stop Recognition ...`; // SVG content
            startBtn.classList.remove('btn-primary');
            startBtn.classList.add('btn-secondary');

            // Provide immediate feedback to the user
            if (signStarted && speechStarted) {
                 setCaption('Voice Captions: Listening... (Sign Language active in panel)');                 // Voice Captions onstart will refine this to '...are active.'
            } else if (signStarted) {
                  setCaption('Sign Language Recognition active. Voice Captions failed/unavailable.');
            } else if (speechStarted) {
                 setCaption('Starting Voice Captions...');
                 // Voice Captions onstart will refine this to 'Listening... Speak now.'
            }
        } else {
            // Nothing started
            alert('Cannot start. Please load training data, or check browser microphone support/permission.');
            setCaption('Recognition failed to start.');
        }    }
});
    // Gesture card interactions
    gestureCards.forEach(card => {
        card.addEventListener('click', function() {
            const gesture = this.dataset.gesture;
            
            gestureText.textContent = gesture;
            gestureConfidence.textContent = `Confidence: ${Math.floor(Math.random() * 10) + 85}.${Math.floor(Math.random() * 10)}%`;
            setCaption(`"${translations[gesture]}"`);
            
            // Highlight selected card
            gestureCards.forEach(c => {
                c.style.background = 'rgba(255, 255, 255, 0.05)';
            });
            this.style.background = 'rgba(16, 185, 129, 0.15)';
        });
    });

    if (SpeechRecognition) {
        // Initialize once at load so we can detect support; we will recreate on start
        initSpeechRecognition();
    } else {
        // Fallback for unsupported browsers
        startBtn.disabled = true;
        startBtn.textContent = 'API Not Supported';
        setCaption('The Web Speech API is not supported by this browser. Please use Chrome, Edge, or a modern browser.');
    }
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
});

// Build a fresh SpeechRecognition instance and wire handlers
function initSpeechRecognition() {
    if (!SpeechRecognition) { return; }
    try {
        speechRecognitionInstance = new SpeechRecognition();
    } catch (e) {
        console.error('Failed to create SpeechRecognition:', e);
        speechRecognitionInstance = null;
        return;
    }

    speechRecognitionInstance.continuous = true;
    speechRecognitionInstance.interimResults = true;
    speechRecognitionInstance.lang = 'en-US';

    speechRecognitionInstance.onstart = () => {
        isListeningToSpeech = true;
        lastSpeechError = null;
        if (isRecognizing) {
            captionOutput.textContent = 'Voice Captions: Listening... Speak now.';
        } else {
            captionOutput.textContent = 'Listening... Speak now.';
        }
    };

    speechRecognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
            setCaption(finalTranscript + interimTranscript);
    };

    speechRecognitionInstance.onend = () => {
        isListeningToSpeech = false;
        // Prevent auto-restart if user explicitly stopped
        if (userStoppedSpeech) {
            userStoppedSpeech = false; // consume the flag
            speechStarted = false;
            return;
        }
        // If we didn't stop via button and still in active mode, try to restart
        if (speechStarted && !lastSpeechError) {
            // Auto-restart loop for continuous captions while active
            try {
                speechRecognitionInstance.start();
            setCaption(isRecognizing ? 
                    'Voice Captions: Listening... (Sign Language active)' :
                'Listening... Speak now.');
                isListeningToSpeech = true;
                return;
            } catch (e) {
                // Will often be InvalidStateError if already starting; ignore
                if (e.name !== 'InvalidStateError') {
                    console.warn('Speech restart failed:', e.message);
                }
            }
        }

        if (!isRecognizing && !speechStarted) {
        startBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            Start Recognition
        `;
        setCaption('Recognition stopped. Click Start to resume.');
            startBtn.classList.remove('btn-secondary');
            startBtn.classList.add('btn-primary');
        } else if (isRecognizing) {
        setCaption('Sign Language recognition is still active, but Voice Captions stopped.');
        }
    };

    speechRecognitionInstance.onerror = (event) => {
        lastSpeechError = event.error || 'unknown';
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
            setCaption('Error: Microphone access denied. Please allow permission in your browser settings.');
        } else if (event.error === 'no-speech' || event.error === 'audio-capture') {
            setCaption('No speech detected. Click Start and try again.');
        } else {
            setCaption("Voice captions ended");
        }
        try { speechRecognitionInstance.abort(); } catch (_) {}
        isListeningToSpeech = false;
        // Mark speech as not started so the next click builds a fresh instance
        speechStarted = false;
    };
}

window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});

// Draw video frame to canvas
function drawFrame() {
    if (video.readyState === 4) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(drawFrame);
}
let recognitionInterval;

// Always write captions to the dedicated span so the container DOM isn't replaced
function setCaption(text) {
    try {
        captionOutput.textContent = text || '';
    } catch (_) {
        // If the span was somehow removed, fall back to the container
        const fallback = document.getElementById('captionDisplay');
        if (fallback) { fallback.textContent = text || ''; }
    }
}

