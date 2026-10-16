import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { WAYPOINTS } from '../../data/waypointsData';
import { useGameStore } from '../../store/gameStore';
import { InteractiveWaypoint } from '../../types/game';

interface WaypointVisualProps {
  waypoint: InteractiveWaypoint;
  isDiscovered: boolean;
  isActive: boolean;
}

const WaypointVisual: React.FC<WaypointVisualProps> = ({ waypoint, isDiscovered, isActive }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const pillarRef = useRef<THREE.Mesh>(null);
  const beaconBeamRef = useRef<THREE.Mesh>(null);

  const openPanel = useGameStore((s) => s.openPanel);
  const discoverWaypoint = useGameStore((s) => s.discoverWaypoint);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isActive ? 2.5 : 1.2);
      ringRef.current.rotation.x += delta * 0.8;
    }
    if (pillarRef.current) {
      pillarRef.current.position.y = 1.2 + Math.sin(Date.now() * 0.003) * 0.25;
      pillarRef.current.rotation.y += delta * 1.5;
    }
    if (beaconBeamRef.current) {
      beaconBeamRef.current.rotation.y += delta * 0.5;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    discoverWaypoint(waypoint.id);
    openPanel(waypoint.tab);
  };

  return (
    <group position={waypoint.position} onClick={handleClick}>
      {/* Ground holographic projection circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[waypoint.radius * 0.6, waypoint.radius, 32]} />
        <meshBasicMaterial
          color={waypoint.color}
          transparent
          opacity={isActive ? 0.65 : isDiscovered ? 0.4 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical celestial beacon light beam (visible from afar across the model) */}
      <mesh ref={beaconBeamRef} position={[0, 10, 0]}>
        <cylinderGeometry args={[0.08, 0.35, 20, 16]} />
        <meshBasicMaterial
          color={waypoint.color}
          transparent
          opacity={isActive ? 0.45 : isDiscovered ? 0.25 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rotating beacon ring */}
      <mesh ref={ringRef} position={[0, 1.2, 0]}>
        <torusGeometry args={[1.1, 0.06, 16, 32]} />
        <meshStandardMaterial
          color={waypoint.color}
          emissive={waypoint.color}
          emissiveIntensity={isActive ? 2.5 : 1.0}
        />
      </mesh>

      {/* Floating energy core */}
      <mesh ref={pillarRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={waypoint.color}
          emissive={waypoint.color}
          emissiveIntensity={isActive ? 3.0 : 1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Floating 3D Billboard Label */}
      <Billboard position={[0, 3.2, 0]}>
        <Text
          fontSize={0.42}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#050711"
        >
          {waypoint.title.toUpperCase()}
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.22}
          color={waypoint.color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#050711"
        >
          {isActive ? '[E] INTERACT / CLICK' : isDiscovered ? 'OUTPOST DISCOVERED' : 'UNEXPLORED ASSET'}
        </Text>
      </Billboard>

      {/* Soft point light illuminating the surrounding model structure */}
      <pointLight
        color={waypoint.color}
        intensity={isActive ? 4.5 : 2.5}
        distance={12}
        decay={2}
        position={[0, 1.8, 0]}
      />
    </group>
  );
};

export const InteractionSystem: React.FC = () => {
  const discoveredIds = useGameStore((s) => s.progression.discoveredIds);
  const activeTargetId = useGameStore((s) => s.interaction.activeTarget?.id);

  // Proximity evaluation runs in useFrame
  useFrame(() => {
    const store = useGameStore.getState();
    if (store.gameStatus !== 'playing') return;

    const [px, py, pz] = store.playerCoords;
    const playerPos = new THREE.Vector3(px, py, pz);

    let nearestWaypoint: InteractiveWaypoint | null = null;
    let minDistance = Infinity;

    for (const wp of WAYPOINTS) {
      const wpPos = new THREE.Vector3(...wp.position);
      const distance = playerPos.distanceTo(wpPos);

      if (distance <= wp.radius && distance < minDistance) {
        minDistance = distance;
        nearestWaypoint = wp;
      }
    }

    if (nearestWaypoint) {
      store.setInteractionTarget(nearestWaypoint, minDistance);
    } else if (store.interaction.activeTarget !== null) {
      store.setInteractionTarget(null, 0);
    }
  });

  return (
    <group name="interaction-system">
      {WAYPOINTS.map((wp) => (
        <WaypointVisual
          key={wp.id}
          waypoint={wp}
          isDiscovered={discoveredIds.includes(wp.id)}
          isActive={activeTargetId === wp.id}
        />
      ))}
    </group>
  );
};
