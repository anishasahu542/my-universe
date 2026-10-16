import React from 'react';
import { GameCanvas } from '../components/3d/GameCanvas';
import { SceneManager } from '../components/ui/SceneManager';

export const App: React.FC = () => {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#050711]">
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas />

      {/* 2D UI & State Management Layer */}
      <SceneManager />

      {/* Subtle Anime Cyberpunk CRT Scanline Effect (non-blocking) */}
      <div className="fixed inset-0 pointer-events-none scanlines-overlay opacity-20 z-10" />
    </main>
  );
};

export default App;
