import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export interface KeysState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  interact: boolean;
  sprint: boolean;
}

export function useKeyboardControls() {
  const keysRef = useRef<KeysState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    interact: false,
    sprint: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const store = useGameStore.getState();

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = true;
          break;
        case 'Space':
          keysRef.current.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.sprint = true;
          break;
        case 'KeyE':
          keysRef.current.interact = true;
          if (store.gameStatus === 'playing') {
            store.triggerCurrentInteraction();
          }
          break;
        case 'Escape':
          if (store.activePanel !== null) {
            store.closePanel();
          } else if (store.gameStatus === 'playing') {
            store.pauseGame();
          } else if (store.gameStatus === 'paused') {
            store.resumeGame();
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysRef.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysRef.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysRef.current.right = false;
          break;
        case 'Space':
          keysRef.current.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysRef.current.sprint = false;
          break;
        case 'KeyE':
          keysRef.current.interact = false;
          break;
      }
    };

    const handleBlur = () => {
      keysRef.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        interact: false,
        sprint: false,
      };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return keysRef;
}
