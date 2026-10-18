import { DialogueOption } from '../types/game';

export const ABOUT_DIALOGUE_DATA: DialogueOption[] = [
  {
    id: 'who-are-you',
    question: 'Who are you?',
    answer:
      "Hi! I'm Anisha Sahu — a Computer Science Engineer, AI researcher, and full-stack builder from Silicon University. I specialize in designing intelligent multimodal systems, deep learning architectures, and scalable interactive web experiences.",
    mood: 'happy',
  },
  {
    id: 'why-cs',
    question: 'Why Computer Science & AI?',
    answer:
      'I was captivated by the magic of turning pure logic into systems that can see, reason, and solve real-world problems. Building AegisAI and KrishiMitra proved to me that AI can empower people, protect communities, and democratize knowledge globally.',
    mood: 'thinking',
  },
  {
    id: 'hobbies',
    question: 'Your hobbies & interests?',
    answer:
      'Beyond training neural networks, I love creative 3D web design (Three.js & R3F), competitive hackathons, listening to anime soundtracks & lofi beats while coding, and exploring sci-fi worldbuilding!',
    mood: 'excited',
  },
  {
    id: 'future-goals',
    question: 'Future aspirations?',
    answer:
      'My vision is to engineer next-generation autonomous AI agents that bridge the gap between complex research and delightful real-world interfaces. I aim to contribute to world-class engineering teams pushing the frontier of artificial intelligence.',
    mood: 'proud',
  },
  {
    id: 'fun-facts',
    question: 'Fun facts & superpower?',
    answer:
      "Superpower: I can prototype a full-stack, AI-integrated 3D application from idea to deployment in 24 hours flat! Also, I've won two state-level bronze medals in competitive skills and love clean, self-documenting code.",
    mood: 'happy',
  },
];
