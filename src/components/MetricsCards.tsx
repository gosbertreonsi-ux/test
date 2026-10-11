import React from 'react';
import { ExperimentMetrics } from '../types';
import { ShieldCheck, CopySlash, Flame, Clock, Database, Layers, ShieldAlert, Cpu } from 'lucide-react';

interface MetricsCardsProps {
  metrics: ExperimentMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* 1. Logical Attempts */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Logical Attempts</span>
          <Cpu className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-zinc-100">
          {metrics.logicalAttempts.toLocaleString()}
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono truncate">
          {metrics.throughputPerSec > 0 ? `${metrics.throughputPerSec.toLocaleString()} ops/s` : 'Standby'}
        </div>
      </div>

      {/* 2. Accepted Unique Likes */}
      <div className="p-3 bg-zinc-900/80 border border-emerald-900/40 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Accepted Unique</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">
          {metrics.acceptedUniqueLikes.toLocaleString()}
        </div>
        <div className="text-[11px] text-emerald-600 mt-1 font-mono truncate">
          Distinct accounts
        </div>
      </div>

      {/* 3. Duplicate Replays Blocked */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Duplicates Blocked</span>
          <CopySlash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-amber-400">
          {metrics.duplicateBlocked.toLocaleString()}
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono truncate">
          UNIQUE(u,p) held
        </div>
      </div>

      {/* 4. Throttled (Rate Limit 429) */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Throttled (429)</span>
          <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-orange-400">
          {metrics.throttledRateLimit.toLocaleString()}
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono truncate">
          Surge & IP caps
        </div>
      </div>

      {/* 5. Rejected Auth & Sig */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Rejected Auth/Sig</span>
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-red-400">
          {(metrics.rejectedAuth + metrics.rejectedSignature).toLocaleString()}
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono truncate">
          Invalid credentials
        </div>
      </div>

      {/* 6. Bot Clusters Quarantined */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Quarantined Risk</span>
          <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-purple-400">
          {metrics.flaggedQuarantined.toLocaleString()}
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono truncate">
          Low trust & clusters
        </div>
      </div>

      {/* 7. Average Latency */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Avg / p95 Latency</span>
          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        </div>
        <div className="text-xl font-bold font-mono tabular-nums text-sky-400">
          {metrics.averageLatencyMs}
          <span className="text-xs text-zinc-400 font-normal"> / {metrics.p95LatencyMs}ms</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono truncate">
          Queue: {metrics.queueDepth} reqs
        </div>
      </div>

      {/* 8. Counter Discrepancy */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded">
        <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
          <span className="truncate">Counter Inflation</span>
          <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </div>
        <div className={`text-xl font-bold font-mono tabular-nums ${metrics.discrepancyCount === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {metrics.discrepancyCount}
        </div>
        <div className="text-[11px] text-zinc-500 mt-1 font-mono truncate">
          Authoritative DB delta
        </div>
      </div>
    </div>
  );
};
