import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useGameStore } from '../../store/gameStore';

interface PlayerControllerProps {
  initialPosition?: [number, number, number];
}

const DEFAULT_SPAWN: [number, number, number] = [-11.9, 16.5, -12.2];

export const PlayerController: React.FC<PlayerControllerProps> = ({ initialPosition = DEFAULT_SPAWN }) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.PointLight>(null);
  const keysRef = useKeyboardControls();
  const { camera } = useThree();

  // Internal state tracking
  const canJumpRef = useRef(true);
  const frameCountRef = useRef(0);
  const targetRotationYRef = useRef(0);

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    const store = useGameStore.getState();
    if (store.gameStatus !== 'playing') {
      // If paused or in panel, damp velocity to zero
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Combine keyboard keys with mobile touch buttons
    const forward = keysRef.current.forward || store.controls.forward;
    const backward = keysRef.current.backward || store.controls.backward;
    const left = keysRef.current.left || store.controls.left;
    const right = keysRef.current.right || store.controls.right;
    const jump = keysRef.current.jump || store.controls.jump;
    const sprint = keysRef.current.sprint || store.controls.sprint;

    // Movement direction in local space
    let inputX = 0;
    let inputZ = 0;

    if (forward) inputZ -= 1;
    if (backward) inputZ += 1;
    if (left) inputX -= 1;
    if (right) inputX += 1;

    const inputLength = Math.hypot(inputX, inputZ);
    if (inputLength > 0.001) {
      inputX /= inputLength;
      inputZ /= inputLength;
    }

    // Camera yaw calculation so W is always forward relative to camera view
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const cameraYaw = Math.atan2(cameraDirection.x, cameraDirection.z);

    // Rotate movement vector by camera yaw
    const sin = Math.sin(cameraYaw);
    const cos = Math.cos(cameraYaw);

    const worldMoveX = inputX * cos + inputZ * sin;
    const worldMoveZ = -inputX * sin + inputZ * cos;

    // Speed calculation - tuned for exploring the full space kit model
    const baseSpeed = 10.0;
    const speedMultiplier = sprint ? 2.0 : 1.0;
    const targetSpeed = inputLength > 0 ? baseSpeed * speedMultiplier : 0;

    const currentVel = rigidBodyRef.current.linvel();
    const vx = worldMoveX * targetSpeed;
    const vz = worldMoveZ * targetSpeed;

    // Low-gravity jetpack / vertical thrusters
    let vy = currentVel.y;
    const isNearGround = Math.abs(currentVel.y) < 0.8;

    if (jump && isNearGround && canJumpRef.current) {
      vy = 8.5;
      canJumpRef.current = false;
      setTimeout(() => {
        canJumpRef.current = true;
      }, 280);
    }

    rigidBodyRef.current.setLinvel({ x: vx, y: vy, z: vz }, true);

    // Void boundary failsafe: if player falls off the planetary structures, respawn to command deck
    const pos = rigidBodyRef.current.translation();
    if (pos.y < -65) {
      rigidBodyRef.current.setTranslation({ x: DEFAULT_SPAWN[0], y: DEFAULT_SPAWN[1], z: DEFAULT_SPAWN[2] }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Visual avatar rotation smoothing towards movement
    if (visualRef.current) {
      if (inputLength > 0.01) {
        targetRotationYRef.current = Math.atan2(worldMoveX, worldMoveZ);
        // Thruster glow intensifies during movement
        if (thrusterRef.current) {
          thrusterRef.current.intensity = sprint ? 5.0 : 3.0;
        }
      } else {
        if (thrusterRef.current) {
          thrusterRef.current.intensity = 1.0;
        }
      }

      // Smooth turn
      visualRef.current.rotation.y = THREE.MathUtils.lerp(
        visualRef.current.rotation.y,
        targetRotationYRef.current,
        delta * 12
      );

      // Subtle hover float bobbing
      visualRef.current.position.y = Math.sin(Date.now() * 0.006) * 0.08;
    }

    // Telemetry updates to store every 6 frames to prevent React re-renders
    frameCountRef.current++;
    if (frameCountRef.current % 6 === 0) {
      const horizSpeed = Math.hypot(vx, vz);
      store.updateTelemetry([pos.x, pos.y, pos.z], Number(horizSpeed.toFixed(1)));
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={initialPosition}
      enabledRotations={[false, false, false]}
      mass={1}
      linearDamping={2.0}
      name="player-rigidbody"
    >
      <CapsuleCollider args={[0.5, 0.4]} position={[0, 0.9, 0]} />

      {/* Visual Avatar: Anime Space Explorer Probe / Starcraft */}
      <group ref={visualRef} position={[0, 0.9, 0]}>
        {/* Core Cockpit Pod */}
        <mesh castShadow>
          <sphereGeometry args={[0.42, 32, 16]} />
          <meshStandardMaterial
            color="#0E172A"
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Visor / Neon anime glass cockpit */}
        <mesh position={[0, 0.08, 0.28]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.45, 0.22, 0.2]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
        </mesh>

        {/* Dual Stabilizer Wings */}
        <mesh position={[0.45, -0.05, -0.1]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.45, 0.06, 0.25]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.45, -0.05, -0.1]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.45, 0.06, 0.25]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Floating Magnetic Halo Ring */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#A855F7"
            emissive="#A855F7"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Dual Ion Thrusters */}
        <mesh position={[0.2, -0.05, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.2, -0.05, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Thruster Flame Glow */}
        <pointLight
          ref={thrusterRef}
          position={[0, -0.05, -0.55]}
          color="#00F0FF"
          intensity={1.5}
          distance={4}
          decay={2}
        />
      </group>
    </RigidBody>
  );
};
