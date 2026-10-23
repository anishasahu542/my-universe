import React from 'react';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { CelestialEnvironment } from './CelestialEnvironment';
import { PlanetWorld } from './PlanetWorld';
import { SkillsMiniGame } from './SkillsMiniGame';
import { AchievementsScene } from './AchievementsScene';
import { InteractionSystem } from './InteractionSystem';
import { PlayerController } from './PlayerController';
import { CompanionLuna } from './CompanionLuna';
import { CameraController } from './CameraController';

export const GameWorld: React.FC = () => {
  return (
    <Physics gravity={[0, -14, 0]}>
      {/* Anime Celestial Sky, Planetary Rings, Gas Giant & Falling Sakura Petals */}
      <CelestialEnvironment />

      {/* Futuristic Continuous Planetary World Surface & Sectors */}
      <PlanetWorld />

      {/* Skills Sector Runway Mini-Game with 15 Collectible 3D Tech Orbs */}
      <SkillsMiniGame />

      {/* Achievements Sector with 3D Golden Trophy Cup & Interactive Medals */}
      <AchievementsScene />

      {/* Interactive In-World Holographic Waypoints */}
      <InteractionSystem />

      {/* Third-Person Anime Adventurer Avatar on Planet Surface */}
      <PlayerController initialPosition={[0, 3.6, 2.0]} />

      {/* Floating Anime Companion Luna (Real-time Planetary Guide) */}
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
