import React from 'react';
import Link from 'next/link';

export default function TutorialPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
          UIKey Tutorial
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Welcome to UIKey! This step-by-step guide will walk you through installing the Chrome Extension, managing your keys in the dashboard, and interacting with UIKey via the CLI.
        </p>
      </div>

      <div className="space-y-16">
        {/* Step 1: Chrome Extension */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-lg">
              1
            </div>
            <h2 className="text-2xl font-bold text-white">Install & Use the Chrome Extension</h2>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Installation</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-400 ml-2">
                <li>Clone the UIKey repository or download the latest release.</li>
                <li>Open Google Chrome and navigate to <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">chrome://extensions/</code>.</li>
                <li>Enable <strong>Developer mode</strong> in the top right corner.</li>
                <li>Click <strong>Load unpacked</strong> and select the <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">apps/extension/dist</code> directory.</li>
                <li>The UIKey extension should now appear in your browser!</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Extracting UI</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
                <li>Navigate to any web page you want to extract UI from.</li>
                <li>Click the UIKey extension icon in your browser toolbar.</li>
                <li>Click the <strong>Extract UI</strong> button.</li>
                <li>The extension will compile the UI structure and send it to your dashboard.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 2: Web Dashboard */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-lg">
              2
            </div>
            <h2 className="text-2xl font-bold text-white">Use the Web Dashboard</h2>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
            <p className="text-gray-400">
              The web dashboard is your central hub for managing, viewing, and organizing your extracted UI components.
            </p>
            <div className="space-y-4 text-gray-400">
              <div>
                <strong className="text-white">Viewing Extractions:</strong> Once you extract a UI using the extension, navigate to the <Link href="/dashboard" className="text-indigo-400 hover:underline">Dashboard</Link>. You'll see a list of all your extracted keys.
              </div>
              <div>
                <strong className="text-white">Managing Visibility:</strong> You can toggle your extracted components between public and private. Public components can be shared with others.
              </div>
              <div>
                <strong className="text-white">Editing Details:</strong> Click on any extraction to view its raw JSON structure, layout details, and edit its name or description.
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: CLI */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-lg">
              3
            </div>
            <h2 className="text-2xl font-bold text-white">Use the CLI</h2>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
            <p className="text-gray-400">
              The UIKey CLI allows developers and AI agents to ingest compiled UI structures directly into their local environments or workflows.
            </p>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-white">Installation</h3>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300">
                npm install -g uikey-cli
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-white">Basic Commands</h3>
              <div className="space-y-3">
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="font-mono text-indigo-400 mb-1">uikey login</div>
                  <div className="text-sm text-gray-400">Authenticate the CLI with your UIKey account.</div>
                </div>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="font-mono text-indigo-400 mb-1">uikey pull &lt;id&gt;</div>
                  <div className="text-sm text-gray-400">Pull a specific extracted UI structure as a JSON file into your current directory.</div>
                </div>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <div className="font-mono text-indigo-400 mb-1">uikey list</div>
                  <div className="text-sm text-gray-400">List all your recent UI extractions.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 text-center">
        <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
