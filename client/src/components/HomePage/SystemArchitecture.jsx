import { CubeIcon, ChevronUpIcon, ChevronDownIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { safeRender } from "./utils";

export default function SystemArchitecture({
  aiAnalysis,
  basicAnalysis,
  enhancedAnalysis,
  analysis,
  expandedSections,
  toggleSection
}) {
  // Helper function to find Python files in the structure
  const findPythonFiles = (items, path = "") => {
    let pythonFiles = [];

    const search = (items, currentPath) => {
      items.forEach((item) => {
        const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;
        if (item.type === "file" && item.name.endsWith(".py")) {
          pythonFiles.push(fullPath);
        }
        if (item.children) {
          search(item.children, fullPath);
        }
      });
    };

    if (items) {
      search(items, "");
    }
    return pythonFiles;
  };

  return (
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
              {safeRender(aiAnalysis.projectType) || "Unknown Project Type"}
            </span>
            <span className="px-3 py-1 bg-[#1A1F2E] text-[#60A5FA] rounded-full text-xs font-medium border border-[#334155]">
              {safeRender(aiAnalysis.architectureStyle) || "Unknown Architecture"}
            </span>
            {basicAnalysis.primaryLanguage && basicAnalysis.primaryLanguage !== "Unknown" && (
              <span className="px-3 py-1 bg-[#1A1F2E] text-green-400 rounded-full text-xs font-medium border border-[#334155]">
                🎯 {basicAnalysis.primaryLanguage}
              </span>
            )}
          </div>

          {/* Build Tools */}
          {enhancedAnalysis.buildTools && enhancedAnalysis.buildTools.length > 0 && (
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
          {aiAnalysis.layers && Array.isArray(aiAnalysis.layers) && aiAnalysis.layers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                Architecture Layers
              </h3>
              <div className="space-y-2">
                {aiAnalysis.layers.map((layer, i) => (
                  <div key={i} className="border-l-2 border-[#60A5FA] pl-3">
                    <p className="text-sm text-white">{safeRender(layer)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Flow */}
          {aiAnalysis.dataFlow && Array.isArray(aiAnalysis.dataFlow) && aiAnalysis.dataFlow.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                Data Flow
              </h3>
              <div className="space-y-2">
                {aiAnalysis.dataFlow.map((flow, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ArrowPathIcon className="w-4 h-4 text-[#60A5FA] mt-0.5" />
                    <p className="text-sm text-white">{safeRender(flow)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Structure from AI */}
          {aiAnalysis.projectStructure && Array.isArray(aiAnalysis.projectStructure) && aiAnalysis.projectStructure.length > 0 && (
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
          {analysis.structure && findPythonFiles(analysis.structure).length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                Python Files
              </h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {findPythonFiles(analysis.structure)
                  .slice(0, 5)
                  .map((file, i) => (
                    <p key={i} className="text-sm text-white font-mono">
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
          {aiAnalysis.patternsDetected && Array.isArray(aiAnalysis.patternsDetected) && aiAnalysis.patternsDetected.length > 0 && (
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
                    <span className="text-xs text-white">{safeRender(pattern)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
