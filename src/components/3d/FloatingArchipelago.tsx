import React, { useMemo } from 'react';
import { useGLTF, Text, Billboard } from '@react-three/drei';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

const ISLAND_PATH = `${import.meta.env.BASE_URL}models/floating_island.glb`;

interface PortalArchProps {
  title: string;
  color: string;
  position: [number, number, number];
  rotationY?: number;
  tab: 'projects' | 'skills' | 'about' | 'achievements' | 'contact';
}

const PortalArch: React.FC<PortalArchProps> = ({
  title,
  color,
  position,
  rotationY = 0,
  tab,
}) => {
  const openPanel = useGameStore((s) => s.openPanel);
  const discoverWaypoint = useGameStore((s) => s.discoverWaypoint);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    discoverWaypoint(`${tab}-island`);
    openPanel(tab);
  };

  return (
    <group position={position} rotation={[0, rotationY, 0]} onClick={handleClick}>
      {/* Torii / Portal Pillars */}
      <mesh position={[-2.2, 3.0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 6.0, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[2.2, 3.0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 6.0, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Crossbar */}
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[5.2, 0.35, 0.6]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Floating Neon Portal Billboard (Matching Reference Image) */}
      <Billboard position={[0, 6.8, 0]}>
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[title.length * 0.35 + 1.2, 0.9]} />
          <meshBasicMaterial color="#050711" transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[title.length * 0.35 + 1.35, 1.05]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
        <Text
          fontSize={0.48}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor={color}
        >
          {title}
        </Text>
      </Billboard>

      {/* Swirling Translucent Energy Gate */}
      <mesh position={[0, 3.0, 0]}>
        <planeGeometry args={[4.0, 5.2]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floor Projection Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[2.2, 3.0, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Beacon Light */}
      <pointLight color={color} intensity={4.0} distance={14} decay={2} position={[0, 4.0, 0]} />
    </group>
  );
};

// Stepping stones bridge connecting two 3D positions
const SteppingStonesBridge: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  steps?: number;
}> = ({ start, end, steps = 6 }) => {
  const stones = useMemo(() => {
    const list: { pos: [number, number, number]; rotY: number; scale: number }[] = [];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.8;
      const z = start[2] + (end[2] - start[2]) * t;
      list.push({
        pos: [x, y, z],
        rotY: Math.random() * Math.PI,
        scale: 0.9 + Math.random() * 0.3,
      });
    }
    return list;
  }, [start, end, steps]);

  return (
    <group>
      {stones.map((s, idx) => (
        <RigidBody key={idx} type="fixed" colliders={false} position={s.pos}>
          <CylinderCollider args={[0.3, 1.4 * s.scale]} position={[0, 0, 0]} />
          <mesh rotation={[0, s.rotY, 0]} scale={[s.scale, 0.35, s.scale]} castShadow receiveShadow>
            <cylinderGeometry args={[1.4, 1.2, 0.6, 12]} />
            <meshStandardMaterial color="#475569" roughness={0.8} metalness={0.2} />
          </mesh>
          {/* Subtle neon moss/runes on stones */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
            <circleGeometry args={[0.9 * s.scale, 16]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.25} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
};

export const FloatingArchipelago: React.FC = () => {
  const islandGltf = useGLTF(ISLAND_PATH);

  // Clone island models with optimized materials
  const islandScene = useMemo(() => {
    const clone = islandGltf.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [islandGltf]);

  return (
    <group name="floating-archipelago">
      {/* ========================================================
          1. CENTRAL HUB ISLAND (Spawn Plaza & Luna Greeting)
      ======================================================== */}
      <group position={[0, 0, 0]}>
        <primitive object={islandScene.clone()} />
        {/* Solid walkable collider for Central Island */}
        <RigidBody type="fixed" colliders={false} position={[0, 3.2, 0]}>
          <CylinderCollider args={[2.0, 15.0]} position={[0, -1.0, 0]} />
        </RigidBody>
      </group>

      {/* ========================================================
          2. PROJECTS ISLAND (Cyber Arcade Terminal & Screens)
      ======================================================== */}
      <group position={[-38, 2, -35]} rotation={[0, Math.PI / 4, 0]}>
        <primitive object={islandScene.clone()} scale={[1.2, 1.1, 1.2]} />
        <RigidBody type="fixed" colliders={false} position={[0, 3.4, 0]}>
          <CylinderCollider args={[2.0, 18.0]} position={[0, -1.0, 0]} />
        </RigidBody>
        {/* Glowing Neon Portal Sign */}
        <PortalArch
          title="PROJECTS"
          color="#00F0FF"
          position={[0, 3.6, 6.0]}
          rotationY={Math.PI}
          tab="projects"
        />
      </group>

      {/* ========================================================
          3. SKILLS ISLAND (Runway Mini-Game: 15 Tech Orbs)
      ======================================================== */}
      <group position={[38, 4, -35]} rotation={[0, -Math.PI / 4, 0]}>
        <primitive object={islandScene.clone()} scale={[1.25, 1.1, 1.25]} />
        <RigidBody type="fixed" colliders={false} position={[0, 3.5, 0]}>
          <CylinderCollider args={[2.0, 18.0]} position={[0, -1.0, 0]} />
        </RigidBody>
        {/* Glowing Neon Portal Sign */}
        <PortalArch
          title="SKILLS"
          color="#A855F7"
          position={[0, 3.6, 6.0]}
          rotationY={Math.PI}
          tab="skills"
        />
      </group>

      {/* ========================================================
          4. ABOUT SANCTUARY ISLAND (Interactive Conversation)
      ======================================================== */}
      <group position={[45, 0, 30]} rotation={[0, -Math.PI * 0.7, 0]}>
        <primitive object={islandScene.clone()} scale={[1.15, 1.05, 1.15]} />
        <RigidBody type="fixed" colliders={false} position={[0, 3.2, 0]}>
          <CylinderCollider args={[2.0, 16.0]} position={[0, -1.0, 0]} />
        </RigidBody>
        <PortalArch
          title="ABOUT ME"
          color="#F59E0B"
          position={[0, 3.6, 6.0]}
          rotationY={Math.PI}
          tab="about"
        />
      </group>

      {/* ========================================================
          5. ACHIEVEMENTS ISLAND (Golden Trophy & Treasure Medals)
      ======================================================== */}
      <group position={[-42, 6, 32]} rotation={[0, Math.PI * 0.65, 0]}>
        <primitive object={islandScene.clone()} scale={[1.2, 1.15, 1.2]} />
        <RigidBody type="fixed" colliders={false} position={[0, 3.4, 0]}>
          <CylinderCollider args={[2.0, 17.0]} position={[0, -1.0, 0]} />
        </RigidBody>
        <PortalArch
          title="ACHIEVEMENTS"
          color="#EAB308"
          position={[0, 3.6, 6.0]}
          rotationY={Math.PI}
          tab="achievements"
        />
      </group>

      {/* ========================================================
          6. CONTACT BLOSSOM ISLAND (Sakura Garden & Comms)
      ======================================================== */}
      <group position={[0, -2, 48]} rotation={[0, Math.PI, 0]}>
        <primitive object={islandScene.clone()} scale={[1.15, 1.0, 1.15]} />
        <RigidBody type="fixed" colliders={false} position={[0, 3.0, 0]}>
          <CylinderCollider args={[2.0, 16.0]} position={[0, -1.0, 0]} />
        </RigidBody>
        <PortalArch
          title="CONTACT"
          color="#EC4899"
          position={[0, 3.5, 6.0]}
          rotationY={Math.PI}
          tab="contact"
        />
      </group>

      {/* ========================================================
          7. CELESTIAL BRIDGES & STEPPING STONES
      ======================================================== */}
      {/* Central Hub to Projects Island */}
      <SteppingStonesBridge start={[0, 3.2, 0]} end={[-38, 5.2, -35]} steps={9} />

      {/* Central Hub to Skills Island */}
      <SteppingStonesBridge start={[0, 3.2, 0]} end={[38, 7.2, -35]} steps={9} />

      {/* Central Hub to About Sanctuary Island */}
      <SteppingStonesBridge start={[0, 3.2, 0]} end={[45, 3.2, 30]} steps={9} />

      {/* Central Hub to Achievements Island */}
      <SteppingStonesBridge start={[0, 3.2, 0]} end={[-42, 9.2, 32]} steps={9} />

      {/* Central Hub to Contact Blossom Island */}
      <SteppingStonesBridge start={[0, 3.2, 0]} end={[0, 1.2, 48]} steps={8} />

      {/* Safety Catchment Floor Plane (Teleports player if they fall off) */}
      <RigidBody type="fixed" colliders={false} position={[0, -45, 0]}>
        <CuboidCollider args={[150, 1.0, 150]} />
      </RigidBody>
    </group>
  );
};

useGLTF.preload(ISLAND_PATH);
