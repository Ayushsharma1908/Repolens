require("dotenv").config();
const express = require("express");
const cors = require("cors");

const githubService = require("./services/githubService");
const { runBasicAnalysis } = require("./analyzers/basicAnalyzer");
const {runAIAnalysis} = require("./services/aiAnalyzer");

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

    // 2️⃣ Fetch repository data
    const repoData = await githubService.fetchRepositoryData(owner, repo);

    // 3️⃣ Run deterministic analysis
    const basicAnalysis = runBasicAnalysis(
      repoData.structure,
      repoData.languages,
      repoData.packageJson
    );

    // 4️⃣ AI reasoning layer
    const aiResult = await runAIAnalysis({
      metadata: repoData.metadata,
      structure: repoData.topLevel,
      languages: repoData.languages,
      basicAnalysis
    });

    // 5️⃣ Final response
    res.json({
      metadata: repoData.metadata,
      basicAnalysis,
      aiAnalysis: aiResult
    });

  } catch (error) {
    console.error("Analyze Error:", error.message);
    res.status(500).json({
      error: "Failed to analyze repository",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
