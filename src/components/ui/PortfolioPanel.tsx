import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  Zap,
  Award,
  Send,
  FileText,
  Gamepad2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Check,
  Copy,
  Download,
  Sparkles,
  Star,
  MessageSquare,
  Bot,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { SKILLS_DATA } from '../../data/skillsData';
import { ACHIEVEMENTS_DATA } from '../../data/achievementsData';
import { ABOUT_DIALOGUE_DATA } from '../../data/aboutDialogueData';
import { PortfolioTab } from '../../types/game';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
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
  const progression = useGameStore((s) => s.progression);
  const collectSkill = useGameStore((s) => s.collectSkill);

  // Local state for tabs
  const [selectedProjectId, setSelectedProjectId] = useState<string>('aegis-ai');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>('all');
  const [selectedDialogueId, setSelectedDialogueId] = useState<string>('who-are-you');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleExit = () => {
    closePanel();
    document.querySelector('canvas')?.focus();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  if (activePanel === null || activePanel === 'settings') {
    return null;
  }

  const currentTab = activePanel as PortfolioTab | 'controls';
  const resumeUrl = `${import.meta.env.BASE_URL}Anisha_Sahu_Resume.pdf`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.contact.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  const navTabs: { id: PortfolioTab | 'controls'; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'projects', label: 'Projects Island', icon: <Briefcase className="w-4 h-4" />, color: '#00F0FF' },
    { id: 'skills', label: 'Skills Runway', icon: <Zap className="w-4 h-4" />, color: '#A855F7' },
    { id: 'about', label: 'About Sanctuary', icon: <User className="w-4 h-4" />, color: '#F59E0B' },
    { id: 'achievements', label: 'Hall of Fame', icon: <Award className="w-4 h-4" />, color: '#EAB308' },
    { id: 'contact', label: 'Contact Garden', icon: <Send className="w-4 h-4" />, color: '#EC4899' },
    { id: 'resume', label: 'Official CV', icon: <FileText className="w-4 h-4" />, color: '#38BDF8' },
    { id: 'ending', label: 'Celestial Ending', icon: <Star className="w-4 h-4" />, color: '#FBBF24' },
    { id: 'controls', label: 'Controls', icon: <Gamepad2 className="w-4 h-4" />, color: '#94A3B8' },
  ];

  const currentDialogue = ABOUT_DIALOGUE_DATA.find((d) => d.id === selectedDialogueId) || ABOUT_DIALOGUE_DATA[0];
  const activeProject = PORTFOLIO_DATA.projects.find((p) => p.id === selectedProjectId) || PORTFOLIO_DATA.projects[0];

  const filteredSkills = skillCategoryFilter === 'all'
    ? SKILLS_DATA
    : SKILLS_DATA.filter((s) => s.category.toLowerCase().includes(skillCategoryFilter.toLowerCase()));

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleExit();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 select-none cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="hud-panel p-4 sm:p-6 max-w-5xl w-full h-[92vh] flex flex-col border-cyan-400/50 relative overflow-hidden cursor-default bg-slate-950/95"
      >
        {/* Top Header */}
        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <h2 className="font-['Orbitron'] font-bold text-base sm:text-lg text-white tracking-wider flex items-center gap-2">
                <span>ANISHA SAHU</span>
                <span className="text-cyan-400 text-xs font-mono font-normal">• ARCHIPELAGO TERMINAL</span>
              </h2>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                Interactive Celestial Codex &bull; Press [Esc] to Return
              </p>
            </div>
          </div>

          <button
            onClick={handleExit}
            className="hud-glow-btn p-2 rounded-lg bg-slate-900 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-500/20 transition-all cursor-pointer"
            title="Close Panel [Esc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 py-3 overflow-x-auto no-scrollbar border-b border-slate-800">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => openPanel(tab.id as PortfolioTab | 'controls')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-white border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900/60 text-gray-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <span style={{ color: tab.color }}>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 text-gray-200">
          {/* ========================================================
              TAB 1: PROJECTS ISLAND (Panels 3 & 4)
          ======================================================== */}
          {currentTab === 'projects' && (
            <div className="space-y-6">
              {/* Projects Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {PORTFOLIO_DATA.projects.map((proj) => {
                  const isSelected = proj.id === selectedProjectId;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-cyan-300 block uppercase tracking-wider">
                        {proj.category.split('&')[0]}
                      </span>
                      <h4 className="font-['Orbitron'] font-bold text-xs text-white mt-1 truncate">
                        {proj.title.split('—')[0]}
                      </h4>
                    </button>
                  );
                })}
              </div>

              {/* Active Project Detail Desk (Panel 4) */}
              <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-cyan-500/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-wider mb-2">
                      {activeProject.category}
                    </span>
                    <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {activeProject.title}
                    </h3>
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-2">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hud-glow-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-gray-200 hover:text-white"
                      >
                        <GithubIcon className="w-4 h-4 text-cyan-400" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {activeProject.demoUrl && activeProject.demoUrl !== '#' && (
                      <a
                        href={activeProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hud-glow-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-mono font-bold hover:brightness-110"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                <p className="font-['Rajdhani'] text-sm sm:text-base text-gray-300 leading-relaxed mb-6 font-medium">
                  {activeProject.description}
                </p>

                {/* Architecture & Tech Stack Specs */}
                <div className="pt-4 border-t border-slate-800">
                  <h5 className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Engineered Technologies & Architecture:</span>
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-md bg-slate-950 text-cyan-200 border border-cyan-500/25 text-xs font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: SKILLS RUNWAY MINI-GAME (Panel 5)
          ======================================================== */}
          {currentTab === 'skills' && (
            <div className="space-y-6">
              {/* Skills Progress Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-purple-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <h3 className="font-['Orbitron'] font-bold text-sm text-white">
                      SKY RUNWAY TECH ORBS INVENTORY
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 font-['Rajdhani'] mt-0.5">
                    15 3D floating skill orbs are situated along the celestial runway. Run through them in-game or inspect below!
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-purple-300 uppercase">Collected</div>
                    <div className="text-base font-mono font-bold text-white">
                      {progression.skillsCollected.length} / 15
                    </div>
                  </div>
                  <div className="w-32 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-purple-500/40">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${(progression.skillsCollected.length / 15) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['all', 'AI', 'Full-Stack', 'Cloud', 'Data'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSkillCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      skillCategoryFilter === cat
                        ? 'bg-purple-500/20 text-purple-200 border border-purple-400'
                        : 'bg-slate-900/60 text-gray-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {filteredSkills.map((skill) => {
                  const isCollected = progression.skillsCollected.includes(skill.id);
                  return (
                    <div
                      key={skill.id}
                      onClick={() => collectSkill(skill.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                        isCollected
                          ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                          : 'bg-slate-900/80 border-slate-800 hover:border-purple-400/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                            style={{ backgroundColor: `${skill.color}25`, color: skill.color }}
                          >
                            {skill.symbol}
                          </div>
                          <div>
                            <h4 className="font-['Orbitron'] font-bold text-xs text-white">
                              {skill.name}
                            </h4>
                            <span className="text-[10px] font-mono text-gray-400">
                              {skill.category}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isCollected
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-gray-400'
                          }`}
                        >
                          {isCollected ? '✓ ACQUIRED' : 'RUN TO GET'}
                        </span>
                      </div>

                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-3">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${skill.proficiency}%`,
                            backgroundColor: skill.color,
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-1">
                        <span>Proficiency</span>
                        <span style={{ color: skill.color }}>{skill.proficiency}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: ABOUT SANCTUARY & INTERACTIVE DIALOGUE (Panel 6)
          ======================================================== */}
          {currentTab === 'about' && (
            <div className="space-y-6">
              {/* Dialogue Tree with Companion Luna & Anisha */}
              <div className="p-5 sm:p-6 rounded-xl bg-slate-900/90 border border-amber-500/40 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-['Orbitron'] font-bold text-sm text-white">
                      SANCTUARY CONVERSATION MATRIX
                    </h3>
                    <p className="text-xs text-gray-400 font-['Rajdhani']">
                      Select an inquiry topic to converse with Anisha and Companion Luna.
                    </p>
                  </div>
                </div>

                {/* Question Prompt Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {ABOUT_DIALOGUE_DATA.map((d) => {
                    const isSelected = d.id === selectedDialogueId;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDialogueId(d.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/25 text-amber-200 border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-slate-950 text-gray-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>{d.question}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Animated Speech Response Display */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block mb-1">
                      Response &bull; Mood: {(currentDialogue.mood || 'happy').toUpperCase()}
                    </span>
                    <p className="font-['Rajdhani'] text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
                      “{currentDialogue.answer}”
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic & University Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-cyan-400 font-['Orbitron'] text-xs font-bold">
                    <GraduationCap className="w-4 h-4" />
                    <span>EDUCATION & ALMA MATER</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-['Rajdhani']">
                    B.Tech in Computer Science & Information Technology
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    C. V. Raman Global University, Bhubaneswar (2024 – Present)
                  </p>
                  <p className="text-xs text-gray-300 font-['Rajdhani'] mt-2">
                    Focus on distributed systems, AI/ML deep learning architectures, cloud computing, and secure APIs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2 text-amber-400 font-['Orbitron'] text-xs font-bold">
                    <Award className="w-4 h-4" />
                    <span>POLYTECHNIC DIPLOMA</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-['Rajdhani']">
                    Diploma in Information Technology
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Jharsuguda Polytechnic College (Nov 2021 – Apr 2024)
                  </p>
                  <p className="text-xs text-gray-300 font-['Rajdhani'] mt-2">
                    Distinction in data structures, algorithms, operating systems, and computer network operations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: ACHIEVEMENTS & HALL OF FAME (Panel 7)
          ======================================================== */}
          {currentTab === 'achievements' && (
            <div className="space-y-6">
              {/* Monumental 3D Trophy Banner */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-slate-900 border border-yellow-500/50 flex flex-col sm:flex-row items-center gap-6 shadow-[0_0_25px_rgba(234,179,8,0.2)]">
                <div className="w-20 h-20 rounded-2xl bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                  <Award className="w-10 h-10 text-yellow-300" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-yellow-300 uppercase tracking-widest font-bold">
                    CELESTIAL HALL OF FAME
                  </span>
                  <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white mt-1">
                    State Honors, Medals & National Competitions
                  </h3>
                  <p className="font-['Rajdhani'] text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                    Recognized at state and international forums for competitive technical skill excellence, AI innovation, and open-source contributions.
                  </p>
                </div>
              </div>

              {/* List of 5 Medals */}
              <div className="space-y-3">
                {ACHIEVEMENTS_DATA.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-yellow-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
                        style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-['Orbitron'] font-bold text-sm text-white group-hover:text-yellow-300 transition-colors">
                            {item.title}
                          </h4>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                            style={{ backgroundColor: `${item.color}25`, color: item.color }}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {item.organization} &bull; {item.year}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 font-['Rajdhani'] mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 5: CONTACT SAKURA GARDEN (Panel 8)
          ======================================================== */}
          {currentTab === 'contact' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-pink-500/40">
                <span className="text-[10px] font-mono text-pink-300 uppercase tracking-widest font-bold">
                  SAKURA BLOSSOM OUTPOST
                </span>
                <h3 className="font-['Orbitron'] text-lg font-bold text-white mt-1">
                  Establish Direct Communication with Anisha Sahu
                </h3>
                <p className="font-['Rajdhani'] text-xs sm:text-sm text-gray-300 mt-1">
                  Available for full-stack software engineering roles, AI/ML research collaborations, and creative technical ventures.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Transmission Form */}
                <form onSubmit={handleSubmitContact} className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Your Name / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova / Google DeepMind"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-pink-400 text-xs font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Your Email Frequency
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@organization.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-pink-400 text-xs font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                      Transmission Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hello Anisha, we would love to connect with you regarding..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-pink-400 text-xs font-mono text-white outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-['Orbitron'] font-bold text-xs uppercase tracking-widest text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{messageSent ? 'TRANSMISSION DISPATCHED ✓' : 'TRANSMIT MESSAGE'}</span>
                  </button>

                  {messageSent && (
                    <p className="text-xs font-mono text-emerald-400 text-center animate-pulse">
                      Thank you! Your transmission has been recorded into Anisha’s inbox.
                    </p>
                  )}
                </form>

                {/* Direct Comms & Verified Links */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase">Direct Email</div>
                        <div className="text-xs font-mono text-white font-bold">{PORTFOLIO_DATA.contact.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase">Phone Telemetry</div>
                        <div className="text-xs font-mono text-white font-bold">{PORTFOLIO_DATA.contact.phone}</div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyPhone}
                      className="p-2 rounded bg-slate-900 border border-slate-700 hover:border-pink-400 text-pink-300 cursor-pointer"
                      title="Copy Phone"
                    >
                      {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase">Coordinates</div>
                      <div className="text-xs font-mono text-white font-bold">{PORTFOLIO_DATA.contact.location}</div>
                    </div>
                  </div>

                  {/* GitHub & LinkedIn Profiles */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={PORTFOLIO_DATA.contact.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 flex items-center gap-2 text-xs font-mono text-white"
                    >
                      <GithubIcon className="w-4 h-4 text-cyan-400" />
                      <span>GitHub Profile</span>
                    </a>
                    <a
                      href={PORTFOLIO_DATA.contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-400 flex items-center gap-2 text-xs font-mono text-white"
                    >
                      <LinkedinIcon className="w-4 h-4 text-blue-400" />
                      <span>LinkedIn Profile</span>
                    </a>
                  </div>

                  {/* Resume Download CTA */}
                  <a
                    href={resumeUrl}
                    download="Anisha_Sahu_Resume.pdf"
                    className="w-full py-3 rounded-xl bg-slate-900 border border-cyan-400/50 hover:border-cyan-400 flex items-center justify-center gap-2 text-xs font-mono text-cyan-300 hover:text-white transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] mt-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Anisha_Sahu_Resume.pdf</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 6: STARLIT CLIFF ENDING SCENE (Panel 9)
          ======================================================== */}
          {currentTab === 'ending' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-indigo-950/60 via-purple-950/40 to-slate-950 border border-cyan-400/60 text-center relative overflow-hidden">
              <div className="w-20 h-20 mx-auto rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,240,255,0.5)]">
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 animate-pulse" />
              </div>

              <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">
                CELESTIAL CLIFF OVERLOOK &bull; EXPEDITION COMPLETE
              </span>

              <h3 className="font-['Orbitron'] text-2xl sm:text-3xl font-black text-white mt-2 mb-3">
                CONGRATULATIONS, TRAVELER!
              </h3>

              <p className="font-['Rajdhani'] text-sm sm:text-base text-gray-200 max-w-xl mx-auto leading-relaxed mb-6">
                “You have traversed the entire celestial archipelago of Anisha Sahu! You’ve witnessed cutting-edge AI security systems, gathered technical proficiencies along the sky runway, and explored her achievements.”
              </p>

              {/* Explorer Summary Stats */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                  <div className="text-[10px] font-mono text-gray-400">Islands Discovered</div>
                  <div className="text-lg font-mono font-bold text-cyan-300">
                    {progression.discoveredIds.length} / {progression.totalWaypoints}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/30">
                  <div className="text-[10px] font-mono text-gray-400">Skills Collected</div>
                  <div className="text-lg font-mono font-bold text-purple-300">
                    {progression.skillsCollected.length} / 15
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30">
                  <div className="text-[10px] font-mono text-gray-400">Honors Unlocked</div>
                  <div className="text-lg font-mono font-bold text-amber-300">
                    {progression.achievementsUnlocked.length} / 5
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={resumeUrl}
                  download="Anisha_Sahu_Resume.pdf"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-['Orbitron'] font-bold text-xs uppercase tracking-widest text-slate-950 flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD OFFICIAL RESUME</span>
                </a>
                <button
                  onClick={() => openPanel('contact')}
                  className="px-6 py-3 rounded-lg bg-slate-900 border border-pink-400/60 font-['Orbitron'] font-bold text-xs uppercase tracking-widest text-pink-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>CONNECT WITH ANISHA</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 7: RESUME VIEWER
          ======================================================== */}
          {currentTab === 'resume' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-['Orbitron'] font-bold text-sm text-white">
                    VERIFIED CURRICULUM VITAE & TELEMETRY
                  </h3>
                  <p className="text-xs text-gray-400 font-['Rajdhani'] mt-0.5">
                    Official resume of Anisha Sahu (Computer Science Engineer & AI Builder).
                  </p>
                </div>
                <a
                  href={resumeUrl}
                  download="Anisha_Sahu_Resume.pdf"
                  className="hud-glow-btn flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-mono font-bold hover:brightness-110"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </div>

              <div className="h-[60vh] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <iframe
                  src={resumeUrl}
                  title="Anisha Sahu Resume"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 8: FLIGHT CONTROLS
          ======================================================== */}
          {currentTab === 'controls' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700">
                <h3 className="font-['Orbitron'] font-bold text-sm text-white mb-4">
                  AVATAR & JETPACK NAVIGATION DIRECTIVE
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300 font-bold">[W, A, S, D]</span>
                    <span className="text-gray-300">Move Adventurer</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300 font-bold">[Space]</span>
                    <span className="text-gray-300">Jump / Jetpack Flight</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300 font-bold">[Shift]</span>
                    <span className="text-gray-300">Turbo Sprint</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300 font-bold">[Click Canvas]</span>
                    <span className="text-gray-300">360° Mouse-Look</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300 font-bold">[Scroll Wheel]</span>
                    <span className="text-gray-300">Camera Zoom In / Out</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300 font-bold">[E] or Click</span>
                    <span className="text-gray-300">Interact with Waypoints & Portals</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-cyan-300 font-bold">[Esc]</span>
                    <span className="text-gray-300">Close Panel / Pause Game</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
