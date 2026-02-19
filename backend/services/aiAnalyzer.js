// services/aiAnalyzer.js
const axios = require("axios");

function buildPrompt(repoData) {
  const {
    repoName,
    description,
    structure,
    basicAnalysis,
    packageJson
  } = repoData;

  return `
You are a senior software architect.

Analyze the repository and return STRICT JSON only.

Repository: ${repoName}
Description: ${description}

Primary Language: ${basicAnalysis.primaryLanguage}
Total Dependencies: ${basicAnalysis.totalDependencies}
Has Docker: ${basicAnalysis.hasDocker}
Has CI/CD: ${basicAnalysis.hasCiCd}
Has Tests: ${basicAnalysis.hasTests}

Top Level Structure:
${structure.map(item => `- ${item.name}`).join("\n")}

Dependencies:
${packageJson?.dependencies ? Object.keys(packageJson.dependencies).join(", ") : "None"}

Return JSON in this format ONLY:

{
  "projectType": "",
  "architectureStyle": "",
  "layers": [],
  "mainTechnologies": [],
  "patternsDetected": [],
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
        model: "mistralai/mistral-7b-instruct", // FREE & good
        messages: [
          { role: "system", content: "You are a software architecture expert." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;

const jsonMatch = content.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error("Invalid JSON from AI");

return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("AI Analysis Error:", error.response?.data || error.message);

    return {
      projectType: "Unknown",
      architectureStyle: "Unknown",
      layers: [],
      mainTechnologies: [],
      patternsDetected: [],
      improvementSuggestions: ["AI analysis failed"]
    };
  }
}

module.exports = { runAIAnalysis };
