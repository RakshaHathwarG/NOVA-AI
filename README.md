# NOVA AI
**Institution:** Sai Vidya Institute of Technology (SVIT), Bengaluru, Karnataka.

**Project:** NOVA AI – Role-Based Virtual Assistant Platform

NOVA AI is a React single-page application with an Express API. The current UI provides two authenticated assistant chats: **ARIA** for general HR and career guidance, and **SNOW** for customer-support troubleshooting. The backend uses MongoDB for accounts and saved records and can call Google Gemini for replies.

The assistants provide general guidance. They are not connected to an employer's HR systems, customer accounts, orders, billing, or ticketing systems.

## Implemented features

- **Accounts:** email/password registration and login, bcrypt password hashing, JWT authentication, a protected profile endpoint, and protected application routes.
- **ARIA and SNOW chat:** separate Gemini instructions for HR/career guidance and customer support. Chat history is saved per authenticated user. If Gemini is not configured or cannot respond, the API reports an error; it does not substitute a local AI reply.
- **Attachments:** PNG, JPEG, WebP, and PDF files up to 4 MB. The backend validates the declared type and file signature, sends file bytes to Gemini for analysis, and saves attachment metadata with the chat record rather than the bytes.
- **Optional video references:** when the user asks for a video or Gemini marks one as useful, the backend can search YouTube Data API v3. A relevant result may be attached to the saved reply. Missing configuration, provider errors, or no relevant result do not prevent the text reply.
- **Conversation tools:** account-scoped chat history and manually maintained session briefs for HR and Customer Support conversations. Briefs contain a goal, important points, follow-ups, notes, and a status; they are not generated automatically.
- **Feedback:** signed-in users can save a categorized feedback message. It is stored in MongoDB; no administrator inbox or review notification is configured.
- **Settings:** profile display and logout, browser notifications, a default language, voice-response toggle, and speech-rate preference. Preferences are stored in the current browser.
- **Voice and avatars:** browser speech recognition for input where supported, and device/browser text-to-speech for replies. The active avatars are animated vector artwork with presentation states; they are not live video or a 3D scene.

The language selector offers English, Hindi, Japanese, Korean, and Spanish. Automatic language detection is heuristic; replies also depend on Gemini and the selected language instruction. Browser speech support and available voices vary by device.

## Technology

Versions below are the ranges declared in the package manifests:

| Area | Packages |
|---|---|
| Frontend | React `^18.3.1`, Vite `^5.4.8`, React Router DOM `^6.26.2`, Tailwind CSS `^3.4.13`, Framer Motion `^11.11.9`, Lucide React `^0.451.0` |
| Backend | Express `^4.21.2`, Mongoose `^8.9.0`, bcryptjs `^2.4.3`, jsonwebtoken `^9.0.1`, Google Auth Library `^11.3.0`, dotenv `^16.4.2` |
| Services | MongoDB, Google Gemini API, optional YouTube Data API v3 |

Three.js and React Three Fiber packages are declared frontend dependencies, but the active `src` implementation does not import them. The current chat avatar is rendered with SVG and Framer Motion.

## Project structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/          MongoDB connection
│   │   ├── controllers/     Authentication, chat, feedback, session briefs
│   │   ├── middleware/      JWT authentication
│   │   ├── models/          User, Chat, Feedback, SessionBrief
│   │   ├── routes/          Express API routes
│   │   ├── services/        Gemini and YouTube integrations
│   │   └── server.js        Active backend entry point
│   ├── .env.example
│   └── package.json
├── src/
│   ├── assets/              Avatar and visual assets
│   ├── components/          Chat, avatar, dashboard, layout, and UI
│   ├── context/             Authentication state
│   ├── data/                Assistant personas
│   ├── hooks/                Avatar and browser speech hooks
│   ├── layouts/
│   ├── pages/               Application route views
│   ├── services/             Frontend API client
│   ├── utils/                Preferences and helper modules
│   ├── App.jsx               Frontend routes
│   └── main.jsx              React entry point
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

The configured backend entry point is `backend/src/server.js`. The root `server.js` is not selected by either package's run scripts.

## Prerequisites

- Node.js 18 or newer and npm. The backend uses Node's built-in `fetch`; neither package manifest pins a Node engine version.
- A reachable MongoDB database. The backend does not start its API listener if MongoDB is missing or cannot connect; the included fallback-store module is not wired into the active API.
- A Gemini API key for generated assistant replies.
- A YouTube Data API v3 key only if video search is wanted.
- A browser with JavaScript enabled. Speech input and output are optional browser capabilities.

## Installation and environment

Run the frontend and backend in separate terminals. Commands below assume the repository root as the starting directory.

### Backend

```powershell
cd backend
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

On macOS or Linux, use `[ -f .env ] || cp .env.example .env` instead of the PowerShell copy command. Before starting the server, edit `backend/.env` and set your own values:

```dotenv
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long, unique random secret>
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=<your Gemini API key>
GEMINI_MODEL=gemini-3.1-flash-lite
YOUTUBE_API_KEY=<optional YouTube Data API v3 key>
```

| Variable | Requirement and behavior |
|---|---|
| `PORT` | Optional; defaults to `5000`. |
| `MONGO_URI` | Required. The server exits without a usable MongoDB connection. |
| `JWT_SECRET` | Required. The server exits if it is missing; use a strong, unique value. |
| `JWT_EXPIRES_IN` | Optional; token lifetime defaults to `7d`. |
| `GEMINI_API_KEY` | Required for generated chat replies. The backend can start without it, but generation returns a configuration error. |
| `GEMINI_MODEL` | Optional; defaults to `gemini-3.1-flash-lite`. |
| `YOUTUBE_API_KEY` | Optional. Without it, video search is unavailable while text chat can still work. |
| `GOOGLE_CLIENT_ID` | Optional and not listed in `.env.example`. Set it in `backend/.env` only to enable the backend Google ID-token endpoint; the current login page has no Google sign-in control. |

**Review `backend/.env.example` before copying it:** its MongoDB URI contains populated-looking Atlas account/host details that I cannot verify are dummy values, and its JWT value is only a placeholder. Replace the entire `MONGO_URI` and `JWT_SECRET` values; do not reuse the template values as credentials.

Start the backend from `backend/`:

```sh
npm run dev
```

For the non-watch start command, use `npm start`. The backend listens on `http://localhost:5000` by default. Its public health endpoint is `http://localhost:5000/health`.

### Frontend

In a second terminal opened at the repository root:

```powershell
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

On macOS or Linux, use `[ -f .env ] || cp .env.example .env`. The frontend reads `VITE_API_BASE_URL`; it defaults to `http://localhost:5000/api`, so a root `.env` is optional for the local default. Restart Vite after changing frontend environment variables. **Never put backend credentials in a `VITE_` variable**: Vite exposes those values to browser code.

Open the URL printed by Vite (normally `http://localhost:5173`).

### Frontend scripts

Run these from the repository root:

```sh
npm run dev
npm run build
npm run preview
```

`npm run build` creates the frontend production output in `dist/`; `npm run preview` serves that build locally. The package also defines `npm run lint`, but ESLint is not declared as a dependency, so that command is not available from a clean install. No test script is defined in either package manifest.

## Application routes

| Path | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Email/password sign-in and registration |
| `/dashboard` | Authenticated | Assistant overview and navigation |
| `/roles` | Authenticated | Choose ARIA or SNOW |
| `/assistant/hr` | Authenticated | ARIA chat |
| `/assistant/support` | Authenticated | SNOW chat |
| `/history` | Authenticated | Saved conversations for the signed-in user |
| `/settings` | Authenticated | Account display, voice, language, and notification settings |
| `/help` | Authenticated | FAQs and feedback form |
| `*` | Public | Not-found page |

## Backend API

The API is mounted under `/api`, except `GET /health`. Protected routes require `Authorization: Bearer <JWT>`.

| Method and path | Access | Purpose |
|---|---|---|
| `GET /health` | Public | Backend health response |
| `POST /api/register` | Public | Register with name, email, and password |
| `POST /api/login` | Public | Email/password login |
| `POST /api/google` | Public, optional | Verify a Google ID token when `GOOGLE_CLIENT_ID` is configured |
| `GET /api/profile` | Protected | Return the authenticated user's profile |
| `POST /api/chat/generate` | Protected | Generate and save a user turn and Gemini reply; may attach a video reference |
| `POST /api/chat` | Protected | Save a chat record |
| `GET /api/chat-history` | Protected | Read the authenticated user's history; accepts an optional `role` query |
| `GET /api/chat-history/:userId` | Protected alias | Same handler; results are still scoped to the JWT user |
| `GET /api/session-brief` | Protected | Read a brief by `role` and `conversationId` query parameters |
| `PUT /api/session-brief` | Protected | Create or update a brief |
| `DELETE /api/session-brief` | Protected | Delete a brief |
| `POST /api/feedback` | Protected | Save categorized feedback |

The generation endpoint accepts `HR`, `Customer Support`, or `General` as the role. It requires a conversation ID and UUID request ID; text is limited to 4,000 characters and the optional language field to 40 characters. Attachments must be PNG, JPEG, WebP, or PDF and no larger than 4 MB. The Express JSON body limit is 6 MB.

Feedback categories are `bug`, `suggestion`, and `other`; messages must be 5-2,000 characters. Session briefs are available for HR and Customer Support conversations and are scoped by the authenticated user, role, and conversation ID.

## Troubleshooting

- **Backend exits before listening:** confirm `backend/.env` exists, `JWT_SECRET` is set, and `MONGO_URI` points to a reachable database. MongoDB is required; there is no active in-memory fallback.
- **Login or API requests fail:** confirm the backend is running and `VITE_API_BASE_URL` points to its `/api` base. Restart Vite after changing `.env`.
- **Chat generation reports a configuration/provider error:** check `GEMINI_API_KEY`, the configured model, network access, and provider quota. The app does not generate a local substitute reply.
- **No video reference appears:** YouTube search is optional and requires `YOUTUBE_API_KEY` with YouTube Data API v3 enabled. No suitable result or a provider error leaves the text reply available.
- **An attachment is rejected:** use a non-empty PNG, JPEG, WebP, or PDF file no larger than 4 MB.
- **Microphone or voice is unavailable:** speech depends on browser APIs, permissions, and installed device voices. Text chat remains available.
- **Lint command fails after install:** ESLint is not declared in the frontend dependencies even though a lint script is present.

## Security and data handling

- Keep real values in ignored local `.env` files. Never commit API keys, MongoDB credentials, or JWT secrets. Frontend `VITE_` variables are public to the browser.
- Use a strong, unique `JWT_SECRET`. The backend requires it and does not fall back to a built-in secret. The frontend stores its JWT in browser `localStorage`.
- Registration passwords are hashed with bcrypt before storage. Chat history, feedback, and session briefs are stored in MongoDB and accessed through the authenticated account.
- Chat text and attachment bytes are sent to Google Gemini when generating a reply. Attachment bytes are not retained in MongoDB, but the message and attachment metadata are. Do not send sensitive or confidential material unless you have approval to share it with the configured provider.
- ARIA and SNOW do not have access to employer policies, employee records, customer accounts, orders, billing, or ticketing systems.
