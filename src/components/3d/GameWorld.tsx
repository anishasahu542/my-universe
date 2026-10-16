import React from 'react';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Environment } from './Environment';
import { SpaceStationModel } from './SpaceStationModel';
import { InteractionSystem } from './InteractionSystem';
import { PlayerController } from './PlayerController';
import { CameraController } from './CameraController';

export const GameWorld: React.FC = () => {
  return (
    <Physics gravity={[0, -12, 0]}>
      {/* Anime Sci-fi Space Environment */}
      <Environment />

      {/* The 3D Space Kit Asset — Full interactive world geometry with trimesh physics */}
      <SpaceStationModel />

      {/* Interactive Waypoints anchored directly to the model's assets */}
      <InteractionSystem />

      {/* Player Controller & Camera Follow — spawns on the Central Command Deck */}
      <PlayerController initialPosition={[-11.9, 16.5, -12.2]} />
      <CameraController targetDistance={8.0} />

      {/* Safety void catchment collider far below the planet structures */}
      <RigidBody type="fixed" colliders={false} position={[0, -75, 0]}>
        <CuboidCollider args={[200, 2, 350]} />
      </RigidBody>
    </Physics>
  );
};
