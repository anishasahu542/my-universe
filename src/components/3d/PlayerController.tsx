import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useGameStore, realTimePlayer } from '../../store/gameStore';

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
  const { rapier, world } = useRapier();

  // Internal state tracking
  const canJumpRef = useRef(true);
  const frameCountRef = useRef(0);
  const targetRotationYRef = useRef(0);

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    const store = useGameStore.getState();
    if (store.gameStatus !== 'playing') {
      // If paused or in modal, damp velocity to zero
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

    // 1. Precise Camera-Relative Forward & Right vectors on horizontal XZ plane
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    if (camForward.lengthSq() > 0.0001) {
      camForward.normalize();
    } else {
      camForward.set(0, 0, -1);
    }

    const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    // Compute intended input movement direction
    const moveDir = new THREE.Vector3();
    if (forward) moveDir.add(camForward);
    if (backward) moveDir.sub(camForward);
    if (right) moveDir.add(camRight);
    if (left) moveDir.sub(camRight);

    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) {
      moveDir.normalize();
    }

    const pos = rigidBodyRef.current.translation();
    const currentVel = rigidBodyRef.current.linvel();

    // 2. Continuous Ground Detection via Downward Raycast
    // Capsule center is at pos.y + 1.0; distance to bottom foot is 1.0m
    const groundRayOrigin = { x: pos.x, y: pos.y + 0.9, z: pos.z };
    const groundRayDir = { x: 0, y: -1, z: 0 };
    const groundRay = new rapier.Ray(groundRayOrigin, groundRayDir);
    const groundHit = world.castRay(
      groundRay,
      1.18, // Max ray length to detect floor right under capsule
      true,
      undefined,
      undefined,
      undefined,
      rigidBodyRef.current
    );

    const isGrounded = groundHit !== null && groundHit.timeOfImpact <= 1.18;

    // 3. Wall Deflection & Sliding via Forward Raycast
    // Prevents clipping through thin trimesh walls by deflecting velocity along surface tangent
    const effectiveMoveDir = moveDir.clone();
    if (isMoving) {
      const wallRayOrigin = { x: pos.x, y: pos.y + 0.7, z: pos.z };
      const wallRayDir = { x: moveDir.x, y: 0, z: moveDir.z };
      const wallRay = new rapier.Ray(wallRayOrigin, wallRayDir);
      const wallHit = world.castRayAndGetNormal(
        wallRay,
        0.75, // Capsule radius 0.45m + 0.3m probe distance
        true,
        undefined,
        undefined,
        undefined,
        rigidBodyRef.current
      );

      if (wallHit && wallHit.timeOfImpact < 0.75) {
        const wallNormal = new THREE.Vector3(wallHit.normal.x, wallHit.normal.y, wallHit.normal.z);
        // Only deflect against steep obstacles/walls (normal.y < 0.7)
        if (Math.abs(wallNormal.y) < 0.7) {
          const dot = effectiveMoveDir.dot(wallNormal);
          if (dot < 0) {
            // Subtract velocity component moving directly into the obstacle
            effectiveMoveDir.sub(wallNormal.clone().multiplyScalar(dot));
            if (effectiveMoveDir.lengthSq() > 0.0001) {
              effectiveMoveDir.normalize();
            } else {
              effectiveMoveDir.set(0, 0, 0);
            }
          }
        }
      }
    }

    // 4. Smooth Velocity Acceleration & Control
    const baseSpeed = 8.5;
    const speedMultiplier = sprint ? 1.5 : 1.0;
    const targetSpeed = isMoving ? baseSpeed * speedMultiplier : 0;

    const targetVx = effectiveMoveDir.x * targetSpeed;
    const targetVz = effectiveMoveDir.z * targetSpeed;

    const accel = isMoving ? 18.0 : 25.0;
    const newVx = THREE.MathUtils.lerp(currentVel.x, targetVx, Math.min(1, delta * accel));
    const newVz = THREE.MathUtils.lerp(currentVel.z, targetVz, Math.min(1, delta * accel));

    // 5. Vertical Jump & Gravity Thruster
    let vy = currentVel.y;
    if (jump && isGrounded && canJumpRef.current) {
      vy = 7.5;
      canJumpRef.current = false;
      setTimeout(() => {
        canJumpRef.current = true;
      }, 300);
    }

    rigidBodyRef.current.setLinvel({ x: newVx, y: vy, z: newVz }, true);

    // 6. Void boundary failsafe: if player falls off the planetary structures, respawn safely
    if (pos.y < -55) {
      rigidBodyRef.current.setTranslation({ x: DEFAULT_SPAWN[0], y: DEFAULT_SPAWN[1], z: DEFAULT_SPAWN[2] }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      realTimePlayer.position.set(DEFAULT_SPAWN[0], DEFAULT_SPAWN[1], DEFAULT_SPAWN[2]);
      realTimePlayer.velocity.set(0, 0, 0);
      realTimePlayer.speed = 0;
    }

    // 7. Visual Avatar Turn Smoothing & Thruster Glow
    if (visualRef.current) {
      if (isMoving && effectiveMoveDir.lengthSq() > 0.001) {
        targetRotationYRef.current = Math.atan2(effectiveMoveDir.x, effectiveMoveDir.z);
        if (thrusterRef.current) {
          thrusterRef.current.intensity = sprint ? 5.0 : 3.0;
        }
      } else {
        if (thrusterRef.current) {
          thrusterRef.current.intensity = 1.0;
        }
      }

      // Smooth turning towards movement heading
      visualRef.current.rotation.y = THREE.MathUtils.lerp(
        visualRef.current.rotation.y,
        targetRotationYRef.current,
        Math.min(1, delta * 12)
      );

      // Subtle float bobbing
      visualRef.current.position.y = 1.0 + Math.sin(Date.now() * 0.005) * 0.06;
    }

    // Real-time position tracking for CameraController and InteractionSystem (zero latency, zero jitter)
    const horizSpeed = Math.hypot(newVx, newVz);
    realTimePlayer.position.set(pos.x, pos.y, pos.z);
    realTimePlayer.velocity.set(newVx, vy, newVz);
    realTimePlayer.speed = horizSpeed;

    // Throttle React Zustand telemetry to 4Hz (every 15 frames) to eliminate UI thread re-render stutter
    frameCountRef.current++;
    if (frameCountRef.current % 15 === 0) {
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
      linearDamping={1.5}
      angularDamping={1.0}
      ccd={true}
      name="player-rigidbody"
    >
      <CapsuleCollider args={[0.55, 0.45]} position={[0, 1.0, 0]} friction={0.0} restitution={0.0} />

      {/* Visual Avatar: Anime Space Explorer Probe */}
      <group ref={visualRef} position={[0, 1.0, 0]}>
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
