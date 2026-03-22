// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import passport config (strategies must be loaded before routes)
require('./config/passport');

const authRoutes = require('./routes/auth');
const githubService = require("./services/githubService");
const { runBasicAnalysis, runEnhancedAnalysis } = require("./analyzers/basicAnalyzer");
const { runAIAnalysis } = require("./services/aiAnalyzer");

const app = express();

// ─────────────────────────────────────────────
// MIDDLEWARE — only once each
// ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // JWT only — no sessions needed

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Repo Analyzer API Running 🚀" });
});

app.post("/analyze", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repository URL required" });
    }

    const parsed = repoUrl
      .replace("https://github.com/", "")
      .replace(".git", "")
      .split("/");

    const owner = parsed[0];
    const repo = parsed[1];

    if (!owner || !repo) {
      return res.status(400).json({ error: "Invalid GitHub URL" });
    }

    const repoData = await githubService.fetchRepositoryData(owner, repo);

    const basicAnalysis = runBasicAnalysis(
      repoData.structure,
      repoData.languages,
      repoData.packageJson
    );

    const enhancedAnalysis = runEnhancedAnalysis(repoData);

    const aiResult = await runAIAnalysis({
      metadata: repoData.metadata,
      structure: repoData.topLevel,
      fullStructure: repoData.structure,
      languages: repoData.languages,
      basicAnalysis,
      enhancedAnalysis,
      packageJson: repoData.packageJson,
      readme: repoData.readme,
      contributors: repoData.contributors
    });

    res.json({
      metadata: repoData.metadata,
      basicAnalysis,
      enhancedAnalysis,
      aiAnalysis: aiResult,
      structure: repoData.structure,
      topLevel: repoData.topLevel,
      languages: repoData.languages,
      stats: {
        totalFiles: countTotalFiles(repoData.structure),
        totalDirs: countTotalDirs(repoData.structure),
        fileTypes: getFileTypeDistribution(repoData.structure),
        largeFiles: repoData.largeFiles || [],
        recentCommits: repoData.recentCommits || []
      }
    });

  } catch (error) {
    console.error("Analyze Error:", error.message);
    res.status(500).json({
      error: "Failed to analyze repository",
      details: error.message
    });
  }
});

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function countTotalFiles(structure) {
  let count = 0;
  const countFiles = (items) => {
    if (!items) return;
    items.forEach(item => {
      if (item.type === 'file') count++;
      if (item.children) countFiles(item.children);
    });
  };
  countFiles(structure || []);
  return count;
}

function countTotalDirs(structure) {
  let count = 0;
  const countDirs = (items) => {
    if (!items) return;
    items.forEach(item => {
      if (item.type === 'dir') {
        count++;
        if (item.children) countDirs(item.children);
      }
    });
  };
  countDirs(structure || []);
  return count;
}

function getFileTypeDistribution(structure) {
  const distribution = {};
  const processItems = (items) => {
    if (!items) return;
    items.forEach(item => {
      if (item.type === 'file' && item.extension) {
        distribution[item.extension] = (distribution[item.extension] || 0) + 1;
      }
      if (item.children) processItems(item.children);
    });
  };
  processItems(structure || []);
  return distribution;
}

// ─────────────────────────────────────────────
// CONNECT DB + START SERVER
// ─────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });