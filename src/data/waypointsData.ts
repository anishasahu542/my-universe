import { InteractiveWaypoint } from '../types/game';

export const WAYPOINTS: InteractiveWaypoint[] = [
  {
    id: 'projects-island',
    title: 'PROJECTS',
    subtitle: 'Cyber Arcade & AI Laboratory',
    tab: 'projects',
    position: [-38, 4.0, -35],
    radius: 6.0,
    color: '#00F0FF', // Cyan
    icon: 'briefcase',
    description: 'Holographic arcade terminal showcasing AegisAI, RealFake detection, Mobile Security Agent, and KrishiMitra.',
  },
  {
    id: 'skills-island',
    title: 'SKILLS',
    subtitle: 'Sky Runway Mini-Game (15 Tech Orbs)',
    tab: 'skills',
    position: [38, 4.0, -35],
    radius: 6.0,
    color: '#A855F7', // Purple
    icon: 'zap',
    description: 'Interactive sky runway with floating 3D tech orbs. Run and jump to collect all 15 skills into your arsenal!',
  },
  {
    id: 'about-island',
    title: 'ABOUT ME',
    subtitle: 'Sanctuary & Interactive Dialogue',
    tab: 'about',
    position: [45, 3.5, 30],
    radius: 6.0,
    color: '#F59E0B', // Amber
    icon: 'user',
    description: 'Peaceful celestial sanctuary. Converse with companion Luna to discover Anisha’s story, vision, and passions.',
  },
  {
    id: 'achievements-island',
    title: 'ACHIEVEMENTS',
    subtitle: 'Golden Trophy & Treasure Medals',
    tab: 'achievements',
    position: [-42, 6.5, 32],
    radius: 6.0,
    color: '#EAB308', // Gold
    icon: 'award',
    description: 'Golden Hall of Fame featuring the giant 3D Trophy, Odisha Skills medals, BRICS honors, and hackathon awards.',
  },
  {
    id: 'contact-island',
    title: 'CONTACT',
    subtitle: 'Sakura Blossom Garden & Comms',
    tab: 'contact',
    position: [0, 2.5, 48],
    radius: 6.0,
    color: '#EC4899', // Pink
    icon: 'send',
    description: 'Blossom garden overlooking the cosmos. Connect via LinkedIn, GitHub, email transmission, or download the full resume.',
  },
];
