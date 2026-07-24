/**
 * Animation Utilities
 * 
 * Reusable Framer Motion animation variants and presets.
 * Designed for premium SaaS interfaces.
 */

import { Variants, Transition } from 'framer-motion';

// ===========================================
// COMMON TRANSITIONS
// ===========================================

export const transitions: Record<string, Transition> = {
  // Default transition
  default: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  
  // Smooth transition
  smooth: {
    type: 'tween',
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  
  // Bouncy transition
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
  
  // Gentle transition
  gentle: {
    type: 'tween',
    duration: 0.5,
    ease: [0.25, 0.1, 0.25, 1],
  },
  
  // Snappy transition
  snappy: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  },
};

// ===========================================
// FADE ANIMATIONS
// ===========================================

export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.smooth,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeOut: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 0 },
};

// ===========================================
// SLIDE ANIMATIONS
// ===========================================

export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.smooth,
  },
};

export const slideDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: transitions.smooth,
  },
};

export const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.smooth,
  },
};

export const slideRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.smooth,
  },
};

// ===========================================
// SCALE ANIMATIONS
// ===========================================

export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.smooth,
  },
};

export const scaleUpVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: transitions.smooth,
  },
};

// ===========================================
// REVEAL ANIMATIONS (for scroll-triggered)
// ===========================================

export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
};

export const revealLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
};

export const revealRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
};

// ===========================================
// STAGGER CONTAINER
// ===========================================

export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

// ===========================================
// HOVER ANIMATIONS
// ===========================================

export const hoverScale = {
  scale: 1.02,
  transition: transitions.default,
};

export const hoverScaleUp = {
  scale: 1.05,
  transition: transitions.bouncy,
};

export const hoverLift = {
  y: -4,
  transition: transitions.smooth,
};

export const hoverGlow = {
  boxShadow: '0 0 30px rgb(99 102 241 / 0.4)',
  transition: transitions.smooth,
};

// ===========================================
// CARD ANIMATIONS
// ===========================================

export const cardHover: Variants = {
  rest: {
    scale: 1,
    transition: transitions.smooth,
  },
  hover: {
    scale: 1.02,
    transition: transitions.default,
  },
  tap: {
    scale: 0.98,
    transition: transitions.smooth,
  },
};

export const cardHoverLift: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transition: transitions.smooth,
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: transitions.default,
  },
};

// ===========================================
// PAGE TRANSITION
// ===========================================

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.smooth,
  },
};

// ===========================================
// LOADING ANIMATIONS
// ===========================================

export const loadingPulse: Variants = {
  initial: {
    opacity: 0.5,
  },
  animate: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1,
    },
  },
};

export const loadingSpin = {
  rotate: 360,
  transition: {
    repeat: Infinity,
    duration: 1,
    ease: 'linear',
  },
};

// ===========================================
// MODAL / DIALOG ANIMATIONS
// ===========================================

export const modalOverlay: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    transition: transitions.smooth,
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: transitions.smooth,
  },
};

// ===========================================
// DRAWER ANIMATIONS
// ===========================================

export const drawerOverlay: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export const drawerContent: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: transitions.default,
  },
  exit: {
    x: '100%',
    transition: transitions.smooth,
  },
};

export const drawerContentLeft: Variants = {
  hidden: {
    x: '-100%',
  },
  visible: {
    x: 0,
    transition: transitions.default,
  },
  exit: {
    x: '-100%',
    transition: transitions.smooth,
  },
};

// ===========================================
// TOAST ANIMATIONS
// ===========================================

export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: transitions.smooth,
  },
};

// ===========================================
// PRICE ANIMATIONS
// ===========================================

export const priceUpdate: Variants = {
  initial: {
    scale: 1,
    color: 'inherit',
  },
  update: {
    scale: [1, 1.1, 1],
    color: ['#22C55E', 'inherit'],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

// ===========================================
// COMMAND PALETTE ANIMATIONS
// ===========================================

export const commandPalette: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: transitions.smooth,
  },
};
