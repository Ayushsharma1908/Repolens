// services/githubService.js
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

  // 6️⃣ Fetch README
  const readme = await fetchReadme(owner, repo, branch, headers);

  // 7️⃣ Fetch recent commits
  const recentCommits = await fetchRecentCommits(owner, repo, headers);

  // 8️⃣ Fetch contributors
  const contributors = await fetchContributors(owner, repo, headers);

  // 9️⃣ Find large files (>1MB)
  const largeFiles = findLargeFiles(treeResponse.data.tree);

  return {
    metadata: {
      name: repoResponse.data.name,
      fullName: repoResponse.data.full_name,
      description: repoResponse.data.description,
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      openIssues: repoResponse.data.open_issues_count,
      defaultBranch: branch,
      createdAt: repoResponse.data.created_at,
      updatedAt: repoResponse.data.updated_at,
      size: repoResponse.data.size,
      license: repoResponse.data.license?.name,
      topics: repoResponse.data.topics || []
    },
    languages: languagesResponse.data,
    structure,
    topLevel,
    packageJson,
    readme,
    recentCommits,
    contributors,
    largeFiles
  };
}

/* ===============================
   BUILD FOLDER TREE
================================ */
// In githubService.js
function buildFolderTree(files) {
  const root = [];
  const map = {};

  // First pass: create all nodes
  files.forEach((file) => {
    if (file.type !== "blob" && file.type !== "tree") return;

    const parts = file.path.split("/");
    let currentPath = "";

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const isFile = isLast && file.type === "blob";
      
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!map[currentPath]) {
        map[currentPath] = {
          name: part,
          type: isFile ? "file" : "dir",
          path: currentPath,
          children: isFile ? undefined : [],
          extension: isFile ? getExtension(part) : undefined,
          size: isFile ? file.size : undefined
        };
      }
    });
  });

  // Second pass: build tree structure
  Object.keys(map).forEach(path => {
    const node = map[path];
    const parentPath = path.substring(0, path.lastIndexOf("/"));
    
    if (parentPath && map[parentPath]) {
      // Add to parent's children
      if (map[parentPath].children) {
        // Check if not already added
        if (!map[parentPath].children.find(child => child.path === node.path)) {
          map[parentPath].children.push(node);
        }
      }
    } else {
      // Root level node
      if (!root.find(item => item.path === node.path)) {
        root.push(node);
      }
    }
  });

  // Sort function
  const sortNodes = (nodes) => {
    if (!nodes) return nodes;
    return nodes.sort((a, b) => {
      // Directories first
      if (a.type === 'dir' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'dir') return 1;
      // Then alphabetical
      return a.name.localeCompare(b.name);
    }).map(node => {
      if (node.children) {
        node.children = sortNodes(node.children);
      }
      return node;
    });
  };

  return sortNodes(root);
}

function sortStructure(items) {
  return items.sort((a, b) => {
    if (a.type === 'dir' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'dir') return 1;
    return a.name.localeCompare(b.name);
  });
}

function getExtension(fileName) {
  const parts = fileName.split(".");
  if (parts.length < 2) return null;
  return parts.pop().toLowerCase();
}

/* ===============================
   FETCH PACKAGE.JSON (ROOT/CLIENT/SERVER)
================================ */
async function fetchAllPackageJson(owner, repo, branch, headers) {
  let combined = null;

  const locations = [
    "package.json",
    "client/package.json",
    "server/package.json",
    "backend/package.json",
    "frontend/package.json",
    "api/package.json"
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
        combined.scripts = {
          ...combined.scripts,
          ...parsed.scripts
        };
      }
    } catch {
      // ignore if not found
    }
  }

  return combined;
}

/* ===============================
   FETCH README
================================ */
async function fetchReadme(owner, repo, branch, headers) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );
    
    const content = Buffer.from(res.data.content, "base64").toString("utf-8");
    return {
      content: content.substring(0, 1000), // First 1000 chars
      hasContent: true
    };
  } catch {
    return { content: null, hasContent: false };
  }
}

/* ===============================
   FETCH RECENT COMMITS
================================ */
async function fetchRecentCommits(owner, repo, headers) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
      { headers }
    );
    
    return res.data.map(commit => ({
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      sha: commit.sha.substring(0, 7)
    }));
  } catch {
    return [];
  }
}

/* ===============================
   FETCH CONTRIBUTORS
================================ */
async function fetchContributors(owner, repo, headers) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=5`,
      { headers }
    );
    
    return res.data.map(contributor => ({
      login: contributor.login,
      contributions: contributor.contributions,
      avatar: contributor.avatar_url
    }));
  } catch {
    return [];
  }
}

/* ===============================
   FIND LARGE FILES
================================ */
function findLargeFiles(tree) {
  const LARGE_FILE_SIZE = 1024 * 1024; // 1MB
  return tree
    .filter(item => item.type === "blob" && item.size > LARGE_FILE_SIZE)
    .map(item => ({
      path: item.path,
      size: item.size,
      sizeMB: (item.size / (1024 * 1024)).toFixed(2)
    }))
    .slice(0, 5); // Top 5 largest
}

module.exports = {
  fetchRepositoryData
};