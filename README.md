<div align="center">
  <img src="./client/src/assets/Repolenslogo.svg" alt="RepoLens Logo" width="120" />
  <h1>RepoLens 🔍</h1>
  <p><strong>Lens into any repository. Instant insights, code quality metrics, and contributor trends.</strong></p>

  [![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](#)
  [![Render Deployment](https://img.shields.io/badge/Deployed_on-Render-46E3B7?logo=render&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](#)
  [![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=black)](#)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](#)

</div>

---

## ⚡ Overview

**RepoLens** is a modern, full-stack web application designed to give developers deep, actionable insights into any public GitHub repository. Simply paste a GitHub URL, and RepoLens handles the rest, analyzing the directory structure, file types, contributor trends, and generating AI-powered code quality metrics.

## 🚀 Features

- **GitHub Repository Parsing:** Instantly fetch and analyze repository structures, latest commits, and file distributions.
- **AI-Powered Code Insights:** Uses advanced AI integrations to provide qualitative feedback on repository architecture and potential improvements.
- **Comprehensive Dashboard:** Visualizes file metrics, large files, and historical insights.
- **Authentication System:** Fully integrated OAuth2 (Google & GitHub) as well as traditional Email/Password authentication securely stored via JWTs.
- **Analysis History:** Securely saves your past repository searches so you can revisit them anytime from your personalized dashboard.

## 🛠️ Technology Stack

RepoLens is built on the robust **MERN** stack alongside modern frontend tooling:

### Frontend
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS (with dynamic glassmorphism and modern UI effects)
- **Routing:** React Router DOM
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **Authentication:** Passport.js (Google OAuth2.0, GitHub OAuth2.0, Local strategy with bcrypt) & JSON Web Tokens (JWT)
- **Deployment:** Render

## 📁 Project Structure

```text
Repolens/
├── backend/                  # Express server & API
│   ├── analyzers/            # Core repository analysis logic
│   ├── config/               # Passport.js OAuth configurations
│   ├── models/               # Mongoose DB schemas (Users, etc.)
│   ├── routes/               # API endpoint definitions 
│   ├── services/             # Integrations (GitHub API, OpenRouter AI, Auth)
│   ├── server.js             # Express application entry point
│   └── .env                  # Environment Variables
├── client/                   # Vite + React frontend
│   ├── public/               # Static base assets
│   ├── src/                  
│   │   ├── assets/           # Images & Icons
│   │   ├── components/       # Reusable UI components (Navbar, ProtectedRoutes, etc.)
│   │   ├── context/          # Global React Contexts (AuthContext)
│   │   ├── pages/            # Application views (Home, Analyze, Sign In/Up)
│   │   ├── App.jsx           # Client-side router configuration
│   │   └── index.css         # Global TailwindCSS styles
│   ├── vercel.json           # Vercel SPA Routing Configuration
│   └── vite.config.js        # Vite bundler configuration
└── README.md
```

---

## 💻 Running Locally

To run this application on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Ayushsharma1908/Repolens.git
cd Repolens
```

### 2. Configure Environment Variables
You will need to create two `.env` files.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
SESSION_SECRET=your_session_secret

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI Intergration
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies & Run

Open two terminal instances.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend will be running at `http://localhost:5000`.

---

## 🌐 Production Architecture

RepoLens is designed to be fully deployable with strict CORS integrations between services.

1. **Client URL:** Deployed onto Vercel. 
2. **Server API:** Hosted on a Render Web Service.
3. **Database:** MongoDB Atlas.

> **Important for deployment:** To ensure Google/GitHub OAuth callbacks work correctly, ensure that the `SERVER_URL` is fully configured in the respective developer consoles without trailing slashes.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/Ayushsharma1908/Repolens/issues) if you want to contribute.

## 🛡️ License
Distributed under the MIT License.
