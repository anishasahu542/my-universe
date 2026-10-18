import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';
import { WAYPOINTS } from '../data/waypointsData';

describe('GameStore State Transitions and Progression Logic', () => {
  beforeEach(() => {
    useGameStore.getState().resetProgress();
  });

  it('initializes with default landing state', () => {
    const state = useGameStore.getState();
    expect(state.gameStatus).toBe('landing');
    expect(state.activePanel).toBeNull();
    expect(state.progression.discoveredIds).toEqual([]);
    expect(state.progression.totalWaypoints).toBe(WAYPOINTS.length);
  });

  it('transitions from landing to playing on startGame()', () => {
    const { startGame } = useGameStore.getState();
    startGame();

    const state = useGameStore.getState();
    expect(state.gameStatus).toBe('playing');
    expect(state.activePanel).toBeNull();
  });

  it('toggles pause and resume states', () => {
    const { startGame, pauseGame, resumeGame } = useGameStore.getState();
    startGame();
    expect(useGameStore.getState().gameStatus).toBe('playing');

    pauseGame();
    expect(useGameStore.getState().gameStatus).toBe('paused');

    resumeGame();
    expect(useGameStore.getState().gameStatus).toBe('playing');
  });

  it('opens and closes portfolio panels correctly', () => {
    const { startGame, openPanel, closePanel } = useGameStore.getState();
    startGame();

    openPanel('about');
    expect(useGameStore.getState().activePanel).toBe('about');
    expect(useGameStore.getState().gameStatus).toBe('paused');

    closePanel();
    expect(useGameStore.getState().activePanel).toBeNull();
    expect(useGameStore.getState().gameStatus).toBe('playing');
  });

  it('updates progression when discovering waypoints and tracks completion', () => {
    const { discoverWaypoint } = useGameStore.getState();

    // Discover first waypoint
    discoverWaypoint(WAYPOINTS[0].id);
    let state = useGameStore.getState();
    expect(state.progression.discoveredIds).toContain(WAYPOINTS[0].id);
    expect(state.progression.discoveredIds.length).toBe(1);
    expect(state.progression.currentMission).toContain('1/');

    // Discover same waypoint again should not duplicate
    discoverWaypoint(WAYPOINTS[0].id);
    state = useGameStore.getState();
    expect(state.progression.discoveredIds.length).toBe(1);

    // Discover all waypoints
    WAYPOINTS.forEach((wp) => discoverWaypoint(wp.id));
    state = useGameStore.getState();
    expect(state.progression.discoveredIds.length).toBe(WAYPOINTS.length);
    expect(state.progression.currentMission).toContain('Sector Fully Mapped');
  });

  it('triggers active interaction to open corresponding panel and register discovery', () => {
    const { startGame, setInteractionTarget, triggerCurrentInteraction } = useGameStore.getState();
    startGame();

    const target = WAYPOINTS.find((w) => w.tab === 'projects') || WAYPOINTS[0];
    setInteractionTarget(target, 2.5);

    expect(useGameStore.getState().interaction.activeTarget?.id).toBe(target.id);
    expect(useGameStore.getState().interaction.promptText).toContain(target.title);

    triggerCurrentInteraction();

    const state = useGameStore.getState();
    expect(state.activePanel).toBe('projects');
    expect(state.progression.discoveredIds).toContain(target.id);
  });

  it('updates game settings properly', () => {
    const { updateSettings } = useGameStore.getState();

    updateSettings({ volume: 50, graphicsQuality: 'low', invertY: true });
    const settings = useGameStore.getState().settings;

    expect(settings.volume).toBe(50);
    expect(settings.graphicsQuality).toBe('low');
    expect(settings.invertY).toBe(true);
  });

  it('handles error states and recovery', () => {
    const { setError, returnToLanding } = useGameStore.getState();

    setError('WebGL context lost');
    expect(useGameStore.getState().gameStatus).toBe('error');
    expect(useGameStore.getState().errorMessage).toBe('WebGL context lost');

    returnToLanding();
    expect(useGameStore.getState().gameStatus).toBe('landing');
  });
});
