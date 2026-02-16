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
  ChevronDownIcon,
  ChevronRightIcon,
  PhotoIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;
  const [expandedFolders, setExpandedFolders] = useState({});
  const [structure, setStructure] = useState([]);

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

  // Get appropriate icon based on file extension
  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(extension)) {
      return <PhotoIcon className="w-4 h-4 text-pink-400" />;
    }
    // JavaScript/TypeScript files
    else if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-yellow-400" />;
    }
    // JSON files
    else if (extension === 'json') {
      return <CubeIcon className="w-4 h-4 text-orange-400" />;
    }
    // CSS/SCSS files
    else if (['css', 'scss', 'sass', 'less'].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-blue-400" />;
    }
    // HTML files
    else if (['html', 'htm'].includes(extension)) {
      return <CodeBracketIcon className="w-4 h-4 text-red-400" />;
    }
    // Markdown files
    else if (['md', 'markdown'].includes(extension)) {
      return <DocumentIcon className="w-4 h-4 text-purple-400" />;
    }
    // Default
    else {
      return <DocumentIcon className="w-4 h-4 text-[#64748B]" />;
    }
  };

  const renderStructure = (items, level = 0, path = '') => {
    return items.map((item, index) => {
      const currentPath = `${path}/${item.name}`;
      const isExpanded = expandedFolders[currentPath];
      const indent = level * 16;

      if (item.type === 'dir') {
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
              <FolderIcon className={`w-5 h-5 transition-colors ${isExpanded ? 'text-[#60A5FA]' : 'text-[#94A3B8] group-hover:text-[#60A5FA]'}`} />
              <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div className="border-l border-[#334155] ml-6 pl-2">
                {renderStructure(item.children, level + 1, currentPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={currentPath}
            className="flex items-center gap-2 py-1.5 hover:bg-[#1A1F2E] rounded-lg px-3 transition-all duration-200 group"
            style={{ marginLeft: `${indent + 24}px` }}
          >
            {getFileIcon(item.name)}
            <span className="text-gray-400 text-sm group-hover:text-white transition-colors">{item.name}</span>
          </div>
        );
      }
    });
  };

  // Helper function to count files recursively
  const countFiles = (items) => {
    let count = 0;
    items.forEach(item => {
      if (item.type === 'file') count++;
      if (item.children) count += countFiles(item.children);
    });
    return count;
  };

  // Helper function to count directories recursively
  const countDirs = (items) => {
    let count = 0;
    items.forEach(item => {
      if (item.type === 'dir') {
        count++;
        if (item.children) count += countDirs(item.children);
      }
    });
    return count;
  };

  // Get tech color based on technology name
  const getTechColor = (tech) => {
    const t = tech.toLowerCase();
    if (t.includes('react') || t.includes('vue') || t.includes('angular')) return 'from-blue-500 to-cyan-500';
    if (t.includes('node') || t.includes('express')) return 'from-green-500 to-emerald-500';
    if (t.includes('python') || t.includes('django')) return 'from-yellow-500 to-orange-500';
    if (t.includes('java') || t.includes('spring')) return 'from-red-500 to-pink-500';
    if (t.includes('typescript') || t.includes('javascript')) return 'from-yellow-400 to-amber-500';
    if (t.includes('postgres') || t.includes('mysql') || t.includes('mongodb')) return 'from-purple-500 to-indigo-500';
    if (t.includes('prisma')) return 'from-teal-500 to-emerald-500';
    if (t.includes('docker')) return 'from-blue-600 to-indigo-600';
    if (t.includes('aws') || t.includes('cloud')) return 'from-orange-500 to-red-500';
    return 'from-[#60A5FA] to-[#818CF8]';
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
          {/* Repo Header with Quick Stats */}
          <div className="mb-8 bg-gradient-to-r from-[#0F1320] to-[#1A1F2E] rounded-2xl border border-[#334155] p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {analysis.name}
                  </h1>
                  <div className="flex items-center gap-1 bg-[#1A1F2E] px-3 py-1 rounded-full border border-[#334155]">
                    <StarIcon className="w-4 h-4 text-[#FBBF24]" />
                    <span className="text-sm text-[#94A3B8]">{analysis.stars?.toLocaleString()}</span>
                  </div>
                </div>
                {analysis.description && (
                  <p className="text-[#94A3B8] text-base md:text-lg">{analysis.description}</p>
                )}
              </div>
              
              {/* Compact Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-[#1A1F2E] px-4 py-2 rounded-xl border border-[#334155]">
                  <CubeIcon className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-sm text-[#94A3B8]">Files:</span>
                  <span className="text-white font-semibold">
                    {analysis.structure ? countFiles(analysis.structure) : 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#1A1F2E] px-4 py-2 rounded-xl border border-[#334155]">
                  <FolderIcon className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-sm text-[#94A3B8]">Dirs:</span>
                  <span className="text-white font-semibold">
                    {analysis.structure ? countDirs(analysis.structure) : 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#1A1F2E] px-4 py-2 rounded-xl border border-[#334155]">
                  <CodeBracketIcon className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-sm text-[#94A3B8]">Languages:</span>
                  <span className="text-white font-semibold">{analysis.techStack?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

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
                  <span className="text-xs text-[#60A5FA] bg-[#60A5FA]/10 px-2 py-1 rounded-full">
                    {analysis.structure?.length || 0} items
                  </span>
                </div>
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {renderStructure(structure)}
                </div>
              </div>
            </div>

            {/* Tech Stack & Architecture */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tech Stack */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CodeBracketIcon className="w-5 h-5 text-[#60A5FA]" />
                    Tech Stack
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.techStack?.map((tech, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1.5 bg-gradient-to-r ${getTechColor(tech)} text-white rounded-lg text-xs font-medium shadow-lg`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Architecture */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
                  System Architecture
                </h2>
                
                {/* Architecture Flow Diagram */}
                <div className="relative mb-8">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 bg-[#1A1F2E] rounded-xl p-4 border border-[#334155]">
                      <p className="text-xs text-[#94A3B8] mb-1">Entry</p>
                      <p className="text-sm text-white font-medium">
                        {analysis.techStack?.includes('TypeScript') ? 'main.tsx' : 'index.js'}
                      </p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-[#60A5FA] flex-shrink-0" />
                    <div className="flex-1 bg-[#1A1F2E] rounded-xl p-4 border border-[#334155]">
                      <p className="text-xs text-[#94A3B8] mb-1">App</p>
                      <p className="text-sm text-white font-medium">
                        {analysis.techStack?.includes('TypeScript') ? 'App.tsx' : 'App.js'}
                      </p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-[#60A5FA] flex-shrink-0" />
                    <div className="flex-1 bg-[#1A1F2E] rounded-xl p-4 border border-[#334155]">
                      <p className="text-xs text-[#94A3B8] mb-1">Router</p>
                      <p className="text-sm text-white font-medium">Routes/Pages</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column - Architecture Details */}
                  <div className="space-y-4">
                    {/* Entry Point */}
                    <div className="border-l-2 border-[#60A5FA] pl-3">
                      <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Entry Point</h3>
                      <p className="text-sm text-white">
                        {analysis.techStack?.includes('TypeScript') ? 'main.tsx → App.tsx' : 'index.js → App.js'}
                      </p>
                    </div>

                    {/* Auth Flow (if detected) */}
                    {analysis.architecture?.authFlow && (
                      <div className="border-l-2 border-green-500 pl-3">
                        <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Auth Flow</h3>
                        <p className="text-sm text-white">{analysis.architecture.authFlow}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Data Flow */}
                  <div className="space-y-4">
                    {/* Data Flow */}
                    <div className="border-l-2 border-purple-500 pl-3">
                      <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Data Flow</h3>
                      {analysis.architecture?.dataFlow?.length > 0 ? (
                        analysis.architecture.dataFlow.map((flow, i) => (
                          <p key={i} className="text-sm text-white">{flow}</p>
                        ))
                      ) : (
                        <p className="text-sm text-white">Components → API → Database</p>
                      )}
                    </div>

                    {/* Dependencies */}
                    {analysis.packageJson && (
                      <div className="border-l-2 border-yellow-500 pl-3">
                        <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Dependencies</h3>
                        <p className="text-sm text-white">
                          {analysis.packageJson.dependencies} direct • {analysis.packageJson.devDependencies} dev
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detected Patterns */}
                {analysis.architecture?.patterns && analysis.architecture.patterns.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#334155]">
                    <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">Detected Patterns</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.architecture.patterns.map((pattern, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-1 bg-[#1A1F2E] rounded-lg border border-[#334155]">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <span className="text-xs text-white">{pattern}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* File Type Distribution */}
              {analysis.structure && (
                <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                  <h3 className="text-sm font-medium text-white mb-3">File Distribution</h3>
                  <div className="flex flex-wrap gap-3">
                    {Array.from(new Set(structure
                      .filter(f => f.type === 'file')
                      .map(f => f.extension)
                      .filter(Boolean)
                    )).slice(0, 5).map((ext, i) => {
                      const count = (() => {
                        let total = 0;
                        const countExt = (items) => {
                          items.forEach(item => {
                            if (item.type === 'file' && item.extension === ext) total++;
                            if (item.children) countExt(item.children);
                          });
                        };
                        countExt(structure);
                        return total;
                      })();
                      
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${colors[i % colors.length]} rounded-full`}></div>
                          <span className="text-xs text-[#94A3B8]">.{ext}</span>
                          <span className="text-xs text-white">{count}</span>
                        </div>
                      );
                    })}
                  </div>
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
    </div>
  );
}