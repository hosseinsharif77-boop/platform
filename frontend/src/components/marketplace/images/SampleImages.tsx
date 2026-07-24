'use client';

import React from 'react';

interface ProductImageProps {
  category: string;
  index?: number;
  className?: string;
}

// Tech product categories with their gradients and icons
const gradients: Record<string, string[]> = {
  laptop: ['#6366F1', '#818CF8', '#A5B4FC'],
  'pc-parts': ['#22C55E', '#86EFAC', '#DCFCE7'],
  camera: ['#F59E0B', '#FCD34D', '#FEF3C7'],
  tablet: ['#A855F7', '#D8B4FE', '#F3E8FF'],
  mobile: ['#EC4899', '#F472B6', '#FBCFE8'],
  accessories: ['#06B6D4', '#67E8F9', '#CFFAFE'],
  monitor: ['#F97316', '#FB923C', '#FED7AA'],
  storage: ['#14B8A6', '#5EEAD4', '#CCFBF1'],
};

// Lucide-style SVG paths for tech categories
const icons: Record<string, string> = {
  laptop: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  'pc-parts': 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
  camera: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
  tablet: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  mobile: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  accessories: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  monitor: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  storage: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
};

// Persian product names
const productNames: Record<string, string[][]> = {
  laptop: [
    ['مک‌بوک پرو', 'لپ‌تاپ ایسوس', 'لپ‌تاپ لنوو'],
    ['لپ‌تاپ اچ‌پی', 'لپ‌تاپ دل', 'مک‌بوک ایر'],
  ],
  'pc-parts': [
    ['پردازنده رایزن', 'کارت گرافیک', 'رم DDR5'],
    ['مادربورد', 'پاور کامپیوتر', 'کیس کامپیوتر'],
  ],
  camera: [
    ['دوربین سونی', 'دوربین کانن', 'لنز 50mm'],
    [' tripod حرفه‌ای', 'فلاشexter', 'فیلتر UV'],
  ],
  tablet: [
    ['آیپد پرو', 'تبلت سامسونگ', 'تبلت شیائومی'],
    ['قلم استایلوس', 'کیبورد تبلت', 'محافظ صفحه'],
  ],
  mobile: [
    ['آیفون 15 پرو', 'سامسونگ S24', 'شیائومی 14'],
    ['گوشی پیکسل', ' OnePlus 12', 'هواوی P70'],
  ],
  accessories: [
    ['هدفون بی‌سیم', 'اسپیکر بلندگو', 'شارژر سریع'],
    ['کیبورد مکانیکی', 'ماوس گیمینگ', 'هاب USB'],
  ],
  monitor: [
    ['مانیتور 4K', 'مانیتور گیمینگ', 'مانیتور ultrawide'],
    ['مانیتور ایسوس', 'مانیتور دل', 'مانیتور LG'],
  ],
  storage: [
    ['هارد SSD 1TB', 'هارد اکسترنال', 'رم‌ریدر حرفه‌ای'],
    ['فلش USB 256GB', 'حافظه NVMe', 'کارت حافظه SD'],
  ],
};

export function SampleProductImage({ category, index = 0, className = '' }: ProductImageProps) {
  const colors = gradients[category] || gradients.laptop;
  const icon = icons[category] || icons.laptop;
  const names = productNames[category] || productNames.laptop;
  const row = Math.floor(index / 3);
  const col = index % 3;
  const name = names[row]?.[col] || `${category} ${index + 1}`;
  const rotation = (index * 15) % 360;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id={`grad-${category}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="50%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2]} />
          </linearGradient>
          <pattern id={`dots-${category}-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.15)" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#grad-${category}-${index})`} />
        <rect width="200" height="200" fill={`url(#dots-${category}-${index})`} />
        <g transform={`translate(100,85) rotate(${rotation})`} opacity="0.2">
          <circle cx="0" cy="0" r="60" fill="white" />
        </g>
        <g transform="translate(70,65)">
          <path d={icon} fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        </g>
        <text x="100" y="160" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" opacity="0.85">
          {name}
        </text>
        <rect x="60" y="172" width="80" height="3" rx="1.5" fill="white" opacity="0.3" />
      </svg>
    </div>
  );
}

interface CategoryImageProps {
  name: string;
  slug?: string;
  className?: string;
}

const categoryColors: Record<string, [string, string]> = {
  laptop: ['#6366F1', '#4F46E5'],
  'pc-parts': ['#22C55E', '#16A34A'],
  camera: ['#F59E0B', '#D97706'],
  tablet: ['#A855F7', '#9333EA'],
  mobile: ['#EC4899', '#DB2777'],
  accessories: ['#06B6D4', '#0891B2'],
  monitor: ['#F97316', '#EA580C'],
  storage: ['#14B8A6', '#0D9488'],
};

const categoryIcons: Record<string, string> = {
  laptop: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  'pc-parts': 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
  camera: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
  tablet: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  mobile: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  accessories: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  monitor: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  storage: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
};

const categoryLabels: Record<string, string> = {
  laptop: 'لپ‌تاپ',
  'pc-parts': 'قطعات کامپیوتر',
  camera: 'دوربین',
  tablet: 'تبلت',
  mobile: 'موبایل',
  accessories: 'لوازم جانبی',
  monitor: 'مانیتور',
  storage: 'حافظه',
};

export function SampleCategoryImage({ name, slug, className = '' }: CategoryImageProps) {
  const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-');
  const colors = categoryColors[categorySlug] || ['#6366F1', '#4F46E5'];
  const iconPath = categoryIcons[categorySlug] || categoryIcons.laptop;
  const label = categoryLabels[categorySlug] || name;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id={`cat-${categorySlug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
          <pattern id={`cat-dots-${categorySlug}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.1)" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#cat-${categorySlug})`} />
        <rect width="200" height="200" fill={`url(#cat-dots-${categorySlug})`} />
        <g transform="translate(100,80)">
          <circle cx="0" cy="0" r="45" fill="white" opacity="0.15" />
          <path d={iconPath} transform="translate(-24,-24)" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" width="48" height="48" />
        </g>
        <text x="100" y="155" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="var(--font-vazirmatn), sans-serif">
          {label}
        </text>
      </svg>
    </div>
  );
}

interface StoreImageProps {
  name: string;
  variant?: number;
  className?: string;
}

const storeGradients = [
  ['#6366F1', '#A855F7'],
  ['#EC4899', '#F97316'],
  ['#22C55E', '#06B6D4'],
  ['#F59E0B', '#EF4444'],
  ['#8B5CF6', '#EC4899'],
  ['#14B8A6', '#6366F1'],
];

export function SampleStoreBanner({ name, variant = 0, className = '' }: StoreImageProps) {
  const colors = storeGradients[variant % storeGradients.length];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 400 120" className="h-full w-full">
        <defs>
          <linearGradient id={`store-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
          <pattern id={`store-pattern-${variant}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>
        <rect width="400" height="120" fill={`url(#store-${variant})`} />
        <rect width="400" height="120" fill={`url(#store-pattern-${variant})`} />
        <circle cx="350" cy="60" r="80" fill="white" opacity="0.08" />
        <circle cx="320" cy="80" r="40" fill="white" opacity="0.05" />
      </svg>
    </div>
  );
}

export function SampleStoreLogo({ name, variant = 0, className = '' }: StoreImageProps) {
  const colors = storeGradients[variant % storeGradients.length];
  // For Persian text, use first 1-2 characters
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <defs>
          <linearGradient id={`logo-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="40" fill={`url(#logo-${variant})`} />
        <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="22" fontWeight="700" fontFamily="var(--font-vazirmatn), sans-serif">
          {initials}
        </text>
      </svg>
    </div>
  );
}
