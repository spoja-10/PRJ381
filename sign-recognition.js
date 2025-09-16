// Sign Recognition Module
// This module provides real-time sign language recognition using MediaPipe Hands
// and a simple nearest neighbor approach with CSV training data

class SignRecognition {
    constructor() {
        this.trainingData = [];
        this.isRecognizing = false;
        this.hands = null;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.onGestureDetected = null;
        this.recognitionInterval = null;
        this.lastLandmarks = null;
        
        // Recognition settings
        this.confidenceThreshold = 70; // Minimum confidence percentage
        this.maxDistance = 2.0; // Maximum distance for similarity calculation
        this.smoothingFactor = 0.8; // For smoothing recognition results
        this.lastRecognizedGesture = null;
        this.gestureConfidence = 0;
    }
    
    // Initialize MediaPipe Hands
    async initialize() {
        try {
            this.hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });
            
            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7
            });
            
            this.hands.onResults(this.onHandResults.bind(this));
            
            return true;
        } catch (error) {
            console.error('Error initializing MediaPipe Hands:', error);
            return false;
        }
    }
    
    // Load training data from CSV
    loadTrainingData(csvContent) {
        try {
            const lines = csvContent.trim().split('\n');
            this.trainingData = lines.map(line => {
                const values = line.split(',');
                const landmarks = [];
                for (let i = 0; i < 63; i++) {
                    landmarks.push(parseFloat(values[i]));
                }
                const label = values[63];
                return { landmarks, label };
            });
            
            console.log(`Loaded ${this.trainingData.length} training samples`);
            return this.trainingData.length > 0;
        } catch (error) {
            console.error('Error loading training data:', error);
            return false;
        }
    }
    
    // Load training data from file
    async loadTrainingDataFromFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const success = this.loadTrainingData(e.target.result);
                resolve(success);
            };
            reader.readAsText(file);
        });
    }
    
    // Start recognition
    async startRecognition(videoElement, canvasElement, onGestureCallback) {
        if (!this.hands) {
            console.error('MediaPipe Hands not initialized');
            return false;
        }
        
        if (this.trainingData.length === 0) {
            console.error('No training data loaded');
            return false;
        }
        
        this.video = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.onGestureDetected = onGestureCallback;
        this.isRecognizing = true;
        
        // Start hand detection loop
        this.detectHands();
        
        return true;
    }
    
    // Stop recognition
    stopRecognition() {
        this.isRecognizing = false;
        this.lastLandmarks = null;
        this.lastRecognizedGesture = null;
        this.gestureConfidence = 0;
        
        if (this.recognitionInterval) {
            clearInterval(this.recognitionInterval);
            this.recognitionInterval = null;
        }
    }
    
    // Hand detection loop
    async detectHands() {
        if (!this.isRecognizing) return;
        
        if (this.video.readyState === 4) {
            await this.hands.send({ image: this.video });
        }
        
        requestAnimationFrame(() => this.detectHands());
    }
    
    // Handle MediaPipe results
    onHandResults(results) {
        // Draw hand landmarks
        if (this.ctx && this.canvas) {
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);
            
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 2});
                    drawLandmarks(this.ctx, landmarks, {color: '#FF0000', lineWidth: 1});
                }
                this.lastLandmarks = results.multiHandLandmarks[0];
                
                // Perform recognition
                if (this.isRecognizing) {
                    this.recognizeGesture();
                }
            } else {
                this.lastLandmarks = null;
            }
            
            this.ctx.restore();
        }
    }
    
    // Recognize gesture from current landmarks
    recognizeGesture() {
        if (!this.lastLandmarks || this.trainingData.length === 0) {
            return;
        }
        
        // Convert landmarks to feature vector
        const currentFeatures = [];
        this.lastLandmarks.forEach(lm => {
            currentFeatures.push(lm.x, lm.y, lm.z);
        });
        
        // Find best match using nearest neighbor
        let bestMatch = null;
        let bestDistance = Infinity;
        
        this.trainingData.forEach(item => {
            const distance = this.calculateDistance(currentFeatures, item.landmarks);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = item.label;
            }
        });
        
        // Calculate confidence
        const confidence = Math.max(0, Math.min(100, (1 - bestDistance / this.maxDistance) * 100));
        
        // Apply smoothing
        if (this.lastRecognizedGesture === bestMatch) {
            this.gestureConfidence = this.gestureConfidence * this.smoothingFactor + confidence * (1 - this.smoothingFactor);
        } else {
            this.gestureConfidence = confidence;
        }
        
        this.lastRecognizedGesture = bestMatch;
        
        // Trigger callback if confidence is above threshold
        if (this.gestureConfidence >= this.confidenceThreshold && this.onGestureDetected) {
            this.onGestureDetected({
                gesture: bestMatch,
                confidence: this.gestureConfidence,
                distance: bestDistance
            });
        }
    }
    
    // Calculate Euclidean distance between two feature vectors
    calculateDistance(features1, features2) {
        let sum = 0;
        for (let i = 0; i < features1.length; i++) {
            sum += Math.pow(features1[i] - features2[i], 2);
        }
        return Math.sqrt(sum);
    }
    
    // Get current recognition status
    getStatus() {
        return {
            isRecognizing: this.isRecognizing,
            trainingDataCount: this.trainingData.length,
            lastGesture: this.lastRecognizedGesture,
            confidence: this.gestureConfidence,
            hasHand: this.lastLandmarks !== null
        };
    }
    
    // Get training data statistics
    getTrainingStats() {
        const gestureCounts = {};
        this.trainingData.forEach(item => {
            gestureCounts[item.label] = (gestureCounts[item.label] || 0) + 1;
        });
        
        return {
            totalSamples: this.trainingData.length,
            uniqueGestures: Object.keys(gestureCounts).length,
            gestureCounts: gestureCounts
        };
    }
    
    // Add new training sample
    addTrainingSample(landmarks, label) {
        const features = [];
        landmarks.forEach(lm => {
            features.push(lm.x, lm.y, lm.z);
        });
        
        this.trainingData.push({
            landmarks: features,
            label: label
        });
        
        return this.trainingData.length;
    }
    
    // Export training data as CSV
    exportTrainingData() {
        if (this.trainingData.length === 0) {
            return null;
        }
        
        let csvContent = '';
        this.trainingData.forEach(item => {
            csvContent += item.landmarks.join(',') + ',' + item.label + '\n';
        });
        
        return csvContent;
    }
    
    // Update recognition settings
    updateSettings(settings) {
        if (settings.confidenceThreshold !== undefined) {
            this.confidenceThreshold = settings.confidenceThreshold;
        }
        if (settings.maxDistance !== undefined) {
            this.maxDistance = settings.maxDistance;
        }
        if (settings.smoothingFactor !== undefined) {
            this.smoothingFactor = settings.smoothingFactor;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignRecognition;
} else if (typeof window !== 'undefined') {
    window.SignRecognition = SignRecognition;
}
