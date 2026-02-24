// client/pages/AnalysisSkeleton.jsx
import React from 'react';
import RepoLensLogo from "../assets/Repolenslogo.svg";

export default function AnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0E17] font-['Plus_Jakarta_Sans',_'Inter',_sans-serif] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#60A5FA]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#38BDF8]/20 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="relative w-full px-6 py-5 md:px-12 md:py-6 border-b border-[#334155] bg-[#0B0E17]/80 backdrop-blur-sm z-10">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3 cursor-pointer">
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
          <div className="flex items-center gap-4">
            <div className="w-32 h-10 bg-[#334155] rounded-lg animate-pulse"></div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative px-6 py-8 md:px-12 md:py-12 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Analyzing Banner */}
          <div className="mb-8 bg-gradient-to-r from-[#0F1320] to-[#1A1F2E] rounded-2xl border border-[#334155] p-8">
            <div className="flex flex-col items-center justify-center text-center">
              {/* Animated Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-[#3B82F6]/20 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#3B82F6]/30 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Orbiting dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#60A5FA] rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#38BDF8] rounded-full animate-ping delay-300"></div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">
                Analyzing Repository
              </h2>
              <p className="text-[#94A3B8] text-lg mb-2">
                Please wait while we analyze the repository structure and generate insights...
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#334155] rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#334155] rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-[#334155] rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-[#334155] rounded w-32 animate-pulse"></div>
                  <div className="h-5 bg-[#334155] rounded w-16 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#334155] rounded animate-pulse"></div>
                      <div className="w-5 h-5 bg-[#334155] rounded animate-pulse"></div>
                      <div className="h-4 bg-[#334155] rounded flex-1 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Metrics Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#0F1320]/50 backdrop-blur-sm rounded-xl border border-[#334155] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-4 bg-[#334155] rounded w-20 animate-pulse"></div>
                      <div className="w-5 h-5 bg-[#334155] rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-[#334155] rounded w-16 mb-2 animate-pulse"></div>
                    <div className="flex gap-1">
                      <div className="h-5 bg-[#334155] rounded w-12 animate-pulse"></div>
                      <div className="h-5 bg-[#334155] rounded w-12 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack Skeleton */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-[#334155] rounded w-24 animate-pulse"></div>
                  <div className="h-5 bg-[#334155] rounded w-20 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#334155] rounded animate-pulse"></div>
                        <div className="h-4 bg-[#334155] rounded w-24 animate-pulse"></div>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-8">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="h-6 bg-[#334155] rounded w-16 animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Skeleton */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-[#334155] rounded w-32 animate-pulse"></div>
                  <div className="w-5 h-5 bg-[#334155] rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="h-6 bg-[#334155] rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-[#334155] rounded w-24 animate-pulse"></div>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-[#334155] rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-[#334155] rounded w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features Skeleton */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-[#334155] rounded w-24 animate-pulse"></div>
                  <div className="w-5 h-5 bg-[#334155] rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-[#334155] rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Skeleton */}
              <div className="bg-[#0F1320]/50 backdrop-blur-sm rounded-2xl border border-[#334155] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-[#334155] rounded w-28 animate-pulse"></div>
                  <div className="w-5 h-5 bg-[#334155] rounded animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-[#334155] rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-[#334155] rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-[#334155] rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}