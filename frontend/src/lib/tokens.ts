/**
 * Design Tokens
 * 
 * Centralized design token definitions for the Live Price Platform.
 * Inspired by Linear, Stripe, Vercel, Arc Browser, and Apple.
 * 
 * Design Philosophy:
 * - Minimal and modern
 * - Premium feel
 * - Fast and professional
 * - NOT traditional ecommerce
 */

// ===========================================
// COLOR PALETTE
// ===========================================

export const colors = {
  // Primary - Deep indigo for trust and professionalism
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },

  // Secondary - Neutral slate for text and backgrounds
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Accent - Vibrant violet for highlights and CTAs
  accent: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7', // Main accent
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
    950: '#3B0764',
  },

  // Success - Emerald for positive states
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main success
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },

  // Warning - Amber for caution states
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main warning
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },

  // Danger - Red for error and destructive states
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Main danger
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },

  // Info - Cyan for informational states
  info: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4', // Main info
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
    950: '#083344',
  },

  // Neutral - True gray for backgrounds and borders
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
} as const;

// ===========================================
// SEMANTIC COLORS
// ===========================================

export const semanticColors = {
  light: {
    background: '#FFFFFF',
    foreground: colors.secondary[900],
    card: '#FFFFFF',
    cardForeground: colors.secondary[900],
    popover: '#FFFFFF',
    popoverForeground: colors.secondary[900],
    primary: colors.primary[600],
    primaryForeground: '#FFFFFF',
    secondary: colors.secondary[100],
    secondaryForeground: colors.secondary[900],
    muted: colors.secondary[100],
    mutedForeground: colors.secondary[500],
    accent: colors.accent[500],
    accentForeground: '#FFFFFF',
    destructive: colors.danger[500],
    destructiveForeground: '#FFFFFF',
    border: colors.secondary[200],
    input: colors.secondary[200],
    ring: colors.primary[600],
  },
  dark: {
    background: colors.secondary[950],
    foreground: colors.secondary[50],
    card: colors.secondary[900],
    cardForeground: colors.secondary[50],
    popover: colors.secondary[900],
    popoverForeground: colors.secondary[50],
    primary: colors.primary[500],
    primaryForeground: colors.secondary[950],
    secondary: colors.secondary[800],
    secondaryForeground: colors.secondary[50],
    muted: colors.secondary[800],
    mutedForeground: colors.secondary[400],
    accent: colors.accent[500],
    accentForeground: '#FFFFFF',
    destructive: colors.danger[600],
    destructiveForeground: '#FFFFFF',
    border: colors.secondary[700],
    input: colors.secondary[700],
    ring: colors.primary[500],
  },
} as const;

// ===========================================
// TYPOGRAPHY
// ===========================================

export const typography = {
  // Font families - Persian-first with Latin fallbacks
  fontFamily: {
    display: ['Estedad', 'Vazirmatn', 'system-ui', 'sans-serif'],
    heading: ['Estedad', 'Vazirmatn', 'system-ui', 'sans-serif'],
    body: ['Vazirmatn', 'Estedad', 'system-ui', 'sans-serif'],
    mono: ['SF Mono', 'Fira Code', 'Consolas', 'monospace'],
  },

  // Font sizes - Type scale
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

// ===========================================
// SPACING
// ===========================================

export const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// ===========================================
// BORDER RADIUS
// ===========================================

export const borderRadius = {
  none: '0px',
  sm: '0.25rem',
  DEFAULT: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

// ===========================================
// SHADOWS
// ===========================================

export const boxShadow = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Custom premium shadows
  glow: '0 0 20px rgb(99 102 241 / 0.3)',
  glowLg: '0 0 40px rgb(99 102 241 / 0.4)',
  glass: '0 8px 32px 0 rgb(0 0 0 / 0.1)',
  glassLg: '0 16px 64px 0 rgb(0 0 0 / 0.15)',
} as const;

// ===========================================
// BLUR
// ===========================================

export const blur = {
  none: '0px',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const;

// ===========================================
// Z-INDEX
// ===========================================

export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  
  // Semantic z-index layers
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  backdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  toast: '1080',
  commandPalette: '1090',
  
  // Priority layers
  base: '1',
  overlay: '100',
  modalOverlay: '200',
  top: '1000',
} as const;

// ===========================================
// ANIMATION
// ===========================================

export const animation = {
  // Durations
  duration: {
    instant: '50ms',
    fast: '100ms',
    normal: '200ms',
    medium: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Premium easing curves
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    snap: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  // Keyframes
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    fadeOut: {
      '0%': { opacity: '1' },
      '100%': { opacity: '0' },
    },
    slideUp: {
      '0%': { transform: 'translateY(10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideDown: {
      '0%': { transform: 'translateY(-10px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideLeft: {
      '0%': { transform: 'translateX(10px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    slideRight: {
      '0%': { transform: 'translateX(-10px)', opacity: '0' },
      '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    scaleIn: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
    shimmer: {
      '0%': { backgroundPosition: '-200% 0' },
      '100%': { backgroundPosition: '200% 0' },
    },
  },
} as const;

// ===========================================
// GLASS EFFECTS
// ===========================================

export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  dark: {
    background: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  primary: {
    background: 'rgba(99, 102, 241, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
} as const;

// ===========================================
// BORDERS
// ===========================================

export const borders = {
  width: {
    DEFAULT: '1px',
    0: '0px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    none: 'none',
  },
} as const;

// ===========================================
// EXPORT ALL TOKENS
// ===========================================

export const designTokens = {
  colors,
  semanticColors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  blur,
  zIndex,
  animation,
  glass,
  borders,
} as const;

export type DesignTokens = typeof designTokens;
