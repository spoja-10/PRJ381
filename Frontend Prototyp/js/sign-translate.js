
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
    const playBtn = document.getElementById('play-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.querySelector('.volume-value');
    const gestureCards = document.querySelectorAll('.gesture-card');
    const statusIndicators = document.querySelectorAll('.status-indicator');
    const gestureText = document.querySelector('.gesture-text');
    const gestureConfidence = document.querySelector('.gesture-confidence');
    const translationText = document.querySelector('.translation-text');
    const loadCsvBtn = document.getElementById('load-csv-btn');
    const csvFile = document.getElementById('csv-file');

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
    let gestureConfidenceValue = 0;
    const smoothingFactor = 0.5;
    const MaxDistance = 5; // Adjust based on needs
   
   
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
                gestureConfidenceElem.textContent = `Confidence: ${result.confidence.toFixed(1)}%`;
                translationText.textContent = `"${translations[result.gesture] || 'No translation available'}"`;
                
                gestureCards.forEach(card => {
                    card.style.background = 'rgba(255, 255, 255, 0.05)';
                    if (card.dataset.gesture === result.gesture) {
                        card.style.background = 'rgba(16, 185, 129, 0.15)';
                    }   
                });
            } else {
                gestureText.textContent = 'No hand detected';
                gestureConfidenceElem.textContent = 'Confidence: 0%';
                translationText.textContent = '';
                gestureCards.forEach(card => card.style.background = 'rgba(255, 255, 255, 0.05)');
            }
        }
    } else {
        if (isRecognizing) {
            gestureText.textContent = 'No hand detected';
            gestureConfidenceElem.textContent = 'Confidence: 0%';
            translationText.textContent = '';
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
    const confidence = Math.max(0, Math.min(100, (1 - bestDistance / maxDistance) * 100));

    // Smoothing
    if (lastRecognizedGesture === bestMatch) {
        gestureConfidence = gestureConfidence * smoothingFactor + confidence * (1 - smoothingFactor);
    } else {
        gestureConfidence = confidence;
    }
    lastRecognizedGesture = bestMatch;

    return {
        gesture: bestMatch,
        confidence: gestureConfidence,
        distance: bestDistance
    };
}

// Event Listeners and Initialization
// Handle camera selection change
cameraSelect.addEventListener('change', () => {
    startCamera(cameraSelect.value);
});

window.addEventListener('DOMContentLoaded', async () => {
    await getCameras();
    if (cameraSelect.options.length > 0) {
        startCamera(cameraSelect.value);
    } else {
        startCamera();
    }
    drawFrame();
});

window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
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
            } catch (error) {
                alert('Error parsing CSV: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
});
startBtn.addEventListener('click', () => {
    if (trainingData.length === 0) {
        alert('Please load training data first!');
        return;
    }
    isRecognizing = !isRecognizing;
    if (isRecognizing) {
        startBtn.textContent = 'Stop Recognition';
    } else {
        startBtn.textContent = 'Start Recognition';
        gestureText.textContent = '—';
        gestureConfidenceElem.textContent = 'Confidence: 0%';
    }
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

// Draw video frame to canvas
function drawFrame() {
    if (video.readyState === 4) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(drawFrame);
}
//============================================================================================================================================

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
    // Recognition logic adapted from live_recognition.html




// 


// // Hook into MediaPipe Hands results (from camera.js)
// window.handleHandsResults = function(results) {
//     if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//         lastLandmarks = results.multiHandLandmarks[0];
//         if (isRecognizing && trainingData.length > 0) {
//             const result = recognizeGesture(lastLandmarks);
//             gestureText.textContent = result.gesture || 'Unknown';
//             gestureConfidenceElem.textContent = `Confidence: ${result.confidence.toFixed(1)}%`;
//         }
//     } else {
//         lastLandmarks = null;
//         if (isRecognizing) {
//             gestureText.textContent = 'No hand detected';
//             gestureConfidenceElem.textContent = 'Confidence: 0%';
//         }
//     }
// };

// // Start/stop recognition

