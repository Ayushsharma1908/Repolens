import {
  CodeBracketIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { countFiles, countDirs, formatDate } from "./utils";

export default function MetricsGrid({
  metadata,
  analysis,
  stats,
  basicAnalysis,
  enhancedAnalysis,
}) {
  return (
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
              {metadata.size ? `${(metadata.size / 1024).toFixed(2)} MB` : "N/A"}
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
        {enhancedAnalysis.frameworks && enhancedAnalysis.frameworks.length > 0 && (
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
  );
}
