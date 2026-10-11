import React, { useState } from 'react';
import { DemoPost, SimulatedCommentRecord } from '../types/mizizi';
import { Heart, MessageCircle, Repeat2, ShieldAlert, Sparkles, Trash2, Eye, Filter, CheckCircle2 } from 'lucide-react';

interface PostEngagementViewerProps {
  post: DemoPost;
  comments: SimulatedCommentRecord[];
  onClearSimulatedForPost: (postId: string) => void;
}

export const PostEngagementViewer: React.FC<PostEngagementViewerProps> = ({
  post,
  comments,
  onClearSimulatedForPost,
}) => {
  const [viewMode, setViewMode] = useState<'combined' | 'genuine' | 'simulated'>('combined');

  // Compute metrics based on active view mode
  const displayLikes =
    viewMode === 'combined'
      ? post.genuineLikes + post.simulatedLikes
      : viewMode === 'genuine'
      ? post.genuineLikes
      : post.simulatedLikes;

  const displayComments =
    viewMode === 'combined'
      ? post.genuineComments + post.simulatedComments
      : viewMode === 'genuine'
      ? post.genuineComments
      : post.simulatedComments;

  const displayReshares =
    viewMode === 'combined'
      ? post.genuineReshares + post.simulatedReshares
      : viewMode === 'genuine'
      ? post.genuineReshares
      : post.simulatedReshares;

  const postComments = comments.filter((c) => c.postId === post.id);

  return (
    <div className="space-y-6">
      {/* View Mode Segmented Switcher & Status */}
      <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
            Data Separation Inspector (PRD Section 1 & 4)
          </span>
          <p className="text-zinc-500 text-[11px] mt-0.5">
            Switch perspective to verify that genuine user engagement is stored separately from generated test rows.
          </p>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded">
          <button
            onClick={() => setViewMode('combined')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'combined'
                ? 'bg-zinc-800 text-zinc-100 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Combined View
          </button>
          <button
            onClick={() => setViewMode('genuine')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'genuine'
                ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Genuine Activity
          </button>
          <button
            onClick={() => setViewMode('simulated')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
              viewMode === 'simulated'
                ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-800/80'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Simulated Test Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: The Social Post Card (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center font-bold text-emerald-300 text-xs">
                  {post.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-100">{post.author}</span>
                    <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded">
                      {post.appName}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">{post.authorHandle}</span>
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Post Title & Body */}
            <div className="p-5 space-y-3">
              <h3 className="text-base font-bold text-zinc-100 tracking-tight leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {post.body}
              </p>

              {/* Watermark / Label Notice */}
              <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Post ID: <strong className="text-zinc-200">{post.id}</strong></span>
                <span className="text-amber-400 font-semibold">SIMULATED DATA ISOLATED</span>
              </div>
            </div>

            {/* Engagement Metrics Strip */}
            <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <Heart className="w-4 h-4 fill-rose-500/80" />
                  <span className="tabular-nums">{displayLikes.toLocaleString()}</span>
                  {viewMode === 'combined' && post.simulatedLikes > 0 && (
                    <span className="text-[10px] text-zinc-500 font-normal">
                      ({post.genuineLikes} + {post.simulatedLikes} sim)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <MessageCircle className="w-4 h-4 text-sky-400" />
                  <span className="tabular-nums">{displayComments.toLocaleString()}</span>
                  {viewMode === 'combined' && post.simulatedComments > 0 && (
                    <span className="text-[10px] text-zinc-500 font-normal">
                      ({post.genuineComments} + {post.simulatedComments} sim)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <Repeat2 className="w-4 h-4 text-purple-400" />
                  <span className="tabular-nums">{displayReshares.toLocaleString()}</span>
                  {viewMode === 'combined' && post.simulatedReshares > 0 && (
                    <span className="text-[10px] text-zinc-500 font-normal">
                      ({post.genuineReshares} + {post.simulatedReshares} sim)
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                {viewMode} Mode
              </span>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="p-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-zinc-500 font-mono">
              Batches generated on post: {post.batchesCount}
            </span>
            {post.simulatedLikes + post.simulatedComments + post.simulatedReshares > 0 && (
              <button
                onClick={() => onClearSimulatedForPost(post.id)}
                className="px-2.5 py-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded border border-red-900/40 transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Post Test Records</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Comments Thread & Data Isolation Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Data Separation Proof Box */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
              Database Table Mapping
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">Table: Live Engagement</span>
                <div className="text-zinc-200 font-bold mt-1">
                  {post.genuineLikes} likes · {post.genuineComments} comments
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">Status: Untouched (0 modifications)</span>
              </div>

              <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">Table: SimulatedEngagement</span>
                <div className="text-amber-400 font-bold mt-1">
                  +{post.simulatedLikes} likes · +{post.simulatedComments} comments
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">Label: "SIMULATED"</span>
              </div>
            </div>
          </div>

          {/* Sample Comments List */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded overflow-hidden">
            <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono">
                  Sample Comments Feed ({postComments.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Dev Preview
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60 scrollbar-thin">
              {postComments.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 font-sans">
                  No simulated comments generated for this post yet. Go to Engagement Generator to generate 50 sample comments.
                </div>
              ) : (
                postComments.map((c) => (
                  <div key={c.id} className="p-3 space-y-1.5 hover:bg-zinc-900/30 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-300 font-mono text-[11px]">{c.authorName}</span>
                        <span className="text-[9px] font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-800/60 px-1.5 py-0.2 rounded">
                          {c.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(c.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
