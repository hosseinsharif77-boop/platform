<div align="center">

# Live Price Platform

### A Modern Multi-Vendor Marketplace with Dynamic Live Pricing Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)

---

**Live Price Platform** is a production-grade, scalable SaaS multi-vendor marketplace featuring a Dynamic Pricing Engine that automatically updates product prices based on configurable rules and exchange rates.

[Getting Started](#-installation-guide) • [Documentation](#-project-architecture) • [API Reference](#-api-structure) • [Contributing](#-contributing)

---

</div>

## Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Project Vision](#-project-vision)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Module Documentation](#-module-documentation)
- [Development Phases](#-development-phases)
- [Current Progress](#-current-progress)
- [Installation Guide](#-installation-guide)
- [Environment Variables](#-environment-variables)
- [API Structure](#-api-structure)
- [Database Documentation](#-database-documentation)
- [Coding Standards](#-coding-standards)
- [Design System](#-design-system)
- [Security](#-security)
- [Performance](#-performance)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## Project Overview

### The Problem

In today's global marketplace, product prices fluctuate constantly due to:

- **Currency exchange rate changes** - Prices in different currencies become outdated within hours
- **Supplier cost variations** - Wholesale prices change frequently
- **Competitive pressure** - Sellers need to adjust prices dynamically
- **Inventory management** - Stock levels affect pricing strategies

Traditional ecommerce platforms require manual price updates, leading to:

- ❌ Outdated prices that damage customer trust
- ❌ Lost revenue from missed price optimization opportunities
- ❌ Time-consuming manual price management for sellers
- ❌ Inconsistent pricing across different currencies

### The Solution

**Live Price Platform** solves these problems with a **Dynamic Live Pricing Engine** that:

- ✅ Automatically updates prices based on real-time exchange rates
- ✅ Applies configurable pricing rules (markup, discount, dynamic)
- ✅ Locks prices during checkout to protect customers
- ✅ Maintains complete price history for transparency
- ✅ Supports multi-currency operations across global markets

### Core Concept

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LIVE PRICING FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Seller Sets Base Price                                             │
│         │                                                           │
│         ▼                                                           │
│  Pricing Engine Applies Rules                                       │
│  • Exchange Rate Conversion                                         │
│  • Markup/Discount Rules                                            │
│  • Dynamic Pricing Algorithms                                       │
│         │                                                           │
│         ▼                                                           │
│  Live Price Calculated                                              │
│         │                                                           │
│         ▼                                                           │
│  Customer Sees Current Price                                        │
│         │                                                           │
│         ▼                                                           │
│  Price Locked at Checkout (15 min)                                  │
│         │                                                           │
│         ▼                                                           │
│  Order Completed with Locked Price                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Features

### 🛒 Marketplace

| Feature | Description |
|---------|-------------|
| Product Listings | Multi-vendor product catalog with variants, images, and specifications |
| Category System | Hierarchical categories with nested support |
| Brand Management | Brand pages with product filtering |
| Store Profiles | Individual seller storefronts |
| Search & Filter | Full-text search with advanced filtering |
| Responsive Design | Mobile-first, works on all devices |
| RTL Support | Right-to-left language support |
| SEO Optimized | Dynamic metadata, Open Graph, structured data |

### 💰 Dynamic Pricing Engine

| Feature | Description |
|---------|-------------|
| Real-time Exchange Rates | Automatic currency conversion via external providers |
| Pricing Rules | Configurable markup, discount, and dynamic rules |
| Price History | Complete audit trail of all price changes |
| Price Versioning | Version-controlled pricing with rollback support |
| Price Locking | 15-minute price protection during checkout |
| Manual Override | Seller can manually set prices |
| Scheduled Updates | Automated price recalculation |
| Multi-Currency | Support for 20+ currencies |

### 🏪 Seller Dashboard

| Feature | Description |
|---------|-------------|
| Dashboard Home | Today's stats, revenue, orders |
| Product Management | CRUD operations, bulk actions |
| Price Management | Rule configuration, live pricing toggle |
| Inventory Tracking | Stock levels, low stock alerts |
| Order Management | View orders, update status |
| Analytics | Sales reports, product performance |
| Store Settings | Profile, branding, shipping |
| Notifications | Real-time updates |

### 🔐 Authentication & Security

| Feature | Description |
|---------|-------------|
| JWT Authentication | Secure token-based auth |
| Refresh Tokens | Automatic token rotation |
| Role-Based Access | Customer, Seller, Admin roles |
| Password Hashing | bcrypt with salt rounds |
| Rate Limiting | Redis-based rate limiting |
| Input Validation | Zod schema validation |
| CORS Configuration | Secure cross-origin requests |

### 🛍️ Cart & Checkout

| Feature | Description |
|---------|-------------|
| Shopping Cart | Add, update, remove items |
| Guest Cart | Session-based cart for guests |
| Cart Merging | Merge guest cart on login |
| Price Validation | Real-time price checking |
| Price Lock | Lock prices during checkout |
| Multi-step Checkout | Information, shipping, review |
| Address Management | Save multiple addresses |

### 📊 Admin Panel

| Feature | Description |
|---------|-------------|
| Platform Stats | Users, stores, revenue overview |
| User Management | Roles, permissions, status |
| Store Management | Approve, suspend, delete stores |
| Product Moderation | Review and approve products |
| Pricing Management | Exchange rates, rules |
| Order Management | View, cancel, refund orders |
| System Monitoring | Health checks, logs |
| Audit Logs | Track all admin actions |

### 🔔 Notifications

| Feature | Description |
|---------|-------------|
| Real-time Updates | WebSocket notifications |
| Email Notifications | Transactional emails |
| Push Notifications | Browser push notifications |
| In-App Notifications | Notification center |
| Broadcast Messages | Platform-wide announcements |

### 📈 Analytics

| Feature | Description |
|---------|-------------|
| Sales Analytics | Revenue, orders, trends |
| Product Analytics | Best sellers, performance |
| Customer Analytics | Behavior, retention |
| Price Analytics | Price history, changes |
| Store Analytics | Per-store metrics |

---

## Project Vision

### Scalability

The platform is designed to scale to:

- **100,000+ Products** across multiple stores
- **10,000+ Active Sellers** with independent pricing
- **Millions of Price Calculations** per day
- **100,000+ Concurrent Users** during peak traffic

### SaaS Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MULTI-TENANT ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │   Store A   │  │   Store B   │  │   Store C   │  ...          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘               │
│         │                │                │                        │
│         └────────────────┼────────────────┘                        │
│                          │                                         │
│                          ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                   SHARED PLATFORM CORE                      │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │  │
│  │  │ Pricing │  │ Orders  │  │Payments │  │Analytics│       │  │
│  │  │ Engine  │  │  System │  │ Gateway │  │ Service │       │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                          │                                         │
│                          ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    INFRASTRUCTURE                           │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │  │
│  │  │ MongoDB │  │  Redis  │  │ BullMQ  │  │  S3/CDN │       │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Differentiators

1. **Live Pricing Engine** - Automatic price updates based on rules and exchange rates
2. **Price Lock Protection** - Customers see stable prices during checkout
3. **Multi-Currency Support** - Real-time currency conversion
4. **Scalable Architecture** - Built for growth from day one
5. **Modern Tech Stack** - Using latest industry-standard technologies

---

## Technology Stack

### Frontend

| Technology | Version | Purpose | Why Selected |
|------------|---------|---------|--------------|
| **Next.js** | 15 | React Framework | App Router, Server Components, SSR/SSG support |
| **React** | 19 | UI Library | Latest features, concurrent mode |
| **TypeScript** | 5.3 | Type Safety | Enterprise-grade type checking |
| **TailwindCSS** | 3.4 | Styling | Utility-first, rapid development |
| **shadcn/ui** | Latest | Component Library | Accessible, customizable components |
| **Framer Motion** | 11 | Animations | Production-ready animation library |
| **Three.js** | 0.161 | 3D Graphics | Landing page hero effects |
| **React Hook Form** | 7.49 | Forms | Performant form handling |
| **Zod** | 3.22 | Validation | TypeScript-first schema validation |
| **Zustand** | 4.5 | State Management | Lightweight, simple state |

### Backend

| Technology | Version | Purpose | Why Selected |
|------------|---------|---------|--------------|
| **Node.js** | 18 | Runtime | JavaScript ecosystem, async I/O |
| **Express** | 4.18 | HTTP Framework | Mature, flexible middleware system |
| **TypeScript** | 5.3 | Type Safety | End-to-end type safety |
| **MongoDB** | 7.0 | Database | Flexible schema, horizontal scaling |
| **Mongoose** | 8.1 | ODM | Schema validation, middleware |
| **Redis** | 7.2 | Caching | In-memory caching, session store |
| **BullMQ** | Latest | Job Queue | Reliable background job processing |
| **JWT** | - | Authentication | Stateless, scalable auth |
| **bcryptjs** | 2.4 | Password Hashing | Industry-standard hashing |

### DevOps

| Technology | Purpose | Why Selected |
|------------|---------|--------------|
| **Docker** | Containerization | Consistent environments |
| **Docker Compose** | Orchestration | Multi-service development |
| **ESLint** | Linting | Code quality enforcement |
| **Prettier** | Formatting | Consistent code style |

---

## Project Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                     APP ROUTER (Next.js 15)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ (market) │  │(dashboard)│  │  (admin) │  │  (auth)  │   │  │
│  │  │ Marketplace│ │  Seller  │  │  Admin   │  │   Auth   │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    COMPONENT LAYER                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │    ui/   │  │marketplace│  │dashboard │  │  admin   │   │  │
│  │  │ shadcn/ui│  │Components│  │Components│  │Components│   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    FEATURE LAYER                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │products/ │  │  cart/   │  │ checkout/│  │dashboard/│   │  │
│  │  │  market/ │  │          │  │          │  │  admin/  │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    SERVICE LAYER                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ services │  │  hooks   │  │  store   │  │   lib    │   │  │
│  │  │ API Calls│  │  Logic   │  │  State   │  │  Utils   │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Request Flow:                                                      │
│                                                                     │
│  Client → Routes → Middlewares → Controllers → Services → Repos    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    EXPRESS SERVER                            │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │                 MIDDLEWARE STACK                      │   │  │
│  │  │  Helmet → CORS → Rate Limit → Auth → Validation     │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    MODULE LAYER                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │   auth   │  │ product  │  │ pricing  │  │   cart   │   │  │
│  │  │  Module  │  │  Module  │  │  Engine  │  │  Module  │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                  CLEAN ARCHITECTURE                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│  │  │ Controllers │  │  Services   │  │ Repositories│        │  │
│  │  │  (HTTP)     │  │ (Business)  │  │   (Data)    │        │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│                              ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                  DATA LAYER                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ MongoDB  │  │  Redis   │  │  BullMQ  │  │  Events  │   │  │
│  │  │ Database │  │  Cache   │  │  Queue   │  │   Bus    │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Database Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE RELATIONSHIPS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Users ──────< StoreMembers >────── Stores                         │
│    │                                  │                            │
│    │                                  ├──< Products                │
│    │                                  │     ├──< Variants          │
│    │                                  │     ├──< Images            │
│    │                                  │     └──< PriceHistory      │
│    │                                  ├──< Orders                  │
│    │                                  │     ├──< OrderItems        │
│    │                                  │     ├──< Payments          │
│    │                                  │     └──< Shipments         │
│    │                                  ├──< PricingRules            │
│    │                                  └──< StoreSettings           │
│    │                                                               │
│    ├──< Carts ────────< CartItems                                 │
│    ├──< Addresses                                                  │
│    ├──< Reviews                                                    │
│    ├──< Favorites                                                  │
│    └──< Notifications                                              │
│                                                                     │
│  Products ──< PriceHistory                                         │
│  Products ──< PriceVersions                                        │
│  Products ──< PriceLocks                                           │
│                                                                     │
│  Categories ──< Categories (self-referencing)                      │
│  Categories ──< Products                                           │
│                                                                     │
│  Currencies ──< ExchangeRates                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Pricing Engine Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRICING ENGINE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    REQUEST FLOW                              │  │
│  │                                                              │  │
│  │  Product Request                                             │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  Check Redis Cache                                           │  │
│  │       │                                                      │  │
│  │       ├── HIT → Return Cached Price                          │  │
│  │       │                                                      │  │
│  │       └── MISS                                               │  │
│  │            │                                                 │  │
│  │            ▼                                                 │  │
│  │  Fetch Base Price                                            │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  Apply Pricing Rules                                         │  │
│  │  • Exchange Rate                                             │  │
│  │  • Markup/Discount                                           │  │
│  │  • Dynamic Rules                                             │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  Calculate Final Price                                       │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  Cache Result (TTL: 5 min)                                   │  │
│  │       │                                                      │  │
│  │       ▼                                                      │  │
│  │  Return Price                                                │  │
│  │                                                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    PROVIDER SYSTEM                           │  │
│  │                                                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │  │
│  │  │   Primary   │  │  Secondary  │  │   Fallback  │         │  │
│  │  │  Provider   │  │  Provider   │  │   Provider  │         │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │  │
│  │         │                │                │                  │  │
│  │         └────────────────┼────────────────┘                  │  │
│  │                          │                                   │  │
│  │                          ▼                                   │  │
│  │                 Provider Registry                            │  │
│  │                                                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

### Root Level

```
live-price-platform/
├── frontend/                    # Next.js 15 frontend application
├── backend/                     # Express.js backend API
├── docker-compose.yml           # Docker service orchestration
├── package.json                 # Root package.json (npm workspaces)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Marketing pages layout
│   │   │   └── page.tsx              # Landing page
│   │   ├── (marketplace)/            # Marketplace layout
│   │   │   ├── page.tsx              # Marketplace home
│   │   │   ├── products/             # Product pages
│   │   │   ├── categories/           # Category pages
│   │   │   ├── stores/               # Store pages
│   │   │   └── search/               # Search results
│   │   ├── (dashboard)/              # Seller dashboard layout
│   │   │   ├── dashboard/            # Dashboard home
│   │   │   ├── products/             # Product management
│   │   │   ├── orders/               # Order management
│   │   │   ├── inventory/            # Inventory management
│   │   │   ├── pricing/              # Pricing management
│   │   │   ├── analytics/            # Analytics
│   │   │   ├── notifications/        # Notifications
│   │   │   └── settings/             # Store settings
│   │   ├── (admin)/                  # Admin panel layout
│   │   │   ├── admin/                # Admin dashboard
│   │   │   ├── users/                # User management
│   │   │   ├── stores/               # Store management
│   │   │   ├── products/             # Product management
│   │   │   ├── pricing/              # Pricing management
│   │   │   ├── orders/               # Order management
│   │   │   ├── payments/             # Payment management
│   │   │   ├── monitoring/           # System monitoring
│   │   │   ├── logs/                 # Audit logs
│   │   │   └── settings/             # Platform settings
│   │   ├── checkout/                 # Checkout flow
│   │   ├── auth/                     # Authentication pages
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # shadcn/ui base components
│   │   │   ├── button.tsx            # Button component
│   │   │   ├── card.tsx              # Card component
│   │   │   ├── input.tsx             # Input component
│   │   │   ├── glass-card.tsx        # Glass morphism card
│   │   │   ├── price-badge.tsx       # Price display badge
│   │   │   ├── live-badge.tsx        # Live price indicator
│   │   │   ├── product-card.tsx      # Product card
│   │   │   └── ...                   # Other UI components
│   │   ├── marketplace/              # Marketplace components
│   │   │   ├── layout/               # Navbar, Footer
│   │   │   ├── product/              # Product components
│   │   │   ├── category/             # Category components
│   │   │   ├── store/                # Store components
│   │   │   ├── search/               # Search components
│   │   │   └── ui/                   # Shared marketplace UI
│   │   ├── cart/                     # Cart components
│   │   │   ├── CartItem.tsx          # Cart item display
│   │   │   ├── CartDrawer.tsx        # Slide-out cart
│   │   │   ├── QuantitySelector.tsx  # Quantity input
│   │   │   └── PriceLockBanner.tsx   # Price lock indicator
│   │   ├── checkout/                 # Checkout components
│   │   │   ├── CheckoutProgress.tsx  # Step progress
│   │   │   ├── OrderSummary.tsx      # Order summary
│   │   │   └── PriceChangedDialog.tsx # Price change notification
│   │   ├── dashboard/                # Seller dashboard components
│   │   │   ├── layout/               # Dashboard layout
│   │   │   ├── cards/                # Stats cards
│   │   │   ├── charts/               # Chart components
│   │   │   └── tables/               # Table components
│   │   ├── admin/                    # Admin panel components
│   │   │   ├── layout/               # Admin layout
│   │   │   ├── cards/                # Dashboard cards
│   │   │   └── monitoring/           # Monitoring components
│   │   ├── motion/                   # Framer Motion components
│   │   │   ├── MotionComponents.tsx  # Animated wrappers
│   │   │   └── index.ts             # Exports
│   │   └── three/                    # Three.js components
│   │       ├── HeroScene.tsx         # Landing hero 3D scene
│   │       └── index.ts             # Exports
│   │
│   ├── features/                     # Feature modules
│   │   ├── products/                 # Product feature
│   │   │   ├── components/           # Product components
│   │   │   ├── hooks/                # Product hooks
│   │   │   ├── services/             # Product API services
│   │   │   └── types/                # Product types
│   │   ├── marketplace/              # Marketplace feature
│   │   │   ├── components/           # Marketplace components
│   │   │   ├── hooks/                # Marketplace hooks
│   │   │   ├── services/             # Marketplace API services
│   │   │   └── types/                # Marketplace types
│   │   ├── cart/                     # Cart feature
│   │   │   ├── components/           # Cart components
│   │   │   ├── hooks/                # Cart hooks
│   │   │   ├── services/             # Cart API services
│   │   │   └── types/                # Cart types
│   │   ├── checkout/                 # Checkout feature
│   │   │   ├── components/           # Checkout components
│   │   │   ├── hooks/                # Checkout hooks
│   │   │   ├── services/             # Checkout API services
│   │   │   └── types/                # Checkout types
│   │   ├── dashboard/                # Seller dashboard feature
│   │   │   ├── hooks/                # Dashboard hooks
│   │   │   ├── services/             # Dashboard API services
│   │   │   └── types/                # Dashboard types
│   │   └── admin/                    # Admin panel feature
│   │       ├── hooks/                # Admin hooks
│   │       ├── services/             # Admin API services
│   │       └── types/                # Admin types
│   │
│   ├── hooks/                        # Global React hooks
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useDebounce.ts            # Debounce hook
│   │   ├── useMediaQuery.ts          # Responsive hook
│   │   ├── useKeyboard.ts            # Keyboard shortcuts
│   │   └── useMotion.ts             # Animation hooks
│   │
│   ├── providers/                    # Context providers
│   │   ├── Providers.tsx             # Main provider wrapper
│   │   └── ThemeProvider.tsx         # Theme provider
│   │
│   ├── services/                     # API services
│   │   ├── api.ts                    # Axios instance
│   │   ├── auth.ts                   # Auth service
│   │   ├── store.ts                  # Store service
│   │   └── product.ts                # Product service
│   │
│   ├── store/                        # Zustand stores
│   │   └── authStore.ts              # Auth state
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── utils.ts                  # General utilities
│   │   ├── tokens.ts                 # Design tokens
│   │   └── animations.ts            # Animation variants
│   │
│   ├── config/                       # Configuration
│   │   └── index.ts                  # App config
│   │
│   ├── constants/                    # Constants
│   │   ├── api.ts                    # API endpoints
│   │   └── index.ts                  # Exports
│   │
│   └── types/                        # Global types
│       ├── index.ts                  # Common types
│       └── env.d.ts                  # Environment types
│
├── public/                           # Static assets
├── tailwind.config.ts                # Tailwind configuration
├── next.config.js                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── postcss.config.js                 # PostCSS configuration
├── Dockerfile                        # Docker build file
└── package.json                      # Frontend dependencies
```

### Backend Structure

```
backend/
├── src/
│   ├── config/                       # Configuration
│   │   ├── index.ts                  # Config loader
│   │   ├── env.schema.ts             # Environment validation
│   │   ├── cors.ts                   # CORS config
│   │   ├── database.ts               # Database config
│   │   ├── jwt.ts                    # JWT config
│   │   ├── redis.ts                  # Redis config
│   │   ├── rateLimit.ts              # Rate limiting config
│   │   └── server.ts                 # Server config
│   │
│   ├── core/                         # Core infrastructure
│   │   ├── errors/                   # Error classes
│   │   │   ├── AppError.ts           # Base error
│   │   │   ├── ValidationError.ts    # Validation error
│   │   │   ├── AuthenticationError.ts # Auth error
│   │   │   ├── AuthorizationError.ts # Authorization error
│   │   │   ├── DatabaseError.ts      # Database error
│   │   │   ├── BusinessError.ts      # Business logic error
│   │   │   ├── InternalError.ts      # Internal error
│   │   │   └── index.ts             # Exports
│   │   ├── logger/                   # Logging system
│   │   │   ├── config.ts             # Winston config
│   │   │   └── index.ts             # Logger service
│   │   └── events/                   # Event bus
│   │       └── index.ts             # Event system
│   │
│   ├── database/                     # Database layer
│   │   ├── index.ts                  # MongoDB connection
│   │   ├── redis.ts                  # Redis connection
│   │   ├── cache.ts                  # Cache service
│   │   ├── connection.ts             # Connection utilities
│   │   └── migrate.ts                # Migration utilities
│   │
│   ├── modules/                      # Feature modules
│   │   ├── auth/                     # Authentication module
│   │   │   ├── controllers/          # Auth controllers
│   │   │   ├── services/             # Auth services
│   │   │   ├── repositories/         # Auth repositories
│   │   │   ├── models/               # Auth models
│   │   │   ├── validators/           # Auth validators
│   │   │   ├── routes/               # Auth routes
│   │   │   ├── dto/                  # Data transfer objects
│   │   │   ├── mappers/              # Object mappers
│   │   │   └── interfaces/           # TypeScript interfaces
│   │   │
│   │   ├── product/                  # Product module
│   │   │   ├── controllers/          # Product controllers
│   │   │   ├── services/             # Product services
│   │   │   ├── repositories/         # Product repositories
│   │   │   ├── models/               # Product models
│   │   │   ├── validators/           # Product validators
│   │   │   ├── routes/               # Product routes
│   │   │   ├── dto/                  # Data transfer objects
│   │   │   ├── mappers/              # Object mappers
│   │   │   └── interfaces/           # TypeScript interfaces
│   │   │
│   │   ├── pricing/                  # Pricing engine module
│   │   │   ├── controllers/          # Pricing controllers
│   │   │   ├── services/             # Pricing services
│   │   │   │   ├── pricing.service.ts      # Main pricing service
│   │   │   │   ├── priceCalculator.service.ts # Price calculator
│   │   │   │   ├── currency.service.ts     # Currency service
│   │   │   │   ├── pricingRule.service.ts  # Rule management
│   │   │   │   ├── priceHistory.service.ts # Price history
│   │   │   │   ├── priceVersion.service.ts # Price versioning
│   │   │   │   ├── priceLock.service.ts    # Price locking
│   │   │   │   └── priceCache.service.ts   # Price caching
│   │   │   ├── models/               # Pricing models
│   │   │   ├── providers/            # Price providers
│   │   │   │   ├── interface.ts      # Provider interface
│   │   │   │   ├── registry.ts       # Provider registry
│   │   │   │   └── exchangeRate.provider.ts # Exchange rate provider
│   │   │   ├── validators/           # Pricing validators
│   │   │   └── interfaces/           # TypeScript interfaces
│   │   │
│   │   ├── cart/                     # Cart & checkout module
│   │   │   ├── controllers/          # Cart controllers
│   │   │   ├── services/             # Cart services
│   │   │   │   ├── cart.service.ts        # Cart service
│   │   │   │   ├── priceLock.service.ts   # Price lock service
│   │   │   │   └── checkout.service.ts    # Checkout service
│   │   │   ├── models/               # Cart models
│   │   │   ├── validators/           # Cart validators
│   │   │   ├── routes/               # Cart routes
│   │   │   └── interfaces/           # TypeScript interfaces
│   │   │
│   │   └── ...                       # Other modules
│   │
│   ├── middlewares/                   # Express middlewares
│   │   ├── authenticate.ts           # JWT authentication
│   │   ├── authorize.ts              # RBAC authorization
│   │   ├── validate.ts               # Request validation
│   │   ├── rateLimiter.ts            # Rate limiting
│   │   ├── requestLogger.ts          # Request logging
│   │   ├── security.ts              # Security headers
│   │   ├── tenantResolver.ts         # Multi-tenant resolver
│   │   ├── errorHandler.ts           # Error handling
│   │   ├── notFoundHandler.ts        # 404 handler
│   │   ├── healthCheck.ts            # Health check endpoint
│   │   └── index.ts                 # Exports
│   │
│   ├── routes/                       # API routes
│   │   └── index.ts                  # Route definitions
│   │
│   ├── utils/                        # Utility functions
│   │   ├── response.ts               # Response helpers
│   │   ├── helpers.ts                # General helpers
│   │   └── index.ts                 # Exports
│   │
│   ├── types/                        # Global types
│   │   ├── common.ts                 # Common types
│   │   ├── env.d.ts                  # Environment types
│   │   └── index.ts                 # Exports
│   │
│   ├── events/                       # Event handlers
│   │   └── handlers/
│   │       └── index.ts             # Event handlers
│   │
│   ├── queues/                       # Queue definitions
│   │   ├── config.ts                 # Queue configuration
│   │   ├── workers.ts                # Queue workers
│   │   ├── pricing/                  # Pricing queues
│   │   └── index.ts                 # Exports
│   │
│   ├── app.ts                        # Express app setup
│   └── index.ts                      # Server entry point
│
├── Dockerfile                        # Docker build file
├── tsconfig.json                     # TypeScript configuration
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── jest.config.js                    # Jest configuration
├── babel.config.js                   # Babel configuration
└── package.json                      # Backend dependencies
```

---

## Module Documentation

### Authentication Module

**Location:** `backend/src/modules/auth/`

**Purpose:** Handles user authentication, authorization, and session management.

**Components:**
- `controllers/auth.controller.ts` - HTTP request handlers
- `services/auth.service.ts` - Authentication logic
- `models/user.model.ts` - User schema
- `validators/auth.validator.ts` - Input validation
- `routes/auth.routes.ts` - API routes

**Features:**
- JWT token generation and verification
- Refresh token rotation
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Session management

### Pricing Engine Module

**Location:** `backend/src/modules/pricing/`

**Purpose:** Dynamic pricing engine for automatic price calculations.

**Components:**
- `services/pricing.service.ts` - Main orchestrator
- `services/priceCalculator.service.ts` - Price calculation logic
- `services/currency.service.ts` - Exchange rate management
- `services/pricingRule.service.ts` - Rule management
- `services/priceHistory.service.ts` - Price audit trail
- `services/priceVersion.service.ts` - Price versioning
- `services/priceLock.service.ts` - Checkout price locking
- `services/priceCache.service.ts` - Redis caching
- `providers/` - Exchange rate providers

**Key Features:**
- Provider-based architecture (extensible)
- Redis caching with intelligent invalidation
- BullMQ queues for async processing
- Event-driven architecture
- Price locking for checkout protection

### Product Module

**Location:** `backend/src/modules/product/`

**Purpose:** Product management for multi-vendor marketplace.

**Components:**
- `controllers/product.controller.ts` - Product CRUD operations
- `services/product.service.ts` - Product business logic
- `repositories/product.repository.ts` - Data access layer
- `models/product.model.ts` - Product schema
- `validators/product.validator.ts` - Input validation

**Features:**
- Multi-tenant isolation (storeId)
- Image management
- Inventory tracking
- Integration with Pricing Engine
- Search and filtering

### Cart & Checkout Module

**Location:** `backend/src/modules/cart/`

**Purpose:** Shopping cart and checkout process with price protection.

**Components:**
- `services/cart.service.ts` - Cart management
- `services/priceLock.service.ts` - Price locking
- `services/checkout.service.ts` - Checkout flow
- `models/cart.model.ts` - Cart schema
- `models/priceLock.model.ts` - Price lock schema
- `models/checkoutSession.model.ts` - Checkout session schema

**Key Features:**
- Guest cart support
- Cart merging on login
- Real-time price validation
- 15-minute price lock during checkout
- Multi-step checkout flow

---

## Development Phases

### Phase 1: Project Foundation ✅

| Item | Status |
|------|--------|
| Project structure setup | ✅ Complete |
| TypeScript configuration | ✅ Complete |
| ESLint & Prettier | ✅ Complete |
| Path aliases | ✅ Complete |
| Environment configuration | ✅ Complete |
| Docker setup | ✅ Complete |

### Phase 2: Design System ✅

| Item | Status |
|------|--------|
| Design tokens | ✅ Complete |
| Tailwind configuration | ✅ Complete |
| shadcn/ui components | ✅ Complete |
| Glass morphism effects | ✅ Complete |
| Motion system | ✅ Complete |
| RTL support | ✅ Complete |

### Phase 3: Database Architecture ✅

| Item | Status |
|------|--------|
| Mongoose schemas | ✅ Complete |
| Database plugins | ✅ Complete |
| Indexes | ✅ Complete |
| Migration utilities | ✅ Complete |

### Phase 4: Backend Core ✅

| Item | Status |
|------|--------|
| Express server setup | ✅ Complete |
| Middleware stack | ✅ Complete |
| Error handling | ✅ Complete |
| Logging system | ✅ Complete |
| Redis integration | ✅ Complete |
| Event bus | ✅ Complete |
| Queue system | ✅ Complete |

### Phase 5: Pricing Engine ✅

| Item | Status |
|------|--------|
| Pricing service | ✅ Complete |
| Price calculator | ✅ Complete |
| Currency service | ✅ Complete |
| Pricing rules | ✅ Complete |
| Price history | ✅ Complete |
| Price versioning | ✅ Complete |
| Price locking | ✅ Complete |
| Price caching | ✅ Complete |
| Provider system | ✅ Complete |

### Phase 6: Product Module ✅

| Item | Status |
|------|--------|
| Product schema | ✅ Complete |
| Product repository | ✅ Complete |
| Product service | ✅ Complete |
| Product controller | ✅ Complete |
| Product routes | ✅ Complete |
| Product validators | ✅ Complete |

### Phase 7: Marketplace Frontend ✅

| Item | Status |
|------|--------|
| Marketplace layout | ✅ Complete |
| Product listing | ✅ Complete |
| Product details | ✅ Complete |
| Category pages | ✅ Complete |
| Store pages | ✅ Complete |
| Search functionality | ✅ Complete |
| SEO optimization | ✅ Complete |

### Phase 8: Cart & Checkout ✅

| Item | Status |
|------|--------|
| Cart management | ✅ Complete |
| Cart drawer | ✅ Complete |
| Price validation | ✅ Complete |
| Price lock UI | ✅ Complete |
| Checkout flow | ✅ Complete |
| Address management | ✅ Complete |

### Phase 9: Seller Dashboard ✅

| Item | Status |
|------|--------|
| Dashboard layout | ✅ Complete |
| Dashboard home | ✅ Complete |
| Product management | ✅ Complete |
| Order management | ✅ Complete |
| Inventory management | ✅ Complete |
| Pricing management | ✅ Complete |
| Notifications | ✅ Complete |
| Store settings | ✅ Complete |

### Phase 10: Admin Panel ✅

| Item | Status |
|------|--------|
| Admin layout | ✅ Complete |
| Dashboard home | ✅ Complete |
| User management | ✅ Complete |
| Store management | ✅ Complete |
| System monitoring | ✅ Complete |
| Audit logs | ✅ Complete |

---

## Current Progress

### ✅ Completed

1. **Project Architecture**
   - Clean architecture implementation
   - Feature-based module structure
   - TypeScript throughout

2. **Frontend Foundation**
   - Next.js 15 with App Router
   - Complete design system
   - Responsive layouts
   - RTL support

3. **Backend Foundation**
   - Express.js server
   - MongoDB with Mongoose
   - Redis caching
   - Queue system (BullMQ)

4. **Pricing Engine**
   - Dynamic price calculation
   - Exchange rate integration
   - Price rules system
   - Price locking

5. **Database**
   - Complete schema designs
   - Indexes for performance
   - Migration utilities

6. **Marketplace**
   - Product browsing
   - Search and filtering
   - Category navigation
   - Store profiles

7. **Cart & Checkout**
   - Shopping cart
   - Price validation
   - Checkout flow

8. **Dashboards**
   - Seller dashboard
   - Admin panel

### 🔄 In Progress

1. API route implementations
2. Frontend-backend integration
3. Image upload system
4. Email notifications

### 📋 Not Started

1. Payment gateway integration
2. Order fulfillment
3. Shipping integration
4. Advanced analytics
5. Testing suite

---

## Installation Guide

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn/pnpm)
- **Docker** & Docker Compose (optional, for databases)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/live-price-platform.git
cd live-price-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start with Docker (recommended)
docker-compose up -d

# 5. Start development servers
npm run dev
```

### Manual Setup

```bash
# 1. Start databases (MongoDB & Redis)
docker-compose up -d mongodb redis

# 2. Start backend
npm run dev:backend

# 3. Start frontend (in another terminal)
npm run dev:frontend
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start Next.js dev server |
| `npm run dev:backend` | Start Express dev server |
| `npm run build` | Build both projects |
| `npm run build:frontend` | Build Next.js application |
| `npm run build:backend` | Build TypeScript |
| `npm run lint` | Lint both projects |
| `npm run format` | Format code with Prettier |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |

---

## Environment Variables

### Frontend (.env.local)

```env
# App
NEXT_PUBLIC_APP_NAME=Live Price Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Features
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_ENABLE_PRICING_ENGINE=true
NEXT_PUBLIC_ENABLE_VENDOR_DASHBOARD=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/live-price-platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

## API Structure

### Base URL

```
http://localhost:5000/api/v1
```

### Endpoint Groups

| Group | Base Path | Description |
|-------|-----------|-------------|
| Auth | `/api/v1/auth` | Authentication endpoints |
| Users | `/api/v1/users` | User management |
| Products | `/api/v1/products` | Product CRUD |
| Pricing | `/api/v1/pricing` | Pricing engine |
| Cart | `/api/v1/cart` | Shopping cart |
| Orders | `/api/v1/orders` | Order management |
| Stores | `/api/v1/stores` | Store management |
| Admin | `/api/v1/admin` | Admin operations |

### Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": []
  }
}
```

---

## Database Documentation

### Collections

| Collection | Purpose | Key Indexes |
|------------|---------|-------------|
| `users` | User accounts | email, role, status |
| `stores` | Vendor stores | slug, ownerId, status |
| `store_members` | Store membership | storeId+userId (unique) |
| `products` | Products | storeId+slug, sku, categoryId |
| `pricing_rules` | Pricing rules | storeId, productId, status |
| `price_history` | Price audit trail | productId, createdAt |
| `price_locks` | Checkout price locks | userId, expiresAt (TTL) |
| `carts` | Shopping carts | userId, sessionId |
| `orders` | Customer orders | orderNumber, storeId, userId |
| `payments` | Transactions | orderId, status |
| `categories` | Product categories | slug, parentId (self-ref) |
| `brands` | Product brands | slug |
| `currencies` | Supported currencies | code (unique) |
| `exchange_rates` | Exchange rates | from+to currencies |

### Best Practices

1. **Compound Indexes** - Use compound indexes for common query patterns
2. **Partial Indexes** - Index only active documents
3. **TTL Indexes** - Auto-expire old data (sessions, locks)
4. **Text Indexes** - Full-text search on relevant fields
5. **Soft Delete** - Preserve data with isDeleted flag
6. **Audit Fields** - Track createdAt, updatedAt, createdBy

---

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// ❌ Bad
interface user {
  id: any;
  email: any;
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Files | kebab-case | `product-card.tsx` |
| Hooks | camelCase + `use` | `useAuth.ts` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS` |
| Types/Interfaces | PascalCase | `IProduct`, `ProductType` |
| Services | camelCase + `Service` | `pricingService` |
| Models | PascalCase | `Product`, `User` |

### Import Order

```typescript
// 1. External packages
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Feature modules
import { useProducts } from '@/features/products/hooks';
import { productApi } from '@/features/products/services';

// 4. Utilities
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/helpers';

// 5. Types
import { Product } from '@/types';
```

### Commit Convention

```
type(scope): description

Examples:
feat(auth): add JWT refresh token rotation
fix(pricing): correct exchange rate calculation
docs(readme): update installation guide
refactor(product): extract image upload logic
test(auth): add login unit tests
```

---

## Design System

### Colors

| Color | Primary | Usage |
|-------|---------|-------|
| Primary | `#6366F1` (Indigo) | Main actions, links |
| Secondary | `#64748B` (Slate) | Text, borders |
| Accent | `#A855F7` (Violet) | Highlights, badges |
| Success | `#22C55E` (Emerald) | Success states |
| Warning | `#F59E0B` (Amber) | Caution states |
| Danger | `#EF4444` (Red) | Error states |
| Info | `#06B6D4` (Cyan) | Information |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Display | Estedad | 3-8rem | Bold |
| Heading | Estedad | 1.5-3rem | Semibold |
| Body | Vazirmatn | 1rem | Regular |
| Caption | Vazirmatn | 0.75-0.875rem | Regular |
| Mono | SF Mono | 0.875rem | Regular |

### Spacing Scale

```
0.25rem → 0.5rem → 0.75rem → 1rem → 1.25rem → 1.5rem → 2rem → 3rem → 4rem → 6rem → 8rem
```

### Animation

| Property | Value | Usage |
|----------|-------|-------|
| Duration | 200-300ms | Standard animations |
| Easing | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth transitions |
| Reduced Motion | `prefers-reduced-motion` | Accessibility |

### Three.js Usage

- **Landing Page Hero** - 3D scene with floating elements
- **NOT used** in dashboards, checkout, or product cards
- **Lazy loaded** to avoid initial bundle bloat

---

## Security

### Authentication

- **JWT Tokens** - Stateless authentication
- **Refresh Tokens** - Automatic rotation
- **Token Expiry** - Configurable expiration

### Authorization

- **RBAC** - Role-based access control
- **Roles**: Customer, Vendor, Admin, Super Admin
- **Permissions**: Granular permission checks

### Data Protection

- **Password Hashing** - bcrypt with 12 salt rounds
- **Input Validation** - Zod schema validation
- **SQL Injection** - MongoDB parameterized queries
- **XSS** - React's built-in escaping

### API Security

- **Rate Limiting** - Redis-based rate limiting
- **CORS** - Configured allowed origins
- **Helmet** - Security headers
- **Request Validation** - All inputs validated

---

## Performance

### Caching Strategy

| Cache | TTL | Location |
|-------|-----|----------|
| Product Price | 5 min | Redis |
| Exchange Rate | 1 min | Redis |
| Pricing Rules | 10 min | Redis |
| Cart | 30 min | Redis |
| Session | 24 hours | Redis |

### Frontend Performance

- **Server Components** - Default for data fetching
- **Image Optimization** - Next.js Image component
- **Lazy Loading** - Dynamic imports for heavy components
- **Code Splitting** - Route-based splitting

### Backend Performance

- **Database Indexes** - Optimized for common queries
- **Connection Pooling** - MongoDB connection pool
- **Redis Caching** - Reduce database load
- **Queue Processing** - Async heavy operations

---

## Future Roadmap

### Testing

- [ ] Unit Tests (Jest)
- [ ] Integration Tests
- [ ] E2E Tests (Playwright)
- [ ] API Tests

### CI/CD

- [ ] GitHub Actions
- [ ] Automated Testing
- [ ] Linting on PR
- [ ] Build Verification

### Deployment

- [ ] Production Docker Compose
- [ ] Kubernetes Configuration
- [ ] AWS/GCP/Azure Deployment
- [ ] CDN Setup

### Monitoring

- [ ] Application Monitoring
- [ ] Error Tracking (Sentry)
- [ ] Performance Monitoring
- [ ] Log Aggregation

### Features

- [ ] Payment Gateway Integration
- [ ] Email Service (SendGrid/SES)
- [ ] SMS Service (Twilio)
- [ ] Push Notifications
- [ ] AI Recommendations
- [ ] Advanced Search (Algolia/Elasticsearch)
- [ ] Multi-language Support
- [ ] PWA Support
- [ ] Mobile Applications
- [ ] Public API
- [ ] Webhook System
- [ ] Plugin System

### Infrastructure

- [ ] Horizontal Scaling
- [ ] Microservices Migration (Future)
- [ ] Event-Driven Improvements
- [ ] Observability (OpenTelemetry)
- [ ] Backup Strategy
- [ ] Disaster Recovery

### Documentation

- [ ] Swagger/OpenAPI Documentation
- [ ] Developer Documentation
- [ ] Contribution Guide
- [ ] Architecture Decision Records

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the [Coding Standards](#coding-standards)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the Live Price Platform Team**

[Back to Top](#live-price-platform)

</div>
