import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { GameWorld } from './GameWorld';
import { useGameStore } from '../../store/gameStore';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';


const CanvasLoading: React.FC = () => {
  return null; // The DOM LoadingOverlay handles the visual progress
};

export class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (err: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onError?: (err: Error) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050711] text-white p-6 z-50">
          <div className="hud-panel p-8 max-w-md w-full border-red-500/50 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-3 tracking-wider font-['Orbitron']">
              WebGL Subsystem Alert
            </h2>
            <p className="text-sm text-gray-300 mb-6">
              {this.state.error?.message || 'Graphics context failed to initialize.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-500 rounded text-red-200 font-semibold uppercase tracking-wider transition-colors"
            >
              Reinitialize Engine
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const GameCanvas: React.FC = () => {
  const settings = useGameStore((s) => s.settings);
  const setError = useGameStore((s) => s.setError);
  const { isMobile } = useWindowDimensions();

  // Dynamic pixel ratio based on quality
  const dpr: [number, number] =
    settings.graphicsQuality === 'high'
      ? [1, 2]
      : settings.graphicsQuality === 'medium'
      ? [1, 1.5]
      : [1, 1];

  const shadows = settings.graphicsQuality !== 'low';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050711]">
      <CanvasErrorBoundary onError={(err) => setError(err.message)}>
        <Canvas
          shadows={shadows}
          dpr={dpr}
          camera={{
            position: [0, 5, 8],
            fov: isMobile ? 65 : 50,
            near: 0.1,
            far: 600,
          }}
          gl={{
            antialias: settings.graphicsQuality !== 'low',
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          <Suspense fallback={<CanvasLoading />}>
            <GameWorld />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};
