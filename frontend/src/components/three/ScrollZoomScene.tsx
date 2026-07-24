'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ===========================================
// SECTION TARGETS — Camera positions per section
// (DO NOT MODIFY)
// ===========================================

const SECTION_TARGETS = [
  { z: 60,  y: 0,    rotY: 0      },  // Hero
  { z: 35,  y: -3,   rotY: 0.06   },  // Stats
  { z: 18,  y: -6,   rotY: -0.04  },  // Features
  { z: 5,   y: -2,   rotY: 0.08   },  // How It Works
  { z: -5,  y: 3,    rotY: -0.06  },  // Tech Stack
  { z: -15, y: 6,    rotY: 0.04   },  // Roadmap
  { z: -22, y: 8,    rotY: 0      },  // CTA
];

// ===========================================
// LERP & EASE
// ===========================================

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ===========================================
// COMPONENT
// ===========================================

interface ScrollZoomSceneProps {
  className?: string;
}

export function ScrollZoomScene({ className = '' }: ScrollZoomSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ═══════════════════════════════════════
    //  RENDERER
    // ═══════════════════════════════════════
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x060608, 1);

    // ═══════════════════════════════════════
    //  SCENE & CAMERA
    // ═══════════════════════════════════════
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.008);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 60);

    // ═══════════════════════════════════════
    //  GRID FLOOR
    // ═══════════════════════════════════════
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00C8FF,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const grid = new THREE.Mesh(
      new THREE.PlaneGeometry(600, 600, 80, 80),
      gridMat
    );
    grid.rotation.x = -Math.PI / 2.2;
    grid.position.y = -30;
    scene.add(grid);

    // ═══════════════════════════════════════
    //  STAR LAYERS — 3 depth layers
    // ═══════════════════════════════════════
    function makeStars(count: number, spread: number, size: number, opacity: number) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        pos[i] = (Math.random() - 0.5) * spread;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0x00C8FF,
        size,
        transparent: true,
        opacity,
        sizeAttenuation: true,
      }));
    }

    const stars1 = makeStars(2000, 800, 0.6, 0.5);
    const stars2 = makeStars(600,  400, 1.2, 0.3);
    const stars3 = makeStars(120,  200, 2.5, 0.2);
    scene.add(stars1, stars2, stars3);

    // ═══════════════════════════════════════
    //  FLOATING WIREFRAME CUBES (60 pieces)
    // ═══════════════════════════════════════
    interface CubeUserData {
      rx: number; ry: number;
      floatT: number; floatAmp: number; floatSpd: number;
    }

    const cubes: THREE.Mesh[] = [];
    const cubeBaseGeo = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < 60; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00C8FF,
        wireframe: true,
        transparent: true,
        opacity: Math.random() * 0.25 + 0.05,
      });
      const cube = new THREE.Mesh(cubeBaseGeo, mat);
      cube.position.set(
        (Math.random() - 0.5) * 180,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 100,
      );
      cube.scale.setScalar(Math.random() * 3 + 0.5);
      (cube.userData as CubeUserData) = {
        rx:       (Math.random() - 0.5) * 0.008,
        ry:       (Math.random() - 0.5) * 0.012,
        floatT:   Math.random() * Math.PI * 2,
        floatAmp: Math.random() * 2 + 0.5,
        floatSpd: Math.random() * 0.4 + 0.1,
      };
      scene.add(cube);
      cubes.push(cube);
    }

    // ═══════════════════════════════════════
    //  TORUS RINGS (2 rings)
    // ═══════════════════════════════════════
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(22, 0.3, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0x00C8FF, transparent: true, opacity: 0.08 })
    );
    torus.rotation.x = Math.PI / 2.5;
    scene.add(torus);

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(14, 0.18, 6, 60),
      new THREE.MeshBasicMaterial({ color: 0x00C8FF, transparent: true, opacity: 0.06 })
    );
    torus2.rotation.set(-Math.PI / 3, Math.PI / 4, 0);
    scene.add(torus2);

    // ═══════════════════════════════════════
    //  CIRCUIT LINE SEGMENTS
    // ═══════════════════════════════════════
    function makeCircuitLines(count: number, spread: number) {
      const geo = new THREE.BufferGeometry();
      const pos: number[] = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread * 0.4;
        const z = (Math.random() - 0.5) * spread;
        const len = Math.random() * 6 + 1;
        pos.push(x, y, z, x + len, y, z);
      }
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
      return new THREE.LineSegments(geo,
        new THREE.LineBasicMaterial({ color: 0x00C8FF, transparent: true, opacity: 0.07 })
      );
    }
    scene.add(makeCircuitLines(200, 300));

    // ═══════════════════════════════════════
    //  CENTRAL PULSE SPHERE
    // ═══════════════════════════════════════
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x00C8FF, transparent: true, opacity: 0.03, wireframe: true })
    );
    scene.add(sphere);

    // ═══════════════════════════════════════
    //  SCROLL STATE
    // ═══════════════════════════════════════
    let targetCamZ = SECTION_TARGETS[0].z;
    let targetCamY = SECTION_TARGETS[0].y;
    let targetRotY = SECTION_TARGETS[0].rotY;
    let currentCamZ = SECTION_TARGETS[0].z;
    let currentCamY = SECTION_TARGETS[0].y;
    let currentRotY = SECTION_TARGETS[0].rotY;

    function onScroll() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      const rawProgress = Math.min(scrollTop / docH, 1);

      const count = SECTION_TARGETS.length;
      const idx = rawProgress * (count - 1);
      const lo = Math.floor(idx);
      const hi = Math.min(lo + 1, count - 1);
      const t = easeInOut(idx - lo);

      targetCamZ = lerp(SECTION_TARGETS[lo].z, SECTION_TARGETS[hi].z, t);
      targetCamY = lerp(SECTION_TARGETS[lo].y, SECTION_TARGETS[hi].y, t);
      targetRotY = lerp(SECTION_TARGETS[lo].rotY, SECTION_TARGETS[hi].rotY, t);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ═══════════════════════════════════════
    //  MOUSE PARALLAX
    // ═══════════════════════════════════════
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ═══════════════════════════════════════
    //  ANIMATION LOOP
    // ═══════════════════════════════════════
    let tick = 0;
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      tick += 0.005;

      // 1. Smooth camera from scroll
      currentCamZ += (targetCamZ - currentCamZ) * 0.045;
      currentCamY += (targetCamY - currentCamY) * 0.045;
      currentRotY += (targetRotY - currentRotY) * 0.035;

      // 2. Mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // 3. Apply to camera
      camera.position.x  = mouseX * 3;
      camera.position.y  = currentCamY + mouseY * -2;
      camera.position.z  = currentCamZ;
      camera.rotation.y  = currentRotY;

      // 4. Scene animations
      torus.rotation.z   += 0.0006;
      torus2.rotation.z  -= 0.0009;
      stars1.rotation.y  =  tick * 0.008;
      stars2.rotation.y  = -tick * 0.012;

      // 5. Scroll-reactive grid opacity
      const scrollFrac = (60 - currentCamZ) / 80;
      grid.material.opacity = 0.02 + scrollFrac * 0.08;

      // 6. Cube float + rotation
      cubes.forEach(c => {
        const d = c.userData as CubeUserData;
        d.floatT += 0.01;
        c.position.y += Math.sin(d.floatT * d.floatSpd) * 0.008 * d.floatAmp;
        c.rotation.x  += d.rx;
        c.rotation.y  += d.ry;
      });

      // 7. Sphere pulse
      sphere.scale.setScalar(1 + Math.sin(tick * 1.2) * 0.08);

      renderer.render(scene, camera);
    }

    animate();

    // ═══════════════════════════════════════
    //  RESIZE
    // ═══════════════════════════════════════
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onResize);

    // ═══════════════════════════════════════
    //  CLEANUP
    // ═══════════════════════════════════════
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#060608' }}
    />
  );
}

export default ScrollZoomScene;
