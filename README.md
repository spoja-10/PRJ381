#🤖 AI-Based Hand Gesture Recognition for Text-to-Speech Communication

📌 Overview

This project develops an AI-driven system that translates hand gestures into spoken words using Machine Learning, OpenCV, and Text-to-Speech (TTS) technology.

The goal is to improve accessibility for individuals with hearing and speech impairments by enabling communication with non-sign-language users in real time.

Programme: PRJ381 – Project 381
Module Level: NQF 8 (BCom – Data Science/IT)
Academic Year: 2025

#🎯 Objectives

🚀 Develop a real-time hand gesture recognition system.

🔊 Integrate Text-to-Speech (TTS) for gesture-to-speech conversion.

🧠 Apply deep learning techniques to improve classification accuracy.

👥 Test the application with real users for usability and effectiveness.

#🛠️ Features

✅ Real-time hand gesture detection (via OpenCV + MediaPipe)

✅ Gesture classification using CNN / transfer learning (TensorFlow / PyTorch)

✅ Text-to-Speech integration (gTTS, pyttsx3)

✅ Python-based application with GUI interface (Tkinter / Flask)

✅ Works across different skin tones, hand sizes, and lighting conditions

#📂 Repository Structure
PRJ381-Sim/
│── data/                # Gesture datasets (raw & preprocessed)
│── models/              # Trained CNN / transfer learning models
│── notebooks/           # Jupyter/Colab notebooks for training & testing
│── src/                 # Source code (Python scripts)
│   ├── hand_tracking.py
│   ├── gesture_classification.py
│   ├── tts_integration.py
│   └── app.py           # Main application (GUI + real-time recognition)
│── docs/                # Documentation, study guide & reports
│── results/             # Test results, accuracy metrics, confusion matrices
│── README.md            # Project overview (this file)
│── requirements.txt     # Python dependencies
└── LICENSE              # License file

#⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/<your-username>/PRJ381-Hand-Gesture-Recognition.git
cd PRJ381-Hand-Gesture-Recognition

2️⃣ Create a virtual environment
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Run the application
python src/app.py

#📊 Methodology

📷 Data Collection – Capture gesture dataset with OpenCV + MediaPipe, label gestures (e.g., Hello, Thank You, Help).

🧑‍💻 Model Training – Train CNN / transfer learning models in TensorFlow/Keras or PyTorch. Evaluate accuracy, precision, recall, and F1-score.

✋ Real-Time Recognition – Implement gesture detection with OpenCV + MediaPipe Hands.

🔊 Gesture-to-Speech Conversion – Convert gestures → text → speech via gTTS / pyttsx3.

🧪 Testing & Evaluation – Conduct usability tests with speech-impaired users. Optimize for lighting, hand sizes, and skin tones.

📈 Project Timeline (Milestones)

📅 Milestone 1 (Apr–May 2025): Project Planning & Design

⚙️ Milestone 2 (Jul–Oct 2025): Implementation & Testing

🎤 Expo Presentation (Oct 2025): Final demo & evaluation

📝 Final Report (Oct 2025): Submission of academic report

#🔧 Tools & Technologies

🐍 Python (OpenCV, TensorFlow, PyTorch, MediaPipe)

🔊 gTTS / pyttsx3 (Text-to-Speech)

🖥️ Tkinter / Flask (GUI development)

📓 Jupyter Notebook / Google Colab (Model training & experiments)

👥 Team & Collaboration

🧑‍🏫 Supervisors: TBA

👩‍💻 Team Members: PRJ381 Student Group (2025)

💬 Collaboration via MS Teams, Moodle, Email

🌍 Potential Partners

DEAFinition NPC

SANDA – South African National Deaf Association

#📚 References

Google translates gestures to speech

TechVidvan – Hand Gesture Recognition

UCT Gesture Recognition Project

IJCAI 2023 Research Paper

#📜 License

This project is developed for academic purposes (PRJ381, 2025).
Usage beyond research and education requires permission.

✨ This repository forms part of the PRJ381 capstone project at Belgium Campus iTversity, focusing on accessibility through AI-driven hand gesture recognition.
