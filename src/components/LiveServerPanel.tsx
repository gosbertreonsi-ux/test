import React, { useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, RefreshCw, Server, Shield, Globe } from 'lucide-react';
import { MiziziApiClient } from '../services/miziziApiClient';

interface LiveServerPanelProps {
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  serverUrl: string;
  setServerUrl: (url: string) => void;
  adminToken: string;
  setAdminToken: (token: string) => void;
  apiClient: MiziziApiClient;
  onRefreshData?: () => void;
}

export const LiveServerPanel: React.FC<LiveServerPanelProps> = ({
  isLiveMode,
  setIsLiveMode,
  serverUrl,
  setServerUrl,
  adminToken,
  setAdminToken,
  apiClient,
  onRefreshData,
}) => {
  const [checking, setChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    tested: boolean;
    ok: boolean;
    latencyMs?: number;
    error?: string;
  }>({ tested: false, ok: false });

  const handleTestHealth = async () => {
    setChecking(true);
    apiClient.updateCredentials(serverUrl, adminToken);
    const res = await apiClient.checkHealth();
    setHealthStatus({
      tested: true,
      ok: res.ok,
      latencyMs: res.latencyMs,
      error: res.error,
    });
    setChecking(false);
    if (res.ok && onRefreshData) {
      onRefreshData();
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded text-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-zinc-100 uppercase tracking-wider font-mono">
            Backend Connection Mode
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400 font-mono">
            {isLiveMode ? 'Live Express Server (Port 5050)' : 'Local In-Memory State'}
          </span>
        </div>

        {/* Live vs Local Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800">
          <button
            type="button"
            onClick={() => setIsLiveMode(false)}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              !isLiveMode
                ? 'bg-zinc-800 text-zinc-100 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            In-Memory Simulator
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLiveMode(true);
              handleTestHealth();
            }}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              isLiveMode
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Live Express API</span>
          </button>
        </div>
      </div>

      {/* When Live Mode is active: Connection input fields */}
      {isLiveMode && (
        <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] text-zinc-400 font-mono block">Backend Server URL:</label>
            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1">
              <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => {
                  setServerUrl(e.target.value);
                  apiClient.updateCredentials(e.target.value, adminToken);
                }}
                placeholder="http://localhost:5050"
                className="bg-transparent text-zinc-200 font-mono text-xs w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] text-zinc-400 font-mono block">
              x-admin-token ({adminToken.length} chars):
            </label>
            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1">
              <Shield className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <input
                type="password"
                value={adminToken}
                onChange={(e) => {
                  setAdminToken(e.target.value);
                  apiClient.updateCredentials(serverUrl, e.target.value);
                }}
                placeholder="Must match ADMIN_TOKEN from .env"
                className="bg-transparent text-zinc-200 font-mono text-xs w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleTestHealth}
              disabled={checking}
              className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
              <span>Ping Health</span>
            </button>
          </div>
        </div>
      )}

      {/* Health check status output */}
      {isLiveMode && healthStatus.tested && (
        <div
          className={`p-2.5 rounded border text-xs font-mono flex items-center justify-between ${
            healthStatus.ok
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-red-950/30 border-red-900/60 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {healthStatus.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>
              {healthStatus.ok
                ? `Connected to ${serverUrl} (HTTP 200 OK · latency: ${healthStatus.latencyMs}ms)`
                : healthStatus.error}
            </span>
          </div>

          {healthStatus.ok && (
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
              Live DB Ready
            </span>
          )}
        </div>
      )}
    </div>
  );
};
