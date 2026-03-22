import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RepoLensLogo from "../assets/Repolenslogo.svg";
import UserProfile from "../components/UserProfile";
import { useAuth } from "../context/AuthContext";

const CYCLING_WORDS = [
  "any codebase.",
  "open-source projects.",
  "team repositories.",
  "legacy systems.",
  "monorepos.",
  "microservices.",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = CYCLING_WORDS[wordIndex];
    let timeout;

    if (!isDeleting && charIndex < currentWord.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 60);
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 35);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setWordIndex((w) => (w + 1) % CYCLING_WORDS.length);
    }

    setDisplayed(currentWord.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white relative overflow-hidden">
      {/* Background Glow Effects */}
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
          <div className="flex items-center gap-3">
            <img src={RepoLensLogo} alt="RepoLens Logo" className="w-9 h-9 object-contain" />
            <span className="text-xl font-semibold text-white tracking-tight">RepoLens</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#94A3B8] hover:text-white transition text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-[#94A3B8] hover:text-white transition text-sm font-medium">How it Works</a>
            <a href="https://github.com/Ayushsharma1908/gitbuddy/tree/main" className="text-[#94A3B8] hover:text-white transition text-sm font-medium">GitHub</a>
          </div>
          {user ? (
            <UserProfile />
          ) : (
            <button
              onClick={() => navigate("/signin")}
              className="bg-[#3B82F6] hover:bg-[#60A5FA] text-black px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <span>Get Started</span>
            </button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full px-6 py-16 md:px-12 md:py-28 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1E293B]/80 backdrop-blur-sm px-4 py-2 rounded-full mb-8 shadow-lg shadow-blue-400/5 border border-[#475569]">
              <span className="w-2 h-2 bg-[#60A5FA] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-[#94A3B8]">
                New: <span className="text-white">AI-Powered Codebase Visualization</span>
              </span>
            </div>

            {/* Main Headline with Typewriter */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              See through the noise
              <br />
              of{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#C084FC]"
                style={{ display: "inline-block", minWidth: "2ch" }}
              >
                {displayed}
                <span
                  className="inline-block w-[3px] h-[0.85em] bg-[#8B5CF6] ml-1 align-middle"
                  style={{
                    animation: "blink 1s step-end infinite",
                    verticalAlign: "middle",
                    marginBottom: "0.05em",
                  }}
                ></span>
              </span>
            </h1>

            {/* Blinking cursor keyframe */}
            <style>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
            `}</style>

            {/* Description */}
            <p className="text-lg md:text-xl text-[#94A3B8] mb-10 max-w-3xl mx-auto leading-relaxed">
              RepoLens visualizes project structures, identifies tech stacks,
              and suggests AI-driven improvements in seconds. Stop guessing, start building.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-8 py-4 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                <span>🚀</span>
                <span>Start Analyzing — It's Free</span>
              </button>

            </div>

            {/* Social proof */}
            <p className="text-sm text-[#64748B]">
              Trusted by <span className="text-[#94A3B8] font-medium">5,000+ developers</span> · No credit card required
            </p>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative w-full px-6 py-20 md:px-12 md:py-28 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#60A5FA]/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="text-[#60A5FA] font-semibold text-sm uppercase tracking-wider">Powerful Features</span>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mt-2">
              Our AI-powered platform gives you complete visibility into any GitHub repository
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/20 to-[#818CF8]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#818CF8] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/30">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium bg-[#60A5FA]/20 text-[#93C5FD] px-3 py-1.5 rounded-full border border-[#60A5FA]/30">Interactive</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Visual Project Tree</h3>
                <p className="text-[#94A3B8] mb-6 text-lg leading-relaxed flex-grow">
                  See the complete structure of any codebase with our interactive tree visualization. Navigate through folders, files, and dependencies with ease.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#818CF8]/20 to-[#A78BFA]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-[#818CF8] to-[#A78BFA] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-400/30">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm8-8h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Tech Stack Detection</h3>
                <p className="text-[#94A3B8] mb-6 text-lg leading-relaxed flex-grow">
                  Instantly identify languages, frameworks, libraries, and tools used in any repository.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["React", "TypeScript", "Node.js", "Python"].map((t) => (
                    <span key={t} className="text-xs bg-[#1E293B] text-[#94A3B8] px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7DD3FC]/20 to-[#60A5FA]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7DD3FC] to-[#3B82F6] rounded-2xl flex items-center justify-center shadow-lg shadow-sky-400/30">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full border border-green-500/30">For Everyone</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Beginner Friendly</h3>
                <p className="text-[#94A3B8] mb-4 text-lg leading-relaxed">
                  Complex code broken down into plain English explanations. Perfect for junior developers and non-technical stakeholders.
                </p>
                <div className="mt-auto">
                  <div className="bg-[#1E293B]/50 rounded-xl p-4 border border-[#475569]">
                    <p className="text-sm text-[#94A3B8] italic">
                      "This function handles user authentication by validating JWT tokens and checking session expiry..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/20 to-[#F472B6]/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#A78BFA] to-[#F472B6] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-400/30">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-[#60A5FA] rounded-full border-2 border-[#0F1320] flex items-center justify-center text-xs font-bold">AI</div>
                    <div className="w-8 h-8 bg-[#A78BFA] rounded-full border-2 border-[#0F1320] flex items-center justify-center text-xs font-bold">ML</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Smart AI Suggestions</h3>
                <p className="text-[#94A3B8] mb-6 text-lg leading-relaxed">
                  Get personalized recommendations on where to start, what to learn next, and potential improvements for the codebase.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-[#1E293B]/30 rounded-lg p-3 border border-[#475569]">
                    <span className="text-xs text-[#94A3B8] block mb-1">Entry Point</span>
                    <span className="text-sm font-medium text-white">src/App.js</span>
                  </div>
                  <div className="bg-[#1E293B]/30 rounded-lg p-3 border border-[#475569]">
                    <span className="text-xs text-[#94A3B8] block mb-1">Optimization</span>
                    <span className="text-sm font-medium text-white">Memoize components</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative w-full px-6 py-20 md:px-12 md:py-28 z-10 border-t border-[#334155]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#60A5FA]/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="text-[#60A5FA] font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              From URL to insights in
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#C084FC]">
                3 simple steps.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { n: "1", label: "01", title: "Paste your URL", desc: "Copy any public or private GitHub repository link and drop it in.", from: "from-[#60A5FA]/20", to: "to-[#818CF8]/20" },
              { n: "2", label: "02", title: "Automated Scan", desc: "Our engine parses file trees, dependencies, and code patterns.", from: "from-[#818CF8]/20", to: "to-[#A78BFA]/20" },
              { n: "3", label: "03", title: "Get Your Lens", desc: "Interact with a visual map and export detailed analysis reports.", from: "from-[#A78BFA]/20", to: "to-[#F472B6]/20" },
            ].map((s) => (
              <div key={s.n} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.from} ${s.to} rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/30">
                      <span className="text-xl font-bold text-white">{s.n}</span>
                    </div>
                    <span className="text-6xl font-bold text-[#60A5FA]/20">{s.label}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-[#94A3B8] text-lg leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/20 via-[#818CF8]/20 to-[#A78BFA]/20 rounded-3xl blur-xl opacity-60"></div>
              <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-[#94A3B8]">Scanning:</span>
                  <span className="text-sm font-semibold text-white bg-[#1E293B] px-3 py-1.5 rounded-full">react-admin-dashboard/</span>
                </div>
                <div className="space-y-4 mb-6">
                  <p className="text-[#94A3B8] text-sm">Analyzing dependencies...</p>
                  <div className="space-y-2">
                    {["React v18.2.0", "TailwindCSS v3.0", "TypeScript"].map((dep) => (
                      <div key={dep} className="flex items-center gap-2">
                        <span className="text-green-500 text-sm">[FOUND]</span>
                        <span className="text-white text-sm font-medium">{dep}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#334155] pt-6">
                  <div className="bg-[#1E293B]/50 rounded-xl p-5 border border-[#475569]">
                    <span className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider mb-2 block">AI Suggestions:</span>
                    <p className="text-[#94A3B8] text-base italic">
                      "Consider refactoring helper.ts to use functional composition for better testability."
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/5 via-transparent to-[#60A5FA]/5"></div>
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-[#0F1320]/90 backdrop-blur-sm rounded-2xl p-12 md:p-16 border border-[#334155] shadow-2xl shadow-blue-400/5">
            <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/10 via-transparent to-[#60A5FA]/10 rounded-2xl blur-xl"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to master any codebase?</h2>
              <p className="text-lg text-[#94A3B8] mb-8 max-w-xl mx-auto">
                Join 5,000+ developers who are saving hours of onboarding time every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-[#3B82F6] hover:bg-[#60A5FA] text-black px-8 py-3.5 rounded-xl font-semibold transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                >
                  <span>🚀</span>
                  <span>Analyze Your First Repo</span>
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
            <img src={RepoLensLogo} alt="RepoLens Logo" className="w-7 h-7 object-contain" />
            <span className="text-base font-semibold text-white">RepoLens</span>
          </div>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-sm text-[#64748B] hover:text-white transition">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}