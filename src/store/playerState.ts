import * as THREE from 'three';

export interface PlayerState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  speed: number;
}

export const playerState: PlayerState = {
  position: new THREE.Vector3(0, 3.6, 2.0),
  velocity: new THREE.Vector3(0, 0, 0),
  speed: 0,
};
