import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RepoLensLogo from "../assets/Repolenslogo.svg";
import RepositoryDocumentation from "./RepositoryDocumentation";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";
import { PlusCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

// Import modular components
import RepoHeader from "../components/HomePage/RepoHeader";
import MetricsGrid from "../components/HomePage/MetricsGrid";
import FileDistribution from "../components/HomePage/FileDistribution";
import ProjectStructure from "../components/HomePage/ProjectStructure";
import TechStack from "../components/HomePage/TechStack";
import SystemArchitecture from "../components/HomePage/SystemArchitecture";
import InsightsPanel from "../components/HomePage/InsightsPanel";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;
  const { user } = useAuth();

  // Data pointers
  const metadata = analysis?.metadata || {};
  const basicAnalysis = analysis?.basicAnalysis || {};
  const enhancedAnalysis = analysis?.enhancedAnalysis || {};
  const aiAnalysis = analysis?.aiAnalysis || {};
  const stats = analysis?.stats || {};

  // State
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

  useEffect(() => {
    if (analysis?.structure) {
      setStructure(analysis.structure);
    }
  }, [analysis]);

  useEffect(() => {
    if (user === null) {
      navigate("/signin");
    }
  }, [user, navigate]);

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

  // Safely process technologies for categorization
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

  const categorizedTech = {
    languages: safeTechnologies.filter((tech) =>
      ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby", "Kotlin", "Swift"].includes(tech)
    ),
    frontend: safeTechnologies.filter((tech) =>
      ["React", "Vue", "Angular", "HTML", "CSS", "Tailwind", "Bootstrap", "Next.js", "Gatsby", "Svelte"].includes(tech)
    ),
    backend: safeTechnologies.filter((tech) =>
      ["Node.js", "Express", "Django", "Flask", "Spring", "Laravel", "Rails", "FastAPI", "GraphQL"].includes(tech)
    ),
    database: safeTechnologies.filter((tech) =>
      ["MongoDB", "PostgreSQL", "MySQL", "Redis", "SQLite", "Firebase", "Supabase", "Prisma"].includes(tech)
    ),
    ai_ml: safeTechnologies.filter((tech) =>
      ["TensorFlow", "PyTorch", "Keras", "OpenAI", "LLaMA", "GPT", "Hugging Face", "LangChain"].includes(tech)
    ),
    devTools: safeTechnologies.filter((tech) =>
      ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Webpack", "Vite", "Babel", "ESLint"].includes(tech)
    ),
    cloud: safeTechnologies.filter((tech) =>
      ["AWS", "Azure", "GCP", "Vercel", "Netlify", "Cloudflare"].includes(tech)
    ),
    testing: safeTechnologies.filter((tech) =>
      ["Jest", "Mocha", "Cypress", "Playwright", "Pytest", "JUnit"].includes(tech)
    ),
    mobile: safeTechnologies.filter((tech) =>
      ["React Native", "Flutter", "SwiftUI", "Jetpack Compose", "Ionic"].includes(tech)
    ),
    other: safeTechnologies.filter((tech) =>
      ![
        "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby", "Kotlin", "Swift",
        "React", "Vue", "Angular", "HTML", "CSS", "Tailwind", "Bootstrap", "Next.js", "Gatsby", "Svelte",
        "Node.js", "Express", "Django", "Flask", "Spring", "Laravel", "Rails", "FastAPI", "GraphQL",
        "MongoDB", "PostgreSQL", "MySQL", "Redis", "SQLite", "Firebase", "Supabase", "Prisma",
        "TensorFlow", "PyTorch", "Keras", "OpenAI", "LLaMA", "GPT", "Hugging Face", "LangChain",
        "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Webpack", "Vite", "Babel", "ESLint",
        "AWS", "Azure", "GCP", "Vercel", "Netlify", "Cloudflare",
        "Jest", "Mocha", "Cypress", "Playwright", "Pytest", "JUnit",
        "React Native", "Flutter", "SwiftUI", "Jetpack Compose", "Ionic",
      ].includes(tech)
    ),
  };

  const getActiveCategories = () => {
    return Object.entries(categorizedTech)
      .filter(([_, techs]) => techs && Array.isArray(techs) && techs.length > 0)
      .map(([category]) => category);
  };

  const activeCategories = getActiveCategories();
  const previewLimit = 4;
  const previewCategories = activeCategories.slice(0, previewLimit);
  const hiddenCategories = activeCategories.slice(previewLimit);

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white">
        <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm">
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 bg-[#3B82F6] rounded-xl flex items-center justify-center">
                <img src={RepoLensLogo} alt="RepoLens Logo" className="w-9 h-9 object-contain" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">RepoLens</span>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl text-[#94A3B8] mb-4">No analysis data found</h2>
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
          <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-[#3B82F6] rounded-xl flex items-center justify-center">
              <img src={RepoLensLogo} alt="RepoLens Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">RepoLens</span>
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
            <div className="relative">
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

      {/* Main Content */}
      <main className="relative px-6 py-8 md:px-12 md:py-12 z-10">
        <div className="max-w-7xl mx-auto">
          <RepoHeader metadata={metadata} analysis={analysis} stats={stats} aiAnalysis={aiAnalysis} />
          
          <MetricsGrid 
            metadata={metadata} 
            analysis={analysis} 
            stats={stats} 
            basicAnalysis={basicAnalysis} 
            enhancedAnalysis={enhancedAnalysis} 
          />

          <FileDistribution 
            stats={stats} 
            expandedSections={expandedSections} 
            toggleSection={toggleSection} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Structure */}
            <div className="lg:col-span-1">
              <ProjectStructure 
                structure={structure} 
                expandedFolders={expandedFolders} 
                toggleFolder={toggleFolder} 
              />
            </div>

            {/* Tech Stack & Architecture & Insights */}
            <div className="lg:col-span-2 space-y-6">
              <TechStack 
                aiAnalysis={aiAnalysis}
                analysis={analysis}
                categorizedTech={categorizedTech}
                previewCategories={previewCategories}
                hiddenCategories={hiddenCategories}
                expandedCategories={expandedCategories}
                setExpandedCategories={setExpandedCategories}
              />

              <SystemArchitecture 
                aiAnalysis={aiAnalysis}
                basicAnalysis={basicAnalysis}
                enhancedAnalysis={enhancedAnalysis}
                analysis={analysis}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />

              <InsightsPanel 
                aiAnalysis={aiAnalysis}
                analysis={analysis}
                metadata={metadata}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
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
      
      {showDocumentation && (
        <RepositoryDocumentation
          analysis={analysis}
          onClose={() => setShowDocumentation(false)}
        />
      )}
    </div>
  );
}
