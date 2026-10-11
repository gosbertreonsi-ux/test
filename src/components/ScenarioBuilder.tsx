import React from 'react';
import { PRESET_SCENARIOS, DEFAULT_POSTS } from '../data/presetScenarios';
import { ScenarioPreset, ScenarioType, SyntheticPost, TestEnvironment } from '../types';
import { Play, Pause, RotateCcw, Zap, Target, Sliders, Dna, AlertCircle } from 'lucide-react';

interface ScenarioBuilderProps {
  selectedPreset: ScenarioPreset;
  setSelectedPreset: (preset: ScenarioPreset) => void;
  attempts: number;
  setAttempts: (n: number) => void;
  duplicatePct: number;
  setDuplicatePct: (n: number) => void;
  invalidAuthPct: number;
  setInvalidAuthPct: (n: number) => void;
  invalidSeqPct: number;
  setInvalidSeqPct: (n: number) => void;
  invalidSigPct: number;
  setInvalidSigPct: (n: number) => void;
  durationSeconds: number;
  setDurationSeconds: (n: number) => void;
  concurrency: number;
  setConcurrency: (n: number) => void;
  seed: string;
  setSeed: (s: string) => void;
  targetPost: SyntheticPost;
  setTargetPost: (post: SyntheticPost) => void;
  environment: TestEnvironment;
  isSimRunning: boolean;
  isSimPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  selectedPreset,
  setSelectedPreset,
  attempts,
  setAttempts,
  duplicatePct,
  setDuplicatePct,
  invalidAuthPct,
  setInvalidAuthPct,
  invalidSeqPct,
  setInvalidSeqPct,
  invalidSigPct,
  setInvalidSigPct,
  durationSeconds,
  setDurationSeconds,
  concurrency,
  setConcurrency,
  seed,
  setSeed,
  targetPost,
  setTargetPost,
  environment,
  isSimRunning,
  isSimPaused,
  onStart,
  onPause,
  onReset,
}) => {
  const handleSelectPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset);
    setAttempts(preset.defaultAttempts);
    setDuplicatePct(preset.defaultDuplicatePct);
    setInvalidAuthPct(preset.defaultInvalidAuthPct);
    setInvalidSeqPct(preset.defaultInvalidSeqPct);
    setInvalidSigPct(preset.defaultInvalidSigPct);
    setDurationSeconds(preset.durationSeconds);
    setConcurrency(preset.defaultConcurrency);
  };

  const handle1MillionBenchmark = () => {
    const coordPreset = PRESET_SCENARIOS.find((s) => s.id === 'coordinated') || PRESET_SCENARIOS[0];
    handleSelectPreset(coordPreset);
    setAttempts(1000000);
    setDuplicatePct(45);
    setInvalidAuthPct(15);
    setInvalidSeqPct(20);
    setInvalidSigPct(10);
    setDurationSeconds(30);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Quick 1M Benchmark Action */}
      <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-900/50 p-4 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase text-red-400 tracking-wider">
              Primary PRD Benchmark
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400">Section 1 & FR-02 (Scenario G)</span>
          </div>
          <h2 className="text-base font-bold text-zinc-100 mt-1">
            Simulate 1,000,000 Coordinated Artificial Likes
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
            Stress-test rate limiters, token validation, and UNIQUE(user_id, post_id) integrity under high-volume botnet swarm conditions without flooding external networks.
          </p>
        </div>

        <button
          onClick={handle1MillionBenchmark}
          disabled={isSimRunning}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold text-xs rounded transition-all flex items-center gap-2 shrink-0 shadow-md shadow-red-950 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Load 1,000,000 Attack Benchmark</span>
        </button>
      </div>

      {/* Preset Scenario Selector (Scenarios A through H) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
            Select Test Scenario (FR-02)
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            8 Defensive Security Scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded text-left border transition-all flex flex-col justify-between h-full cursor-pointer ${
                  isSelected
                    ? 'border-red-500/80 bg-red-950/20 text-zinc-100 shadow-sm'
                    : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-zinc-200">
                      {preset.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                      {preset.code}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {preset.shortDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Default Attempts:</span>
                  <span className="font-semibold text-zinc-200">
                    {preset.defaultAttempts.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Post Selection & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Target Post Selector */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-4">
          <div className="flex items-center gap-2 text-zinc-100 text-sm font-semibold uppercase tracking-wider">
            <Target className="w-4 h-4 text-red-400" />
            <span>Target Engagement Post</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-mono">Select Target Social Media Item:</label>
            <select
              aria-label="Select Target Social Media Item"
              value={targetPost.id}
              onChange={(e) => {
                const found = DEFAULT_POSTS.find((p) => p.id === e.target.value);
                if (found) setTargetPost(found);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-sans"
            >
              {DEFAULT_POSTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.authorHandle})
                </option>
              ))}
            </select>
          </div>

          {/* Target Post Summary */}
          <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded text-xs space-y-2">
            <div className="font-semibold text-zinc-200">
              {targetPost.title}
            </div>
            <div className="text-zinc-400 line-clamp-3">
              {targetPost.description}
            </div>
            {targetPost.contestContext && (
              <div className="text-[11px] text-zinc-400 bg-zinc-900/80 p-2 rounded border border-zinc-800 font-mono">
                <span className="text-red-400 font-semibold">Rules: </span>
                {targetPost.contestContext.votingRules}
              </div>
            )}
            <div className="pt-2 border-t border-zinc-900 flex justify-between text-zinc-400 font-mono text-[11px]">
              <span>Authoritative Likes:</span>
              <span className="text-zinc-200 font-semibold">{targetPost.authoritativeLikes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Attack Intensity & Anomaly Vector Sliders */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 p-4 rounded space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-100 text-sm font-semibold uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-red-400" />
              <span>Attack Parameters & Vector Weights (FR-03)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Dna className="w-3.5 h-3.5" />
              <span>Seed:</span>
              <input
                type="text"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-28 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 text-xs font-mono"
                placeholder="random seed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Attempts Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">Total Attempted Interactions:</span>
                <span className="font-bold font-mono text-zinc-100 tabular-nums">
                  {attempts.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={attempts}
                onChange={(e) => setAttempts(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-0.5">
                <span>5K</span>
                <span>250K</span>
                <span>500K</span>
                <span>1,000,000</span>
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">Attack Duration:</span>
                <span className="font-bold font-mono text-zinc-100 tabular-nums">
                  {durationSeconds} seconds
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-0.5">
                <span>5s (Flash Burst)</span>
                <span>30s (Standard)</span>
                <span>60s (Sustained)</span>
              </div>
            </div>

            {/* Duplicate Percentage */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">Duplicate Replay Rate:</span>
                <span className="font-bold font-mono text-amber-400 tabular-nums">
                  {duplicatePct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={duplicatePct}
                onChange={(e) => setDuplicatePct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Tests idempotency keys and UNIQUE(user_id, post_id) DB constraints.
              </p>
            </div>

            {/* Invalid Auth Percentage */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">Invalid Authentication Rate:</span>
                <span className="font-bold font-mono text-red-400 tabular-nums">
                  {invalidAuthPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={invalidAuthPct}
                onChange={(e) => setInvalidAuthPct(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Simulates missing, expired, or corrupted user tokens.
              </p>
            </div>

            {/* Broken Signature Percentage */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">Broken HMAC Signatures:</span>
                <span className="font-bold font-mono text-orange-400 tabular-nums">
                  {invalidSigPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={invalidSigPct}
                onChange={(e) => setInvalidSigPct(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Tests request tampering, replay nonces, and cryptographic validation.
              </p>
            </div>

            {/* Invalid Sequence Percentage */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">Missing Impression Sequence:</span>
                <span className="font-bold font-mono text-purple-400 tabular-nums">
                  {invalidSeqPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={invalidSeqPct}
                onChange={(e) => setInvalidSeqPct(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Simulates headless direct API calls without natural client viewing sessions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions & Safety Guard Notification */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="p-2 rounded bg-zinc-800 text-zinc-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <span className="text-zinc-200 font-semibold">Active Target: </span>
            <span className="font-mono text-zinc-400">{environment.approvedTarget}</span>
            <div className="text-[11px] text-zinc-500">
              Hard dispatch rate: {environment.maxDispatchRate.toLocaleString()} req/s · Hard cap: {environment.maxDispatchCount.toLocaleString()} events
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onReset}
            disabled={isSimRunning && !isSimPaused}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {isSimRunning && !isSimPaused ? (
            <button
              onClick={onPause}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Simulator</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-md shadow-red-950 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimPaused ? 'Resume Simulation' : 'Execute Attack Simulation'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
