const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');
const authMiddleware = require('../middleware/auth');

// Protect all routes with JWT auth
router.use(authMiddleware);

// GET /analyses - Fetch the current user's recent analyses
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch recent 10 analyses, sorted by newest first
    const recentAnalyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ success: true, analyses: recentAnalyses });
  } catch (err) {
    console.error('Error fetching recent analyses:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch recent analyses.' });
  }
});

// POST /analyses/save - Save a new analysis
router.post('/save', async (req, res) => {
  try {
    const userId = req.user.id;
    const { repoUrl, repoName, analysisData } = req.body;

    if (!repoUrl || !repoName || !analysisData) {
      return res.status(400).json({ success: false, message: 'Missing required analysis fields.' });
    }

    // Check if user already analyzed this repo recently, if so we could update or we can just append.
    // Let's just create a new record so it bubbles to the top of recent history.
    // Optionally remove older identical searches
    await Analysis.deleteMany({ userId, repoUrl });

    const newAnalysis = await Analysis.create({
      userId,
      repoUrl,
      repoName,
      analysisData
    });

    res.status(201).json({ success: true, analysis: newAnalysis });
  } catch (err) {
    console.error('Error saving analysis:', err);
    res.status(500).json({ success: false, message: 'Failed to save analysis.' });
  }
});

module.exports = router;
