# Repolens

Understand any GitHub repository in seconds. AI-powered visualization and explanations tailored for beginners and developers alike.

## Project Structure

```
Repolens/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   └── LandingPage.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── package.json       # Client dependencies
│
├── server/                # Backend application
│   ├── index.js           # Server entry point
│   └── package.json       # Server dependencies
│
└── package.json           # Root package.json with workspace scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

Install all dependencies (client and server):

```bash
npm run install:all
```

Or install separately:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Development

Run the client development server:

```bash
npm run dev
# or
npm run dev:client
```

Run the server:

```bash
npm run dev:server
```

### Build

Build the client for production:

```bash
npm run build
# or
npm run build:client
```


## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- PostCSS

### Backend
- Node.js (ready for Express, Fastify, or your preferred framework)

### Database
- MongoDB
