// analyzers/basicAnalyzer.js

/* =================================
   BASIC (DETERMINISTIC) ANALYSIS
================================ */

const CODE_EXTENSIONS = new Set([
  "js","jsx","ts","tsx","py","rb","java","go","rs","php","cs","swift","kt","scala"
]);

const NON_CODE_EXTENSIONS = new Set([
  "md","txt","json","lock","env","yml","yaml"
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
  return structure.some((item) =>
    item.type === "file" && item.name.toLowerCase() === "dockerfile"
  );
}

/**
 * Detect if CI/CD configs exist
 */
function detectCiCd(structure) {
  return structure.some((item) =>
    item.type === "dir" && item.name.toLowerCase() === ".github"
  );
}

/**
 * Detect if tests folder exists
 */
function detectTesting(structure) {
  return structure.some((item) =>
    item.type === "dir" && /test/.test(item.name.toLowerCase())
  );
}

/**
 * Detect if linting config exists
 */
function detectLinting(structure) {
  return structure.some((item) =>
    item.type === "file" &&
    [".eslintrc", ".prettierrc"].includes(item.name.toLowerCase())
  );
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

module.exports = { runBasicAnalysis };
