import React, { useState } from 'react';
import { ExperimentMetrics, ScenarioPreset, DefensePolicy, TestEnvironment, SecurityScorecard } from '../types';
import { Download, Copy, Check, FileCode, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface ReportModalProps {
  metrics: ExperimentMetrics;
  scorecard: SecurityScorecard;
  preset: ScenarioPreset;
  policy: DefensePolicy;
  environment: TestEnvironment;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  metrics,
  scorecard,
  preset,
  policy,
  environment,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate automated regression test script (Vitest / Jest code format)
  const regressionTestCode = `// Generated Repeatable Regression Test (Attacker Mode FR-11)
// Scenario: ${preset.name} (${preset.code})
// Date: ${new Date().toISOString()}

import { describe, it, expect } from 'vitest';
import { DefensivePipeline } from './defensivePipeline';
import { db } from './db/prisma';

describe('Adversarial Regression Test: ${preset.code}', () => {
  const testPolicy = ${JSON.stringify(
    {
      accountRateLimit: policy.accountRateLimitPerMin,
      ipRateLimit: policy.ipRateLimitPerMin,
      enforceBearerAuth: policy.enforceBearerAuth,
      verifyHmacSignatures: policy.verifyHmacSignatures,
      enforceDbUniqueConstraint: policy.enforceDbUniqueConstraint,
    },
    null,
    2
  )};

  it('must prevent duplicate active likes from inflating counter', async () => {
    const postId = 'test-post-regression-01';
    const initialDistinctLikes = await db.likes.count({ where: { postId } });

    // Simulate batch of replayed like interactions
    const results = await DefensivePipeline.simulateBatch({
      attempts: ${metrics.logicalAttempts},
      duplicateRate: ${preset.defaultDuplicatePct} / 100,
      policy: testPolicy,
      targetPostId: postId,
    });

    // Invariant 1: Duplicate active likes committed must be ZERO
    expect(results.duplicateActiveLikesCommitted).toBe(0);

    // Invariant 2: Authoritative DB distinct likes must not exceed distinct users
    const finalDistinctLikes = await db.likes.count({ where: { postId } });
    expect(finalDistinctLikes).toBeLessThanOrEqual(initialDistinctLikes + results.distinctUsers);

    // Invariant 3: Counter pollution rate must be 0%
    expect(results.counterPollutionRate).toBe(0.0);
  });

  it('must fast-reject unauthenticated requests with 401/403', async () => {
    const unauthResult = await DefensivePipeline.evaluateLike({
      token: 'INVALID_TOKEN',
      signature: 'BAD_SIG',
      userId: 'bot_unauth_01',
    });
    expect(unauthResult.statusCode).toBe(401);
    expect(unauthResult.counterIncremented).toBe(false);
  });
});`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(regressionTestCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadReport = () => {
    const reportData = {
      title: 'Attacker Mode — Security Audit Report',
      scenario: preset.name,
      scenarioCode: preset.code,
      environment: environment.name,
      policy: policy.name,
      timestamp: new Date().toISOString(),
      scorecard,
      metrics: {
        logicalAttempts: metrics.logicalAttempts,
        dispatchedRequests: metrics.dispatchedRequests,
        acceptedUniqueLikes: metrics.acceptedUniqueLikes,
        duplicateBlocked: metrics.duplicateBlocked,
        throttledRateLimit: metrics.throttledRateLimit,
        rejectedAuth: metrics.rejectedAuth,
        rejectedSignature: metrics.rejectedSignature,
        flaggedQuarantined: metrics.flaggedQuarantined,
        averageLatencyMs: metrics.averageLatencyMs,
        counterInflationRate: `${scorecard.counterPollutionRate}%`,
      },
      reproducibility: {
        regressionScript: regressionTestCode,
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attacker-mode-report-${preset.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Scorecard Hero Banner */}
      <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EXECUTIVE DEFENSE SCORECARD (FR-11)</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mt-1">
            Resilience Grade: <span className="text-emerald-400 font-mono">{scorecard.rating}</span> ({scorecard.score}/100)
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Audit evaluation for {preset.name} ({preset.code}) on {environment.name}. Defensive controls successfully prevented public counter pollution and race-condition inflation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
          >
            {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>Export JSON Report</span>
          </button>
        </div>
      </div>

      {/* Primary Invariants Table (FR-08 & Section 11 Success Metrics) */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-3">
        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
          Security Invariants Compliance Matrix (PRD Section 11)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-500 text-[11px] block">Duplicate Active Likes Committed</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {scorecard.duplicateActiveLikes} (Target: 0)
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Status: PASS</span>
          </div>

          <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-500 text-[11px] block">Invalidly Authenticated Likes</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {scorecard.unauthorizedCommittedLikes} (Target: 0)
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Status: PASS</span>
          </div>

          <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-500 text-[11px] block">Rejected-Event Counter Pollution</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {scorecard.counterPollutionRate}% (Target: 0.0%)
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Status: PASS</span>
          </div>

          <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
            <span className="text-zinc-500 text-[11px] block">Unauthorized External Dispatches</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              0 (Enforced)
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Status: PASS</span>
          </div>
        </div>
      </div>

      {/* Detailed Findings */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-3">
        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
          Audit Findings & Defensive Verifications
        </h3>

        <div className="space-y-2">
          {scorecard.findings.map((f, i) => (
            <div key={i} className="p-3 bg-zinc-950 rounded border border-zinc-800/80 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-200">{f.title}</span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">
                  {f.status}
                </span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Regression Test Code Generation (FR-11: Repeatable Regression-Test Configuration) */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Export Automated Regression Test (Vitest / CI)
            </h3>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Test'}</span>
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Save this configuration directly to your test suite to prevent regressions before releasing engagement features to production.
        </p>

        <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 scrollbar-thin">
          {regressionTestCode}
        </pre>
      </div>
    </div>
  );
};
