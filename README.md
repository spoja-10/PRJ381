# 🤖 AI-Based Hand Gesture Recognition for Text-to-Speech Communication  

![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)  
![OpenCV](https://img.shields.io/badge/OpenCV-4.9-green.svg)  
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-orange.svg)  
![PyTorch](https://img.shields.io/badge/PyTorch-2.2-red.svg)  
![License](https://img.shields.io/badge/license-Academic-lightgrey.svg)  
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)  

---

## 📌 Overview  

This project develops an **AI-driven system that translates hand gestures into spoken words** using **Machine Learning, OpenCV, and Text-to-Speech (TTS) technology**.  

The goal is to improve accessibility for **individuals with hearing and speech impairments** by enabling communication with non-sign-language users in real time.  

> **Programme:** PRJ381 – Project 381  
> **Module Level:** NQF 8 (BCom – Data Science/IT)  
> **Academic Year:** 2025  

---

## 🎯 Objectives  

- 🚀 Develop a **real-time hand gesture recognition** system.  
- 🔊 Integrate **Text-to-Speech (TTS)** for gesture-to-speech conversion.  
- 🧠 Apply **deep learning techniques** to improve classification accuracy.  
- 👥 Test the application with real users for **usability and effectiveness**.  

---

## 🛠️ Features  

- ✅ Real-time hand gesture detection (via **OpenCV + MediaPipe**)  
- ✅ Gesture classification using **CNN / transfer learning (TensorFlow / PyTorch)**  
- ✅ **Text-to-Speech integration** (gTTS, pyttsx3)  
- ✅ Python-based application with **GUI interface (Tkinter / Flask)**  
- ✅ Works across different **skin tones, hand sizes, and lighting conditions**  

---

## 📂 Repository Structure  

```bash
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
```

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/<your-username>/PRJ381-Hand-Gesture-Recognition.git
cd PRJ381-Hand-Gesture-Recognition
```

### 2️⃣ Create a virtual environment  
```bash
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

### 3️⃣ Install dependencies  
```bash
pip install -r requirements.txt
```

### 4️⃣ Run the application  
```bash
python src/app.py
```

---

## 📊 Methodology  

1. 📷 **Data Collection** – Capture gesture dataset with **OpenCV + MediaPipe**, label gestures (e.g., *Hello, Thank You, Help*).  
2. 🧑‍💻 **Model Training** – Train CNN / transfer learning models in TensorFlow/Keras or PyTorch. Evaluate accuracy, precision, recall, and F1-score.  
3. ✋ **Real-Time Recognition** – Implement gesture detection with **OpenCV + MediaPipe Hands**.  
4. 🔊 **Gesture-to-Speech Conversion** – Convert gestures → text → speech via **gTTS / pyttsx3**.  
5. 🧪 **Testing & Evaluation** – Conduct usability tests with speech-impaired users. Optimize for lighting, hand sizes, and skin tones.  

---

## 📈 Project Timeline (Milestones)  

- 📅 **Milestone 1 (Apr–May 2025):** Project Planning & Design  
- ⚙️ **Milestone 2 (Jul–Oct 2025):** Implementation & Testing  
- 🎤 **Expo Presentation (Oct 2025):** Final demo & evaluation  
- 📝 **Final Report (Oct 2025):** Submission of academic report  

---

## 🔧 Tools & Technologies  

- 🐍 **Python** (OpenCV, TensorFlow, PyTorch, MediaPipe)  
- 🔊 **gTTS / pyttsx3** (Text-to-Speech)  
- 🖥️ **Tkinter / Flask** (GUI development)  
- 📓 **Jupyter Notebook / Google Colab** (Model training & experiments)  

---

## 👥 Team & Collaboration  

- 🧑‍🏫 **Supervisors:** TBA  
- 👩‍💻 **Team Members:** PRJ381 Student Group (2025)  
- 💬 Collaboration via **MS Teams, Moodle, WhatsApp Group**  

---

## 🌍 Potential Partners  

- [DEAFinition NPC](https://www.deafinition.co.za/about-us/)  
- [SANDA – South African National Deaf Association](http://www.sanda.org.za/about.html)  

---

## 📚 References  

- [Google translates gestures to speech](https://tbtech.co/news/google-translates-gestures-to-speech-sign-language-ai/)  
- [TechVidvan – Hand Gesture Recognition](https://techvidvan.com/tutorials/hand-gesture-recognition-tensorflow-opencv/)  
- [UCT Gesture Recognition Project](https://projects.cs.uct.ac.za/honsproj/cgi-bin/view/2017/borysova_kooverjee_versfeld.zip/supporting/literature_review_shaheel.pdf)  
- [IJCAI 2023 Research Paper](https://www.ijcai.org/proceedings/2023/0710.pdf)  

---

## 📜 License  

This project is developed for **academic purposes (PRJ381, 2025)**.  
Usage beyond research and education requires permission.  

---

✨ *This repository forms part of the PRJ381 capstone project at Belgium Campus iTversity, focusing on accessibility through AI-driven hand gesture recognition.*  
