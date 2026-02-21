// server.js
require("dotenv").config();
console.log("OPENROUTER:", process.env.OPENROUTER_API_KEY);
const express = require("express");
const cors = require("cors");

const githubService = require("./services/githubService");
const { runBasicAnalysis, runEnhancedAnalysis } = require("./analyzers/basicAnalyzer");
const { runAIAnalysis } = require("./services/aiAnalyzer");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Repo Analyzer API Running 🚀" });
});

app.post("/analyze", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repository URL required" });
    }

    // 1️⃣ Parse repo URL
    const parsed = repoUrl
      .replace("https://github.com/", "")
      .replace(".git", "")
      .split("/");

    const owner = parsed[0];
    const repo = parsed[1];

    if (!owner || !repo) {
      return res.status(400).json({ error: "Invalid GitHub URL" });
    }

    // 2️⃣ Fetch repository data with more details
    const repoData = await githubService.fetchRepositoryData(owner, repo);

    // 3️⃣ Run enhanced deterministic analysis
    const basicAnalysis = runBasicAnalysis(
      repoData.structure,
      repoData.languages,
      repoData.packageJson
    );

    const enhancedAnalysis = runEnhancedAnalysis(repoData);

    // 4️⃣ AI reasoning layer with more context
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

    // 5️⃣ Final response with enriched data
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

// Helper functions
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log("All ENV:", process.env);
});