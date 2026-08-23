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

  // Center the workstation correctly on the right side of the screen and lower it
  workstationGroup.position.set(6, -2.5, 0);
  workstationGroup.rotation.y = -0.15; // Angled slightly
  scene.add(workstationGroup);

  // --- Floating Tech Elements ---
  const floaters = [];
  const floaterGeo1 = new THREE.IcosahedronGeometry(0.5, 0);
  const floaterGeo2 = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const floaterGeo3 = new THREE.TetrahedronGeometry(0.6, 0);
  
  const floaterMat1 = new THREE.MeshStandardMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.4 });
  const floaterMat2 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.5 });
  const floaterMat3 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4, transparent: true, opacity: 0.4 });

  const createFloater = (geo, mat, pos) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.initialY = pos.y;
    mesh.speed = Math.random() * 0.01 + 0.005; // Slower floating
    mesh.offset = Math.random() * Math.PI * 2;
    scene.add(mesh);
    floaters.push(mesh);
  };

  createFloater(floaterGeo1, floaterMat1, { x: 7, y: 2, z: 2 });
  createFloater(floaterGeo2, floaterMat2, { x: 3, y: 4, z: -2 });
  createFloater(floaterGeo3, floaterMat3, { x: 8, y: 0, z: 5 });
  createFloater(floaterGeo1, floaterMat2, { x: -2, y: 5, z: -5 });

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.PointLight(0x3b82f6, 1.2, 50);
  mainLight.position.set(0, 10, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const accentLight = new THREE.PointLight(0x8b5cf6, 1.2, 50);
  accentLight.position.set(10, 5, -5);
  scene.add(accentLight);

  // --- LCD Animations ---
  const lcdServices = [
    { title: "BEST COMPUTER", sub: "Digital Service Center", fg: "#38bdf8", anim: "fade" },
    { title: "COMPUTER REPAIR", sub: "Windows & Installation", fg: "#34d399", anim: "slideUp" },
    { title: "GRAPHIC DESIGN", sub: "Creative Print Media", fg: "#fbbf24", anim: "slideRight" },
    { title: "PHOTOSTUDIO", sub: "Professional Portraits", fg: "#a78bfa", anim: "scale" },
    { title: "NADRA E-SAHULAT", sub: "Bill Payments & Services", fg: "#f472b6", anim: "type" }
  ];
  
  let currentServiceIdx = 0;
  let lastSwitch = Date.now();

  function drawLCD() {
    const w = screenCanvas.width;
    const h = screenCanvas.height;
    const now = Date.now();
    const cycleTime = 4500; // 4.5 seconds per slide (slower, easier on eyes)
    
    if (now - lastSwitch > cycleTime) {
      currentServiceIdx = (currentServiceIdx + 1) % lcdServices.length;
      lastSwitch = now;
    }

    const elapsed = now - lastSwitch;
    // Animation takes 1.5 seconds, then holds steady
    let progress = Math.min(1, elapsed / 1500);
    // Smooth easing function (easeOutCubic)
    const ease = 1 - Math.pow(1 - progress, 3);

    const svc = lcdServices[currentServiceIdx];
    
    // Constant, soft dark background to prevent eye strain from color flashes
    ctx.fillStyle = "#0b1221";
    ctx.fillRect(0, 0, w, h);
    
    // Very subtle, stable grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < w; i += 50) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
    for (let i = 0; i < h; i += 50) { ctx.moveTo(0, i); ctx.lineTo(w, i); }
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const title = svc.title;
    const sub = svc.sub;

    ctx.save();
    
    // Set common soft fonts
    const titleFont = 'bold 64px "Manrope", sans-serif';
    const subFont = '400 32px "DM Sans", sans-serif';
    
    if (svc.anim === 'fade') {
      ctx.globalAlpha = ease;
      ctx.fillStyle = svc.fg;
      ctx.font = titleFont;
      ctx.fillText(title, w/2, h/2 - 25);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = subFont;
      ctx.fillText(sub, w/2, h/2 + 35);
    } else if (svc.anim === 'slideUp') {
      ctx.globalAlpha = ease;
      const yOffset = (1 - ease) * 30;
      ctx.fillStyle = svc.fg;
      ctx.font = titleFont;
      ctx.fillText(title, w/2, h/2 - 25 + yOffset);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = subFont;
      ctx.fillText(sub, w/2, h/2 + 35 + yOffset);
    } else if (svc.anim === 'slideRight') {
      ctx.globalAlpha = ease;
      const xOffset = (1 - ease) * 40;
      ctx.fillStyle = svc.fg;
      ctx.font = titleFont;
      ctx.fillText(title, w/2 + xOffset, h/2 - 25);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = subFont;
      ctx.fillText(sub, w/2 + xOffset, h/2 + 35);
    } else if (svc.anim === 'scale') {
      ctx.globalAlpha = ease;
      const s = 0.9 + (ease * 0.1);
      ctx.translate(w/2, h/2 - 25);
      ctx.scale(s, s);
      ctx.fillStyle = svc.fg;
      ctx.font = titleFont;
      ctx.fillText(title, 0, 0);
      ctx.scale(1/s, 1/s);
      ctx.translate(-w/2, -(h/2 - 25));
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = subFont;
      ctx.fillText(sub, w/2, h/2 + 35);
    } else if (svc.anim === 'type') {
      const chars = Math.floor(ease * title.length);
      const typed = title.substring(0, chars);
      ctx.fillStyle = svc.fg;
      ctx.font = titleFont;
      ctx.fillText(typed, w/2, h/2 - 25);
      if (progress > 0.8) {
        ctx.globalAlpha = (progress - 0.8) * 5; // fade sub in at end
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = subFont;
        ctx.fillText(sub, w/2, h/2 + 35);
      }
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
    // Reduced sensitivity to avoid dizzying movement
    mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
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

    // Smooth, very slow interaction interpolation
    targetX = mouseX * 0.3;
    targetY = mouseY * 0.3;

    // Subtle rotation of the entire group
    workstationGroup.rotation.y += 0.03 * (targetX - workstationGroup.rotation.y) - 0.002; // Minimal offset
    workstationGroup.rotation.x += 0.03 * (targetY - workstationGroup.rotation.x);

    // Parallax camera slightly (gentler movement)
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2 + 5 - camera.position.y) * 0.03; // Base Y is 5
    camera.lookAt(0, 0, 0);

    // Animate floaters gently
    floaters.forEach(mesh => {
      mesh.position.y = mesh.initialY + Math.sin(time * 0.5 + mesh.offset) * 0.3;
      mesh.rotation.x += mesh.speed;
      mesh.rotation.y += mesh.speed;
    });

    renderer.render(scene, camera);
  }

  animate();
}
