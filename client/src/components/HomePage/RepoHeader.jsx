import { StarIcon, CubeIcon, FolderIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { countFiles, countDirs } from "./utils";

export default function RepoHeader({ metadata, analysis, stats, aiAnalysis }) {
  return (
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
  );
}
