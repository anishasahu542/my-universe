import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

const CLOUD_PATH = `${import.meta.env.BASE_URL}models/cloud.glb`;

export const CelestialEnvironment: React.FC = () => {
  const graphicsQuality = useGameStore((s) => s.settings.graphicsQuality);
  const cloudGltf = useGLTF(CLOUD_PATH);

  const petalsRef = useRef<THREE.Points>(null);
  const cloudsGroupRef = useRef<THREE.Group>(null);
  const planetaryRingsRef = useRef<THREE.Group>(null);
  const sisterPlanetRef = useRef<THREE.Group>(null);

  // Cherry Blossom (Sakura) falling petals particle system
  const { positions, velocities } = useMemo(() => {
    const count = graphicsQuality === 'low' ? 120 : 350;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = Math.random() * 35 + 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 140;

      vel[i * 3] = (Math.random() - 0.5) * 0.3 - 0.15;
      vel[i * 3 + 1] = -(Math.random() * 0.25 + 0.12);
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return { positions: pos, velocities: vel };
  }, [graphicsQuality]);

  useFrame((_, delta) => {
    // Animate falling sakura petals
    if (petalsRef.current) {
      const geo = petalsRef.current.geometry;
      const attr = geo.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;

      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3] += velocities[i * 3] * delta * 8;
        arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 8;
        arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 8;

        // Reset if petal falls to the planet surface
        if (arr[i * 3 + 1] < 1.5) {
          arr[i * 3 + 1] = 38;
          arr[i * 3] = (Math.random() - 0.5) * 140;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 140;
        }
      }
      attr.needsUpdate = true;
    }

    // Slowly rotate clouds
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.rotation.y += delta * 0.012;
    }

    // Slowly rotate planetary rings overhead
    if (planetaryRingsRef.current) {
      planetaryRingsRef.current.rotation.z += delta * 0.008;
    }

    // Orbit sister planet moon
    if (sisterPlanetRef.current) {
      sisterPlanetRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <>
      {/* Anime Twilight Cosmic Sky Dome & Starfield */}
      <color attach="background" args={['#070B1E']} />
      <fog attach="fog" args={['#101535', 65, 210]} />

      {/* Deep Space Starfield */}
      <Stars
        radius={160}
        depth={70}
        count={graphicsQuality === 'low' ? 1400 : 4000}
        factor={5.5}
        saturation={0.85}
        fade
        speed={1.0}
      />

      {/* Warm Celestial Planetary Sun Light */}
      <directionalLight
        position={[55, 70, 35]}
        intensity={2.4}
        color="#FDE68A"
        castShadow={graphicsQuality !== 'low'}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={220}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0004}
      />

      {/* Purple/Cyan Cosmic Ambient Fill */}
      <ambientLight intensity={0.9} color="#818CF8" />
      <hemisphereLight args={['#38BDF8', '#1E1B4B', 0.7]} />

      {/* ========================================================
          COLOSSAL PLANETARY RING SYSTEM OVERHEAD
      ======================================================== */}
      <group
        ref={planetaryRingsRef}
        position={[0, 0, 0]}
        rotation={[Math.PI / 3.2, 0.25, 0.4]}
      >
        {/* Main Glowing Dust Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[115, 175, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer Violet Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[180, 215, 64]} />
          <meshBasicMaterial
            color="#A855F7"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner Golden Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[98, 110, 64]} />
          <meshBasicMaterial
            color="#FBBF24"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ========================================================
          DISTANT SISTER GAS GIANT PLANET IN THE SKY
      ======================================================== */}
      <group position={[-130, 90, -170]}>
        {/* Giant Banded Gas Planet */}
        <mesh>
          <sphereGeometry args={[28, 32, 32]} />
          <meshStandardMaterial
            color="#4338CA"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>

        {/* Gas Giant Planetary Atmosphere Halo */}
        <mesh>
          <sphereGeometry args={[29.5, 32, 32]} />
          <meshBasicMaterial
            color="#06B6D4"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Gas Giant Equatorial Rings */}
        <mesh rotation={[Math.PI / 2.8, 0.4, 0]}>
          <ringGeometry args={[35, 52, 48]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Orbiting Moon */}
        <group ref={sisterPlanetRef}>
          <mesh position={[42, 10, 0]}>
            <sphereGeometry args={[4.2, 16, 16]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Drifting Planetary Clouds in the Sky */}
      <group ref={cloudsGroupRef}>
        <primitive object={cloudGltf.scene.clone()} position={[45, 14, 45]} scale={[4, 2.5, 4]} />
        <primitive object={cloudGltf.scene.clone()} position={[-55, 20, -35]} scale={[4.5, 3, 4.5]} />
        <primitive object={cloudGltf.scene.clone()} position={[-30, 12, 60]} scale={[3.5, 2.2, 3.5]} />
        <primitive object={cloudGltf.scene.clone()} position={[50, 18, -55]} scale={[5, 3.2, 5]} />
        <primitive object={cloudGltf.scene.clone()} position={[0, -2, -65]} scale={[6, 3.5, 6]} />
      </group>

      {/* Falling Sakura / Stardust Petals across the Planet */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#F472B6"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
};

useGLTF.preload(CLOUD_PATH);
