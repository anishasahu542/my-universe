import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { LandingScreen } from './LandingScreen';
import { HUD } from './HUD';
import { PauseMenu } from './PauseMenu';
import { SettingsPanel } from './SettingsPanel';
import { PortfolioPanel } from './PortfolioPanel';
import { ErrorFallback } from './ErrorFallback';
import { LoadingOverlay } from './LoadingOverlay';
import { MobileControls } from './MobileControls';

export const SceneManager: React.FC = () => {
  const gameStatus = useGameStore((s) => s.gameStatus);

  // Dedicated authoritative Escape key listener with debounce to prevent double-firing
  useEffect(() => {
    let lastEscTime = 0;

    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      const now = performance.now();
      if (now - lastEscTime < 250) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      lastEscTime = now;

      const store = useGameStore.getState();

      // 1. If viewing any modal (Portfolio, Settings), close it cleanly and return directly to game
      if (store.activePanel !== null) {
        e.preventDefault();
        e.stopPropagation();
        store.closePanel();
        document.querySelector('canvas')?.focus();
        return;
      }

      // 2. If playing, pause game and show pause menu
      if (store.gameStatus === 'playing') {
        e.preventDefault();
        e.stopPropagation();
        store.pauseGame();
        return;
      }

      // 3. If paused, resume gameplay
      if (store.gameStatus === 'paused') {
        e.preventDefault();
        e.stopPropagation();
        store.resumeGame();
        document.querySelector('canvas')?.focus();
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKey, { capture: true });
    return () => window.removeEventListener('keydown', handleGlobalKey, { capture: true });
  }, []);

  return (
    <div id="scene-manager" className="relative w-full h-full pointer-events-none">
      {/* 1. Landing Screen Layer */}
      {gameStatus === 'landing' && <LandingScreen />}

      {/* 2. Gameplay HUD Layer */}
      {gameStatus === 'playing' && (
        <>
          <HUD />
          <MobileControls />
        </>
      )}

      {/* 3. Pause Menu Layer */}
      {gameStatus === 'paused' && <PauseMenu />}

      {/* 4. Subsystem Error Layer */}
      {gameStatus === 'error' && <ErrorFallback />}

      {/* 5. Persistent Overlays */}
      <PortfolioPanel />
      <SettingsPanel />
      <LoadingOverlay />
    </div>
  );
};
