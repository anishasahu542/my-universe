import React from 'react';
import { X, Volume2, MousePointer, Cpu, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { GraphicsQuality } from '../../types/game';

export const SettingsPanel: React.FC = () => {
  const activePanel = useGameStore((s) => s.activePanel);
  const closePanel = useGameStore((s) => s.closePanel);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  if (activePanel !== 'settings') {
    return null;
  }

  const qualities: GraphicsQuality[] = ['high', 'medium', 'low'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="hud-panel p-6 sm:p-8 max-w-lg w-full border-cyan-400/50 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-cyan-500/20">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white font-['Orbitron']">
              SYSTEM CALIBRATION
            </h2>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">
              Vessel Telemetry & Audio Settings
            </p>
          </div>
          <button
            onClick={closePanel}
            className="p-1.5 rounded-sm bg-slate-900 border border-slate-700 hover:border-cyan-400 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Audio Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider">
              <Volume2 className="w-4 h-4" />
              <span>Audio System</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-sm bg-slate-900/80 border border-slate-800">
              <span className="text-sm font-medium text-gray-200">Sound Effects & Ambience</span>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-colors ${
                  settings.soundEnabled
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                    : 'bg-red-500/20 border border-red-500 text-red-400'
                }`}
              >
                {settings.soundEnabled ? 'Enabled' : 'Muted'}
              </button>
            </div>

            <div className="p-3 rounded-sm bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between text-xs font-mono text-gray-300 mb-2">
                <span>Master Volume</span>
                <span className="text-cyan-300 font-bold">{settings.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls & Sensitivity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider">
              <MousePointer className="w-4 h-4" />
              <span>Camera & Input</span>
            </div>

            <div className="p-3 rounded-sm bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between text-xs font-mono text-gray-300 mb-2">
                <span>Camera Orbit Sensitivity</span>
                <span className="text-cyan-300 font-bold">{settings.mouseSensitivity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={settings.mouseSensitivity}
                onChange={(e) => updateSettings({ mouseSensitivity: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-sm bg-slate-900/80 border border-slate-800">
              <span className="text-sm font-medium text-gray-200">Invert Pitch (Y-Axis)</span>
              <button
                onClick={() => updateSettings({ invertY: !settings.invertY })}
                className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-colors ${
                  settings.invertY
                    ? 'bg-purple-500/20 border border-purple-400 text-purple-300'
                    : 'bg-slate-800 border border-slate-700 text-gray-400'
                }`}
              >
                {settings.invertY ? 'Inverted' : 'Standard'}
              </button>
            </div>
          </div>

          {/* Graphics Fidelity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Graphics Fidelity</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => updateSettings({ graphicsQuality: q })}
                  className={`py-2 px-3 rounded-sm border text-xs font-mono font-bold uppercase transition-all ${
                    settings.graphicsQuality === q
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'bg-slate-900/80 border-slate-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-gray-500">
              High: Antialiasing, 3000 stars, shadows. Low: Best performance on mobile devices.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-cyan-500/20 flex justify-between items-center">
          <button
            onClick={() =>
              updateSettings({
                soundEnabled: true,
                volume: 75,
                mouseSensitivity: 1.0,
                graphicsQuality: 'high',
                invertY: false,
              })
            }
            className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={closePanel}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-['Orbitron'] text-xs tracking-wider uppercase rounded-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
