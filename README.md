# Study AI

Study AI is an AI-powered learning platform that transforms raw documents into structured learning assets — including quizzes, flashcards, summaries, and focused Q&A — enabling active learning instead of passive reading.

Unlike generic AI tools, all outputs in Study AI are strictly grounded in the uploaded document, ensuring accuracy, relevance, and explainability.

This project was built to explore production-grade AI integration with real-world usability.

**Frontend (Live):** https://study-ai-frontend-theta.vercel.app/login  
**Backend (API):** https://study-ai-backend.onrender.com  

The backend is hosted on Render’s free tier, so the server may take 30–60 seconds to wake up.  
If the app doesn’t load immediately, please wait a moment and refresh.

---

## Core Features

- **Document Upload (PDF)**  
  Secure file upload and processing pipeline

- **AI-Powered Learning Tools**
  - Auto-generated quizzes
  - Flashcards for active recall
  - Concise summaries
  - Concept explanations

- **Document-Aware Chat**
  - Answers questions using only relevant document context
  - Prevents generic or out-of-scope AI responses

- **Authentication**
  - JWT-based authentication with protected routes

- **User-Specific Data**
  - Documents, quizzes, and flashcards scoped per user

---

## Key Capabilities

- **Cloud-based document storage (ImageKit)**
  - Secure PDF uploads with external storage
  - Reduces backend load and improves scalability

- **PDF ingestion & processing**
  - Text extraction followed by intelligent chunking
  - Maintains semantic meaning across content

- **Document-grounded AI generation**
  - All quizzes, flashcards, summaries, and explanations are generated strictly from document content
  - Eliminates hallucinated responses

- **Context-aware Q&A**
  - Queries answered using relevance-filtered document chunks
  - Ensures accurate and source-aligned responses

---

## System Design Features

- **Layered architecture with clear separation of concerns**
  - Routes handle endpoints and middleware binding
  - Middleware manages authentication, validation, and errors
  - Controllers implement business logic and request handling
  - Models define MongoDB schemas and data access
  - Frontend services abstract API communication

- **Authentication & data isolation**
  - JWT-based authentication
  - User-scoped documents and learning artifacts

- **Persistent and reproducible state**
  - Generated learning artifacts are stored and reusable
  - Avoids redundant AI calls and improves performance

---

## Tech Stack

**Frontend**

- React
- Redux Toolkit
- Tailwind CSS

**Backend**

- Node.js
- Express.js
- MongoDB (Mongoose)

**Cloud & AI**

- ImageKit (file storage)
- Gemini API (AI content generation)
- Custom chunking and relevance filtering logic

**Engineering Practices**

- RESTful API design
- JWT authentication
- Modular architecture
- Dockerized backend
- CI/CD using GitHub Actions

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/sanskritiigarg/Notes-Drill.git
   cd Notes-Drill
   Install Dependencies

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

Run the application

# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
The app runs on:
Frontend → http://localhost:5173
Backend → http://localhost:8000
🔑 Environment Variables
Frontend
Variable	Description
VITE_BACKEND_URL	Backend API base URL
Backend
Variable	Description
NODE_ENV	Application environment
PORT	Server port
MONGO_URI	MongoDB connection string
JWT_SECRET	JWT signing key
JWT_EXPIRE	Token expiration
MAX_FILE_SIZE	Upload limit
KIT_ENDPOINT	ImageKit URL
KIT_PUBLIC_KEY	ImageKit public key
KIT_PRIVATE_KEY	ImageKit private key
GEMINI_API_KEY	Gemini API key
Project Structure
├── README.md
├── frontend
├── backend
└── package.json

# License

This project is licensed under the MIT License — you are free to use, modify, and distribute it with attribution.
