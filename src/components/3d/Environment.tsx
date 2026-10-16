import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

export const Environment: React.FC = () => {
  const graphicsQuality = useGameStore((s) => s.settings.graphicsQuality);
  const dustRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Group>(null);

  // Generate floating cosmic dust particles
  const particleCount = graphicsQuality === 'high' ? 600 : graphicsQuality === 'medium' ? 300 : 100;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const colorPalette = [
      new THREE.Color('#00F0FF'), // Cyan
      new THREE.Color('#A855F7'), // Violet
      new THREE.Color('#38BDF8'), // Sky blue
      new THREE.Color('#F43F5E'), // Magenta
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.02;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.015;
    }
  });

  return (
    <>
      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={graphicsQuality === 'high' ? 3000 : 1500}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />

      {/* Floating nebula dust */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Lighting: Anime Sci-Fi palette */}
      {/* Ambient fill for deep space darks */}
      <ambientLight intensity={0.6} color="#1E1B4B" />

      {/* Main cosmic sun directional light */}
      <directionalLight
        position={[25, 35, 20]}
        intensity={1.8}
        color="#FDE047"
        castShadow={graphicsQuality !== 'low'}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Rim light with cyan glow */}
      <directionalLight position={[-20, 10, -20]} intensity={1.2} color="#00F0FF" />

      {/* Bottom bounce light with purple neon hue */}
      <directionalLight position={[0, -15, 0]} intensity={0.5} color="#A855F7" />

      {/* Animated Sci-Fi Orbital Rings in the distance */}
      <group ref={ringRef} position={[0, -1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[28, 28.2, 64]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[32, 32.1, 64]} />
          <meshBasicMaterial color="#A855F7" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
};
