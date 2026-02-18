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

/* ===============================
   FETCH FULL REPO STRUCTURE
================================ */
async function fetchRepoStructure(owner, repo, headers) {
  try {
    const repoInfo = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers },
    );

    const branch = repoInfo.data.default_branch;

    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers },
    );

    const files = treeResponse.data.tree;
    const root = [];

    files.forEach((file) => {
      if (file.type !== "blob") return;

      const parts = file.path.split("/");
      let currentLevel = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;

        let existing = currentLevel.find((item) => item.name === part);

        if (!existing) {
          existing = {
            name: part,
            type: isFile ? "file" : "dir",
            path: parts.slice(0, index + 1).join("/"),
            children: isFile ? undefined : [],
            extension: isFile ? part.split(".").pop() : undefined,
          };
          currentLevel.push(existing);
        }

        if (!isFile) {
          currentLevel = existing.children;
        }
      });
    });

    return root;
  } catch (error) {
    console.error("Error fetching tree:", error.message);
    return [];
  }
}

/* ===============================
   STATIC FILE CONTENT FETCHER
================================ */
async function fetchFileContent(owner, repo, path, branch, headers) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers },
    );

    return Buffer.from(res.data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

/* ===============================
   CODE PATTERN ANALYZER
================================ */
async function analyzeCodePatterns(owner, repo, branch, headers, structure) {
  const codePatterns = {
    expressApp: false,
    usesRouting: false,
    usesMongoose: false,
    reactApp: false,
    usesHooks: false,
    usesContext: false,
    usesRedux: false,
    mvcPattern: false,
  };

  const importantFiles = [];

  function collectFiles(items) {
    items.forEach((item) => {
      if (item.type === "file") {
        if (/\.(js|ts|jsx|tsx)$/i.test(item.name)) {
          importantFiles.push(item.path);
        }
      }
      if (item.children) collectFiles(item.children);
    });
  }

  collectFiles(structure);

  // limit scan to prevent rate limit
  const limitedFiles = importantFiles.slice(0, 25);

  for (const filePath of limitedFiles) {
    const content = await fetchFileContent(
      owner,
      repo,
      filePath,
      branch,
      headers,
    );

    if (!content) continue;

    const lower = content.toLowerCase();

    if (lower.includes("express(")) codePatterns.expressApp = true;
    if (lower.includes("express.router")) codePatterns.usesRouting = true;
    if (lower.includes("mongoose.model")) codePatterns.usesMongoose = true;

    if (lower.includes("from 'react'") || lower.includes('from "react"'))
      codePatterns.reactApp = true;

    if (lower.includes("usestate(") || lower.includes("useeffect("))
      codePatterns.usesHooks = true;

    if (lower.includes("createcontext(")) codePatterns.usesContext = true;

    if (lower.includes("@reduxjs/toolkit")) codePatterns.usesRedux = true;

    if (lower.includes("../models") && lower.includes("controller"))
      codePatterns.mvcPattern = true;
  }

  return codePatterns;
}

/* ===============================
   FOLDER BASED ARCHITECTURE
================================ */
function detectArchitecture(structure) {
  const patterns = {
    hasControllers: false,
    hasModels: false,
    hasRoutes: false,
  };

  function scan(items) {
    items.forEach((item) => {
      const name = item.name.toLowerCase();
      const path = item.path?.toLowerCase() || "";

      if (name.includes("controller") || path.includes("/controllers/"))
        patterns.hasControllers = true;

      if (name.includes("model") || path.includes("/models/"))
        patterns.hasModels = true;

      if (name.includes("route") || path.includes("/routes/"))
        patterns.hasRoutes = true;

      if (item.children) scan(item.children);
    });
  }

  scan(structure);
  return patterns;
}

/* ===============================
   DETECT PROJECT TYPE & ARCHITECTURE
================================ */
function detectProjectType(structure, codePatterns, packageJson) {
  const projectType = {
    isMonorepo: false,
    hasClientServer: false,
    hasSeparateFolders: false,
    frontendType: "unknown",
    backendType: "unknown",
    architecture: [],
  };

  // Check for client/server folder structure
  let hasClientFolder = false;
  let hasServerFolder = false;
  let hasSrcFolder = false;

  function scanFolders(items) {
    items.forEach((item) => {
      if (item.type === "dir") {
        if (item.name === "client") hasClientFolder = true;
        if (item.name === "server") hasServerFolder = true;
        if (item.name === "src") hasSrcFolder = true;
        if (item.children) scanFolders(item.children);
      }
    });
  }

  scanFolders(structure);

  projectType.hasClientServer = hasClientFolder && hasServerFolder;
  projectType.hasSeparateFolders =
    hasClientFolder || hasServerFolder || hasSrcFolder;
  projectType.isMonorepo = hasClientFolder && hasServerFolder;

  // Determine frontend type
  if (codePatterns.reactApp) {
    projectType.frontendType = "React";
    projectType.architecture.push("React Frontend");
  }

  // Determine backend type
  if (codePatterns.expressApp) {
    projectType.backendType = "Express";
    projectType.architecture.push("Express Backend");
  }

  if (codePatterns.usesMongoose) {
    projectType.architecture.push("MongoDB with Mongoose");
  }

  return projectType;
}

function categorizeTech(languages, packageJson) {
  const categorized = {
    languages: languages || [], // Languages from GitHub
    frontend: [],
    backend: [],
    database: [],
    ai_ml: [],
    devTools: [],
    cloud: [],
    testing: [],
    mobile: [],
    other: [],
  };

  if (!packageJson) {
    console.log("⚠️ No package.json data for categorization");
    return categorized;
  }

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  console.log("🔍 Processing dependencies:", Object.keys(allDeps));

  // Process each dependency
  Object.keys(allDeps || {}).forEach((dep) => {
    const lower = dep.toLowerCase();
    let categorized_flag = false;

    // FRONTEND frameworks & libraries
    if (
      lower.includes("react") ||
      lower.includes("next") ||
      lower.includes("vue") ||
      lower.includes("angular") ||
      lower.includes("svelte") ||
      lower.includes("vite") ||
      lower.includes("tailwind") ||
      lower.includes("bootstrap") ||
      lower.includes("jquery") ||
      lower.includes("redux") ||
      lower.includes("mobx") ||
      lower.includes("react-router") ||
      lower.includes("axios") ||
      lower.includes("lucide") ||
      lower.includes("framer-motion") ||
      lower.includes("emotion") ||
      lower.includes("styled-components")
    ) {
      categorized.frontend.push(dep);
      categorized_flag = true;
    }

    // BACKEND frameworks & libraries
    else if (
      lower.includes("express") ||
      lower.includes("node") ||
      lower.includes("nestjs") ||
      lower.includes("fastify") ||
      lower.includes("koa") ||
      lower.includes("django") ||
      lower.includes("flask") ||
      lower.includes("spring") ||
      lower.includes("jwt") ||
      lower.includes("jsonwebtoken") ||
      lower.includes("bcrypt") ||
      lower.includes("passport") ||
      lower.includes("cors") ||
      lower.includes("helmet") ||
      lower.includes("socket.io") ||
      lower.includes("graphql") ||
      lower.includes("apollo") ||
      lower.includes("trpc")
    ) {
      categorized.backend.push(dep);
      categorized_flag = true;
    }

    // DATABASE related
    else if (
      lower.includes("mongoose") ||
      lower.includes("mongodb") ||
      lower.includes("prisma") ||
      lower.includes("typeorm") ||
      lower.includes("sequelize") ||
      lower.includes("postgres") ||
      lower.includes("mysql") ||
      lower.includes("redis") ||
      lower.includes("sqlite") ||
      lower.includes("firebase") ||
      lower.includes("supabase")
    ) {
      categorized.database.push(dep);
      categorized_flag = true;
    }

    // AI/ML related
    else if (
      lower.includes("openai") ||
      lower.includes("groq") ||
      lower.includes("langchain") ||
      lower.includes("anthropic") ||
      lower.includes("cohere") ||
      lower.includes("huggingface") ||
      lower.includes("transformers") ||
      lower.includes("tensorflow") ||
      lower.includes("pytorch") ||
      lower.includes("keras") ||
      lower.includes("scikit-learn") ||
      lower.includes("llm") ||
      lower.includes("ai")
    ) {
      categorized.ai_ml.push(dep);
      categorized_flag = true;
    }

    // TESTING frameworks
    else if (
      lower.includes("jest") ||
      lower.includes("vitest") ||
      lower.includes("mocha") ||
      lower.includes("chai") ||
      lower.includes("cypress") ||
      lower.includes("playwright") ||
      lower.includes("puppeteer") ||
      lower.includes("testing-library")
    ) {
      categorized.testing.push(dep);
      categorized_flag = true;
    }

    // CLOUD services
    else if (
      lower.includes("aws") ||
      lower.includes("azure") ||
      lower.includes("gcp") ||
      lower.includes("vercel") ||
      lower.includes("netlify") ||
      lower.includes("cloudflare") ||
      lower.includes("heroku") ||
      lower.includes("render")
    ) {
      categorized.cloud.push(dep);
      categorized_flag = true;
    }

    // MOBILE
    else if (
      lower.includes("react-native") ||
      lower.includes("expo") ||
      lower.includes("flutter") ||
      lower.includes("ionic")
    ) {
      categorized.mobile.push(dep);
      categorized_flag = true;
    }

    // DEV TOOLS
    else if (
      lower.includes("eslint") ||
      lower.includes("prettier") ||
      lower.includes("husky") ||
      lower.includes("lint-staged") ||
      lower.includes("babel") ||
      lower.includes("typescript") ||
      lower.includes("ts-node") ||
      lower.includes("nodemon") ||
      lower.includes("dotenv") ||
      lower.includes("webpack") ||
      lower.includes("vite") ||
      lower.includes("rollup") ||
      lower.includes("parcel")
    ) {
      categorized.devTools.push(dep);
      categorized_flag = true;
    }

    // EVERYTHING ELSE
    else {
      categorized.other.push(dep);
    }
  });

  // Sort all categories alphabetically
  Object.keys(categorized).forEach((key) => {
    categorized[key].sort((a, b) => a.localeCompare(b));
  });

  console.log(
    "✅ Categorized tech:",
    Object.fromEntries(
      Object.entries(categorized).map(([k, v]) => [k, v.length]),
    ),
  );

  return categorized;
}

/* ===============================
   GENERATE ARCHITECTURE
================================ */
/* ===============================
   GENERATE ARCHITECTURE
================================ */
function generateArchitecture(
  patterns,
  techStack,
  codePatterns,
  structure,
  projectType,
) {
  const architecture = {
    type: projectType.hasClientServer
      ? "Full-Stack Monorepo"
      : "Single Application",
    frontend: projectType.frontendType,
    backend: projectType.backendType,
    layers: [],
    patterns: [],
    dataFlow: [],
    components: [],
    entryPoints: [],
  };

  // Add layers based on detection
  if (codePatterns.reactApp) {
    architecture.layers.push("📱 Frontend (React)");
    architecture.components.push(
      "React Components",
      "Pages/Routes",
      "Hooks/Context",
    );
  }

  if (codePatterns.expressApp) {
    architecture.layers.push("⚙️ Backend (Express)");
    architecture.components.push("API Routes", "Controllers", "Middleware");
  }

  if (patterns.hasModels || codePatterns.usesMongoose) {
    architecture.layers.push("🗄️ Database Layer");
    architecture.components.push("Data Models", "Database Connection");
  }

  // Add patterns
  if (codePatterns.mvcPattern) {
    architecture.patterns.push("MVC Architecture");
  }
  if (codePatterns.usesHooks) {
    architecture.patterns.push("React Hooks");
  }
  if (patterns.hasRoutes) {
    architecture.patterns.push("RESTful API Structure");
  }
  if (projectType.hasClientServer) {
    architecture.patterns.push("Client-Server Architecture");
  }

  // Add data flow
  if (projectType.hasClientServer) {
    architecture.dataFlow = [
      "1. Client makes HTTP request to API endpoint",
      "2. Express routes handle request → pass to controller",
      "3. Controller processes → interacts with models",
      "4. Model queries database → returns data",
      "5. Controller formats response → sends back to client",
      "6. Client updates UI with response data",
    ];
  } else {
    architecture.dataFlow = ["UI → Logic → Data"];
  }

  // Add entry points
  if (projectType.hasClientServer) {
    architecture.entryPoints = [
      "Frontend: client/src/main.jsx",
      "Backend: server/src/server.js or app.js",
    ];
  } else {
    architecture.entryPoints = ["src/index.js or src/App.js"];
  }

  return architecture;
}

/* ===============================
   ANALYZE ROUTE
================================ */
app.post("/analyzepage", async (req, res) => {
  try {
    const repoUrl = req.body?.repoUrl;
    if (!repoUrl)
      return res.status(400).json({ error: "Repo URL is required" });

    const cleanedUrl = repoUrl
      .replace("https://github.com/", "")
      .replace(".git", "");

    const [owner, repo] = cleanedUrl.split("/");

    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {};

    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers },
    );

    const languagesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers },
    );

    const branch = repoResponse.data.default_branch;
    let packageJsonData = null;
    let allDependencies = [];

    // Try root package.json
    try {
      const rootPkg = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/package.json?ref=${branch}`,
        { headers },
      );
      packageJsonData = JSON.parse(
        Buffer.from(rootPkg.data.content, "base64").toString("utf-8"),
      );
      console.log("✅ Found root package.json");
    } catch (err) {
      console.log("📁 No root package.json");
    }

    // Try client/package.json
    try {
      const clientPkg = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/client/package.json?ref=${branch}`,
        { headers },
      );
      const clientData = JSON.parse(
        Buffer.from(clientPkg.data.content, "base64").toString("utf-8"),
      );

      // Merge with existing packageJsonData or create new
      if (!packageJsonData) {
        packageJsonData = clientData;
      } else {
        // Merge dependencies
        packageJsonData.dependencies = {
          ...packageJsonData.dependencies,
          ...clientData.dependencies,
        };
        packageJsonData.devDependencies = {
          ...packageJsonData.devDependencies,
          ...clientData.devDependencies,
        };
      }
      console.log("✅ Found client/package.json");
    } catch (err) {
      console.log("📁 No client/package.json");
    }

    // Try server/package.json
    try {
      const serverPkg = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/server/package.json?ref=${branch}`,
        { headers },
      );
      const serverData = JSON.parse(
        Buffer.from(serverPkg.data.content, "base64").toString("utf-8"),
      );

      // Merge with existing packageJsonData
      if (!packageJsonData) {
        packageJsonData = serverData;
      } else {
        // Merge dependencies
        packageJsonData.dependencies = {
          ...packageJsonData.dependencies,
          ...serverData.dependencies,
        };
        packageJsonData.devDependencies = {
          ...packageJsonData.devDependencies,
          ...serverData.devDependencies,
        };
      }
      console.log("✅ Found server/package.json");
    } catch (err) {
      console.log("📁 No server/package.json");
    }

    // Debug log to see what we found
    if (packageJsonData) {
      const allDeps = {
        ...packageJsonData.dependencies,
        ...packageJsonData.devDependencies,
      };
      console.log("📦 All dependencies found:", Object.keys(allDeps));
    } else {
      console.log("❌ No package.json found anywhere");
    }

    const structure = await fetchRepoStructure(owner, repo, headers);

    const folderPatterns = detectArchitecture(structure);

    const codePatterns = await analyzeCodePatterns(
      owner,
      repo,
      branch,
      headers,
      structure,
    );

    const techStack = Object.keys(languagesResponse.data);
    // Right after creating categorizedTech, add:
    const categorizedTech = categorizeTech(techStack, packageJsonData);
    console.log(
      "📦 Package.json deps:",
      packageJsonData
        ? Object.keys({
            ...packageJsonData.dependencies,
            ...packageJsonData.devDependencies,
          })
        : [],
    );
    console.log("🏷️ Categorized Tech:", categorizedTech);
    // Detect project type
    const projectType = detectProjectType(
      structure,
      codePatterns,
      packageJsonData,
    );

    // Generate enhanced architecture
    const architecture = generateArchitecture(
      folderPatterns,
      techStack,
      codePatterns,
      structure,
      projectType,
    );

    console.log("CATEGORIZED TECH:", categorizedTech);
    console.log("📤 Sending projectType:", projectType);
    console.log("📤 hasClientServer:", projectType?.hasClientServer);

    res.json({
      name: repoResponse.data.name,
      fullName: repoResponse.data.full_name,
      description: repoResponse.data.description,
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      openIssues: repoResponse.data.open_issues_count,
      techStack,
      categorizedTech,
      packageJson: packageJsonData
        ? {
            dependencies: Object.keys(packageJsonData.dependencies || {})
              .length,
            devDependencies: Object.keys(packageJsonData.devDependencies || {})
              .length,
          }
        : null,
      structure,
      architecture,
      projectType, // ← ADD THIS LINE
      folderPatterns,
      codePatterns,
    });
  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to analyze repository",
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
