/**
 * 3D Avatar Customizer - iPhone 14 & 15 Pro Grid Edition
 * High-Fidelity SVG rendering engine, Web Audio synth engine, camera zooms, and Confetti particles.
 */

// --- 1. Sound Engine (Web Audio API) ---
// High-fidelity synthesized sounds that mimic real haptics and springy reactions
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playBeep(frequency = 500, type = 'sine', duration = 0.08, volume = 0.15) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    // Smooth decay to prevent popping
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio Context failed to play", e);
  }
}

function playSpringSound() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.25);
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + 0.3);
  } catch (e) {}
}

function playDoneFanfare() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // Arpeggio C Major
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }, idx * 60);
    });
  } catch (e) {}
}

// --- 2. State & Data Models ---
const state = {
  currentTab: 'face', // 'face', 'hair', 'clothes', 'accessory'
  faceColor: '#ffd8b3', // Skin Preset 2
  hairColor: '#1a1a1a', // Black
  clothesColor: '#84e125', // Lime Green
  accessoryColor: '#ff7525', // Orange
  
  faceStyle: 0,
  hairStyle: 0,
  clothesStyle: 0,
  accessoryStyle: 0
};

// --- Color Presets ---
const colorPresets = {
  face: [
    { value: '#fcdcc5', label: '밝은 베이지' },
    { value: '#ffd8b3', label: '피치 베이지' },
    { value: '#f4b382', label: '황금빛 태닝' },
    { value: '#c57e51', label: '구리빛 브라운' },
    { value: '#753a15', label: '초콜릿 딥브라운' }
  ],
  hair: [
    { value: '#ffd46e', label: '골든 브론드' },
    { value: '#ff7525', label: '오렌지 진저' },
    { value: '#935028', label: '웜 브라운' },
    { value: '#461b0a', label: '다크 브라운' },
    { value: '#1a1a1a', label: '제트 블랙' }
  ],
  clothes: [
    { value: '#84e125', label: '네온 라임' },
    { value: '#1a1a1a', label: '스테디 블랙' },
    { value: '#ff7525', label: '다이내믹 오렌지' },
    { value: '#ffffff', label: '클래식 화이트' },
    { value: '#0f3c8a', label: '클럽 블루' },
    { value: '#c2185b', label: '네온 마젠타' }
  ],
  accessory: [
    { value: '#ff7525', label: '오렌지 포커스' },
    { value: '#ffd32a', label: '레몬 옐로우' },
    { value: '#ffffff', label: '모노 화이트' },
    { value: '#1a1a1a', label: '스텔스 블랙' },
    { value: '#00d2d3', label: '네온 사이언' }
  ]
};

// --- Option Lists ---
// High-fidelity options structured precisely matching screenshots
const optionsData = {
  face: [
    { id: 0, name: '기본 얼굴', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><circle cx="12" cy="14" r="1.5" fill="#000"/><circle cx="20" cy="14" r="1.5" fill="#000"/><path d="M13,19 Q16,21 19,19" stroke="#000" stroke-width="1.2" stroke-linecap="round" fill="none"/>` },
    { id: 1, name: '윙크 얼굴', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><circle cx="12" cy="14" r="1.5" fill="#000"/><path d="M18,14 Q20,16 22,14" stroke="#000" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M13,19 Q16,22 19,19" stroke="#000" stroke-width="1.2" stroke-linecap="round" fill="none"/>` },
    { id: 2, name: '방긋 얼굴', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M10,14 Q13,11 15,14" stroke="#000" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M17,14 Q19,11 22,14" stroke="#000" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M12,18 Q16,23 20,18 Z" fill="#b33939"/>` },
    { id: 3, name: '평온 얼굴', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><line x1="10" y1="14" x2="14" y2="14" stroke="#000" stroke-width="1.5" stroke-linecap="round"/><line x1="18" y1="14" x2="22" y2="14" stroke="#000" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="19" x2="19" y2="19" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>` },
    { id: 4, name: '질끈 얼굴', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M10,12 L14,15 L10,18" stroke="#000" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M22,12 L18,15 L22,18" stroke="#000" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M12,19 Q16,23 20,19 Z" fill="#ff7675"/>` },
    { id: 5, name: '반짝 얼굴', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M12,14 L13,10 L14,14 L18,15 L14,16 L13,20 L12,16 L8,15 Z" fill="#ffd32a"/><path d="M20,14 L21,10 L22,14 L26,15 L22,16 L21,20 L20,16 L16,15 Z" fill="#ffd32a"/>` }
  ],
  hair: [
    { id: 0, name: '5:5 가르마', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M6,16 C6,10 11,6 16,6 C21,6 26,10 26,16 C23,12 18,10 16,11 C14,10 9,12 6,16 Z" fill="#1a1a1a"/>` },
    { id: 1, name: '뽀글 펌', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><circle cx="11" cy="9" r="4" fill="#1a1a1a"/><circle cx="16" cy="7" r="4" fill="#1a1a1a"/><circle cx="21" cy="9" r="4" fill="#1a1a1a"/><circle cx="8" cy="13" r="3.5" fill="#1a1a1a"/><circle cx="24" cy="13" r="3.5" fill="#1a1a1a"/>` },
    { id: 2, name: '헤어밴드', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M6,14 C6,9 10,6 16,6 C22,6 26,9 26,14 Z" fill="#1a1a1a"/><rect x="6" y="11" width="20" height="4" fill="#3a3a3c"/>` },
    { id: 3, name: '레게 브레이드', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M6,9 L6,22 M9,8 L9,24 M12,7 L12,26 M20,7 L20,26 M23,8 L23,24 M26,9 L26,22" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>` },
    { id: 4, name: '스포츠 컷', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M7,12 C7,8 11,6 16,6 C21,6 25,8 25,12 Z" fill="#1a1a1a"/>` },
    { id: 5, name: '포니테일', previewSVG: `<circle cx="16" cy="16" r="12" fill="#e5e5ea"/><path d="M7,14 C7,8 12,6 16,6 C20,6 25,8 25,14 Z" fill="#1a1a1a"/><path d="M22,7 C26,5 29,8 28,14 Q26,20 23,22" stroke="#1a1a1a" stroke-width="3" fill="none" stroke-linecap="round"/>` }
  ],
  clothes: [
    { id: 0, name: '네온 사커', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M10,13 L16,7 L22,13 L22,25 L10,25 Z" fill="#84e125"/><path d="M10,13 L13,10 L16,13 L19,10 L22,13" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="11" y="21" width="10" height="4" fill="#84e125" stroke="#fff" stroke-width="1"/>` },
    { id: 1, name: '스트라이프 사커', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M10,13 L16,7 L22,13 L22,25 L10,25 Z" fill="#1a1a1a"/><path d="M13,11 L13,25 M16,9 L16,25 M19,11 L19,25" stroke="#4a4a4a" stroke-width="2"/>` },
    { id: 2, name: '네온 오렌지', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M10,13 L16,7 L22,13 L22,25 L10,25 Z" fill="#ff7525"/><path d="M10,13 L13,10 L16,13 L19,10 L22,13" fill="none" stroke="#ffbe76" stroke-width="1.5"/>` },
    { id: 3, name: '백/흑 홈', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M10,13 L16,7 L22,13 L22,25 L10,25 Z" fill="#ffffff" stroke="#1a1a1a" stroke-width="1"/><path d="M13,11 L13,25 M16,9 L16,25 M19,11 L19,25" stroke="#000" stroke-width="2.2"/>` },
    { id: 4, name: '오렌지 농구', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M11,10 L15,8 L17,8 L21,10 L21,25 L11,25 Z" fill="#ff7525"/><path d="M13,8 L13,25 M19,8 L19,25" stroke="#fff" stroke-width="1.2"/>` },
    { id: 5, name: '23 네이비', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M11,10 L15,8 L17,8 L21,10 L21,25 L11,25 Z" fill="#0f3c8a"/><text x="16" y="20" font-size="7" font-weight="bold" fill="#fff" text-anchor="middle">23</text>` }
  ],
  accessory: [
    { id: 0, name: '없음', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><line x1="8" y1="8" x2="24" y2="24" stroke="#8e8e93" stroke-width="2"/><circle cx="16" cy="16" r="8" fill="none" stroke="#8e8e93" stroke-width="2"/>` },
    { id: 1, name: '고글 선글라스', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M6,13 L26,13 C26,13 25,18 22,18 C19,18 17,15 16,15 C15,15 13,18 10,18 C7,18 6,13 6,13 Z" fill="#222" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.15))"/>` },
    { id: 2, name: '뿔테 안경', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><circle cx="11" cy="15" r="4.5" fill="none" stroke="#000" stroke-width="2"/><circle cx="21" cy="15" r="4.5" fill="none" stroke="#000" stroke-width="2"/><line x1="15.5" y1="14" x2="16.5" y2="14" stroke="#000" stroke-width="2"/>` },
    { id: 3, name: '스포츠 볼캡', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M8,15 C8,10 12,7 16,7 C20,7 24,10 24,15 Z" fill="#ff7525"/><path d="M6,15 C10,15 13,17 18,17 C23,17 26,15 26,15" stroke="#ff7525" stroke-width="2.5" fill="none" stroke-linecap="round"/>` },
    { id: 4, name: '따뜻한 비니', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M9,17 C9,11 11,8 16,8 C21,8 23,11 23,17 Z" fill="#ffd32a"/><rect x="8" y="15" width="16" height="3" rx="1.5" fill="#e0b000"/>` },
    { id: 5, name: '오버이어 헤드폰', previewSVG: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#e5e5ea"/><path d="M16,6 C10,6 7,9 7,16 M16,6 C22,6 25,9 25,16" stroke="#222" stroke-width="2.5" fill="none"/><rect x="5" y="13" width="4" height="6" rx="2" fill="#222"/><rect x="23" y="13" width="4" height="6" rx="2" fill="#222"/>` }
  ]
};

// --- 3. Dynamic SVG Layer Rendering Builders ---
// These functions build rich, highly multi-layered and gradient-styled SVG graphics on the fly

function drawBackHair() {
  const c = state.hairColor;
  switch (state.hairStyle) {
    case 3: // Braids
      return `
        <g fill="${c}" stroke="#000" stroke-opacity="0.1">
          <!-- Left dropping braids -->
          <rect x="94" y="148" width="6" height="65" rx="3"/>
          <rect x="86" y="156" width="6" height="50" rx="3"/>
          <circle cx="97" cy="213" r="4.5" fill="#8e8e93"/>
          <circle cx="89" cy="206" r="4.5" fill="#8e8e93"/>
          <!-- Right dropping braids -->
          <rect x="220" y="148" width="6" height="65" rx="3"/>
          <rect x="228" y="156" width="6" height="50" rx="3"/>
          <circle cx="223" cy="213" r="4.5" fill="#8e8e93"/>
          <circle cx="231" cy="206" r="4.5" fill="#8e8e93"/>
        </g>
      `;
    case 5: // Ponytail tail behind back right
      return `
        <g fill="${c}" stroke="rgba(0,0,0,0.08)">
          <!-- Ponytail tail piece curving down behind ear -->
          <path d="M198,110 C230,100 248,125 240,165 C230,205 210,215 198,220 C205,190 215,160 205,130 Z" />
          <circle cx="205" cy="116" r="7" fill="var(--accessory-color)" /> <!-- Hairband tying it -->
        </g>
      `;
    default:
      return '';
  }
}

function drawFrontHair() {
  const c = state.hairColor;
  switch (state.hairStyle) {
    case 0: // 5:5 Middle Part (Image 1 style)
      return `
        <g fill="${c}" filter="url(#shadow-accessory)">
          <!-- Left curtain hair -->
          <path d="M160,102 C125,100 108,122 108,150 C108,162 113,165 113,165 C113,165 118,145 128,138 C138,131 155,135 160,118 Z" />
          <!-- Right curtain hair -->
          <path d="M160,102 C195,100 212,122 212,150 C212,162 207,165 207,165 C207,165 202,145 192,138 C182,131 165,135 160,118 Z" />
          <!-- Top scalp cover -->
          <path d="M108,144 C108,112 125,98 160,98 C195,98 212,112 212,144 C212,120 195,104 160,104 C125,104 108,120 108,144 Z" />
          
          <!-- Gloss Highlights -->
          <path d="M125,115 C135,112 145,115 145,115" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round" fill="none" />
          <path d="M195,115 C185,112 175,115 175,115" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </g>
      `;
      
    case 1: // Fluffy Messy/Curly (Image 3 style)
      return `
        <g fill="${c}">
          <!-- Scalp volume with bubbly textured look -->
          <circle cx="160" cy="98" r="16" />
          <circle cx="140" cy="103" r="15" />
          <circle cx="180" cy="103" r="15" />
          <circle cx="123" cy="116" r="14" />
          <circle cx="197" cy="116" r="14" />
          <circle cx="112" cy="132" r="11" />
          <circle cx="208" cy="132" r="11" />
          <!-- Forehead curls -->
          <path d="M120,126 Q128,122 136,128 Q144,124 152,129 Q160,125 168,129 Q176,125 184,128 Q192,122 200,126" stroke="${c}" stroke-width="12" stroke-linecap="round" fill="none"/>
          
          <!-- Soft highlights -->
          <circle cx="140" cy="96" r="2" fill="rgba(255,255,255,0.15)"/>
          <circle cx="160" cy="90" r="2" fill="rgba(255,255,255,0.15)"/>
          <circle cx="180" cy="96" r="2" fill="rgba(255,255,255,0.15)"/>
        </g>
      `;
      
    case 2: // Short/Spiky with Headband (Image 2 style)
      return `
        <g>
          <!-- Short spiky hair crown -->
          <path d="M108,138 C108,98 124,96 160,96 C196,96 212,98 212,138 C205,124 195,114 160,114 C125,114 115,124 108,138 Z" fill="${c}" />
          <!-- Spiky hair details -->
          <path d="M125,98 L130,90 L138,97 L148,88 L158,97 L168,88 L176,96 L186,89 L192,98" stroke="${c}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
          
          <!-- Thick sports headband (Customizer colorized) -->
          <rect x="108" y="120" width="104" height="14" rx="4" fill="#1c1c1e" filter="url(#shadow-accessory)" />
          <line x1="114" y1="127" x2="206" y2="127" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
        </g>
      `;
      
    case 3: // Dreadlocks / Braids top overlay
      return `
        <g fill="${c}">
          <!-- Crown braids base -->
          <path d="M110,132 C110,100 125,94 160,94 C195,94 210,100 210,132 Z" />
          <!-- Braids texture lines on scalp -->
          <path d="M125,96 Q140,110 148,132 M160,94 Q160,110 160,132 M195,96 Q180,110 172,132" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" fill="none"/>
        </g>
      `;
      
    case 4: // Flat buzz crop / tight fade
      return `
        <g fill="${c}">
          <!-- Perfectly clean circular head wrap -->
          <path d="M110,138 C110,104 125,100 160,100 C195,100 210,104 210,138 C210,138 200,126 160,126 C120,126 110,138 110,138 Z" />
        </g>
      `;
      
    case 5: // Ponytail front sleek parted
      return `
        <g fill="${c}">
          <!-- Sleek pulled back top -->
          <path d="M110,138 C110,102 125,98 160,98 C195,98 210,102 210,138 C210,132 195,106 160,106 C125,106 110,132 110,138 Z" />
          <!-- Texture grain -->
          <path d="M120,118 Q160,106 200,118" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/>
        </g>
      `;
      
    default:
      return '';
  }
}

function drawFaceFeatures() {
  switch (state.faceStyle) {
    case 0: // Standard (Blinking automatically)
      return `
        <g>
          <!-- Eye L -->
          <circle cx="138" cy="144" r="5" fill="#1c1c1e" class="avatar-eye-standard" />
          <circle cx="136.2" cy="142.2" r="1.5" fill="#fff" class="avatar-eye-standard" />
          <!-- Eye R -->
          <circle cx="182" cy="144" r="5" fill="#1c1c1e" class="avatar-eye-standard" />
          <circle cx="180.2" cy="142.2" r="1.5" fill="#fff" class="avatar-eye-standard" />
          <!-- Simple gentle mouth curve -->
          <path d="M152,160 Q160,165 168,160" stroke="#5c3f35" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </g>
      `;
      
    case 1: // Winking
      return `
        <g>
          <!-- Left Eye standard -->
          <circle cx="138" cy="144" r="5" fill="#1c1c1e" />
          <circle cx="136.2" cy="142.2" r="1.5" fill="#fff" />
          <!-- Right Eye winking arch -->
          <path d="M174,144 Q182,149 190,144" stroke="#1c1c1e" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <!-- Big happy open smile -->
          <path d="M148,158 Q160,172 172,158 C168,163 152,163 148,158 Z" fill="#5c3f35" />
        </g>
      `;
      
    case 2: // Laughing / Smiling arcs
      return `
        <g>
          <!-- Left Eye happy arch -->
          <path d="M130,145 Q138,139 146,145" stroke="#1c1c1e" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <!-- Right Eye happy arch -->
          <path d="M174,145 Q182,139 190,145" stroke="#1c1c1e" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <!-- Open laughing mouth with tongue detail -->
          <path d="M146,157 Q160,174 174,157 Z" fill="#b33939" stroke="#5c3f35" stroke-width="2" />
          <path d="M152,166 Q160,162 168,166 C168,171 152,171 152,166 Z" fill="#ff7675" />
        </g>
      `;
      
    case 3: // Resting / Sleeping
      return `
        <g>
          <!-- Horizontal closed eyes -->
          <line x1="128" y1="144" x2="144" y2="144" stroke="#1c1c1e" stroke-width="3" stroke-linecap="round" />
          <line x1="176" y1="144" x2="192" y2="144" stroke="#1c1c1e" stroke-width="3" stroke-linecap="round" />
          <!-- Neutral tiny line mouth -->
          <line x1="154" y1="160" x2="166" y2="160" stroke="#5c3f35" stroke-width="2.5" stroke-linecap="round" />
        </g>
      `;
      
    case 4: // Squeezing eyes (><)
      return `
        <g>
          <!-- > shaped left eye -->
          <path d="M128,139 L140,144 L128,149" stroke="#1c1c1e" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <!-- < shaped right eye -->
          <path d="M192,139 L180,144 L192,149" stroke="#1c1c1e" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <!-- Playful cat-like smile -->
          <path d="M148,158 Q154,163 160,159 Q166,163 172,158" stroke="#5c3f35" stroke-width="2.8" stroke-linecap="round" fill="none" />
        </g>
      `;
      
    case 5: // Starry sparkling eyes
      return `
        <g>
          <!-- Left yellow four-point star -->
          <path d="M138,144 L141,135 L144,144 L153,147 L144,150 L141,159 L138,150 L129,147 Z" fill="#ffd32a" stroke="#ffa801" stroke-width="0.8" />
          <!-- Right yellow four-point star -->
          <path d="M182,144 L185,135 L188,144 L197,147 L188,150 L185,159 L182,150 L173,147 Z" fill="#ffd32a" stroke="#ffa801" stroke-width="0.8" />
          <!-- Excited wide open mouth -->
          <path d="M146,158 Q160,178 174,158 Z" fill="#ff7675" stroke="#5c3f35" stroke-width="2" />
        </g>
      `;
      
    default:
      return '';
  }
}

// Generates the outfits, stripes, logos, socks, cleats depending on Crossed Arms or Standing Body
function drawBodyAndClothes() {
  const isBust = (state.currentTab === 'face' || state.currentTab === 'hair');
  const cc = state.clothesColor; // Primary jersey color
  const stripeColor = (cc === '#1a1a1a') ? '#444446' : '#ffffff';
  
  // Base details for soccer jerseys
  let jerseyStripes = '';
  let logoX = `<path d="M178,216 L186,224 M186,216 L178,224" stroke="#1c1c1e" stroke-width="3" stroke-linecap="round"/>`; // Chest logo 'X'
  
  if (state.clothesStyle === 1) { // Black/grey stripes
    jerseyStripes = `
      <path d="M120,205 L120,280 M132,200 L132,280 M144,198 L144,280 M176,198 L176,280 M188,200 L188,280 M200,205 L200,280" stroke="rgba(255,255,255,0.12)" stroke-width="4.5"/>
    `;
    logoX = `<path d="M178,216 L186,224 M186,216 L178,224" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`;
  } else if (state.clothesStyle === 3) { // Juve black/white stripes
    jerseyStripes = `
      <path d="M120,205 L120,280 M135,199 L135,280 M150,196 L150,280 M170,196 L170,280 M185,199 L185,280 M200,205 L200,280" stroke="#000000" stroke-width="6"/>
    `;
    logoX = `<rect x="176" y="213" width="10" height="12" rx="1" fill="#ff3b30"/>`; // Special logo patch
  } else if (state.clothesStyle === 5) { // Navy 23 basketball
    logoX = `<text x="180" y="226" font-family="Outfit" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">23</text>`;
  }

  if (isBust) {
    // --- CROSSED ARMS BUST POSTURE ---
    // Perfect recreation of Image 1 (lime soccer kit, shoulders curved, arms neatly crossed over stomach)
    let torsoFill = cc;
    let collarStroke = '#ffffff';
    let sleeveStripes = `<path d="M102,230 L110,234" stroke="${collarStroke}" stroke-width="3"/>`;
    
    if (state.clothesStyle === 5 || state.clothesStyle === 4) { // Basketball jerseys (sleeveless)
      torsoFill = cc;
      collarStroke = '#ff9500';
    }

    return `
      <g id="body-crossed-arms" filter="url(#shadow-cross-arms)">
        <!-- Shoulders / Torso base -->
        <path d="M96,250 C96,200 120,194 160,194 C200,194 224,200 224,250 L212,280 L108,280 Z" fill="${torsoFill}" />
        <path d="M96,250 C96,200 120,194 160,194 C200,194 224,200 224,250 L212,280 L108,280 Z" fill="url(#grad-highlight)" />
        
        <!-- Stripes on torso if any -->
        ${jerseyStripes}

        <!-- Neck Collar V-Neck -->
        <path d="M142,192 L160,210 L178,192" fill="none" stroke="${collarStroke}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Chest Brand Logo -->
        <g transform="translate(-16, 2)">${logoX}</g>

        <!-- Arms Base (Skin Tone) -->
        <path d="M108,240 C108,240 125,275 160,275 C195,275 212,240 212,240" fill="none" stroke="var(--skin-color)" stroke-width="26" stroke-linecap="round" />

        <!-- Left/Right Sleeves folded -->
        <path d="M98,220 C98,220 102,260 128,264" fill="none" stroke="${torsoFill}" stroke-width="24" stroke-linecap="round" />
        <path d="M222,220 C222,220 218,260 192,264" fill="none" stroke="${torsoFill}" stroke-width="24" stroke-linecap="round" />
        
        <!-- Sleeve white cuffs matching screenshot -->
        <path d="M122,254 C124,258 126,262 128,264" fill="none" stroke="${collarStroke}" stroke-width="4" stroke-linecap="round" />
        <path d="M198,254 C196,258 194,262 192,264" fill="none" stroke="${collarStroke}" stroke-width="4" stroke-linecap="round" />

        <!-- Crossed Forearms sleeve layering -->
        <!-- Right forearm crossing on top -->
        <path d="M124,260 L196,260" fill="none" stroke="var(--skin-color)" stroke-width="20" stroke-linecap="round" />
        
        <!-- Shadow gap of sleeves -->
        <line x1="126" y1="270" x2="194" y2="270" stroke="rgba(0,0,0,0.12)" stroke-width="2.5" />
      </g>
    `;
  } else {
    // --- STANDING FULL BODY POSTURE ---
    // Perfect recreation of Image 4 (full body vertical stand, soccer jersey shorts socks, cleated shoes)
    const activeOutfit = state.clothesStyle;
    
    // Jersey & Shorts color mapping
    let shirtFill = cc;
    let shortsFill = cc;
    let socksFill = '#ffffff';
    let shoesFill = '#1c1c1e';
    
    if (activeOutfit === 7) { // Clean white tee + grey shorts
      shirtFill = '#ffffff';
      shortsFill = '#48484a';
      socksFill = '#ffffff';
    } else if (activeOutfit === 8) { // Navy Tracksuit
      shirtFill = '#0f3c8a';
      shortsFill = '#0f3c8a';
    }

    return `
      <g id="body-standing-full">
        <!-- 1. STANDING LEGS -->
        <!-- Skin legs -->
        <rect x="132" y="270" width="16" height="60" fill="var(--skin-color)" />
        <rect x="172" y="270" width="16" height="60" fill="var(--skin-color)" />
        
        <!-- Socks (High soccer socks) -->
        <rect x="131" y="300" width="18" height="35" fill="${socksFill}" rx="1" stroke="rgba(0,0,0,0.06)" />
        <rect x="171" y="300" width="18" height="35" fill="${socksFill}" rx="1" stroke="rgba(0,0,0,0.06)" />
        <!-- Sock stripes -->
        <rect x="131" y="304" width="18" height="3" fill="${cc}" />
        <rect x="171" y="304" width="18" height="3" fill="${cc}" />

        <!-- Cleats / Soccer Shoes (Image 4 exact spikes detail) -->
        <g fill="${shoesFill}">
          <!-- Left Cleat -->
          <path d="M120,358 C120,345 130,335 148,335 L152,335 L152,358 Z" />
          <ellipse cx="136" cy="358" rx="16" ry="6" />
          <!-- Right Cleat -->
          <path d="M200,358 C200,345 190,335 172,335 L168,335 L168,358 Z" />
          <ellipse cx="184" cy="358" rx="16" ry="6" />
          
          <!-- Cleat Bottom Studs -->
          <circle cx="126" cy="364" r="2.5" />
          <circle cx="136" cy="365" r="2.5" />
          <circle cx="146" cy="364" r="2.5" />
          <circle cx="174" cy="364" r="2.5" />
          <circle cx="184" cy="365" r="2.5" />
          <circle cx="194" cy="364" r="2.5" />
        </g>

        <!-- 2. SHORTS (Athletic Fit) -->
        <path d="M120,248 C120,248 124,286 156,286 L164,286 C196,286 200,248 200,248 Z" fill="${shortsFill}" />
        <!-- Separation lines -->
        <line x1="160" y1="248" x2="160" y2="284" stroke="rgba(0,0,0,0.15)" stroke-width="1.8" />

        <!-- 3. TORSO SHIRT -->
        <path d="M102,252 C102,204 122,194 160,194 C198,194 218,204 218,252 Z" fill="${shirtFill}" />
        <path d="M102,252 C102,204 122,194 160,194 C198,194 218,204 218,252 Z" fill="url(#grad-highlight)" />
        
        <!-- Jersey Stripes -->
        ${jerseyStripes}

        <!-- Neck Collar white V-Neck -->
        <path d="M142,192 L160,210 L178,192" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Chest Brand Logo -->
        <g transform="translate(0, 0)">${logoX}</g>

        <!-- 4. STANDING ARMS AT SIDES -->
        <!-- Left arm -->
        <path d="M104,204 L92,260" stroke="var(--skin-color)" stroke-width="18" stroke-linecap="round" />
        <path d="M104,204 L94,228" stroke="${shirtFill}" stroke-width="22" stroke-linecap="round" />
        <!-- Right arm -->
        <path d="M216,204 L228,260" stroke="var(--skin-color)" stroke-width="18" stroke-linecap="round" />
        <path d="M216,204 L226,228" stroke="${shirtFill}" stroke-width="22" stroke-linecap="round" />
      </g>
    `;
  }
}

function drawAccessories() {
  const ac = state.accessoryColor;
  const isBust = (state.currentTab === 'face' || state.currentTab === 'hair');
  
  switch (state.accessoryStyle) {
    case 1: // Sports sunglasses (Goggles - Image 5, 1st option)
      return `
        <g filter="url(#shadow-accessory)">
          <!-- Wrapping frames -->
          <path d="M108,136 L212,136 C212,136 208,154 186,154 C170,154 164,146 160,146 C156,146 150,154 134,154 C112,154 108,136 108,136 Z" fill="#1c1c1e" />
          <!-- Neon lenses with reflection highlight -->
          <path d="M112,139 L208,139 C208,139 204,151 186,151 C172,151 166,144 160,144 C154,144 148,151 134,151 C116,151 112,139 112,139 Z" fill="${ac}" opacity="0.85" />
          <path d="M118,141 L146,141" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.6" />
          <path d="M166,141 L194,141" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.6" />
        </g>
      `;
      
    case 2: // Horn-rimmed glasses (Image 5, 2nd option)
      return `
        <g stroke="#1c1c1e" stroke-width="3" fill="none">
          <!-- Left Frame -->
          <circle cx="132" cy="146" r="14" />
          <!-- Right Frame -->
          <circle cx="188" cy="146" r="14" />
          <!-- Connection Bridge -->
          <path d="M146,144 Q160,140 174,144" stroke-linecap="round" />
          <!-- Side temple hinges -->
          <line x1="108" y1="142" x2="118" y2="144" />
          <line x1="212" y1="142" x2="202" y2="144" />
          <!-- Glass sheen reflections -->
          <path d="M125,138 L137,150" stroke="rgba(255,255,255,0.4)" stroke-width="1.8" />
          <path d="M181,138 L193,150" stroke="rgba(255,255,255,0.4)" stroke-width="1.8" />
        </g>
      `;
      
    case 3: // Sports Ballcap (Image 5, 3rd option)
      return `
        <g filter="url(#shadow-accessory)">
          <!-- Cap Dome covering hair top -->
          <path d="M108,126 C108,82 128,82 160,82 C192,82 212,82 212,126 Z" fill="${ac}" />
          <!-- Cap visor bill sticking forward slightly curving -->
          <path d="M92,124 C120,124 130,132 160,132 C190,132 200,124 228,124" stroke="${ac}" stroke-width="8" stroke-linecap="round" fill="none" />
          <!-- Button on top -->
          <circle cx="160" cy="81" r="4.5" fill="#ffffff" />
        </g>
      `;
      
    case 4: // Knitted Beanie (Image 5, 4th option)
      return `
        <g fill="${ac}" filter="url(#shadow-accessory)">
          <!-- Beanie bulbous main body -->
          <path d="M110,132 C110,72 130,76 160,76 C190,76 210,72 210,132 Z" />
          <!-- Rolled cuff at base -->
          <rect x="104" y="122" width="112" height="15" rx="6" fill="${ac}" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" />
          <!-- Decorative puff ball on top -->
          <circle cx="160" cy="70" r="10" fill="#ffffff" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.08))" />
          <!-- Knitted ribbed vertical lines -->
          <path d="M136,86 L136,122 M148,80 L148,122 M160,78 L160,122 M172,80 L172,122 M184,86 L184,122" stroke="rgba(255,255,255,0.18)" stroke-width="2" />
        </g>
      `;
      
    case 5: // Over-ear headphones (Image 5, 5th option)
      return `
        <g filter="url(#shadow-accessory)">
          <!-- Headband arc connecting the cups -->
          <path d="M102,150 C102,80 130,72 160,72 C190,72 218,80 218,150" fill="none" stroke="#222" stroke-width="6" />
          
          <!-- Left ear cushion pad -->
          <rect x="96" y="126" width="14" height="34" rx="7" fill="#1c1c1e" />
          <rect x="99" y="130" width="8" height="26" rx="4" fill="${ac}" />
          
          <!-- Right ear cushion pad -->
          <rect x="210" y="126" width="14" height="34" rx="7" fill="#1c1c1e" />
          <rect x="213" y="130" width="8" height="26" rx="4" fill="${ac}" />
        </g>
      `;
      
    case 6: // Wristbands & Knee pads (Image 5, 6th/7th options combo)
      if (isBust) {
        // Forearm wristbands in Crossed Arms
        return `
          <g fill="#ffffff" stroke="rgba(0,0,0,0.06)" stroke-width="1">
            <!-- White wristband Left -->
            <path d="M132,257 C133,261 135,264 136,265" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" />
            <!-- White wristband Right -->
            <path d="M188,257 C187,261 185,264 184,265" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" />
          </g>
        `;
      } else {
        // Wristbands on wrists & knee pads on knees in Full Standing
        return `
          <g>
            <!-- White wristbands on thin arms -->
            <rect x="90" y="235" width="10" height="8" fill="#ffffff" rx="1.5" stroke="rgba(0,0,0,0.06)" />
            <rect x="220" y="235" width="10" height="8" fill="#ffffff" rx="1.5" stroke="rgba(0,0,0,0.06)" />
            
            <!-- Black sturdy knee pads on legs (Image 5, 7th option exact) -->
            <g fill="#1c1c1e" stroke="#3a3a3c" stroke-width="1">
              <rect x="130" y="282" width="20" height="15" rx="4" />
              <circle cx="140" cy="289" r="4.5" fill="#444" />
              
              <rect x="170" y="282" width="20" height="15" rx="4" />
              <circle cx="180" cy="289" r="4.5" fill="#444" />
            </g>
          </g>
        `;
      }
      
    default:
      return '';
  }
}

// --- Combined Live SVG Compilation ---
function renderAvatar() {
  const isBust = (state.currentTab === 'face' || state.currentTab === 'hair');
  
  // Set CSS Variables dynamically to color SVG fills instantly
  const root = document.documentElement;
  root.style.setProperty('--skin-color', state.faceColor);
  root.style.setProperty('--hair-color', state.hairColor);
  root.style.setProperty('--accessory-color', state.accessoryColor);

  // Update dynamic layers
  document.getElementById('layer-back-hair').innerHTML = drawBackHair();
  document.getElementById('layer-front-hair').innerHTML = drawFrontHair();
  document.getElementById('layer-face-features').innerHTML = drawFaceFeatures();
  document.getElementById('layer-body').innerHTML = drawBodyAndClothes();
  document.getElementById('layer-accessories').innerHTML = drawAccessories();
  
  // Camera Viewport class switching with elegant zoom spring
  const viewport = document.getElementById('character-viewport');
  if (isBust) {
    viewport.className = 'character-viewport zoom-bust';
  } else {
    viewport.className = 'character-viewport zoom-full';
  }
}

// --- 4. Interactive UI Grid Swapper & Events ---

function switchTab(tabName) {
  state.currentTab = tabName;
  
  // Update Navbar button highlights
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Slide black underline smoothly to the selected tab index
  const tabOrder = ['face', 'hair', 'clothes', 'accessory'];
  const activeIdx = tabOrder.indexOf(tabName);
  const underline = document.getElementById('tab-underline');
  underline.style.transform = `translateX(${activeIdx * 100}%)`;

  // Render correct color Presets and Option Grid Cards
  populateColorsRow();
  populateOptionsGrid();
  
  // Audio haptic feedback click & camera spring
  playBeep(320, 'triangle', 0.06, 0.12);
  
  // Refresh compilation
  renderAvatar();
}

function populateColorsRow() {
  const colorsContainer = document.getElementById('colors-row');
  colorsContainer.innerHTML = '';
  
  const presets = colorPresets[state.currentTab] || [];
  
  // 1. Rainbow Circle Custom Color Picker
  const rainbowCircle = document.createElement('div');
  rainbowCircle.className = 'color-circle rainbow';
  rainbowCircle.title = '커스텀 색상 선택';
  rainbowCircle.onclick = () => {
    playBeep(440, 'sine', 0.05, 0.1);
    document.getElementById('native-color-picker').click();
  };
  colorsContainer.appendChild(rainbowCircle);

  // 2. Preset Colors matching image row exactly
  presets.forEach(color => {
    const circle = document.createElement('div');
    circle.className = 'color-circle';
    circle.style.backgroundColor = color.value;
    circle.title = color.label;
    
    // Check if active
    let isActive = false;
    if (state.currentTab === 'face' && state.faceColor.toLowerCase() === color.value.toLowerCase()) isActive = true;
    if (state.currentTab === 'hair' && state.hairColor.toLowerCase() === color.value.toLowerCase()) isActive = true;
    if (state.currentTab === 'clothes' && state.clothesColor.toLowerCase() === color.value.toLowerCase()) isActive = true;
    if (state.currentTab === 'accessory' && state.accessoryColor.toLowerCase() === color.value.toLowerCase()) isActive = true;
    
    if (isActive) circle.classList.add('active');
    
    circle.onclick = () => {
      // Sound click
      playBeep(520, 'sine', 0.04, 0.14);
      
      // Update state
      if (state.currentTab === 'face') state.faceColor = color.value;
      if (state.currentTab === 'hair') state.hairColor = color.value;
      if (state.currentTab === 'clothes') state.clothesColor = color.value;
      if (state.currentTab === 'accessory') state.accessoryColor = color.value;
      
      // Refresh active class inside row
      document.querySelectorAll('.colors-row .color-circle').forEach(el => el.classList.remove('active'));
      circle.classList.add('active');
      
      renderAvatar();
      triggerSpringReaction();
    };
    
    colorsContainer.appendChild(circle);
  });
}

function populateOptionsGrid() {
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  
  const options = optionsData[state.currentTab] || [];
  
  options.forEach(opt => {
    const card = document.createElement('div');
    card.className = 'option-card';
    
    // Check active option
    let isActive = false;
    if (state.currentTab === 'face' && state.faceStyle === opt.id) isActive = true;
    if (state.currentTab === 'hair' && state.hairStyle === opt.id) isActive = true;
    if (state.currentTab === 'clothes' && state.clothesStyle === opt.id) isActive = true;
    if (state.currentTab === 'accessory' && state.accessoryStyle === opt.id) isActive = true;
    
    if (isActive) card.classList.add('selected');
    
    // Render SVG inside card for maximum premium look
    card.innerHTML = `<svg viewBox="0 0 32 32">${opt.previewSVG}</svg>`;
    
    card.onclick = () => {
      // Sound click
      playBeep(650, 'triangle', 0.06, 0.12);
      
      // Update active selection state
      document.querySelectorAll('.option-card').forEach(el => el.classList.remove('selected'));
      card.classList.add('selected');
      
      // Update State variables
      if (state.currentTab === 'face') state.faceStyle = opt.id;
      if (state.currentTab === 'hair') state.hairStyle = opt.id;
      if (state.currentTab === 'clothes') state.clothesStyle = opt.id;
      if (state.currentTab === 'accessory') state.accessoryStyle = opt.id;
      
      renderAvatar();
      triggerSpringReaction();
    };
    
    grid.appendChild(card);
  });
}

// Trigger elastic scale bounce on character when elements are changed
function triggerSpringReaction() {
  const avatarGroup = document.getElementById('avatar-breath-group');
  avatarGroup.classList.remove('animate-scale', 'animate-spring-head');
  void avatarGroup.offsetWidth; // Trigger reflow to restart css keyframes
  
  if (state.currentTab === 'face' || state.currentTab === 'hair') {
    avatarGroup.classList.add('animate-spring-head');
  } else {
    avatarGroup.classList.add('animate-scale');
  }
}

// --- 5. Celebration Modal & Physics Confetti System ---

function showCelebration() {
  playDoneFanfare();
  
  const screen = document.getElementById('celebration-screen');
  screen.classList.add('active');
  
  // Clone current finished SVG into celebration view
  const previewDiv = document.getElementById('celebration-avatar-view');
  previewDiv.innerHTML = '';
  
  const originalSvg = document.getElementById('avatar-svg');
  const clone = originalSvg.cloneNode(true);
  clone.id = 'avatar-svg-clone';
  // Adjust viewport bounds for full review
  clone.setAttribute('viewBox', '0 0 320 380');
  previewDiv.appendChild(clone);
  
  // Initialize confetti canvas particles cascade
  initConfetti();
}

function closeCelebration() {
  playBeep(450, 'sine', 0.08, 0.12);
  const screen = document.getElementById('celebration-screen');
  screen.classList.remove('active');
  stopConfetti();
}

// Confetti Particle Engine
let confettiCanvas = null;
let confettiCtx = null;
let confettiActive = false;
let confettiParticles = [];
let animationFrameId = null;

function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx = confettiCanvas.getContext('2d');
  
  // Sync canvas dimensions
  confettiCanvas.width = confettiCanvas.parentElement.clientWidth;
  confettiCanvas.height = confettiCanvas.parentElement.clientHeight;
  
  confettiActive = true;
  confettiParticles = [];
  
  // Generate 140 particles with spring parameters
  const colors = ['#ffd32a', '#ff3b30', '#4cd964', '#007aff', '#ff9500', '#5856d6', '#ff2d55'];
  for (let i = 0; i < 140; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -100 - 10,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCanvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.03,
      tiltAngle: 0,
      velocity: {
        x: Math.random() * 4 - 2,
        y: Math.random() * 3 + 2
      }
    });
  }
  
  drawConfettiFrame();
}

function drawConfettiFrame() {
  if (!confettiActive) return;
  
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  
  confettiParticles.forEach(p => {
    p.tiltAngle += p.tiltAngleIncremental;
    p.y += p.velocity.y;
    p.x += p.velocity.x;
    p.tilt = Math.sin(p.tiltAngle) * 12;
    
    // Draw single particle shape
    confettiCtx.beginPath();
    confettiCtx.lineWidth = p.r;
    confettiCtx.strokeStyle = p.color;
    confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
    confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
    confettiCtx.stroke();
    
    // Recenter wrapping when hit bottom floor bounds
    if (p.y > confettiCanvas.height) {
      p.x = Math.random() * confettiCanvas.width;
      p.y = -20;
    }
  });
  
  animationFrameId = requestAnimationFrame(drawConfettiFrame);
}

function stopConfetti() {
  confettiActive = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (confettiCtx) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

// --- 6. Initial Handshakes & Clock ---

function startRealTimeClock() {
  const clock = document.getElementById('status-time');
  function update() {
    const d = new Date();
    let hours = d.getHours();
    let mins = d.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    mins = mins < 10 ? '0' + mins : mins;
    clock.textContent = `${hours}:${mins}`;
  }
  update();
  setInterval(update, 1000);
}

window.addEventListener('DOMContentLoaded', () => {
  startRealTimeClock();
  
  // Set default initial tab layout
  switchTab('face');
  
  // Register click events on top tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    };
  });
  
  // Native hidden color picker change handler
  const picker = document.getElementById('native-color-picker');
  picker.addEventListener('input', (e) => {
    const val = e.target.value;
    
    // Update active custom state
    if (state.currentTab === 'face') state.faceColor = val;
    if (state.currentTab === 'hair') state.hairColor = val;
    if (state.currentTab === 'clothes') state.clothesColor = val;
    if (state.currentTab === 'accessory') state.accessoryColor = val;
    
    // Re-render and bounce
    renderAvatar();
    triggerSpringReaction();
  });

  // Action Buttons
  document.getElementById('btn-done').onclick = () => {
    showCelebration();
  };
  
  document.getElementById('btn-celebration-close').onclick = () => {
    closeCelebration();
  };
  
  document.getElementById('btn-reset-avatar').onclick = () => {
    // Reset to defaults with haptic sound
    playBeep(280, 'sine', 0.1, 0.12);
    state.faceStyle = 0;
    state.hairStyle = 0;
    state.clothesStyle = 0;
    state.accessoryStyle = 0;
    state.faceColor = '#ffd8b3';
    state.hairColor = '#1a1a1a';
    state.clothesColor = '#84e125';
    state.accessoryColor = '#ff7525';
    
    switchTab(state.currentTab);
  };
  
  // Bezel Power button Easter egg toggle sound/haptic
  document.getElementById('btn-power-toggle').onclick = () => {
    soundEnabled = !soundEnabled;
    const island = document.getElementById('dynamic-island');
    const msg = document.getElementById('dynamic-island-msg');
    
    // Physical spring swell on dynamic island notch!
    msg.textContent = soundEnabled ? 'Sound/Haptic ON 🔊' : 'Sound/Haptic OFF 🔇';
    island.style.width = '180px';
    island.style.background = soundEnabled ? '#4cd964' : '#ff3b30';
    
    playSpringSound();
    
    setTimeout(() => {
      island.style.width = '110px';
      island.style.background = '#000000';
    }, 1800);
  };
});
