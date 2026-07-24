/**
 * Motion Hooks
 * 
 * Custom hooks for Framer Motion animations.
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView, useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion';

/**
 * Hook for scroll-triggered animations
 */
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return { ref, isInView };
}

/**
 * Hook for staggered animations
 */
export function useStagger(isVisible: boolean, staggerDelay = 0.1) {
  const controls = useAnimation();

  useEffect(() => {
    if (isVisible) {
      controls.start('visible');
    }
  }, [isVisible, controls]);

  return {
    controls,
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    },
  };
}

/**
 * Hook for hover animations
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
}

/**
 * Hook for animated number counter
 */
export function useAnimatedNumber(value: number, duration = 0.5) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return springValue;
}

/**
 * Hook for parallax effects
 */
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref });
  const y = useTransform(scrollY, [0, 1000], [0, 500 * speed]);

  return { ref, y };
}

/**
 * Hook for magnetic effect
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    style: { x, y },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}

/**
 * Hook for tilt effect
 */
export function useTilt(maxTilt = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -maxTilt;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return {
    ref,
    style: {
      transform,
      transition: 'transform 0.1s ease-out',
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}

/**
 * Hook for page transitions
 */
export function usePageTransition() {
  return {
    initial: 'initial',
    animate: 'animate',
    exit: 'exit',
  };
}

/**
 * Import useScroll from framer-motion
 */
function useScroll(options?: { target?: React.RefObject<any> }) {
  return require('framer-motion').useScroll(options);
}
