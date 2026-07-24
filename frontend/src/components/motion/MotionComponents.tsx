/**
 * Motion Components
 * 
 * Reusable animated components using Framer Motion.
 */

'use client';

import React from 'react';
import { motion, AnimatePresence, MotionProps, HTMLMotionProps } from 'framer-motion';
import {
  fadeVariants,
  slideUpVariants,
  slideDownVariants,
  scaleVariants,
  revealVariants,
  staggerContainer,
  staggerItem,
  pageTransition,
  modalOverlay,
  modalContent,
} from '@/lib/animations';

// ===========================================
// FADE WRAPPER
// ===========================================

interface FadeProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
  ({ children, delay = 0, duration = 0.3, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay, duration } },
          exit: { opacity: 0, transition: { duration: duration / 2 } },
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Fade.displayName = 'Fade';

// ===========================================
// SLIDE WRAPPER
// ===========================================

interface SlideProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  ({ children, direction = 'up', delay = 0, ...props }, ref) => {
    const variants = {
      up: slideUpVariants,
      down: slideDownVariants,
      left: slideDownVariants,
      right: slideUpVariants,
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants[direction]}
        transition={{ delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Slide.displayName = 'Slide';

// ===========================================
// SCALE WRAPPER
// ===========================================

interface ScaleProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
}

export const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(
  ({ children, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={scaleVariants}
        transition={{ delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Scale.displayName = 'Scale';

// ===========================================
// REVEAL (Scroll-triggered)
// ===========================================

interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  once?: boolean;
}

export const Reveal = React.forwardRef<HTMLDivElement, RevealProps>(
  ({ children, delay = 0, once = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.1 }}
        variants={revealVariants}
        transition={{ delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Reveal.displayName = 'Reveal';

// ===========================================
// STAGGER LIST
// ===========================================

interface StaggerListProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
}

export const StaggerList = React.forwardRef<HTMLDivElement, StaggerListProps>(
  ({ children, staggerDelay = 0.1, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: staggerDelay,
            },
          },
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerList.displayName = 'StaggerList';

// ===========================================
// STAGGER ITEM
// ===========================================

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={staggerItem}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = 'StaggerItem';

// ===========================================
// PAGE WRAPPER
// ===========================================

interface PageWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
PageWrapper.displayName = 'PageWrapper';

// ===========================================
// MODAL
// ===========================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ===========================================
// HOVER SCALE
// ===========================================

interface HoverScaleProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  scale?: number;
}

export const HoverScale = React.forwardRef<HTMLDivElement, HoverScaleProps>(
  ({ children, scale = 1.02, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
HoverScale.displayName = 'HoverScale';

// ===========================================
// HOVER LIFT
// ===========================================

interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  lift?: number;
}

export const HoverLift = React.forwardRef<HTMLDivElement, HoverLiftProps>(
  ({ children, lift = -4, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: lift }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
HoverLift.displayName = 'HoverLift';

// ===========================================
// ANIMATED NUMBER
// ===========================================

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 0.5,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  React.useEffect(() => {
    const start = displayValue;
    const end = value;
    const startTime = Date.now();
    const durationMs = duration * 1000;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={className}>
      {displayValue.toFixed(2)}
    </span>
  );
};
