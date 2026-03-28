// client/components/RepositoryDocumentation.jsx
import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DocumentIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  CubeIcon,
  FolderIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export default function RepositoryDocumentation({ analysis, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const metadata = analysis?.metadata || {};
  const basicAnalysis = analysis?.basicAnalysis || {};
  const enhancedAnalysis = analysis?.enhancedAnalysis || {};
  const aiAnalysis = analysis?.aiAnalysis || {};
  const stats = analysis?.stats || {};

  // Helper to safely render content
  // Helper to safely render content with emoji support
  const safeRender = (data) => {
    if (typeof data === "string") return data;
    if (typeof data === "number" || typeof data === "boolean")
      return String(data);
    if (typeof data === "object" && data !== null) {
      return (
        data.description ||
        data.name ||
        data.category ||
        data.suggestion ||
        data.message ||
        data.title ||
        JSON.stringify(data)
      );
    }
    return "";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate and download PDF with minimalist styling
  const generatePDF = () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16, // Better for Unicode handling
      });

      // Minimalist Color Palette
      const colors = {
        title: [17, 24, 39], // text-gray-900 
        heading: [31, 41, 55], // text-gray-800
        text: [75, 85, 99], // text-gray-500
        lightText: [107, 114, 128], // text-gray-400
        line: [229, 231, 235], // border-gray-200
        bgLight: [249, 250, 251], // bg-gray-50
      };

      let yPos = 25;

      const checkPageBreak = (neededSpace) => {
        if (yPos + neededSpace > 275) {
          doc.addPage();
          yPos = 25;
        }
      };

      const drawSectionHeader = (title) => {
        checkPageBreak(15);
        doc.setFontSize(14);
        doc.setTextColor(...colors.heading);
        doc.setFont("helvetica", "bold");
        doc.text(title, 20, yPos);
        yPos += 8;
        doc.setFont("helvetica", "normal");
      };

      const drawList = (items, numbered = false) => {
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        items.forEach((item, index) => {
          const prefix = numbered ? `${index + 1}. ` : "• ";
          const text = `${prefix}${safeRender(item)}`;
          const splitText = doc.splitTextToSize(text, 165);
          checkPageBreak(splitText.length * 6);
          doc.text(splitText, 25, yPos);
          yPos += splitText.length * 6;
        });
        yPos += 8;
      };

      const defaultTableStyles = {
        theme: "grid",
        headStyles: { 
           fillColor: colors.bgLight,
           textColor: colors.heading, 
           fontStyle: "bold",
           lineColor: colors.line,
           lineWidth: 0.1,
        },
        bodyStyles: {
           textColor: colors.text,
           lineColor: colors.line,
           lineWidth: 0.1,
        },
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 4,
        },
      };

      // Title
      doc.setFontSize(22);
      doc.setTextColor(...colors.title);
      doc.setFont("helvetica", "bold");
      doc.text("Repository Analysis Report", 20, yPos);

      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(...colors.lightText);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPos);
      
      yPos += 6;
      doc.setDrawColor(...colors.line);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);

      yPos += 15;

      // Helper to ensure strings
      const ensureString = (value) => {
        if (value === null || value === undefined) return "N/A";
        return String(value);
      };

      // Repository Info
      drawSectionHeader("Repository Information");

      const repoInfo = [
        ["Repository Name", ensureString(metadata.name)],
        ["Description", ensureString(metadata.description)],
        ["Primary Language", ensureString(basicAnalysis.primaryLanguage)],
        ["Stars", metadata.stars?.toLocaleString() || "0"],
        ["Forks", metadata.forks?.toLocaleString() || "0"],
        ["Open Issues", metadata.openIssues?.toLocaleString() || "0"],
        ["Created", formatDate(metadata.createdAt)],
        ["Last Updated", formatDate(metadata.updatedAt)],
        ["License", ensureString(metadata.license)],
        ["Repository Size", metadata.size ? `${(metadata.size / 1024).toFixed(2)} MB` : "N/A"],
      ];

      autoTable(doc, {
        startY: yPos,
        body: repoInfo,
        theme: "plain",
        styles: {
          font: "helvetica",
          fontSize: 10,
          textColor: colors.text,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: "bold", textColor: colors.heading },
          1: { cellWidth: "auto" },
        },
      });

      yPos = doc.lastAutoTable.finalY + 12;

      // Topics
      if (metadata.topics && metadata.topics.length > 0) {
        checkPageBreak(15);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.heading);
        doc.text("Topics:", 20, yPos);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.text);
        const topicsText = metadata.topics.join(", ");
        const splitText = doc.splitTextToSize(topicsText, 140);
        doc.text(splitText, 45, yPos);
        yPos += splitText.length * 6 + 8;
      }

      // Statistics
      drawSectionHeader("Repository Statistics");
      const statsData = [
        ["Total Files", String(stats.totalFiles || countFiles(analysis?.structure) || "0")],
        ["Total Directories", String(stats.totalDirs || countDirs(analysis?.structure) || "0")],
        ["Total Dependencies", String(basicAnalysis.totalDependencies || "0")],
        ["Contributors", String(analysis.contributors?.length || "0")],
        ["Recent Commits", String(analysis.recentCommits?.length || "0")],
      ];

      autoTable(doc, {
        ...defaultTableStyles,
        startY: yPos,
        head: [["Metric", "Value"]],
        body: statsData,
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Features Detected
      drawSectionHeader("Features Detected");
      const features = [
        ["Docker", basicAnalysis.hasDocker ? "Yes" : "No"],
        ["CI/CD", basicAnalysis.hasCiCd ? "Yes" : "No"],
        ["Tests", basicAnalysis.hasTests ? "Yes" : "No"],
        ["Linting", basicAnalysis.hasLinting ? "Yes" : "No"],
      ];

      autoTable(doc, {
        ...defaultTableStyles,
        startY: yPos,
        head: [["Feature", "Status"]],
        body: features,
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Tech Stack
      if (aiAnalysis.mainTechnologies && aiAnalysis.mainTechnologies.length > 0) {
        drawSectionHeader("Technology Stack");
        const techRows = aiAnalysis.mainTechnologies.map((tech) => [safeRender(tech)]);
        autoTable(doc, {
          ...defaultTableStyles,
          startY: yPos,
          head: [["Technologies"]],
          body: techRows,
        });
        yPos = doc.lastAutoTable.finalY + 15;
      }

      // Build Tools & Frameworks
      if (
        (enhancedAnalysis.buildTools && enhancedAnalysis.buildTools.length > 0) ||
        (enhancedAnalysis.frameworks && enhancedAnalysis.frameworks.length > 0)
      ) {
        drawSectionHeader("Build Tools & Frameworks");
        const toolsData = [];
        if (enhancedAnalysis.buildTools && enhancedAnalysis.buildTools.length > 0) {
          toolsData.push([
            "Build Tools",
            enhancedAnalysis.buildTools.map((t) => safeRender(t)).join(", "),
          ]);
        }
        if (enhancedAnalysis.frameworks && enhancedAnalysis.frameworks.length > 0) {
          toolsData.push([
            "Frameworks",
            enhancedAnalysis.frameworks.map((f) => safeRender(f)).join(", "),
          ]);
        }
        autoTable(doc, {
          startY: yPos,
          body: toolsData,
          theme: "plain",
          columnStyles: {
            0: { cellWidth: 45, fontStyle: "bold", textColor: colors.heading },
            1: { cellWidth: "auto", textColor: colors.text },
          },
          styles: { font: "helvetica", fontSize: 10, cellPadding: 3 },
        });
        yPos = doc.lastAutoTable.finalY + 15;
      }

      // Architecture Analysis
      drawSectionHeader("Architecture Analysis");
      const archData = [
        ["Project Type", safeRender(aiAnalysis.projectType) || "N/A"],
        ["Architecture Style", safeRender(aiAnalysis.architectureStyle) || "N/A"],
      ];
      autoTable(doc, {
        startY: yPos,
        body: archData,
        theme: "plain",
        columnStyles: {
          0: { cellWidth: 45, fontStyle: "bold", textColor: colors.heading },
          1: { cellWidth: "auto", textColor: colors.text },
        },
        styles: { font: "helvetica", fontSize: 10, cellPadding: 3 },
      });
      yPos = doc.lastAutoTable.finalY + 8;

      if (aiAnalysis.layers && aiAnalysis.layers.length > 0) {
        checkPageBreak(12);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.heading);
        doc.text("Architecture Layers:", 20, yPos);
        yPos += 6;
        drawList(aiAnalysis.layers);
      }

      // Key Features
      if (aiAnalysis.keyFeatures && aiAnalysis.keyFeatures.length > 0) {
        drawSectionHeader("Key Features");
        drawList(aiAnalysis.keyFeatures);
      }

      // Data Flow
      if (aiAnalysis.dataFlow && aiAnalysis.dataFlow.length > 0) {
        drawSectionHeader("Data Flow");
        drawList(aiAnalysis.dataFlow);
      }

      // Detected Patterns
      if (aiAnalysis.patternsDetected && aiAnalysis.patternsDetected.length > 0) {
        drawSectionHeader("Detected Patterns");
        drawList(aiAnalysis.patternsDetected);
      }

      // Improvement Suggestions
      if (aiAnalysis.improvementSuggestions && aiAnalysis.improvementSuggestions.length > 0) {
        drawSectionHeader("Improvement Suggestions");
        drawList(aiAnalysis.improvementSuggestions, true);
      }

      // Recent Commits
      if (analysis.recentCommits && analysis.recentCommits.length > 0) {
        drawSectionHeader("Recent Commits");
        const commitsData = analysis.recentCommits.slice(0, 8).map((commit) => [
          commit.sha?.substring(0, 7) || "N/A",
          commit.message?.substring(0, 50) + (commit.message?.length > 50 ? "..." : ""),
          commit.author || "N/A",
          formatDate(commit.date),
        ]);
        autoTable(doc, {
          ...defaultTableStyles,
          startY: yPos,
          head: [["Hash", "Message", "Author", "Date"]],
          body: commitsData,
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 70 },
            2: { cellWidth: 40 },
            3: { cellWidth: 35 },
          },
        });
        yPos = doc.lastAutoTable.finalY + 15;
      }

      // Contributors
      if (analysis.contributors && analysis.contributors.length > 0) {
        drawSectionHeader("Top Contributors");
        const contributorsData = analysis.contributors.slice(0, 10).map((contributor) => [
          contributor.login || "N/A",
          String(contributor.contributions || "0"),
        ]);
        autoTable(doc, {
          ...defaultTableStyles,
          startY: yPos,
          head: [["Username", "Contributions"]],
          body: contributorsData,
        });
        yPos = doc.lastAutoTable.finalY + 15;
      }

      // File Distribution
      if (stats.fileTypes && Object.keys(stats.fileTypes).length > 0) {
        drawSectionHeader("File Distribution");
        const fileTypesData = Object.entries(stats.fileTypes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([ext, count]) => {
            const percentage = stats.totalFiles ? ((count / stats.totalFiles) * 100).toFixed(1) : "0.0";
            return [`.${ext}`, String(count), `${percentage}%`];
          });
        autoTable(doc, {
          ...defaultTableStyles,
          startY: yPos,
          head: [["Extension", "Count", "Percentage"]],
          body: fileTypesData,
        });
      }

      // Add Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...colors.lightText);
        doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: "right" });
      }

      // Save the PDF
      const filename = `${metadata.name || "repository"}_analysis_report.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to count files (fallback if stats not available)
  const countFiles = (items) => {
    if (!items) return 0;
    let count = 0;
    const countRecursive = (items) => {
      items.forEach((item) => {
        if (item.type === "file") count++;
        if (item.children) countRecursive(item.children);
      });
    };
    countRecursive(items);
    return count;
  };

  // Helper to count directories
  const countDirs = (items) => {
    if (!items) return 0;
    let count = 0;
    const countRecursive = (items) => {
      items.forEach((item) => {
        if (item.type === "dir") {
          count++;
          if (item.children) countRecursive(item.children);
        }
      });
    };
    countRecursive(items);
    return count;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1320] rounded-2xl border border-[#334155] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Repository Documentation
              </h2>
              <p className="text-sm text-[#94A3B8]">
                {metadata.name || "Complete analysis report"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-[#60A5FA] disabled:bg-[#1A1F2E] disabled:cursor-not-allowed rounded-lg text-white transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5 " />
              {isGenerating ? "Generating PDF..." : "Download PDF"}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1A1F2E] rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-[#94A3B8]" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* Repository Info Card */}
          <div className="bg-[#1A1F2E] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
              Repository Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Repository Name</p>
                <p className="text-white">{metadata.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Primary Language</p>
                <p className="text-white">
                  {basicAnalysis.primaryLanguage || "N/A"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-[#94A3B8] mb-1">Description</p>
                <p className="text-white">
                  {metadata.description || "No description provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1A1F2E] rounded-xl p-4">
              <p className="text-xs text-[#94A3B8] mb-1">Files</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalFiles || countFiles(analysis?.structure) || 0}
              </p>
            </div>
            <div className="bg-[#1A1F2E] rounded-xl p-4">
              <p className="text-xs text-[#94A3B8] mb-1">Directories</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalDirs || countDirs(analysis?.structure) || 0}
              </p>
            </div>
            <div className="bg-[#1A1F2E] rounded-xl p-4">
              <p className="text-xs text-[#94A3B8] mb-1">Dependencies</p>
              <p className="text-2xl font-bold text-white">
                {basicAnalysis.totalDependencies || 0}
              </p>
            </div>
            <div className="bg-[#1A1F2E] rounded-xl p-4">
              <p className="text-xs text-[#94A3B8] mb-1">Contributors</p>
              <p className="text-2xl font-bold text-white">
                {analysis.contributors?.length || 0}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          {aiAnalysis.mainTechnologies &&
            aiAnalysis.mainTechnologies.length > 0 && (
              <div className="bg-[#1A1F2E] rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CodeBracketIcon className="w-5 h-5 text-[#60A5FA]" />
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.mainTechnologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#0F1320] text-[#94A3B8] rounded-lg text-sm border border-[#334155]"
                    >
                      {safeRender(tech)}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Architecture */}
          <div className="bg-[#1A1F2E] rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CubeIcon className="w-5 h-5 text-[#60A5FA]" />
              Architecture Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">Project Type</p>
                <p className="text-white">
                  {safeRender(aiAnalysis.projectType) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] mb-1">
                  Architecture Style
                </p>
                <p className="text-white">
                  {safeRender(aiAnalysis.architectureStyle) || "N/A"}
                </p>
              </div>
              {aiAnalysis.layers && aiAnalysis.layers.length > 0 && (
                <div>
                  <p className="text-xs text-[#94A3B8] mb-2">
                    Architecture Layers
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {aiAnalysis.layers.map((layer, index) => (
                      <li key={index} className="text-white text-sm">
                        {safeRender(layer)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Key Features */}
          {aiAnalysis.keyFeatures && aiAnalysis.keyFeatures.length > 0 && (
            <div className="bg-[#1A1F2E] rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DocumentIcon className="w-5 h-5 text-[#60A5FA]" />
                Key Features
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {aiAnalysis.keyFeatures.map((feature, index) => (
                  <li key={index} className="text-white text-sm">
                    {safeRender(feature)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvement Suggestions */}
          {aiAnalysis.improvementSuggestions &&
            aiAnalysis.improvementSuggestions.length > 0 && (
              <div className="bg-[#1A1F2E] rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-[#60A5FA]" />
                  Improvement Suggestions
                </h3>
                <ul className="list-decimal list-inside space-y-2">
                  {aiAnalysis.improvementSuggestions.map(
                    (suggestion, index) => (
                      <li key={index} className="text-white text-sm">
                        {safeRender(suggestion)}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

          {/* Recent Commits */}
          {analysis.recentCommits && analysis.recentCommits.length > 0 && (
            <div className="bg-[#1A1F2E] rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-[#60A5FA]" />
                Recent Commits
              </h3>
              <div className="space-y-3">
                {analysis.recentCommits.slice(0, 5).map((commit, index) => (
                  <div key={index} className="border-l-2 border-[#60A5FA] pl-3">
                    <p className="text-white text-sm">{commit.message}</p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {commit.author} • {formatDate(commit.date)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contributors */}
          {analysis.contributors && analysis.contributors.length > 0 && (
            <div className="bg-[#1A1F2E] rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-[#60A5FA]" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {analysis.contributors.slice(0, 5).map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white">{contributor.login}</span>
                    <span className="text-sm text-[#94A3B8]">
                      {contributor.contributions} commits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* License */}
          {metadata.license && (
            <div className="bg-[#1A1F2E] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-[#60A5FA]" />
                License
              </h3>
              <p className="text-white">{metadata.license}</p>
            </div>
          )}
        </div>
      </div>

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
