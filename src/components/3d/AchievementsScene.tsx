import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ACHIEVEMENTS_DATA } from '../../data/achievementsData';
import { useGameStore } from '../../store/gameStore';
import { playerState } from '../../store/playerState';
import { AchievementItem } from '../../types/game';

// Monumental 3D Golden Trophy
const GoldenTrophy: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const trophyRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const openPanel = useGameStore((s) => s.openPanel);

  useFrame((_, delta) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 0.6;
      trophyRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.15;
    }
    if (auraRef.current) {
      auraRef.current.rotation.z += delta * 1.2;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        openPanel('achievements');
      }}
    >
      {/* Stone / Marble Pedestal Base */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.8, 0.8, 8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.3, 0.4, 8]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Floating Trophy Assembly */}
      <group ref={trophyRef}>
        {/* Trophy Base Foot */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.75, 0.3, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Trophy Stem */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.35, 0.7, 24]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Trophy Main Cup */}
        <mesh position={[0, 1.75, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.4, 1.1, 24]} />
          <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.12} />
        </mesh>

        {/* Cup Inner Rim */}
        <mesh position={[0, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.08, 16, 32]} />
          <meshStandardMaterial color="#FDE68A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Left Trophy Handle */}
        <mesh position={[-0.95, 1.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.42, 0.08, 16, 24, Math.PI]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Right Trophy Handle */}
        <mesh position={[0.95, 1.75, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <torusGeometry args={[0.42, 0.08, 16, 24, Math.PI]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Golden Star Emblem on Trophy */}
        <mesh position={[0, 1.75, 0.92]}>
          <octahedronGeometry args={[0.24, 0]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FDE68A" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* Floating Golden Halo Ring */}
      <mesh ref={auraRef} position={[0, 2.2, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.5, 0.04, 16, 32]} />
        <meshStandardMaterial color="#EAB308" emissive="#EAB308" emissiveIntensity={2.8} />
      </mesh>

      {/* 3D Billboard Header */}
      <Billboard position={[0, 3.4, 0]}>
        <Text
          fontSize={0.44}
          color="#FEF08A"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#78350F"
        >
          HALL OF FAME
        </Text>
        <Text
          position={[0, -0.38, 0]}
          fontSize={0.24}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#050711"
        >
          CLICK TO VIEW HONORS
        </Text>
      </Billboard>

      {/* Brilliant Golden Spotlight */}
      <pointLight color="#FDE047" intensity={5.0} distance={15} decay={2} position={[0, 2.8, 0]} />
    </group>
  );
};

// Interactive Floating Medal
const AchievementMedal: React.FC<{
  item: AchievementItem;
  isUnlocked: boolean;
}> = ({ item, isUnlocked }) => {
  const meshRef = useRef<THREE.Group>(null);
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);
  const openPanel = useGameStore((s) => s.openPanel);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        item.position[1] + Math.sin(Date.now() * 0.003 + item.position[0]) * 0.2;
      meshRef.current.rotation.y += delta * 0.9;
    }

    // Proximity unlock check
    if (!isUnlocked) {
      const p = playerState.position;
      const dx = p.x - item.position[0];
      const dy = p.y - item.position[1];
      const dz = p.z - item.position[2];
      const dist = Math.hypot(dx, dy, dz);

      if (dist < 3.0) {
        unlockAchievement(item.id);
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={item.position}
      onClick={(e) => {
        e.stopPropagation();
        unlockAchievement(item.id);
        openPanel('achievements');
      }}
    >
      {/* Medal Medallion Disc */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.08, 24]} />
        <meshStandardMaterial
          color={isUnlocked ? '#FBBF24' : '#64748B'}
          metalness={0.9}
          roughness={0.2}
          emissive={isUnlocked ? '#F59E0B' : '#000000'}
          emissiveIntensity={isUnlocked ? 1.0 : 0}
        />
      </mesh>

      {/* Outer Medal Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.05, 16, 24]} />
        <meshStandardMaterial
          color={isUnlocked ? item.color : '#94A3B8'}
          emissive={isUnlocked ? item.color : '#334155'}
          emissiveIntensity={isUnlocked ? 2.0 : 0.2}
        />
      </mesh>

      {/* Floating Ribbon Top */}
      <mesh position={[0, 0.72, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.28, 0.5, 0.02]} />
        <meshStandardMaterial color={item.color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.28, 0.5, 0.02]} />
        <meshStandardMaterial color={item.color} roughness={0.4} />
      </mesh>

      {/* Billboard Title */}
      <Billboard position={[0, 1.25, 0]}>
        <Text
          fontSize={0.28}
          color={isUnlocked ? '#FEF08A' : '#E2E8F0'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#050711"
        >
          {item.badge}
        </Text>
        <Text
          position={[0, -0.32, 0]}
          fontSize={0.2}
          color="#94A3B8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#050711"
        >
          {item.year}
        </Text>
      </Billboard>

      {/* Light Source */}
      <pointLight
        color={item.color}
        intensity={isUnlocked ? 3.0 : 1.0}
        distance={6}
        decay={2}
      />
    </group>
  );
};

export const AchievementsScene: React.FC = () => {
  const achievementsUnlocked = useGameStore((s) => s.progression.achievementsUnlocked);

  return (
    <group name="achievements-scene">
      {/* 3D Golden Trophy Cup at Island Center */}
      <GoldenTrophy position={[-42, 6.8, 32]} />

      {/* 5 Walkway Medals */}
      {ACHIEVEMENTS_DATA.map((item) => (
        <AchievementMedal
          key={item.id}
          item={item}
          isUnlocked={achievementsUnlocked.includes(item.id)}
        />
      ))}
    </group>
  );
};
