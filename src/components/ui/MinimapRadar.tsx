import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { WAYPOINTS } from '../../data/waypointsData';
import { Compass } from 'lucide-react';

export const MinimapRadar: React.FC = () => {
  const playerCoords = useGameStore((s) => s.playerCoords);
  const openPanel = useGameStore((s) => s.openPanel);
  const [px, , pz] = playerCoords;

  // Radar scale: world coordinates to radar pixels
  // Center is (60, 60), radius is 50. Max range ~65m
  const radarRadius = 52;
  const radarCenter = 60;
  const radarScale = 0.75; // 1 meter = 0.75 pixels

  return (
    <div className="hud-panel p-2.5 rounded-sm border-cyan-500/40 bg-slate-950/85 pointer-events-auto flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
            RADAR COMPASS
          </span>
        </div>
        <span className="text-[9px] font-mono text-gray-400">R:65m</span>
      </div>

      <div className="relative w-[120px] h-[120px] rounded-full border border-cyan-500/40 bg-slate-900/90 overflow-hidden shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]">
        {/* Radar concentric rings */}
        <div className="absolute inset-[15px] rounded-full border border-cyan-500/20 pointer-events-none" />
        <div className="absolute inset-[32px] rounded-full border border-cyan-500/25 pointer-events-none" />

        {/* Crosshairs */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-500/20 -translate-x-1/2 pointer-events-none" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-cyan-500/20 -translate-y-1/2 pointer-events-none" />

        {/* Radar sweep beam */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent animate-spin pointer-events-none" style={{ animationDuration: '4s' }} />

        {/* Planetary Sector Blips */}
        {WAYPOINTS.map((wp) => {
          const dx = wp.position[0] - px;
          const dz = wp.position[2] - pz;
          const dist = Math.hypot(dx, dz);

          // Position clamped to radar edge
          const angle = Math.atan2(dz, dx);
          const clampedDist = Math.min(dist * radarScale, radarRadius - 4);
          const bx = radarCenter + Math.cos(angle) * clampedDist;
          const by = radarCenter + Math.sin(angle) * clampedDist;

          return (
            <button
              key={wp.id}
              onClick={() => openPanel(wp.tab)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${bx}px`, top: `${by}px` }}
              title={`${wp.title} (${dist.toFixed(0)}m)`}
            >
              <span
                className="block w-2.5 h-2.5 rounded-full shadow-[0_0_8px] transition-transform group-hover:scale-150 animate-pulse"
                style={{
                  backgroundColor: wp.color,
                  boxShadow: `0 0 8px ${wp.color}`,
                }}
              />
              <span
                className="hidden group-hover:block absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-mono px-1 py-0.5 rounded bg-black/90 text-white z-10 border border-cyan-400"
              >
                {wp.title}
              </span>
            </button>
          );
        })}

        {/* Central Hub Blip */}
        {(() => {
          const dx = 0 - px;
          const dz = 0 - pz;
          const dist = Math.hypot(dx, dz);
          const angle = Math.atan2(dz, dx);
          const clampedDist = Math.min(dist * radarScale, radarRadius - 4);
          const hx = radarCenter + Math.cos(angle) * clampedDist;
          const hy = radarCenter + Math.sin(angle) * clampedDist;
          return (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${hx}px`, top: `${hy}px` }}
              title="Central Spaceport"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_4px_#ffffff]" />
            </div>
          );
        })()}

        {/* Player Position (Center of radar) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-cyan-400 border border-white shadow-[0_0_8px_#00f0ff] animate-ping opacity-75" />
          <div className="absolute inset-0 w-2 h-2 m-auto rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
};
