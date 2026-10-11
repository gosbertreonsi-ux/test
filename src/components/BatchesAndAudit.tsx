import React from 'react';
import { EngagementBatch, AuditLog } from '../types/mizizi';
import { Layers, Trash2, Clock, ShieldCheck, History, AlertCircle } from 'lucide-react';

interface BatchesAndAuditProps {
  batches: EngagementBatch[];
  auditLogs: AuditLog[];
  onDeleteBatch: (batchId: string) => void;
  onClearAuditLogs: () => void;
}

export const BatchesAndAudit: React.FC<BatchesAndAuditProps> = ({
  batches,
  auditLogs,
  onDeleteBatch,
  onClearAuditLogs,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Batches Management Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Generated Test Batches (FR-05 & Acceptance Criteria 5)
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Each batch is assigned a unique UUID. Deleting a batch removes its simulated rows without altering genuine engagement.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
            {batches.length} Active Batch(es)
          </span>
        </div>

        <div className="overflow-x-auto max-h-80 scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-500 text-[11px]">
                <th className="p-3">Batch UUID</th>
                <th className="p-3">App</th>
                <th className="p-3">Target Post</th>
                <th className="p-3">Generated Events</th>
                <th className="p-3">Cadence</th>
                <th className="p-3">Created At</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500 font-sans">
                    No active simulated batches. Use the Engagement Generator to produce test data.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-zinc-800/30">
                    <td className="p-3 text-zinc-300 font-bold truncate max-w-[140px]" title={batch.id}>
                      {batch.id}
                    </td>
                    <td className="p-3">
                      <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">
                        {batch.appName}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-300 truncate max-w-[180px]" title={batch.postTitle}>
                      {batch.postTitle}
                    </td>
                    <td className="p-3 text-zinc-200">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-bold">+{batch.likes} ❤️</span>
                        <span className="text-sky-400 font-bold">+{batch.comments} 💬</span>
                        <span className="text-purple-400 font-bold">+{batch.reshares} 🔄</span>
                      </div>
                    </td>
                    <td className="p-3 text-zinc-400 capitalize">{batch.deliveryMode}</td>
                    <td className="p-3 text-zinc-400">
                      {new Date(batch.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteBatch(batch.id)}
                        className="px-2 py-1 text-red-400 hover:text-red-200 hover:bg-red-950/60 border border-red-900/40 rounded transition-colors text-[11px] cursor-pointer inline-flex items-center gap-1"
                        title="Delete this batch (DELETE /api/engagement/batches/:batchId)"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Batch</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Audit Logs Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span>Administrative Audit Trail (PRD Section 1 & 4)</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Immutable log tracking every generation, deletion, and purge event with administrator identity and target post reference.
            </p>
          </div>
          <button
            onClick={onClearAuditLogs}
            className="text-zinc-500 hover:text-zinc-300 font-mono text-[11px] cursor-pointer"
          >
            Clear Audit Trail
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/40 font-mono text-xs scrollbar-thin">
          {auditLogs.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 font-sans">
              No audit logs recorded yet.
            </div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-3 flex items-center justify-between gap-4 hover:bg-zinc-900/30">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-[11px] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`font-bold text-[10px] uppercase px-1.5 py-0.5 rounded ${
                      log.action === 'GENERATE_BATCH'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : log.action === 'DELETE_BATCH'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                        : 'bg-red-950/80 text-red-400 border border-red-800/60'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-zinc-300 font-sans text-xs">{log.details}</span>
                </div>

                <div className="text-right text-[11px] text-zinc-500 shrink-0">
                  <span>by <strong className="text-zinc-300">{log.admin}</strong></span>
                  <span className="mx-1.5">·</span>
                  <span className="text-zinc-400">{log.appName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
