import { InteractiveWaypoint } from '../types/game';

export const WAYPOINTS: InteractiveWaypoint[] = [
  {
    id: 'terminal-about',
    title: 'Command Outpost & Bio',
    subtitle: 'Anisha Sahu • Central Command Deck',
    tab: 'about',
    position: [-11.9, 15.0, -12.2],
    radius: 4.5,
    color: '#00F0FF', // Cyan
    icon: 'user',
    description: 'Central command module of the space station. Access developer profile, technical stack, and odyssey telemetry.',
  },
  {
    id: 'hangar-projects',
    title: 'Prototype Hangar & Dock',
    subtitle: 'Orbital Docking Bay • Projects Archive',
    tab: 'projects',
    position: [12.8, -1.8, -3.2],
    radius: 4.5,
    color: '#A855F7', // Purple
    icon: 'briefcase',
    description: 'Starship construction bay and research lab. Inspect RealFake Detection, Curate AI, and deployed platforms.',
  },
  {
    id: 'relay-resume',
    title: 'Observatory Relay Spire',
    subtitle: 'High-Gain Telemetry • Resume Archive',
    tab: 'resume',
    position: [17.0, 16.8, -71.5],
    radius: 5.0,
    color: '#F59E0B', // Amber
    icon: 'file-text',
    description: 'Celestial observatory spire overlooking the planetary ridge. Access experience, education, and credentials.',
  },
  {
    id: 'transmitter-contact',
    title: 'Orbital Satellite Dish',
    subtitle: 'Subspace Comms Array • Contact Beacon',
    tab: 'contact',
    position: [-14.5, -2.2, 63.5],
    radius: 5.0,
    color: '#10B981', // Emerald
    icon: 'send',
    description: 'Long-range satellite array and communications dish. Establish direct connection via email, phone, GitHub, or LinkedIn.',
  },
];
