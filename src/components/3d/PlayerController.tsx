import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useGameStore } from '../../store/gameStore';
import { playerState } from '../../store/playerState';

interface PlayerControllerProps {
  initialPosition?: [number, number, number];
}

const DEFAULT_SPAWN: [number, number, number] = [0, 3.6, 2.0];

export const PlayerController: React.FC<PlayerControllerProps> = ({
  initialPosition = DEFAULT_SPAWN,
}) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const thrusterGlowRef = useRef<THREE.PointLight>(null);

  // Limb refs for procedural stride animation
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const jetpackLeftRef = useRef<THREE.Mesh>(null);
  const jetpackRightRef = useRef<THREE.Mesh>(null);

  const keysRef = useKeyboardControls();
  const { camera } = useThree();
  const { rapier, world } = useRapier();

  // Internal state tracking
  const frameCountRef = useRef(0);
  const targetRotationYRef = useRef(0);
  const stridePhaseRef = useRef(0);

  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    const store = useGameStore.getState();
    if (store.gameStatus !== 'playing') {
      // If paused or modal active, stop linear motion
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Input collection: keyboard + mobile touch controls
    const forward = keysRef.current.forward || store.controls.forward;
    const backward = keysRef.current.backward || store.controls.backward;
    const left = keysRef.current.left || store.controls.left;
    const right = keysRef.current.right || store.controls.right;
    const jump = keysRef.current.jump || store.controls.jump;
    const sprint = keysRef.current.sprint || store.controls.sprint;

    // 1. Camera-Relative Direction vectors on horizontal XZ plane
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    if (camForward.lengthSq() > 0.0001) {
      camForward.normalize();
    } else {
      camForward.set(0, 0, -1);
    }

    const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    // Compute intended input direction
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

    // 2. Downward Ground Detection Raycast
    const groundRayOrigin = { x: pos.x, y: pos.y + 0.9, z: pos.z };
    const groundRayDir = { x: 0, y: -1, z: 0 };
    const groundRay = new rapier.Ray(groundRayOrigin, groundRayDir);
    const groundHit = world.castRay(
      groundRay,
      1.35,
      true,
      undefined,
      undefined,
      undefined,
      rigidBodyRef.current
    );

    const isGrounded = groundHit !== null && groundHit.timeOfImpact <= 1.35;

    // 3. Smooth Velocity Acceleration & Control
    const baseSpeed = 8.5;
    const speedMultiplier = sprint ? 1.6 : 1.0;
    const targetSpeed = isMoving ? baseSpeed * speedMultiplier : 0;

    const targetVx = moveDir.x * targetSpeed;
    const targetVz = moveDir.z * targetSpeed;

    const accel = isMoving ? 22.0 : 25.0;
    const newVx = THREE.MathUtils.lerp(currentVel.x, targetVx, Math.min(1, delta * accel));
    const newVz = THREE.MathUtils.lerp(currentVel.z, targetVz, Math.min(1, delta * accel));

    // 4. Adventurer Jump & Jetpack Glide
    let vy = currentVel.y;
    if (jump) {
      if (isGrounded) {
        vy = 8.2; // Initial jump burst
      } else {
        vy = Math.min(8.8, vy + delta * 24.0); // Jetpack flight ascent
      }
    } else {
      // Gentle air braking / anti-gravity descent stabilizer
      if (vy < -12.0) {
        vy = THREE.MathUtils.lerp(vy, -12.0, Math.min(1, delta * 6));
      }
    }

    // Apply linear velocity to physics body
    rigidBodyRef.current.setLinvel({ x: newVx, y: vy, z: newVz }, true);

    // 5. Void Catchment Failsafe: return to central plaza if fallen off
    if (pos.y < -40) {
      rigidBodyRef.current.setTranslation({ x: DEFAULT_SPAWN[0], y: DEFAULT_SPAWN[1], z: DEFAULT_SPAWN[2] }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // 6. Visual Avatar Dynamics & Procedural Animation
    if (visualRef.current) {
      // Yaw heading: character smoothly faces move direction
      if (isMoving) {
        targetRotationYRef.current = Math.atan2(moveDir.x, moveDir.z);
      }

      // Shortest-arc angle normalization
      let diffY = targetRotationYRef.current - visualRef.current.rotation.y;
      while (diffY < -Math.PI) diffY += Math.PI * 2;
      while (diffY > Math.PI) diffY -= Math.PI * 2;
      visualRef.current.rotation.y += diffY * Math.min(1, delta * 15);

      // Stride animation phase
      if (isMoving && isGrounded) {
        const strideSpeed = sprint ? 16.0 : 10.0;
        stridePhaseRef.current += delta * strideSpeed;
      } else {
        stridePhaseRef.current = THREE.MathUtils.lerp(stridePhaseRef.current, 0, delta * 8);
      }

      const legSwing = Math.sin(stridePhaseRef.current) * (isMoving ? 0.65 : 0.0);
      const armSwing = Math.sin(stridePhaseRef.current) * (isMoving ? 0.55 : 0.0);

      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = isGrounded ? legSwing : -0.3;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = isGrounded ? -legSwing : -0.3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = isGrounded ? -armSwing : 0.4;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = isGrounded ? armSwing : 0.4;
      }

      // Torso tilt while moving / flying
      const pitchTilt = jump ? -0.2 : isMoving ? 0.12 : 0;
      visualRef.current.rotation.x = THREE.MathUtils.lerp(visualRef.current.rotation.x, pitchTilt, Math.min(1, delta * 10));

      // Thruster exhaust scaling
      const isJetting = jump || (!isGrounded && vy > -2);
      const jetScale = isJetting ? (sprint ? 1.6 : 1.2) : 0.2;
      if (jetpackLeftRef.current && jetpackRightRef.current) {
        jetpackLeftRef.current.scale.set(jetScale, jetScale * 1.5, jetScale);
        jetpackRightRef.current.scale.set(jetScale, jetScale * 1.5, jetScale);
      }

      if (thrusterGlowRef.current) {
        thrusterGlowRef.current.intensity = isJetting ? 4.0 : 0.5;
      }
    }

    // 7. Update real-time 60 FPS playerState for camera tracking
    playerState.position.set(pos.x, pos.y, pos.z);
    playerState.velocity.set(newVx, vy, newVz);
    playerState.speed = Math.hypot(newVx, newVz);

    // Throttle DOM state updates to ~4 Hz (every 15 frames)
    frameCountRef.current++;
    if (frameCountRef.current % 15 === 0) {
      store.updateTelemetry([pos.x, pos.y, pos.z], Number(playerState.speed.toFixed(1)));
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
      angularDamping={1.0}
      ccd={true}
      name="player-rigidbody"
    >
      <CapsuleCollider args={[0.65, 0.4]} position={[0, 1.05, 0]} friction={0.0} restitution={0.0} />

      {/* Visual Adventurer Avatar */}
      <group ref={visualRef} position={[0, 0.4, 0]}>
        {/* Torso & Cyber Jacket */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.5, 0.55, 0.3]} />
          <meshStandardMaterial color="#0F172A" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Anime Jacket Collar / Neon Accent */}
        <mesh position={[0, 0.95, 0.08]}>
          <boxGeometry args={[0.42, 0.08, 0.22]} />
          <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={2.0} />
        </mesh>

        {/* Cyber Belt with Glowing Buckle */}
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[0.52, 0.08, 0.32]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.46, 0.17]}>
          <boxGeometry args={[0.12, 0.08, 0.04]} />
          <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3.0} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#FED7AA" roughness={0.6} />
        </mesh>

        {/* Stylish Anime Hair */}
        <mesh position={[0, 1.35, -0.04]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#1E1B4B" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.38, 0.12]} rotation={[-0.4, 0, 0]}>
          <coneGeometry args={[0.18, 0.3, 8]} />
          <meshStandardMaterial color="#1E1B4B" roughness={0.5} />
        </mesh>

        {/* Cyber Visor / Goggles */}
        <mesh position={[0, 1.26, 0.18]}>
          <boxGeometry args={[0.3, 0.1, 0.12]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={3.0}
            roughness={0.1}
          />
        </mesh>

        {/* Cyber Jetpack Backpack */}
        <mesh position={[0, 0.74, -0.22]} castShadow>
          <boxGeometry args={[0.34, 0.42, 0.16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Jetpack Thruster Nozzles */}
        <mesh position={[-0.12, 0.48, -0.22]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.14, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>
        <mesh position={[0.12, 0.48, -0.22]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.14, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>

        {/* Dynamic Jetpack Exhaust Flames */}
        <mesh ref={jetpackLeftRef} position={[-0.12, 0.36, -0.22]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.28, 12]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} />
        </mesh>
        <mesh ref={jetpackRightRef} position={[0.12, 0.36, -0.22]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.28, 12]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} />
        </mesh>

        {/* Jetpack Thruster Glow Light */}
        <pointLight
          ref={thrusterGlowRef}
          position={[0, 0.4, -0.3]}
          color="#00F0FF"
          intensity={1.0}
          distance={4}
          decay={2}
        />

        {/* Arms */}
        <group ref={leftArmRef} position={[-0.34, 0.88, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.44, 8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#FED7AA" />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.34, 0.88, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.44, 8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#FED7AA" />
          </mesh>
        </group>

        {/* Legs */}
        <group ref={leftLegRef} position={[-0.16, 0.42, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.07, 0.48, 8]} />
            <meshStandardMaterial color="#0284C7" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.48, 0.04]} castShadow>
            <boxGeometry args={[0.12, 0.1, 0.22]} />
            <meshStandardMaterial color="#0F172A" metalness={0.7} />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.16, 0.42, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.07, 0.48, 8]} />
            <meshStandardMaterial color="#0284C7" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.48, 0.04]} castShadow>
            <boxGeometry args={[0.12, 0.1, 0.22]} />
            <meshStandardMaterial color="#0F172A" metalness={0.7} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
};
