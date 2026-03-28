import {
  CubeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { safeRender, formatDate } from "./utils";

export default function InsightsPanel({
  aiAnalysis,
  analysis,
  metadata,
  expandedSections,
  toggleSection
}) {
  return (
    <>
      {/* Key Features from AI */}
      {aiAnalysis.keyFeatures && Array.isArray(aiAnalysis.keyFeatures) && aiAnalysis.keyFeatures.length > 0 && (
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
                <div key={i} className="flex items-start gap-2 p-3 bg-[#1A1F2E] rounded-lg">
                  <span className="text-[#60A5FA] text-lg">•</span>
                  <p className="text-sm text-white">{safeRender(feature)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Improvement Suggestions */}
      {aiAnalysis.improvementSuggestions && Array.isArray(aiAnalysis.improvementSuggestions) && aiAnalysis.improvementSuggestions.length > 0 && (
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
              {aiAnalysis.improvementSuggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#1A1F2E] rounded-lg border-l-4 border-[#60A5FA]">
                  <span className="text-[#60A5FA] mt-1">💡</span>
                  <p className="text-sm text-white">{safeRender(suggestion)}</p>
                </div>
              ))}
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
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-[#1A1F2E] rounded-lg transition">
                  <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{commit.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#60A5FA]">{commit.author}</span>
                      <span className="text-xs text-[#94A3B8]">{formatDate(commit.date)}</span>
                      <span className="text-xs text-[#94A3B8]">{commit.sha}</span>
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
              <div key={i} className="flex items-center justify-between p-2 hover:bg-[#1A1F2E] rounded-lg transition">
                <div className="flex items-center gap-3">
                  {contributor.avatar ? (
                    <img src={contributor.avatar} alt={contributor.login} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#60A5FA]/20 flex items-center justify-center">
                      <span className="text-xs text-[#60A5FA]">
                        {contributor.login[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-white">{contributor.login}</span>
                </div>
                <span className="text-xs text-[#94A3B8]">{contributor.contributions} commits</span>
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
    </>
  );
}
