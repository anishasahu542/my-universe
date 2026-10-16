import React from 'react';
import { Physics, RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import { Environment } from './Environment';
import { SpaceStationModel } from './SpaceStationModel';
import { InteractionSystem } from './InteractionSystem';
import { PlayerController } from './PlayerController';
import { CameraController } from './CameraController';

export const GameWorld: React.FC = () => {
  return (
    <Physics gravity={[0, -16, 0]}>
      {/* Anime Sci-fi Space Environment */}
      <Environment />

      {/* Loaded GLB Asset from Quaternius Ultimate Space Kit */}
      <SpaceStationModel />

      {/* Orbital Station Deck & Plaza */}
      <group position={[0, 0, 0]}>
        {/* Main Central Circular Deck (Visual) */}
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <cylinderGeometry args={[14, 15, 0.4, 48]} />
          <meshStandardMaterial
            color="#0B132B"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* Inner Glowing Hexagonal / Ring Deck Trim */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[13.2, 13.6, 48]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>

        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5.0, 32]} />
          <meshBasicMaterial color="#A855F7" />
        </mesh>

        {/* Walkway Guides to 4 Waypoints */}
        {/* North Walkway */}
        <mesh position={[0, 0.105, -4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 8]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.15} />
        </mesh>
        {/* South Walkway */}
        <mesh position={[0, 0.105, 4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 8]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.15} />
        </mesh>
        {/* East Walkway */}
        <mesh position={[4.5, 0.105, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[1.6, 9]} />
          <meshBasicMaterial color="#A855F7" transparent opacity={0.15} />
        </mesh>
        {/* West Walkway */}
        <mesh position={[-4.5, 0.105, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[1.6, 9]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.15} />
        </mesh>

        {/* Physical Ground Collider for Station Deck */}
        <RigidBody type="fixed" colliders={false} name="station-deck-collider">
          <CylinderCollider args={[0.2, 14.5]} position={[0, -0.1, 0]} />

          {/* Safety perimeter boundary walls to prevent void drop */}
          <CuboidCollider args={[15, 3, 0.5]} position={[0, 2, 14.5]} />
          <CuboidCollider args={[15, 3, 0.5]} position={[0, 2, -14.5]} />
          <CuboidCollider args={[0.5, 3, 15]} position={[14.5, 2, 0]} />
          <CuboidCollider args={[0.5, 3, 15]} position={[-14.5, 2, 0]} />
        </RigidBody>
      </group>

      {/* Interactive Waypoints */}
      <InteractionSystem />

      {/* Player Controller & Camera Follow */}
      <PlayerController initialPosition={[0, 1.5, 0]} />
      <CameraController targetDistance={7.0} />
    </Physics>
  );
};
