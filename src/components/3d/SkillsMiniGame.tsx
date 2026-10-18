import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { SKILLS_DATA } from '../../data/skillsData';
import { useGameStore } from '../../store/gameStore';
import { playerState } from '../../store/playerState';
import { SkillOrbItem } from '../../types/game';

const SkillOrb: React.FC<{
  skill: SkillOrbItem;
  isCollected: boolean;
}> = ({ skill, isCollected }) => {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const collectSkill = useGameStore((s) => s.collectSkill);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Gentle floating hover bobbing
      meshRef.current.position.y =
        skill.position[1] + Math.sin(Date.now() * 0.003 + skill.position[0]) * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
      ringRef.current.rotation.x += delta * 0.8;
    }

    // Proximity magnet collection check (within 2.2 meters)
    if (!isCollected) {
      const p = playerState.position;
      const dx = p.x - skill.position[0];
      const dy = p.y - skill.position[1];
      const dz = p.z - skill.position[2];
      const dist = Math.hypot(dx, dy, dz);

      if (dist < 2.4) {
        collectSkill(skill.id);
      }
    }
  });

  return (
    <group ref={meshRef} position={skill.position}>
      {/* Outer Glowing Energy Sphere */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 16]} />
        <meshStandardMaterial
          color={isCollected ? '#10B981' : skill.color}
          emissive={isCollected ? '#10B981' : skill.color}
          emissiveIntensity={isCollected ? 1.0 : 2.5}
          roughness={0.15}
          metalness={0.3}
          transparent
          opacity={isCollected ? 0.45 : 0.85}
        />
      </mesh>

      {/* Floating Orbiting Neon Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.95, 0.04, 16, 32]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* 3D Billboard Symbol / Logo */}
      <Billboard position={[0, 0, 0]}>
        <Text
          fontSize={0.36}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#050711"
        >
          {isCollected ? `✓ ${skill.symbol}` : skill.symbol}
        </Text>
      </Billboard>

      {/* Floating Label Above */}
      <Billboard position={[0, 1.25, 0]}>
        <Text
          fontSize={0.28}
          color={isCollected ? '#34D399' : '#FFFFFF'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#050711"
        >
          {skill.name}
        </Text>
      </Billboard>

      {/* Point Light Casting Glow on Ground */}
      <pointLight
        color={skill.color}
        intensity={isCollected ? 1.5 : 3.5}
        distance={6}
        decay={2}
      />
    </group>
  );
};

export const SkillsMiniGame: React.FC = () => {
  const skillsCollected = useGameStore((s) => s.progression.skillsCollected);

  return (
    <group name="skills-minigame">
      {/* Sky Runway Glowing Borders */}
      <mesh position={[41, 4.0, -39]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[4.5, 0.15, 42]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Neon Light Strips along Runway */}
      <mesh position={[43, 4.12, -39]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[0.15, 0.05, 42]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
      </mesh>
      <mesh position={[39, 4.12, -39]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[0.15, 0.05, 42]} />
        <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
      </mesh>

      {/* Collectible 3D Skill Orbs */}
      {SKILLS_DATA.map((skill) => (
        <SkillOrb
          key={skill.id}
          skill={skill}
          isCollected={skillsCollected.includes(skill.id)}
        />
      ))}
    </group>
  );
};
