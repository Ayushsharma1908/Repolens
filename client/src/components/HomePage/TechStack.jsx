import { CodeBracketIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { getCategoryIcon, categoryNames, categoryColors } from "./utils";

export default function TechStack({
  aiAnalysis,
  analysis,
  categorizedTech,
  previewCategories,
  hiddenCategories,
  expandedCategories,
  setExpandedCategories
}) {
  return (
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
            if (!technologies || technologies.length === 0) return null;

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
                  <span className="text-xs text-[#94A3B8]">({technologies.length})</span>
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
                onClick={() => setExpandedCategories(!expandedCategories)}
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
                  if (!technologies || technologies.length === 0) return null;

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
                        <span className="text-xs text-[#94A3B8]">({technologies.length})</span>
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
  );
}
