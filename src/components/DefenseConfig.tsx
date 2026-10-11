import React from 'react';
import { DefensePolicy, UserRole } from '../types';
import { DEFAULT_DEFENSE_POLICIES } from '../data/presetScenarios';
import { Shield, KeyRound, Database, Activity, Check, Sliders, Lock } from 'lucide-react';

interface DefenseConfigProps {
  policy: DefensePolicy;
  setPolicy: (p: DefensePolicy) => void;
  userRole: UserRole;
}

export const DefenseConfig: React.FC<DefenseConfigProps> = ({ policy, setPolicy, userRole }) => {
  const isReadOnly = userRole === 'observer';

  const handleSelectPreset = (key: string) => {
    if (isReadOnly) return;
    const selected = DEFAULT_DEFENSE_POLICIES[key];
    if (selected) {
      setPolicy({ ...selected });
    }
  };

  const updatePolicy = <K extends keyof DefensePolicy>(key: K, value: DefensePolicy[K]) => {
    if (isReadOnly) return;
    setPolicy({ ...policy, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Policy Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Active Defense Policy Profile
            </h3>
          </div>
          {isReadOnly && (
            <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
              <Lock className="w-3 h-3" /> Observer Mode (Read Only)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(DEFAULT_DEFENSE_POLICIES).map(([key, p]) => {
            const isSelected = policy.name === p.name;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                disabled={isReadOnly}
                className={`p-3 rounded text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500/80 bg-emerald-950/20 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300'
                } ${isReadOnly ? 'cursor-not-allowed opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-[11px] text-zinc-400 space-y-0.5 font-mono">
                  <div>Rate: {p.accountRateLimitPerMin} req/min per account</div>
                  <div>HMAC & Bearer: {p.verifyHmacSignatures ? 'Enforced' : 'Disabled'}</div>
                  <div>DB UNIQUE: {p.enforceDbUniqueConstraint ? 'Active' : 'Disabled'}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rules Tuning Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Rate Limiting & Surge Caps */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-zinc-800">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span>Multi-Dimensional Rate Limits (FR-07)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400 font-mono">Account Rate Limit (per min):</span>
                <span className="font-bold text-zinc-200 font-mono">{policy.accountRateLimitPerMin}</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={policy.accountRateLimitPerMin}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('accountRateLimitPerMin', Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400 font-mono">IP Subnet Velocity (per min):</span>
                <span className="font-bold text-zinc-200 font-mono">{policy.ipRateLimitPerMin}</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={policy.ipRateLimitPerMin}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('ipRateLimitPerMin', Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400 font-mono">Post-Level Surge Cap (req/sec):</span>
                <span className="font-bold text-zinc-200 font-mono">{policy.postSurgeVelocityCapSec}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={policy.postSurgeVelocityCapSec}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('postSurgeVelocityCapSec', Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Auth, Cryptography & Sequence Handshake */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-zinc-800">
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>Authentication & Cryptography</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.enforceBearerAuth}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('enforceBearerAuth', e.target.checked)}
                className="mt-0.5 rounded accent-sky-500"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Enforce Bearer JWT Authentication</span>
                <span className="text-zinc-500 text-[11px]">Reject missing, expired, or malformed credentials at gateway (401).</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.verifyHmacSignatures}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('verifyHmacSignatures', e.target.checked)}
                className="mt-0.5 rounded accent-sky-500"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">HMAC-SHA256 Request Signatures</span>
                <span className="text-zinc-500 text-[11px]">Verify client payload hashing, session binding, and replay nonce (403).</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.validateSessionImpression}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('validateSessionImpression', e.target.checked)}
                className="mt-0.5 rounded accent-sky-500"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Client Impression Handshake Validation</span>
                <span className="text-zinc-500 text-[11px]">Enforce natural event sequence (impression event before like interaction).</span>
              </div>
            </label>
          </div>
        </div>

        {/* Card 3: Idempotency & Database Integrity */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-4">
          <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-zinc-800">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Database Integrity (FR-08)</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.enforceDbUniqueConstraint}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('enforceDbUniqueConstraint', e.target.checked)}
                className="mt-0.5 rounded accent-emerald-500"
              />
              <div>
                <span className="font-semibold text-zinc-200 block font-mono">UNIQUE(user_id, post_id) Constraint</span>
                <span className="text-zinc-500 text-[11px]">Transactional guarantee: Each account contributes at most 1 active like.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.enableRedisIdempotencyCache}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('enableRedisIdempotencyCache', e.target.checked)}
                className="mt-0.5 rounded accent-emerald-500"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Distributed Idempotency Key Cache</span>
                <span className="text-zinc-500 text-[11px]">Absorbs duplicate bursts in memory before database write queue.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={policy.clusterAnomalyDetection}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('clusterAnomalyDetection', e.target.checked)}
                className="mt-0.5 rounded accent-emerald-500"
              />
              <div>
                <span className="font-semibold text-zinc-200 block">Bot Cluster Correlation Filter</span>
                <span className="text-zinc-500 text-[11px]">Quarantine accounts exhibiting coordinated timing and synthetic traits.</span>
              </div>
            </label>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-400 font-mono">Minimum Trust Score Threshold:</span>
                <span className="font-bold text-zinc-200 font-mono">{policy.minTrustScore}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={policy.minTrustScore}
                disabled={isReadOnly}
                onChange={(e) => updatePolicy('minTrustScore', Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
