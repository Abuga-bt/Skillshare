# Local Community Skill-Sharing & Bartering System

**ICT Project — Jomo Kenyatta University of Agriculture and Technology**  
Student: Abuga Sally Nyagante · SCT121-C004-0326/2024

A web platform where local community members list skills, search for help, message each other, share contact when ready, and leave ratings/reviews — all without money.

---

## Features

| Feature | Status |
|---------|--------|
| User registration & login (JWT + bcrypt) | ✅ |
| User profiles (name, location, bio) | ✅ |
| Offer / edit / delete skills | ✅ |
| Browse & search skills by keyword + category | ✅ |
| Direct messaging | ✅ |
| Contact sharing inside chat | ✅ |
| Ratings & reviews | ✅ |
| Responsive UI (Tailwind) | ✅ |
| Seeded demo data | ✅ |

---

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** JSON file store — zero config, no native deps
- **Auth:** JWT + bcrypt password hashing

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
npm start
```

Runs on **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

---

## Demo Accounts

Password for all: `password123`

| Email | Name | Skills |
|-------|------|--------|
| jane@example.com | Jane Wanjiku | Math tutoring, Piano |
| david@example.com | David Otieno | Plumbing, Handyman |
| amina@example.com | Amina Hassan | Logo design, Photography |
| brian@example.com | Brian Kamau | Web dev, Python tutoring |
| grace@example.com | Grace Achieng | Tailoring, Sewing classes |

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/skills` | — | List/search skills |
| POST | `/api/skills` | ✅ | Offer a skill |
| GET | `/api/users/:id` | ✅ | Profile + skills + reviews |
| GET | `/api/messages/conversations` | ✅ | My conversations |
| POST | `/api/messages/start` | ✅ | Start chat |
| GET | `/api/messages/:id` | ✅ | Chat history |
| POST | `/api/messages` | ✅ | Send message |
| POST | `/api/reviews` | ✅ | Leave review |

---

## Project Structure

```
skill-share-system/
├── backend/
│   ├── server.js          # Express API
│   ├── db.js              # SQLite schema + seed
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # All screens
│   │   ├── components/    # Layout
│   │   ├── context/       # Auth state
│   │   └── api/           # API client
│   └── package.json
└── README.md
```

---

## Screens

1. **Home** — Hero + how it works  
2. **Browse Skills** — Search + category filter  
3. **Skill Detail** — View + message provider  
4. **Dashboard** — My skills + recent chats  
5. **Messages** — Conversation list + chat + contact share  
6. **Profile** — Skills, reviews, edit own profile, leave review  
7. **Offer Skill** — Create listing  
8. **Help** — Guide + demo credentials  

---

Built as a complete, working portfolio project matching the ICT Project II specification.
