const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repoUrl: {
    type: String,
    required: true
  },
  repoName: {
    type: String,
    required: true
  },
  analysisData: {
    // Store the full JSON payload
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
