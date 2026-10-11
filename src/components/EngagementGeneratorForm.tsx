import React, { useState } from 'react';
import { DemoPost, SupportedApp, CustomerApp } from '../types/mizizi';
import { Sliders, Sparkles, Plus, Clock, Database, CheckCircle2, AlertTriangle, ArrowRight, Server, Globe } from 'lucide-react';

interface EngagementGeneratorFormProps {
  selectedApp: SupportedApp;
  setSelectedApp: (app: SupportedApp) => void;
  registeredApps: CustomerApp[];
  posts: DemoPost[];
  selectedPostId: string;
  setSelectedPostId: (id: string) => void;
  onCreateSamplePost: () => void;
  onGenerate: (params: {
    postId: string;
    likes: number;
    comments: number;
    reshares: number;
    deliveryMode: 'instant' | '10s' | '30s' | '60s';
  }) => void;
  isGenerating: boolean;
  activePost?: DemoPost;
}

export const EngagementGeneratorForm: React.FC<EngagementGeneratorFormProps> = ({
  selectedApp,
  setSelectedApp,
  registeredApps,
  posts,
  selectedPostId,
  setSelectedPostId,
  onCreateSamplePost,
  onGenerate,
  isGenerating,
  activePost,
}) => {
  const [likes, setLikes] = useState<number>(500);
  const [comments, setComments] = useState<number>(50);
  const [reshares, setReshares] = useState<number>(100);
  const [deliveryMode, setDeliveryMode] = useState<'instant' | '10s' | '30s' | '60s'>('instant');
  const [customPostInput, setCustomPostInput] = useState<string>('');

  const currentAppObj = registeredApps.find((a) => a.name === selectedApp) || registeredApps[0];
  const filteredPosts = posts.filter((p) => p.appName === selectedApp);

  const handleSelectPostChange = (id: string) => {
    setSelectedPostId(id);
    setCustomPostInput(id);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePostId = selectedPostId || customPostInput.trim();
    if (!effectivePostId) {
      alert('Please select or specify a target Post ID.');
      return;
    }

    onGenerate({
      postId: effectivePostId,
      likes,
      comments,
      reshares,
      deliveryMode,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Safety Notice Card */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-200">Engagement Generator — Multi-Client QA Mode</span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400 font-mono">Any Customer App</span>
          </div>
          <p className="text-zinc-400">
            Generate configurable test events for any customer application you administer. All records are isolated in <code className="text-zinc-300 font-mono">SimulatedEngagement</code> and never modify live user metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCreateSamplePost}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Create Sample Test Post</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Inputs (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800 p-5 rounded space-y-5">
          {/* 1. Dynamic Application Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono block">
                1. Target Customer Application
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                {registeredApps.length} Registered App(s)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {registeredApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedApp(app.name)}
                  className={`py-2 px-3 rounded text-xs font-semibold transition-all border text-center cursor-pointer truncate ${
                    selectedApp === app.name
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                  title={`${app.name} (${app.clientOrg})`}
                >
                  {app.name}
                </button>
              ))}
            </div>

            {/* Target App Endpoint Specs Preview */}
            {currentAppObj && (
              <div className="p-2.5 bg-zinc-950/80 rounded border border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Gateway: <strong className="text-zinc-200">{currentAppObj.apiBaseUrl}</strong></span>
                </div>
                <div>Auth: <span className="text-zinc-300 uppercase">{currentAppObj.authType}</span></div>
                <div>Client: <span className="text-zinc-300">{currentAppObj.clientOrg}</span></div>
              </div>
            )}
          </div>

          {/* 2. Target Post Selection */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                2. Target Post Reference or URL
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                {filteredPosts.length} demo post(s) found
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 font-mono block">Select from Registered Test Posts:</span>
                <select
                  aria-label="Select test post"
                  value={selectedPostId}
                  onChange={(e) => handleSelectPostChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="">-- Choose a Demo Post --</option>
                  {filteredPosts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 font-mono block">Or Direct Post ID / URL:</span>
                <input
                  type="text"
                  value={selectedPostId || customPostInput}
                  onChange={(e) => {
                    setSelectedPostId(e.target.value);
                    setCustomPostInput(e.target.value);
                  }}
                  placeholder="e.g. post_mizizi_dev_01 or URL"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {activePost && (
              <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 text-xs flex items-center justify-between font-mono">
                <span className="text-zinc-300 truncate font-semibold pr-2">{activePost.title}</span>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 shrink-0">
                  <span>Genuine: {activePost.genuineLikes} ❤️ · {activePost.genuineComments} 💬</span>
                  <span className="text-emerald-400">Simulated: +{activePost.simulatedLikes} ❤️</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Engagement Sliders (Likes, Comments, Reshares) */}
          <div className="space-y-4 pt-2 border-t border-zinc-800/80">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono block">
              3. Configure Simulated Metrics
            </label>

            {/* Simulated Likes Slider (0 to 10,000) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-semibold">Simulated Likes (0 – 10,000):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={likes}
                    onChange={(e) => setLikes(Math.max(0, Math.min(10000, Number(e.target.value))))}
                    className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-right font-bold text-rose-400 tabular-nums focus:outline-none"
                  />
                  <span className="text-zinc-500">likes</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={likes}
                onChange={(e) => setLikes(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                <span>0</span>
                <span>2,500</span>
                <span>5,000</span>
                <span>10,000</span>
              </div>
            </div>

            {/* Sample Comments Slider (0 to 500) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-semibold">Sample Comments (0 – 500):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={comments}
                    onChange={(e) => setComments(Math.max(0, Math.min(500, Number(e.target.value))))}
                    className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-right font-bold text-sky-400 tabular-nums focus:outline-none"
                  />
                  <span className="text-zinc-500">comments</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={comments}
                onChange={(e) => setComments(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                <span>0</span>
                <span>100</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>

            {/* Simulated Reshares Slider (0 to 2,000) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-semibold">Simulated Reshares (0 – 2,000):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    value={reshares}
                    onChange={(e) => setReshares(Math.max(0, Math.min(2000, Number(e.target.value))))}
                    className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-right font-bold text-purple-400 tabular-nums focus:outline-none"
                  />
                  <span className="text-zinc-500">reshares</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={reshares}
                onChange={(e) => setReshares(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                <span>0</span>
                <span>500</span>
                <span>1,000</span>
                <span>2,000</span>
              </div>
            </div>
          </div>

          {/* 4. Scheduling & Rate Dispersion */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono block">
              4. Event Delivery Cadence
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMode('instant')}
                className={`p-2 rounded text-xs font-mono border text-center transition-colors cursor-pointer ${
                  deliveryMode === 'instant'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Instant Batch (Dev)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('10s')}
                className={`p-2 rounded text-xs font-mono border text-center transition-colors cursor-pointer ${
                  deliveryMode === '10s'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Spread 10 Seconds
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('30s')}
                className={`p-2 rounded text-xs font-mono border text-center transition-colors cursor-pointer ${
                  deliveryMode === '30s'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Spread 30 Seconds
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMode('60s')}
                className={`p-2 rounded text-xs font-mono border text-center transition-colors cursor-pointer ${
                  deliveryMode === '60s'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Spread 60 Seconds
              </button>
            </div>
          </div>
        </div>

        {/* Right: Target Preview & Action Card (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 p-5 rounded flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Target Generation Summary
            </h3>

            {/* Target Breakdown Island */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="text-xs text-zinc-400 font-mono">Test Likes:</span>
                <span className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                  {likes.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="text-xs text-zinc-400 font-mono">Test Comments:</span>
                <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                  {comments.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <span className="text-xs text-zinc-400 font-mono">Test Reshares:</span>
                <span className="text-xl font-bold font-mono text-purple-400 tabular-nums">
                  {reshares.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono">
                <span className="text-zinc-400">Total Test Records:</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {(likes + comments + reshares).toLocaleString()} rows
                </span>
              </div>
            </div>

            {/* Invariant Guarantees */}
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Isolated records written to database with <code className="text-zinc-300 font-mono">label: SIMULATED</code>.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Genuine user engagement remains separate and unmodified.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Independently purgeable by Batch UUID at any time.</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-zinc-800/80">
            <button
              type="submit"
              disabled={isGenerating || (likes === 0 && comments === 0 && reshares === 0)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Test Records...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Test-Data Implementation</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-zinc-500 text-center font-mono mt-2">
              PRD Acceptance Criteria: Safe internal QA & demo generation.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
