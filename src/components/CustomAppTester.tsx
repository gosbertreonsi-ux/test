import React, { useState, useEffect, useRef } from 'react';
import { CustomEndpointConfig, LiveDispatchLog } from '../types';
import { LiveAppDispatcher, LiveDispatcherStats } from '../services/networkDispatcher';
import {
  Globe,
  Play,
  Square,
  Send,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Copy,
  Clock,
  ExternalLink,
  Code2,
  Plus,
  Trash2,
} from 'lucide-react';

interface CustomAppTesterProps {
  onKillSwitch: () => void;
}

export const CustomAppTester: React.FC<CustomAppTesterProps> = ({ onKillSwitch }) => {
  // Default configuration targeting custom app endpoint
  const [config, setConfig] = useState<CustomEndpointConfig>({
    endpointUrl: 'http://localhost:3000/api/posts/DeM5L4Nhyxk/like',
    postOrVideoLink: 'https://mysocialapp.com/p/DeM5L4Nhyxk',
    extractedPostId: 'DeM5L4Nhyxk',
    interactionType: 'mixed',
    httpMethod: 'POST',
    authHeaderType: 'bearer',
    authToken: 'test_dev_jwt_token_sample',
    customHeadersJson: '{\n  "X-Client-Version": "2.4.0"\n}',
    customPayloadTemplate: '',
    commentTemplates: [
      'Voted! Miss Grand Tanzania 🇹🇿❤️',
      'Team Ecuador all the way! 🇪🇨🔥',
      'Amazing showdown! 👑',
      'Country Power of the Year! 🏆',
      'Voted via official app! ✨',
    ],
    requestsPerSecond: 10,
    totalRequestsCap: 50,
    concurrencyLimit: 5,
    certifiedAppOwnership: true,
    duplicateUserSimulation: true,
  });

  const [newCommentInput, setNewCommentInput] = useState('');
  const [logs, setLogs] = useState<LiveDispatchLog[]>([]);
  const [stats, setStats] = useState<LiveDispatcherStats>({
    totalDispatched: 0,
    accepted2xx: 0,
    duplicate409: 0,
    throttled429: 0,
    unauthorized401_403: 0,
    serverError5xx: 0,
    networkErrors: 0,
    avgLatencyMs: 0,
    isRunning: false,
  });

  const [activeTab, setActiveTab] = useState<'config' | 'logs' | 'stats'>('config');
  const [probeLoading, setProbeLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  const dispatcherRef = useRef<LiveAppDispatcher | null>(null);

  useEffect(() => {
    const dispatcher = new LiveAppDispatcher(config);
    dispatcher.setCallbacks(
      (newLogs) => setLogs([...newLogs]),
      (newStats) => setStats(newStats)
    );
    dispatcherRef.current = dispatcher;

    return () => {
      dispatcher.stop();
    };
  }, []);

  // Auto extract ID when link changes
  const handleLinkChange = (link: string) => {
    let extracted = config.extractedPostId;
    try {
      const match = link.match(/\/(?:p|videos|reel|post)\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        extracted = match[1];
      } else {
        const parts = link.split('/').filter(Boolean);
        if (parts.length > 0) extracted = parts[parts.length - 1];
      }
    } catch {
      // keep existing
    }

    const updated = {
      ...config,
      postOrVideoLink: link,
      extractedPostId: extracted,
      endpointUrl: config.endpointUrl.includes(config.extractedPostId)
        ? config.endpointUrl.replace(config.extractedPostId, extracted)
        : config.endpointUrl,
    };
    setConfig(updated);
    if (dispatcherRef.current) dispatcherRef.current.updateConfig(updated);
  };

  const handleUpdateConfig = <K extends keyof CustomEndpointConfig>(key: K, value: CustomEndpointConfig[K]) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    if (dispatcherRef.current) dispatcherRef.current.updateConfig(updated);
  };

  const handleAddComment = () => {
    if (!newCommentInput.trim()) return;
    const updated = [...config.commentTemplates, newCommentInput.trim()];
    handleUpdateConfig('commentTemplates', updated);
    setNewCommentInput('');
  };

  const handleRemoveComment = (index: number) => {
    const updated = config.commentTemplates.filter((_, i) => i !== index);
    handleUpdateConfig('commentTemplates', updated);
  };

  // Test single probe
  const handleProbe = async (action: 'like' | 'comment') => {
    if (!dispatcherRef.current) return;
    setProbeLoading(true);
    try {
      const log = await dispatcherRef.current.probeSingle(action);
      setLogs((prev) => [log, ...prev.slice(0, 199)]);
      setActiveTab('logs');
    } finally {
      setProbeLoading(false);
    }
  };

  // Start batch
  const handleStartBatch = async () => {
    if (!dispatcherRef.current || stats.isRunning) return;
    if (!config.certifiedAppOwnership) {
      alert('Please check the ownership certification box before initiating tests.');
      return;
    }

    setBatchProgress({ current: 0, total: config.totalRequestsCap });
    setActiveTab('logs');

    await dispatcherRef.current.startBatch((current, total) => {
      setBatchProgress({ current, total });
    });

    setBatchProgress(null);
  };

  const handleStopBatch = () => {
    if (dispatcherRef.current) {
      dispatcherRef.current.stop();
    }
    setBatchProgress(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-4 bg-gradient-to-r from-sky-950/30 via-zinc-900 to-zinc-900 border border-sky-900/40 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <Globe className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Live Application Endpoint Adapter</span>
            <span className="text-zinc-600">·</span>
            <span>FR-01 Authorized Staging Testing</span>
          </div>
          <h2 className="text-base font-bold text-zinc-100 mt-1">
            Connect & Benchmark Your Own Application
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
            Dispatch real HTTP requests (automatic likes & comments) to your own social app's API. Observe real-time HTTP status codes, latency percentiles, and verify your rate limiters and database uniqueness constraints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {stats.isRunning ? (
            <button
              onClick={handleStopBatch}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Halt Live Dispatch</span>
            </button>
          ) : (
            <button
              onClick={handleStartBatch}
              disabled={!config.certifiedAppOwnership}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-sky-950"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Batch Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Live HTTP Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
          <span className="text-[11px] text-zinc-500 block font-mono">Total Dispatched</span>
          <div className="text-lg font-bold font-mono tabular-nums text-zinc-100 mt-0.5">
            {stats.totalDispatched.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            Cap: {config.totalRequestsCap} reqs
          </span>
        </div>

        <div className="p-3 bg-zinc-900/80 border border-emerald-900/40 rounded">
          <span className="text-[11px] text-emerald-400 block font-mono">2xx Accepted</span>
          <div className="text-lg font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
            {stats.accepted2xx.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Committed by app</span>
        </div>

        <div className="p-3 bg-zinc-900/80 border border-amber-900/40 rounded">
          <span className="text-[11px] text-amber-400 block font-mono">409 Duplicates</span>
          <div className="text-lg font-bold font-mono tabular-nums text-amber-400 mt-0.5">
            {stats.duplicate409.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">UNIQUE held</span>
        </div>

        <div className="p-3 bg-zinc-900/80 border border-orange-900/40 rounded">
          <span className="text-[11px] text-orange-400 block font-mono">429 Rate Limited</span>
          <div className="text-lg font-bold font-mono tabular-nums text-orange-400 mt-0.5">
            {stats.throttled429.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">App throttled</span>
        </div>

        <div className="p-3 bg-zinc-900/80 border border-red-900/40 rounded">
          <span className="text-[11px] text-red-400 block font-mono">401/403 Rejected</span>
          <div className="text-lg font-bold font-mono tabular-nums text-red-400 mt-0.5">
            {stats.unauthorized401_403.toLocaleString()}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Invalid credentials</span>
        </div>

        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
          <span className="text-[11px] text-zinc-400 block font-mono">5xx / Network Err</span>
          <div className={`text-lg font-bold font-mono tabular-nums mt-0.5 ${stats.networkErrors + stats.serverError5xx > 0 ? 'text-red-400' : 'text-zinc-200'}`}>
            {stats.serverError5xx + stats.networkErrors}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Server / CORS</span>
        </div>

        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
          <span className="text-[11px] text-sky-400 block font-mono">Avg Latency</span>
          <div className="text-lg font-bold font-mono tabular-nums text-sky-400 mt-0.5">
            {stats.avgLatencyMs}ms
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Network roundtrip</span>
        </div>
      </div>

      {/* Tabs: Configuration vs Live HTTP Logs */}
      <div className="border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'text-zinc-100 border-b-2 border-sky-400 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Endpoint & Action Settings
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'text-zinc-100 border-b-2 border-sky-400 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Live Response Logs</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-zinc-800 rounded text-zinc-300">
              {logs.length}
            </span>
          </button>
        </div>

        {batchProgress && (
          <div className="text-xs font-mono text-zinc-400 pb-2">
            Progress: <span className="text-sky-400 font-semibold">{batchProgress.current}</span> / {batchProgress.total}
          </div>
        )}
      </div>

      {/* TAB 1: Configuration */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Target URL & Auth (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-4">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              1. Target Link & API Endpoint
            </h3>

            {/* Post / Video Link */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono block">
                Target Post / Video URL or Deep Link:
              </label>
              <input
                type="text"
                value={config.postOrVideoLink}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://mysocialapp.com/p/DeM5L4Nhyxk"
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-zinc-500 block">
                Auto-extracted Post ID: <code className="text-sky-400 font-mono">{config.extractedPostId}</code>
              </span>
            </div>

            {/* HTTP Endpoint URL */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono block">
                Backend API Dispatch Endpoint URL:
              </label>
              <div className="flex gap-2">
                <select
                  value={config.httpMethod}
                  onChange={(e) => handleUpdateConfig('httpMethod', e.target.value as 'POST' | 'PUT')}
                  className="bg-zinc-950 border border-zinc-800 rounded px-2 text-xs font-mono text-zinc-200 cursor-pointer"
                >
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                </select>
                <input
                  type="text"
                  value={config.endpointUrl}
                  onChange={(e) => handleUpdateConfig('endpointUrl', e.target.value)}
                  placeholder="http://localhost:3000/api/posts/:id/like"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <span className="text-[11px] text-zinc-500 block">
                The URL receiving the JSON payload. Ensure your server allows CORS if running from browser origin.
              </span>
            </div>

            {/* Auth Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-mono block">Authorization Header Type:</label>
                <select
                  value={config.authHeaderType}
                  onChange={(e) => handleUpdateConfig('authHeaderType', e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-200 cursor-pointer"
                >
                  <option value="bearer">Bearer Token (Authorization: Bearer ...)</option>
                  <option value="api_key">API Key (X-API-Key: ...)</option>
                  <option value="custom">Raw Header</option>
                  <option value="none">None (Public Endpoint)</option>
                </select>
              </div>

              {config.authHeaderType !== 'none' && (
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-mono block">Token / Key Secret:</label>
                  <input
                    type="password"
                    value={config.authToken}
                    onChange={(e) => handleUpdateConfig('authToken', e.target.value)}
                    placeholder="Enter auth token..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}
            </div>

            {/* Custom Headers JSON */}
            <div className="space-y-1 pt-1">
              <label className="text-xs text-zinc-400 font-mono flex items-center justify-between">
                <span>Custom Headers (JSON):</span>
                <span className="text-[10px] text-zinc-500">Optional</span>
              </label>
              <textarea
                rows={2}
                value={config.customHeadersJson}
                onChange={(e) => handleUpdateConfig('customHeadersJson', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Right: Actions, Comments & Safety Limits (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-4">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              2. Interaction Modes & Safety Caps
            </h3>

            {/* Action Type */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-mono block">Simulated Interactions:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateConfig('interactionType', 'likes')}
                  className={`py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
                    config.interactionType === 'likes'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-300 font-semibold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Likes Only
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateConfig('interactionType', 'comments')}
                  className={`py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
                    config.interactionType === 'comments'
                      ? 'bg-sky-950/40 border-sky-500 text-sky-300 font-semibold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Comments Only
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateConfig('interactionType', 'mixed')}
                  className={`py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
                    config.interactionType === 'mixed'
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300 font-semibold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Mixed (Like+Comment)
                </button>
              </div>
            </div>

            {/* Comments Template Manager */}
            {(config.interactionType === 'comments' || config.interactionType === 'mixed') && (
              <div className="space-y-2 pt-1">
                <label className="text-xs text-zinc-400 font-mono block">
                  Comment Variations ({config.commentTemplates.length}):
                </label>
                <div className="max-h-28 overflow-y-auto space-y-1 text-xs font-mono pr-1 scrollbar-thin">
                  {config.commentTemplates.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 bg-zinc-950 border border-zinc-800/80 rounded text-[11px] text-zinc-300"
                    >
                      <span className="truncate pr-2">{item}</span>
                      <button
                        onClick={() => handleRemoveComment(idx)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentInput}
                    onChange={(e) => setNewCommentInput(e.target.value)}
                    placeholder="Add new comment variant..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Rate & Caps */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Rate:</span>
                  <span className="text-zinc-200 font-bold">{config.requestsPerSecond} req/s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={config.requestsPerSecond}
                  onChange={(e) => handleUpdateConfig('requestsPerSecond', Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Hard Cap:</span>
                  <span className="text-zinc-200 font-bold">{config.totalRequestsCap} reqs</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={config.totalRequestsCap}
                  onChange={(e) => handleUpdateConfig('totalRequestsCap', Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>

            {/* Duplicate simulation */}
            <label className="flex items-start gap-2 text-xs cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={config.duplicateUserSimulation}
                onChange={(e) => handleUpdateConfig('duplicateUserSimulation', e.target.checked)}
                className="mt-0.5 rounded accent-sky-500"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Simulate Duplicate Users</span>
                <span className="text-zinc-500 text-[11px]">Reuses identical user IDs to verify your app's UNIQUE constraint.</span>
              </div>
            </label>

            {/* Safety Certification */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded space-y-2">
              <label className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.certifiedAppOwnership}
                  onChange={(e) => handleUpdateConfig('certifiedAppOwnership', e.target.checked)}
                  className="mt-0.5 rounded accent-emerald-500"
                />
                <span className="text-[11px] text-zinc-300 leading-tight">
                  I certify that I own or am explicitly authorized to test this application endpoint.
                </span>
              </label>
            </div>

            {/* Single Probe Buttons */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-zinc-500 font-mono">Connectivity Probe:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleProbe('like')}
                  disabled={probeLoading || stats.isRunning}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-mono cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Probe Like</span>
                </button>
                <button
                  onClick={() => handleProbe('comment')}
                  disabled={probeLoading || stats.isRunning}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-mono cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Probe Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Dispatch Logs */}
      {activeTab === 'logs' && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded overflow-hidden">
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 text-xs">
            <span className="font-semibold text-zinc-200 font-mono uppercase tracking-wider">
              Live HTTP Network Log (Showing Recent {logs.length} calls)
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-zinc-500 hover:text-zinc-300 font-mono text-[11px] cursor-pointer"
            >
              Clear Log
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-500 text-[11px]">
                  <th className="p-2.5"># Req</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">HTTP Status</th>
                  <th className="p-2.5">Latency</th>
                  <th className="p-2.5">Dispatched Payload</th>
                  <th className="p-2.5">Server Response Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-zinc-500 font-sans">
                      No live HTTP requests dispatched yet. Click "Probe Like" or "Launch Live Batch Test" above to test your app.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-800/30">
                      <td className="p-2.5 text-zinc-500">#{log.index}</td>
                      <td className="p-2.5">
                        <span className={`uppercase font-bold ${log.action === 'like' ? 'text-rose-400' : 'text-sky-400'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`font-bold ${
                            log.status >= 200 && log.status < 300
                              ? 'text-emerald-400'
                              : log.status === 409
                              ? 'text-amber-400'
                              : log.status === 429
                              ? 'text-orange-400'
                              : log.status === 401 || log.status === 403
                              ? 'text-purple-400'
                              : 'text-red-400'
                          }`}
                        >
                          {log.status === 0 ? log.statusText : `${log.status} ${log.statusText}`}
                        </span>
                      </td>
                      <td className="p-2.5 text-zinc-400">{log.latencyMs}ms</td>
                      <td className="p-2.5 text-zinc-300 max-w-xs truncate" title={log.payloadSummary}>
                        {log.payloadSummary}
                      </td>
                      <td className="p-2.5 text-zinc-400 max-w-sm truncate text-[11px]" title={log.responseSnippet || log.error}>
                        {log.error ? (
                          <span className="text-red-400">{log.error}</span>
                        ) : log.responseSnippet ? (
                          log.responseSnippet
                        ) : (
                          '(empty response)'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
