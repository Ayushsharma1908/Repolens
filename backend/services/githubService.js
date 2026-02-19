const axios = require("axios");

/* ===============================
   MAIN FUNCTION
================================ */
async function fetchRepositoryData(owner, repo) {
  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    : {};

  // 1️⃣ Repo metadata
  const repoResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  const branch = repoResponse.data.default_branch;

  // 2️⃣ Languages
  const languagesResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    { headers }
  );

  // 3️⃣ Full recursive tree
  const treeResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );

  const structure = buildFolderTree(treeResponse.data.tree);

  // 4️⃣ Top-level structure (clean for AI)
  const topLevel = structure.map(item => item.name);

  // 5️⃣ package.json detection
  const packageJson = await fetchAllPackageJson(owner, repo, branch, headers);

  return {
    metadata: {
      name: repoResponse.data.name,
      fullName: repoResponse.data.full_name,
      description: repoResponse.data.description,
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      openIssues: repoResponse.data.open_issues_count,
      defaultBranch: branch
    },
    languages: languagesResponse.data,
    structure,
    topLevel,
    packageJson
  };
}

/* ===============================
   BUILD FOLDER TREE
================================ */
function buildFolderTree(files) {
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
          extension: isFile ? getExtension(part) : undefined,
        };
        currentLevel.push(existing);
      }

      if (!isFile) {
        currentLevel = existing.children;
      }
    });
  });

  return root;
}

function getExtension(fileName) {
  const parts = fileName.split(".");
  if (parts.length < 2) return null;
  return parts.pop();
}

/* ===============================
   FETCH PACKAGE.JSON (ROOT/CLIENT/SERVER)
================================ */
async function fetchAllPackageJson(owner, repo, branch, headers) {
  let combined = null;

  const locations = [
    "package.json",
    "client/package.json",
    "server/package.json"
  ];

  for (const path of locations) {
    try {
      const res = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        { headers }
      );

      const parsed = JSON.parse(
        Buffer.from(res.data.content, "base64").toString("utf-8")
      );

      if (!combined) {
        combined = parsed;
      } else {
        combined.dependencies = {
          ...combined.dependencies,
          ...parsed.dependencies
        };
        combined.devDependencies = {
          ...combined.devDependencies,
          ...parsed.devDependencies
        };
      }
    } catch {
      // ignore if not found
    }
  }

  return combined;
}

module.exports = {
  fetchRepositoryData
};
