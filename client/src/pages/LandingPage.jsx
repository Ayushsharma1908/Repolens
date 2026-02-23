import { useNavigate } from "react-router-dom";
import RepoLensLogo from "../assets/Repolenslogo.svg";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white relative overflow-hidden">
      {/* Background Glow Effects - Static - Lighter Blue */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#60A5FA]/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#38BDF8]/20 rounded-full blur-[150px]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#818CF8]/10 rounded-full blur-[180px]"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#A78BFA]/20 rounded-full blur-[100px]"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-[#7DD3FC]/20 rounded-full blur-[100px]"></div>
      <div className="absolute top-[40%] left-[15%] w-64 h-64 bg-[#C084FC]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[30%] right-[15%] w-72 h-72 bg-[#5EEAD4]/10 rounded-full blur-[120px]"></div>

      {/* Header */}
      <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm z-10">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={RepoLensLogo}
              alt="RepoLens Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-xl font-semibold text-white tracking-tight">
              RepoLens
            </span>
          </div>
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-[#94A3B8] hover:text-white transition text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[#94A3B8] hover:text-white transition text-sm font-medium"
            >
              How it Works
            </a>
            <a
              href="https://github.com/Ayushsharma1908/gitbuddy/tree/main"
              className="text-[#94A3B8] hover:text-white transition text-sm font-medium"
            >
              GitHub
            </a>
          </div>

          {/* Get Started Button - Teal with black text and rocket */}
          <button
            onClick={() => navigate("/signin")}
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-black px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <span>Get Started</span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full px-6 py-16 md:px-12 md:py-24 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            {/* "New" Badge - Lighter Blue */}
            <div className="inline-flex items-center gap-2 bg-[#1E293B]/80 backdrop-blur-sm px-4 py-2 rounded-full mb-8 shadow-lg shadow-blue-400/5 border border-[#475569]">
              <span className="w-2 h-2 bg-[#60A5FA] rounded-full"></span>
              <span className="text-sm font-medium text-[#94A3B8]">
                New:{" "}
                <span className="text-white">
                  AI-Powered Codebase Visualization
                </span>
              </span>
            </div>

            {/* Main Headline - with gradient on "any codebase" */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              See through the noise
              <br />
              of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#C084FC]">
                any codebase.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-[#94A3B8] mb-10 max-w-3xl mx-auto leading-relaxed">
              RepoLens visualizes project structures, identifies tech stacks,
              and suggests AI-driven improvements in seconds. Stop guessing,
              start building.
            </p>

            {/* GitHub Repository Link - Lighter Blue */}
            <div className="mb-12">
              <a
                href="https://github.com/username/repository"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-white transition group bg-[#1A1F2E]/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-[#475569] shadow-lg shadow-blue-400/5"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-[#60A5FA] font-medium">
                  github.com/username/repository
                </span>
              </a>
            </div>

            {/* Input Field with Lighter Blue Analyze Button */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/20 to-[#38BDF8]/20 rounded-xl blur-md"></div>
                <div className="relative bg-[#1A1F2E]/90 backdrop-blur-sm rounded-xl border border-[#475569] shadow-lg shadow-blue-400/10">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="https://github.com/facebook/react"
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 text-white placeholder-[#64748B] text-sm rounded-xl"
                  />
                </div>
              </div>
              <button className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-xl font-medium transition-all whitespace-nowrap shadow-lg shadow-blue-400/30 hover:shadow-blue-400/50">
                Analyze
              </button>
            </div>

            {/* "Check Here!" Link - Lighter Blue */}
            <p className="text-sm text-[#64748B] mt-6">
              Don't know how it works?{" "}
              <a
                href="#how-it-works"
                className="text-[#60A5FA] hover:text-white underline underline-offset-4 transition"
              >
                Check Here!
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - Updated with Lighter Blues */}
      <section
        id="features"
        className="relative w-full px-6 py-20 md:px-12 md:py-28 z-10"
      >
        {/* Section background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#60A5FA]/5 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[#60A5FA] font-semibold text-sm uppercase tracking-wider">
              Powerful Features
            </span>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              Our AI-powered platform gives you complete visibility into any
              GitHub repository
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Feature 1 - Visual Project Tree - Lighter Blue */}
            <div className="lg:col-span-7 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/20 to-[#818CF8]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#818CF8] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/30">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium bg-[#60A5FA]/20 text-[#93C5FD] px-3 py-1.5 rounded-full border border-[#60A5FA]/30">
                    Interactive
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Visual Project Tree
                </h3>
                <p className="text-[#94A3B8] mb-6 text-lg leading-relaxed flex-grow">
                  See the complete structure of any codebase with our
                  interactive tree visualization. Navigate through folders,
                  files, and dependencies with ease.
                </p>
              </div>
            </div>

            {/* Feature 2 - Tech Stack Detection - Lighter Purple/Blue */}
            <div className="lg:col-span-5 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#818CF8]/20 to-[#A78BFA]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-[#818CF8] to-[#A78BFA] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-400/30">
                  <svg
                    className="w-7 h-7 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm8-8h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Tech Stack Detection
                </h3>
                <p className="text-[#94A3B8] mb-6 text-lg leading-relaxed flex-grow">
                  Instantly identify languages, frameworks, libraries, and tools
                  used in any repository.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-[#1E293B] text-[#94A3B8] px-3 py-1.5 rounded-full">
                    React
                  </span>
                  <span className="text-xs bg-[#1E293B] text-[#94A3B8] px-3 py-1.5 rounded-full">
                    TypeScript
                  </span>
                  <span className="text-xs bg-[#1E293B] text-[#94A3B8] px-3 py-1.5 rounded-full">
                    Node.js
                  </span>
                  <span className="text-xs bg-[#1E293B] text-[#94A3B8] px-3 py-1.5 rounded-full">
                    Python
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 3 - Beginner Friendly - Lighter Sky/Blue */}
            <div className="lg:col-span-5 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7DD3FC]/20 to-[#60A5FA]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7DD3FC] to-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg shadow-sky-400/30">
                    <svg
                      className="w-7 h-7 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full border border-green-500/30">
                    For Everyone
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Beginner Friendly
                </h3>
                <p className="text-[#94A3B8] mb-4 text-lg leading-relaxed">
                  Complex code broken down into plain English explanations.
                  Perfect for junior developers and non-technical stakeholders.
                </p>
                <div className="mt-auto">
                  <div className="bg-[#1E293B]/50 rounded-xl p-4 border border-[#475569]">
                    <p className="text-sm text-[#94A3B8] italic">
                      "This function handles user authentication by validating
                      JWT tokens and checking session expiry..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4 - Smart Suggestions - Lighter Purple/Pink */}
            <div className="lg:col-span-7 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/20 to-[#F472B6]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#A78BFA] to-[#F472B6] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-400/30">
                    <svg
                      className="w-7 h-7 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-[#60A5FA] rounded-full border-2 border-[#0F1320] flex items-center justify-center text-xs font-bold">
                      AI
                    </div>
                    <div className="w-8 h-8 bg-[#A78BFA] rounded-full border-2 border-[#0F1320] flex items-center justify-center text-xs font-bold">
                      ML
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Smart AI Suggestions
                </h3>
                <p className="text-[#94A3B8] mb-6 text-lg leading-relaxed">
                  Get personalized recommendations on where to start, what to
                  learn next, and potential improvements for the codebase.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-[#1E293B]/30 rounded-lg p-3 border border-[#475569]">
                    <span className="text-xs text-[#94A3B8] block mb-1">
                      Entry Point
                    </span>
                    <span className="text-sm font-medium text-white">
                      src/App.js
                    </span>
                  </div>
                  <div className="bg-[#1E293B]/30 rounded-lg p-3 border border-[#475569]">
                    <span className="text-xs text-[#94A3B8] block mb-1">
                      Optimization
                    </span>
                    <span className="text-sm font-medium text-white">
                      Memoize components
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Simple Steps Section */}
      <section
        id="how-it-works"
        className="relative w-full px-6 py-20 md:px-12 md:py-28 z-10 border-t border-[#334155]"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#60A5FA]/5 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[#60A5FA] font-semibold text-sm uppercase tracking-wider">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              From URL to insights in
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#C084FC]">
                3 simple steps.
              </span>
            </h2>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/20 to-[#818CF8]/20 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/30">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <span className="text-6xl font-bold text-[#60A5FA]/20">
                    01
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Paste your URL
                </h3>
                <p className="text-[#94A3B8] text-lg leading-relaxed">
                  Copy any public or private GitHub repository link and drop it
                  in.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#818CF8]/20 to-[#A78BFA]/20 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/30">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <span className="text-6xl font-bold text-[#60A5FA]/20">
                    02
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Automated Scan
                </h3>
                <p className="text-[#94A3B8] text-lg leading-relaxed">
                  Our engine parses file trees, dependencies, and code patterns.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/20 to-[#F472B6]/20 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/30">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <span className="text-6xl font-bold text-[#60A5FA]/20">
                    03
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Get Your Lens
                </h3>
                <p className="text-[#94A3B8] text-lg leading-relaxed">
                  Interact with a visual map and export detailed analysis
                  reports.
                </p>
              </div>
            </div>
          </div>

          {/* Live Scan Preview */}
          <div className="max-w-4xl mx-auto mt-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/20 via-[#818CF8]/20 to-[#A78BFA]/20 rounded-3xl blur-xl opacity-60"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-[#94A3B8]">
                    Scanning:
                  </span>
                  <span className="text-sm font-semibold text-white bg-[#1E293B] px-3 py-1.5 rounded-full">
                    react-admin-dashboard/
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <p className="text-[#94A3B8] text-sm">
                    Analyzing dependencies...
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-sm">[FOUND]</span>
                      <span className="text-white text-sm font-medium">
                        React v18.2.0
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-sm">[FOUND]</span>
                      <span className="text-white text-sm font-medium">
                        TailwindCSS v3.0
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-sm">[FOUND]</span>
                      <span className="text-white text-sm font-medium">
                        TypeScript
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#334155] pt-6">
                  <div className="bg-[#1E293B]/50 rounded-xl p-5 border border-[#475569]">
                    <span className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mb-2 block">
                      AI Suggestions:
                    </span>
                    <p className="text-[#94A3B8] text-base italic">
                      "Consider refactoring helper.ts to use functional
                      composition for better testability."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full px-6 py-16 md:px-12 md:py-20 border-t border-[#334155] z-10">
        {/* Background glow for CTA */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/5 via-transparent to-[#60A5FA]/5"></div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-[#0F1320]/90 backdrop-blur-sm rounded-2xl p-12 md:p-16 border border-[#334155] shadow-2xl shadow-blue-400/5">
            <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/10 via-transparent to-[#60A5FA]/10 rounded-2xl blur-xl"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to master any codebase?
              </h2>
              <p className="text-lg text-[#94A3B8] mb-8 max-w-xl mx-auto">
                Join 5,000+ developers who are saving hours of onboarding time
                every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-[#3B82F6] hover:bg-[#60A5FA] text-black px-8 py-3.5 rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                  <span>🚀</span>
                  <span>Analyze Your First Repo</span>
                </button>
                <button
                  onClick={() => navigate("/demo")}
                  className="bg-transparent hover:bg-white/10 text-white border border-[#3B82F6]/30 hover:border-[#3B82F6] px-8 py-3.5 rounded-xl font-semibold transition-all"
                >
                  View Demo Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full px-6 py-8 md:px-12 border-t border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={RepoLensLogo}
              alt="RepoLens Logo"
              className="w-7 h-7 object-contain"
            />
            <span className="text-base font-semibold text-white">RepoLens</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-[#64748B] hover:text-white transition"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-[#64748B] hover:text-white transition"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-[#64748B] hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
