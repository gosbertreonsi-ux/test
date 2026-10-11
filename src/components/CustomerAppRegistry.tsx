import React, { useState } from 'react';
import { CustomerApp } from '../types/mizizi';
import { Plus, Globe, Key, Check, Trash2, CheckCircle2, AlertTriangle, Send, RefreshCw, Server, Edit3 } from 'lucide-react';

interface CustomerAppRegistryProps {
  apps: CustomerApp[];
  activeAppId: string;
  onSelectApp: (app: CustomerApp) => void;
  onAddApp: (newApp: CustomerApp) => void;
  onDeleteApp: (appId: string) => void;
}

export const CustomerAppRegistry: React.FC<CustomerAppRegistryProps> = ({
  apps,
  activeAppId,
  onSelectApp,
  onAddApp,
  onDeleteApp,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [probeResult, setProbeResult] = useState<{ appId: string; status: number; latencyMs: number; ok: boolean; message: string } | null>(null);
  const [probingAppId, setProbingAppId] = useState<string | null>(null);

  // New App Form State
  const [name, setName] = useState('');
  const [clientOrg, setClientOrg] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('https://api.customerapp.io');
  const [likesEndpoint, setLikesEndpoint] = useState('/api/posts/${postId}/likes');
  const [commentsEndpoint, setCommentsEndpoint] = useState('/api/posts/${postId}/comments');
  const [resharesEndpoint, setResharesEndpoint] = useState('/api/posts/${postId}/reshares');
  const [authType, setAuthType] = useState<CustomerApp['authType']>('bearer');
  const [authHeaderName, setAuthHeaderName] = useState('Authorization');
  const [authToken, setAuthToken] = useState('');
  const [httpMethod, setHttpMethod] = useState<'POST' | 'PUT'>('POST');
  const [customHeadersJson, setCustomHeadersJson] = useState('{}');
  const [payloadTemplate, setPayloadTemplate] = useState('{\n  "postId": "${postId}",\n  "userId": "${userId}",\n  "action": "${action}"\n}');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an Application Name.');
      return;
    }

    const newApp: CustomerApp = {
      id: `app_custom_${Date.now()}`,
      name: name.trim(),
      clientOrg: clientOrg.trim() || 'Internal Client',
      apiBaseUrl: apiBaseUrl.trim(),
      likesEndpoint: likesEndpoint.trim(),
      commentsEndpoint: commentsEndpoint.trim(),
      resharesEndpoint: resharesEndpoint.trim(),
      authType,
      authHeaderName: authHeaderName.trim(),
      authToken: authToken.trim(),
      httpMethod,
      customHeadersJson,
      payloadTemplate,
      active: true,
      createdAt: new Date().toISOString(),
    };

    onAddApp(newApp);
    setShowAddForm(false);
    // Reset form
    setName('');
    setClientOrg('');
    setAuthToken('');
  };

  const handleProbeApp = async (app: CustomerApp) => {
    setProbingAppId(app.id);
    const start = performance.now();
    try {
      const url = `${app.apiBaseUrl.replace(/\/$/, '')}${app.likesEndpoint.replace('${postId}', 'probe_sample_123')}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (app.authType === 'bearer' && app.authToken) {
        headers['Authorization'] = `Bearer ${app.authToken}`;
      } else if (app.authType === 'api_key' && app.authToken) {
        headers[app.authHeaderName || 'X-API-Key'] = app.authToken;
      }

      const res = await fetch(url, {
        method: app.httpMethod,
        headers,
        body: JSON.stringify({ postId: 'probe_sample_123', userId: 'probe_user_01', action: 'like' }),
      });

      const latencyMs = Math.round(performance.now() - start);
      setProbeResult({
        appId: app.id,
        status: res.status,
        latencyMs,
        ok: res.ok,
        message: `HTTP ${res.status} ${res.statusText}`,
      });
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      setProbeResult({
        appId: app.id,
        status: 0,
        latencyMs,
        ok: false,
        message: err?.message || 'Network / CORS error',
      });
    } finally {
      setProbingAppId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Server className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Multi-Tenant Customer App Registry</span>
          </div>
          <h2 className="text-base font-bold text-zinc-100 mt-1">
            Registered Applications & API Gateways
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure custom API base URLs, custom headers, auth keys, and payload templates for any customer application you administer.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md shadow-emerald-950"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close Registration Form' : 'Register New Customer App'}</span>
        </button>
      </div>

      {/* Registration Form (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleRegisterSubmit} className="p-5 bg-zinc-900/80 border border-emerald-800/60 rounded space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Register New Application Profile
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">Any REST or GraphQL endpoint</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-300 font-mono block">App Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AfroShop Social, Client Beta App"
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-mono block">Client Organization:</label>
              <input
                type="text"
                value={clientOrg}
                onChange={(e) => setClientOrg(e.target.value)}
                placeholder="e.g. Partner Org, Internal Team"
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-zinc-300 font-mono block">API Base URL:</label>
              <input
                type="text"
                required
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="https://api.yourdomain.com or http://localhost:8080"
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-mono block">Likes Endpoint Path:</label>
              <input
                type="text"
                value={likesEndpoint}
                onChange={(e) => setLikesEndpoint(e.target.value)}
                placeholder="/api/posts/${postId}/likes"
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-mono block">Comments Endpoint Path:</label>
              <input
                type="text"
                value={commentsEndpoint}
                onChange={(e) => setCommentsEndpoint(e.target.value)}
                placeholder="/api/posts/${postId}/comments"
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-mono block">Auth Scheme:</label>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono focus:outline-none cursor-pointer"
              >
                <option value="bearer">Bearer Token (Authorization: Bearer ...)</option>
                <option value="api_key">API Key Header (e.g. X-API-Key)</option>
                <option value="custom">Custom Header</option>
                <option value="none">None (Public API)</option>
              </select>
            </div>

            {authType !== 'none' && (
              <div className="space-y-1">
                <label className="text-zinc-300 font-mono block">Auth Token / Secret Key:</label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Enter secret token..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded font-mono cursor-pointer"
            >
              Save Application Profile
            </button>
          </div>
        </form>
      )}

      {/* Grid of Registered Customer Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => {
          const isActive = app.id === activeAppId || app.name === activeAppId;
          const isProbing = probingAppId === app.id;
          const thisProbe = probeResult?.appId === app.id ? probeResult : null;

          return (
            <div
              key={app.id}
              className={`p-4 rounded border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-zinc-900 border-emerald-500/80 shadow-md shadow-emerald-950/20'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-zinc-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-100">{app.name}</span>
                      {isActive && (
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                          Active Target
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">{app.clientOrg}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isActive && (
                      <button
                        onClick={() => onSelectApp(app)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-emerald-900/60 hover:text-emerald-300 text-zinc-300 rounded text-xs font-mono transition-colors cursor-pointer"
                      >
                        Set Active
                      </button>
                    )}
                    {apps.length > 1 && (
                      <button
                        onClick={() => onDeleteApp(app.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded cursor-pointer"
                        title="Remove app profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* API Specs */}
                <div className="py-3 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-zinc-500">Base Gateway:</span>
                    <span className="text-zinc-200 truncate max-w-xs">{app.apiBaseUrl}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-zinc-500">Likes Path:</span>
                    <span className="text-rose-400 truncate max-w-xs">{app.likesEndpoint}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-zinc-500">Comments Path:</span>
                    <span className="text-sky-400 truncate max-w-xs">{app.commentsEndpoint}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-zinc-500">Authentication:</span>
                    <span className="text-zinc-300 uppercase">{app.authType}</span>
                  </div>
                </div>
              </div>

              {/* Probe Test & Result Strip */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleProbeApp(app)}
                    disabled={isProbing}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isProbing ? 'animate-spin' : ''}`} />
                    <span>Probe Gateway</span>
                  </button>

                  {thisProbe && (
                    <span
                      className={`text-[11px] font-mono ${
                        thisProbe.ok ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {thisProbe.message} ({thisProbe.latencyMs}ms)
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-zinc-500 font-mono">
                  Registered: {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
