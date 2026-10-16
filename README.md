# My Universe — Playable 3D Space Adventure Portfolio

**Module 01: Playable Portfolio Foundation**

*My Universe* is an anime-inspired, browser-based 3D space adventure portfolio built with React, TypeScript, Vite, Three.js, React Three Fiber, Rapier Physics, and Zustand. Players command an orbital exploration vessel navigating across a space station sector to discover developer logs, prototype hangars, telemetry records, and subspace transmissions.

---

## 🚀 Key Features

- **Cinematic Anime Space Landing Screen**: Featuring glowing UI borders, orbital radar telemetry, sound calibration, control guides, and loading progress synced with Drei's asset pipeline.
- **3D Space Environment & Physics**:
  - Leverages Quaternius's *Ultimate Space Kit* GLB asset as the sector environment (`public/models/ultimate_space_kit.glb`).
  - Dynamic anime lighting: warm solar directional light, rim lighting, deep-space ambient fill, and animated orbital energy rings.
  - Cosmic dust particles and 3,000+ procedural stars with variable twinkle rates.
  - Rapier 3D physics integration (`@react-three/rapier`) providing realistic gravity, rigid-body player movement, and collision bounds.
- **Third-Person Player Controller**:
  - Camera-relative directional movement (W/A/S/D / Arrows) so steering is intuitive relative to current camera heading.
  - Thruster jump with ground contact detection (Space).
  - High-velocity thruster boost (Shift).
  - Proximity interaction trigger (E).
  - Mobile touch support: virtual 4-way D-pad and touch action buttons.
  - Zero-allocation frame loop using transient references to eliminate React re-render overhead.
- **Smooth Orbital Camera**:
  - Damped 3rd-person follow camera with horizontal yaw orbit and vertical pitch clamping (-10° to 75°).
  - Configurable mouse sensitivity and optional Y-axis inversion.
- **Interactive Holographic Waypoint System**:
  - **Core AI Terminal**: Identity, biography, and technical stack (About).
  - **Prototype Hangar**: Starship project blueprints, demo links, and source code (Projects).
  - **Orbital Relay**: Career mission history, experience timeline, and downloadable CV (Resume).
  - **Deep Space Beacon**: Subspace communication frequencies and social relays (Contact).
- **Direct Accessibility Fallback**:
  - Fully navigable without requiring 3D gameplay or completion.
  - Accessible via Landing Screen shortcuts, persistent HUD pills, Pause Menu, or safe mode fallback.
- **System Calibration & Settings**:
  - Master volume slider & audio mute toggle.
  - Camera sensitivity & Y-axis inversion.
  - Graphics fidelity settings (High / Medium / Low) with dynamic shadow and particle scaling.
- **State Architecture**:
  - Typed Zustand store cleanly separating UI lifecycle, settings, telemetry, interactions, and discovery progression.

---

## 🛠️ Architecture & Components

```
src/
├── app/
│   ├── App.tsx                     # Top-level composition (Canvas + SceneManager + CRT Overlay)
│   └── main.tsx                    # StrictMode DOM mount
├── components/
│   ├── 3d/
│   │   ├── CameraController.tsx    # Orbital follow camera with pitch clamping and damping
│   │   ├── Environment.tsx         # Cosmic dust, stars, and anime directional/rim lighting
│   │   ├── GameCanvas.tsx          # R3F Canvas setup, WebGL error boundary, Suspense
│   │   ├── GameWorld.tsx           # Rapier physics world, station deck colliders, models
│   │   ├── InteractionSystem.tsx   # 3D holographic waypoint beacons & proximity detection
│   │   ├── PlayerController.tsx    # Rapier RigidBody, camera-yaw movement, jumping
│   │   └── SpaceStationModel.tsx   # PBR loader & optimizer for ultimate_space_kit.glb
│   └── ui/
│       ├── ErrorFallback.tsx       # Subsystem failure recovery & safe mode 2D access
│       ├── HUD.tsx                 # Telemetry coordinates, mission tracker, quick nav
│       ├── LandingScreen.tsx       # Anime sci-fi entry, Start Journey, direct shortcuts
│       ├── LoadingOverlay.tsx      # Drei useProgress loading bar & status readouts
│       ├── MobileControls.tsx      # Virtual D-pad and action buttons for touch devices
│       ├── PauseMenu.tsx           # In-game pause modal with resume, settings, and exit
│       ├── PortfolioPanel.tsx      # Tabbed archive: About, Projects, Resume, Contact, Controls
│       ├── SceneManager.tsx        # UI state coordinator for landing, playing, and modals
│       └── SettingsPanel.tsx       # Audio, camera sensitivity, and graphics quality controls
├── data/
│   ├── portfolioData.ts            # Authentic developer bio, projects, experience, contact
│   └── waypointsData.ts            # Spatial coordinates and metadata for interactive beacons
├── hooks/
│   ├── useKeyboardControls.ts      # Zero-rerender ref-based keyboard polling
│   └── useWindowDimensions.ts      # Responsive layout and touch detection
├── store/
│   ├── gameStore.ts                # Typed Zustand state store & action dispatchers
│   └── gameStore.test.ts           # Vitest unit test suite (8 passing tests)
├── styles/
│   └── index.css                   # Anime sci-fi theme, HUD cutouts, neon glassmorphism
└── types/
    └── game.ts                     # TypeScript interfaces and union types
```

---

## 🎮 Flight Controls

| Control | Action | Notes |
| :--- | :--- | :--- |
| **W, A, S, D** / **Arrows** | Directional Thrusters | Moves relative to the camera heading |
| **Mouse Click + Drag** | Orbit Camera | Adjusts horizontal yaw and vertical pitch |
| **Spacebar** | Vertical Thruster Jump | Impulse jump with ground check |
| **E** or **Click Prompt** | Inspect Waypoint | Opens interactive portfolio archive |
| **Shift** (Hold) | Afterburner Boost | 1.6x movement speed multiplier |
| **Escape [Esc]** | Pause / Resume / Close | Toggles pause menu or closes open archive |
| **Mobile Touch D-Pad** | Virtual Navigation | Shown on mobile screens and touch devices |

---

## 📦 Installation & Local Development

### Prerequisites

- Node.js `v18.0.0` or higher (tested on Node `v24.14.0`)
- npm `v9.0.0` or higher (tested on npm `v11.9.0`)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd PORTFOLIO

# Install packages
npm install
```

### 2. Start Local Development Server

```bash
npm run dev
```

The application will launch at `http://localhost:5173`.

---

## 🧪 Testing

The test suite validates game state transitions, progression logic, waypoint discovery tracking, and settings persistence:

```bash
npm test
```

All 8 tests pass using Vitest.

---

## 🏗️ Production Build & Verification

To verify TypeScript types and bundle the production assets:

```bash
npm run build
```

The bundled assets will be generated in `dist/`.

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deployment Instructions

The production output in `dist/` is static and can be deployed to any modern static hosting service:

### Vercel / Netlify / Cloudflare Pages / GitHub Pages

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+

Make sure the GLB asset in `public/models/ultimate_space_kit.glb` is deployed alongside the build.

---

## 🗺️ Module Roadmap

- **[x] Module 01**: Playable 3D Universe Foundation, GLB asset pipeline, Rapier character controller, orbital camera, responsive anime HUD, direct accessibility shortcuts, and unit tests.
- **[ ] Module 02**: Celestial bodies & procedural planetary landing zones.
- **[ ] Module 03**: AI companion drone with interactive dialogue system.
- **[ ] Module 04**: Asteroid mining mini-games & local storage quest progression saving.
