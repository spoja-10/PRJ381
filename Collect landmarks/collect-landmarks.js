// ...existing code...

// Wrap everything in DOMContentLoaded to ensure elements exist
document.addEventListener('DOMContentLoaded', () => {
    // All your variable declarations here
    const videoElement = document.getElementById('input_video');
    const canvasElement = document.getElementById('output_canvas');
    const canvasCtx = canvasElement.getContext('2d');
    const cameraSelect = document.getElementById('cameraSelect');
    const saveLandmarkBtn = document.getElementById('saveLandmarkBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const labelInput = document.getElementById('labelInput');
    const countSpan = document.getElementById('countSpan');
    const preview = document.getElementById('preview');

    let currentStream = null;
    let lastLandmarks = null;
    let collectedData = [];

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
        // Select the first camera by default
        if (videoDevices.length > 0) {
            cameraSelect.value = videoDevices[0].deviceId;
        }
    }

    async function startCamera(deviceId) {
        // Stop any existing camera stream
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        const constraints = { video: deviceId ? { deviceId: { exact: deviceId } } : true };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            currentStream = stream;
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                // Set canvas size to match video dimensions
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
            };
        } catch (err) {
            alert('Could not access the camera. Please allow camera access and reload the page.');
            console.error(err);
        }
    }

    cameraSelect.addEventListener('change', () => startCamera(cameraSelect.value));

    // Initialize cameras and start first available camera
    getCameras().then(() => {
        if (cameraSelect.options.length > 0) {
            startCamera(cameraSelect.value);
        } else {
            startCamera();
        }
    });

    // ...rest of your code (MediaPipe, event handlers, etc.)...
    // Copy everything from your original file below this line, but remove the duplicate variable declarations at the top.
    // ...existing code...
    const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });

    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
    });

    hands.onResults(results => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#22c55e', lineWidth: 2 });
                drawLandmarks(canvasCtx, landmarks, { color: '#ef4444', lineWidth: 1 });
            }
            lastLandmarks = results.multiHandLandmarks[0];
        } else {
            lastLandmarks = null;
        }
        canvasCtx.restore();
    });

    async function detectHands() {
        if (videoElement.readyState === 4) {
            await hands.send({ image: videoElement });
        }
        requestAnimationFrame(detectHands);
    }

    videoElement.onplay = detectHands;

    function updateCountAndPreview() {
        countSpan.textContent = String(collectedData.length);
        if (collectedData.length === 0) {
            preview.textContent = 'No samples yet. Captured rows will preview here.';
            return;
        }
        const last = collectedData[collectedData.length - 1];
        const label = last[last.length - 1];
        preview.textContent = `Last: ${label} | ${last.slice(0, 6).map(n => Number(n).toFixed(3)).join(', ')} ...`;
    }

    function saveCurrentFrame() {
        if (!lastLandmarks) {
            alert('No hand detected!');
            return;
        }
        const label = (labelInput.value || '').trim();
        if (!label) {
            alert('Please enter a gesture label first.');
            labelInput.focus();
            return;
        }
        const row = [];
        lastLandmarks.forEach(lm => {
            row.push(lm.x, lm.y, lm.z);
        });
        row.push(label);
        collectedData.push(row);
        updateCountAndPreview();
    }

    saveLandmarkBtn.addEventListener('click', saveCurrentFrame);

    downloadBtn.addEventListener('click', () => {
        if (collectedData.length === 0) {
            alert('No data to download!');
            return;
        }
        let csvContent = '';
        collectedData.forEach(row => {
            csvContent += row.join(',') + '\n';
        });
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hand_landmarks.csv';
        a.click();
        URL.revokeObjectURL(url);
    });

    clearBtn.addEventListener('click', () => {
        if (collectedData.length === 0) return;
        if (!confirm('Clear all captured rows for this session?')) return;
        collectedData = [];
        updateCountAndPreview();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            saveCurrentFrame();
        }
        if (e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            downloadBtn.click();
        }
    });
});

// ...existing code...