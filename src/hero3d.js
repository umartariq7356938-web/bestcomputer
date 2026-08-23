import * as THREE from 'three';

// Performance Check: Disable on mobile or if prefers-reduced-motion is on
const isMobile = window.matchMedia('(max-width: 768px)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isMobile && !prefersReducedMotion) {
  init3DHero();
}

function init3DHero() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  // Optional: fog for depth
  scene.fog = new THREE.FogExp2(0x0a1128, 0.015);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 25); // Set further back
  camera.lookAt(0, 0, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // --- Object Construction (Procedural Workstation) ---
  const workstationGroup = new THREE.Group();

  // 1. Desk Surface
  const deskGeo = new THREE.BoxGeometry(16, 0.5, 8);
  const deskMat = new THREE.MeshStandardMaterial({ 
    color: 0x1e293b, 
    roughness: 0.8, 
    metalness: 0.2 
  });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.y = -0.25;
  desk.receiveShadow = true;
  workstationGroup.add(desk);

  // 2. Monitor Stand
  const standGeo = new THREE.BoxGeometry(1, 2, 0.5);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.set(0, 1, -1);
  stand.castShadow = true;
  workstationGroup.add(stand);

  // 3. Monitor Screen
  const monitorGeo = new THREE.BoxGeometry(8, 5, 0.5);
  const monitorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const monitor = new THREE.Mesh(monitorGeo, monitorMat);
  monitor.position.set(0, 3.5, -0.8);
  monitor.castShadow = true;
  workstationGroup.add(monitor);

  // Screen Glow (Screen content simulation)
  const screenGeo = new THREE.PlaneGeometry(7.6, 4.6);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 3.5, -0.54);
  workstationGroup.add(screen);

  // 4. Keyboard
  const keyboardGeo = new THREE.BoxGeometry(3.5, 0.2, 1.2);
  const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
  const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
  keyboard.position.set(-1, 0.1, 1.5);
  keyboard.rotation.x = 0.05;
  keyboard.castShadow = true;
  workstationGroup.add(keyboard);

  // 5. Mouse
  const mouseGeo = new THREE.BoxGeometry(0.5, 0.25, 0.8);
  const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const mouse = new THREE.Mesh(mouseGeo, mouseMat);
  mouse.position.set(1.5, 0.125, 1.5);
  mouse.castShadow = true;
  workstationGroup.add(mouse);

  // 6. PC Tower (Right side)
  const pcGeo = new THREE.BoxGeometry(2.5, 6, 5);
  const pcMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.3 });
  const pc = new THREE.Mesh(pcGeo, pcMat);
  pc.position.set(5, 3, -1);
  pc.castShadow = true;
  workstationGroup.add(pc);
  
  // PC Glow Strip
  const stripGeo = new THREE.BoxGeometry(0.2, 5, 0.1);
  const stripMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(4, 3, 1.5);
  workstationGroup.add(strip);

  // Center the workstation and move slightly to the right so text fits on the left
  workstationGroup.position.set(4, -2, 0);
  workstationGroup.rotation.y = -0.15; // Angled slightly towards center
  scene.add(workstationGroup);

  // --- Floating Tech Elements ---
  const floaters = [];
  const floaterGeo1 = new THREE.IcosahedronGeometry(0.5, 0);
  const floaterGeo2 = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const floaterGeo3 = new THREE.TetrahedronGeometry(0.6, 0);
  
  const floaterMat1 = new THREE.MeshStandardMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.6 });
  const floaterMat2 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.8 });
  const floaterMat3 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4, transparent: true, opacity: 0.7 });

  const createFloater = (geo, mat, pos) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.initialY = pos.y;
    mesh.speed = Math.random() * 0.02 + 0.01;
    mesh.offset = Math.random() * Math.PI * 2;
    scene.add(mesh);
    floaters.push(mesh);
  };

  createFloater(floaterGeo1, floaterMat1, { x: 8, y: 3, z: 2 });
  createFloater(floaterGeo2, floaterMat2, { x: 2, y: 5, z: -2 });
  createFloater(floaterGeo3, floaterMat3, { x: 10, y: 1, z: 5 });
  createFloater(floaterGeo1, floaterMat2, { x: -2, y: 6, z: -5 });

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.PointLight(0x3b82f6, 1.5, 50);
  mainLight.position.set(0, 10, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const accentLight = new THREE.PointLight(0x8b5cf6, 1.5, 50);
  accentLight.position.set(10, 5, -5);
  scene.add(accentLight);

  // --- Interaction & Animation ---
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();

    // Smooth interaction interpolation
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;

    // Subtle rotation of the entire group
    workstationGroup.rotation.y += 0.05 * (targetX - workstationGroup.rotation.y) - 0.005; // Base offset
    workstationGroup.rotation.x += 0.05 * (targetY - workstationGroup.rotation.x);

    // Parallax camera slightly
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 + 5 - camera.position.y) * 0.05; // Base Y is 5
    camera.lookAt(0, 0, 0);

    // Animate floaters
    floaters.forEach(mesh => {
      mesh.position.y = mesh.initialY + Math.sin(time + mesh.offset) * 0.5;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
  }

  animate();
}
