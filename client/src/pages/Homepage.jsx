// client/pages/HomePage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RepoLensLogo from "../assets/Repolenslogo.svg";
import RepositoryDocumentation from "./RepositoryDocumentation";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import {
  FolderIcon,
  DocumentIcon,
  CodeBracketIcon,
  StarIcon,
  CubeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PhotoIcon,
  CpuChipIcon,
  ComputerDesktopIcon,
  ServerIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  CloudIcon,
  BeakerIcon,
  DevicePhoneMobileIcon,
  QuestionMarkCircleIcon,
  ChevronUpIcon,
  PlusIcon,
  PlusCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

// Helper function to safely render any data as string
const safeRender = (data) => {
  if (typeof data === "string") return data;
  if (typeof data === "number" || typeof data === "boolean")
    return String(data);
  if (typeof data === "object" && data !== null) {
    // Try to extract common text fields
    return (
      data.description ||
      data.name ||
      data.category ||
      data.suggestion ||
      data.message ||
      data.title ||
      JSON.stringify(data)
    );
  }
  return "";
};

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;
  const { user } = useAuth();
  // Access the nested data correctly
  const metadata = analysis?.metadata || {};
  const basicAnalysis = analysis?.basicAnalysis || {};
  const enhancedAnalysis = analysis?.enhancedAnalysis || {};
  const aiAnalysis = analysis?.aiAnalysis || {};
  const stats = analysis?.stats || {};
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [structure, setStructure] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    techStack: true,
    architecture: true,
    features: true,
    suggestions: true,
    files: true,
    activity: true,
  });

  // Helper function to find Python files in the structure
  const findPythonFiles = (items, path = "") => {
    let pythonFiles = [];

    const search = (items, currentPath) => {
      items.forEach((item) => {
        const fullPath = currentPath
          ? `${currentPath}/${item.name}`
          : item.name;
        if (item.type === "file" && item.name.endsWith(".py")) {
          pythonFiles.push(fullPath);
        }
        if (item.children) {
          search(item.children, fullPath);
        }
      });
    };

    search(items, "");
    return pythonFiles;
  };

  useEffect(() => {
    if (analysis?.structure) {
      setStructure(analysis.structure);
    }
    console.log("Full analysis data:", analysis);
    console.log("AI Analysis:", aiAnalysis);
    console.log("Enhanced Analysis:", enhancedAnalysis);

    // Debug object data
    if (aiAnalysis.keyFeatures) {
      console.log("Key Features:", aiAnalysis.keyFeatures);
    }
    if (aiAnalysis.layers) {
      console.log("Layers:", aiAnalysis.layers);
    }
  }, [analysis]);

  useEffect(() => {
    console.log("🔍 AI Analysis Structure:", {
      dataFlow: aiAnalysis.dataFlow,
      isArray: Array.isArray(aiAnalysis.dataFlow),
      type: typeof aiAnalysis.dataFlow,
      layers: aiAnalysis.layers,
      patterns: aiAnalysis.patternsDetected,
      features: aiAnalysis.keyFeatures,
      suggestions: aiAnalysis.improvementSuggestions,
    });
  }, [aiAnalysis]);

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
 useEffect(() => {
  if (user === null) {
    navigate("/signin");
  }
}, [user, navigate]);

  // Get appropriate icon based on file extension
  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();

    if (
      ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"].includes(extension)
    ) {
      return <PhotoIcon className="w-4 h-4 text-pink-400" />;
    } else if (["js", "jsx", "ts", "tsx"].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-yellow-400" />;
    } else if (extension === "json") {
      return <CubeIcon className="w-4 h-4 text-orange-400" />;
    } else if (["css", "scss", "sass", "less"].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-blue-400" />;
    } else if (["html", "htm"].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-red-400" />;
    } else if (["md", "markdown"].includes(extension)) {
      return <DocumentIcon className="w-4 h-4 text-purple-400" />;
    } else if (["py"].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-green-400" />;
    } else if (["java"].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-orange-400" />;
    } else {
      return <DocumentIcon className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const renderStructure = (items, level = 0, path = "") => {
    if (!items || !Array.isArray(items)) {
      return (
        <div className="text-center py-8 text-[#94A3B8]">
          <FolderIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No files to display</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-[#94A3B8]">
          <FolderIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Repository is empty</p>
        </div>
      );
    }

    // Sort items: directories first, then files alphabetically
    const sortedItems = [...items].sort((a, b) => {
      if (a.type === "dir" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "dir") return 1;
      return a.name.localeCompare(b.name);
    });

    // Calculate stats for display
    const dirCount = items.filter((item) => item.type === "dir").length;
    const fileCount = items.filter((item) => item.type === "file").length;

    return (
      <>
        {/* Show stats at root level only */}
        {level === 0 && (
          <div className="mb-3 px-3 py-2 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] flex justify-between">
            <span>📁 {dirCount} folders</span>
            <span>📄 {fileCount} files</span>
          </div>
        )}

        {sortedItems.map((item) => {
          const currentPath = `${path}/${item.name}`;
          const isExpanded = expandedFolders[currentPath];
          const indent = level * 16;

          if (item.type === "dir") {
            // Count items in directory for badge
            const childCount = item.children?.length || 0;
            const childDirs =
              item.children?.filter((c) => c.type === "dir").length || 0;
            const childFiles = childCount - childDirs;

            return (
              <div key={currentPath} className="select-none">
                <div
                  className="flex items-center gap-2 py-1.5 hover:bg-[#1A1F2E] rounded-lg px-3 cursor-pointer transition-all duration-200 group"
                  style={{ marginLeft: `${indent}px` }}
                  onClick={() => toggleFolder(currentPath)}
                >
                  <span className="text-[#94A3B8] group-hover:text-[#60A5FA] transition-colors">
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </span>
                  <FolderIcon
                    className={`w-5 h-5 transition-colors ${isExpanded ? "text-[#60A5FA]" : "text-[#94A3B8] group-hover:text-[#60A5FA]"}`}
                  />
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                    {item.name}
                  </span>

                  {/* Directory stats badge */}
                  {childCount > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#334155] text-[#94A3B8] group-hover:bg-[#60A5FA] group-hover:text-white transition-colors">
                      {childDirs > 0 && `${childDirs}📁 `}
                      {childFiles > 0 && `${childFiles}📄`}
                    </span>
                  )}
                </div>

                {isExpanded && item.children && (
                  <div className="border-l border-[#334155] ml-6 pl-2">
                    {renderStructure(item.children, level + 1, currentPath)}
                  </div>
                )}
              </div>
            );
          }

          // File item
          const fileSize = item.size ? (item.size / 1024).toFixed(1) : null;
          const fileExtension =
            item.extension || item.name.split(".").pop() || "";

          return (
            <div
              key={currentPath}
              className="flex items-center gap-2 py-1.5 hover:bg-[#1A1F2E] rounded-lg px-3 transition-all duration-200 group"
              style={{ marginLeft: `${indent + 24}px` }}
              title={`${item.name}${fileSize ? ` (${fileSize}KB)` : ""}`}
            >
              {getFileIcon(item.name)}
              <span className="text-gray-400 text-sm group-hover:text-white transition-colors truncate flex-1">
                {item.name}
              </span>

              {/* File size badge */}
              {fileSize && (
                <span className="text-xs text-[#64748B] group-hover:text-[#94A3B8] ml-2">
                  {fileSize}KB
                </span>
              )}

              {/* Extension badge for code files */}
              {fileExtension &&
                [
                  "js",
                  "jsx",
                  "ts",
                  "tsx",
                  "py",
                  "java",
                  "go",
                  "rs",
                  "css",
                  "html",
                ].includes(fileExtension) && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-[#334155] text-[#94A3B8] group-hover:bg-[#60A5FA] group-hover:text-white transition-colors">
                    {fileExtension}
                  </span>
                )}
            </div>
          );
        })}
      </>
    );
  };

  // Helper function to count files recursively
  const countFiles = (items) => {
    if (!items) return 0;
    let count = 0;
    items.forEach((item) => {
      if (item.type === "file") count++;
      if (item.children) count += countFiles(item.children);
    });
    return count;
  };

  // Helper function to count directories recursively
  const countDirs = (items) => {
    if (!items) return 0;
    let count = 0;
    items.forEach((item) => {
      if (item.type === "dir") {
        count++;
        if (item.children) count += countDirs(item.children);
      }
    });
    return count;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      languages: <CodeBracketIcon className="w-5 h-5" />,
      frontend: <ComputerDesktopIcon className="w-5 h-5" />,
      backend: <ServerIcon className="w-5 h-5" />,
      database: <CircleStackIcon className="w-5 h-5" />,
      ai_ml: <CpuChipIcon className="w-5 h-5" />,
      devTools: <WrenchScrewdriverIcon className="w-5 h-5" />,
      cloud: <CloudIcon className="w-5 h-5" />,
      testing: <BeakerIcon className="w-5 h-5" />,
      mobile: <DevicePhoneMobileIcon className="w-5 h-5" />,
      other: <QuestionMarkCircleIcon className="w-5 h-5" />,
    };
    return icons[category] || icons.other;
  };

  // Category display names
  const categoryNames = {
    languages: "Languages",
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    ai_ml: "AI/ML",
    devTools: "Dev Tools",
    cloud: "Cloud",
    testing: "Testing",
    mobile: "Mobile",
    other: "Other",
  };

  // Category colors
  const categoryColors = {
    languages: "from-indigo-500 to-blue-500",
    frontend: "from-blue-500 to-cyan-500",
    backend: "from-green-500 to-emerald-500",
    database: "from-purple-500 to-indigo-500",
    ai_ml: "from-pink-500 to-rose-500",
    devTools: "from-yellow-500 to-amber-500",
    cloud: "from-sky-500 to-blue-500",
    testing: "from-orange-500 to-red-500",
    mobile: "from-violet-500 to-purple-500",
    other: "from-gray-500 to-slate-500",
  };

  // Safely process technologies
  const safeTechnologies = (aiAnalysis.mainTechnologies || [])
    .map((tech) => {
      if (typeof tech === "string") return tech;
      if (typeof tech === "object" && tech !== null) {
        return (
          tech.name || tech.description || tech.category || JSON.stringify(tech)
        );
      }
      return String(tech);
    })
    .filter(Boolean);

  // Create categorizedTech from aiAnalysis.mainTechnologies
  const categorizedTech = {
    languages:
      safeTechnologies.filter((tech) =>
        [
          "JavaScript",
          "TypeScript",
          "Python",
          "Java",
          "Go",
          "Rust",
          "C++",
          "C#",
          "PHP",
          "Ruby",
          "Kotlin",
          "Swift",
        ].includes(tech),
      ) || [],
    frontend:
      safeTechnologies.filter((tech) =>
        [
          "React",
          "Vue",
          "Angular",
          "HTML",
          "CSS",
          "Tailwind",
          "Bootstrap",
          "Next.js",
          "Gatsby",
          "Svelte",
        ].includes(tech),
      ) || [],
    backend:
      safeTechnologies.filter((tech) =>
        [
          "Node.js",
          "Express",
          "Django",
          "Flask",
          "Spring",
          "Laravel",
          "Rails",
          "FastAPI",
          "GraphQL",
        ].includes(tech),
      ) || [],
    database:
      safeTechnologies.filter((tech) =>
        [
          "MongoDB",
          "PostgreSQL",
          "MySQL",
          "Redis",
          "SQLite",
          "Firebase",
          "Supabase",
          "Prisma",
        ].includes(tech),
      ) || [],
    ai_ml:
      safeTechnologies.filter((tech) =>
        [
          "TensorFlow",
          "PyTorch",
          "Keras",
          "OpenAI",
          "LLaMA",
          "GPT",
          "Hugging Face",
          "LangChain",
        ].includes(tech),
      ) || [],
    devTools:
      safeTechnologies.filter((tech) =>
        [
          "Docker",
          "Kubernetes",
          "Jenkins",
          "GitHub Actions",
          "Webpack",
          "Vite",
          "Babel",
          "ESLint",
        ].includes(tech),
      ) || [],
    cloud:
      safeTechnologies.filter((tech) =>
        ["AWS", "Azure", "GCP", "Vercel", "Netlify", "Cloudflare"].includes(
          tech,
        ),
      ) || [],
    testing:
      safeTechnologies.filter((tech) =>
        ["Jest", "Mocha", "Cypress", "Playwright", "Pytest", "JUnit"].includes(
          tech,
        ),
      ) || [],
    mobile:
      safeTechnologies.filter((tech) =>
        [
          "React Native",
          "Flutter",
          "SwiftUI",
          "Jetpack Compose",
          "Ionic",
        ].includes(tech),
      ) || [],
    other:
      safeTechnologies.filter(
        (tech) =>
          ![
            "JavaScript",
            "TypeScript",
            "Python",
            "Java",
            "Go",
            "Rust",
            "C++",
            "C#",
            "PHP",
            "Ruby",
            "Kotlin",
            "Swift",
            "React",
            "Vue",
            "Angular",
            "HTML",
            "CSS",
            "Tailwind",
            "Bootstrap",
            "Next.js",
            "Gatsby",
            "Svelte",
            "Node.js",
            "Express",
            "Django",
            "Flask",
            "Spring",
            "Laravel",
            "Rails",
            "FastAPI",
            "GraphQL",
            "MongoDB",
            "PostgreSQL",
            "MySQL",
            "Redis",
            "SQLite",
            "Firebase",
            "Supabase",
            "Prisma",
            "TensorFlow",
            "PyTorch",
            "Keras",
            "OpenAI",
            "LLaMA",
            "GPT",
            "Hugging Face",
            "LangChain",
            "Docker",
            "Kubernetes",
            "Jenkins",
            "GitHub Actions",
            "Webpack",
            "Vite",
            "Babel",
            "ESLint",
            "AWS",
            "Azure",
            "GCP",
            "Vercel",
            "Netlify",
            "Cloudflare",
            "Jest",
            "Mocha",
            "Cypress",
            "Playwright",
            "Pytest",
            "JUnit",
            "React Native",
            "Flutter",
            "SwiftUI",
            "Jetpack Compose",
            "Ionic",
          ].includes(tech),
      ) || [],
  };

  // Get only categories that have technologies
  const getActiveCategories = () => {
    return Object.entries(categorizedTech)
      .filter(([_, techs]) => techs && Array.isArray(techs) && techs.length > 0)
      .map(([category]) => category);
  };

  const activeCategories = getActiveCategories();
  const previewLimit = 4;
  const previewCategories = activeCategories.slice(0, previewLimit);
  const hiddenCategories = activeCategories.slice(previewLimit);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white">
        <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm">
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 bg-[#3B82F6] rounded-xl flex items-center justify-center">
                <img
                  src={RepoLensLogo}
                  alt="RepoLens Logo"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">
                RepoLens
              </span>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl text-[#94A3B8] mb-4">
            No analysis data found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Analyze a Repository
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#60A5FA]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#38BDF8]/20 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm z-50">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 bg-[#3B82F6] rounded-xl flex items-center justify-center">
              <img
                src={RepoLensLogo}
                alt="RepoLens Logo"
                className="w-9 h-9 object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">
              RepoLens
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/analyzepage")}
              className="text-sm text-white hover:text-white transition p-2 md:px-4 md:py-2 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA] flex items-center justify-center gap-2"
              title="New Analysis"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span className="hidden md:inline">New Analysis</span>
            </button>
            <button
              onClick={() => setShowDocumentation(true)}
              className="text-sm text-white hover:text-white transition p-2 md:px-4 md:py-2 rounded-lg bg-[#334155] hover:bg-[#475569] flex items-center justify-center gap-2"
              title="Full Documentation"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span className="hidden md:inline">Documentation</span>
            </button>
            <div className = "relative">
            {/* User Profile - Add this */}
            {user ? (
              <UserProfile />
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="text-sm text-white hover:text-white transition px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA]"
              >
                Sign In
              </button>
              
            )}
            </div>
          </div>
        </nav>
      </header>

      {/* Debug Info - Remove after fixing */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-4 bg-red-900/50 rounded-lg border border-red-500">
          <h3 className="text-white font-bold mb-2">Debug Info:</h3>
          <pre className="text-xs text-white overflow-auto max-h-40">
            {JSON.stringify(
              {
                hasStructure: !!analysis?.structure,
                structureType: analysis?.structure
                  ? typeof analysis.structure
                  : "none",
                isArray: Array.isArray(analysis?.structure),
                structureLength: analysis?.structure?.length,
                firstItem: analysis?.structure?.[0],
              },
              null,
              2,
            )}
          </pre>
        </div>
      )} */}

      {/* Main Content */}
      <main className="relative px-6 py-8 md:px-12 md:py-12 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Repo Header with Quick Stats */}
          <div className="mb-8 bg-gradient-to-r from-[#0F1320] to-[#1A1F2E] rounded-2xl border border-[#334155] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white break-words max-w-full">
                    {metadata.name || analysis.name}
                  </h1>
                  <div className="flex items-center gap-1 bg-[#1A1F2E] px-3 py-1 rounded-full border border-[#334155]">
                    <StarIcon className="w-4 h-4 text-[#FBBF24]" />
                    <span className="text-sm text-[#94A3B8]">
                      {metadata.stars?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
                {metadata.description && (
                  <p className="text-[#94A3B8] text-base md:text-lg">
                    {metadata.description}
                  </p>
                )}
                {/* Topics */}
                {metadata.topics && metadata.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {metadata.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#1A1F2E] text-[#60A5FA] rounded-lg text-xs border border-[#334155]"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Compact Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-[#1A1F2E] px-4 py-2 rounded-xl border border-[#334155]">
                  <CubeIcon className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-sm text-[#94A3B8]">Files:</span>
                  <span className="text-white font-semibold">
                    {stats.totalFiles || countFiles(analysis.structure) || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#1A1F2E] px-4 py-2 rounded-xl border border-[#334155]">
                  <FolderIcon className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-sm text-[#94A3B8]">Dirs:</span>
                  <span className="text-white font-semibold">
                    {stats.totalDirs || countDirs(analysis.structure) || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#1A1F2E] px-4 py-2 rounded-xl border border-[#334155]">
                  <CodeBracketIcon className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-sm text-[#94A3B8]">Technologies:</span>
                  <span className="text-white font-semibold">
                    {aiAnalysis.mainTechnologies?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#0F1320] to-[#1A1F2E] rounded-xl border border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#94A3B8] text-sm">Primary Language</span>
                <CodeBracketIcon className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <p className="text-2xl font-bold text-white">
                {basicAnalysis.primaryLanguage || "N/A"}
              </p>
              <div className="mt-2 flex gap-1">
                {Object.entries(analysis.languages || {})
                  .slice(0, 3)
                  .map(([lang, bytes]) => (
                    <span
                      key={lang}
                      className="text-xs px-2 py-1 bg-[#1A1F2E] rounded-full text-[#94A3B8]"
                    >
                      {lang}
                    </span>
                  ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F1320] to-[#1A1F2E] rounded-xl border border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#94A3B8] text-sm">Repository Stats</span>
                <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8] text-xs">Files</span>
                  <span className="text-white font-medium">
                    {stats.totalFiles || countFiles(analysis.structure) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8] text-xs">Directories</span>
                  <span className="text-white font-medium">
                    {stats.totalDirs || countDirs(analysis.structure) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8] text-xs">Size</span>
                  <span className="text-white font-medium">
                    {metadata.size
                      ? `${(metadata.size / 1024).toFixed(2)} MB`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0F1320] to-[#1A1F2E] rounded-xl border border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#94A3B8] text-sm">Features</span>
                <WrenchScrewdriverIcon className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {basicAnalysis.hasDocker && (
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                    🐳 Docker
                  </span>
                )}
                {basicAnalysis.hasCiCd && (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    🔄 CI/CD
                  </span>
                )}
                {basicAnalysis.hasTests && (
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    🧪 Tests
                  </span>
                )}
                {basicAnalysis.hasLinting && (
                  <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                    ✨ Linting
                  </span>
                )}
              </div>
              {enhancedAnalysis.frameworks &&
                enhancedAnalysis.frameworks.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-[#94A3B8] mb-1">Frameworks</p>
                    <div className="flex flex-wrap gap-1">
                      {enhancedAnalysis.frameworks.slice(0, 3).map((fw) => (
                        <span
                          key={fw}
                          className="text-xs px-2 py-1 bg-[#1A1F2E] rounded-full text-white"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="bg-gradient-to-br from-[#0F1320] to-[#1A1F2E] rounded-xl border border-[#334155] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#94A3B8] text-sm">Activity</span>
                <StarIcon className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8] text-xs">Stars</span>
                  <span className="text-white font-medium">
                    {metadata.stars?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8] text-xs">Forks</span>
                  <span className="text-white font-medium">
                    {metadata.forks?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8] text-xs">Updated</span>
                  <span className="text-white font-medium text-xs">
                    {formatDate(metadata.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File Distribution Chart */}
          {stats.fileTypes && Object.keys(stats.fileTypes).length > 0 && (
            <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <DocumentIcon className="w-5 h-5 text-[#60A5FA]" />
                  File Distribution
                </h3>
                <button
                  onClick={() => toggleSection("files")}
                  className="text-[#94A3B8] hover:text-white transition-colors"
                >
                  {expandedSections.files ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {expandedSections.files && (
                <div className="space-y-3">
                  {Object.entries(stats.fileTypes)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([ext, count]) => {
                      const percentage = (
                        (count / stats.totalFiles) *
                        100
                      ).toFixed(1);
                      return (
                        <div key={ext} className="flex items-center gap-3">
                          <span className="text-xs text-[#94A3B8] w-16">
                            .{ext}
                          </span>
                          <div className="flex-1 h-2 bg-[#1A1F2E] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#60A5FA] to-[#818CF8] rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-white w-12">
                            {count} files
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Structure */}
            <div className="lg:col-span-1">
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FolderIcon className="w-5 h-5 text-[#60A5FA]" />
                    Project Structure
                  </h2>
                  {analysis.structure && Array.isArray(analysis.structure) && (
                    <span className="text-xs text-[#60A5FA] bg-[#60A5FA]/10 px-2 py-1 rounded-full">
                      {analysis.structure.length} items
                    </span>
                  )}
                </div>
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {renderStructure(structure)}
                </div>
              </div>
            </div>

            {/* Tech Stack & Architecture */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tech Stack - Categorized with Show More */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CodeBracketIcon className="w-5 h-5 text-[#60A5FA]" />
                    Tech Stack
                  </h2>
                  {aiAnalysis.mainTechnologies && (
                    <span className="text-xs text-[#60A5FA] bg-[#60A5FA]/10 px-3 py-1.5 rounded-full">
                      {aiAnalysis.mainTechnologies.length} technologies
                    </span>
                  )}
                </div>

                {aiAnalysis.mainTechnologies ? (
                  <div className="space-y-4">
                    {/* Show preview categories */}
                    {previewCategories.map((category) => {
                      const technologies = categorizedTech[category];
                      if (!technologies || technologies.length === 0)
                        return null;

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-md bg-gradient-to-r ${categoryColors[category]} flex items-center justify-center text-white`}
                            >
                              {getCategoryIcon(category)}
                            </div>
                            <h3 className="text-sm font-semibold text-white">
                              {categoryNames[category]}
                            </h3>
                            <span className="text-xs text-[#94A3B8]">
                              ({technologies.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 pl-8">
                            {technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2.5 py-1 bg-[#1A1F2E] text-[#94A3B8] rounded-lg text-xs font-medium border border-[#334155] hover:border-[#60A5FA] hover:text-white transition-all duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Show More button for hidden categories */}
                    {hiddenCategories.length > 0 && (
                      <div className="space-y-4">
                        <button
                          onClick={() =>
                            setExpandedCategories(!expandedCategories)
                          }
                          className="flex items-center gap-2 text-[#60A5FA] hover:text-white transition-colors text-sm font-medium mt-2"
                        >
                          {expandedCategories ? (
                            <>
                              <ChevronUpIcon className="w-4 h-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon className="w-4 h-4" />
                              Show {hiddenCategories.length} More Categories
                            </>
                          )}
                        </button>

                        {expandedCategories &&
                          hiddenCategories.map((category) => {
                            const technologies = categorizedTech[category];
                            if (!technologies || technologies.length === 0)
                              return null;

                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-6 h-6 rounded-md bg-gradient-to-r ${categoryColors[category]} flex items-center justify-center text-white`}
                                  >
                                    {getCategoryIcon(category)}
                                  </div>
                                  <h3 className="text-sm font-semibold text-white">
                                    {categoryNames[category]}
                                  </h3>
                                  <span className="text-xs text-[#94A3B8]">
                                    ({technologies.length})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-8">
                                  {technologies.map((tech, index) => (
                                    <span
                                      key={index}
                                      className="px-2.5 py-1 bg-[#1A1F2E] text-[#94A3B8] rounded-lg text-xs font-medium border border-[#334155] hover:border-[#60A5FA] hover:text-white transition-all duration-200"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ) : (
                  // Fallback to old display if categorization isn't available
                  <div className="flex flex-wrap gap-2">
                    {analysis.techStack?.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#60A5FA] to-[#818CF8] text-white rounded-lg text-xs font-medium shadow-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* System Architecture */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
                    System Architecture
                  </h2>
                  <button
                    onClick={() => toggleSection("architecture")}
                    className="text-[#94A3B8] hover:text-white transition-colors"
                  >
                    {expandedSections.architecture ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {expandedSections.architecture && (
                  <>
                    {/* Project Type Badge */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#1A1F2E] text-[#60A5FA] rounded-full text-xs font-medium border border-[#334155]">
                        {safeRender(aiAnalysis.projectType) ||
                          "Unknown Project Type"}
                      </span>
                      <span className="px-3 py-1 bg-[#1A1F2E] text-[#60A5FA] rounded-full text-xs font-medium border border-[#334155]">
                        {safeRender(aiAnalysis.architectureStyle) ||
                          "Unknown Architecture"}
                      </span>
                      {basicAnalysis.primaryLanguage &&
                        basicAnalysis.primaryLanguage !== "Unknown" && (
                          <span className="px-3 py-1 bg-[#1A1F2E] text-green-400 rounded-full text-xs font-medium border border-[#334155]">
                            🎯 {basicAnalysis.primaryLanguage}
                          </span>
                        )}
                    </div>

                    {/* Build Tools */}
                    {enhancedAnalysis.buildTools &&
                      enhancedAnalysis.buildTools.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                            Build Tools
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {enhancedAnalysis.buildTools.map((tool, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] border border-[#334155]"
                              >
                                🔨 {safeRender(tool)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Dependencies */}
                    {basicAnalysis.totalDependencies > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                          Package Management
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] border border-[#334155]">
                            📦 {basicAnalysis.totalDependencies} Dependencies
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Architecture Layers */}
                    {aiAnalysis.layers &&
                      Array.isArray(aiAnalysis.layers) &&
                      aiAnalysis.layers.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                            Architecture Layers
                          </h3>
                          <div className="space-y-2">
                            {aiAnalysis.layers.map((layer, i) => (
                              <div
                                key={i}
                                className="border-l-2 border-[#60A5FA] pl-3"
                              >
                                <p className="text-sm text-white">
                                  {safeRender(layer)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Data Flow */}
                    {aiAnalysis.dataFlow &&
                      Array.isArray(aiAnalysis.dataFlow) &&
                      aiAnalysis.dataFlow.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                            Data Flow
                          </h3>
                          <div className="space-y-2">
                            {aiAnalysis.dataFlow.map((flow, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <ArrowPathIcon className="w-4 h-4 text-[#60A5FA] mt-0.5" />
                                <p className="text-sm text-white">
                                  {safeRender(flow)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Project Structure from AI */}
                    {aiAnalysis.projectStructure &&
                      Array.isArray(aiAnalysis.projectStructure) &&
                      aiAnalysis.projectStructure.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                            Key Components
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.projectStructure.map((component, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] border border-[#334155]"
                              >
                                📁 {safeRender(component)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Python Files */}
                    {analysis.structure &&
                      findPythonFiles(analysis.structure).length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                            Python Files
                          </h3>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {findPythonFiles(analysis.structure)
                              .slice(0, 5)
                              .map((file, i) => (
                                <p
                                  key={i}
                                  className="text-sm text-white font-mono"
                                >
                                  • {file}
                                </p>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Features from Basic Analysis */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {basicAnalysis.hasDocker && (
                        <div className="px-2 py-1 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] border border-[#334155] text-center">
                          🐳 Docker
                        </div>
                      )}
                      {basicAnalysis.hasCiCd && (
                        <div className="px-2 py-1 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] border border-[#334155] text-center">
                          🔄 CI/CD
                        </div>
                      )}
                      {basicAnalysis.hasTests && (
                        <div className="px-2 py-1 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] border border-[#334155] text-center">
                          🧪 Tests
                        </div>
                      )}
                      {basicAnalysis.hasLinting && (
                        <div className="px-2 py-1 bg-[#1A1F2E] rounded-lg text-xs text-[#94A3B8] border border-[#334155] text-center">
                          ✨ Linting
                        </div>
                      )}
                    </div>

                    {/* Patterns */}
                    {aiAnalysis.patternsDetected &&
                      Array.isArray(aiAnalysis.patternsDetected) &&
                      aiAnalysis.patternsDetected.length > 0 && (
                        <div>
                          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                            Detected Patterns
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.patternsDetected.map((pattern, i) => (
                              <span
                                key={i}
                                className="flex items-center gap-1 px-2 py-1 bg-[#1A1F2E] rounded-lg border border-[#334155]"
                              >
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span className="text-xs text-white">
                                  {safeRender(pattern)}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>

              {/* Key Features from AI */}
              {aiAnalysis.keyFeatures &&
                Array.isArray(aiAnalysis.keyFeatures) &&
                aiAnalysis.keyFeatures.length > 0 && (
                  <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
                        Key Features
                      </h3>
                      <button
                        onClick={() => toggleSection("features")}
                        className="text-[#94A3B8] hover:text-white transition-colors"
                      >
                        {expandedSections.features ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {expandedSections.features && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {aiAnalysis.keyFeatures.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-3 bg-[#1A1F2E] rounded-lg"
                          >
                            <span className="text-[#60A5FA] text-lg">•</span>
                            <p className="text-sm text-white">
                              {safeRender(feature)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              {/* Improvement Suggestions */}
              {aiAnalysis.improvementSuggestions &&
                Array.isArray(aiAnalysis.improvementSuggestions) &&
                aiAnalysis.improvementSuggestions.length > 0 && (
                  <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-white flex items-center gap-2">
                        <WrenchScrewdriverIcon className="w-5 h-5 text-[#60A5FA]" />
                        Improvement Suggestions
                      </h3>
                      <button
                        onClick={() => toggleSection("suggestions")}
                        className="text-[#94A3B8] hover:text-white transition-colors"
                      >
                        {expandedSections.suggestions ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {expandedSections.suggestions && (
                      <div className="space-y-3">
                        {aiAnalysis.improvementSuggestions.map(
                          (suggestion, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 bg-[#1A1F2E] rounded-lg border-l-4 border-[#60A5FA]"
                            >
                              <span className="text-[#60A5FA] mt-1">💡</span>
                              <p className="text-sm text-white">
                                {safeRender(suggestion)}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* Recent Commits */}
              {analysis.recentCommits && analysis.recentCommits.length > 0 && (
                <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-[#60A5FA]" />
                      Recent Activity
                    </h3>
                    <button
                      onClick={() => toggleSection("activity")}
                      className="text-[#94A3B8] hover:text-white transition-colors"
                    >
                      {expandedSections.activity ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {expandedSections.activity && (
                    <div className="space-y-3">
                      {analysis.recentCommits.map((commit, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-2 hover:bg-[#1A1F2E] rounded-lg transition"
                        >
                          <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              {commit.message}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-[#60A5FA]">
                                {commit.author}
                              </span>
                              <span className="text-xs text-[#94A3B8]">
                                {formatDate(commit.date)}
                              </span>
                              <span className="text-xs text-[#94A3B8]">
                                {commit.sha}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contributors */}
              {analysis.contributors && analysis.contributors.length > 0 && (
                <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                  <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-[#60A5FA]" />
                    Top Contributors
                  </h3>
                  <div className="space-y-3">
                    {analysis.contributors.slice(0, 5).map((contributor, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 hover:bg-[#1A1F2E] rounded-lg transition"
                      >
                        <div className="flex items-center gap-3">
                          {contributor.avatar ? (
                            <img
                              src={contributor.avatar}
                              alt={contributor.login}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#60A5FA]/20 flex items-center justify-center">
                              <span className="text-xs text-[#60A5FA]">
                                {contributor.login[0]?.toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-white">
                            {contributor.login}
                          </span>
                        </div>
                        <span className="text-xs text-[#94A3B8]">
                          {contributor.contributions} commits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* License Info */}
              {metadata.license && (
                <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                  <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-[#60A5FA]" />
                    License
                  </h3>
                  <p className="text-sm text-[#94A3B8]">{metadata.license}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1A1F2E;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3B82F6;
        }
      `}</style>
      {/* Documentation Modal - ADD THIS HERE */}
      {showDocumentation && (
        <RepositoryDocumentation
          analysis={analysis}
          onClose={() => setShowDocumentation(false)}
        />
      )}
    </div>
  );
}
