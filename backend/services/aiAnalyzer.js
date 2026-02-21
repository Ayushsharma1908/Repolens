// services/aiAnalyzer.js
const axios = require("axios");

function buildPrompt(repoData) {
  const { metadata, structure, basicAnalysis, enhancedAnalysis, languages, packageJson } = repoData;

  const repoName = metadata?.name || "Unknown";
  const description = metadata?.description || "No description";
  const topics = metadata?.topics?.join(', ') || 'None';
  
  // Get top languages by usage
  const topLanguages = Object.entries(languages || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, bytes]) => `${lang} (${Math.round(bytes / 1024)}KB)`)
    .join(', ');

  // Get key directories
  const keyDirs = structure
    .filter(item => item.type === 'dir')
    .slice(0, 10)
    .join(', ');

  // Get main files
  const mainFiles = structure
    .filter(item => 
      item.type === 'file' && 
      ['index.js', 'index.ts', 'main.js', 'app.js', 'server.js', 'index.html', 'README.md']
        .includes(item.name.toLowerCase())
    )
    .map(item => item.name)
    .join(', ');

  return `
You are a senior software architect performing deep repository analysis.

Analyze the repository carefully and return STRICT VALID JSON only.
Do NOT include explanations.
Do NOT include markdown.
Return only pure JSON.

Repository: ${repoName}
Description: ${description}
Topics: ${topics}

TECHNICAL DETAILS:
Primary Language: ${basicAnalysis.primaryLanguage}
Top Languages: ${topLanguages}
Total Dependencies: ${basicAnalysis.totalDependencies}
Has Docker: ${basicAnalysis.hasDocker}
Has CI/CD: ${basicAnalysis.hasCiCd}
Has Tests: ${basicAnalysis.hasTests}
Has Linting: ${basicAnalysis.hasLinting}

Build Tools: ${enhancedAnalysis.buildTools?.join(', ') || 'None detected'}
Frameworks: ${enhancedAnalysis.frameworks?.join(', ') || 'None detected'}

Key Directories: ${keyDirs}
Main Files: ${mainFiles}

Package.json scripts: ${packageJson?.scripts ? Object.keys(packageJson.scripts).join(', ') : 'None'}

Based on this comprehensive data, provide a detailed analysis including:

1. Project Type: Be specific (e.g., "E-commerce SaaS Platform", "Machine Learning CLI Tool", "Real-time Chat Application")
2. Architecture Style: Detailed architecture pattern
3. Layers: All logical layers detected
4. Main Technologies: Core technologies and their purpose
5. Patterns Detected: Specific design patterns used
6. Project Structure: Key architectural components
7. Data Flow: How data moves through the system
8. Key Features: Main functionality based on structure
9. Improvement Suggestions: 5 specific, actionable suggestions

Return STRICT JSON in this exact format:

{
  "projectType": "",
  "architectureStyle": "",
  "layers": [],
  "mainTechnologies": [],
  "patternsDetected": [],
  "projectStructure": [],
  "dataFlow": [],
  "keyFeatures": [],
  "improvementSuggestions": []
}
`;
}

async function runAIAnalysis(repoData) {
  try {
    const prompt = buildPrompt(repoData);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a senior software architect expert in analyzing codebases and providing detailed architectural insights.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const content = response.data.choices[0].message.content.trim();

    try {
      return JSON.parse(content);
    } catch (err) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON from AI");
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("AI Analysis Error:", error.response?.data || error.message);

    return {
      projectType: "Unknown",
      architectureStyle: "Unknown",
      layers: [],
      mainTechnologies: [],
      patternsDetected: [],
      projectStructure: [],
      dataFlow: [],
      keyFeatures: [],
      improvementSuggestions: ["AI analysis failed - please try again"],
    };
  }
}

module.exports = { runAIAnalysis };