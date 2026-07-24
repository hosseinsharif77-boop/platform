'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Lazy load scroll-zoom Three.js background
const ScrollZoomScene = dynamic(() => import('@/components/three/ScrollZoomScene').then(m => m.ScrollZoomScene), {
  ssr: false,
  loading: () => null,
});

// ===========================================
// ANIMATED SECTION WRAPPER
// ===========================================

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCard({ children, className = '', index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CounterAnimation({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString('fa-IR')}{suffix}</span>;
}

// ===========================================
// DATA
// ===========================================

const features = [
  {
    num: '01',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'موتور قیمت‌گذاری پویا',
    description: 'قیمت‌ها به صورت خودکار بر اساس نرخ ارز لحظه‌ای و قوانین قیمت‌گذاری قابل تنظیم به‌روز می‌شوند.',
  },
  {
    num: '02',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'پشتیبانی چند ارزی',
    description: 'پشتیبانی از بیش از ۲۰ ارز با تبدیل خودکار و قفل قیمت در هنگام تسویه حساب.',
  },
  {
    num: '03',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    title: 'بازارچه چندفروشنده',
    description: 'هزاران فروشگاه مستقل با قیمت‌گذاری، موجودی و برندینگ اختصاصی خودشان.',
  },
  {
    num: '04',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'محافظت قیمت',
    description: 'قیمت مشتریان در هنگام تسویه حساب به مدت ۱۵ دقیقه قفل می‌شود و اعتماد آن‌ها را جلب می‌کند.',
  },
  {
    num: '05',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'تحلیل‌های لحظه‌ای',
    description: 'داشبوردهای جامع برای فروشندگان و مدیران با گزارش‌های فروش، درآمد و عملکرد.',
  },
  {
    num: '06',
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    title: 'طراحی موبایل‌فراست',
    description: 'تجربه کاملاً واکنش‌گرا بهینه‌شده برای تمام دستگاه‌ها با پشتیبانی از زبان فارسی.',
  },
];

const roadmap = [
  {
    phase: 'فاز ۱',
    title: 'پایه پروژه',
    status: 'completed',
    items: ['ساختار پروژه', 'پیکربندی TypeScript', 'ESLint & Prettier', 'Docker'],
  },
  {
    phase: 'فاز ۲',
    title: 'سیستم طراحی',
    status: 'completed',
    items: ['توکن‌های طراحی', 'TailwindCSS', 'کامپوننت‌ها', 'افکت‌های شیشه‌ای'],
  },
  {
    phase: 'فاز ۳',
    title: 'معماری دیتابیس',
    status: 'completed',
    items: ['اسکیماهای Mongoose', 'ایندکس‌ها', 'ابزار مایگریشن'],
  },
  {
    phase: 'فاز ۴',
    title: 'هسته بک‌اند',
    status: 'completed',
    items: ['سرور Express', 'میدلورها', 'سیستم لاگ', 'Redis', 'صف پردازش'],
  },
  {
    phase: 'فاز ۵',
    title: 'موتور قیمت‌گذاری',
    status: 'completed',
    items: ['محاسبه قیمت', 'نرخ ارز', 'قوانین قیمت', 'قفل قیمت', 'کش'],
  },
  {
    phase: 'فاز ۶',
    title: 'ماژول محصول',
    status: 'completed',
    items: ['اسکیما', 'Repository', 'سرویس', 'کنترلر', 'مسیرها'],
  },
  {
    phase: 'فاز ۷',
    title: 'فرانت‌اند مارکت‌پلیس',
    status: 'completed',
    items: ['لایه‌بندی', 'لیست محصولات', 'جزئیات', 'دسته‌بندی‌ها', 'جستجو'],
  },
  {
    phase: 'فاز ۸',
    title: 'سبد خرید و تسویه',
    status: 'completed',
    items: ['مدیریت سبد', 'اعتبارسنجی قیمت', 'قفل قیمت', 'تسویه حساب'],
  },
  {
    phase: 'فاز ۹',
    title: 'داشبورد فروشنده',
    status: 'completed',
    items: ['داشبورد اصلی', 'مدیریت محصولات', 'سفارشات', 'موجودی'],
  },
  {
    phase: 'فاز ۱۰',
    title: 'پنل مدیریت',
    status: 'completed',
    items: ['داشبورد', 'مدیریت کاربران', 'مدیریت فروشگاه‌ها', 'مانیتورینگ'],
  },
  {
    phase: 'آینده',
    title: 'بهبودهای بعدی',
    status: 'planned',
    items: ['دروازه پرداخت', 'ایمیل سرویس', 'اعلان‌ها', 'هوش مصنوعی', 'اپلیکیشن موبایل'],
  },
];

const techStack = [
  { name: 'Next.js 15', role: 'فرانت‌اند' },
  { name: 'React 19', role: 'رابط کاربری' },
  { name: 'TypeScript', role: 'امنیت تایپ' },
  { name: 'Node.js', role: 'سرور' },
  { name: 'Express', role: 'HTTP فریمورک' },
  { name: 'MongoDB', role: 'دیتابیس' },
  { name: 'Redis', role: 'کش' },
  { name: 'Docker', role: 'کانتینر' },
];

const steps = [
  {
    step: '۰۱',
    title: 'فروشنده محصول ثبت می‌کند',
    description: 'فروشندگان لیست محصولات خود را با قیمت پایه و قوانین قیمت‌گذاری ایجاد می‌کنند.',
    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
  },
  {
    step: '۰۲',
    title: 'موتور قیمت‌ها را محاسبه می‌کند',
    description: 'موتور قیمت‌گذاری نرخ ارز، قوانین markup و الگوریتم‌های پویا را اعمال می‌کند.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    step: '۰۳',
    title: 'مشتری قیمت لحظه‌ای را می‌بیند',
    description: 'مشتریان آخرین قیمت را به صورت لحظه‌ای در تمام ارزها مشاهده می‌کنند.',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
  {
    step: '۰۴',
    title: 'قیمت قفل شده و سفارش تکمیل می‌شود',
    description: 'قیمت به مدت ۱۵ دقیقه در حین تسویه حساب قفل می‌شود و از خریدار و فروشنده محافظت می‌کند.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
];

// ===========================================
// SECTION LABEL COMPONENT
// ===========================================

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-px bg-[#00C8FF]" />
      <span className="text-[#00C8FF] text-[11px] tracking-[0.22em] uppercase font-['Space_Grotesk']">
        {text}
      </span>
    </div>
  );
}

// ===========================================
// LANDING PAGE
// ===========================================

export default function Home() {
  // Scroll reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* ===== FIXED 3D BACKGROUND ===== */}
      <ScrollZoomScene />

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="relative z-10">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-16 py-5 transition-all duration-400 border-b border-transparent hover:border-[rgba(0,200,255,0.12)] hover:bg-[rgba(6,6,8,0.72)] hover:backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#00C8FF] text-[#060608] text-sm font-bold font-['Space_Grotesk']">
              LP
            </div>
            <span className="text-[#F2F2F5] text-lg font-bold font-['Space_Grotesk'] tracking-tight">
              پلتفرم قیمت زنده
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-[#9898A8] text-sm tracking-widest font-['Space_Grotesk'] hover:text-[#00C8FF] transition-colors duration-250">امکانات</a>
            <a href="#how-it-works" className="text-[#9898A8] text-sm tracking-widest font-['Space_Grotesk'] hover:text-[#00C8FF] transition-colors duration-250">نحوه کار</a>
            <a href="#roadmap" className="text-[#9898A8] text-sm tracking-widest font-['Space_Grotesk'] hover:text-[#00C8FF] transition-colors duration-250">نقشه راه</a>
            <a href="#tech" className="text-[#9898A8] text-sm tracking-widest font-['Space_Grotesk'] hover:text-[#00C8FF] transition-colors duration-250">تکنولوژی</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/marketplace">
              <Button className="bg-[#00C8FF] text-[#060608] font-['Space_Grotesk'] font-semibold text-sm tracking-widest px-8 py-3 rounded-none border-none transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,200,255,0.4)] hover:-translate-y-px">
                ورود به مارکت‌پلیس
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 border border-[rgba(0,200,255,0.2)] bg-[rgba(0,200,255,0.05)] px-5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#00C8FF] animate-pulse-dot" />
              <span className="text-[#00C8FF] text-[11px] tracking-[0.22em] uppercase font-['Space_Grotesk']">
                موتور قیمت‌گذاری زنده فعال است
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-[#F2F2F5] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            قیمت‌هایی که{' '}
            <span className="text-transparent [-webkit-text-stroke:1.5px_#00C8FF]">
              با بازار حرکت می‌کنند
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto mt-8 max-w-2xl text-lg text-[#9898A8] font-light leading-relaxed"
          >
            بازارچه چندفروشنده‌ای مدرن با موتور قیمت‌گذاری پویا
            به‌روزرسانی خودکار قیمت‌ها، پشتیبانی چند ارزی و محافظت قیمت — ساخته شده برای مقیاس
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Link href="/marketplace">
              <Button size="lg" className="bg-[#00C8FF] text-[#060608] font-['Space_Grotesk'] font-semibold text-sm tracking-widest px-10 py-4 rounded-none border-none transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,200,255,0.4)] hover:-translate-y-px btn-glow">
                ورود به مارکت‌پلیس
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" className="bg-transparent text-[#9898A8] font-['Space_Grotesk'] text-sm tracking-wider px-6 py-4 border border-[rgba(255,255,255,0.12)] rounded-none transition-all duration-300 hover:border-[#00C8FF] hover:text-[#F2F2F5]">
                مشاهده امکانات
              </Button>
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-[#5A5A6E]"
            >
              <span className="text-[10px] tracking-[0.22em] uppercase font-['Space_Grotesk']">اسکرول</span>
              <svg className="h-4 w-4 text-[#00C8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] sm:grid-cols-4">
              {[
                { value: 100, suffix: 'K+', label: 'PRODUCTS' },
                { value: 10, suffix: 'K+', label: 'SELLERS' },
                { value: 20, suffix: '+', label: 'CURRENCIES' },
                { value: 99, suffix: '.9%', label: 'UPTIME' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#111116] p-8 text-center">
                  <div className="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-[#F2F2F5]">
                    <CounterAnimation target={stat.value} />
                    <span className="text-[#00C8FF]">{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-[#5A5A6E] tracking-widest mt-2 font-['Space_Grotesk']">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <SectionLabel text="FEATURES" />
              <h2 className="text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#F2F2F5] sm:text-5xl">
                همه چیزی که نیاز دارید
              </h2>
              <p className="mt-4 text-lg text-[#9898A8] font-light">
                یک پلتفرم کامل برای تجارت مدرن چندفروشنده‌ای
              </p>
            </div>
          </AnimatedSection>
          <div className="grid gap-px bg-[rgba(255,255,255,0.06)] sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <AnimatedCard key={feature.title} index={i}>
                <div className="group relative bg-[#111116] p-10 transition-colors duration-300 hover:bg-[rgba(0,200,255,0.04)]">
                  <div className="card-glow-line" />
                  <div className="text-[11px] tracking-[0.16em] text-[rgba(0,200,255,0.4)] mb-4 font-['Space_Grotesk']">
                    {feature.num}
                  </div>
                  <svg className="w-12 h-12 mb-7 text-[#00C8FF] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                  <h3 className="text-[#F2F2F5] text-xl font-semibold font-['Space_Grotesk'] mb-3">{feature.title}</h3>
                  <p className="text-[#9898A8] text-sm leading-7">{feature.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <SectionLabel text="HOW IT WORKS" />
              <h2 className="text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#F2F2F5] sm:text-5xl">
                نحوه کار
              </h2>
              <p className="mt-4 text-lg text-[#9898A8] font-light">
                از ثبت محصول تا تکمیل سفارش در چهار مرحله ساده
              </p>
            </div>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-[rgba(0,200,255,0.2)] via-[rgba(0,200,255,0.1)] to-transparent lg:left-1/2 lg:block" />
            <div className="space-y-16">
              {steps.map((step, index) => (
                <AnimatedSection key={step.step} delay={index * 0.15}>
                  <div className={`relative flex items-center gap-8 lg:gap-0 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                      <div className={`inline-flex ${index % 2 === 1 ? 'lg:ml-auto' : ''}`}>
                        <div className="bg-[#111116] border border-[rgba(255,255,255,0.06)] p-8 transition-all duration-300 hover:border-[rgba(0,200,255,0.2)]">
                          <div className="text-[11px] tracking-[0.22em] text-[#00C8FF] mb-4 font-['Space_Grotesk'] uppercase">
                            مرحله {step.step}
                          </div>
                          <h3 className="text-xl font-semibold font-['Space_Grotesk'] text-[#F2F2F5] mb-3">{step.title}</h3>
                          <p className="text-sm text-[#9898A8] leading-7">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 hidden lg:flex lg:flex-1 lg:justify-center">
                      <div className="flex h-14 w-14 items-center justify-center bg-[#00C8FF] text-[#060608]">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TECH STACK ===== */}
      <section id="tech" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <SectionLabel text="TECH STACK" />
              <h2 className="text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#F2F2F5] sm:text-5xl">
                تکنولوژی‌های استفاده شده
              </h2>
              <p className="mt-4 text-lg text-[#9898A8] font-light">
                ساخته شده با بهترین ابزارهای صنعت
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)] sm:grid-cols-4">
            {techStack.map((tech, i) => (
              <AnimatedCard key={tech.name} index={i}>
                <div className="group relative bg-[#111116] p-6 transition-colors duration-300 hover:bg-[rgba(0,200,255,0.04)]">
                  <div className="card-glow-line" />
                  <div className="text-[11px] tracking-[0.16em] text-[rgba(0,200,255,0.4)] mb-3 font-['Space_Grotesk']">
                    {tech.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="text-[#F2F2F5] text-sm font-semibold font-['Space_Grotesk']">{tech.name}</h3>
                  <p className="text-[10px] text-[#5A5A6E] tracking-widest mt-1 font-['Space_Grotesk'] uppercase">{tech.role}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section id="roadmap" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <SectionLabel text="ROADMAP" />
              <h2 className="text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#F2F2F5] sm:text-5xl">
                نقشه راه پروژه
              </h2>
              <p className="mt-4 text-lg text-[#9898A8] font-light">
                مراحل توسعه و برنامه‌های آینده
              </p>
            </div>
          </AnimatedSection>
          <div className="grid gap-px bg-[rgba(255,255,255,0.06)] sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item, i) => (
              <AnimatedCard key={item.phase} index={i}>
                <div className="group relative bg-[#111116] p-6 transition-colors duration-300 hover:bg-[rgba(0,200,255,0.04)]">
                  <div className="card-glow-line" />
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 tracking-widest font-['Space_Grotesk'] ${
                      item.status === 'completed'
                        ? 'bg-[rgba(0,200,255,0.1)] text-[#00C8FF]'
                        : 'bg-[rgba(255,255,255,0.06)] text-[#5A5A6E]'
                    }`}>
                      {item.phase}
                    </span>
                    {item.status === 'completed' ? (
                      <svg className="h-4 w-4 text-[#00C8FF]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-[#5A5A6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-[#F2F2F5] text-base font-semibold font-['Space_Grotesk'] mb-3">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.items.map((task) => (
                      <li key={task} className="flex items-center gap-2 text-sm text-[#9898A8]">
                        <span className={`h-1 w-1 ${item.status === 'completed' ? 'bg-[#00C8FF]' : 'bg-[#5A5A6E]'}`} />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative bg-[#111116] border border-[rgba(255,255,255,0.06)] p-16 text-center overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[rgba(0,200,255,0.03)]" />
                <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[rgba(0,200,255,0.03)]" />
              </div>
              <div className="relative">
                <SectionLabel text="GET STARTED" />
                <h2 className="text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-[#F2F2F5] sm:text-5xl">
                  آماده‌اید شروع کنید؟
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-[#9898A8] font-light leading-relaxed">
                  به هزاران فروشنده بپیوندید که از پلتفرم قیمت زنده برای رسیدن به مشتریان در سراسر جهان استفاده می‌کنند.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Link href="/marketplace">
                    <Button size="lg" className="bg-[#00C8FF] text-[#060608] font-['Space_Grotesk'] font-semibold text-sm tracking-widest px-10 py-4 rounded-none border-none transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,200,255,0.4)] hover:-translate-y-px btn-glow">
                      فروشگاه خود را باز کنید
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button size="lg" className="bg-transparent text-[#9898A8] font-['Space_Grotesk'] text-sm tracking-wider px-6 py-4 border border-[rgba(255,255,255,0.12)] rounded-none transition-all duration-300 hover:border-[#00C8FF] hover:text-[#F2F2F5]">
                      مشاهده مارکت‌پلیس
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[rgba(255,255,255,0.07)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-[#00C8FF] text-[#060608] text-sm font-bold font-['Space_Grotesk']">
                  LP
                </div>
                <span className="text-[#F2F2F5] text-lg font-bold font-['Space_Grotesk'] tracking-tight">پلتفرم قیمت زنده</span>
              </Link>
              <p className="mt-4 text-sm text-[#9898A8] leading-relaxed">
                بازارچه چندفروشنده‌ای مدرن با قیمت‌گذاری پویای لحظه‌ای
              </p>
            </div>
            <div>
              <h3 className="text-[10px] tracking-[0.22em] text-[#5A5A6E] uppercase font-['Space_Grotesk'] mb-5">پلتفرم</h3>
              <ul className="space-y-3">
                <li><Link href="/marketplace" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">مارکت‌پلیس</Link></li>
                <li><a href="#features" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">امکانات</a></li>
                <li><a href="#roadmap" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">نقشه راه</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] tracking-[0.22em] text-[#5A5A6E] uppercase font-['Space_Grotesk'] mb-5">برای فروشندگان</h3>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">داشبورد فروشنده</Link></li>
                <li><Link href="/admin" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">پنل مدیریت</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] tracking-[0.22em] text-[#5A5A6E] uppercase font-['Space_Grotesk'] mb-5">پشتیبانی</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">مرکز راهنما</Link></li>
                <li><Link href="/contact" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">تماس با ما</Link></li>
                <li><Link href="/privacy" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">حریم خصوصی</Link></li>
                <li><Link href="/terms" className="text-sm text-[#9898A8] hover:text-[#00C8FF] transition-colors">شرایط استفاده</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-[rgba(255,255,255,0.07)] pt-8 text-center text-sm text-[#5A5A6E] font-['Space_Grotesk']">
            &copy; {new Date().getFullYear()} پلتفرم قیمت زنده. تمامی حقوق محفوظ است.
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
