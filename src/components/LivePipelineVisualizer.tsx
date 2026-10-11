import React from 'react';
import { ExperimentMetrics, DefensePolicy } from '../types';
import { ShieldCheck, ShieldAlert, KeyRound, Flame, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface LivePipelineVisualizerProps {
  metrics: ExperimentMetrics;
  policy: DefensePolicy;
}

export const LivePipelineVisualizer: React.FC<LivePipelineVisualizerProps> = ({ metrics, policy }) => {
  // Compute numbers arriving and dropping at each stage
  const ingressCount = metrics.logicalAttempts;
  const envGuardPass = ingressCount; // within limits unless staging breached
  const authPass = Math.max(0, envGuardPass - metrics.rejectedAuth - metrics.rejectedSignature);
  const rateLimitPass = Math.max(0, authPass - metrics.throttledRateLimit);
  const riskPass = Math.max(0, rateLimitPass - metrics.flaggedQuarantined - metrics.rejectedSequence);
  const idempotencyPass = Math.max(0, riskPass - metrics.duplicateBlocked);
  const committedCount = metrics.acceptedUniqueLikes;

  const stages = [
    {
      id: 'ingress',
      title: '01. Event Ingress',
      desc: 'Synthetic attempt generator',
      icon: Users,
      count: ingressCount,
      dropped: 0,
      dropLabel: '',
      color: 'text-zinc-300',
      activeColor: 'border-zinc-700 bg-zinc-900/60',
    },
    {
      id: 'auth',
      title: '02. Auth & Signature',
      desc: policy.enforceBearerAuth ? 'Bearer JWT & HMAC-SHA256' : 'Auth Check: Disabled',
      icon: KeyRound,
      count: authPass,
      dropped: metrics.rejectedAuth + metrics.rejectedSignature,
      dropLabel: 'Rejected Auth',
      color: 'text-red-400',
      activeColor: 'border-red-900/40 bg-zinc-900/60',
    },
    {
      id: 'rate_limit',
      title: '03. Multi-Dim Rate Limiter',
      desc: `Cap: ${policy.accountRateLimitPerMin}/acct · ${policy.ipRateLimitPerMin}/ip`,
      icon: Flame,
      count: rateLimitPass,
      dropped: metrics.throttledRateLimit,
      dropLabel: 'Throttled (429)',
      color: 'text-orange-400',
      activeColor: 'border-orange-900/40 bg-zinc-900/60',
    },
    {
      id: 'risk_sequence',
      title: '04. Risk & Sequence Check',
      desc: policy.clusterAnomalyDetection ? 'Bot cluster anomaly & session flow' : 'Heuristics: Relaxed',
      icon: ShieldAlert,
      count: riskPass,
      dropped: metrics.flaggedQuarantined + metrics.rejectedSequence,
      dropLabel: 'Quarantined / Out-of-Order',
      color: 'text-purple-400',
      activeColor: 'border-purple-900/40 bg-zinc-900/60',
    },
    {
      id: 'idempotency',
      title: '05. Idempotency & DB UNIQUE',
      desc: policy.enforceDbUniqueConstraint ? 'UNIQUE(user_id, post_id)' : 'Unconstrained',
      icon: CheckCircle2,
      count: idempotencyPass,
      dropped: metrics.duplicateBlocked,
      dropLabel: 'Duplicates Handled',
      color: 'text-amber-400',
      activeColor: 'border-amber-900/40 bg-zinc-900/60',
    },
    {
      id: 'commit',
      title: '06. Authoritative DB Commit',
      desc: 'Distinct active user like committed',
      icon: ShieldCheck,
      count: committedCount,
      dropped: 0,
      dropLabel: '',
      color: 'text-emerald-400',
      activeColor: 'border-emerald-800/60 bg-emerald-950/20',
    },
  ];

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
            Defensive Evaluation Pipeline (FR-06)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time stage filtration showing event ingress, verification gates, drop reasons, and committed unique interactions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <span>Overall Filtration Rate:</span>
          <span className="font-semibold text-zinc-100">
            {ingressCount > 0 ? (((ingressCount - committedCount) / ingressCount) * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
      </div>

      {/* Grid of pipeline stages with arrows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id} className="relative flex flex-col justify-between">
              <div
                className={`p-3 rounded border ${stage.activeColor} flex flex-col justify-between h-full transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-300 truncate">
                      {stage.title}
                    </span>
                    <Icon className={`w-4 h-4 ${stage.color} shrink-0`} />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight mb-3">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-zinc-500 font-mono">Passing:</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-zinc-100">
                      {stage.count.toLocaleString()}
                    </span>
                  </div>

                  {stage.dropped > 0 && (
                    <div className="flex items-baseline justify-between mt-1 text-[11px] text-red-400/90 font-mono">
                      <span className="truncate pr-1">Blocked:</span>
                      <span className="tabular-nums font-semibold shrink-0">
                        -{stage.dropped.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Connecting arrow for larger viewports */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-zinc-600 pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
