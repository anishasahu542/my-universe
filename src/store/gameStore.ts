import { create } from 'zustand';
import {
  GameStatus,
  ActivePanel,
  GameSettings,
  InteractionState,
  ProgressionState,
  PlayerControlsState,
  InteractiveWaypoint,
} from '../types/game';
import { WAYPOINTS } from '../data/waypointsData';

export interface GameStoreState {
  // Lifecycle
  gameStatus: GameStatus;
  errorMessage: string | null;
  activePanel: ActivePanel;

  // Settings
  settings: GameSettings;

  // Interaction
  interaction: InteractionState;

  // Progression
  progression: ProgressionState;

  // Input states (accessible to virtual touch / keyboard controllers)
  controls: PlayerControlsState;

  // Player telemetry
  playerCoords: [number, number, number];
  playerSpeed: number;

  // Actions
  setGameStatus: (status: GameStatus) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  returnToLanding: () => void;
  openPanel: (panel: ActivePanel) => void;
  closePanel: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  setInteractionTarget: (target: InteractiveWaypoint | null, distance?: number) => void;
  triggerCurrentInteraction: () => void;
  discoverWaypoint: (id: string) => void;
  collectSkill: (id: string) => void;
  unlockAchievement: (id: string) => void;
  setQuest: (quest: string) => void;
  unlockEnding: () => void;
  setError: (message: string | null) => void;
  setControlKey: (key: keyof PlayerControlsState, pressed: boolean) => void;
  updateTelemetry: (coords: [number, number, number], speed: number) => void;
  resetProgress: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  volume: 75,
  mouseSensitivity: 1.0,
  graphicsQuality: 'high',
  invertY: false,
  showFps: true,
  cameraFov: 50,
};

const INITIAL_CONTROLS: PlayerControlsState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  interact: false,
  sprint: false,
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameStatus: 'landing',
  errorMessage: null,
  activePanel: null,

  settings: DEFAULT_SETTINGS,

  interaction: {
    activeTarget: null,
    distance: 0,
    promptText: null,
  },

  progression: {
    discoveredIds: [],
    currentMission: 'Explore Sector 01: Discover all 5 Celestial Islands',
    totalWaypoints: WAYPOINTS.length,
    skillsCollected: [],
    achievementsUnlocked: [],
    currentQuest: 'Talk to Luna and explore the Projects Island',
    isEndingUnlocked: false,
  },

  controls: INITIAL_CONTROLS,

  playerCoords: [0, 3.6, 2.0],
  playerSpeed: 0,

  setGameStatus: (status) => set({ gameStatus: status }),

  startGame: () => {
    set({
      gameStatus: 'playing',
      activePanel: null,
      errorMessage: null,
    });
  },

  pauseGame: () => {
    const { gameStatus } = get();
    if (gameStatus === 'playing') {
      set({ gameStatus: 'paused' });
    }
  },

  resumeGame: () => {
    const { gameStatus } = get();
    if (gameStatus === 'paused') {
      set({ gameStatus: 'playing' });
    }
  },

  returnToLanding: () => {
    set({
      gameStatus: 'landing',
      activePanel: null,
      interaction: { activeTarget: null, distance: 0, promptText: null },
    });
  },

  openPanel: (panel) => {
    const wasPlaying = get().gameStatus === 'playing';
    set({
      activePanel: panel,
      gameStatus: wasPlaying ? 'paused' : get().gameStatus,
    });
  },

  closePanel: () => {
    const currentStatus = get().gameStatus;
    set({
      activePanel: null,
      gameStatus: currentStatus === 'paused' ? 'playing' : currentStatus,
    });
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  setInteractionTarget: (target, distance = 0) => {
    const currentTarget = get().interaction.activeTarget;
    if (currentTarget?.id === target?.id && (!target || Math.abs(get().interaction.distance - distance) < 0.5)) {
      return;
    }
    set({
      interaction: {
        activeTarget: target,
        distance,
        promptText: target ? `Press [E] to Inspect: ${target.title}` : null,
      },
    });
  },

  triggerCurrentInteraction: () => {
    const { interaction } = get();
    if (interaction.activeTarget) {
      const target = interaction.activeTarget;
      get().discoverWaypoint(target.id);
      get().openPanel(target.tab);
    }
  },

  discoverWaypoint: (id: string) => {
    const { progression } = get();
    if (!progression.discoveredIds.includes(id)) {
      const newDiscovered = [...progression.discoveredIds, id];
      const count = newDiscovered.length;
      const total = progression.totalWaypoints;

      let mission = `Explore Archipelago: Discovered ${count}/${total} Celestial Islands`;
      if (count === total) {
        mission = 'All 5 Islands Explored! Starlit Vista Unlocked. Sector Fully Mapped.';
      }

      // Dynamic quest update based on discovered islands
      let nextQuest = progression.currentQuest;
      if (id === 'projects-island') {
        nextQuest = 'Travel to Skills Island and collect tech stack orbs!';
      } else if (id === 'skills-island') {
        nextQuest = 'Visit the About Sanctuary and converse with Luna.';
      } else if (id === 'about-island') {
        nextQuest = 'Collect the medals on Achievements Island!';
      } else if (id === 'achievements-island') {
        nextQuest = 'Head to Contact Blossom Island to complete your journey.';
      } else if (id === 'contact-island') {
        nextQuest = 'Journey Complete! Enjoy the celestial ending.';
      }

      set({
        progression: {
          ...progression,
          discoveredIds: newDiscovered,
          currentMission: mission,
          currentQuest: nextQuest,
        },
      });
    }
  },

  collectSkill: (id: string) => {
    const { progression } = get();
    if (!progression.skillsCollected.includes(id)) {
      const updated = [...progression.skillsCollected, id];
      const count = updated.length;
      let mission = progression.currentMission;
      if (count === 15) {
        mission = 'Arsenal Complete: All 15 Tech Stack Orbs Collected! ⚡';
      }
      set({
        progression: {
          ...progression,
          skillsCollected: updated,
          currentMission: mission,
        },
      });
    }
  },

  unlockAchievement: (id: string) => {
    const { progression } = get();
    if (!progression.achievementsUnlocked.includes(id)) {
      const updated = [...progression.achievementsUnlocked, id];
      set({
        progression: {
          ...progression,
          achievementsUnlocked: updated,
        },
      });
    }
  },

  setQuest: (quest: string) => {
    set((state) => ({
      progression: {
        ...state.progression,
        currentQuest: quest,
      },
    }));
  },

  unlockEnding: () => {
    set((state) => ({
      progression: {
        ...state.progression,
        isEndingUnlocked: true,
      },
    }));
  },

  setError: (message) => {
    set({
      gameStatus: message ? 'error' : 'landing',
      errorMessage: message,
    });
  },

  setControlKey: (key, pressed) => {
    set((state) => {
      if (state.controls[key] === pressed) return state;
      return {
        controls: {
          ...state.controls,
          [key]: pressed,
        },
      };
    });
  },

  updateTelemetry: (coords, speed) => {
    set({ playerCoords: coords, playerSpeed: speed });
  },

  resetProgress: () => {
    set({
      progression: {
        discoveredIds: [],
        currentMission: 'Explore Sector 01: Discover all 5 Celestial Islands',
        totalWaypoints: WAYPOINTS.length,
        skillsCollected: [],
        achievementsUnlocked: [],
        currentQuest: 'Talk to Luna and explore the Projects Island',
        isEndingUnlocked: false,
      },
      activePanel: null,
      gameStatus: 'landing',
      playerCoords: [0, 3.6, 2.0],
    });
  },
}));
