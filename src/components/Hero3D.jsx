import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, TrendingUp, RefreshCw } from 'lucide-react';

export default function Hero3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for objects with mouse parallax
    const group = new THREE.Group();
    scene.add(group);

    // 1. Futuristic 3D Camera Model (Body + Lens + Dial)
    const cameraGroup = new THREE.Group();
    cameraGroup.position.set(-2.2, 0.8, 0);

    // Camera body
    const bodyGeo = new THREE.BoxGeometry(1.6, 1.1, 0.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x050a14
    });
    const camBody = new THREE.Mesh(bodyGeo, bodyMat);
    cameraGroup.add(camBody);

    // Lens Barrel
    const lensGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.9, 32);
    lensGeo.rotateX(Math.PI / 2);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      metalness: 0.9,
      roughness: 0.2
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0.15, -0.05, 0.65);
    cameraGroup.add(lens);

    // Glowing Lens Ring (Cyan)
    const ringGeo = new THREE.TorusGeometry(0.5, 0.035, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const lensRing = new THREE.Mesh(ringGeo, ringMat);
    lensRing.position.set(0.15, -0.05, 1.05);
    cameraGroup.add(lensRing);

    group.add(cameraGroup);

    // 2. Futuristic Laptop Model (Base + Screen)
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(1.9, -0.9, 0.5);

    // Base
    const baseGeo = new THREE.BoxGeometry(2.4, 0.08, 1.6);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      metalness: 0.85,
      roughness: 0.3
    });
    const lapBase = new THREE.Mesh(baseGeo, metalMat);
    lapBase.rotation.y = -Math.PI / 6;
    laptopGroup.add(lapBase);

    // Screen
    const screenGeo = new THREE.BoxGeometry(2.4, 1.5, 0.06);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0b1021,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2
    });
    const lapScreen = new THREE.Mesh(screenGeo, screenMat);
    lapScreen.position.set(-0.35, 0.75, -0.6);
    lapScreen.rotation.y = -Math.PI / 6;
    lapScreen.rotation.x = -Math.PI / 12;
    laptopGroup.add(lapScreen);

    group.add(laptopGroup);

    // 3. Futuristic Gaming Console / Polygon Tech Gadget
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(2.0, 1.3, -1);

    const octGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x1f1838,
      metalness: 0.7,
      roughness: 0.2,
      wireframe: false
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    consoleGroup.add(octahedron);

    // Wireframe glowing outline
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
    const octWire = new THREE.Mesh(octGeo, wireMat);
    octWire.scale.set(1.03, 1.03, 1.03);
    consoleGroup.add(octWire);

    group.add(consoleGroup);

    // 4. Floating Holographic Cyber Ring
    const torusGeo = new THREE.TorusGeometry(1.6, 0.04, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.7
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    torus.position.set(0, 0, -1.5);
    group.add(torus);

    // 5. Star / Light Particles Cloud
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 14;
      positions[i + 2] = (Math.random() - 0.5) * 10 - 2;

      // Cyan / Violet particles
      if (Math.random() > 0.5) {
        colors[i] = 0;
        colors[i + 1] = 0.95;
        colors[i + 2] = 1;
      } else {
        colors[i] = 0.55;
        colors[i + 1] = 0.36;
        colors[i + 2] = 0.96;
      }
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f2fe, 3.5, 30);
    cyanPointLight.position.set(-4, 3, 4);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0x9d4edd, 4, 30);
    purplePointLight.position.set(4, -3, 3);
    scene.add(purplePointLight);

    // Mouse Parallax Interaction
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.45;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      group.rotation.y = currentX * 0.8;
      group.rotation.x = -currentY * 0.8;

      // Floating animations
      cameraGroup.position.y = 0.8 + Math.sin(elapsedTime * 1.4) * 0.15;
      cameraGroup.rotation.y = Math.sin(elapsedTime * 0.6) * 0.18;
      cameraGroup.rotation.x = Math.cos(elapsedTime * 0.8) * 0.1;

      laptopGroup.position.y = -0.9 + Math.cos(elapsedTime * 1.2) * 0.15;
      laptopGroup.rotation.z = Math.sin(elapsedTime * 0.7) * 0.06;

      consoleGroup.position.y = 1.3 + Math.sin(elapsedTime * 1.5 + 1) * 0.18;
      octahedron.rotation.x += 0.008;
      octahedron.rotation.y += 0.012;
      octWire.rotation.x += 0.008;
      octWire.rotation.y += 0.012;

      torus.rotation.z = elapsedTime * 0.3;
      particlePoints.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 520;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] flex items-center justify-center">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Badges */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-12 left-4 sm:left-10 z-10 glass-card px-4 py-3 rounded-2xl flex items-center gap-3 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(0,242,254,0.15)]"
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Try Before You Buy</div>
          <div className="text-sm font-bold text-white">Rent 3 Days • 100% Credit</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-16 right-4 sm:right-8 z-10 glass-card px-4 py-3 rounded-2xl flex items-center gap-3 border border-purple-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(139,92,246,0.18)]"
      >
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold">SafeShield Escrow</div>
          <div className="text-sm font-bold text-white">100% Refundable Deposits</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-4 left-6 sm:left-16 z-10 glass-card px-4 py-2.5 rounded-xl hidden sm:flex items-center gap-2.5 border border-indigo-500/20 text-xs text-slate-300"
      >
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span>Live verified market prices updated daily</span>
      </motion.div>
    </div>
  );
}
