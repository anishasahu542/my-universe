import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  FileText,
  Send,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  Sparkles,
  Gamepad2,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { PortfolioTab } from '../../types/game';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const PortfolioPanel: React.FC = () => {
  const activePanel = useGameStore((s) => s.activePanel);
  const closePanel = useGameStore((s) => s.closePanel);
  const openPanel = useGameStore((s) => s.openPanel);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (activePanel === null || activePanel === 'settings') {
    return null;
  }

  const currentTab = activePanel as PortfolioTab | 'controls';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const navTabs: { id: PortfolioTab | 'controls'; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'about', label: 'Identity & Bio', icon: <User className="w-4 h-4" />, color: '#00F0FF' },
    { id: 'projects', label: 'Hangar (Projects)', icon: <Briefcase className="w-4 h-4" />, color: '#A855F7' },
    { id: 'resume', label: 'Telemetry (Resume)', icon: <FileText className="w-4 h-4" />, color: '#F59E0B' },
    { id: 'contact', label: 'Transmissions', icon: <Send className="w-4 h-4" />, color: '#10B981' },
    { id: 'controls', label: 'Flight Controls', icon: <Gamepad2 className="w-4 h-4" />, color: '#38BDF8' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 select-none">
      <div className="hud-panel p-4 sm:p-8 max-w-4xl w-full h-[90vh] flex flex-col border-cyan-400/50 relative overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-cyan-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-wider text-white font-['Orbitron']">
                ODYSSEY ARCHIVE
              </h2>
              <p className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                Sector 01 Database • Access Level: Authorized
              </p>
            </div>
          </div>

          <button
            onClick={closePanel}
            className="p-2 rounded-sm bg-slate-900 border border-slate-700 hover:border-cyan-400 text-gray-400 hover:text-white transition-colors"
            title="Close [Esc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex overflow-x-auto py-3 gap-2 border-b border-slate-800 shrink-0 scrollbar-none">
          {navTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => openPanel(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-mono font-medium whitespace-nowrap transition-all ${
                currentTab === t.id
                  ? 'bg-cyan-500/20 border border-cyan-400 text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'bg-slate-900/60 border border-slate-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              <span style={{ color: t.color }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-6 pr-2">
          {/* TAB 1: ABOUT */}
          {currentTab === 'about' && (
            <div className="space-y-6">
              <div className="hud-panel p-6 rounded-sm border-cyan-500/30 bg-slate-950/60">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white font-['Orbitron'] mb-1">
                      {PORTFOLIO_DATA.profile.name}
                    </h3>
                    <p className="text-sm font-['Rajdhani'] font-bold text-cyan-400 uppercase tracking-widest">
                      {PORTFOLIO_DATA.profile.title}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-400 text-emerald-300 text-xs font-mono">
                    ● {PORTFOLIO_DATA.profile.status}
                  </div>
                </div>

                <p className="text-gray-300 font-['Rajdhani'] text-base leading-relaxed mb-6 font-medium">
                  {PORTFOLIO_DATA.profile.bio}
                </p>

                <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Technical Specializations & Stacks</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {PORTFOLIO_DATA.profile.coreSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-sm bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {currentTab === 'projects' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PORTFOLIO_DATA.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="hud-panel p-5 rounded-sm border-slate-700/80 hover:border-purple-400 transition-all bg-slate-950/70 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {proj.category}
                        </span>
                        {proj.featured && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            Flagship
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold font-['Orbitron'] text-white mb-2">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-gray-300 font-['Rajdhani'] leading-relaxed mb-4 font-medium">
                        {proj.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-slate-800">
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hud-glow-btn flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500 text-xs font-mono text-purple-200 rounded-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Launch Demo</span>
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hud-glow-btn px-3 flex items-center justify-center py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-gray-300 rounded-sm"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RESUME */}
          {currentTab === 'resume' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-sm font-mono text-amber-300 uppercase tracking-widest">
                  Mission Career Log & Experience
                </h3>
                <button
                  onClick={() => alert('Telemetry transmission downloaded: Resume CV PDF package prepared.')}
                  className="hud-glow-btn flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-mono rounded-sm hover:text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Telemetry CV</span>
                </button>
              </div>

              <div className="space-y-4">
                {PORTFOLIO_DATA.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="hud-panel p-5 rounded-sm border-slate-800 bg-slate-950/60"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 mb-2">
                      <h4 className="text-base font-bold font-['Orbitron'] text-white">
                        {exp.role} <span className="text-amber-400">@ {exp.company}</span>
                      </h4>
                      <span className="text-xs font-mono text-gray-400">{exp.period}</span>
                    </div>
                    <p className="text-xs text-gray-300 font-['Rajdhani'] leading-relaxed mb-3 font-medium">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="hud-panel p-5 rounded-sm border-slate-800 bg-slate-950/60">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                  Education & Qualifications
                </h4>
                <div className="text-sm font-bold text-white font-['Orbitron']">
                  {PORTFOLIO_DATA.education.degree}
                </div>
                <div className="text-xs font-mono text-cyan-300">
                  {PORTFOLIO_DATA.education.institution} • Class of {PORTFOLIO_DATA.education.year}
                </div>
                <p className="text-xs text-gray-400 mt-1 font-['Rajdhani']">
                  {PORTFOLIO_DATA.education.honors}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {currentTab === 'contact' && (
            <div className="space-y-6">
              <div className="hud-panel p-6 rounded-sm border-emerald-500/30 bg-slate-950/60 max-w-xl mx-auto text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black font-['Orbitron'] text-white mb-1">
                  SUB-SPACE TRANSMISSION
                </h3>
                <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-6">
                  {PORTFOLIO_DATA.contact.availability}
                </p>

                {/* Direct Email Box with Copy */}
                <div className="flex items-center justify-between p-3 rounded-sm bg-slate-900 border border-slate-700 mb-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>{PORTFOLIO_DATA.contact.email}</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-xs font-mono text-emerald-300 rounded transition-colors"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Social links */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={PORTFOLIO_DATA.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hud-glow-btn flex items-center justify-center gap-2 p-3 bg-slate-900/90 border border-slate-700 hover:border-emerald-400 rounded-sm text-xs font-mono text-gray-200"
                  >
                    <GithubIcon className="w-4 h-4 text-emerald-400" />
                    <span>GitHub Comms</span>
                  </a>
                  <a
                    href={PORTFOLIO_DATA.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hud-glow-btn flex items-center justify-center gap-2 p-3 bg-slate-900/90 border border-slate-700 hover:border-emerald-400 rounded-sm text-xs font-mono text-gray-200"
                  >
                    <LinkedinIcon className="w-4 h-4 text-emerald-400" />
                    <span>LinkedIn Network</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTROLS & ROADMAP */}
          {currentTab === 'controls' && (
            <div className="space-y-6">
              <div className="hud-panel p-5 rounded-sm border-sky-500/30 bg-slate-950/60">
                <h3 className="text-base font-bold font-['Orbitron'] text-white mb-3 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-sky-400" />
                  <span>Module 01 Flight Controls</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-gray-300">Directional Navigation</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      W, A, S, D / Arrows
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-gray-300">Camera Orbit & Tilt</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      Click + Drag / Touch
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-gray-300">Vertical Thruster Jump</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      Spacebar
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-gray-300">Interact with Waypoint</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      [E] Key / Click Prompt
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-gray-300">Sprint Thruster Boost</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      Shift Key
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                    <span className="text-gray-300">Pause / Return to Orbit</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-gray-300 border border-slate-700 font-bold">
                      Escape [Esc]
                    </span>
                  </div>
                </div>
              </div>

              {/* Status of implemented vs planned features */}
              <div className="hud-panel p-5 rounded-sm border-slate-800 bg-slate-950/60">
                <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
                  Architecture Status: Module 01 Completed vs Future Modules
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>[Implemented] Rapier 3D Physics Character & Orbital Camera</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>[Implemented] Quaternius Ultimate Space Kit Model Pipeline</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>[Implemented] 4 Proximity Interactive Waypoint Holograms</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>[Implemented] Accessible Direct Portfolio Fallback & Vitest Test Suite</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 pt-2 border-t border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>[Upcoming Module 02] Procedural Planetary Landing & Terrain</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                    <span>[Upcoming Module 03] AI Companion Drone & Interactive Dialogue</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>[Upcoming Module 04] Asteroid Mining Mini-game & Local Storage Save</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-cyan-500/20 flex justify-between items-center shrink-0">
          <span className="text-[10px] font-mono text-gray-500 uppercase">
            PRESS [ESC] TO CLOSE ARCHIVE
          </span>
          <button
            onClick={closePanel}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-['Orbitron'] text-xs tracking-wider uppercase rounded-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            Return to Vessel
          </button>
        </div>
      </div>
    </div>
  );
};
