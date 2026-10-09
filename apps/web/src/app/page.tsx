import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-indigo-400">UIKey</div>
        <nav className="space-x-6 text-sm font-medium text-gray-300">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="px-8 py-24 mx-auto max-w-7xl text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
            Now in Public Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            A Universal UI/UX <br /> Extraction & Ingestion System for AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            Bridge the gap between human interfaces and machine understanding. 
            UIKey seamlessly captures, compiles, and feeds UI components into your AI models.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20">
              Get Started for Free
            </a>
            <a href="#how-it-works" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg font-semibold transition-all">
              See How It Works
            </a>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="px-8 py-24 bg-gray-900/50 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to convert any interface into AI-ready data.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Extension</h3>
                <p className="text-gray-400 leading-relaxed">
                  Capture UI components directly from your browser using our lightweight extension. Extract layouts, styles, and structure instantly.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Compile</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our engine processes the raw extraction, compiling it into clean, standardized, and semantic structured data.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI</h3>
                <p className="text-gray-400 leading-relaxed">
                  Feed the compiled UI structures directly into your LLMs and AI agents for training, testing, or automated interactions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} UIKey. All rights reserved.</p>
      </footer>
    </div>
  );
}
