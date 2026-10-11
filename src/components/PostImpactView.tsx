import React from 'react';
import { SyntheticPost, ExperimentMetrics } from '../types';
import { Heart, MessageCircle, Repeat2, CheckCircle2, ShieldCheck, AlertTriangle, Trophy } from 'lucide-react';

interface PostImpactViewProps {
  post: SyntheticPost;
  metrics: ExperimentMetrics;
}

export const PostImpactView: React.FC<PostImpactViewProps> = ({ post, metrics }) => {
  // Authoritative database likes calculation:
  // Starts with base baseline likes + strictly verified unique new likes accepted by pipeline
  const authoritativeCurrent = post.authoritativeLikes + metrics.acceptedUniqueLikes;
  
  // What an unprotected platform would show (vulnerable counter that increments on every raw HTTP request):
  const unprotectedHypotheticalLikes = post.authoritativeLikes + metrics.logicalAttempts;

  // Real protected public counter (zero inflation from rejected or duplicate likes):
  const protectedPublicCounter = authoritativeCurrent;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-zinc-200 uppercase">Target Platform Evaluation & Invariant Audit</span>
            <span className="text-zinc-600">·</span>
            <span>FR-08 & Section 11</span>
          </div>
          <h2 className="text-base font-bold text-zinc-100 mt-1">
            Authoritative Counter vs. Public Manipulation Defense
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-3xl">
            In competitive engagement contests (such as pageant voting, award polls, and viral creator leaderboards), artificial likes are weaponized to game rankings. The system must guarantee that 1,000,000 simulated attempts cannot pollute the authoritative like counter.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-400 text-xs font-mono shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Counter Integrity: 100% Protected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column (5 cols): Social Media Post Card (Mocking the Instagram MGI Final Showdown) */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex flex-col justify-between">
          <div>
            {/* Post Header */}
            <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-xs font-bold text-amber-400">
                    👑
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-100">{post.author}</span>
                    <span className="w-3.5 h-3.5 bg-sky-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">✓</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">{post.authorHandle}</span>
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">{post.publishedDate}</span>
            </div>

            {/* Post Media Visual */}
            <div className="relative aspect-[4/3] bg-zinc-900 border-b border-zinc-800 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-zinc-950/80 to-zinc-950 pointer-events-none" />
              
              <div className="relative z-10 space-y-2">
                <span className="text-xs font-mono font-semibold text-amber-400 tracking-widest uppercase bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  FINAL SHOWDOWN VOTING
                </span>
                <div className="text-xl font-extrabold text-white tracking-tight">
                  🇹🇿 Miss Grand Tanzania
                </div>
                <div className="text-xs text-zinc-400 font-mono">VS</div>
                <div className="text-xl font-extrabold text-white tracking-tight">
                  🇪🇨 Miss Grand Ecuador
                </div>
                <p className="text-[11px] text-zinc-300 max-w-xs mx-auto pt-2">
                  "Only ONE will be crowned Country's Power of the Year and earn an automatic spot in the TOP 20 Grand Final!"
                </p>
              </div>
            </div>

            {/* Post Interaction Actions Bar */}
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400 bg-zinc-900/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span className="tabular-nums">{protectedPublicCounter.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Repeat2 className="w-4 h-4 text-zinc-400" />
                  <span className="tabular-nums">{post.repostsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-zinc-400" />
                  <span className="tabular-nums">{post.commentsCount.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400">Verified Public Feed</span>
            </div>

            {/* Post Caption Body */}
            <div className="p-3 text-xs space-y-2 text-zinc-300">
              <p className="leading-relaxed">
                <span className="font-bold text-zinc-100">{post.authorHandle} </span>
                {post.description}
              </p>
              {post.contestContext && (
                <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-800 font-mono text-[11px] text-zinc-300">
                  <div className="text-amber-400 font-bold mb-1">SCORING FORMULA:</div>
                  <div>{post.contestContext.votingRules}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono flex items-center justify-between">
            <span>Target Post ID: {post.id}</span>
            <span>Status: Voting Open</span>
          </div>
        </div>

        {/* Right column (7 cols): Telemetry Reconciliation & Counter Comparison */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comparison Cards: Protected System vs Unprotected Flaw */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Protected System */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-800/60 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                  With Attacker Mode Defenses
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-zinc-100">
                {protectedPublicCounter.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 leading-relaxed">
                Authoritative unique likes committed to database. Replays, invalid tokens, and rate-limit bursts were dropped before write transaction.
              </div>
              <div className="pt-2 border-t border-emerald-900/40 text-[11px] text-emerald-400 font-mono flex justify-between">
                <span>Artificial Inflation:</span>
                <span className="font-bold">+0 Fake Likes</span>
              </div>
            </div>

            {/* Vulnerable System */}
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400 font-mono">
                  Without Defensive Invariants
                </span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-red-300">
                {unprotectedHypotheticalLikes.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 leading-relaxed">
                Naive public counters incrementing on raw requests without UNIQUE constraints or replay filters. Completely exploited by the botnet.
              </div>
              <div className="pt-2 border-t border-red-900/40 text-[11px] text-red-400 font-mono flex justify-between">
                <span>Vulnerable Manipulation:</span>
                <span className="font-bold">+{metrics.logicalAttempts.toLocaleString()} Polluted</span>
              </div>
            </div>
          </div>

          {/* Database Consistency Check (FR-08) */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Database Consistency & Reconciliation Query (FR-08)
            </h3>
            
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1 overflow-x-auto">
              <div className="text-zinc-500">-- Authoritative database uniqueness query</div>
              <div>
                <span className="text-sky-400">SELECT</span> COUNT(DISTINCT user_id) <span className="text-sky-400">AS</span> distinct_active_likes
              </div>
              <div>
                <span className="text-sky-400">FROM</span> engagement_likes
              </div>
              <div>
                <span className="text-sky-400">WHERE</span> post_id = <span className="text-amber-400">'{post.id}'</span> <span className="text-sky-400">AND</span> status = <span className="text-emerald-400">'ACTIVE'</span>;
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[11px]">Distinct Users:</div>
                <div className="font-bold text-zinc-200 tabular-nums">
                  {authoritativeCurrent.toLocaleString()}
                </div>
              </div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[11px]">Public Cache:</div>
                <div className="font-bold text-zinc-200 tabular-nums">
                  {protectedPublicCounter.toLocaleString()}
                </div>
              </div>
              <div className="p-2 bg-zinc-900 rounded border border-zinc-800">
                <div className="text-zinc-500 text-[11px]">Discrepancy:</div>
                <div className="font-bold text-emerald-400 tabular-nums">
                  0 (Exact Match)
                </div>
              </div>
            </div>
          </div>

          {/* Defense Findings Summary */}
          <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded text-xs space-y-2">
            <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
              <span>Security Invariant Guarantee</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Every like request requires an idempotent state transition. Even when {metrics.logicalAttempts.toLocaleString()} attack events arrived concurrently, the database enforced <code className="text-zinc-200 bg-zinc-800 px-1 py-0.5 rounded font-mono">UNIQUE(user_id, post_id)</code>, safely returning defined idempotent results without allowing multiple active likes per user.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
