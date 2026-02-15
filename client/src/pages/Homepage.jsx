// client/pages/HomePage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RepoLensLogo from "../assets/Repolenslogo.svg";
import { 
  FolderIcon, 
  DocumentIcon, 
  CodeBracketIcon,
  StarIcon,
  CubeIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;
  const [expandedFolders, setExpandedFolders] = useState({});
  const [structure, setStructure] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (analysis?.structure) {
      setStructure(analysis.structure);
    }
  }, [analysis]);

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderStructure = (items, level = 0, path = '') => {
    return items.map((item, index) => {
      const currentPath = `${path}/${item.name}`;
      const isExpanded = expandedFolders[currentPath];
      const indent = level * 20;

      if (item.type === 'dir') {
        return (
          <div key={currentPath} className="select-none">
            <div 
              className="flex items-center gap-2 py-1.5 hover:bg-[#1A1F2E] rounded px-2 cursor-pointer transition-colors"
              style={{ marginLeft: `${indent}px` }}
              onClick={() => toggleFolder(currentPath)}
            >
              <span className="text-[#94A3B8]">
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </span>
              <FolderIcon className="w-5 h-5 text-[#60A5FA]" />
              <span className="text-white text-sm">{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div>
                {renderStructure(item.children, level + 1, currentPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={currentPath}
            className="flex items-center gap-2 py-1.5 hover:bg-[#1A1F2E] rounded px-2 transition-colors"
            style={{ marginLeft: `${indent + 24}px` }}
          >
            <DocumentIcon className="w-4 h-4 text-[#64748B]" />
            <span className="text-[#94A3B8] text-sm">{item.name}</span>
          </div>
        );
      }
    });
  };

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
      <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm z-10">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-[#3B82F6] rounded-xl flex items-center justify-center">
              <img src={RepoLensLogo} alt="RepoLens Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">RepoLens</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="text-sm text-[#94A3B8] hover:text-white transition px-4 py-2 rounded-lg hover:bg-[#1A1F2E]"
            >
              New Analysis
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative px-6 py-8 md:px-12 md:py-12 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Repo Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {analysis.name}
              </h1>
              <div className="flex items-center gap-1 bg-[#1A1F2E] px-3 py-1 rounded-full">
                <StarIcon className="w-4 h-4 text-[#FBBF24]" />
                <span className="text-sm text-[#94A3B8]">{analysis.stars?.toLocaleString()}</span>
              </div>
            </div>
            {analysis.description && (
              <p className="text-[#94A3B8] text-lg">{analysis.description}</p>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-6">
              <div className="flex items-center gap-3 mb-2">
                <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
                <h3 className="text-sm font-medium text-[#94A3B8]">Total Files</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {analysis.structure?.filter(f => f.type === 'file').length || 0}
              </p>
            </div>
            <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-6">
              <div className="flex items-center gap-3 mb-2">
                <FolderIcon className="w-5 h-5 text-[#60A5FA]" />
                <h3 className="text-sm font-medium text-[#94A3B8]">Directories</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {analysis.structure?.filter(f => f.type === 'dir').length || 0}
              </p>
            </div>
            <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-6">
              <div className="flex items-center gap-3 mb-2">
                <CodeBracketIcon className="w-5 h-5 text-[#60A5FA]" />
                <h3 className="text-sm font-medium text-[#94A3B8]">Languages</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {analysis.techStack?.length || 0}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Structure */}
            <div className="lg:col-span-1">
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderIcon className="w-5 h-5 text-[#60A5FA]" />
                  Project Structure
                </h2>
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {renderStructure(structure)}
                </div>
              </div>
            </div>

            {/* Tech Stack & Architecture */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tech Stack */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CodeBracketIcon className="w-5 h-5 text-[#60A5FA]" />
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {analysis.techStack?.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-[#1A1F2E] text-[#60A5FA] rounded-lg text-sm font-medium border border-[#334155]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Architecture */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
                  System Architecture
                </h2>
                <div className="space-y-6">
                  {/* Entry Point */}
                  <div className="border-l-2 border-[#60A5FA] pl-4">
                    <h3 className="text-sm font-medium text-[#94A3B8] mb-2">1. Entry Point</h3>
                    <p className="text-white">
                      {analysis.techStack?.includes('TypeScript') ? 'main.tsx' : 'index.js'} → App → Router
                    </p>
                  </div>

                  {/* Auth Flow (if detected) */}
                  {analysis.structure?.some(f => f.name.includes('auth')) && (
                    <div className="border-l-2 border-[#60A5FA] pl-4">
                      <h3 className="text-sm font-medium text-[#94A3B8] mb-2">2. Auth Flow</h3>
                      <p className="text-white">auth.js → JWT → Context API</p>
                    </div>
                  )}

                  {/* Data Flow */}
                  <div className="border-l-2 border-[#60A5FA] pl-4">
                    <h3 className="text-sm font-medium text-[#94A3B8] mb-2">
                      {analysis.techStack?.includes('TypeScript') ? '3. Data Flow' : '2. Data Flow'}
                    </h3>
                    <p className="text-white">
                      Components → API Layer → Database
                    </p>
                  </div>

                  {/* Detected Patterns */}
                  <div className="mt-4 pt-4 border-t border-[#334155]">
                    <h3 className="text-sm font-medium text-[#94A3B8] mb-3">Detected Patterns</h3>
                    <div className="space-y-2">
                      {analysis.structure?.some(f => f.name.includes('component')) && (
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span className="text-sm text-white">Component-based architecture</span>
                        </div>
                      )}
                      {analysis.structure?.some(f => f.name.includes('service')) && (
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span className="text-sm text-white">Service layer pattern</span>
                        </div>
                      )}
                      {analysis.techStack?.includes('Prisma') && (
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span className="text-sm text-white">Prisma ORM for database</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
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
    </div>
  );
}