import * as THREE from 'three';

// =============================================
// 3D Scene — Copper Human Figure
// =============================================

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
canvas.appendChild(renderer.domElement);

// ---- LIGHTS ----
const ambient = new THREE.AmbientLight(0x807060, 0.4);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xc49577, 2.0);
key.position.set(4, 6, 5);
scene.add(key);

const fill = new THREE.DirectionalLight(0xdcc0aa, 0.8);
fill.position.set(-4, 2, 3);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xb07a56, 1.2);
rim.position.set(0, -4, -5);
scene.add(rim);

// ---- MATERIALS ----
const copper = new THREE.MeshStandardMaterial({
  color: 0xb07a56,
  metalness: 0.7,
  roughness: 0.3,
});

const copperLight = new THREE.MeshStandardMaterial({
  color: 0xc49577,
  metalness: 0.6,
  roughness: 0.35,
});

const copperDark = new THREE.MeshStandardMaterial({
  color: 0x9a6440,
  metalness: 0.8,
  roughness: 0.25,
});

const copperAccent = new THREE.MeshStandardMaterial({
  color: 0xdcc0aa,
  metalness: 0.5,
  roughness: 0.4,
});

// ---- HUMAN FIGURE (Smooth Capsule) ----
const human = new THREE.Group();

// Head
const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 28, 24), copperLight);
head.position.y = 2.0;
head.scale.set(1, 1.05, 0.9);
human.add(head);

// Eyes
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x2a1f1a });
const eL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), eyeMat);
eL.position.set(-0.13, 2.06, -0.36);
human.add(eL);
const eR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 10), eyeMat);
eR.position.set(0.13, 2.06, -0.36);
human.add(eR);

// Eye glow
const glowMat = new THREE.MeshBasicMaterial({ color: 0xb07a56, transparent: true, opacity: 0.2 });
const gL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), glowMat);
gL.position.set(-0.13, 2.06, -0.38);
human.add(gL);
const gR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), glowMat);
gR.position.set(0.13, 2.06, -0.38);
human.add(gR);

// Neck
const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.2, 8, 12), copper);
neck.position.y = 1.7;
neck.rotation.x = 0.05;
human.add(neck);

// Torso
const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.6, 10, 16), copper);
torso.position.y = 1.15;
human.add(torso);

// Upper torso accent
const chestAccent = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.3, 8, 14), copperLight);
chestAccent.position.set(0, 1.4, 0.3);
chestAccent.scale.set(1, 0.7, 0.5);
human.add(chestAccent);

// ---- ARMS ----
// Left arm
const leftArmGroup = new THREE.Group();
leftArmGroup.position.set(-0.52, 1.5, 0);

const leftUpper = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.4, 8, 10), copper);
leftUpper.position.set(0, -0.22, 0);
leftUpper.rotation.x = 0.1;
leftArmGroup.add(leftUpper);

const leftLower = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.35, 8, 10), copperLight);
leftLower.position.set(0, -0.6, 0);
leftLower.rotation.x = -0.15;
leftArmGroup.add(leftLower);

const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), copperDark);
leftHand.position.set(0, -0.82, 0);
leftHand.scale.set(0.8, 0.7, 0.5);
leftArmGroup.add(leftHand);

leftArmGroup.rotation.z = 0.2;
leftArmGroup.rotation.x = -0.15;
human.add(leftArmGroup);

// Right arm
const rightArmGroup = new THREE.Group();
rightArmGroup.position.set(0.52, 1.5, 0);

const rightUpper = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.4, 8, 10), copper);
rightUpper.position.set(0, -0.22, 0);
rightUpper.rotation.x = -0.1;
rightArmGroup.add(rightUpper);

const rightLower = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.35, 8, 10), copperLight);
rightLower.position.set(0, -0.6, 0);
rightLower.rotation.x = 0.15;
rightArmGroup.add(rightLower);

const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), copperDark);
rightHand.position.set(0, -0.82, 0);
rightHand.scale.set(0.8, 0.7, 0.5);
rightArmGroup.add(rightHand);

rightArmGroup.rotation.z = -0.2;
rightArmGroup.rotation.x = 0.15;
human.add(rightArmGroup);

// ---- LEGS ----
// Left leg
const leftLegGroup = new THREE.Group();
leftLegGroup.position.set(-0.18, 0.6, 0);

const leftUpperLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.4, 8, 10), copper);
leftUpperLeg.position.set(0, -0.22, 0);
leftUpperLeg.rotation.x = 0.05;
leftLegGroup.add(leftUpperLeg);

const leftLowerLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.4, 8, 10), copperLight);
leftLowerLeg.position.set(0, -0.62, 0);
leftLowerLeg.rotation.x = -0.05;
leftLegGroup.add(leftLowerLeg);

const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.2), copperDark);
leftFoot.position.set(0, -0.85, 0.05);
leftFoot.rotation.x = 0.1;
leftLegGroup.add(leftFoot);

human.add(leftLegGroup);

// Right leg
const rightLegGroup = new THREE.Group();
rightLegGroup.position.set(0.18, 0.6, 0);

const rightUpperLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.4, 8, 10), copper);
rightUpperLeg.position.set(0, -0.22, 0);
rightUpperLeg.rotation.x = -0.05;
rightLegGroup.add(rightUpperLeg);

const rightLowerLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.4, 8, 10), copperLight);
rightLowerLeg.position.set(0, -0.62, 0);
rightLowerLeg.rotation.x = 0.05;
rightLegGroup.add(rightLowerLeg);

const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.2), copperDark);
rightFoot.position.set(0, -0.85, 0.05);
rightFoot.rotation.x = -0.1;
rightLegGroup.add(rightFoot);

human.add(rightLegGroup);

// ---- AURA (subtle wireframe sphere) ----
const aura = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 22, 16),
  new THREE.MeshBasicMaterial({
    color: 0xb07a56,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  })
);
aura.position.y = 0.9;
human.add(aura);

// ---- FLOATING PARTICLES ----
const hpCount = 30;
const hpPos = new Float32Array(hpCount * 3);
for (let i = 0; i < hpCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 1.4 + Math.random() * 0.6;
  hpPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
  hpPos[i*3+1] = r * Math.cos(phi) + 0.9;
  hpPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
}
const hpGeo = new THREE.BufferGeometry();
hpGeo.setAttribute('position', new THREE.BufferAttribute(hpPos, 3));
const hpParticles = new THREE.Points(
  hpGeo,
  new THREE.PointsMaterial({
    color: 0xb07a56,
    size: 0.035,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })
);
human.add(hpParticles);

human.position.y = -1.0;
scene.add(human);

// ---- ORBITING GEOMETRIES (Subtle) ----
const ringMat = new THREE.MeshBasicMaterial({
  color: 0xb07a56,
  transparent: true,
  opacity: 0.1,
  side: THREE.DoubleSide,
  wireframe: true,
});

const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.02, 16, 48), ringMat);
ring1.position.y = 0.9;
ring1.rotation.x = Math.PI / 3;
ring1.rotation.z = 0.3;
scene.add(ring1);

const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.015, 12, 48), ringMat.clone());
ring2.material.opacity = 0.06;
ring2.position.y = 0.9;
ring2.rotation.x = -Math.PI / 4;
ring2.rotation.z = 0.6;
scene.add(ring2);

// ---- BACKGROUND PARTICLES ----
const bgPartCount = 400;
const bgPos = new Float32Array(bgPartCount * 3);
for (let i = 0; i < bgPartCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 5 + Math.random() * 10;
  bgPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
  bgPos[i*3+1] = r * Math.cos(phi);
  bgPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
}
const bgGeo = new THREE.BufferGeometry();
bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
const bgParticles = new THREE.Points(
  bgGeo,
  new THREE.PointsMaterial({
    color: 0xb07a56,
    size: 0.04,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })
);
scene.add(bgParticles);

// ---- MOUSE ----
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', (e) => {
  mx = (e.clientX / window.innerWidth) * 2 - 1;
  my = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ---- SCROLL ----
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

// ---- ANIMATE ----
function animate() {
  requestAnimationFrame(animate);

  tx += (mx - tx) * 0.04;
  ty += (my - ty) * 0.04;

  // Human: breathe, sway, rotate
  const breathe = Math.sin(Date.now() * 0.0012) * 0.015;
  human.position.y = -1.0 + breathe;
  human.rotation.y += 0.003;

  // Arm swing
  const swing = Math.sin(Date.now() * 0.0018) * 0.03;
  leftArmGroup.rotation.x = -0.15 + swing;
  rightArmGroup.rotation.x = 0.15 - swing;

  // Subtle head tilt
  head.rotation.z = Math.sin(Date.now() * 0.0008) * 0.012;

  // Particles
  hpParticles.rotation.y += 0.004;

  // Orbital rings
  ring1.rotation.z += 0.0015;
  ring2.rotation.x += 0.002;

  // Background particles
  bgParticles.rotation.y += 0.0002;

  // Parallax
  scene.rotation.y += ((tx * 0.15) - scene.rotation.y) * 0.015;
  scene.rotation.x += ((ty * 0.08) - scene.rotation.x) * 0.015;

  // Scroll push
  camera.position.z = 10 + scrollY * 3;

  renderer.render(scene, camera);
}

animate();

// ---- NAV ----
let lastScroll = 0;
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  nav.style.transform = s > lastScroll && s > 80 ? 'translateY(-100%)' : 'translateY(0)';
  lastScroll = s;
});

// ---- FADE IN ON SCROLL ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section, .city-divider').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
