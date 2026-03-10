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

  // Generate and download PDF with better emoji support
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

      let yPos = 20;

      // Title
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246);
      doc.text("Repository Analysis Report", 20, yPos);

      yPos += 15;

      // Repository Info
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Repository Information", 20, yPos);

      yPos += 10;
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);

      // Helper to ensure emojis are properly handled
      const ensureString = (value) => {
        if (value === null || value === undefined) return "N/A";
        return String(value);
      };

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
        [
          "Repository Size",
          metadata.size ? `${(metadata.size / 1024).toFixed(2)} MB` : "N/A",
        ],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Property", "Value"]],
        body: repoInfo,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: "auto" },
        },
        styles: {
          font: "helvetica",
          fontStyle: "normal",
          fontSize: 10,
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Topics
      if (metadata.topics && metadata.topics.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Topics", 20, yPos);

        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);

        const topicsText = metadata.topics.map((t) => `#${t}`).join("  •  ");
        // Use text with options for better Unicode handling
        doc.text(topicsText, 20, yPos, {
          maxWidth: 170,
          renderingMode: "fill",
        });

        yPos += 15;
      }

      // Statistics
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Repository Statistics", 20, yPos);

      yPos += 10;

      const statsData = [
        [
          "Total Files",
          String(stats.totalFiles || countFiles(analysis?.structure) || "0"),
        ],
        [
          "Total Directories",
          String(stats.totalDirs || countDirs(analysis?.structure) || "0"),
        ],
        ["Total Dependencies", String(basicAnalysis.totalDependencies || "0")],
        ["Contributors", String(analysis.contributors?.length || "0")],
        ["Recent Commits", String(analysis.recentCommits?.length || "0")],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Metric", "Value"]],
        body: statsData,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
        styles: {
          font: "helvetica",
          fontSize: 10,
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Features Detected with emoji support
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Features Detected", 20, yPos);

      yPos += 10;

      const features = [
        ["Docker", basicAnalysis.hasDocker ? "✅ Yes" : "❌ No"],
        ["CI/CD", basicAnalysis.hasCiCd ? "✅ Yes" : "❌ No"],
        ["Tests", basicAnalysis.hasTests ? "✅ Yes" : "❌ No"],
        ["Linting", basicAnalysis.hasLinting ? "✅ Yes" : "❌ No"],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Feature", "Status"]],
        body: features,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
        styles: {
          font: "helvetica",
          fontSize: 10,
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;

      // Tech Stack with emoji support
      if (
        aiAnalysis.mainTechnologies &&
        aiAnalysis.mainTechnologies.length > 0
      ) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Technology Stack", 20, yPos);

        yPos += 10;

        const techRows = aiAnalysis.mainTechnologies.map((tech) => [
          safeRender(tech),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["Technologies"]],
          body: techRows,
          theme: "striped",
          headStyles: { fillColor: [59, 130, 246] },
          styles: {
            font: "helvetica",
            fontSize: 10,
          },
        });

        yPos = doc.lastAutoTable.finalY + 15;
      }

      // Build Tools & Frameworks
      if (
        (enhancedAnalysis.buildTools &&
          enhancedAnalysis.buildTools.length > 0) ||
        (enhancedAnalysis.frameworks && enhancedAnalysis.frameworks.length > 0)
      ) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Build Tools & Frameworks", 20, yPos);

        yPos += 10;

        const toolsData = [];

        if (
          enhancedAnalysis.buildTools &&
          enhancedAnalysis.buildTools.length > 0
        ) {
          toolsData.push([
            "Build Tools",
            enhancedAnalysis.buildTools.map((t) => safeRender(t)).join(", "),
          ]);
        }

        if (
          enhancedAnalysis.frameworks &&
          enhancedAnalysis.frameworks.length > 0
        ) {
          toolsData.push([
            "Frameworks",
            enhancedAnalysis.frameworks.map((f) => safeRender(f)).join(", "),
          ]);
        }

        autoTable(doc, {
          startY: yPos,
          body: toolsData,
          theme: "striped",
          columnStyles: {
            0: { cellWidth: 50, fontStyle: "bold" },
            1: { cellWidth: "auto" },
          },
          styles: {
            font: "helvetica",
            fontSize: 10,
          },
        });

        yPos = doc.lastAutoTable.finalY + 15;
      }

      // Architecture
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Architecture Analysis", 20, yPos);

      yPos += 10;

      const archData = [
        ["Project Type", safeRender(aiAnalysis.projectType) || "N/A"],
        [
          "Architecture Style",
          safeRender(aiAnalysis.architectureStyle) || "N/A",
        ],
      ];

      autoTable(doc, {
        startY: yPos,
        body: archData,
        theme: "striped",
        columnStyles: {
          0: { cellWidth: 50, fontStyle: "bold" },
          1: { cellWidth: "auto" },
        },
        styles: {
          font: "helvetica",
          fontSize: 10,
        },
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Architecture Layers
      if (aiAnalysis.layers && aiAnalysis.layers.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Architecture Layers:", 20, yPos);

        yPos += 7;
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);

        aiAnalysis.layers.forEach((layer) => {
          const text = `• ${safeRender(layer)}`;
          // Split text to handle long strings with emojis
          const splitText = doc.splitTextToSize(text, 170);
          doc.text(splitText, 25, yPos);
          yPos += splitText.length * 7;
        });

        yPos += 5;
      }

      // Key Features
      if (aiAnalysis.keyFeatures && aiAnalysis.keyFeatures.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Key Features", 20, yPos);

        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);

        aiAnalysis.keyFeatures.forEach((feature) => {
          const text = `• ${safeRender(feature)}`;
          const splitText = doc.splitTextToSize(text, 170);
          doc.text(splitText, 20, yPos);
          yPos += splitText.length * 7;
        });

        yPos += 5;
      }

      // Data Flow
      if (aiAnalysis.dataFlow && aiAnalysis.dataFlow.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Data Flow", 20, yPos);

        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);

        aiAnalysis.dataFlow.forEach((flow) => {
          const text = `• ${safeRender(flow)}`;
          const splitText = doc.splitTextToSize(text, 170);
          doc.text(splitText, 20, yPos);
          yPos += splitText.length * 7;
        });

        yPos += 5;
      }

      // Detected Patterns
      if (
        aiAnalysis.patternsDetected &&
        aiAnalysis.patternsDetected.length > 0
      ) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Detected Patterns", 20, yPos);

        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);

        aiAnalysis.patternsDetected.forEach((pattern) => {
          const text = `• ${safeRender(pattern)}`;
          doc.text(text, 20, yPos);
          yPos += 7;
        });

        yPos += 5;
      }

      // Improvement Suggestions
      if (
        aiAnalysis.improvementSuggestions &&
        aiAnalysis.improvementSuggestions.length > 0
      ) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Improvement Suggestions", 20, yPos);

        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);

        aiAnalysis.improvementSuggestions.forEach((suggestion, index) => {
          const text = `${index + 1}. ${safeRender(suggestion)}`;
          const splitText = doc.splitTextToSize(text, 170);
          doc.text(splitText, 20, yPos);
          yPos += splitText.length * 7;
        });

        yPos += 5;
      }

      // Recent Commits
      if (analysis.recentCommits && analysis.recentCommits.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Recent Commits", 20, yPos);

        yPos += 10;

        const commitsData = analysis.recentCommits.map((commit) => [
          commit.sha?.substring(0, 7) || "N/A",
          commit.message?.substring(0, 40) +
            (commit.message?.length > 40 ? "..." : ""),
          commit.author || "N/A",
          formatDate(commit.date),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["Hash", "Message", "Author", "Date"]],
          body: commitsData,
          theme: "striped",
          headStyles: { fillColor: [59, 130, 246] },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 70 },
            2: { cellWidth: 30 },
            3: { cellWidth: 35 },
          },
          styles: {
            font: "helvetica",
            fontSize: 9,
          },
        });

        yPos = doc.lastAutoTable.finalY + 15;
      }

      // Contributors
      if (analysis.contributors && analysis.contributors.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Top Contributors", 20, yPos);

        yPos += 10;

        const contributorsData = analysis.contributors.map((contributor) => [
          contributor.login || "N/A",
          String(contributor.contributions || "0"),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["Username", "Contributions"]],
          body: contributorsData,
          theme: "striped",
          headStyles: { fillColor: [59, 130, 246] },
          styles: {
            font: "helvetica",
            fontSize: 10,
          },
        });

        yPos = doc.lastAutoTable.finalY + 15;
      }

      // File Distribution
      if (stats.fileTypes && Object.keys(stats.fileTypes).length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("File Distribution", 20, yPos);

        yPos += 10;

        const fileTypesData = Object.entries(stats.fileTypes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([ext, count]) => {
            const percentage = ((count / stats.totalFiles) * 100).toFixed(1);
            return [`.${ext}`, String(count), `${percentage}%`];
          });

        autoTable(doc, {
          startY: yPos,
          head: [["Extension", "Count", "Percentage"]],
          body: fileTypesData,
          theme: "striped",
          headStyles: { fillColor: [59, 130, 246] },
          styles: {
            font: "helvetica",
            fontSize: 10,
          },
        });
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
