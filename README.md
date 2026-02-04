# Modern Full-Stack Dashboard

**GitHub Repository**: [https://github.com/syam-suhith-d/DashBoard](https://github.com/syam-suhith-d/DashBoard)

A production-ready dashboard application featuring a Next.js frontend and a FastAPI backend, orchestrated with Docker.

## 🛠 Tech Stack

**Frontend**
*   **Framework**: Next.js 14 (React)
*   **Styling**: Bootstrap 5 + SCSS Modules (Glassmorphism Design)
*   **State Management**: React Context (Auth & Theme)
*   **Icons**: React Icons (Fa)

**Backend**
*   **Framework**: FastAPI (Python 3.10)
*   **Database**: PostgreSQL
*   **ORM**: SQLAlchemy
*   **Authentication**: JWT (JSON Web Tokens)
*   **Validation**: Pydantic v2

**DevOps**
*   **Containerization**: Docker & Docker Compose
*   **Linting**: Flake8 / ESLint

---

## 🚀 Setup Steps

### 1. Environment Variables
Create a `.env` file in the `backend/` directory (or use the provided defaults for development):

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/dashboard_db
SECRET_KEY=your_super_secret_key_change_this_in_production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Run with Docker (Recommended)
The easiest way to run the entire stack (Frontend + Backend + DB).

```bash
# In the root directory
docker-compose up --build
```
*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:8000](http://localhost:8000)
*   **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Manual Run (Development)
If you prefer running services individually:

**Backend**
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials (Seed Data)

The application comes with a seeding script to creates a user for you.
Run the seed script in the backend container or local environment:

```bash
# If running locally in backend/
python seed.py
```

**Credentials:**
*   **User**: `demo@example.com` / `password123`
*   **Admin**: `admin@example.com` / `admin123`

---

## 📚 API Documentation

The backend auto-generates interactive API documentation:
*   **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs) - Test endpoints directly in the browser.
*   **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc) - Alternative documentation view.

---

## 📈 Scalability Strategy (Production)

To scale this application for a high-traffic production environment:

1.  **Deployment**: Deploy to a container orchestration platform (Kubernetes or AWS ECS) to handle auto-scaling of backend instances based on CPU/Memory load.
2.  **Database**: Use a managed database (AWS RDS) with Read Replicas for heavy read operations. Implement `PgBouncer` for efficient connection pooling.
3.  **Caching**: Introduce Redis to cache frequent API responses and manage user sessions/invalidations outside the DB.
4.  **Frontend**: Deploy Next.js to a global Edge Network (Vercel/Cloudflare) to serve static assets from the CDN locations closest to users.
5.  **Environment**: Use a dedicated secrets manager (AWS Secrets Manager/HashiCorp Vault) instead of `.env` files.
6.  **Monitoring**: Integrate observability tools (Prometheus/Grafana or Datadog) to track API latency, error rates, and container health.
