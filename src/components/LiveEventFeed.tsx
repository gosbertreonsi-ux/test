import React, { useState } from 'react';
import { SimulatedEvent } from '../types';
import { Eye, Search, Filter, ShieldCheck, X } from 'lucide-react';

interface LiveEventFeedProps {
  events: SimulatedEvent[];
}

export const LiveEventFeed: React.FC<LiveEventFeedProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<SimulatedEvent | null>(null);
  const [filterDecision, setFilterDecision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter((evt) => {
    if (filterDecision !== 'ALL' && evt.decision !== filterDecision) return false;
    if (
      searchQuery &&
      !evt.actorUsername.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !evt.ruleCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !evt.clientIp.includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  const getDecisionBadge = (decision: SimulatedEvent['decision']) => {
    switch (decision) {
      case 'ACCEPTED':
        return <span className="text-emerald-400 font-semibold font-mono text-[11px]">ACCEPTED</span>;
      case 'DUPLICATE_IDEMPOTENT':
        return <span className="text-amber-400 font-semibold font-mono text-[11px]">DUPLICATE (200/409)</span>;
      case 'THROTTLED':
        return <span className="text-orange-400 font-semibold font-mono text-[11px]">THROTTLED (429)</span>;
      case 'REJECTED':
        return <span className="text-red-400 font-semibold font-mono text-[11px]">REJECTED (401/403)</span>;
      case 'FLAGGED':
        return <span className="text-purple-400 font-semibold font-mono text-[11px]">FLAGGED RISK</span>;
      default:
        return <span className="text-zinc-400 font-mono text-[11px]">{decision}</span>;
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded flex flex-col">
      {/* Header bar with filters */}
      <div className="p-3 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Live Request Stream (FR-05 & FR-09)
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            ({filteredEvents.length} inspectable events in buffer)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Decision filter */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-xs">
            <Filter className="w-3 h-3 text-zinc-500" />
            <select
              aria-label="Filter events by decision"
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="bg-transparent text-zinc-300 font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Decisions</option>
              <option value="ACCEPTED">ACCEPTED (Committed)</option>
              <option value="DUPLICATE_IDEMPOTENT">DUPLICATE (Idempotent)</option>
              <option value="THROTTLED">THROTTLED (Rate Limit 429)</option>
              <option value="REJECTED">REJECTED (Auth / Sig / Seq)</option>
              <option value="FLAGGED">FLAGGED (Risk / Bot Cluster)</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Search user, IP, rule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded pl-7 pr-2 py-1 text-xs text-zinc-300 font-mono w-40 sm:w-52 focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto max-h-96 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-500 font-mono text-[11px]">
              <th className="py-2 px-3"># Index</th>
              <th className="py-2 px-3">Synthetic Actor</th>
              <th className="py-2 px-3">Source IP</th>
              <th className="py-2 px-3">Decision</th>
              <th className="py-2 px-3">Defensive Rule Code</th>
              <th className="py-2 px-3 text-right">Latency</th>
              <th className="py-2 px-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40 font-mono">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-zinc-500 text-xs font-sans">
                  No simulated events recorded yet. Start a simulation in Scenario Studio to stream live telemetry.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-2 px-3 text-zinc-500 tabular-nums">#{evt.index}</td>
                  <td className="py-2 px-3 text-zinc-300 truncate max-w-[140px]">
                    {evt.actorUsername}
                  </td>
                  <td className="py-2 px-3 text-zinc-400">{evt.clientIp}</td>
                  <td className="py-2 px-3">{getDecisionBadge(evt.decision)}</td>
                  <td className="py-2 px-3 text-zinc-400 truncate max-w-[200px]" title={evt.reasonCode}>
                    {evt.ruleCode}
                  </td>
                  <td className="py-2 px-3 text-right text-zinc-400 tabular-nums">{evt.latencyMs}ms</td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 cursor-pointer"
                      title="Inspect event headers & payload"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drilldown Modal: Inspect Event Payload & Headers */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-zinc-950 border border-zinc-800 rounded max-w-2xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-200">
                  Event Inspection #{selectedEvent.index}
                </span>
                <span className="text-zinc-600">·</span>
                {getDecisionBadge(selectedEvent.decision)}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-zinc-900/60 p-3 rounded border border-zinc-800">
              <div>
                <span className="text-zinc-500 block">Synthetic User ID:</span>
                <span className="text-zinc-200">{selectedEvent.actorId}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Username:</span>
                <span className="text-zinc-200">{selectedEvent.actorUsername}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Source IP:</span>
                <span className="text-zinc-200">{selectedEvent.clientIp}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Trust Score:</span>
                <span className="text-zinc-200">{selectedEvent.actorTrustScore}/100</span>
              </div>
            </div>

            {/* Mock HTTP Headers */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Simulated Inbound HTTP Request Headers:
              </span>
              <pre className="p-3 bg-zinc-900 border border-zinc-800 rounded text-[11px] font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`POST /api/v1/posts/${selectedEvent.targetPostId}/like HTTP/1.1
Host: api.platform.internal
User-Agent: ${selectedEvent.userAgent}
Authorization: ${selectedEvent.hasValidAuth ? 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' : 'Bearer [MALFORMED_OR_EXPIRED_TOKEN]'}
X-Request-Signature: ${selectedEvent.hasValidSignature ? 'sha256=9b72a9dfc4468f...' : 'sha256=TAMPERED_HMAC_HASH'}
X-Idempotency-Key: ${selectedEvent.idempotencyKey}
X-Session-Impression: ${selectedEvent.hasSessionImpression ? 'imp_verified_2026' : 'null (headless-direct)'}
Content-Type: application/json

{
  "actor_id": "${selectedEvent.actorId}",
  "post_id": "${selectedEvent.targetPostId}",
  "event_type": "like",
  "client_timestamp": ${selectedEvent.timestamp}
}`}
              </pre>
            </div>

            {/* Defense Pipeline Decision Details */}
            <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded text-xs space-y-1">
              <div className="text-zinc-300 font-semibold font-mono">
                Pipeline Decision Code: <span className="text-sky-400">{selectedEvent.ruleCode}</span>
              </div>
              <div className="text-zinc-400 font-mono text-[11px]">
                Reason: {selectedEvent.reasonCode}
              </div>
              <div className="text-zinc-400 font-mono text-[11px] pt-1">
                Database Unique Constraint: {selectedEvent.isDuplicate ? 'COLLISION_PREVENTED (No DB write)' : 'NEW_KEY_REGISTERED'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
