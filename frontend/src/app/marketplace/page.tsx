'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SampleProductImage, SampleCategoryImage, SampleStoreBanner, SampleStoreLogo } from '@/components/marketplace/images/SampleImages';

// ===========================================
// DATA - Tech Categories
// ===========================================

interface ProductItem {
  id: string;
  name: string;
  category: string;
  index: number;
  price: number;
  compareAt?: number;
  currency: string;
  store: string;
  rating: number;
  reviews: number;
  isLive: boolean;
  inStock: boolean;
  isNew?: boolean;
}

const categories = [
  { name: 'لپ‌تاپ', slug: 'laptop', count: '۲,۴۵۰' },
  { name: 'قطعات کامپیوتر', slug: 'pc-parts', count: '۳,۳۲۰' },
  { name: 'دوربین', slug: 'camera', count: '۱,۷۸۰' },
  { name: 'تبلت', slug: 'tablet', count: '۱,۲۱۰' },
  { name: 'موبایل', slug: 'mobile', count: '۴,۸۹۰' },
  { name: 'لوازم جانبی', slug: 'accessories', count: '۵,۴۵۰' },
  { name: 'مانیتور', slug: 'monitor', count: '۱,۹۶۰' },
  { name: 'حافظه', slug: 'storage', count: '۸۹۰' },
];

const featuredProducts: ProductItem[] = [
  { id: '1', name: 'مک‌بوک پرو ۱۴ اینچ', category: 'laptop', index: 0, price: 89990000, compareAt: 99990000, currency: 'IRR', store: 'فروشگاه تکنولوژی', rating: 4.8, reviews: 124, isLive: true, inStock: true },
  { id: '2', name: 'کارت گرافیک RTX 4070', category: 'pc-parts', index: 1, price: 32990000, currency: 'IRR', store: 'پارس کامپیوتر', rating: 4.7, reviews: 89, isLive: true, inStock: true },
  { id: '3', name: 'دوربین سونی A7IV', category: 'camera', index: 0, price: 74990000, compareAt: 84990000, currency: 'IRR', store: 'عکاسان', rating: 4.9, reviews: 56, isLive: true, inStock: true },
  { id: '4', name: 'آیپد پرو ۱۲.۹ اینچ', category: 'tablet', index: 0, price: 54990000, currency: 'IRR', store: 'اپل‌استور', rating: 4.8, reviews: 203, isLive: true, inStock: true },
  { id: '5', name: 'آیفون ۱۵ پرو مکس', category: 'mobile', index: 0, price: 79990000, compareAt: 89990000, currency: 'IRR', store: 'موبایل‌مارکت', rating: 4.9, reviews: 312, isLive: true, inStock: true },
  { id: '6', name: 'هدفون سونی WH-1000XM5', category: 'accessories', index: 0, price: 12990000, compareAt: 15990000, currency: 'IRR', store: 'صوتی‌وتصویری', rating: 4.7, reviews: 178, isLive: true, inStock: true },
  { id: '7', name: 'پردازنده رایزن 9 7950X', category: 'pc-parts', index: 0, price: 24990000, currency: 'IRR', store: 'پارس کامپیوتر', rating: 4.6, reviews: 67, isLive: true, inStock: true },
  { id: '8', name: 'مانیتور گیمینگ ASUS 27"', category: 'monitor', index: 0, price: 18990000, currency: 'IRR', store: 'فروشگاه تکنولوژی', rating: 4.5, reviews: 45, isLive: true, inStock: true },
  { id: '9', name: 'هارد SSD سامسونگ 2TB', category: 'storage', index: 0, price: 4990000, currency: 'IRR', store: 'هاردمارکت', rating: 4.8, reviews: 234, isLive: true, inStock: true },
];

const newestProducts: ProductItem[] = [
  { id: '10', name: 'لپ‌تاپ ایسوس ROG Strix', category: 'laptop', index: 1, price: 64990000, currency: 'IRR', store: 'گیمینگ‌شاپ', rating: 0, reviews: 0, isLive: true, inStock: true, isNew: true },
  { id: '11', name: 'رم DDR5 32GB Corsair', category: 'pc-parts', index: 2, price: 3990000, currency: 'IRR', store: 'پارس کامپیوتر', rating: 0, reviews: 0, isLive: true, inStock: true, isNew: true },
  { id: '12', name: 'دوربین کانن R6 Mark II', category: 'camera', index: 1, price: 89990000, currency: 'IRR', store: 'عکاسان', rating: 0, reviews: 0, isLive: true, inStock: true, isNew: true },
  { id: '13', name: 'تبلت سامسونگ Galaxy Tab S9', category: 'tablet', index: 1, price: 34990000, currency: 'IRR', store: 'موبایل‌مارکت', rating: 0, reviews: 0, isLive: true, inStock: true, isNew: true },
  { id: '14', name: 'سامسونگ Galaxy S24 Ultra', category: 'mobile', index: 1, price: 69990000, currency: 'IRR', store: 'موبایل‌مارکت', rating: 0, reviews: 0, isLive: true, inStock: true, isNew: true },
  { id: '15', name: 'کیبورد مکانیکی Logitech', category: 'accessories', index: 3, price: 2990000, currency: 'IRR', store: 'لوازم‌ جانبی', rating: 0, reviews: 0, isLive: true, inStock: true, isNew: true },
];

const topStores = [
  { name: 'فروشگاه تکنولوژی', products: 245, rating: 4.8, orders: 1240, variant: 0 },
  { name: 'پارس کامپیوتر', products: 189, rating: 4.7, orders: 980, variant: 1 },
  { name: 'موبایل‌مارکت', products: 156, rating: 4.9, orders: 756, variant: 2 },
  { name: 'عکاسان', products: 134, rating: 4.6, orders: 623, variant: 3 },
  { name: 'گیمینگ‌شاپ', products: 98, rating: 4.8, orders: 1102, variant: 4 },
  { name: 'هاردمارکت', products: 67, rating: 4.5, orders: 445, variant: 5 },
];

const latestPriceUpdates = [
  { id: '1', name: 'مک‌بوک پرو ۱۴ اینچ', category: 'laptop', index: 0, price: 89990000, oldPrice: 92990000, change: -3.2, time: '۲ دقیقه پیش' },
  { id: '2', name: 'کارت گرافیک RTX 4070', category: 'pc-parts', index: 1, price: 32990000, oldPrice: 31990000, change: 3.1, time: '۵ دقیقه پیش' },
  { id: '3', name: 'هدفون سونی XM5', category: 'accessories', index: 0, price: 12990000, oldPrice: 13490000, change: -3.7, time: '۸ دقیقه پیش' },
  { id: '4', name: 'آیفون ۱۵ پرو مکس', category: 'mobile', index: 0, price: 79990000, oldPrice: 78990000, change: 1.3, time: '۱۲ دقیقه پیش' },
];

const sortOptions = [
  { value: 'featured', label: 'پیشنهادی' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price-low', label: 'ارزان‌ترین' },
  { value: 'price-high', label: 'گران‌ترین' },
  { value: 'rating', label: 'پرتخفیف' },
];

const priceRanges = [
  { label: 'زیر ۵ میلیون', min: 0, max: 5000000 },
  { label: '۵ تا ۱۵ میلیون', min: 5000000, max: 15000000 },
  { label: '۱۵ تا ۳۰ میلیون', min: 15000000, max: 30000000 },
  { label: '۳۰ تا ۶۰ میلیون', min: 30000000, max: 60000000 },
  { label: 'بالای ۶۰ میلیون', min: 60000000, max: Infinity },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

// ===========================================
// COMPONENTS
// ===========================================

function ProductCard({ product }: { product: ProductItem }) {
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return (
    <Link href={`/marketplace/products/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50">
        <div className="relative">
          <SampleProductImage category={product.category} index={product.index} className="aspect-square" />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur">
                <span className="h-1 w-1 animate-pulse rounded-full bg-indigo-500" />
                لحظه‌ای
              </span>
            )}
            {product.isNew && (
              <span className="inline-flex rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                جدید
              </span>
            )}
            {discount > 0 && (
              <span className="inline-flex rounded-full bg-rose-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                %{discount}-
              </span>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                ناموجود
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400">{product.store}</p>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-1">
            {product.name}
          </h3>
          {product.rating > 0 && (
            <div className="mt-1.5 flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.reviews})</span>
            </div>
          )}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function StoreCard({ store }: { store: typeof topStores[0] }) {
  return (
    <Link href="/marketplace/stores" className="group block">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50">
        <SampleStoreBanner name={store.name} variant={store.variant} className="h-24" />
        <div className="relative px-5 pb-5">
          <div className="-mt-7 mb-3">
            <SampleStoreLogo name={store.name} variant={store.variant} className="h-14 w-14 border-4 border-white shadow-lg" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600">{store.name}</h3>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span>{store.products} محصول</span>
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {store.rating}
            </span>
            <span>{store.orders} سفارش</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PriceUpdateCard({ update }: { update: typeof latestPriceUpdates[0] }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-indigo-100 hover:shadow-md">
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
        <SampleProductImage category={update.category} index={update.index} className="h-full w-full" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{update.name}</p>
        <p className="text-xs text-gray-400">{update.time}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-900">{formatPrice(update.price)}</p>
        <p className={`text-xs font-medium ${update.change < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {update.change < 0 ? '' : '+'}{update.change.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}

// ===========================================
// MARKETPLACE PAGE
// ===========================================

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-200">
              LP
            </div>
            <span className="text-lg font-bold text-gray-900">پلتفرم قیمت زنده</span>
          </Link>

          <div className="flex-1 max-w-xl mx-6 hidden md:block">
            <div className="relative">
              <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="جستجوی محصولات، فروشگاه‌ها، دسته‌بندی‌ها..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:inline-flex text-sm">فروشنده شوید</Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">۳</span>
            </Button>
            <Button variant="ghost" size="icon">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-100 px-4 py-3 md:hidden">
          <div className="relative">
            <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </header>

      {/* ===== HERO BANNER ===== */}
      <section className="relative overflow-hidden bg-gradient-to-l from-indigo-600 via-violet-600 to-indigo-700">
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              محصولات شگفت‌انگیز کشف کنید
            </h1>
            <p className="mt-3 max-w-xl text-indigo-100">
              هزاران محصول با قیمت‌های لحظه‌ای از فروشندگان معتبر در سراسر کشور
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-full bg-white/10 px-2 py-1 backdrop-blur">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                قیمت لحظه‌ای
              </span>
              <span className="px-2 text-xs text-indigo-200">بیش از ۱۵,۰۰۰ محصول با قیمت به‌روز</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* ===== MAIN CONTENT ===== */}
          <div>
            {/* ===== FEATURED PRODUCTS ===== */}
            <section className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">محصولات ویژه</h2>
                  <p className="mt-1 text-sm text-gray-500">بهترین پیشنهادات با قیمت لحظه‌ای</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* ===== CATEGORIES GRID ===== */}
            <section className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">دسته‌بندی‌ها</h2>
                  <p className="mt-1 text-sm text-gray-500">بر اساس دسته‌بندی مرور کنید</p>
                </div>
                <Link href="/marketplace/categories" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                  مشاهده همه
                  <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/marketplace/categories/${cat.slug}`} className="group block">
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50">
                      <SampleCategoryImage name={cat.name} slug={cat.slug} className="aspect-square" />
                      <div className="p-3 text-center">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600">{cat.name}</h3>
                        <p className="mt-0.5 text-xs text-gray-400">{cat.count} محصول</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ===== NEWEST PRODUCTS ===== */}
            <section className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">تازه‌ها</h2>
                  <p className="mt-1 text-sm text-gray-500">افزوده‌های جدید به مارکت‌پلیس</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {newestProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* ===== TOP STORES ===== */}
            <section className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">فروشگاه‌های برتر</h2>
                  <p className="mt-1 text-sm text-gray-500">از معتبرترین فروشندگان خرید کنید</p>
                </div>
                <Link href="/marketplace/stores" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                  مشاهده همه
                  <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {topStores.map((store) => (
                  <StoreCard key={store.name} store={store} />
                ))}
              </div>
            </section>
          </div>

          {/* ===== SIDEBAR ===== */}
          <aside className="space-y-6">
            {/* Live Price Updates */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                  لحظه‌ای
                </span>
                <h3 className="text-sm font-semibold text-gray-900">تغییرات قیمت</h3>
              </div>
              <div className="space-y-2">
                {latestPriceUpdates.map((update) => (
                  <PriceUpdateCard key={update.id} update={update} />
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">محدوده قیمت</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">دسترسی سریع</h3>
              <div className="space-y-3">
                <Link href="/dashboard" className="flex items-center gap-3 rounded-xl p-3 text-sm text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-700">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  داشبورد فروشنده
                </Link>
                <Link href="/marketplace/stores" className="flex items-center gap-3 rounded-xl p-3 text-sm text-gray-600 transition-all hover:bg-violet-50 hover:text-violet-700">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </div>
                  همه فروشگاه‌ها
                </Link>
                <Link href="/admin" className="flex items-center gap-3 rounded-xl p-3 text-sm text-gray-600 transition-all hover:bg-cyan-50 hover:text-cyan-700">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  پنل مدیریت
                </Link>
              </div>
            </div>

            {/* Promo Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">همین حالا فروشنده شوید</h3>
              <p className="mt-2 text-sm text-indigo-100">
                فروشگاه خود را باز کنید و به هزاران مشتری با قیمت‌گذاری پویا دسترسی پیدا کنید
              </p>
              <Link href="/dashboard">
                <Button className="mt-4 w-full bg-white text-indigo-600 hover:bg-gray-50">
                  باز کردن فروشگاه
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-200">LP</div>
                <span className="text-lg font-bold text-gray-900">پلتفرم قیمت زنده</span>
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                بازارچه چندفروشنده‌ای مدرن با قیمت‌گذاری پویای لحظه‌ای
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">مارکت‌پلیس</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/marketplace" className="text-sm text-gray-500 hover:text-indigo-600">همه محصولات</Link></li>
                <li><Link href="/marketplace/categories" className="text-sm text-gray-500 hover:text-indigo-600">دسته‌بندی‌ها</Link></li>
                <li><Link href="/marketplace/stores" className="text-sm text-gray-500 hover:text-indigo-600">فروشگاه‌ها</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">برای فروشندگان</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600">داشبورد فروشنده</Link></li>
                <li><Link href="/admin" className="text-sm text-gray-500 hover:text-indigo-600">پنل مدیریت</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">پشتیبانی</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/help" className="text-sm text-gray-500 hover:text-indigo-600">مرکز راهنما</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-500 hover:text-indigo-600">تماس با ما</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600">حریم خصوصی</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} پلتفرم قیمت زنده. تمامی حقوق محفوظ است.
          </div>
        </div>
      </footer>
    </div>
  );
}
