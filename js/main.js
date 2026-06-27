import * as THREE from 'three';

// =============================================
// THREE.JS 3D SCENE
// =============================================

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 12);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
canvas.appendChild(renderer.domElement);

// ---- LIGHTS ----
const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xc87d4f, 2.5);
mainLight.position.set(5, 10, 7);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xe8a87c, 1.0);
fillLight.position.set(-5, -2, 5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xda8a67, 1.5);
rimLight.position.set(0, -5, -5);
scene.add(rimLight);

// ---- MATERIALS (Copper palette) ----
const copperMat = new THREE.MeshStandardMaterial({
  color: 0xc87d4f,
  metalness: 0.8,
  roughness: 0.25,
  envMapIntensity: 1.0,
});

const copperMatLight = new THREE.MeshStandardMaterial({
  color: 0xe8a87c,
  metalness: 0.6,
  roughness: 0.3,
  envMapIntensity: 0.8,
});

const copperMatDark = new THREE.MeshStandardMaterial({
  color: 0xa3582e,
  metalness: 0.9,
  roughness: 0.2,
  envMapIntensity: 1.2,
});

const wireframeMat = new THREE.MeshBasicMaterial({
  color: 0xc87d4f,
  wireframe: true,
  transparent: true,
  opacity: 0.15,
});

// ---- GEOMETRIES ----
const geometries = [];

// ---- 3D HUMAN FIGURE (Realistic Anatomy) ----
const humanGroup = new THREE.Group();

const skinMat = new THREE.MeshStandardMaterial({
  color: 0xc87d4f,
  metalness: 0.65,
  roughness: 0.3,
  envMapIntensity: 0.8,
});

const skinMatLight = new THREE.MeshStandardMaterial({
  color: 0xe8a87c,
  metalness: 0.5,
  roughness: 0.35,
  envMapIntensity: 0.6,
});

const skinMatDark = new THREE.MeshStandardMaterial({
  color: 0xa3582e,
  metalness: 0.75,
  roughness: 0.25,
  envMapIntensity: 1.0,
});

const jointMat = new THREE.MeshStandardMaterial({
  color: 0xda8a67,
  metalness: 0.6,
  roughness: 0.3,
});

// --- HEAD ---
const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 28), skinMat);
head.position.y = 2.15;
head.scale.set(1, 1.05, 0.92);
humanGroup.add(head);

// Eyes (subtle copper dots)
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2a1f1a });
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), eyeMat);
leftEye.position.set(-0.14, 2.22, -0.38);
humanGroup.add(leftEye);
const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), eyeMat);
rightEye.position.set(0.14, 2.22, -0.38);
humanGroup.add(rightEye);

// Eye glow
const glowMat = new THREE.MeshBasicMaterial({ color: 0xc87d4f, transparent: true, opacity: 0.3 });
const leftGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat);
leftGlow.position.set(-0.14, 2.22, -0.4);
humanGroup.add(leftGlow);
const rightGlow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat);
rightGlow.position.set(0.14, 2.22, -0.4);
humanGroup.add(rightGlow);

// --- NECK ---
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.3, 16), skinMat);
neck.position.y = 1.82;
humanGroup.add(neck);

// --- TORSO ---
// Upper chest
const upperTorso = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.45, 0.6, 20),
  skinMatLight
);
upperTorso.position.y = 1.4;
humanGroup.add(upperTorso);

// Lower torso (waist)
const lowerTorso = new THREE.Mesh(
  new THREE.CylinderGeometry(0.45, 0.38, 0.5, 20),
  skinMat
);
lowerTorso.position.y = 0.88;
humanGroup.add(lowerTorso);

// Shoulders (capsule-like)
const shoulderMat = skinMatDark;
const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), shoulderMat);
leftShoulder.position.set(-0.6, 1.55, 0);
leftShoulder.scale.set(1, 0.75, 0.85);
humanGroup.add(leftShoulder);
const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), shoulderMat);
rightShoulder.position.set(0.6, 1.55, 0);
rightShoulder.scale.set(1, 0.75, 0.85);
humanGroup.add(rightShoulder);

// Pecs hint
const pecsMat = new THREE.MeshStandardMaterial({
  color: 0xcc8655, metalness: 0.5, roughness: 0.4, transparent: true, opacity: 0.3
});
const leftPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), pecsMat);
leftPec.position.set(-0.2, 1.45, 0.4);
leftPec.scale.set(1, 0.6, 0.4);
humanGroup.add(leftPec);
const rightPec = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), pecsMat);
rightPec.position.set(0.2, 1.45, 0.4);
rightPec.scale.set(1, 0.6, 0.4);
humanGroup.add(rightPec);

// --- ARMS ---
// Left arm group
const leftArmGroup = new THREE.Group();
leftArmGroup.position.set(-0.62, 1.5, 0);

// Left upper arm
const leftUpperArm = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.13, 0.55, 12), skinMat
);
leftUpperArm.position.set(0, -0.28, 0);
leftUpperArm.rotation.z = 0.1;
leftArmGroup.add(leftUpperArm);

// Left elbow joint
const leftElbow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), jointMat);
leftElbow.position.set(0, -0.53, 0);
leftArmGroup.add(leftElbow);

// Left forearm
const leftForearm = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.09, 0.5, 12), skinMatLight
);
leftForearm.position.set(0, -0.78, 0);
leftForearm.rotation.z = -0.05;
leftArmGroup.add(leftForearm);

// Left hand
const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMatDark);
leftHand.position.set(0, -1.05, 0);
leftHand.scale.set(1, 0.8, 0.6);
leftArmGroup.add(leftHand);

leftArmGroup.rotation.z = 0.25;
leftArmGroup.rotation.x = -0.2;
humanGroup.add(leftArmGroup);

// Right arm group
const rightArmGroup = new THREE.Group();
rightArmGroup.position.set(0.62, 1.5, 0);

const rightUpperArm = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.13, 0.55, 12), skinMat
);
rightUpperArm.position.set(0, -0.28, 0);
rightUpperArm.rotation.z = -0.1;
rightArmGroup.add(rightUpperArm);

const rightElbow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), jointMat);
rightElbow.position.set(0, -0.53, 0);
rightArmGroup.add(rightElbow);

const rightForearm = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.09, 0.5, 12), skinMatLight
);
rightForearm.position.set(0, -0.78, 0);
rightForearm.rotation.z = 0.05;
rightArmGroup.add(rightForearm);

const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skinMatDark);
rightHand.position.set(0, -1.05, 0);
rightHand.scale.set(1, 0.8, 0.6);
rightArmGroup.add(rightHand);

rightArmGroup.rotation.z = -0.25;
rightArmGroup.rotation.x = 0.2;
humanGroup.add(rightArmGroup);

// --- LEGS ---
// Left leg group
const leftLegGroup = new THREE.Group();
leftLegGroup.position.set(-0.2, 0.65, 0);

const leftThigh = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.14, 0.6, 12), skinMat
);
leftThigh.position.set(0, -0.3, 0);
leftThigh.rotation.x = 0.05;
leftLegGroup.add(leftThigh);

const leftKnee = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), jointMat);
leftKnee.position.set(0, -0.6, 0);
leftLegGroup.add(leftKnee);

const leftShin = new THREE.Mesh(
  new THREE.CylinderGeometry(0.14, 0.1, 0.55, 12), skinMatLight
);
leftShin.position.set(0, -0.88, 0);
leftShin.rotation.x = -0.03;
leftLegGroup.add(leftShin);

const leftFoot = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.07, 0.22), skinMatDark
);
leftFoot.position.set(0, -1.15, 0.06);
leftFoot.rotation.x = 0.1;
leftLegGroup.add(leftFoot);

humanGroup.add(leftLegGroup);

// Right leg group
const rightLegGroup = new THREE.Group();
rightLegGroup.position.set(0.2, 0.65, 0);

const rightThigh = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.14, 0.6, 12), skinMat
);
rightThigh.position.set(0, -0.3, 0);
rightThigh.rotation.x = -0.05;
rightLegGroup.add(rightThigh);

const rightKnee = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), jointMat);
rightKnee.position.set(0, -0.6, 0);
rightLegGroup.add(rightKnee);

const rightShin = new THREE.Mesh(
  new THREE.CylinderGeometry(0.14, 0.1, 0.55, 12), skinMatLight
);
rightShin.position.set(0, -0.88, 0);
rightShin.rotation.x = 0.03;
rightLegGroup.add(rightShin);

const rightFoot = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.07, 0.22), skinMatDark
);
rightFoot.position.set(0, -1.15, 0.06);
rightFoot.rotation.x = -0.1;
rightLegGroup.add(rightFoot);

humanGroup.add(rightLegGroup);

// --- AURA ---
const auraWire = new THREE.Mesh(
  new THREE.SphereGeometry(1.8, 28, 20),
  new THREE.MeshBasicMaterial({
    color: 0xc87d4f,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
  })
);
auraWire.position.y = 1.0;
humanGroup.add(auraWire);

// Floating copper particles around human
const humanParticleCount = 40;
const hpPositions = new Float32Array(humanParticleCount * 3);
for (let i = 0; i < humanParticleCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 1.6 + Math.random() * 0.8;
  hpPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  hpPositions[i * 3 + 1] = r * Math.cos(phi) + 1.0;
  hpPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
const hpGeo = new THREE.BufferGeometry();
hpGeo.setAttribute('position', new THREE.BufferAttribute(hpPositions, 3));
const hpMat = new THREE.PointsMaterial({
  color: 0xc87d4f,
  size: 0.04,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});
const humanParticles = new THREE.Points(hpGeo, hpMat);
humanGroup.add(humanParticles);

humanGroup.position.y = -1.2;
humanGroup.scale.set(1, 1, 1);
scene.add(humanGroup);
geometries.push(humanGroup);

// Icosahedron
const ico = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.8, 0),
  copperMatLight
);
ico.position.set(-3.5, 1.5, -2);
scene.add(ico);
geometries.push(ico);

// Octahedron
const oct = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.7, 0),
  copperMatDark
);
oct.position.set(3.8, -1, -3);
scene.add(oct);
geometries.push(oct);

// Small dodecahedron
const dod = new THREE.Mesh(
  new THREE.DodecahedronGeometry(0.5, 0),
  copperMatLight
);
dod.position.set(-2.5, -2, 1);
scene.add(dod);
geometries.push(dod);

// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.6, 0.2, 32, 32),
  copperMatDark
);
torus.position.set(2.8, 2, -1);
scene.add(torus);
geometries.push(torus);

// ---- RINGS (orbital rings) ----
const ringGeo = new THREE.RingGeometry(0.8, 0.85, 64);
const ringMat = new THREE.MeshBasicMaterial({
  color: 0xc87d4f,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide,
});

const ring1 = new THREE.Mesh(ringGeo, ringMat);
ring1.position.y = 0.5;
ring1.rotation.x = Math.PI / 3;
ring1.rotation.z = 0.2;
scene.add(ring1);

const ring2 = new THREE.Mesh(ringGeo, ringMat);
ring2.position.y = 0.5;
ring2.rotation.x = -Math.PI / 4;
ring2.rotation.z = 0.8;
ring2.scale.set(1.8, 1.8, 1.8);
ring2.material = ringMat.clone();
ring2.material.opacity = 0.1;
scene.add(ring2);

// ---- PARTICLES ----
const particleCount = 800;
const positions = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 4 + Math.random() * 8;

  positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.cos(phi);
  positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

  sizes[i] = 0.02 + Math.random() * 0.04;
}

const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const particleTexture = new THREE.CanvasTexture(generateParticleCanvas());
const particleMat = new THREE.PointsMaterial({
  color: 0xc87d4f,
  size: 0.06,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  map: particleTexture,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

function generateParticleCanvas() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d');
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(200, 125, 79, 1)');
  gradient.addColorStop(0.3, 'rgba(200, 125, 79, 0.5)');
  gradient.addColorStop(1, 'rgba(200, 125, 79, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);
  return c;
}

// ---- MOUSE TRACKING ----
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ---- SCROLL EFFECT ----
let scrollY = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
});

// ---- RESIZE ----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- ANIMATION LOOP ----
function animate() {
  requestAnimationFrame(animate);

  // Smooth mouse following
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  // Human idle animation — subtle breathe, sway, and arm swing
  const breathe = Math.sin(Date.now() * 0.0015) * 0.02;
  humanGroup.position.y = -1.2 + breathe;
  humanGroup.rotation.y += 0.004;
  const armSwing = Math.sin(Date.now() * 0.002) * 0.04;
  leftArmGroup.rotation.x = -0.2 + armSwing;
  rightArmGroup.rotation.x = 0.2 - armSwing;
  // Subtle head tilt
  head.rotation.z = Math.sin(Date.now() * 0.001) * 0.015;
  // Particles rotate
  humanParticles.rotation.y += 0.005;

  // Orbiting geometries
  ico.rotation.x += 0.005;
  ico.rotation.y += 0.01;
  oct.rotation.x += 0.008;
  oct.rotation.y += 0.006;
  dod.rotation.x += 0.01;
  dod.rotation.y += 0.005;
  torus.rotation.x += 0.006;
  torus.rotation.z += 0.004;

  // Orbital rings
  ring1.rotation.z += 0.002;
  ring2.rotation.x += 0.003;

  // Parallax
  const rotY = targetX * 0.2;
  const rotX = targetY * 0.1;

  scene.rotation.y += (rotY - scene.rotation.y) * 0.02;
  scene.rotation.x += (rotX - scene.rotation.x) * 0.02;

  // Scroll effect - camera push
  camera.position.z = 12 + scrollY * 4;

  // Particle rotation
  particles.rotation.y += 0.0003;
  particles.rotation.x += 0.0001;

  renderer.render(scene, camera);
}

animate();

// ---- NAV HIDE ON SCROLL ----
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 100) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScroll = currentScroll;
});

// ---- CUSTOM CURSOR ----
const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
});

// Scale cursor on hoverable elements
document.querySelectorAll('a, button, .skill-card, .work-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '60px';
    cursor.style.height = '60px';
    cursor.style.background = 'radial-gradient(circle, rgba(200,125,79,0.25), transparent 70%)';
  });

  el.addEventListener('mouseleave', () => {
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.background = 'radial-gradient(circle, rgba(200,125,79,0.4), transparent 70%)';
  });
});

// ---- TILT CARDS ----
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

// ---- INTERSECTION OBSERVER (animate skill bars on view) ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.fill').forEach(bar => {
        bar.style.width = bar.style.width;
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));

console.log('🚀 Copper Portfolio — Dimension Engine Active');
