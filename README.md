# MediClarity 🩺

> AI-powered Medical Health Summariser

MediClarity is a full-stack healthcare application for organizing
patient information, uploading medical reports, extracting report
content, and generating structured AI-powered summaries.

## ✨ Features

-   User registration and login
-   JWT-based authentication
-   Password hashing with bcryptjs
-   Patient management: add, view, search, edit and delete
-   Medical report upload
-   PDF and TXT support
-   10 MB upload limit
-   Medical record type selection
-   Local PDF text extraction
-   Gemini-based fallback processing for scanned or poor-quality PDFs
-   Automatic AI summarisation after report upload
-   Manual/regenerated AI summaries
-   Structured summary sections:
    -   Patient Overview
    -   Key Findings
    -   Diagnoses / Conditions
    -   Medications
    -   Medical History
    -   Tests / Investigations
    -   Follow-up Information
    -   Important Notes
-   Dashboard statistics
-   Recent medical reports
-   Report viewing and deletion
-   Responsive React/Tailwind interface

## 🛠️ Technology Stack

### Frontend

-   React
-   Vite
-   React Router
-   Axios
-   Tailwind CSS
-   JavaScript / JSX

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   Multer
-   PDF parsing
-   REST API
-   CORS
-   dotenv

### Authentication

-   JSON Web Tokens (JWT)
-   bcryptjs

### AI

-   Google Gemini API
-   Structured AI responses
-   Medical document analysis
-   PDF fallback processing

## 🏗️ Architecture

``` text
React + Vite Frontend
        |
        | REST API / Axios
        v
Express + Node.js Backend
        |
        +-------------------+
        |                   |
        v                   v
     MongoDB             Gemini AI
        |
        v
 Patient & Medical
     Records
```

## 🔄 Medical Report Workflow

``` text
Select Patient
      ↓
Upload PDF / TXT
      ↓
Validate File
      ↓
Extract Text
      ↓
Check Extraction Quality
      ↓
Gemini Fallback if Required
      ↓
Save Medical Record
      ↓
Generate AI Summary
      ↓
Display Structured Summary
```

## 📁 Project Structure

``` text
MediClarity/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── navbar.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Patients.jsx
│       │   ├── AddPatients.jsx
│       │   ├── EditPatient.jsx
│       │   ├── PatientDetails.jsx
│       │   ├── UploadReport.jsx
│       │   ├── UploadMedicalReport.jsx
│       │   ├── Login.jsx
│       │   └── Signup.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── patientController.js
│   │   │   └── medicalRecordController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Patient.js
│   │   │   └── MedicalRecord.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   └── medicalRecordRoutes.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   └── textExtractionService.js
│   │   └── server.js
│   └── uploads/
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd MediClarity
```

### 2. Install frontend dependencies

``` bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

``` bash
cd server
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the backend directory:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_long_random_jwt_secret
```

Never commit `.env` to GitHub.

Recommended `.gitignore` entries:

``` gitignore
.env
node_modules/
uploads/
```

## ▶️ Run Locally

### Backend

From `server/`:

``` bash
npm run dev
```

Backend:

``` text
http://localhost:5000
```

### Frontend

From `client/`:

``` bash
npm run dev
```

Vite will display the local frontend URL, normally:

``` text
http://localhost:5173
```

## 🔌 API Endpoints

### Authentication

``` text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Patients

``` text
POST   /api/patients
GET    /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Medical Records

``` text
POST   /api/medical-records/upload
GET    /api/medical-records/patient/:patientId
GET    /api/medical-records/:id/file
POST   /api/medical-records/:id/summarize
DELETE /api/medical-records/:id
```

### Health Check

``` text
GET /api/health
```

## 🤖 AI Summary Format

The AI service produces structured information similar to:

``` json
{
  "patientOverview": "...",
  "keyFindings": [],
  "diagnoses": [],
  "medications": [],
  "medicalHistory": [],
  "tests": [
    {
      "name": "...",
      "result": "...",
      "unit": "...",
      "referenceRange": "..."
    }
  ],
  "followUp": [],
  "importantNotes": []
}
```

The summarisation workflow is designed to extract information from the
supplied report rather than intentionally invent medical facts.

## 🔒 Security & Privacy

Current security-related features include:

-   Password hashing
-   JWT authentication
-   Environment variables for secrets
-   File type validation
-   File size limits
-   Backend validation
-   Authentication middleware
-   CORS configuration

MediClarity is currently a project prototype. A production deployment
handling real medical information would require additional privacy,
access-control, encryption, auditing, compliance, secure storage, and
infrastructure protections.

## 🚀 Future Enhancements

-   User-specific patient ownership
-   Stronger access-control rules
-   Profile management and profile image upload
-   Advanced report search
-   Report history and versioning
-   Exportable AI summaries
-   Cloud file storage
-   Audit logging
-   Production-grade security
-   CI/CD and production deployment improvements

## 🎯 Project Objective

MediClarity demonstrates how a modern full-stack application and
generative AI can be combined to make medical documents easier to
organize and review.

The project focuses on:

-   Patient record management
-   Medical document processing
-   Structured information extraction
-   AI-assisted summarisation
-   A clean healthcare dashboard
-   Practical full-stack AI integration

## 👨‍💻 Author

**Ayushman Behera**

B.Tech Computer Science

**Project:** MediClarity --- Medical Health Summariser

## ⚕️ Disclaimer

MediClarity is an educational/project prototype.

AI-generated summaries may contain errors and must be checked against
the original medical document and, where appropriate, reviewed by a
qualified healthcare professional.

MediClarity does not replace professional medical diagnosis, treatment,
or clinical judgement.

------------------------------------------------------------------------

⭐ If you find the project useful, consider starring the repository.
