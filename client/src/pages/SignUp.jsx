import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import RepoLensLogo from "../assets/Repolenslogo.svg";


export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            <div className="w-9 h-9 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-400/30">
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

          {/* Sign In Link */}
          <button 
            onClick={() => navigate("/signin")}
            className="text-[#94A3B8] hover:text-white transition text-sm font-medium"
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 z-10">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#60A5FA]/20 via-[#818CF8]/20 to-[#A78BFA]/20 rounded-3xl blur-xl opacity-60"></div>
            <div className="relative bg-[#0F1320]/90 backdrop-blur-sm rounded-3xl border border-[#334155] overflow-hidden shadow-2xl shadow-blue-500/10">
              
              {/* Card Header */}
              <div className="px-8 pt-10 pb-4 text-center">
                <h1 className="text-3xl font-bold text-white mb-3">
                  Create your account
                </h1>
                <p className="text-[#94A3B8] text-sm">
                  Gain deep insights into your repositories.
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="px-8 space-y-3">
                {/* Google Button */}
                <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#1E293B] hover:bg-[#2D3A4F] border border-[#334155] rounded-xl transition-all group">
                  <FcGoogle className="w-5 h-5" />
                  <span className="text-white font-medium">
                    Continue with Google
                  </span>
                </button>
                {/* GitHub Button */}
                <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-[#1E293B] hover:bg-[#2D3A4F] border border-[#334155] rounded-xl transition-all group">
                  <FaGithub className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">
                    Continue with GitHub
                  </span>
                </button>

                

                {/* Divider */}
                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#334155]"></div>
                  </div>
                 
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="px-8 pb-8 space-y-5">
                {/* Username Field */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#64748B] text-sm">@</span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="johndoe"
                      className="w-full pl-8 pr-4 py-3.5 bg-[#1E293B] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 focus:border-transparent text-white placeholder-[#64748B] transition"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3.5 bg-[#1E293B] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 focus:border-transparent text-white placeholder-[#64748B] transition"
                  />
                </div>

                {/* Password Field with Eye Button */}
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="•••••••••"
                      className="w-full px-4 py-3.5 bg-[#1E293B] border border-[#334155] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/50 focus:border-transparent text-white placeholder-[#64748B] transition pr-12"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#64748B] hover:text-white transition"
                    >
                      {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  className="w-full bg-[#3B82F6] hover:bg-[#60A5FA] text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 mt-4 flex items-center justify-center gap-2"
                >
                  Create Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                {/* Terms and Conditions */}
                <p className="text-xs text-[#94A3B8] text-center mt-4">
                  By signing up, you agree to our{" "}
                  <a href="#" className="text-[#60A5FA] hover:text-white transition">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-[#60A5FA] hover:text-white transition">Privacy Policy</a>.
                </p>

                {/* Sign In Link */}
                <div className="text-center pt-2">
                  <p className="text-[#94A3B8] text-sm">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signin")}
                      className="text-[#60A5FA] hover:text-white font-medium transition"
                    >
                      Sign In
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