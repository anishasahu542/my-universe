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

  // Player telemetry (updated transients)
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
    currentMission: 'Explore Sector 01: Discover all 4 Orbital Outposts',
    totalWaypoints: WAYPOINTS.length,
  },

  controls: INITIAL_CONTROLS,

  playerCoords: [-11.9, 16.5, -12.2],
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
      // If we open a panel while playing, keep game in playing or pause background physics
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
    // Prevent unneeded React re-renders if target hasn't changed
    if (currentTarget?.id === target?.id && (!target || Math.abs(get().interaction.distance - distance) < 0.5)) {
      return;
    }
    set({
      interaction: {
        activeTarget: target,
        distance,
        promptText: target ? `Press [E] or Tap to Inspect: ${target.title}` : null,
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

      let mission = `Explore Sector 01: Discovered ${count}/${total} Waypoints`;
      if (count === total) {
        mission = 'Sector Fully Mapped! Odyssey Archive Unlocked.';
      }

      set({
        progression: {
          ...progression,
          discoveredIds: newDiscovered,
          currentMission: mission,
        },
      });
    }
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
    // Only update if difference is noticeable to avoid React cascade
    set({ playerCoords: coords, playerSpeed: speed });
  },

  resetProgress: () => {
    set({
      progression: {
        discoveredIds: [],
        currentMission: 'Explore Sector 01: Discover all 4 Orbital Outposts',
        totalWaypoints: WAYPOINTS.length,
      },
      activePanel: null,
      gameStatus: 'landing',
      playerCoords: [-11.9, 16.5, -12.2],
    });
  },
}));
