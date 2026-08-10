# NOVA AI Backend

A simple Node.js + Express + MongoDB backend for the NOVA AI frontend.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Start MongoDB locally or use MongoDB Atlas. If you are using your Atlas URI, paste it into the `.env` file as `MONGO_URI`.

4. Run the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- POST /api/register
- POST /api/login
- GET /api/profile
- POST /api/chat
- GET /api/chat-history/:userId
- GET /health

## Frontend connection

Set this in your frontend Vite app:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
