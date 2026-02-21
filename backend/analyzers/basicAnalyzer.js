// analyzers/basicAnalyzer.js

const CODE_EXTENSIONS = new Set([
  "js","jsx","ts","tsx","py","rb","java","go","rs","php","cs","swift","kt","scala"
]);

const CONFIG_FILES = new Set([
  ".env", ".gitignore", "dockerfile", ".dockerignore", 
  ".eslintrc", ".prettierrc", ".babelrc", "webpack.config.js",
  "vite.config.js", "next.config.js", "nuxt.config.js"
]);

/**
 * Determines primary language from GitHub language API (highest %)
 */
function detectPrimaryLanguage(languages) {
  const keys = Object.keys(languages);
  if (keys.length === 0) return "Unknown";
  return keys.reduce((a, b) =>
    languages[a] > languages[b] ? a : b
  );
}

/**
 * Count dependencies if packageJson exists
 */
function countDependencies(packageJson) {
  if (!packageJson) return 0;
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  return Object.keys(deps || {}).length;
}

/**
 * Detect if Docker files exist
 */
function detectDocker(structure) {
  const searchDocker = (items) => {
    for (const item of items) {
      if (item.type === "file" && item.name.toLowerCase() === "dockerfile") {
        return true;
      }
      if (item.children && searchDocker(item.children)) {
        return true;
      }
    }
    return false;
  };
  return searchDocker(structure);
}

/**
 * Detect if CI/CD configs exist
 */
function detectCiCd(structure) {
  const searchCiCd = (items) => {
    for (const item of items) {
      if (item.type === "dir" && 
          (item.name.toLowerCase() === ".github" || 
           item.name.toLowerCase() === ".gitlab" ||
           item.name.toLowerCase() === ".circleci")) {
        return true;
      }
      if (item.children && searchCiCd(item.children)) {
        return true;
      }
    }
    return false;
  };
  return searchCiCd(structure);
}

/**
 * Detect if tests folder exists
 */
function detectTesting(structure) {
  const searchTests = (items) => {
    for (const item of items) {
      if (item.type === "dir" && 
          (/test/.test(item.name.toLowerCase()) || 
           /__tests__/.test(item.name.toLowerCase()) ||
           /spec/.test(item.name.toLowerCase()))) {
        return true;
      }
      if (item.children && searchTests(item.children)) {
        return true;
      }
    }
    return false;
  };
  return searchTests(structure);
}

/**
 * Detect if linting config exists
 */
function detectLinting(structure) {
  const searchLinting = (items) => {
    for (const item of items) {
      if (item.type === "file" && 
          [".eslintrc", ".eslintrc.js", ".eslintrc.json", 
           ".prettierrc", ".prettierrc.js", ".stylelintrc"]
            .includes(item.name.toLowerCase())) {
        return true;
      }
      if (item.children && searchLinting(item.children)) {
        return true;
      }
    }
    return false;
  };
  return searchLinting(structure);
}

/**
 * Detect build tools
 */
function detectBuildTools(structure, packageJson) {
  const tools = [];
  
  // Check package.json scripts
  if (packageJson?.scripts) {
    const scripts = Object.keys(packageJson.scripts).join(' ').toLowerCase();
    if (scripts.includes('webpack')) tools.push('Webpack');
    if (scripts.includes('vite')) tools.push('Vite');
    if (scripts.includes('rollup')) tools.push('Rollup');
    if (scripts.includes('babel')) tools.push('Babel');
    if (scripts.includes('tsc') || scripts.includes('typescript')) tools.push('TypeScript');
  }
  
  // Check for build config files
  const searchConfigs = (items) => {
    for (const item of items) {
      if (item.type === "file") {
        const name = item.name.toLowerCase();
        if (name === 'webpack.config.js') tools.push('Webpack');
        if (name === 'vite.config.js') tools.push('Vite');
        if (name === 'rollup.config.js') tools.push('Rollup');
        if (name === 'tsconfig.json') tools.push('TypeScript');
      }
      if (item.children) searchConfigs(item.children);
    }
  };
  searchConfigs(structure);
  
  return [...new Set(tools)]; // Remove duplicates
}

/**
 * Detect framework
 */
function detectFramework(structure, packageJson) {
  const frameworks = [];
  
  if (packageJson?.dependencies || packageJson?.devDependencies) {
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
    
    const deps = Object.keys(allDeps).join(' ').toLowerCase();
    
    if (deps.includes('react')) frameworks.push('React');
    if (deps.includes('vue')) frameworks.push('Vue');
    if (deps.includes('angular')) frameworks.push('Angular');
    if (deps.includes('next')) frameworks.push('Next.js');
    if (deps.includes('nuxt')) frameworks.push('Nuxt');
    if (deps.includes('express')) frameworks.push('Express');
    if (deps.includes('django')) frameworks.push('Django');
    if (deps.includes('flask')) frameworks.push('Flask');
    if (deps.includes('spring')) frameworks.push('Spring');
    if (deps.includes('laravel')) frameworks.push('Laravel');
  }
  
  return frameworks;
}

/**
 * Run enhanced analysis
 */
function runEnhancedAnalysis(repoData) {
  const { structure, packageJson, metadata } = repoData;
  
  return {
    buildTools: detectBuildTools(structure, packageJson),
    frameworks: detectFramework(structure, packageJson),
    hasReadme: repoData.readme?.hasContent || false,
    recentActivity: repoData.recentCommits?.length || 0,
    contributorCount: repoData.contributors?.length || 0,
    topics: metadata.topics || [],
    license: metadata.license,
    createdAt: metadata.createdAt,
    updatedAt: metadata.updatedAt,
    repoSize: metadata.size,
    hasConfigFiles: detectConfigFiles(structure)
  };
}

/**
 * Detect config files
 */
function detectConfigFiles(structure) {
  const configs = [];
  const searchConfigs = (items) => {
    for (const item of items) {
      if (item.type === "file") {
        const name = item.name.toLowerCase();
        if (CONFIG_FILES.has(name)) {
          configs.push(item.name);
        }
      }
      if (item.children) searchConfigs(item.children);
    }
  };
  searchConfigs(structure);
  return configs;
}

function runBasicAnalysis(structure, languages, packageJson) {
  return {
    primaryLanguage: detectPrimaryLanguage(languages),
    totalDependencies: countDependencies(packageJson),
    hasDocker: detectDocker(structure),
    hasCiCd: detectCiCd(structure),
    hasTests: detectTesting(structure),
    hasLinting: detectLinting(structure),
  };
}

module.exports = { 
  runBasicAnalysis, 
  runEnhancedAnalysis 
};