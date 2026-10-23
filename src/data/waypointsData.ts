import { InteractiveWaypoint } from '../types/game';

export const WAYPOINTS: InteractiveWaypoint[] = [
  {
    id: 'projects-island',
    title: 'PROJECTS',
    subtitle: 'Cyber Colony & AI Research Lab',
    tab: 'projects',
    position: [-38, 4.0, -35],
    radius: 6.5,
    color: '#00F0FF', // Cyan
    icon: 'briefcase',
    description: 'Planetary AI research base showcasing AegisAI, RealFake detection, Mobile Security Agent, and KrishiMitra.',
  },
  {
    id: 'skills-island',
    title: 'SKILLS',
    subtitle: 'Crystal Ion Runway (15 Tech Orbs)',
    tab: 'skills',
    position: [38, 4.0, -35],
    radius: 6.5,
    color: '#A855F7', // Purple
    icon: 'zap',
    description: 'Illuminated planetary runway with floating 3D tech orbs. Run and jump along the highway to collect all 15 skills!',
  },
  {
    id: 'about-island',
    title: 'ABOUT ME',
    subtitle: 'Bio-Sanctuary & Dialogue Matrix',
    tab: 'about',
    position: [45, 3.5, 30],
    radius: 6.5,
    color: '#F59E0B', // Amber
    icon: 'user',
    description: 'Serene planetary bio-sanctuary with stone megaliths. Converse with companion Luna to discover Anisha’s story and vision.',
  },
  {
    id: 'achievements-island',
    title: 'ACHIEVEMENTS',
    subtitle: 'Golden Citadel & Trophy Plateau',
    tab: 'achievements',
    position: [-42, 6.5, 32],
    radius: 6.5,
    color: '#EAB308', // Gold
    icon: 'award',
    description: 'Elevated golden mesa featuring the monumental 3D Golden Trophy Cup, Odisha Skills medals, and BRICS honors.',
  },
  {
    id: 'contact-island',
    title: 'CONTACT',
    subtitle: 'Sakura Oasis & Orbital Comms Array',
    tab: 'contact',
    position: [0, 3.5, 48],
    radius: 6.5,
    color: '#EC4899', // Pink
    icon: 'send',
    description: 'Planetary sakura blossom oasis with high-gain satellite array. Connect via LinkedIn, GitHub, or download official CV.',
  },
];
