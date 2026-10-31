# Unofficial Trek

    unofficialtrek/
      frontend/   React + Vite + Tailwind CSS (public website + admin panel at /admin)
      backend/    Node.js + Express + MongoDB (REST API, JWT admin login)

## Run (two terminals)

Terminal 1 - backend
    cd backend
    npm install
    cp .env.example .env        # set MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD
    npm run seed                # sample data + first admin
    npm run dev                 # http://localhost:5000/api/v1/health

Terminal 2 - frontend
    cd frontend
    npm install
    cp .env.example .env        # VITE_USE_MOCK=false uses the backend; true = demo data only
    npm run dev                 # http://localhost:5173

Admin panel: http://localhost:5173/admin/login  (ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env)

More detail: backend/README.md and frontend/README.md
