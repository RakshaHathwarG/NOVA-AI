# 🤖 NOVA AI

**Institution:** Sai Vidya Institute of Technology (SVIT), Bengaluru, Karnataka.

**Project:** NOVA AI – AI Role-Based Virtual Assistant Platform

## 🚀 Project Overview

NOVA AI is a React single-page application with an Express API. It provides two authenticated AI assistant chats:

- <img src="https://raw.githubusercontent.com/RakshaHathwarG/NOVA-AI/main/src/assets/aria.png" width="35" height="35" alt="ARIA avatar" /> **ARIA – HR Assistant:** General HR and career guidance.
- <img src="https://raw.githubusercontent.com/RakshaHathwarG/NOVA-AI/main/src/assets/snow.png" width="35" height="35" alt="SNOW avatar" /> **SNOW – Customer Support Assistant:** Customer-support troubleshooting.
  
The backend uses MongoDB for accounts and saved records and Google Gemini for AI-generated replies.

The assistants provide general guidance. They are not connected to real employer HR systems, customer accounts, orders, billing, or ticketing systems.

## ✨ Implemented Features

- **🔐 User Authentication:** Email/password registration and login, bcrypt password hashing, JWT authentication, and protected routes.
- **💬 AI Chat:** Separate Gemini-powered conversations for ARIA and SNOW, with saved chat history.
- **📎 File Attachments:** Supports PNG, JPEG, WebP, and PDF files up to 4 MB for Gemini analysis.
- **▶️ Video References:** Optional YouTube Data API v3 integration for relevant video suggestions.
- **🗂️ Conversation Tools:** Account-specific chat history and manually maintained session briefs.
- **📝 Feedback:** Signed-in users can submit categorized feedback stored in MongoDB.
- **⚙️ Settings:** Profile display, logout, language, browser notifications, and voice preferences.
- **🎙️ Voice Support:** Browser speech recognition and text-to-speech where supported.
- **🎭 Animated Avatars:** ARIA and SNOW use animated vector artwork.

The language selector offers English, Hindi, Japanese, Korean, and Spanish. Speech and language features depend on browser and device support.

## 🛠️ Technology Stack

| Area                 | Technologies                                                             |
| -------------------- | ------------------------------------------------------------------------ |
| Frontend             | React, Vite, React Router DOM, Tailwind CSS, Framer Motion, Lucide React |
| Backend              | Node.js, Express, Mongoose, bcryptjs, jsonwebtoken                       |
| Database             | MongoDB                                                                  |
| AI Integration       | Google Gemini API                                                        |
| Optional Integration | YouTube Data API v3                                                      |

## 📁 Project Structure

```text
NOVA-AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## 📋 Prerequisites

- Node.js 18 or newer and npm.
- A reachable MongoDB database.
- A Gemini API key for AI-generated replies.
- A YouTube Data API v3 key (optional).
- A modern web browser.

## ⚙️ Installation and Setup

The frontend and backend must run in separate terminals.

### 1. Backend Setup

```powershell
cd backend
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

On macOS/Linux:

```sh
[ -f .env ] || cp .env.example .env
```

Configure `backend/.env` with your own values:

```dotenv
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your unique secret>
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=<your Gemini API key>
GEMINI_MODEL=gemini-3.1-flash-lite
YOUTUBE_API_KEY=<optional YouTube API key>
```

**Important:** Review `backend/.env.example` before copying it. Replace the MongoDB URI and JWT secret with your own values. Never reuse template values as credentials.

Start the backend:

```sh
npm run dev
```

Backend URL: `http://localhost:5000`

Health check: `http://localhost:5000/health`

### 2. Frontend Setup

Open a second terminal at the project root:

```powershell
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

On macOS/Linux:

```sh
[ -f .env ] || cp .env.example .env
```

The frontend uses `VITE_API_BASE_URL`, which defaults to:

`http://localhost:5000/api`

Open the URL printed by Vite, normally:

`http://localhost:5173`

### 📦 Available Frontend Scripts

```sh
npm run dev
npm run build
npm run preview
```

## 🧭 Application Routes

| Route                | Purpose                |
| -------------------- | ---------------------- |
| `/`                  | Landing page           |
| `/login`             | Login and registration |
| `/dashboard`         | Assistant dashboard    |
| `/roles`             | Assistant selection    |
| `/assistant/hr`      | ARIA chat              |
| `/assistant/support` | SNOW chat              |
| `/history`           | Saved conversations    |
| `/settings`          | User settings          |
| `/help`              | FAQs and feedback      |

## 🔌 Backend API

The API is mounted under `/api`. Protected routes require JWT authentication.

| Method | Endpoint             | Purpose                               |
| ------ | -------------------- | ------------------------------------- |
| GET    | `/health`            | Backend health check                  |
| POST   | `/api/register`      | User registration                     |
| POST   | `/api/login`         | User login                            |
| POST   | `/api/google`        | Optional Google ID-token verification |
| GET    | `/api/profile`       | User profile                          |
| POST   | `/api/chat/generate` | Generate and save AI replies          |
| POST   | `/api/chat`          | Save a chat record                    |
| GET    | `/api/chat-history`  | Retrieve chat history                 |
| GET    | `/api/session-brief` | Retrieve a session brief              |
| PUT    | `/api/session-brief` | Create or update a session brief      |
| DELETE | `/api/session-brief` | Delete a session brief                |
| POST   | `/api/feedback`      | Submit feedback                       |

## 🔐 Security and Data Handling

- Keep real credentials in local `.env` files. Never commit API keys, MongoDB credentials, or JWT secrets.
- Never expose backend credentials through frontend `VITE_` variables.
- Passwords are hashed using bcrypt.
- JWT authentication protects user-specific records and routes.
- Chat messages and attachment bytes are sent to Google Gemini when generating replies.
- Attachment bytes are not retained in MongoDB; attachment metadata is saved with the chat record.
- Avoid sharing sensitive or confidential information with the AI service.

## 🐛 Troubleshooting

- **Backend not starting:** Check MongoDB connection and required environment variables.
- **Login/API errors:** Confirm the backend is running and the frontend API URL is correct.
- **AI replies unavailable:** Check the Gemini API key, model configuration, network, and provider quota.
- **Video suggestions unavailable:** Check the optional YouTube API key.
- **Voice features unavailable:** Check browser permissions and speech support.

---

**🎓 Sai Vidya Institute of Technology (SVIT), Bengaluru**

*✨ NOVA AI – AI Role-Based Virtual Assistance Platform*
