const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "RepoLens backend running 🚀" });
});

// Recursively fetch repository structure
async function fetchRepoStructureRecursive(owner, repo, path = "", headers) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`;
    const response = await axios.get(url, { headers });
    
    const items = await Promise.all(response.data.map(async (item) => {
      if (item.type === 'dir') {
        const children = await fetchRepoStructureRecursive(owner, repo, item.path, headers);
        return {
          name: item.name,
          type: 'dir',
          path: item.path,
          children: children
        };
      } else {
        return {
          name: item.name,
          type: 'file',
          path: item.path,
          size: item.size,
          extension: item.name.split('.').pop()
        };
      }
    }));
    
    return items;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error.message);
    return [];
  }
}

// Detect architecture patterns from file structure
function detectArchitecture(structure) {
  const patterns = {
    hasComponents: false,
    hasServices: false,
    hasUtils: false,
    hasHooks: false,
    hasContext: false,
    hasRedux: false,
    hasApi: false,
    hasDb: false,
    hasModels: false,
    hasControllers: false,
    hasRoutes: false,
    hasMiddleware: false,
    hasConfig: false
  };

  const searchPatterns = (items) => {
    items.forEach(item => {
      const name = item.name.toLowerCase();
      const path = item.path?.toLowerCase() || '';
      
      // Detect patterns based on folder/file names
      if (name.includes('component') || path.includes('/components/')) patterns.hasComponents = true;
      if (name.includes('service') || path.includes('/services/')) patterns.hasServices = true;
      if (name.includes('util') || path.includes('/utils/')) patterns.hasUtils = true;
      if (name.includes('hook') || path.includes('/hooks/')) patterns.hasHooks = true;
      if (name.includes('context') || path.includes('/context/')) patterns.hasContext = true;
      if (name.includes('redux') || name.includes('store')) patterns.hasRedux = true;
      if (name.includes('api') || path.includes('/api/')) patterns.hasApi = true;
      if (name.includes('db') || name.includes('database') || path.includes('/db/')) patterns.hasDb = true;
      if (name.includes('model') || path.includes('/models/')) patterns.hasModels = true;
      if (name.includes('controller') || path.includes('/controllers/')) patterns.hasControllers = true;
      if (name.includes('route') || path.includes('/routes/')) patterns.hasRoutes = true;
      if (name.includes('middleware') || path.includes('/middleware/')) patterns.hasMiddleware = true;
      if (name.includes('config') || path.includes('/config/')) patterns.hasConfig = true;
      
      // Recursively search children
      if (item.children) {
        searchPatterns(item.children);
      }
    });
  };

  searchPatterns(structure);
  return patterns;
}

// Generate architecture description based on patterns
function generateArchitecture(patterns, techStack) {
  const architecture = {
    entryPoint: techStack.includes('TypeScript') ? 'main.tsx → App.tsx → Router' : 'index.js → App.js → Router',
    dataFlow: [],
    patterns: [],
    layers: []
  };

  // Determine architecture type
  if (patterns.hasComponents && patterns.hasServices) {
    architecture.layers.push('Component Layer', 'Service Layer');
    architecture.dataFlow.push('Components → Services → API');
  }
  
  if (patterns.hasControllers && patterns.hasModels) {
    architecture.layers.push('Controller Layer', 'Model Layer');
    architecture.dataFlow.push('Routes → Controllers → Models');
  }

  if (patterns.hasApi && patterns.hasDb) {
    architecture.dataFlow.push('API Layer → Database Layer');
  }

  if (patterns.hasRedux || patterns.hasContext) {
    architecture.patterns.push(patterns.hasRedux ? 'Redux State Management' : 'Context API State Management');
  }

  if (patterns.hasHooks) {
    architecture.patterns.push('React Hooks');
  }

  if (patterns.hasMiddleware) {
    architecture.patterns.push('Middleware Pattern');
  }

  if (techStack.includes('Prisma')) {
    architecture.patterns.push('Prisma ORM');
  }

  // Generate auth flow if detected
  if (patterns.hasMiddleware || techStack.includes('JWT') || techStack.includes('auth')) {
    architecture.authFlow = 'JWT Authentication with Context API';
  }

  return architecture;
}

// NEW FUNCTION: Categorize tech stack
function categorizeTechStack(techStack, packageJson) {
  const categories = {
    frontend: [],
    backend: [],
    database: [],
    ai_ml: [],
    devTools: [],
    cloud: [],
    testing: [],
    mobile: [],
    languages: [],
    other: []
  };

  const languages = [
    "javascript",
    "typescript",
    "html",
    "css",
    "python",
    "java",
    "c",
    "cpp",
    "c#",
    "go",
    "rust",
    "php"
  ];

  const frontendKeywords = [
    "react", "vue", "angular", "next", "nuxt", "svelte",
    "tailwind", "bootstrap", "chakra", "material",
    "redux", "zustand", "mobx", "react-router"
  ];

  const backendKeywords = [
    "express", "nestjs", "fastify", "koa",
    "django", "flask", "spring", "rails",
    "graphql", "apollo"
  ];

  const databaseKeywords = [
    "mongo", "mongoose", "postgres", "mysql",
    "sqlite", "redis", "prisma", "typeorm",
    "sequelize", "firebase", "supabase"
  ];

  const testingKeywords = [
    "jest", "vitest", "cypress", "playwright",
    "testing-library", "mocha", "chai"
  ];

  const devToolKeywords = [
    "eslint", "prettier", "babel", "webpack",
    "vite", "swc", "husky", "commitlint",
    "typescript"
  ];

  techStack.forEach(tech => {
    const t = tech.toLowerCase();

    // 1️⃣ Languages first
    if (languages.includes(t)) {
      categories.languages.push(tech);
      return;
    }

    // 2️⃣ Dev Dependencies priority
    if (packageJson?.devDependencies?.[tech]) {
      categories.devTools.push(tech);
      return;
    }

    // 3️⃣ Testing
    if (testingKeywords.some(k => t.includes(k))) {
      categories.testing.push(tech);
      return;
    }

    // 4️⃣ Database
    if (databaseKeywords.some(k => t.includes(k))) {
      categories.database.push(tech);
      return;
    }

    // 5️⃣ Backend
    if (backendKeywords.some(k => t.includes(k))) {
      categories.backend.push(tech);
      return;
    }

    // 6️⃣ Frontend
    if (frontendKeywords.some(k => t.includes(k))) {
      categories.frontend.push(tech);
      return;
    }

    // 7️⃣ Default
    categories.other.push(tech);
  });

  // Sort everything
  Object.keys(categories).forEach(key => {
    categories[key].sort((a, b) => a.localeCompare(b));
  });

  return categories;
}


app.post("/analyzepage", async (req, res) => {
  try {
    const repoUrl = req.body?.repoUrl;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL is required" });
    }

    // Extract owner and repo
    const cleanedUrl = repoUrl.replace("https://github.com/", "").replace(".git", "");
    const [owner, repo] = cleanedUrl.split("/");

    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {};

    // Fetch repo basic info
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    // Fetch languages
    const languagesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers }
    );

    // Fetch README to detect more tech stack info
    let readmeContent = '';
    try {
      const readmeResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        { headers }
      );
      readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');
    } catch (error) {
      console.log('No README found');
    }

    // Fetch package.json if exists (for npm projects)
    let packageJson = null;
    try {
      const packageResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
        { headers }
      );
      packageJson = JSON.parse(Buffer.from(packageResponse.data.content, 'base64').toString('utf-8'));
    } catch (error) {
      // console.log('No package.json found');
    }

    // Fetch full repository structure recursively
    const structure = await fetchRepoStructureRecursive(owner, repo, '', headers);
    
    // Detect architecture patterns
    const patterns = detectArchitecture(structure);
    
    // Enhance tech stack with package.json dependencies
    let techStack = Object.keys(languagesResponse.data);
    if (packageJson) {
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      // Get ALL dependencies, not just filtered ones
      const allDeps = Object.keys(deps);
      techStack = [...new Set([...techStack, ...allDeps])];
    }

    // Generate architecture
    const architecture = generateArchitecture(patterns, techStack);

    // NEW: Categorize the tech stack
    const categorizedTech = categorizeTechStack(techStack, packageJson);

    res.json({
      name: repoResponse.data.name,
      fullName: repoResponse.data.full_name,
      description: repoResponse.data.description,
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      openIssues: repoResponse.data.open_issues_count,
      techStack: techStack,
      categorizedTech: categorizedTech, // ADD THIS
      structure: structure,
      architecture: architecture,
      patterns: patterns,
      packageJson: packageJson ? {
        scripts: packageJson.scripts,
        dependencies: Object.keys(packageJson.dependencies || {}).length,
        devDependencies: Object.keys(packageJson.devDependencies || {}).length
      } : null
    });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to analyze repository",
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});