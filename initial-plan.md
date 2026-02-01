# Energy Control Center Educational Web App

Build a fully interactive, touch-friendly React application for nuclear energy education with two modes: a HOST MODE for classroom multiboards and an EXPERT TOOL for student smartphones. The app uses drag-and-drop, real-time controls, and localStorage persistence for uninterrupted classroom sessions.

## Project Overview

**Application Name**: Energy Control Center
**Target**: Physics students in Ukrainian educational institutions
**Duration**: 45-minute interactive classroom session
**Deployment**: GitHub Pages (static hosting, no backend)

## Key Features

### Two Operation Modes

1. **HOST MODE (Multiboard)**: Main simulation screen for large displays/interactive whiteboards
   - Large touch-friendly controls
   - Real-time visualizations
   - Collaborative classroom interaction

2. **EXPERT TOOL (Smartphone)**: Calculator and reference tools for students
   - Personal calculations
   - Material/shielding calculators
   - Reference data for decision-making

### Three Main Interactive Screens

#### Screen 1: Energy System Balancing (Drag & Drop)
- **Objective**: Collective energy mix composition on large screen
- **Mechanics**:
  - Bottom dock with energy source cards (АЕС/Nuclear, ТЕС/Coal, СЕС/Solar, ВЕС/Wind)
  - 5 central slots for placement
  - Snap-to-grid card placement
  - Live CO2 emissions graph updates
  - Smooth animations with Framer Motion

#### Screen 2: Shielding Laboratory
- **Objective**: Calculate radiation protection parameters
- **Mobile (Expert Tool)**:
  - Material selection (Lead, Concrete, Steel, etc.)
  - Thickness input
  - Protection coefficient calculation
  - Goal: Find combination achieving 99% protection
- **Multiboard (Host)**:
  - Student presents solution on large screen
  - Input verified parameters
  - "START TEST" button triggers visualization
  - Animated radiation beams hitting shield
  - Success: beams stop / Failure: beams penetrate (with alarm sound)

#### Screen 3: Reactor Management (Operator Mode)
- **Objective**: Dynamic team interaction at board
- **Mechanics**:
  - Large vertical sliders: "Control Rods" and "Water Supply"
  - Real-time temperature graph (constantly rising simulation)
  - One student is "Chief Operator" at board
  - Class calculates and shouts commands: "Water to 80%!", "Rods down!"
  - Operator adjusts sliders based on team instructions
  - Creates excitement through collaborative problem-solving

## Design Requirements

### Visual Theme: "Scientific Light"

**Color Palette**:
- Background: Off-white (#F5F7FA) or pure white
- Accents:
  - Deep blue (science/trust)
  - Bright orange (warnings/attention)
  - Saturated green (success/ecology)
- Text: Dark grey (#1A202C) for maximum readability

**Typography**:
- Modern Sans-Serif fonts: Inter or Roboto
- Large font sizes for visibility from back rows
- Clear hierarchy for classroom scanning

**Branding**:
- Clean, professional "scientific institution" aesthetic
- No institutional logos required

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Framework | **React.js** with **Vite** |
| Styling | **Tailwind CSS** |
| Drag & Drop | **dnd-kit** (touch-optimized) |
| Charts | **recharts** |
| Animations | **Framer Motion** |
| State Management | **zustand** + persist middleware |
| Storage | **localStorage** (progress persistence) |
| Audio | **Web Audio API** (synthesized sounds) |
| Deployment | **GitHub Pages** via GitHub Actions |

## Critical Features

### LocalStorage Persistence
- All actions saved: card positions, slider values, timer state
- **Purpose**: If browser tab closes/refreshes during class, game resumes exactly where it stopped
- Seamless classroom experience without data loss

### Reset System
- Hidden/secret button in settings menu
- Full game state reset for new class sessions
- Admin-only access

### Touch Optimization
- All interactions work on interactive whiteboards
- Large hit targets for finger/stylus input
- Smooth, responsive touch feedback

### Hardcoded Ukrainian Text
- All UI text hardcoded directly in components (no separate language files)
- Simplifies deployment and reduces bundle size
- Native language support for target audience

## Implementation Steps

### Phase 1: Project Setup
1. Initialize Vite + React project
2. Install dependencies:
   ```bash
   npm create vite@latest . -- --template react
   npm install tailwindcss postcss autoprefixer
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   npm install recharts framer-motion zustand
   npm install react-router-dom
   ```
3. Configure Tailwind CSS
4. Setup GitHub Pages deployment (GitHub Actions workflow)
5. Create base project structure
6. Create Web Audio API sound engine utility

### Phase 2: Core Architecture
1. Setup routing (mode selection → HOST/EXPERT)
2. Create zustand store with persist middleware
3. Implement localStorage state management
4. Build layout components (Header, Navigation)
5. Create mode selection landing page
6. Implement audio engine with volume controls

### Phase 3: Screen 1 - Energy Balancing
1. Create energy source card components (Nuclear, Coal, Solar, Wind)
2. Implement drag-and-drop with dnd-kit
3. Build slot system with snap-to-grid
4. Integrate recharts for CO2 emissions graph
5. Add smooth animations with Framer Motion
6. Connect to zustand store
7. Add click/drag sound effects

### Phase 4: Screen 2 - Shielding Lab
1. Build mobile calculator interface (Expert Tool)
   - Material dropdown
   - Thickness input
   - Protection calculation logic
   - Results display
2. Build multiboard verification interface (Host)
   - Parameter input fields
   - "START TEST" button
   - Radiation beam SVG animations
   - Success/failure states
   - Alarm sound integration via Web Audio API

### Phase 5: Screen 3 - Reactor Management
1. Create large vertical slider components
2. Build real-time temperature graph with recharts
3. Implement rising temperature simulation
4. Add visual feedback for critical states
5. Create operator interface with clear labels
6. Add alarm states for dangerous conditions
7. Integrate Geiger counter ambient sound

### Phase 6: Ukrainian Localization & Theming
1. Apply light theme colors throughout
2. Implement large, readable typography
3. Hardcode Ukrainian text directly in components
4. Create cohesive scientific aesthetic
5. Ensure consistent styling across all screens

### Phase 7: Polish & Testing
1. Add hidden reset button in settings
2. Test localStorage persistence (refresh scenarios)
3. Test touch interactions on various devices
4. Optimize performance for smooth animations
5. Add loading states and error handling
6. Cross-browser testing
7. Test audio on different devices/volumes

### Phase 8: Deployment
1. Configure GitHub Actions for automatic deployment
2. Setup custom domain (if needed)
3. Test deployed version on actual multiboard
4. Create documentation for teachers

## File Structure

```
atom-power/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Navigation.jsx
│   │   ├── screen1/
│   │   │   ├── EnergyCard.jsx
│   │   │   ├── EnergySlot.jsx
│   │   │   ├── EmissionsChart.jsx
│   │   │   └── EnergyBalancing.jsx
│   │   ├── screen2/
│   │   │   ├── ShieldCalculator.jsx (Expert Tool)
│   │   │   ├── ShieldVerification.jsx (Host)
│   │   │   └── RadiationBeam.jsx
│   │   ├── screen3/
│   │   │   ├── ControlSlider.jsx
│   │   │   ├── TemperatureGraph.jsx
│   │   │   └── ReactorControl.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   ├── store/
│   │   └── gameStore.js (zustand)
│   ├── pages/
│   │   ├── ModeSelection.jsx
│   │   ├── HostMode.jsx
│   │   └── ExpertTool.jsx
│   ├── utils/
│   │   ├── audioEngine.js
│   │   ├── calculations.js
│   │   └── constants.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Data Models

### Energy Source Card
```javascript
{
  id: 'nuclear' | 'coal' | 'solar' | 'wind' | 'hydro',
  name: 'АЕС' | 'ТЕС' | 'СЕС' | 'ВЕС' | 'ГЕС',
  co2Emissions: number, // kg CO2/MWh
  capacity: number, // MW
  reliability: number, // %
  color: string
}
```

### Shielding Material
```javascript
{
  id: string,
  name: 'Свинець' | 'Бетон' | 'Сталь',
  density: number,
  halfValueLayer: number, // cm
  cost: number
}
```

### Game State (zustand)
```javascript
{
  mode: 'host' | 'expert',
  screen1: {
    slots: [EnergySource | null],
    totalEmissions: number
  },
  screen2: {
    selectedMaterial: Material,
    thickness: number,
    protectionLevel: number,
    verified: boolean
  },
  screen3: {
    controlRods: number, // 0-100
    waterSupply: number, // 0-100
    temperature: number,
    isStable: boolean
  },
  resetAll: () => void
}
```

### Audio Engine Interface
```javascript
// src/utils/audioEngine.js
{
  playClick: () => void,
  playSuccess: () => void,
  playAlarm: () => void,
  startGeigerCounter: () => void,
  stopGeigerCounter: () => void,
  setVolume: (level: number) => void, // 0-1
  mute: () => void,
  unmute: () => void
}
```

## Ukrainian Text Content

### Mode Selection
- **Заголовок**: "Центр Керування Енергією"
- **Режим Господаря**: "МУЛЬТИБОРД (Головний Екран)"
- **Інструмент Експерта**: "СМАРТФОН (Калькулятори)"

### Screen 1: Energy Balancing
- **Заголовок**: "Балансування Енергосистеми"
- **Інструкція**: "Перетягніть джерела енергії у слоти для створення оптимального енергоміксу"
- **Графік**: "Викиди CO₂ (кг/МВт·год)"

### Screen 2: Shielding Lab
- **Заголовок**: "Лабораторія Екранування"
- **Матеріал**: "Оберіть матеріал захисту"
- **Товщина**: "Товщина (см)"
- **Результат**: "Рівень захисту: {X}%"
- **Кнопка**: "ПОЧАТИ ТЕСТ"

### Screen 3: Reactor Management
- **Заголовок**: "Керування Реактором"
- **Стрижні**: "Стрижні керування"
- **Вода**: "Подача води"
- **Температура**: "Температура реактора (°C)"
- **Попередження**: "⚠️ КРИТИЧНА ТЕМПЕРАТУРА!"

## Sound Effects Implementation (Web Audio API)

### Geiger Counter
```javascript
// Synthesized clicking sound using white noise bursts
const createGeigerClick = (audioContext) => {
  const bufferSize = audioContext.sampleRate * 0.01; // 10ms
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // White noise
  }
  // Random intervals for realistic Geiger effect
};
```

### Success Sound
```javascript
// Pure tone with frequency sweep (celebration)
const playSuccess = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.exponentialRampToValueAtTime(
    880, // A5
    audioContext.currentTime + 0.3
  );
  // Connect to gain node for volume control
};
```

### Alarm
```javascript
// Oscillating tone for warnings
const playAlarm = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'square';
  // Alternate between two frequencies (siren effect)
  setInterval(() => {
    oscillator.frequency.value = oscillator.frequency.value === 440 ? 880 : 440;
  }, 500);
};
```

### Click/Drag Sounds
```javascript
// Short beep for tactile feedback
const playClick = (audioContext) => {
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  // Short 50ms beep
};
```

**Volume Control**: Global volume slider accessible from settings, using GainNode in Web Audio API chain.

## Future Enhancements
- **Multilingual**: Add English version for international demos
- **Analytics**: Track which screens students struggle with
- **Difficulty Levels**: Beginner/Advanced modes
- **Score System**: Gamification for student engagement
- **Export Reports**: Teacher can export session results

## Success Metrics

**For Students**:
- Understand nuclear energy CO2 footprint vs fossil fuels
- Learn radioactive decay and half-life calculations
- Experience real-time system management decisions

**For Teachers**:
- Seamless classroom tech experience (no crashes/data loss)
- High student engagement through interactive elements
- Flexible pacing with persistent state

**Technical**:
- 100% client-side (no server dependencies)
- Works on all modern browsers
- Touch-optimized for interactive displays
- Fast load times (<3s initial load)
- Zero data loss on refresh
- Audio works across all devices without external files