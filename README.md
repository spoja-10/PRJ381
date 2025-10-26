GestureAI - Hand Gesture Recognition System

A web application that translates sign language to text and speech using AI-powered hand gesture recognition technology.

Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

Overview

GestureAI is a real-time hand gesture recognition system that enables users to communicate through sign language, which is then translated to text and speech. The system consists of:

- **Frontend**: HTML/CSS/JavaScript web interface with camera integration
- **Backend**: Node.js/Express.js server for user authentication and data management
- **AI Recognition**: MediaPipe-based hand gesture detection and classification

##  Features

-  **User Authentication**: Secure login and registration system
-  **Real-time Camera Feed**: Live video capture and processing
-  **AI Gesture Recognition**: Hand gesture detection using MediaPipe
-  **Text-to-Speech**: Convert recognized gestures to spoken words
-  **Speech-to-Text Captions**: Provides live, continuous transcription of spoken words using the Web Speech API.
-  **Confidence Scoring**: Real-time confidence metrics for gesture recognition
-  **Modern UI**: Responsive design with particle animations
-  **Cross-platform**: Works on desktop and mobile browsers

 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js)
- **Modern web browser** with camera access support
- **Webcam** or camera device

 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PRJ381-1
```

### 2. Install Backend Dependencies

Navigate to the backend server directory and install dependencies:

```bash
cd PRJ381/backend-server
npm install
```

This will install the required packages:
- `express` - Web framework for Node.js
- `cors` - Cross-Origin Resource Sharing middleware

### 3. Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list
```

## 🏃‍♂️ Running the Application

### Step 1: Start the Backend Server

In the `PRJ381/backend-server` directory, run:

```bash
node server.js
```

You should see output similar to:
```
Server running on http://localhost:3000
User data will be saved to C:\Users\Boodhoo\Documents\PRJ381-1\PRJ381\backend-server\user info.txt
```

### Step 2: Start the Frontend Server

Open a new terminal window and navigate to the frontend directory. You have several options:

#### Option A: Using Live Server (Recommended)
If you have VS Code with Live Server extension:
1. Open the `Frontend Prototyp/public` folder in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

#### Option B: Using Python HTTP Server
```bash
cd Frontend Prototyp/public
python -m http.server 5500
```

#### Option C: Using Node.js HTTP Server
```bash
cd Frontend Prototyp/public
npx http-server -p 5500
```

### Step 3: Access the Application

Open your web browser and navigate to:
- **Main Application**: `http://localhost:5500`
- **Login Page**: `http://localhost:5500/login.html`
- **Gesture Recognition**: `http://localhost:5500/sign-translate.html`

 Project Structure

```
PRJ381-1/
├── README.md                           # This file
├── PRJ381/
│   ├── backend-server/                 # Node.js backend
│   │   ├── server.js                   # Express server
│   │   ├── package.json                # Dependencies
│   │   ├── user info.txt               # User data storage
│   │   └── README_ME.txt               # Backend documentation
│   └── Frontend Prototyp/              # Frontend application
│       ├── public/                     # Web pages
│       │   ├── index.html              # Home page
│       │   ├── login.html              # Authentication page
│       │   └── sign-translate.html     # Main application
│       ├── css/                        # Stylesheets
│       │   ├── index.css
│       │   ├── login.css
│       │   └── sign-translate.css
│       └── js/                         # JavaScript files
│           ├── index.js
│           ├── login.js
│           └── sign-translate.js
└── Collect landmarks/                  # Data collection tools
    ├── collect-landmarks.html
    └── collect-landmarks.js
```

 API Endpoints

The backend server provides the following endpoints:

### Authentication Endpoints

- **POST** `/login` - User login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST** `/register` - User registration
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```
 Usage

### 1. User Registration/Login

1. Navigate to the login page
2. Use the demo credentials or create a new account:
   - **Demo User**: `demo@example.com` / `demo123`
   - **Admin User**: `admin@example.com` / `admin123`
3. Press `Ctrl+D` to auto-fill demo credentials

### 2. Gesture Recognition

1. After logging in, you'll be redirected to the gesture recognition page
2. Allow camera access when prompted
3. Click "Start Recognition" to begin gesture detection
4. Position your hands in front of the camera
5. The system will detect gestures and display:
   - Recognized gesture name
   - Confidence percentage
   - Text translation
   - Audio output (if enabled)

### 3. Supported Gestures

The system recognizes the following gestures:
- Hello
- Yes
- Thank You
- Help
- No
- Stop

 Configuration

### Backend Configuration

The backend server runs on port 3000 by default. To change this, modify the `port` variable in `server.js`:

```javascript
const port = 3000; // Change this to your preferred port
```

### CORS Configuration

The server is configured to allow requests from `http://127.0.0.1:5500`. If you're using a different frontend URL, update the CORS configuration in `server.js`:

```javascript
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Update this URL
  methods: ['GET', 'POST'],
}));
```

Troubleshooting

### Common Issues

#### 1. Camera Not Working
- **Problem**: Camera feed not displaying
- **Solution**: 
  - Ensure camera permissions are granted
  - Check if another application is using the camera
  - Try refreshing the page

#### 2. Backend Connection Failed
- **Problem**: Frontend cannot connect to backend
- **Solution**:
  - Verify backend server is running on port 3000
  - Check CORS configuration
  - Ensure both servers are running simultaneously

#### 3. Gesture Recognition Not Working
- **Problem**: Gestures not being detected
- **Solution**:
  - Ensure good lighting conditions
  - Keep hands clearly visible in camera frame
  - Check browser console for JavaScript errors

#### 4. Port Already in Use
- **Problem**: Error "EADDRINUSE: address already in use"
- **Solution**:
  - Kill the process using the port: `npx kill-port 3000`
  - Or change the port number in `server.js`

### Debug Mode

To enable debug logging, check the browser's developer console (F12) for detailed error messages and logs.

 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

 License

This project is developed for academic purposes (PRJ381, 2025). Usage beyond research and education requires permission.

 Support

For support and questions:
- Check the troubleshooting section above
- Review the browser console for error messages
- Ensure all prerequisites are installed correctly

---


**Note**: This application requires camera access and works best in well-lit environments. Make sure to grant camera permissions when prompted by your browser.
