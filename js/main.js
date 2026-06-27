import * as THREE from 'three';

// =============================================
// NEURAL SPHERE — Glowing Aurora 3D Object
// =============================================

const container = document.getElementById('sphere-container');
if (!container) throw new Error('Missing sphere-container');

const W = container.clientWidth || 500;
const H = container.clientHeight || 500;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
camera.position.set(0, 0, 5.5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ---- LIGHTS ----
const ambient = new THREE.AmbientLight(0x604080, 0.3);
scene.add(ambient);
const key = new THREE.DirectionalLight(0xa855f7, 1.5);
key.position.set(3, 4, 5);
scene.add(key);
const fill = new THREE.DirectionalLight(0x06b6d4, 0.8);
fill.position.set(-4, -2, 3);
scene.add(fill);

// ---- CORE GLOW SPHERE ----
const coreGeo = new THREE.SphereGeometry(1.1, 48, 48);
const coreMat = new THREE.MeshStandardMaterial({
  color: 0x1a1525,
  metalness: 0.3,
  roughness: 0.4,
  emissive: 0xa855f7,
  emissiveIntensity: 0.08,
});
const core = new THREE.Mesh(coreGeo, coreMat);
scene.add(core);

// ---- INNER GLOW LAYER ----
const glowGeo = new THREE.SphereGeometry(1.2, 32, 32);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0xa855f7,
  transparent: true,
  opacity: 0.06,
  wireframe: true,
});
const glowMesh = new THREE.Mesh(glowGeo, glowMat);
scene.add(glowMesh);

// ---- NEURAL NODES (Particles on sphere surface) ----
const nodeCount = 180;
const nodePos = [];
const nodeColors = [];
const colorPalette = [
  new THREE.Color(0x22d3a0),
  new THREE.Color(0x06b6d4),
  new THREE.Color(0xf59e0b),
  new THREE.Color(0xec4899),
  new THREE.Color(0xa855f7),
];

for (let i = 0; i < nodeCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 1.2 + Math.random() * 0.15;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);
  nodePos.push(x, y, z);
  const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  nodeColors.push(c.r, c.g, c.b);
}

const nodeGeo = new THREE.BufferGeometry();
nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePos, 3));
nodeGeo.setAttribute('color', new THREE.Float32BufferAttribute(nodeColors, 3));

const nodeMat = new THREE.PointsMaterial({
  size: 0.06,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
  depthWrite: false,
});

const nodes = new THREE.Points(nodeGeo, nodeMat);
scene.add(nodes);

// ---- NEURAL CONNECTIONS ----
function buildConnections(positions, maxDist) {
  const segPositions = [];
  const segColors = [];
  const count = positions.length / 3;

  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = positions[i*3] - positions[j*3];
      const dy = positions[i*3+1] - positions[j*3+1];
      const dz = positions[i*3+2] - positions[j*3+2];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      if (dist < maxDist && Math.random() < 0.15) {
        segPositions.push(
          positions[i*3], positions[i*3+1], positions[i*3+2],
          positions[j*3], positions[j*3+1], positions[j*3+2]
        );
        const c1 = new THREE.Color(nodeColors[i*3], nodeColors[i*3+1], nodeColors[i*3+2]);
        const c2 = new THREE.Color(nodeColors[j*3], nodeColors[j*3+1], nodeColors[j*3+2]);
        segColors.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b);
      }
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(segPositions, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(segColors, 3));
  return g;
}

const connGeo = buildConnections(nodePos, 0.6);
const connMat = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.2,
});
const connections = new THREE.LineSegments(connGeo, connMat);
scene.add(connections);

// ---- FLOATING RING ----
const ringMat = new THREE.MeshBasicMaterial({
  color: 0xa855f7,
  transparent: true,
  opacity: 0.08,
  side: THREE.DoubleSide,
  wireframe: true,
});
const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.015, 12, 56), ringMat);
ring.position.x = 0.3;
ring.position.y = 0.4;
ring.rotation.x = Math.PI / 3;
ring.rotation.z = 0.3;
scene.add(ring);

const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.01, 8, 48), ringMat.clone());
ring2.material.opacity = 0.05;
ring2.material.color.set(0x06b6d4);
ring2.position.x = -0.4;
ring2.position.y = -0.3;
ring2.rotation.x = -Math.PI / 4;
ring2.rotation.z = 0.8;
scene.add(ring2);

// ---- RESIZE ----
function resize() {
  const w = container.clientWidth || 500;
  const h = container.clientHeight || 500;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

window.addEventListener('resize', resize);

// ---- SCROLL EFFECT ----
let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
});

// ---- ANIMATE ----
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Rotate core and nodes together
  core.rotation.y = t * 0.15;
  core.rotation.x = Math.sin(t * 0.08) * 0.05;
  glowMesh.rotation.y = t * 0.18;
  glowMesh.rotation.x = Math.sin(t * 0.1) * 0.05;
  nodes.rotation.y = t * 0.15;
  nodes.rotation.x = Math.sin(t * 0.08) * 0.05;
  connections.rotation.y = t * 0.15;
  connections.rotation.x = Math.sin(t * 0.08) * 0.05;

  // Rings orbit
  ring.rotation.z += 0.003;
  ring.rotation.x += 0.001;
  ring2.rotation.z += 0.002;
  ring2.rotation.x += 0.002;

  // Pulse node opacity
  const pulse = 0.6 + Math.sin(t * 0.5) * 0.2;
  nodeMat.opacity = pulse;

  // Pulse connection opacity
  connMat.opacity = 0.1 + Math.sin(t * 0.3) * 0.08;

  // Scroll — push sphere back
  camera.position.z = 5.5 + scrollY * 2;

  // Mouse parallax (via CSS, already has canvas)
  renderer.render(scene, camera);
}

animate();

// =============================================
// MOUSE GLOW
// =============================================

const glow = document.querySelector('.mouse-glow');
document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => glow.style.opacity = '0');
document.addEventListener('mouseenter', () => glow.style.opacity = '1');

// =============================================
// NAV HIDE
// =============================================

let lastScroll = 0;
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (s > lastScroll && s > 80) {
    nav.style.transform = 'translateX(-50%) translateY(-120%)';
  } else {
    nav.style.transform = 'translateX(-50%) translateY(0)';
  }
  lastScroll = s;
});

// =============================================
// FADE IN ON SCROLL
// =============================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('section, .stats-grid, .work-bento, .skills-grid, .timeline, .contact-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// =============================================
// COUNTER ANIMATION
// =============================================

function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = target === 100 ? '+' : '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);
