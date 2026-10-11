import React, { useState } from 'react';
import { SupportedApp, CustomerApp } from '../types/mizizi';
import { ShieldCheck, Key, Trash2, Layers, FileCode, CheckCircle2, Server, Plus } from 'lucide-react';

interface MiziziHeaderProps {
  currentTab: 'generator' | 'posts' | 'batches' | 'backend' | 'registry';
  setCurrentTab: (tab: 'generator' | 'posts' | 'batches' | 'backend' | 'registry') => void;
  selectedApp: SupportedApp;
  setSelectedApp: (app: SupportedApp) => void;
  registeredApps: CustomerApp[];
  adminToken: string;
  setAdminToken: (token: string) => void;
  onPurgeAll: () => void;
  totalSimulatedCount: number;
}

export const MiziziHeader: React.FC<MiziziHeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedApp,
  setSelectedApp,
  registeredApps,
  adminToken,
  setAdminToken,
  onPurgeAll,
  totalSimulatedCount,
}) => {
  const [showTokenInput, setShowTokenInput] = useState(false);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
      {/* Top Banner: Simulated Data Notice */}
      <div className="bg-amber-950/40 border-b border-amber-900/60 px-4 py-1.5 text-center text-xs text-amber-300 font-mono flex items-center justify-center gap-2">
        <span className="font-bold uppercase tracking-wider bg-amber-900/80 text-amber-200 px-1.5 py-0.5 rounded text-[10px]">
          SIMULATED DATA ONLY
        </span>
        <span className="truncate">
          Internal engagement management module for owned apps (Mizizi Social & Bibo). Live genuine engagement is strictly isolated.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
              M
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-zinc-100 tracking-tight">
                  Mizizi Engagement Generator
                </span>
                <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
                  Dev Console
                </span>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-medium overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setCurrentTab('generator')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'generator'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Engagement Generator
            </button>
            <button
              onClick={() => setCurrentTab('posts')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'posts'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Post Inspector & Preview
            </button>
            <button
              onClick={() => setCurrentTab('batches')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'batches'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <span>Batches & Audit Logs</span>
              {totalSimulatedCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                  {totalSimulatedCount.toLocaleString()}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('registry')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'registry'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer Apps ({registeredApps.length})</span>
            </button>
            <button
              onClick={() => setCurrentTab('backend')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                currentTab === 'backend'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>Backend Express Kit</span>
            </button>
          </nav>

          {/* Right Action Island: App Switcher & Admin Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Dynamic Customer App Selector */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-xs">
              <span className="text-zinc-500 font-mono text-[11px] hidden md:inline">Target:</span>
              <select
                aria-label="Select Target Customer Application"
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer text-xs max-w-[130px] sm:max-w-none truncate"
              >
                {registeredApps.map((app) => (
                  <option key={app.id} value={app.name} className="bg-zinc-900 text-zinc-200">
                    {app.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setCurrentTab('registry')}
                title="Register or configure customer apps"
                className="text-zinc-500 hover:text-emerald-400 p-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Admin Token Modal Trigger */}
            <button
              onClick={() => setShowTokenInput(!showTokenInput)}
              title="Admin Token Config"
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
            </button>

            {/* Purge All Simulated Data Button */}
            {totalSimulatedCount > 0 && (
              <button
                onClick={onPurgeAll}
                title="Purge all simulated records (keeps genuine user engagement untouched)"
                className="px-2.5 py-1 bg-zinc-900 hover:bg-red-950/60 border border-zinc-800 hover:border-red-800/80 text-zinc-400 hover:text-red-400 rounded text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Purge Test Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Admin Token Drawer */}
        {showTokenInput && (
          <div className="py-2.5 border-t border-zinc-800 flex items-center justify-between gap-3 text-xs bg-zinc-900/50 px-3 rounded-b">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-zinc-400 font-mono text-[11px] shrink-0">x-admin-token:</span>
              <input
                type="text"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Paste ADMIN_TOKEN from .env"
                className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-zinc-200 font-mono text-xs w-full max-w-md focus:outline-none focus:border-zinc-700"
              />
            </div>
            <button
              onClick={() => setShowTokenInput(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-mono cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
