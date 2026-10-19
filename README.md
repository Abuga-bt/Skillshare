# SkillShare — Local Community Skill Exchange

Web platform for local skill sharing and bartering (JKUAT ICT Project).

## Stack

- **Frontend:** React + Vite + Tailwind → deploy on **Netlify**
- **Backend:** Node + Express + JSON file DB → deploy on **Render**

## Local development

```bash
# Terminal 1
cd backend && npm install && npm start

# Terminal 2
cd frontend && npm install && npm run dev
```

Open http://localhost:3000  
Demo: `jane@example.com` / `password123`

## Deploy

### 1. Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect GitHub repo `Abuga-bt/Skillshare`
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance:** Free
4. Environment variables:
   - `JWT_SECRET` = any long random string
5. Deploy → copy the URL, e.g. `https://skillshare-api.onrender.com`

### 2. Frontend on Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Select repo `Abuga-bt/Skillshare`
3. Settings (or use `netlify.toml` already in repo):
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Environment variables:
   - `VITE_API_URL` = your Render URL **without** trailing slash  
     Example: `https://skillshare-api.onrender.com`
5. Deploy

### 3. Order matters

Deploy **backend first**, then set `VITE_API_URL` on Netlify and deploy/redeploy the frontend.

## Notes

- Free Render services sleep after ~15 min idle; first request may take 30–60s.
- Data is stored in a JSON file on the server (resets if the free instance is wiped).
