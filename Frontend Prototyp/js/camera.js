const video = document.createElement('video');
let stream = null;

const canvas = document.getElementById('cameraFeed');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const cameraSelect = document.getElementById('cameraSelect');

// List cameras
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
    try {
        const constraints = deviceId
            ? { video: { deviceId: { exact: deviceId } } }
            : { video: true };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        await video.play();
        cameraStatus.textContent = 'Connected';
    } catch (err) {
        cameraStatus.textContent = 'Error';
        console.error('Camera error:', err);
    }
}

// Draw video frame to canvas
function drawFrame() {
    if (video.readyState === 4) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(drawFrame);
}

// Handle camera selection change
cameraSelect.addEventListener('change', () => {
    startCamera(cameraSelect.value);
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
    await getCameras();
    if (cameraSelect.options.length > 0) {
        startCamera(cameraSelect.value);
    } else {
        startCamera();
    }
    drawFrame();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});