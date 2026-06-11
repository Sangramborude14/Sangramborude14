/* -------------------------------------------------------------
   ASTRO BOT THEME LOGIC - INDEX.JS
------------------------------------------------------------- */

// --- 1. BOT INVENTORY (SKILLS DATA) ---
const SKILLS = [
  // Frontend / Client UI
  { name: 'HTML5', category: 'frontend', iconClass: 'devicon-html5-plain colored' },
  { name: 'CSS3', category: 'frontend', iconClass: 'devicon-css3-plain colored' },
  { name: 'JavaScript', category: 'frontend', iconClass: 'devicon-javascript-plain colored' },
  { name: 'React', category: 'frontend', iconClass: 'devicon-react-original colored' },
  { name: 'Next.js', category: 'frontend', iconClass: 'devicon-nextjs-original-wordmark colored' },
  { name: 'Tailwind CSS', category: 'frontend', iconClass: 'devicon-tailwindcss-original colored' },
  { name: 'Zustand', category: 'frontend', iconClass: 'devicon-react-original colored' }, // Fallback to React style
  { name: 'Socket.io', category: 'frontend', iconClass: 'devicon-socketdotio-original colored' },
  { name: 'GraphQL', category: 'frontend', iconClass: 'devicon-graphql-plain colored' },

  // Backend / Database
  { name: 'Node.js', category: 'backend', iconClass: 'devicon-nodejs-plain colored' },
  { name: 'Express.js', category: 'backend', iconClass: 'devicon-express-original colored' },
  { name: 'Bcrypt.js', category: 'backend', iconClass: 'devicon-javascript-plain colored' }, // JS fallback
  { name: 'PostgreSQL', category: 'backend', iconClass: 'devicon-postgresql-plain colored' },
  { name: 'Prisma', category: 'backend', iconClass: 'devicon-prisma-original colored' },
  { name: 'MongoDB', category: 'backend', iconClass: 'devicon-mongodb-plain colored' },
  { name: 'Mongoose', category: 'backend', iconClass: 'devicon-mongodb-plain colored' }, // Mongo fallback
  { name: 'Redis', category: 'backend', iconClass: 'devicon-redis-plain colored' },

  // Systems & DevOps
  { name: 'C++', category: 'systems', iconClass: 'devicon-cplusplus-plain colored' },
  { name: 'Docker', category: 'systems', iconClass: 'devicon-docker-plain colored' },
  { name: 'AWS EC2', category: 'systems', iconClass: 'devicon-amazonwebservices-plain-wordmark colored' },
  { name: 'CI/CD', category: 'systems', iconClass: 'devicon-githubactions-plain colored' },
  { name: 'Python', category: 'systems', iconClass: 'devicon-python-plain colored' },
  { name: 'NumPy', category: 'systems', iconClass: 'devicon-numpy-plain colored' },
  { name: 'Pandas', category: 'systems', iconClass: 'devicon-pandas-plain colored' },
  { name: 'Matplotlib', category: 'systems', iconClass: 'devicon-python-plain colored' }
];

// --- 2. DYNAMIC SKILL LOAD & FILTER ---
function initSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  renderSkills('all');

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle button active states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      renderSkills(filter);
    });
  });
}

function renderSkills(filter) {
  const container = document.getElementById('skills-container');
  container.innerHTML = '';

  const filteredSkills = filter === 'all' 
    ? SKILLS 
    : SKILLS.filter(s => s.category === filter);

  filteredSkills.forEach(skill => {
    const chip = document.createElement('div');
    chip.className = 'skill-chip';

    // Build icon element
    let iconHTML = '';
    // Special custom graphics for modules without straightforward icons
    if (skill.name === 'Zustand') {
      iconHTML = `<i class="${skill.iconClass}" style="filter: hue-rotate(180deg);"></i>`;
    } else if (skill.name === 'Bcrypt.js') {
      iconHTML = `<i class="devicon-javascript-plain colored" style="filter: saturate(0.5) sepia(0.5) hue-rotate(90deg);"></i>`;
    } else if (skill.name === 'Mongoose') {
      iconHTML = `<i class="devicon-mongodb-plain colored" style="filter: saturate(1.5) hue-rotate(280deg);"></i>`;
    } else if (skill.name === 'Matplotlib') {
      iconHTML = `<i class="devicon-python-plain colored" style="filter: hue-rotate(45deg);"></i>`;
    } else {
      iconHTML = `<i class="${skill.iconClass}"></i>`;
    }

    chip.innerHTML = `
      ${iconHTML}
      <span>${skill.name}</span>
    `;
    container.appendChild(chip);
  });
}

// --- 3. DYNAMIC LEETCODE STATS INTEGRATION ---
const LEETCODE_USERNAME = 'sangramisnoob';
const FALLBACK_STATS = {
  totalSolved: 358,
  easySolved: 142,
  mediumSolved: 184,
  hardSolved: 32,
  acceptanceRate: 62.4
};

async function fetchLeetCodeStats() {
  const totalEl = document.getElementById('leetcode-total');
  const easyEl = document.getElementById('easy-solved');
  const mediumEl = document.getElementById('medium-solved');
  const hardEl = document.getElementById('hard-solved');
  const acceptanceEl = document.getElementById('acceptance-rate');
  const progressCircle = document.getElementById('core-progress-circle');

  let stats = FALLBACK_STATS;

  try {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        stats = {
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          acceptanceRate: data.acceptanceRate
        };
      }
    }
  } catch (error) {
    console.warn("LeetCode API fetching failed. Reverting to pre-loaded system cache.", error);
  }

  // Update DOM values
  animateNumber(totalEl, stats.totalSolved);
  animateNumber(easyEl, stats.easySolved);
  animateNumber(mediumEl, stats.mediumSolved);
  animateNumber(hardEl, stats.hardSolved);
  acceptanceEl.textContent = `ACCEPTANCE: ${stats.acceptanceRate.toFixed(1)}%`;

  // Update Circular Progress (Dashoffset logic)
  // Total questions in LeetCode is around 3100+
  // We use a comparative benchmark goal (e.g. 500 solved) or represent completion ratio of solved tasks
  const maxGoal = 500;
  const solvedRatio = Math.min(stats.totalSolved / maxGoal, 1);
  const circleCircumference = 2 * Math.PI * 90; // radius = 90
  const offset = circleCircumference - (solvedRatio * circleCircumference);
  
  setTimeout(() => {
    progressCircle.style.strokeDashoffset = offset;
  }, 300);
}

function animateNumber(element, target) {
  let start = 0;
  const duration = 1200; // ms
  const stepTime = Math.abs(Math.floor(duration / target));
  
  if (target === 0) {
    element.textContent = '0';
    return;
  }

  const timer = setInterval(() => {
    start += 1;
    element.textContent = start;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, Math.max(stepTime, 8));
}

// --- 4. SPACE CANVAS BACKGROUND (PARTICLE ENGINE) ---
let canvas, ctx, stars = [], sparks = [];
const mouse = { x: null, y: null };

function initCanvas() {
  canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Fill Starfield
  const starCount = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.2 + 0.05,
      color: `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.2})`
    });
  }

  // Event telemetry
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Spawn glow blue sparks on cursor drift
    if (Math.random() < 0.25) {
      sparks.push({
        x: mouse.x,
        y: mouse.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1, // tend to float upwards like bubbles
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        size: Math.random() * 3 + 1
      });
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  animateCanvas();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Starfield
  stars.forEach(star => {
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    // Slowly scroll stars downward
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });

  // 2. Draw Thruster Sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    ctx.fillStyle = `rgba(0, 210, 255, ${s.life})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 210, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadows
    ctx.shadowBlur = 0;

    s.x += s.vx;
    s.y += s.vy;
    s.life -= s.decay;

    if (s.life <= 0) {
      sparks.splice(i, 1);
    }
  }

  requestAnimationFrame(animateCanvas);
}

// --- 5. INTERACTIVE VISOR / EYE MOVEMENT ---
function initVisor() {
  const visor = document.querySelector('.astro-bot-visor');
  const eyes = document.querySelectorAll('.astro-bot-eye');
  if (!visor || !eyes.length) return;

  window.addEventListener('mousemove', (e) => {
    const rect = visor.getBoundingClientRect();
    const visorCenterX = rect.left + rect.width / 2;
    const visorCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - visorCenterY, e.clientX - visorCenterX);
    const maxOffset = 10; // how much the eye shifts inside the visor
    
    const dx = Math.cos(angle) * maxOffset;
    const dy = Math.sin(angle) * maxOffset;

    eyes.forEach(eye => {
      eye.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  });
}

// --- 6. TELEMETRY SEND / CONTACT TOASTER ---
function sendTelemetry(e) {
  e.preventDefault();
  
  const form = document.getElementById('signal-form');
  const caller = document.getElementById('caller-id').value;
  const channel = document.getElementById('return-channel').value;
  const message = document.getElementById('signal-payload').value;

  // Real log confirmation for testing
  console.log(`Telemetry signal received from ${caller} (${channel}): ${message}`);

  // Show Astro Bot console toaster alert
  const toaster = document.getElementById('contact-toaster');
  toaster.classList.add('show');

  // Trigger form reset
  form.reset();

  // Hide toaster after 4.5 seconds
  setTimeout(() => {
    toaster.classList.remove('show');
  }, 4500);
}

// --- 7. SCROLL SPY NAVIGATION ---
function initScrollSpy() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });
}

// --- 8. SYSTEM CONTROLLER PLAYGROUND & AUDIO SYNTH ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Retro PlayStation Synth Sound Effects Generator (Web Audio API)
function playControllerSound(type) {
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      // Short mechanical click sound (D-pad)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } 
    else if (type === 'laser') {
      // Future laser sweep (Triangle button)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } 
    else if (type === 'spin') {
      // High-speed vibrato sweep (Circle button)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.30);
      
      // Vibrato frequency modulation
      const mod = audioCtx.createOscillator();
      const modGain = audioCtx.createGain();
      mod.frequency.value = 35; // 35Hz modulation speed
      modGain.gain.value = 150; // vibrato range
      mod.connect(modGain);
      modGain.connect(osc.frequency);
      
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.30);
      
      mod.start(now);
      osc.start(now);
      mod.stop(now + 0.30);
      osc.stop(now + 0.30);
    } 
    else if (type === 'jump') {
      // Pitch slide sweep from low to high (Cross button)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } 
    else if (type === 'coin') {
      // Retro chime (Square button)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5 note
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6 note
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.setValueAtTime(0.1, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (err) {
    console.error("Audio Context initialization blocked/failed: ", err);
  }
}

// Controller Actions Interaction Logic
const PALETTES = [
  { name: 'cyan', blue: '197 100% 51%', darkBlue: '216 100% 45%' },
  { name: 'pink', blue: '290 80% 60%', darkBlue: '320 80% 50%' },
  { name: 'green', blue: '145 80% 50%', darkBlue: '160 80% 40%' },
  { name: 'gold', blue: '45 100% 50%', darkBlue: '35 100% 45%' }
];
let currentPaletteIdx = 0;
let botOffset = { x: 0, y: 0 };
let currentEyeColorIdx = 0;
const EYE_COLORS = ['#00bfff', '#ff4757', '#2ed573', '#eccc68'];

function triggerAction(action) {
  const avatar = document.querySelector('.astro-bot-avatar');

  if (action === 'triangle') {
    // 🔺 Triangle: Cycle theme colors
    playControllerSound('laser');
    currentPaletteIdx = (currentPaletteIdx + 1) % PALETTES.length;
    const palette = PALETTES[currentPaletteIdx];
    document.documentElement.style.setProperty('--color-astro-blue', palette.blue);
    document.documentElement.style.setProperty('--color-astro-dark-blue', palette.darkBlue);
    console.log(`System theme toggled to: ${palette.name.toUpperCase()}`);
  } 
  else if (action === 'circle') {
    // 🟡 Circle: Spin Attack
    playControllerSound('spin');
    if (avatar) {
      avatar.animate([
        { transform: `translate(${botOffset.x}px, ${botOffset.y}px) rotate(0deg)` },
        { transform: `translate(${botOffset.x}px, ${botOffset.y}px) rotate(360deg)` }
      ], {
        duration: 500,
        easing: 'ease-out'
      });
    }
  } 
  else if (action === 'cross') {
    // ❌ Cross: Hover Thruster Jump
    playControllerSound('jump');
    if (avatar) {
      // Bouncy jump animation
      avatar.animate([
        { transform: `translate(${botOffset.x}px, ${botOffset.y}px) scaleY(0.9)` },
        { transform: `translate(${botOffset.x}px, ${botOffset.y - 80}px) scaleY(1.05)` },
        { transform: `translate(${botOffset.x}px, ${botOffset.y}px) scaleY(1)` }
      ], {
        duration: 500,
        easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
      });

      // Emit huge spark particles at avatar's position!
      const rect = avatar.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height;
      for (let i = 0; i < 30; i++) {
        sparks.push({
          x: originX + (Math.random() - 0.5) * 40,
          y: originY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 5 + 3, // down thruster flame
          life: 1.0,
          decay: Math.random() * 0.05 + 0.03,
          size: Math.random() * 4 + 2
        });
      }
    }
  } 
  else if (action === 'square') {
    // 🟦 Square: Spawn Star Coins
    playControllerSound('coin');
    for (let i = 0; i < 6; i++) {
      spawnStarCoin();
    }
  }
}

function triggerDpad(direction) {
  playControllerSound('click');
  const avatar = document.querySelector('.astro-bot-avatar');
  if (!avatar) return;

  const moveStep = 30;
  if (direction === 'up') botOffset.y -= moveStep;
  else if (direction === 'down') botOffset.y += moveStep;
  else if (direction === 'left') botOffset.x -= moveStep;
  else if (direction === 'right') botOffset.x += moveStep;

  // Keep it constrained
  botOffset.x = Math.max(-200, Math.min(200, botOffset.x));
  botOffset.y = Math.max(-150, Math.min(150, botOffset.y));

  avatar.style.transform = `translate(${botOffset.x}px, ${botOffset.y}px)`;
}

function triggerTouchpad() {
  playControllerSound('click');
  const eyes = document.querySelectorAll('.astro-bot-eye');
  const touchpadBar = document.querySelector('.touchpad-bar');
  
  currentEyeColorIdx = (currentEyeColorIdx + 1) % EYE_COLORS.length;
  const color = EYE_COLORS[currentEyeColorIdx];

  eyes.forEach(eye => {
    eye.style.backgroundColor = color;
    eye.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}`;
  });

  if (touchpadBar) {
    touchpadBar.style.backgroundColor = color;
    touchpadBar.style.boxShadow = `0 0 15px ${color}`;
  }
}

function spawnStarCoin() {
  const coin = document.createElement('div');
  coin.className = 'astro-star-coin';
  coin.style.position = 'fixed';
  coin.style.left = `${Math.random() * 80 + 10}vw`;
  coin.style.bottom = `-50px`;
  coin.style.zIndex = '999';
  coin.style.animation = 'none'; // reset keyframes to manual transition
  document.body.appendChild(coin);

  const duration = Math.random() * 1500 + 1000;
  const startLeft = parseFloat(coin.style.left);
  const drift = (Math.random() - 0.5) * 15;

  coin.animate([
    { bottom: '-50px', transform: 'rotate(0deg) scale(0.6)', opacity: 1 },
    { bottom: '105vh', transform: `rotate(${Math.random() * 720}deg) scale(1.1)`, opacity: 0.1 }
  ], {
    duration: duration,
    easing: 'ease-out'
  });

  setTimeout(() => {
    coin.remove();
  }, duration);
}

// --- 9. SYSTEM BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initSkills();
  fetchLeetCodeStats();
  initVisor();
  initScrollSpy();
});
