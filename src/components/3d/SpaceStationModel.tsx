import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

const MODEL_PATH = `${import.meta.env.BASE_URL}models/ultimate_space_kit.glb`;

export const SpaceStationModel: React.FC = () => {
  const { scene } = useGLTF(MODEL_PATH);
  const graphicsQuality = useGameStore((s) => s.settings.graphicsQuality);

  // Clone and optimize materials for anime sci-fi aesthetics
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Compute bounding box to know exact extents
    const bbox = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bbox.getCenter(center);
    bbox.getSize(size);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = graphicsQuality !== 'low';
        mesh.receiveShadow = graphicsQuality !== 'low';

        // Enhance material vibrancy for anime space look
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.roughness = 0.35;
          mat.metalness = 0.25;
          mesh.material = mat;
        }
      }
    });

    return clone;
  }, [scene, graphicsQuality]);

  return (
    <group position={[0, -2, -10]} scale={[0.15, 0.15, 0.15]}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload the model asset
useGLTF.preload(MODEL_PATH);
