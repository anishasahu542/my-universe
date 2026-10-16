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

  // Keyboard shortcut listener for global ESC key
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const store = useGameStore.getState();
        if (store.activePanel !== null) {
          store.closePanel();
        } else if (store.gameStatus === 'playing') {
          store.pauseGame();
        } else if (store.gameStatus === 'paused') {
          store.resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
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
