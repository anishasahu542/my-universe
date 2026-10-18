import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { playerState } from '../../store/playerState';

export const CompanionLuna: React.FC = () => {
  const lunaGroupRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const quest = useGameStore((s) => s.progression.currentQuest);
  const openPanel = useGameStore((s) => s.openPanel);

  // Position smoothing vectors
  const currentPos = useRef(new THREE.Vector3(1.2, 4.5, 2.8));

  useFrame((_, delta) => {
    if (!lunaGroupRef.current) return;

    // Follow slightly behind and to the right of the player
    const targetX = playerState.position.x + 1.2;
    const targetY = playerState.position.y + 1.8 + Math.sin(Date.now() * 0.004) * 0.2;
    const targetZ = playerState.position.z + 1.2;

    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, Math.min(1, delta * 5.0));
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetY, Math.min(1, delta * 6.0));
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, Math.min(1, delta * 5.0));

    lunaGroupRef.current.position.copy(currentPos.current);

    // Flap cute holographic winglets
    const wingFlap = Math.sin(Date.now() * 0.015) * 0.45;
    if (wingLeftRef.current) wingLeftRef.current.rotation.z = -0.3 + wingFlap;
    if (wingRightRef.current) wingRightRef.current.rotation.z = 0.3 - wingFlap;

    // Rotate energy halo
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 2.0;
    }
  });

  return (
    <group
      ref={lunaGroupRef}
      name="companion-luna"
      onClick={(e) => {
        e.stopPropagation();
        openPanel('about');
      }}
    >
      {/* Central Cute Drone/Fairy Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.2} />
      </mesh>

      {/* Visor Display Eyes (Kawaii anime expressions) */}
      <mesh position={[0, 0.04, 0.28]} rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={3.5}
        />
      </mesh>

      {/* Left & Right Glowing Winglets */}
      <mesh ref={wingLeftRef} position={[-0.32, 0.12, -0.05]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.42, 0.22]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wingRightRef} position={[0.32, 0.12, -0.05]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.42, 0.22]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Little Golden Antenna */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={2.0} />
      </mesh>

      {/* Holographic Halo Ring */}
      <mesh ref={haloRef} position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.02, 16, 24]} />
        <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={2.5} />
      </mesh>

      {/* In-World Speech Balloon Above Luna */}
      <Billboard position={[0, 0.95, 0]}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[3.2, 0.72]} />
          <meshBasicMaterial color="#0B1120" transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[3.28, 0.8]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} />
        </mesh>
        <Text
          position={[0, 0.12, 0]}
          fontSize={0.2}
          color="#38BDF8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#050711"
        >
          LUNA (GUIDE)
        </Text>
        <Text
          position={[0, -0.14, 0]}
          fontSize={0.18}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.0}
        >
          {quest || 'Explore the floating islands!'}
        </Text>
      </Billboard>

      {/* Luna Glow Light */}
      <pointLight color="#00F0FF" intensity={2.0} distance={5} decay={2} />
    </group>
  );
};
