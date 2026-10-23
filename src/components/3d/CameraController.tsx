import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore, realTimePlayer } from '../../store/gameStore';

interface CameraControllerProps {
  initialDistance?: number;
  targetDistance?: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  initialDistance,
  targetDistance,
}) => {
  const initDist = targetDistance ?? initialDistance ?? 7.5;
  const { camera, gl } = useThree();
  const settings = useGameStore((s) => s.settings);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const activePanel = useGameStore((s) => s.activePanel);
  const { rapier, world } = useRapier();

  // Spherical camera angles (target & smoothed)
  const targetYawRef = useRef(0);
  const currentYawRef = useRef(0);
  const targetPitchRef = useRef(0.25);
  const currentPitchRef = useRef(0.25);

  // Zoom distance (target & smoothed)
  const targetDistanceRef = useRef(initDist);
  const currentDistanceRef = useRef(initDist);
  const occludedDistanceRef = useRef(initDist);

  // Dragging & pointer lock states
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Camera lerp vectors
  const currentCamPosRef = useRef(new THREE.Vector3(-11.9, 22, -4));
  const currentLookAtRef = useRef(new THREE.Vector3(-11.9, 17.5, -12.2));

  // Release pointer lock when game is paused or modal panel is opened
  useEffect(() => {
    if (gameStatus !== 'playing' || activePanel !== null) {
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock?.();
      }
    }
  }, [gameStatus, activePanel, gl]);

  // Pointer & mouse event listeners
  useEffect(() => {
    const dom = gl.domElement;

    const sens = settings.mouseSensitivity * 0.003;
    const yMultiplier = settings.invertY ? -1 : 1;

    // Handle click on canvas to request pointer lock for seamless FPS/third-person mouse-look
    const handleCanvasClick = () => {
      const store = useGameStore.getState();
      if (store.gameStatus === 'playing' && store.activePanel === null) {
        if (document.pointerLockElement !== dom) {
          dom.requestPointerLock?.();
        }
      }
    };

    // Handle mouse movement when pointer is locked
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === dom) {
        targetYawRef.current -= e.movementX * sens;
        targetPitchRef.current += e.movementY * sens * yMultiplier;
        targetPitchRef.current = Math.max(0.08, Math.min(1.25, targetPitchRef.current));
      }
    };

    // Handle pointer drag when pointer is unlocked or on touch devices
    const handlePointerDown = (e: PointerEvent) => {
      if (document.pointerLockElement === dom) return;
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      try {
        dom.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for browsers that don't support pointer capture
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (document.pointerLockElement === dom || !isDraggingRef.current) return;

      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      targetYawRef.current -= deltaX * sens * 1.2;
      targetPitchRef.current += deltaY * sens * 1.2 * yMultiplier;
      targetPitchRef.current = Math.max(0.08, Math.min(1.25, targetPitchRef.current));
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDraggingRef.current = false;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // Fallback
      }
    };

    // Handle mouse wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetDistanceRef.current = Math.max(3.2, Math.min(18.0, targetDistanceRef.current + e.deltaY * 0.008));
    };

    dom.addEventListener('click', handleCanvasClick);
    window.addEventListener('mousemove', handleMouseMove);
    dom.addEventListener('pointerdown', handlePointerDown);
    dom.addEventListener('pointermove', handlePointerMove);
    dom.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('pointercancel', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      dom.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('mousemove', handleMouseMove);
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('pointercancel', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
    };
  }, [gl, settings.mouseSensitivity, settings.invertY]);

  useFrame((_, delta) => {
    // Read real-time player position on every frame (eliminates position lag & frame drops)
    const playerPos = realTimePlayer.position;
    const targetLookAt = new THREE.Vector3(playerPos.x, playerPos.y + 1.2, playerPos.z);

    // Smoothly interpolate angles and zoom distance
    const angleLerp = Math.min(1, delta * 18);
    currentYawRef.current = THREE.MathUtils.lerp(currentYawRef.current, targetYawRef.current, angleLerp);
    currentPitchRef.current = THREE.MathUtils.lerp(currentPitchRef.current, targetPitchRef.current, angleLerp);

    const distLerp = Math.min(1, delta * 10);
    currentDistanceRef.current = THREE.MathUtils.lerp(currentDistanceRef.current, targetDistanceRef.current, distLerp);

    // Calculate spherical camera offset
    const pitch = currentPitchRef.current;
    const yaw = currentYawRef.current;

    const horizontalDist = Math.cos(pitch);
    const verticalDist = Math.sin(pitch);

    const camDirX = horizontalDist * Math.sin(yaw);
    const camDirY = verticalDist;
    const camDirZ = horizontalDist * Math.cos(yaw);

    const camDir = new THREE.Vector3(camDirX, camDirY, camDirZ).normalize();

    // Camera Occlusion Avoidance Raycast:
    // Probe starts outside player avatar (0.85m offset) to prevent self-collision
    const rayStartOffset = 0.85;
    const maxCastDistance = Math.max(0.1, currentDistanceRef.current - rayStartOffset);

    let targetSafeDist = currentDistanceRef.current;
    if (pitch > 0.08 && maxCastDistance > 0.3) {
      const rayOrigin = {
        x: targetLookAt.x + camDir.x * rayStartOffset,
        y: targetLookAt.y + camDir.y * rayStartOffset,
        z: targetLookAt.z + camDir.z * rayStartOffset,
      };
      const rayDirection = { x: camDir.x, y: camDir.y, z: camDir.z };
      const camRay = new rapier.Ray(rayOrigin, rayDirection);
      const hit = world.castRay(camRay, maxCastDistance, true);

      if (hit && hit.timeOfImpact < maxCastDistance) {
        targetSafeDist = Math.max(2.8, rayStartOffset + hit.timeOfImpact - 0.35);
      }
    }

    // Smoothly interpolate occluded distance to eliminate sudden 1-frame distance jumps/flickering
    occludedDistanceRef.current = THREE.MathUtils.lerp(
      occludedDistanceRef.current,
      targetSafeDist,
      Math.min(1, delta * 14)
    );

    const activeDistance = occludedDistanceRef.current;
    const desiredX = targetLookAt.x + camDir.x * activeDistance;
    const desiredY = targetLookAt.y + camDir.y * activeDistance;
    const desiredZ = targetLookAt.z + camDir.z * activeDistance;

    const desiredPos = new THREE.Vector3(desiredX, desiredY, desiredZ);

    // Synchronized smooth camera tracking
    currentCamPosRef.current.lerp(desiredPos, Math.min(1, delta * 16));
    currentLookAtRef.current.lerp(targetLookAt, Math.min(1, delta * 16));

    camera.position.copy(currentCamPosRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
};
