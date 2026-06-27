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

// Central torus knot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32),
  copperMat
);
torusKnot.position.y = 0.5;
scene.add(torusKnot);
geometries.push(torusKnot);

// Wireframe torus knot
const wireKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.4, 0.4, 64, 16),
  wireframeMat
);
wireKnot.position.y = 0.5;
scene.add(wireKnot);
geometries.push(wireKnot);

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

  // Rotate central geometry
  torusKnot.rotation.x += 0.003;
  torusKnot.rotation.y += 0.008;
  wireKnot.rotation.x = torusKnot.rotation.x;
  wireKnot.rotation.y = torusKnot.rotation.y;

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
