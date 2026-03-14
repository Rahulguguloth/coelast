# 🛡️ PhishSentinel - AI-Powered Multi-Threat Phishing Intelligence System

PhishSentinel is a comprehensive security tool designed to detect and analyze phishing threats across multiple vectors, including URLs, emails, and screenshots. It uses Machine Learning and OCR to provide a unified risk assessment.

## 🚀 Features

-   **🔍 URL Analysis**: Uses a Random Forest classifier to detect malicious patterns, entropy, and typosquatting.
-   **📧 Email Scanning**: Analyzes headers and body content for urgency, spoofing, and suspicious links.
-   **⏱️ OTP Velocity**: Tracks rapid OTP requests using Redis to mitigate brute-force and account takeover attempts.
-   **🖼️ Screenshot Validation**: Utilizes Tesseract OCR and Computer Vision to detect brand forgery and "visual phishing" in login pages.
-   **🚨 Real-time Alerts**: Integrates with Telegram to notify security teams of high-risk detections.

## 🛠️ Tech Stack

-   **Language**: Python 3.9+
-   **UI**: Streamlit
-   **ML**: Scikit-Learn (Random Forest)
-   **CV/OCR**: OpenCV, Pytesseract
-   **Backend**: Redis (Velocity tracking)

## 📋 Prerequisites

-   **Python**: Installed on your system.
-   **Tesseract OCR**: Required for screenshot scanning. 
    -   Download for Windows: [Tesseract-OCR](https://github.com/UB-Mannheim/tesseract/wiki)
-   **Redis**: (Optional) For live OTP tracking, otherwise uses a mock implementation.

## ⚙️ Setup

1.  **Clone the project** to your local machine.
2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure Environment**:
    Create/edit the `.env` file with your credentials:
    ```env
    TELEGRAM_BOT_TOKEN=your_token
    TELEGRAM_CHAT_ID=your_id
    TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
    ```

## 🏃 How to Run

Launch the interactive dashboard:
```bash
streamlit run app.py
```

Or run via CLI:
```bash
python main.py https://suspicious-link.com
```

## ⚠️ Disclaimer
This tool is for educational and research purposes only. Always use phishing detection systems as part of a multi-layered security strategy.
