import React from 'react';
import { Text, Billboard } from '@react-three/drei';
import { RigidBody, CylinderCollider, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

interface PortalArchProps {
  title: string;
  subtitle: string;
  color: string;
  position: [number, number, number];
  rotationY?: number;
  tab: 'projects' | 'skills' | 'about' | 'achievements' | 'contact';
}

const PortalArch: React.FC<PortalArchProps> = ({
  title,
  subtitle,
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
      {/* Torii / High-Tech Planetary Portal Pillars */}
      <mesh position={[-2.4, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.32, 6.4, 16]} />
        <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[2.4, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.32, 6.4, 16]} />
        <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Illuminated Pylon Edge Strips */}
      <mesh position={[-2.4, 3.2, 0.28]}>
        <boxGeometry args={[0.08, 6.0, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[2.4, 3.2, 0.28]}>
        <boxGeometry args={[0.08, 6.0, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.0} />
      </mesh>

      {/* Overhead Cyber Arch Crossbeam */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <boxGeometry args={[5.8, 0.45, 0.7]} />
        <meshStandardMaterial color="#0B0F19" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Floating Holographic Sector Sign Billboard */}
      <Billboard position={[0, 7.3, 0]}>
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[title.length * 0.35 + 1.6, 1.1]} />
          <meshBasicMaterial color="#030712" transparent opacity={0.88} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[title.length * 0.35 + 1.75, 1.25]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
        <Text
          position={[0, 0.16, 0]}
          fontSize={0.46}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor={color}
        >
          {title}
        </Text>
        <Text
          position={[0, -0.28, 0]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {subtitle.toUpperCase()}
        </Text>
      </Billboard>

      {/* Swirling Translucent Energy Gate Curtain */}
      <mesh position={[0, 3.2, 0]}>
        <planeGeometry args={[4.4, 5.8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floor Projection Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
        <ringGeometry args={[2.0, 2.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* Sector Beacon Light */}
      <pointLight color={color} intensity={4.5} distance={16} decay={2} position={[0, 4.5, 0]} />
    </group>
  );
};

// Continuous Paved Planetary Highway connecting two surface positions
const PlanetaryHighway: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  width?: number;
}> = ({ start, end, color, width = 5.2 }) => {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.hypot(dx, dz);
  const angleY = Math.atan2(dx, dz);
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  return (
    <group position={[midX, midY, midZ]} rotation={[0, angleY, 0]}>
      {/* Walkable Highway Collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[width / 2, 0.4, length / 2]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Main Highway Pavement Surface */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.35, length]} />
        <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Center Neon Energy Guideway */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.05, length]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>

      {/* Left & Right Glowing Guard Curbs */}
      <mesh position={[-width / 2 + 0.15, 0.25, 0]}>
        <boxGeometry args={[0.2, 0.25, length]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh position={[-width / 2 + 0.15, 0.38, 0]}>
        <boxGeometry args={[0.08, 0.08, length]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.0} />
      </mesh>

      <mesh position={[width / 2 - 0.15, 0.25, 0]}>
        <boxGeometry args={[0.2, 0.25, length]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh position={[width / 2 - 0.15, 0.38, 0]}>
        <boxGeometry args={[0.08, 0.08, length]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.0} />
      </mesh>
    </group>
  );
};

// Perimeter Forcefield Pylon
const PerimeterPylon: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 4.0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.7, 8.0, 8]} />
        <meshStandardMaterial color="#0B1120" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 8.2, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={3.0} />
      </mesh>
      <pointLight color="#00F0FF" intensity={2.0} distance={12} position={[0, 8.2, 0]} />
    </group>
  );
};

export const PlanetWorld: React.FC = () => {
  return (
    <group name="planetary-world">
      {/* ========================================================
          1. THE PLANETARY CORE & CURVED HORIZON
      ======================================================== */}
      {/* Massive Planet Sphere visible curving toward space in the horizon */}
      <mesh position={[0, -145, 0]} receiveShadow>
        <sphereGeometry args={[150, 64, 64]} />
        <meshStandardMaterial
          color="#0A1128"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Atmospheric Glowing Rim Shell (Fresnel atmospheric haze) */}
      <mesh position={[0, -145, 0]}>
        <sphereGeometry args={[152, 64, 64]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ========================================================
          2. CONTINUOUS WALKABLE PLANETARY SURFACE & CRUST (PHYSICS)
      ======================================================== */}
      {/* Solid continuous planetary ground plane collider: radius 90m */}
      <RigidBody type="fixed" colliders={false} position={[0, 1.0, 0]} name="planet-ground-physics">
        <CylinderCollider args={[1.5, 92.0]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Visual Continuous Planetary Surface Crust */}
      <mesh position={[0, 1.0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[92, 95, 3.0, 64]} />
        <meshStandardMaterial
          color="#0B132B"
          metalness={0.35}
          roughness={0.75}
        />
      </mesh>

      {/* Planetary Crust Terrain Rings (Topographic concentric soil layers) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.52, 0]} receiveShadow>
        <ringGeometry args={[16, 88, 64]} />
        <meshStandardMaterial
          color="#1C2541"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Neon Planetary Energy Grid Lines etched into the terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.54, 0]}>
        <ringGeometry args={[30, 30.5, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.54, 0]}>
        <ringGeometry args={[55, 55.6, 64]} />
        <meshBasicMaterial color="#818CF8" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.54, 0]}>
        <ringGeometry args={[75, 75.8, 64]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* ========================================================
          3. CENTRAL PLANETARY SPACEPORT (Spawn Plaza)
      ======================================================== */}
      <group position={[0, 2.5, 0]}>
        {/* Raised Circular Landing Pad Platform */}
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
          <CylinderCollider args={[0.5, 15.0]} position={[0, 0, 0]} />
        </RigidBody>

        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[15.0, 15.5, 0.4, 32]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Outer Neon Runway Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
          <ringGeometry args={[13.2, 14.2, 48]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* Inner Landing Target Chevron Circle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.33, 0]}>
          <ringGeometry args={[5.0, 6.2, 32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>

        {/* Central Planetary Telemetry Spire */}
        <mesh position={[0, 9.0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.6, 18.0, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 18.2, 0]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={3.5} />
        </mesh>
        <pointLight color="#00F0FF" intensity={6.0} distance={35} position={[0, 18.5, 0]} />

        {/* 4 Spaceport Floodlight Towers */}
        {[
          [11, 3.5, 11],
          [-11, 3.5, 11],
          [11, 3.5, -11],
          [-11, 3.5, -11],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.3, 7.0, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
            <mesh position={[0, 3.6, 0]}>
              <boxGeometry args={[0.8, 0.5, 0.8]} />
              <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={2.5} />
            </mesh>
            <pointLight color="#38BDF8" intensity={3.0} distance={15} position={[0, 3.8, 0]} />
          </group>
        ))}
      </group>

      {/* ========================================================
          4. SECTOR 1: CYBER COLONY & AI LAB (Projects)
      ======================================================== */}
      <group position={[-38, 2.5, -35]}>
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
          <CylinderCollider args={[0.5, 17.0]} position={[0, 0, 0]} />
        </RigidBody>

        {/* Raised Colony Foundation */}
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[17.0, 17.6, 0.45, 32]} />
          <meshStandardMaterial color="#0B132B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
          <ringGeometry args={[14.5, 16.0, 32]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Portal Gate Archway */}
        <PortalArch
          title="PROJECTS SECTOR"
          subtitle="Cyber Colony & AI Lab"
          color="#00F0FF"
          position={[0, 0.35, 6.5]}
          rotationY={Math.PI}
          tab="projects"
        />

        {/* Server Monoliths / Cyber Monolith Towers */}
        {[
          [-8, 4.0, -6],
          [-4, 5.0, -8],
          [4, 4.5, -8],
          [8, 5.5, -6],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.0, 8.0 + idx * 0.8, 2.0]} />
              <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Glowing Matrix Server Strip */}
            <mesh position={[0, 0, 1.02]}>
              <planeGeometry args={[1.4, 7.0 + idx * 0.8]} />
              <meshBasicMaterial color="#00F0FF" transparent opacity={0.75} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================
          5. SECTOR 2: ION RUNWAY & CRYSTAL VALLEY (Skills)
      ======================================================== */}
      <group position={[38, 2.5, -35]}>
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
          <CylinderCollider args={[0.5, 17.0]} position={[0, 0, 0]} />
        </RigidBody>

        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[17.0, 17.6, 0.45, 32]} />
          <meshStandardMaterial color="#0F172A" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
          <ringGeometry args={[14.5, 16.0, 32]} />
          <meshBasicMaterial color="#A855F7" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        <PortalArch
          title="SKILLS SECTOR"
          subtitle="Crystal Ion Runway"
          color="#A855F7"
          position={[0, 0.35, 6.5]}
          rotationY={Math.PI}
          tab="skills"
        />

        {/* Crystal Clusters around Skills Sector */}
        {[
          [-9, 2.5, -5],
          [-7, 3.5, -9],
          [7, 3.0, -9],
          [9, 2.8, -5],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]} castShadow>
            <coneGeometry args={[1.2, 5.0 + idx * 0.5, 6]} />
            <meshStandardMaterial
              color="#A855F7"
              emissive="#7E22CE"
              emissiveIntensity={1.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          6. SECTOR 3: BIO-SANCTUARY (About Me)
      ======================================================== */}
      <group position={[45, 2.2, 30]}>
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
          <CylinderCollider args={[0.5, 16.0]} position={[0, 0, 0]} />
        </RigidBody>

        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[16.0, 16.6, 0.45, 32]} />
          <meshStandardMaterial color="#1E1B4B" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
          <ringGeometry args={[13.5, 15.0, 32]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        <PortalArch
          title="BIO-SANCTUARY"
          subtitle="Identity & Dialogue Matrix"
          color="#F59E0B"
          position={[0, 0.35, 6.5]}
          rotationY={Math.PI}
          tab="about"
        />

        {/* Planetary Ancient Stone Circle / Megaliths */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 8.5;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * r, 2.5, Math.sin(angle) * r - 2]}
              castShadow
            >
              <boxGeometry args={[0.9, 4.5, 0.7]} />
              <meshStandardMaterial color="#475569" roughness={0.9} />
            </mesh>
          );
        })}
      </group>

      {/* ========================================================
          7. SECTOR 4: GOLDEN CITADEL & TROPHY PLATEAU (Achievements)
      ======================================================== */}
      <group position={[-42, 3.8, 32]}>
        {/* Elevated Golden Mesa Platform */}
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
          <CylinderCollider args={[0.8, 16.5]} position={[0, 0, 0]} />
        </RigidBody>

        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[16.0, 17.0, 1.2, 32]} />
          <meshStandardMaterial color="#451A03" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.62, 0]}>
          <ringGeometry args={[13.8, 15.2, 32]} />
          <meshBasicMaterial color="#EAB308" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        <PortalArch
          title="GOLDEN CITADEL"
          subtitle="Trophy Plateau & Medals"
          color="#EAB308"
          position={[0, 0.65, 6.5]}
          rotationY={Math.PI}
          tab="achievements"
        />

        {/* Golden Victory Obelisks */}
        {[
          [-8, 4.0, -6],
          [8, 4.0, -6],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.7, 7.5, 4]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.15} />
            </mesh>
            <pointLight color="#FDE047" intensity={3.5} distance={10} position={[0, 4.5, 0]} />
          </group>
        ))}
      </group>

      {/* ========================================================
          8. SECTOR 5: SAKURA BLOSSOM OASIS & COMMS (Contact)
      ======================================================== */}
      <group position={[0, 2.5, 48]}>
        <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
          <CylinderCollider args={[0.5, 16.0]} position={[0, 0, 0]} />
        </RigidBody>

        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[16.0, 16.6, 0.45, 32]} />
          <meshStandardMaterial color="#1E1B4B" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
          <ringGeometry args={[13.5, 15.0, 32]} />
          <meshBasicMaterial color="#EC4899" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>

        <PortalArch
          title="SAKURA OASIS"
          subtitle="Orbital Comms & Transmission"
          color="#EC4899"
          position={[0, 0.35, 6.5]}
          rotationY={Math.PI}
          tab="contact"
        />

        {/* High-Gain Satellite Transmission Dish */}
        <group position={[0, 5.5, -7]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.5, 5.0, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.8, 0]} rotation={[0.5, 0, 0]} castShadow>
            <cylinderGeometry args={[2.8, 0.6, 0.8, 24]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
          </mesh>
          <pointLight color="#EC4899" intensity={4.0} distance={12} position={[0, 4.0, 0]} />
        </group>
      </group>

      {/* ========================================================
          9. 5 CONTINUOUS PLANETARY HIGHWAYS (Solid Walkable Roads)
      ======================================================== */}
      {/* Central Spaceport to Projects Cyber Colony */}
      <PlanetaryHighway start={[0, 2.5, 0]} end={[-38, 2.5, -35]} color="#00F0FF" />

      {/* Central Spaceport to Skills Crystal Runway */}
      <PlanetaryHighway start={[0, 2.5, 0]} end={[38, 2.5, -35]} color="#A855F7" />

      {/* Central Spaceport to Bio-Sanctuary */}
      <PlanetaryHighway start={[0, 2.5, 0]} end={[45, 2.2, 30]} color="#F59E0B" />

      {/* Central Spaceport to Golden Citadel */}
      <PlanetaryHighway start={[0, 2.5, 0]} end={[-42, 3.8, 32]} color="#EAB308" />

      {/* Central Spaceport to Sakura Blossom Oasis */}
      <PlanetaryHighway start={[0, 2.5, 0]} end={[0, 2.5, 48]} color="#EC4899" />

      {/* ========================================================
          10. PERIMETER FORCEFIELD PYLONS RING
      ======================================================== */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 86;
        return (
          <PerimeterPylon
            key={i}
            position={[Math.cos(angle) * radius, 1.5, Math.sin(angle) * radius]}
          />
        );
      })}

      {/* Safety Catchment Floor Plane far below (standard game safeguard) */}
      <RigidBody type="fixed" colliders={false} position={[0, -50, 0]}>
        <CuboidCollider args={[150, 1.0, 150]} />
      </RigidBody>
    </group>
  );
};
