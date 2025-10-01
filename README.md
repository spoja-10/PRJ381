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
> **Project Code:** AI-HG  
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
