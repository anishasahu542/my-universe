export type GameStatus = 'landing' | 'loading' | 'playing' | 'paused' | 'error';

export type PortfolioTab =
  | 'about'
  | 'projects'
  | 'skills'
  | 'achievements'
  | 'resume'
  | 'contact'
  | 'ending';

export type ActivePanel = PortfolioTab | 'settings' | 'controls' | null;

export type GraphicsQuality = 'high' | 'medium' | 'low';

export interface GameSettings {
  soundEnabled: boolean;
  volume: number; // 0 - 100
  mouseSensitivity: number; // 0.1 - 2.0
  graphicsQuality: GraphicsQuality;
  invertY: boolean;
  showFps: boolean;
  cameraFov: number;
}

export interface InteractiveWaypoint {
  id: string;
  title: string;
  subtitle: string;
  tab: PortfolioTab;
  position: [number, number, number];
  radius: number;
  color: string;
  icon: string;
  description: string;
}

export interface InteractionState {
  activeTarget: InteractiveWaypoint | null;
  distance: number;
  promptText: string | null;
}

export interface ProgressionState {
  discoveredIds: string[];
  currentMission: string;
  totalWaypoints: number;
  skillsCollected: string[];
  achievementsUnlocked: string[];
  currentQuest: string;
  isEndingUnlocked: boolean;
}

export interface PlayerControlsState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  interact: boolean;
  sprint: boolean;
}

export interface SkillOrbItem {
  id: string;
  name: string;
  symbol: string;
  category: 'Language' | 'Framework' | 'Cloud & Tool' | 'AI / Data';
  color: string;
  position: [number, number, number];
  description: string;
  proficiency: number; // 0 - 100
  years: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  badge: string;
  description: string;
  position: [number, number, number];
  color: string;
}

export interface DialogueOption {
  id: string;
  question: string;
  answer: string;
  mood?: 'happy' | 'thinking' | 'excited' | 'proud';
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string;
  architecture?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
  skills: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location?: string;
  details?: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  skills: string;
}
