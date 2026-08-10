# NOVA AI

NOVA AI is a React-based front-end demo for exploring role-specific virtual assistant experiences. The current implementation focuses on a polished landing experience, protected demo routes, and two animated assistant flows for HR and customer support.

## What is implemented

The app currently includes:

- A landing page with product messaging, feature highlights, process steps, tech stack, and call-to-action sections.
- A mock authentication flow using browser session storage, with protected routes for the dashboard and assistant experience.
- A dashboard view with summary cards, activity feed, and a weekly activity chart.
- A role-selection experience for choosing between HR and customer support personas.
- Two assistant interfaces powered by a shared chat surface and animated avatar experience.
- Simulated assistant replies, animated typing states, and speech-style interactions for the demo experience.

## Core Features

- 🤖 Role-Based AI Assistants
- 👩 Aria – HR Assistant
- 👩 Snow – Customer Support Assistant
- 🎤 Speech-to-Text
- 🔊 Text-to-Speech
- 🌐 Multilingual Support
- 💬 Interactive AI Conversations
- 📱 Responsive User Interface

## Tech stack

The project is built with:

- React 18
- Vite 5
- React Router DOM 6
- Tailwind CSS 3
- Framer Motion
- Lucide React

## Project structure

```text
src/
  assets/
  components/
    avatar/
    chat/
    dashboard/
    effects/
    landing/
    layout/
    role/
    ui/
  context/
  data/
  hooks/
  layouts/
  pages/
  utils/
```

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173.

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Routes

| Path | Description | Protected |
| --- | --- | --- |
| / | Landing page | No |
| /login | Login view | No |
| /dashboard | Dashboard overview | Yes |
| /roles | Persona selection | Yes |
| /assistant/hr | HR assistant experience | Yes |
| /assistant/support | Customer support assistant experience | Yes |
| /settings | Settings view | Yes |
| * | Not found page | No |

## Notes

The current experience uses mock, client-side authentication and simulated assistant responses. It is a front-end prototype and does not include a backend service integration yet.
