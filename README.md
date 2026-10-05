# 🏥 Medical Health Summariser

An AI-powered application that simplifies complex medical information by generating clear, concise, and easy-to-understand summaries from medical documents and health-related information.

## 📌 Overview

Medical reports often contain complex medical terminology that can be difficult for patients to understand. **Medical Health Summariser** aims to make this information more accessible by using AI to extract important information and present it in a simplified format.

The application helps users quickly understand key details from medical documents without having to interpret complicated medical language themselves.

> ⚠️ **Disclaimer:** This project is intended for educational and informational purposes only. It does not provide medical diagnosis or replace professional medical advice.

## ✨ Features

- 📄 Upload and process medical documents
- 🤖 AI-powered medical information summarisation
- 📝 Converts complex medical terminology into simpler language
- 🔍 Extracts important information from reports
- 📋 Provides concise and structured summaries
- 💡 Helps users better understand their medical documents
- 🖥️ Simple and user-friendly interface

## 🛠️ Tech Stack

**Frontend**
- React.js
- JavaScript
- Tailwind CSS

**Backend**
- Python
- FastAPI

**AI / NLP**
- Large Language Models (LLMs)
- Natural Language Processing
- LangChain

**Database / Storage**
- MongoDB

**Tools & Platforms**
- Git & GitHub
- VS Code

## 🏗️ Project Architecture

```text
User
  │
  ▼
Frontend
  │
  ▼
FastAPI Backend
  │
  ├── Document Processing
  │
  ├── Text Extraction
  │
  ▼
AI / LLM Processing
  │
  ▼
Medical Summary
  │
  ▼
Frontend
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Medical_Health_Summariser.git
cd Medical_Health_Summariser
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and add the required environment variables:

```env
OPENAI_API_KEY=your_api_key
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application should now be available at the local development URL shown in your terminal.

## 📂 Project Structure

```text
Medical_Health_Summariser/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
├── README.md
└── ...
```

## 🔮 Future Improvements

- Support for additional medical document formats
- Improved medical terminology explanation
- User authentication and profile management
- Medical history tracking
- Downloadable summaries
- Multi-language support
- Improved AI accuracy and response validation
- Integration with healthcare APIs
- Voice-based interaction

## 🔐 Privacy & Security

Medical information is highly sensitive. The project should be used with appropriate privacy and security measures when handling real patient information.

Do not upload real patient medical records, API keys, passwords, or other sensitive information to GitHub.

## 👨‍💻 Author

**Ayushman Behera**

- GitHub: https://github.com/Ayush31104
- LinkedIn: https://www.linkedin.com/in/ayushman-behera-44664228/

## 📄 License

This project is developed for educational and research purposes.
