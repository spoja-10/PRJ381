
const videoElement = document.getElementById('input_video');        // Hidden video element for camera feed
const canvasElement = document.getElementById('output_canvas');     // Canvas for displaying hand landmarks
const canvasCtx = canvasElement.getContext('2d');                  // 2D context for drawing on canvas
const cameraSelect = document.getElementById('cameraSelect');       // Dropdown for camera selection
const saveLandmarkBtn = document.getElementById('saveLandmarkBtn'); // Button to save current gesture
const downloadBtn = document.getElementById('downloadBtn');         // Button to download CSV data
const clearBtn = document.getElementById('clearBtn');               // Button to clear collected data
const labelInput = document.getElementById('labelInput');           // Input field for gesture labels
const countSpan = document.getElementById('countSpan');             // Display for sample count
const preview = document.getElementById('preview');                 // Preview of last captured data


let currentStream = null;      // Current camera stream
let lastLandmarks = null;      // Most recent hand landmarks detected
let collectedData = [];        // Array to store all collected landmark data


/**
 
 * This function gets all video input devices and creates options for each
 */
async function getCameras() {
	// Get all media devices (cameras, microphones,those sorts of things)
	const devices = await navigator.mediaDevices.enumerateDevices();
	
	// Filter to only video input devices (cameras)
	const videoDevices = devices.filter(device => device.kind === 'videoinput');
	
	// Clear existing options
	cameraSelect.innerHTML = '';
	
	// Create option elements for each camera
	videoDevices.forEach((device, i) => {
		const option = document.createElement('option');
		option.value = device.deviceId;
		option.text = device.label || `Camera ${i + 1}`; // Use device label or fallback
		cameraSelect.appendChild(option);
	});
}

/**
 * Start camera stream with specified device ID
 * @param {string} deviceId - The device ID of the camera to use
 */
async function startCamera(deviceId) {
	// Stop any existing camera stream
	if (currentStream) {
		currentStream.getTracks().forEach(track => track.stop());
	}
	
	
	const constraints = { video: deviceId ? { deviceId: { exact: deviceId } } : true };
	
	// Get user media stream
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	currentStream = stream;
	videoElement.srcObject = stream;
	
	// Set up video element once metadata is loaded
	videoElement.onloadedmetadata = () => {
		videoElement.play();
		// Set canvas size to match video dimensions
		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;
	};
}


// Listen for camera selection changes
cameraSelect.addEventListener('change', () => startCamera(cameraSelect.value));

// Initialize cameras and start first available camera
getCameras().then(() => {
	if (cameraSelect.options.length > 0) {
		startCamera(cameraSelect.value); // Start selected camera
	} else {
		startCamera(); // Start any available camera if none selected
	}
});

// Initialize MediaPipe Hands with CDN file location
const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });

// Configure MediaPipe Hands settings
hands.setOptions({
	maxNumHands: 2,                    // Only detect one hand at a time
	modelComplexity: 1,                // Use full model for better accuracy
	minDetectionConfidence: 0.7,       // Minimum confidence for hand detection
	minTrackingConfidence: 0.7,        // Minimum confidence for hand tracking
});

/**
 * Handle MediaPipe Hands detection results
 * This function is called for each frame when hands are detected
 */
hands.onResults(results => {
	canvasCtx.save();
	
	// Clear canvas and draw current video frame
	canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
	
	// Check if hands were detected in this frame
	if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
		// Draw landmarks for each detected hand
		for (const landmarks of results.multiHandLandmarks) {
			// Draw connections between landmarks (bones)
			drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#22c55e', lineWidth: 2 });
			// Draw individual landmark points
			drawLandmarks(canvasCtx, landmarks, { color: '#ef4444', lineWidth: 1 });
		}
		// Store the first detected hand's landmarks
		lastLandmarks = results.multiHandLandmarks[0];
	} else {
		// No hands detected, clear landmarks
		lastLandmarks = null;
	}
	
	// Restore canvas state
	canvasCtx.restore();
});

/**
 * This function runs continuously to process video frames
 */
async function detectHands() {
	// Only process if video is ready
	if (videoElement.readyState === 4) {
		await hands.send({ image: videoElement });
	}
	// Schedule next frame for processing
	requestAnimationFrame(detectHands);
}

// Start hand detection when video starts playing
videoElement.onplay = detectHands;

function updateCountAndPreview() {
	countSpan.textContent = String(collectedData.length);
	
	// Handle empty data case
	if (collectedData.length === 0) {
		preview.textContent = 'No samples yet. Captured rows will preview here.';
		return;
	}
	
	// Get the last collected sample
	const last = collectedData[collectedData.length - 1];
	const label = last[last.length - 1]; // Last element is the label
	
	//label + first 6 landmark coordinates
	preview.textContent = `Last: ${label} | ${last.slice(0, 6).map(n => Number(n).toFixed(3)).join(', ')} ...`;
}

/**
 * Save the current hand landmarks as a training sample
 * Validates input and adds data to the collection
 */
function saveCurrentFrame() {
	// Check if hand is currently detected
	if (!lastLandmarks) {
		alert('No hand detected!');
		return;
	}
	
	// Get and validate the gesture label
	const label = (labelInput.value || '').trim();
	if (!label) {
		alert('Please enter a gesture label first.');
		labelInput.focus();
		return;
	}
	
	// Create data row: 63 landmark coordinates (x,y,z for 21 points , we might ADD more for better confidence later) + label
	const row = [];
	lastLandmarks.forEach(lm => { 
		row.push(lm.x, lm.y, lm.z); // Add x, y, z coordinates for each landmark
	});
	row.push(label); // Add the gesture label at the end
	
	// Add to collection and update display
	collectedData.push(row);
	updateCountAndPreview();
}

// Save landmark button click handler
saveLandmarkBtn.addEventListener('click', saveCurrentFrame);

// Download CSV button click handler
downloadBtn.addEventListener('click', () => {
	// Check if there's data to download
	if (collectedData.length === 0) {
		alert('No data to download!');
		return;
	}
	
	// Create CSV content
	let csvContent = '';
	collectedData.forEach(row => { 
		csvContent += row.join(',') + '\n'; // Join coordinates and label with commas
	});
	
	// Create and trigger download
	const blob = new Blob([csvContent], { type: 'text/csv' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'hand_landmarks.csv';
	a.click();
	
	// Clean up the created URL
	URL.revokeObjectURL(url);
});

// Clear data button click handler
clearBtn.addEventListener('click', () => {
	// Don't do anything if no data
	if (collectedData.length === 0) return;
	
	// Confirm before clearing
	if (!confirm('Clear all captured rows for this session?')) return;
	
	// Clear data and update display
	collectedData = [];
	updateCountAndPreview();
});


/**
 * Keyboard event handler for quick actions
 * S - Save current gesture (same as clicking save button , we might have to chnage this later :/)
 * D - Download CSV data (same as clicking download button)
 */
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


