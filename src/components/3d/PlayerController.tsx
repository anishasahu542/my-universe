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
  const exhaustLeftRef = useRef<THREE.Mesh>(null);
  const exhaustRightRef = useRef<THREE.Mesh>(null);
  const keysRef = useKeyboardControls();
  const { camera } = useThree();
  const { rapier, world } = useRapier();

  // Internal state tracking
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
    // Distance to bottom contact point is 0.95m
    const groundRayOrigin = { x: pos.x, y: pos.y + 0.9, z: pos.z };
    const groundRayDir = { x: 0, y: -1, z: 0 };
    const groundRay = new rapier.Ray(groundRayOrigin, groundRayDir);
    const groundHit = world.castRay(
      groundRay,
      1.18, // Max ray length to detect floor right under spaceship
      true,
      undefined,
      undefined,
      undefined,
      rigidBodyRef.current
    );

    const isGrounded = groundHit !== null && groundHit.timeOfImpact <= 1.18;

    // 3. Wall Deflection & Sliding via Forward Raycast
    // Prevents pushing into thin trimesh walls by deflecting velocity along surface tangent
    const effectiveMoveDir = moveDir.clone();
    if (isMoving) {
      const wallRayOrigin = { x: pos.x, y: pos.y + 0.7, z: pos.z };
      const wallRayDir = { x: moveDir.x, y: 0, z: moveDir.z };
      const wallRay = new rapier.Ray(wallRayOrigin, wallRayDir);
      const wallHit = world.castRayAndGetNormal(
        wallRay,
        0.8, // Spaceship radius + probe distance
        true,
        undefined,
        undefined,
        undefined,
        rigidBodyRef.current
      );

      if (wallHit && wallHit.timeOfImpact < 0.8) {
        const wallNormal = new THREE.Vector3(wallHit.normal.x, wallHit.normal.y, wallHit.normal.z);
        // Only deflect against steep obstacles/walls (normal.y < 0.7)
        if (Math.abs(wallNormal.y) < 0.7) {
          const dot = effectiveMoveDir.dot(wallNormal);
          if (dot < 0) {
            // Deflect velocity away from wall into tangent plane
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

    // 4. Spaceship Cruise & Boost Speed
    const baseSpeed = 9.5;
    const speedMultiplier = sprint ? 1.65 : 1.0;
    const targetSpeed = isMoving ? baseSpeed * speedMultiplier : 0;

    const targetVx = effectiveMoveDir.x * targetSpeed;
    const targetVz = effectiveMoveDir.z * targetSpeed;

    const accel = isMoving ? 20.0 : 25.0;
    const newVx = THREE.MathUtils.lerp(currentVel.x, targetVx, Math.min(1, delta * accel));
    const newVz = THREE.MathUtils.lerp(currentVel.z, targetVz, Math.min(1, delta * accel));

    // 5. Starship Ion Thruster Lift & Anti-Gravity Hover (Flight Dynamics)
    let vy = currentVel.y;
    if (jump) {
      // Spacebar engages continuous anti-gravity ion thruster ascent
      if (isGrounded) {
        vy = 8.5; // Initial lift burst
      } else {
        vy = Math.min(10.0, vy + delta * 26.0); // Continuous flight climb
      }
    } else {
      if (isGrounded) {
        // Firm hover footing against the deck surface
        if (vy > -1.0 && vy < 0.5) {
          vy = -0.5;
        }
      } else {
        // Anti-gravity descent stabilizer: smooth terminal hover glide speed
        if (vy < -9.0) {
          vy = THREE.MathUtils.lerp(vy, -9.0, Math.min(1, delta * 6));
        }
      }
    }

    rigidBodyRef.current.setLinvel({ x: newVx, y: vy, z: newVz }, true);

    // 6. Void boundary failsafe: if spaceship falls off the planetary structures, warp safely back
    if (pos.y < -55) {
      rigidBodyRef.current.setTranslation({ x: DEFAULT_SPAWN[0], y: DEFAULT_SPAWN[1], z: DEFAULT_SPAWN[2] }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      realTimePlayer.position.set(DEFAULT_SPAWN[0], DEFAULT_SPAWN[1], DEFAULT_SPAWN[2]);
      realTimePlayer.velocity.set(0, 0, 0);
      realTimePlayer.speed = 0;
    }

    // 7. Visual Starship Dynamics: Shortest-arc Yaw, Roll Banking & Pitch Tilt
    if (visualRef.current) {
      // Yaw Heading: update target heading when moving
      if (isMoving && effectiveMoveDir.lengthSq() > 0.001) {
        targetRotationYRef.current = Math.atan2(effectiveMoveDir.x, effectiveMoveDir.z);
      }

      // Shortest-arc angle normalization: eliminates 360-degree wild spin
      let diffY = targetRotationYRef.current - visualRef.current.rotation.y;
      while (diffY < -Math.PI) diffY += Math.PI * 2;
      while (diffY > Math.PI) diffY -= Math.PI * 2;
      visualRef.current.rotation.y += diffY * Math.min(1, delta * 14);

      // Roll Banking: tilt ship wings gracefully when strafing or turning
      let targetRoll = 0;
      if (left) targetRoll += 0.32;
      if (right) targetRoll -= 0.32;
      if (isMoving && Math.abs(diffY) > 0.05) {
        targetRoll += Math.max(-0.35, Math.min(0.35, diffY * 0.7));
      }
      visualRef.current.rotation.z = THREE.MathUtils.lerp(
        visualRef.current.rotation.z,
        targetRoll,
        Math.min(1, delta * 10)
      );

      // Pitch Tilt: nose pitches down during forward cruise, rises during climb or reverse
      let targetPitch = 0;
      if (forward) targetPitch -= 0.12;
      if (backward) targetPitch += 0.16;
      if (jump) targetPitch += 0.22;
      visualRef.current.rotation.x = THREE.MathUtils.lerp(
        visualRef.current.rotation.x,
        targetPitch,
        Math.min(1, delta * 8)
      );

      // Anti-gravity floating hover bob
      visualRef.current.position.y = 0.95 + Math.sin(Date.now() * 0.005) * 0.07;

      // Dynamic ion thruster exhaust glow & scaling
      const isThrusting = isMoving || jump;
      const targetIntensity = sprint ? 6.0 : isThrusting ? 3.8 : 1.2;
      if (thrusterRef.current) {
        thrusterRef.current.intensity = THREE.MathUtils.lerp(
          thrusterRef.current.intensity,
          targetIntensity,
          Math.min(1, delta * 15)
        );
      }

      const exhaustScale = sprint ? 1.5 : isThrusting ? 1.15 : 0.6;
      if (exhaustLeftRef.current && exhaustRightRef.current) {
        exhaustLeftRef.current.scale.set(exhaustScale, exhaustScale * 1.3, exhaustScale);
        exhaustRightRef.current.scale.set(exhaustScale, exhaustScale * 1.3, exhaustScale);
      }
    }

    // 8. Real-time position tracking for CameraController and InteractionSystem (zero latency, zero jitter)
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
      linearDamping={1.6}
      angularDamping={1.0}
      ccd={true}
      name="player-rigidbody"
    >
      <CapsuleCollider args={[0.45, 0.55]} position={[0, 0.95, 0]} friction={0.0} restitution={0.0} />

      {/* Visual Starship Avatar: Sleek Anime Sci-Fi Fighter */}
      <group ref={visualRef} position={[0, 0.95, 0]}>
        {/* Aerodynamic Needle Nose & Forward Hull */}
        <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.3, 0.9, 16]} />
          <meshStandardMaterial color="#0E172A" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Central Fuselage Body */}
        <mesh position={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.55, 0.28, 0.7]} />
          <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Neon Anime Cockpit Canopy Glass */}
        <mesh position={[0, 0.15, 0.12]} rotation={[0.25, 0, 0]}>
          <boxGeometry args={[0.3, 0.16, 0.45]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={2.2}
            roughness={0.05}
          />
        </mesh>

        {/* Swept Delta Wings (Port & Starboard) */}
        <mesh position={[0.62, -0.02, -0.12]} rotation={[0, -0.28, -0.12]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.42]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[-0.62, -0.02, -0.12]} rotation={[0, 0.28, 0.12]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.42]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Glowing Wingtip Neon Stabilizers */}
        <mesh position={[1.02, 0.02, -0.12]}>
          <boxGeometry args={[0.04, 0.14, 0.38]} />
          <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[-1.02, 0.02, -0.12]}>
          <boxGeometry args={[0.04, 0.14, 0.38]} />
          <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2.5} />
        </mesh>

        {/* Dorsal Vertical Tail Stabilizer Fin */}
        <mesh position={[0, 0.28, -0.32]} rotation={[-0.32, 0, 0]}>
          <boxGeometry args={[0.05, 0.35, 0.38]} />
          <meshStandardMaterial color="#38BDF8" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Floating Anti-Gravity Magnetic Induction Halo */}
        <mesh position={[0, 0.22, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.025, 16, 32]} />
          <meshStandardMaterial
            color="#A855F7"
            emissive="#A855F7"
            emissiveIntensity={2.2}
          />
        </mesh>

        {/* Dual Wing Blaster Cannons */}
        <mesh position={[0.45, -0.04, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.45, -0.04, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Dual Heavy Ion Thruster Nozzles */}
        <mesh position={[0.2, -0.02, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.13, 0.22, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[-0.2, -0.02, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.13, 0.22, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Animated Ion Plasma Exhaust Flames */}
        <mesh ref={exhaustLeftRef} position={[0.2, -0.02, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.32, 16]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} />
        </mesh>
        <mesh ref={exhaustRightRef} position={[-0.2, -0.02, -0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.32, 16]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} />
        </mesh>

        {/* Thruster Dynamic Glow */}
        <pointLight
          ref={thrusterRef}
          position={[0, 0, -0.75]}
          color="#00F0FF"
          intensity={2.0}
          distance={6}
          decay={2}
        />
      </group>
    </RigidBody>
  );
};
