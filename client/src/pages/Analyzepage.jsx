import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RepoLensLogo from "../assets/Repolenslogo.svg";
import AnalysisSkeleton from "./AnalysisSkeleton";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";

export default function AnalyzePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false); // This is 'loading', not 'isLoading'
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!repoUrl.trim()) return;

    console.log("Analyzing:", repoUrl);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();

      // ✅ Only navigate if success
      navigate("/homepage", {
        state: {
          analysis: data,
          repoUrl: repoUrl,
        },
      });
    } catch (err) {
      console.error("Error analyzing repo:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show skeleton loading while analyzing - FIXED: changed isLoading to loading
  if (loading) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white relative overflow-hidden">
      {/* Background Glow Effects - Static */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#60A5FA]/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#38BDF8]/20 rounded-full blur-[150px]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#818CF8]/10 rounded-full blur-[180px]"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#A78BFA]/20 rounded-full blur-[100px]"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-[#7DD3FC]/20 rounded-full blur-[100px]"></div>

      {/* Header */}
      <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm z-10">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 bg-[#3B82F6] rounded-xl flex items-center justify-center">
              <img
                src={RepoLensLogo}
                alt="RepoLens Logo"
                className="w-9 h-9 object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">
              RepoLens
            </span>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserProfile />
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="text-sm text-white hover:text-white transition px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#60A5FA]"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative px-6 py-12 md:px-12 md:py-16 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Lens into any
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#C084FC]">
                Repository.
              </span>
            </h1>
            <p className="text-xl text-[#94A3B8] max-w-3xl leading-relaxed">
              Instant insights, code quality metrics, and contributor trends.
              Just paste the URL and we'll handle the rest.
            </p>
          </div>

          {/* URL Input Section */}
          <div className="max-w-3xl mb-16">
            <form
              onSubmit={handleAnalyze}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/20 to-[#818CF8]/20 rounded-xl blur-md"></div>
                <div className="relative bg-[#1A1F2E]/90 backdrop-blur-sm rounded-xl border border-[#334155] shadow-lg shadow-blue-500/10">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748B] text-lg">
                    📂
                  </span>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="Paste your GitHub repo link here..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 text-white placeholder-[#64748B] text-base rounded-xl"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3B82F6] hover:bg-[#60A5FA] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 whitespace-nowrap"
              >
                {loading ? "Analyzing..." : "ANALYZE"}
              </button>
            </form>
            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
          </div>

          {/* Trending Repos */}
          <div className="mb-16">
            <h3 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">
              TREND SETTERS
            </h3>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="https://github.com/facebook/react"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition group"
              >
                <span className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full"></span>
                <span className="text-sm font-medium">facebook/react</span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="https://github.com/tailwindlabs/tailwindcss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition group"
              >
                <span className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full"></span>
                <span className="text-sm font-medium">
                  tailwindlabs/tailwindcss
                </span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="https://github.com/vercel/next.js"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition group"
              >
                <span className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full"></span>
                <span className="text-sm font-medium">vercel/next.js</span>
                <svg
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Recent Analyses (Optional) */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Your Recent Analyses
              </h3>
              <button className="text-sm text-[#60A5FA] hover:text-white transition">
                View all
              </button>
            </div>
            <div className="bg-[#0F1320]/50 rounded-xl border border-[#334155] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1E293B] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-[#60A5FA]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">facebook/react</p>
                    <p className="text-xs text-[#64748B]">
                      Analyzed 2 hours ago • 2.3s
                    </p>
                  </div>
                </div>
                <button className="text-[#60A5FA] hover:text-white text-sm font-medium">
                  View Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}