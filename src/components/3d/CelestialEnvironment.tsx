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

  // Cherry Blossom (Sakura) falling petals particle system
  const { positions, velocities } = useMemo(() => {
    const count = graphicsQuality === 'low' ? 120 : 350;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * 40 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      vel[i * 3] = (Math.random() - 0.5) * 0.4 - 0.2; // drifting with wind
      vel[i * 3 + 1] = -(Math.random() * 0.3 + 0.15); // falling slowly
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
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

        // Reset if petal falls below islands
        if (arr[i * 3 + 1] < -15) {
          arr[i * 3 + 1] = 35;
          arr[i * 3] = (Math.random() - 0.5) * 120;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 120;
        }
      }
      attr.needsUpdate = true;
    }

    // Slowly rotate clouds
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <>
      {/* Anime Twilight Cosmic Sky Dome & Starfield */}
      <color attach="background" args={['#070B1E']} />
      <fog attach="fog" args={['#101535', 55, 180]} />

      {/* Atmospheric Starfield */}
      <Stars
        radius={140}
        depth={60}
        count={graphicsQuality === 'low' ? 1200 : 3500}
        factor={5}
        saturation={0.8}
        fade
        speed={1.2}
      />

      {/* Warm Celestial Moon / Sun Light */}
      <directionalLight
        position={[45, 60, 30]}
        intensity={2.2}
        color="#FDE68A"
        castShadow={graphicsQuality !== 'low'}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
      />

      {/* Purple/Cyan Cosmic Ambient Fill */}
      <ambientLight intensity={0.85} color="#818CF8" />
      <hemisphereLight args={['#38BDF8', '#1E1B4B', 0.65]} />

      {/* Drifting Anime Clouds in the Sky */}
      <group ref={cloudsGroupRef}>
        <primitive object={cloudGltf.scene.clone()} position={[35, 12, 35]} scale={[3.5, 2.5, 3.5]} />
        <primitive object={cloudGltf.scene.clone()} position={[-45, 18, -25]} scale={[4, 2.8, 4]} />
        <primitive object={cloudGltf.scene.clone()} position={[-20, 8, 50]} scale={[3, 2, 3]} />
        <primitive object={cloudGltf.scene.clone()} position={[40, 15, -45]} scale={[4.5, 3, 4.5]} />
        <primitive object={cloudGltf.scene.clone()} position={[0, -10, -55]} scale={[5, 3, 5]} />
      </group>

      {/* Falling Sakura / Cherry Blossom Petals Particles */}
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
