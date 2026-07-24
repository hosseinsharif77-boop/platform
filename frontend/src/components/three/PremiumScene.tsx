'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  Stars,
  Sparkles,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';

// ===========================================
// CONSTANTS
// ===========================================

const COLORS = {
  indigo: '#6366F1',
  violet: '#8B5CF6',
  cyan: '#06B6D4',
  teal: '#14B8A6',
  white: '#FFFFFF',
  softIndigo: '#EEF2FF',
  softViolet: '#F5F3FF',
  softCyan: '#ECFEFF',
};

// ===========================================
// FLOATING GLASS PANEL
// ===========================================

function GlassPanel({
  position,
  rotation,
  scale = 1,
  speed = 0.5,
  color = COLORS.indigo,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.15;
    ref.current.rotation.x = (rotation?.[0] || 0) + Math.sin(t * 0.5) * 0.05;
    ref.current.rotation.z = (rotation?.[2] || 0) + Math.cos(t * 0.3) * 0.03;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1.5, 1, 0.05]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.15}
        roughness={0.1}
        metalness={0.1}
        transmission={0.9}
        thickness={0.5}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        ior={1.5}
      />
    </mesh>
  );
}

// ===========================================
// GLASS SPHERE
// ===========================================

function GlassSphere({
  position,
  scale = 1,
  speed = 0.3,
  color = COLORS.violet,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.2;
    ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.1;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0.1}
          transmission={0.95}
          thickness={1}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.52}
        />
      </mesh>
    </Float>
  );
}

// ===========================================
// CRYSTAL SHAPE
// ===========================================

function CrystalShape({
  position,
  scale = 1,
  speed = 0.4,
  color = COLORS.cyan,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.2}
          transmission={0.85}
          thickness={0.8}
          envMapIntensity={2}
          clearcoat={1}
          ior={1.8}
        />
      </mesh>
    </Float>
  );
}

// ===========================================
// ROUNDED CUBE
// ===========================================

function RoundedCube({
  position,
  scale = 1,
  speed = 0.3,
  color = COLORS.teal,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.z = t * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.12;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.2}
          roughness={0.1}
          metalness={0.1}
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// ===========================================
// GLOWING RING
// ===========================================

function GlowingRing({
  position,
  scale = 1,
  speed = 0.5,
  color = COLORS.indigo,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[0.6, 0.03, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={4}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// ===========================================
// FLOATING PRICE NODE
// ===========================================

function PriceNode({
  position,
  speed = 0.3,
  color = COLORS.indigo,
  label = '$99',
}: {
  position: [number, number, number];
  speed?: number;
  color?: string;
  label?: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.2;
    ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.1;
  });

  return (
    <group ref={ref} position={position}>
      {/* Glass card */}
      <mesh>
        <boxGeometry args={[0.8, 0.4, 0.02]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.15}
          roughness={0.1}
          transmission={0.9}
          thickness={0.3}
          clearcoat={1}
        />
      </mesh>
      {/* Glow dot */}
      <mesh position={[0.3, 0.1, 0.02]}>
        <circleGeometry args={[0.03, 32]} />
        <meshStandardMaterial
          color={COLORS.teal}
          emissive={COLORS.teal}
          emissiveIntensity={6}
        />
      </mesh>
    </group>
  );
}

// ===========================================
// NETWORK LINE
// ===========================================

function NetworkLine({
  start,
  end,
  color = COLORS.indigo,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const { midpoint, length, rotation } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    const len = s.distanceTo(e);
    const dir = new THREE.Vector3().subVectors(e, s).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    const euler = new THREE.Euler().setFromQuaternion(quat);
    return { midpoint: mid.toArray() as [number, number, number], length: len, rotation: [euler.x, euler.y, euler.z] as [number, number, number] };
  }, [start, end]);

  return (
    <mesh ref={ref} position={midpoint} rotation={rotation}>
      <cylinderGeometry args={[0.005, 0.005, length, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

// ===========================================
// PARTICLE FIELD
// ===========================================

function ParticleField({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, sizes, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      sz[i] = Math.random() * 0.03 + 0.005;
      op[i] = Math.random() * 0.5 + 0.1;
    }
    return [pos, sz, op];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    ref.current.rotation.x = state.clock.elapsedTime * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.indigo}
        size={0.04}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ===========================================
// ENERGY PARTICLES (closer, brighter)
// ===========================================

function EnergyParticles({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.02;
    const posArray = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.001;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.cyan}
        size={0.06}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ===========================================
// ORBITING RINGS
// ===========================================

function OrbitingRings() {
  const group1 = useRef<THREE.Group>(null);
  const group2 = useRef<THREE.Group>(null);
  const group3 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group1.current) group1.current.rotation.z = t * 0.15;
    if (group2.current) group2.current.rotation.x = t * 0.1;
    if (group3.current) group3.current.rotation.y = t * 0.12;
  });

  return (
    <>
      <group ref={group1}>
        <mesh>
          <torusGeometry args={[2.5, 0.01, 16, 200]} />
          <meshStandardMaterial color={COLORS.indigo} emissive={COLORS.indigo} emissiveIntensity={3} transparent opacity={0.4} />
        </mesh>
      </group>
      <group ref={group2} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.8, 0.008, 16, 200]} />
          <meshStandardMaterial color={COLORS.violet} emissive={COLORS.violet} emissiveIntensity={3} transparent opacity={0.35} />
        </mesh>
      </group>
      <group ref={group3} rotation={[0, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[3.1, 0.006, 16, 200]} />
          <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={3} transparent opacity={0.3} />
        </mesh>
      </group>
    </>
  );
}

// ===========================================
// MAIN PRICING ENGINE (hero centerpiece)
// ===========================================

function PricingEngine() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.08;
    group.current.position.y = Math.sin(t * 0.3) * 0.15;
  });

  return (
    <group ref={group}>
      {/* Central glass core */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color={COLORS.indigo}
          transparent
          opacity={0.12}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={2}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={0.85}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color={COLORS.indigo}
          emissive={COLORS.indigo}
          emissiveIntensity={1.5}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Layer 1 - glass panels */}
      <GlassPanel position={[0, 0.8, 0]} rotation={[0.3, 0, 0.1]} scale={0.8} speed={0.4} color={COLORS.indigo} />
      <GlassPanel position={[0, -0.8, 0]} rotation={[-0.3, 0, -0.1]} scale={0.8} speed={0.5} color={COLORS.violet} />
      <GlassPanel position={[0.9, 0, 0]} rotation={[0, 0.4, 0]} scale={0.7} speed={0.3} color={COLORS.cyan} />
      <GlassPanel position={[-0.9, 0, 0]} rotation={[0, -0.4, 0]} scale={0.7} speed={0.6} color={COLORS.teal} />

      {/* Surrounding glass spheres */}
      <GlassSphere position={[1.8, 0.5, 0.5]} scale={0.3} speed={0.4} color={COLORS.violet} />
      <GlassSphere position={[-1.8, -0.5, -0.5]} scale={0.25} speed={0.5} color={COLORS.cyan} />
      <GlassSphere position={[0.5, 1.5, -1]} scale={0.2} speed={0.3} color={COLORS.indigo} />
      <GlassSphere position={[-0.5, -1.5, 1]} scale={0.22} speed={0.6} color={COLORS.teal} />

      {/* Crystal accents */}
      <CrystalShape position={[1.5, -0.8, 0.8]} scale={0.35} speed={0.5} color={COLORS.cyan} />
      <CrystalShape position={[-1.5, 0.8, -0.8]} scale={0.3} speed={0.4} color={COLORS.violet} />

      {/* Rounded cubes */}
      <RoundedCube position={[2, 0, -1]} scale={0.25} speed={0.3} color={COLORS.teal} />
      <RoundedCube position={[-2, 0, 1]} scale={0.2} speed={0.4} color={COLORS.indigo} />

      {/* Rings */}
      <GlowingRing position={[0, 0, 0]} scale={1.2} speed={0.3} color={COLORS.indigo} />
      <GlowingRing position={[0, 0, 0]} scale={1.5} speed={0.2} color={COLORS.violet} />

      {/* Price nodes */}
      <PriceNode position={[2.2, 1, 0.5]} speed={0.3} color={COLORS.indigo} />
      <PriceNode position={[-2.2, -1, -0.5]} speed={0.4} color={COLORS.cyan} />
      <PriceNode position={[1, 2, -1]} speed={0.35} color={COLORS.violet} />

      {/* Network lines */}
      <NetworkLine start={[0, 0, 0]} end={[2.2, 1, 0.5]} color={COLORS.indigo} />
      <NetworkLine start={[0, 0, 0]} end={[-2.2, -1, -0.5]} color={COLORS.cyan} />
      <NetworkLine start={[0, 0, 0]} end={[1, 2, -1]} color={COLORS.violet} />
      <NetworkLine start={[0, 0, 0]} end={[-1.8, -0.5, -0.5]} color={COLORS.teal} />
    </group>
  );
}

// ===========================================
// SCROLL CAMERA CONTROLLER
// ===========================================

function ScrollCamera({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { camera } = useThree();

  const cameraState = useRef({
    targetPos: new THREE.Vector3(0, 0, 8),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    currentPos: new THREE.Vector3(0, 0, 8),
    currentLookAt: new THREE.Vector3(0, 0, 0),
  });

  useFrame(() => {
    const offset = Math.min(Math.max(scrollProgress, 0), 1);
    const s = cameraState.current;

    // Section mapping
    if (offset < 0.15) {
      // Hero
      s.targetPos.set(0, 0, 8);
      s.targetLookAt.set(0, 0, 0);
    } else if (offset < 0.35) {
      // Scroll to features
      const t = (offset - 0.15) / 0.2;
      s.targetPos.set(3 * t, -1 * t, 8 - 2 * t);
      s.targetLookAt.set(2 * t, -0.5 * t, 0);
    } else if (offset < 0.55) {
      // Features - sideways pan
      const t = (offset - 0.35) / 0.2;
      s.targetPos.set(3 + 2 * t, -1, 6);
      s.targetLookAt.set(4 * t, -0.5, 0);
    } else if (offset < 0.7) {
      // How it works - fly forward
      const t = (offset - 0.55) / 0.15;
      s.targetPos.set(5, -1 + 2 * t, 6 - 3 * t);
      s.targetLookAt.set(5, 0, -2 * t);
    } else if (offset < 0.85) {
      // Tech stack - rotate around
      const t = (offset - 0.7) / 0.15;
      const angle = t * Math.PI * 0.5;
      s.targetPos.set(5 * Math.cos(angle), 1, 5 * Math.sin(angle));
      s.targetLookAt.set(0, 0, 0);
    } else {
      // CTA - converge to center
      const t = (offset - 0.85) / 0.15;
      s.targetPos.set(5 * Math.cos(Math.PI * 0.5) * (1 - t), 1 - t, 5 * Math.sin(Math.PI * 0.5) * (1 - t) + 3 * t);
      s.targetLookAt.set(0, 0, 0);
    }

    // Smooth interpolation
    s.currentPos.lerp(s.targetPos, 0.03);
    s.currentLookAt.lerp(s.targetLookAt, 0.03);

    camera.position.copy(s.currentPos);
    camera.lookAt(s.currentLookAt);
  });

  return null;
}

// ===========================================
// MOUSE PARALLAX
// ===========================================

function MouseParallax() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Gentle mouse influence
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.pointer.x * 0.3, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.pointer.y * 0.2, 0.05);

    camera.position.x += mouse.current.x * 0.01;
    camera.position.y += mouse.current.y * 0.01;
  });

  return null;
}

// ===========================================
// SCENE
// ===========================================

function Scene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <>
      <ScrollCamera scrollProgress={scrollProgress} />
      <MouseParallax />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, 5, -5]} intensity={0.4} color={COLORS.indigo} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color={COLORS.violet} distance={20} />
      <pointLight position={[-5, -5, -5]} intensity={0.4} color={COLORS.cyan} distance={20} />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} penumbra={1} color="#ffffff" />

      {/* Environment */}
      <Environment preset="studio" environmentIntensity={0.3} />

      {/* Hero - Pricing Engine */}
      <PricingEngine />

      {/* Orbiting rings */}
      <OrbitingRings />

      {/* Particles */}
      <ParticleField count={2000} />
      <EnergyParticles count={150} />

      {/* Sparkles */}
      <Sparkles count={50} scale={10} size={1.5} speed={0.3} opacity={0.3} color={COLORS.indigo} />

      {/* Background stars */}
      <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />

      {/* Contact shadows */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.15}
        scale={20}
        blur={2}
        far={4}
        color={COLORS.indigo}
      />
    </>
  );
}

// ===========================================
// EXPORT
// ===========================================

interface PremiumSceneProps {
  className?: string;
  scrollProgress?: number;
}

export function PremiumScene({ className = '', scrollProgress = 0 }: PremiumSceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ filter: 'contrast(1.05) brightness(1.02)' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#FFFFFF']} />
        <fog attach="fog" args={['#FFFFFF', 15, 35]} />
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

export default PremiumScene;
