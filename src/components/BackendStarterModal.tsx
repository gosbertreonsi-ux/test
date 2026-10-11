import React, { useState } from 'react';
import { BACKEND_STARTER_FILES } from '../data/miziziData';
import { Copy, Check, Download, FileCode, Terminal } from 'lucide-react';

export const BackendStarterModal: React.FC = () => {
  const fileKeys = Object.keys(BACKEND_STARTER_FILES);
  const [selectedFile, setSelectedFile] = useState<string>(fileKeys[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const fileContent = BACKEND_STARTER_FILES[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    // Generate text bundle of all files
    const bundle = Object.entries(BACKEND_STARTER_FILES)
      .map(([filename, content]) => `// ==================== FILE: ${filename} ====================\n\n${content}\n\n`)
      .join('\n');

    const blob = new Blob([bundle], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mizizi-engagement-generator-starter-files.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <FileCode className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">
              Node.js + Express + Prisma Backend Starter Kit
            </span>
          </div>
          <h2 className="text-base font-bold text-zinc-100 mt-1">
            Standalone Development Service (mizizi-engagement-generator)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
            As specified in the implementation document: development-only server that writes exclusively to <code className="text-zinc-300 font-mono">SimulatedEngagement</code>, protects endpoints with <code className="text-zinc-300 font-mono">x-admin-token</code>, and refuses to run outside development mode.
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-md shadow-emerald-950"
        >
          {downloadSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>Download All Backend Files</span>
        </button>
      </div>

      {/* File Viewer Box */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded overflow-hidden">
        {/* File Tabs Header */}
        <div className="p-2.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {fileKeys.map((key) => (
              <button
                key={key}
                onClick={() => setSelectedFile(key)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFile === key
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] scrollbar-thin bg-zinc-950/80">
          {fileContent}
        </pre>
      </div>

      {/* Local Setup Instructions matching PRD */}
      <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded space-y-2 text-xs font-mono">
        <div className="text-zinc-200 font-bold flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick PowerShell / Terminal Setup:</span>
        </div>
        <p className="text-zinc-400 text-[11px] font-sans">
          Run these commands in your project folder to start the standalone backend service:
        </p>
        <pre className="p-3 bg-zinc-950 rounded border border-zinc-800 text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
{`# 1. Install dependencies
npm install

# 2. Configure environment
Copy-Item .env.example .env

# 3. Initialize Prisma and Seed demo post
npm run db:generate
npm run db:push
npm run db:seed

# 4. Start development server on port 5050
npm run dev`}
        </pre>
      </div>
    </div>
  );
};
