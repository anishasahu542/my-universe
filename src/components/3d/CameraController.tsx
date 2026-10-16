import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

interface CameraControllerProps {
  targetDistance?: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({ targetDistance = 6.5 }) => {
  const { camera, gl } = useThree();
  const settings = useGameStore((s) => s.settings);

  // Spherical camera angles
  const yawRef = useRef(0); // Horizontal angle in radians
  const pitchRef = useRef(0.25); // Vertical angle in radians (slight top-down view)
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Camera lerp target
  const currentCamPosRef = useRef(new THREE.Vector3(-11.9, 22, -4));
  const currentLookAtRef = useRef(new THREE.Vector3(-11.9, 17.5, -12.2));

  useEffect(() => {
    const dom = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      // Allow drag with primary or secondary mouse button
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      const sens = settings.mouseSensitivity * 0.004;
      const yMultiplier = settings.invertY ? -1 : 1;

      yawRef.current -= deltaX * sens;
      pitchRef.current += deltaY * sens * yMultiplier;

      // Clamp vertical pitch (-10 deg to 75 deg)
      pitchRef.current = Math.max(-0.15, Math.min(1.3, pitchRef.current));
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, settings.mouseSensitivity, settings.invertY]);

  useFrame((_, delta) => {
    const store = useGameStore.getState();
    const [px, py, pz] = store.playerCoords;

    const targetLookAt = new THREE.Vector3(px, py + 1.2, pz);

    // Calculate desired camera position on sphere around target
    const distance = targetDistance;
    const horizontalDist = distance * Math.cos(pitchRef.current);
    const verticalDist = distance * Math.sin(pitchRef.current);

    const desiredX = px + horizontalDist * Math.sin(yawRef.current);
    const desiredY = py + 1.2 + verticalDist;
    const desiredZ = pz + horizontalDist * Math.cos(yawRef.current);

    const desiredPos = new THREE.Vector3(desiredX, desiredY, desiredZ);

    // Smoothly lerp camera position and lookAt target
    currentCamPosRef.current.lerp(desiredPos, delta * 9);
    currentLookAtRef.current.lerp(targetLookAt, delta * 12);

    camera.position.copy(currentCamPosRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
};
