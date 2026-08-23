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
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 5, 20); // Zoom in slightly
  camera.lookAt(0, 0, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // --- HTML Canvas for LCD Screen ---
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024;
  screenCanvas.height = 585; // 16:9ish
  const ctx = screenCanvas.getContext('2d');
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.generateMipmaps = false;
  screenTexture.minFilter = THREE.LinearFilter;

  // --- Object Construction (Procedural Workstation) ---
  const workstationGroup = new THREE.Group();

  // 1. Desk Surface
  const deskGeo = new THREE.BoxGeometry(11, 0.5, 7);
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
  stand.position.set(-1.5, 1, -1);
  stand.castShadow = true;
  workstationGroup.add(stand);

  // 3. Monitor Screen
  const monitorGeo = new THREE.BoxGeometry(8, 5, 0.5);
  const monitorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const monitor = new THREE.Mesh(monitorGeo, monitorMat);
  monitor.position.set(-1.5, 3.5, -0.8);
  monitor.castShadow = true;
  workstationGroup.add(monitor);

  // Screen Glow (Screen content simulation)
  const screenGeo = new THREE.PlaneGeometry(7.6, 4.6);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(-1.5, 3.5, -0.54);
  workstationGroup.add(screen);

  // 4. Keyboard
  const keyboardGeo = new THREE.BoxGeometry(3.5, 0.2, 1.2);
  const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
  const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
  keyboard.position.set(-2, 0.1, 1.5);
  keyboard.rotation.x = 0.05;
  keyboard.castShadow = true;
  workstationGroup.add(keyboard);

  // 5. Mouse
  const mouseGeo = new THREE.BoxGeometry(0.5, 0.25, 0.8);
  const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const mouse = new THREE.Mesh(mouseGeo, mouseMat);
  mouse.position.set(0.5, 0.125, 1.5);
  mouse.castShadow = true;
  workstationGroup.add(mouse);

  // 6. PC Tower (Right side)
  const pcGeo = new THREE.BoxGeometry(2.5, 6, 5);
  const pcMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.3 });
  const pc = new THREE.Mesh(pcGeo, pcMat);
  pc.position.set(3.5, 3, -1);
  pc.castShadow = true;
  workstationGroup.add(pc);
  
  // PC Glow Strip
  const stripGeo = new THREE.BoxGeometry(0.2, 5, 0.1);
  const stripMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(2.5, 3, 1.5);
  workstationGroup.add(strip);

  // Center the workstation correctly on the right side of the screen
  workstationGroup.position.set(4, -1, 0);
  workstationGroup.rotation.y = -0.15; // Angled slightly
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

  createFloater(floaterGeo1, floaterMat1, { x: 5, y: 3, z: 2 });
  createFloater(floaterGeo2, floaterMat2, { x: 1, y: 5, z: -2 });
  createFloater(floaterGeo3, floaterMat3, { x: 6, y: 1, z: 5 });
  createFloater(floaterGeo1, floaterMat2, { x: -4, y: 6, z: -5 });

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

  // --- LCD Animations ---
  const lcdServices = [
    { title: "BEST COMPUTER", sub: "Digital Services Center", bg: "#0a192f", fg: "#3b82f6", anim: "fade" },
    { title: "COMPUTER SERVICES", sub: "Windows & Troubleshooting", bg: "#0f2027", fg: "#75dfac", anim: "type" },
    { title: "GRAPHIC DESIGN", sub: "Creative & Print Media", bg: "#1e130c", fg: "#f59e0b", anim: "slide" },
    { title: "PHOTOSTUDIO", sub: "Professional Portraits", bg: "#16102a", fg: "#8b5cf6", anim: "scale" },
    { title: "NADRA SERVICES", sub: "E-Sahulat Center", bg: "#200909", fg: "#ef4444", anim: "glitch" }
  ];
  
  let currentServiceIdx = 0;
  let animProgress = 0;
  let lastSwitch = Date.now();

  function drawLCD() {
    const w = screenCanvas.width;
    const h = screenCanvas.height;
    const now = Date.now();
    const cycleTime = 2500;
    
    if (now - lastSwitch > cycleTime) {
      currentServiceIdx = (currentServiceIdx + 1) % lcdServices.length;
      lastSwitch = now;
      animProgress = 0;
    } else {
      animProgress = (now - lastSwitch) / cycleTime;
    }

    const svc = lcdServices[currentServiceIdx];
    
    // Fill BG
    ctx.fillStyle = svc.bg;
    ctx.fillRect(0, 0, w, h);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < w; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
    for (let i = 0; i < h; i += 40) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const title = svc.title;
    const sub = svc.sub;

    ctx.save();
    
    if (svc.anim === 'fade') {
      ctx.globalAlpha = Math.min(1, animProgress * 4);
      const yOffset = (1 - ctx.globalAlpha) * 20;
      ctx.fillStyle = svc.fg;
      ctx.font = 'bold 70px "Manrope", sans-serif';
      ctx.fillText(title, w/2, h/2 - 30 + yOffset);
      ctx.fillStyle = '#ffffff';
      ctx.font = '400 36px "DM Sans", sans-serif';
      ctx.fillText(sub, w/2, h/2 + 40 + yOffset);
    } else if (svc.anim === 'type') {
      const chars = Math.floor(animProgress * title.length * 2.5);
      const typed = title.substring(0, chars);
      ctx.fillStyle = svc.fg;
      ctx.font = 'bold 70px "Manrope", sans-serif';
      ctx.fillText(typed, w/2, h/2 - 30);
      if (animProgress > 0.4) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '400 36px "DM Sans", sans-serif';
        ctx.fillText(sub, w/2, h/2 + 40);
      }
    } else if (svc.anim === 'slide') {
      const xOffset = Math.max(0, (1 - animProgress * 4) * w);
      ctx.fillStyle = svc.fg;
      ctx.font = 'bold 70px "Manrope", sans-serif';
      ctx.fillText(title, w/2 + xOffset, h/2 - 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = '400 36px "DM Sans", sans-serif';
      ctx.fillText(sub, w/2 - xOffset, h/2 + 40);
    } else if (svc.anim === 'scale') {
      const s = Math.min(1, animProgress * 5);
      ctx.translate(w/2, h/2 - 30);
      ctx.scale(s, s);
      ctx.fillStyle = svc.fg;
      ctx.font = 'bold 70px "Manrope", sans-serif';
      ctx.fillText(title, 0, 0);
      ctx.scale(1/s, 1/s);
      ctx.translate(-w/2, -(h/2 - 30));
      if (animProgress > 0.2) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.min(1, (animProgress - 0.2) * 5);
        ctx.font = '400 36px "DM Sans", sans-serif';
        ctx.fillText(sub, w/2, h/2 + 40);
      }
    } else if (svc.anim === 'glitch') {
      ctx.font = 'bold 70px "Manrope", sans-serif';
      if (animProgress < 0.2 && Math.random() > 0.5) {
        ctx.fillStyle = 'cyan';
        ctx.fillText(title, w/2 - 5, h/2 - 30);
        ctx.fillStyle = 'red';
        ctx.fillText(title, w/2 + 5, h/2 - 30);
      } else {
        ctx.fillStyle = svc.fg;
        ctx.fillText(title, w/2, h/2 - 30);
      }
      ctx.fillStyle = '#ffffff';
      ctx.font = '400 36px "DM Sans", sans-serif';
      ctx.fillText(sub, w/2, h/2 + 40);
    }
    
    ctx.restore();
    
    screenTexture.needsUpdate = true;
  }

  // --- Interaction & Animation ---
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    drawLCD();

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
