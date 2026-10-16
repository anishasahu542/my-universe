export type GameStatus = 'landing' | 'loading' | 'playing' | 'paused' | 'error';

export type PortfolioTab = 'about' | 'projects' | 'resume' | 'contact';

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
