import React from 'react';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { CelestialEnvironment } from './CelestialEnvironment';
import { FloatingArchipelago } from './FloatingArchipelago';
import { SkillsMiniGame } from './SkillsMiniGame';
import { AchievementsScene } from './AchievementsScene';
import { InteractionSystem } from './InteractionSystem';
import { PlayerController } from './PlayerController';
import { CompanionLuna } from './CompanionLuna';
import { CameraController } from './CameraController';

export const GameWorld: React.FC = () => {
  return (
    <Physics gravity={[0, -14, 0]}>
      {/* Anime Celestial Sky, Drifting Clouds & Falling Sakura Petals */}
      <CelestialEnvironment />

      {/* Floating Islands Archipelago with Walkable Stepping Stone Bridges & Portals */}
      <FloatingArchipelago />

      {/* Skills Island Runway Mini-Game with 15 Collectible 3D Tech Orbs */}
      <SkillsMiniGame />

      {/* Achievements Island with 3D Golden Trophy Cup & Interactive Medals */}
      <AchievementsScene />

      {/* Interactive In-World Holographic Waypoints */}
      <InteractionSystem />

      {/* Third-Person Anime Adventurer Avatar */}
      <PlayerController initialPosition={[0, 3.6, 2.0]} />

      {/* Floating Anime Companion Luna (Real-time Guide) */}
      <CompanionLuna />

      {/* Third-Person Camera with Smooth Damping & Obstacle Avoidance */}
      <CameraController targetDistance={6.8} />

      {/* Safety Void Catchment Plane */}
      <RigidBody type="fixed" colliders={false} position={[0, -60, 0]}>
        <CuboidCollider args={[250, 2, 250]} />
      </RigidBody>
    </Physics>
  );
};
