/**
 * Three.js Components
 * 
 * 3D scenes for landing pages and special effects.
 * Only used on landing pages, NOT in dashboards.
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ===========================================
// FLOATING SPHERES
// ===========================================

interface FloatingSpheresProps {
  count?: number;
  color?: string;
}

const FloatingSpheres: React.FC<FloatingSpheresProps> = ({
  count = 5,
  color = '#6366F1',
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const spheres = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.5 + 0.5,
    }));
  }, [count]);

  return (
    <>
      {spheres.map((sphere, i) => (
        <Float
          key={i}
          speed={sphere.speed}
          rotationIntensity={0.5}
          floatIntensity={1}
        >
          <mesh ref={meshRef} position={sphere.position}>
            <sphereGeometry args={[sphere.scale, 32, 32]} />
            <MeshDistortMaterial
              color={color}
              speed={2}
              distort={0.3}
              radius={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// ===========================================
// PARTICLE FIELD
// ===========================================

interface ParticleFieldProps {
  count?: number;
  color?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 1000,
  color = '#6366F1',
}) => {
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.02;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// ===========================================
// GRID PLANE
// ===========================================

interface GridPlaneProps {
  color?: string;
  size?: number;
  divisions?: number;
}

const GridPlane: React.FC<GridPlaneProps> = ({
  color = '#6366F1',
  size = 20,
  divisions = 20,
}) => {
  return (
    <gridHelper
      args={[size, divisions, color, color]}
      position={[0, -2, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

// ===========================================
// GLOWING ORB
// ===========================================

interface GlowingOrbProps {
  color?: string;
  intensity?: number;
}

const GlowingOrb: React.FC<GlowingOrbProps> = ({
  color = '#6366F1',
  intensity = 2,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.4}
          radius={1}
          emissive={color}
          emissiveIntensity={intensity}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
};

// ===========================================
// HERO SCENE
// ===========================================

interface HeroSceneProps {
  className?: string;
}

const HeroScene: React.FC<HeroSceneProps> = ({ className }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <GlowingOrb color="#6366F1" intensity={1.5} />
        <FloatingSpheres count={3} color="#A855F7" />
        <ParticleField count={500} color="#818CF8" />
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
};

export {
  FloatingSpheres,
  ParticleField,
  GridPlane,
  GlowingOrb,
  HeroScene,
};
