import { InteractiveWaypoint } from '../types/game';

export const WAYPOINTS: InteractiveWaypoint[] = [
  {
    id: 'terminal-about',
    title: 'Core AI Terminal',
    subtitle: 'Identity & Odyssey Logs',
    tab: 'about',
    position: [0, 1, -8],
    radius: 3.5,
    color: '#00F0FF', // Cyan
    icon: 'user',
    description: 'Access the astronaut log: developer profile, philosophy, and technical stack.',
  },
  {
    id: 'hangar-projects',
    title: 'Prototype Hangar',
    subtitle: 'Shipyard & Research Lab',
    tab: 'projects',
    position: [9, 1, 0],
    radius: 3.5,
    color: '#A855F7', // Purple
    icon: 'briefcase',
    description: 'Inspect built starcrafts: full-stack applications, 3D simulations, and web experiments.',
  },
  {
    id: 'relay-resume',
    title: 'Orbital Relay',
    subtitle: 'Telemetry & Career Records',
    tab: 'resume',
    position: [-9, 1, 0],
    radius: 3.5,
    color: '#F59E0B', // Amber
    icon: 'file-text',
    description: 'Retrieve mission archive: work history, educational achievements, and certifications.',
  },
  {
    id: 'transmitter-contact',
    title: 'Deep Space Beacon',
    subtitle: 'Long-Range Subspace Comms',
    tab: 'contact',
    position: [0, 1, 8],
    radius: 3.5,
    color: '#10B981', // Emerald
    icon: 'send',
    description: 'Transmit a direct subspace frequency to establish direct collaboration or hiring inquiry.',
  },
];
