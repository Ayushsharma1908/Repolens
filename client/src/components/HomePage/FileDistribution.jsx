import { DocumentIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function FileDistribution({ stats, expandedSections, toggleSection }) {
  if (!stats.fileTypes || Object.keys(stats.fileTypes).length === 0) return null;

  return (
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
              const percentage = ((count / stats.totalFiles) * 100).toFixed(1);
              return (
                <div key={ext} className="flex items-center gap-3">
                  <span className="text-xs text-[#94A3B8] w-16">.{ext}</span>
                  <div className="flex-1 h-2 bg-[#1A1F2E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#60A5FA] to-[#818CF8] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-white w-12">{count} files</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
