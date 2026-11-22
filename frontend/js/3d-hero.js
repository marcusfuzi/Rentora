/* ===================================================================
   RENTORA – THREE.JS 3D HERO GADGET SHOWCASE
   Floating 3D Camera, Laptop, Gaming Controller, Headphones
=================================================================== */

(function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 16);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x6366f1, 3.5);
  dirLight1.position.set(10, 15, 10);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 3.0);
  dirLight2.position.set(-10, -10, 10);
  scene.add(dirLight2);

  const pointLight = new THREE.PointLight(0xec4899, 4, 30);
  pointLight.position.set(0, 2, 8);
  scene.add(pointLight);

  // Group to hold all gadgets
  const gadgetGroup = new THREE.Group();
  scene.add(gadgetGroup);

  // --- 1. 3D CAMERA MODEL ---
  const cameraGroup = new THREE.Group();
  const cameraBodyMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.3,
    metalness: 0.8,
  });
  const cameraGripMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.8,
    metalness: 0.2,
  });
  const glassLensMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    metalness: 0.2,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 1.2,
    reflectivity: 0.9,
  });
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x6366f1,
    emissiveIntensity: 0.4,
  });

  // Camera Body
  const camBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.6, 1.2),
    cameraBodyMat
  );
  cameraGroup.add(camBody);

  // Handgrip
  const camGrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 1.5, 0.7),
    cameraGripMat
  );
  camGrip.position.set(1.1, 0, 0.3);
  cameraGroup.add(camGrip);

  // Lens Barrel
  const lensBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.8, 1.2, 32),
    cameraBodyMat
  );
  lensBarrel.rotation.x = Math.PI / 2;
  lensBarrel.position.set(-0.2, 0, 0.9);
  cameraGroup.add(lensBarrel);

  // Lens Front Element (Glass)
  const lensGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32),
    glassLensMat
  );
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.set(-0.2, 0, 1.55);
  cameraGroup.add(lensGlass);

  // Neon Accent Ring
  const neonRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.04, 16, 32),
    ringMat
  );
  neonRing.position.set(-0.2, 0, 1.4);
  cameraGroup.add(neonRing);

  cameraGroup.position.set(-4.5, 1.8, 0);
  cameraGroup.scale.set(0.95, 0.95, 0.95);
  gadgetGroup.add(cameraGroup);

  // --- 2. 3D LAPTOP MODEL ---
  const laptopGroup = new THREE.Group();
  const laptopMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.25,
  });
  const screenGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
  });

  // Base
  const lapBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.15, 2.2),
    laptopMat
  );
  laptopGroup.add(lapBase);

  // Screen
  const lapScreen = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.1, 0.1),
    laptopMat
  );
  lapScreen.position.set(0, 1.05, -1.05);
  lapScreen.rotation.x = -0.25;
  laptopGroup.add(lapScreen);

  // Display Face
  const lapDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 1.8),
    screenGlowMat
  );
  lapDisplay.position.set(0, 1.05, -0.99);
  lapDisplay.rotation.x = -0.25;
  laptopGroup.add(lapDisplay);

  laptopGroup.position.set(4.2, 1.5, -1);
  laptopGroup.rotation.y = -0.4;
  gadgetGroup.add(laptopGroup);

  // --- 3. 3D GAMING CONTROLLER ---
  const controllerGroup = new THREE.Group();
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.6,
    roughness: 0.3,
  });
  const buttonMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    emissive: 0xec4899,
    emissiveIntensity: 0.5,
  });

  const padCenter = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.0, 0.5),
    padMat
  );
  controllerGroup.add(padCenter);

  // Left & right grip handles
  const leftGrip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.45, 1.4, 16),
    padMat
  );
  leftGrip.position.set(-1.1, -0.4, 0);
  leftGrip.rotation.z = 0.5;
  controllerGroup.add(leftGrip);

  const rightGrip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.45, 1.4, 16),
    padMat
  );
  rightGrip.position.set(1.1, -0.4, 0);
  rightGrip.rotation.z = -0.5;
  controllerGroup.add(rightGrip);

  // Analog Sticks
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const stick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16), stickMat);
  stick1.position.set(-0.5, -0.2, 0.35);
  stick1.rotation.x = Math.PI / 2;
  controllerGroup.add(stick1);

  const stick2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16), stickMat);
  stick2.position.set(0.5, -0.2, 0.35);
  stick2.rotation.x = Math.PI / 2;
  controllerGroup.add(stick2);

  // Glowing lightbar
  const lightbar = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.15, 0.1),
    new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
  );
  lightbar.position.set(0, 0.35, 0.26);
  controllerGroup.add(lightbar);

  controllerGroup.position.set(-3.2, -2.5, 0.5);
  controllerGroup.rotation.x = 0.3;
  controllerGroup.rotation.y = 0.3;
  gadgetGroup.add(controllerGroup);

  // --- 4. 3D HEADPHONES ---
  const headphoneGroup = new THREE.Group();
  const phoneMat = new THREE.MeshStandardMaterial({
    color: 0x0b132b,
    metalness: 0.8,
    roughness: 0.2,
  });
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.9,
  });

  // Headband Arch
  const headband = new THREE.Mesh(
    new THREE.TorusGeometry(1.4, 0.12, 16, 32, Math.PI),
    phoneMat
  );
  headband.position.set(0, 0.4, 0);
  headband.rotation.z = Math.PI;
  headphoneGroup.add(headband);

  // Earcups
  const leftEarcup = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.4, 24), cushionMat);
  leftEarcup.rotation.z = Math.PI / 2;
  leftEarcup.position.set(-1.4, 0.4, 0);
  headphoneGroup.add(leftEarcup);

  const rightEarcup = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.4, 24), cushionMat);
  rightEarcup.rotation.z = Math.PI / 2;
  rightEarcup.position.set(1.4, 0.4, 0);
  headphoneGroup.add(rightEarcup);

  headphoneGroup.position.set(3.8, -2.2, 0);
  headphoneGroup.rotation.x = -0.2;
  headphoneGroup.rotation.y = -0.5;
  gadgetGroup.add(headphoneGroup);

  // --- PARTICLE DUST BACKGROUND ---
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 30;
    particlePositions[i + 1] = (Math.random() - 0.5) * 20;
    particlePositions[i + 2] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x818cf8,
    size: 0.12,
    transparent: true,
    opacity: 0.6,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    mouseX = (e.clientX - halfW) / halfW;
    mouseY = (e.clientY - halfH) / halfH;
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!canvas) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Floating bobbing motion for each gadget
    cameraGroup.position.y = 1.8 + Math.sin(elapsed * 1.5) * 0.25;
    cameraGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.35 + 0.2;
    cameraGroup.rotation.x = Math.cos(elapsed * 0.8) * 0.15;

    laptopGroup.position.y = 1.5 + Math.cos(elapsed * 1.3) * 0.22;
    laptopGroup.rotation.y = -0.4 + Math.sin(elapsed * 0.7) * 0.2;

    controllerGroup.position.y = -2.5 + Math.sin(elapsed * 1.7 + 1) * 0.28;
    controllerGroup.rotation.z = Math.sin(elapsed * 1.1) * 0.2;

    headphoneGroup.position.y = -2.2 + Math.cos(elapsed * 1.4 + 2) * 0.24;
    headphoneGroup.rotation.y = -0.5 + Math.sin(elapsed * 0.9) * 0.3;

    // Slow galaxy rotation for particles
    particles.rotation.y = elapsed * 0.04;

    // Smooth camera mouse follow
    targetX += (mouseX * 1.2 - targetX) * 0.05;
    targetY += (-mouseY * 0.8 - targetY) * 0.05;
    gadgetGroup.rotation.y = targetX * 0.4;
    gadgetGroup.rotation.x = targetY * 0.3;

    renderer.render(scene, camera);
  }

  animate();
})();
