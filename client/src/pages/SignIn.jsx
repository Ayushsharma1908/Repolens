import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import RepoLensLogo from "../assets/Repolenslogo.svg";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // FIX: pass user and token separately to match login(userData, token)
        login(data.user, data.token);
        navigate("/analyzepage");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#60A5FA]/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#38BDF8]/20 rounded-full blur-[150px]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#818CF8]/10 rounded-full blur-[180px]"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#A78BFA]/20 rounded-full blur-[100px]"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-[#7DD3FC]/20 rounded-full blur-[100px]"></div>

      {/* Header */}
      <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm z-10">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={RepoLensLogo} alt="RepoLens Logo" className="w-9 h-9 object-contain" />
            <span className="text-xl font-semibold text-white tracking-tight">RepoLens</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-[#94A3B8] hover:text-white transition text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Website
          </button>
        </nav>
      </header>

      <main className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 z-10">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/20 via-[#818CF8]/20 to-[#A78BFA]/20 rounded-3xl blur-xl opacity-60"></div>
            <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] overflow-hidden shadow-2xl shadow-blue-500/10">

              <div className="px-8 pt-10 pb-4 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-[#94A3B8] text-sm">Analyze. Optimize. Deploy.</p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mx-8 mb-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="px-8 space-y-3 mt-2">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#1E293B] hover:bg-[#2D3A4F] border border-[#334155] rounded-xl transition-all"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span className="text-white font-medium">Continue with Google</span>
                </button>

                <div className="relative py-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#334155]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#0F1320] px-3 text-xs text-[#64748B]">or continue with email</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSignIn} className="px-8 pb-8 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  {/* FIX: bound value + onChange */}
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3.5 bg-[#1E293B] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 text-white placeholder-[#64748B] transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Password
                    </label>
                    <button type="button" className="text-xs text-[#60A5FA] hover:text-white transition font-medium">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    {/* FIX: bound value + onChange + working eye toggle */}
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 pr-12 bg-[#1E293B] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 text-white placeholder-[#64748B] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition"
                    >
                      {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign In to RepoLens"}
                </button>

                <div className="text-center pt-2">
                  <p className="text-[#94A3B8] text-sm">
                    New to RepoLens?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="text-[#60A5FA] hover:text-white font-medium transition"
                    >
                      Create your account
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}