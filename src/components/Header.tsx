import React from 'react';
import { AlertOctagon, Shield, Terminal, ShieldAlert } from 'lucide-react';
import { TestEnvironment, UserRole } from '../types';

interface HeaderProps {
  currentTab: 'telemetry' | 'scenario' | 'defense' | 'post' | 'report' | 'custom_app';
  setCurrentTab: (tab: 'telemetry' | 'scenario' | 'defense' | 'post' | 'report' | 'custom_app') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  environment: TestEnvironment;
  setEnvironment: (env: TestEnvironment) => void;
  environments: TestEnvironment[];
  onEmergencyKillSwitch: () => void;
  isSimRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  environment,
  setEnvironment,
  environments,
  onEmergencyKillSwitch,
  isSimRunning,
}) => {
  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    sec_admin: { label: 'Security Admin', desc: 'Full permissions & policy approval' },
    sec_engineer: { label: 'Security Engineer', desc: 'Execute tests & inspect telemetry' },
    backend_engineer: { label: 'Backend Engineer', desc: 'DB constraints & queue telemetry' },
    observer: { label: 'Observer (Read Only)', desc: 'Auditing & monitoring mode' },
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-6">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-wider text-zinc-100 uppercase">
                Attacker Mode
              </span>
              <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                v1.0-sim
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-medium overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setCurrentTab('telemetry')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'telemetry'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setCurrentTab('scenario')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'scenario'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Scenario Studio
            </button>
            <button
              onClick={() => setCurrentTab('custom_app')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                currentTab === 'custom_app'
                  ? 'bg-sky-950/60 text-sky-300 font-semibold border border-sky-600/60'
                  : 'text-zinc-400 hover:text-sky-300 hover:bg-zinc-900'
              }`}
            >
              <span>Live App Testing</span>
            </button>
            <button
              onClick={() => setCurrentTab('defense')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'defense'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Defense Matrix
            </button>
            <button
              onClick={() => setCurrentTab('post')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'post'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Target Post Impact
            </button>
            <button
              onClick={() => setCurrentTab('report')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'report'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Audit Report
            </button>
          </nav>

          {/* Zone 3: Controls, RBAC, Environment & Emergency Stop */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Environment selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-2 py-1 rounded text-xs">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                aria-label="Target Test Environment"
                value={environment.id}
                onChange={(e) => {
                  const target = environments.find((env) => env.id === e.target.value);
                  if (target) setEnvironment(target);
                }}
                className="bg-transparent text-zinc-300 font-mono text-xs focus:outline-none cursor-pointer"
              >
                {environments.map((env) => (
                  <option key={env.id} value={env.id} className="bg-zinc-900 text-zinc-200">
                    {env.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Switcher */}
            <div className="hidden md:flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-2 py-1 rounded text-xs">
              <select
                aria-label="User Role (RBAC)"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-zinc-300 font-mono text-xs focus:outline-none cursor-pointer"
              >
                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                  <option key={role} value={role} className="bg-zinc-900 text-zinc-200">
                    {roleLabels[role].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Kill Switch */}
            <button
              onClick={onEmergencyKillSwitch}
              title="FR-01 / FR-10: Immediate emergency stop of all running simulations and network dispatches"
              className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-all ${
                isSimRunning
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950 border border-red-400 animate-pulse'
                  : 'bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-800/60'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Kill Switch</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
