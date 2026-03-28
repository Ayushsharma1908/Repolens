import { FolderIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getFileIcon } from "./utils";

export default function ProjectStructure({ structure, expandedFolders, toggleFolder }) {
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
            const childDirs = item.children?.filter((c) => c.type === "dir").length || 0;
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
                    className={`w-5 h-5 transition-colors ${
                      isExpanded ? "text-[#60A5FA]" : "text-[#94A3B8] group-hover:text-[#60A5FA]"
                    }`}
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
          const fileExtension = item.extension || item.name.split(".").pop() || "";

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
                  "js", "jsx", "ts", "tsx", "py", "java", "go", "rs", "css", "html",
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

  return (
    <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FolderIcon className="w-5 h-5 text-[#60A5FA]" />
          Project Structure
        </h2>
        {structure && Array.isArray(structure) && (
          <span className="text-xs text-[#60A5FA] bg-[#60A5FA]/10 px-2 py-1 rounded-full">
            {structure.length} items
          </span>
        )}
      </div>
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {renderStructure(structure)}
      </div>
    </div>
  );
}
