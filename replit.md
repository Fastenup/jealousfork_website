# Replit.md

## Overview

This is a modern restaurant website for "Jealous Fork" - Miami's original artisan pancake restaurant. The application is built as a React SPA with Express.js backend, featuring SEO-optimized pages for menu items and local areas. The site is designed to showcase the restaurant's offerings while optimizing for local search and conversion.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: TailwindCSS with custom design system (shadcn/ui components)
- **Build Tool**: Vite for development and production builds
- **State Management**: TanStack Query for server state management
- **Fonts**: Google Fonts (Inter and Playfair Display)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Storage**: PostgreSQL sessions (connect-pg-simple)
- **Development**: Vite middleware for HMR and development server

### Build and Deployment
- **Development**: TSX for TypeScript execution, Vite dev server
- **Production**: ESBuild for server bundling, Vite for client builds
- **Static Assets**: Served from dist/public directory

## Key Components

### SEO Strategy
- **Dynamic Meta Tags**: SEOHead component manages title, description, and Open Graph tags
- **URL Structure**: Clean URLs for menu items (/menu/item-slug) and local areas (/near/area-slug)
- **Canonical URLs**: All variant pages canonicalize to main homepage
- **Structured Data**: JSON-LD schema for local business and menu items
- **Sitemap**: Static sitemap.xml and robots.txt files

### Navigation System
- **Responsive Navigation**: Mobile hamburger menu with smooth scroll functionality
- **Fixed Header**: Sticky navigation with scroll-based transparency effects
- **Section Scrolling**: Smooth scroll to page sections from navigation

### Content Management
- **Menu Data**: Centralized menu items with slugs, categories, and metadata
- **Local Areas**: Data-driven local area pages for SEO targeting
- **Image Optimization**: Lazy loading and responsive images from Unsplash

### Form Handling
- **Contact Form**: Client-side validation with toast notifications
- **No Backend**: Forms provide user feedback without server submission

## Data Flow

### Page Rendering
1. All routes render through React Router (Wouter)
2. SEOHead component dynamically updates document metadata
3. Navigation component handles scroll positioning and mobile states
4. Content components consume static data from /data directory

### SEO Flow
1. Menu and local area pages use dynamic metadata based on URL parameters
2. All pages include canonical links pointing to homepage
3. Structured data is injected for local business schema
4. Social media meta tags optimize sharing appearance

### User Interactions
1. Navigation uses smooth scrolling to page sections
2. Contact form validates inputs and shows success/error states
3. Sticky CTA buttons provide persistent conversion opportunities
4. Mobile-responsive design adapts to all screen sizes

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Database**: Drizzle ORM with PostgreSQL support
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **Build Tools**: Vite, ESBuild, TypeScript
- **CSS Processing**: TailwindCSS, PostCSS, Autoprefixer
- **Development**: TSX, Replit-specific plugins

### Third-Party Services
- **Images**: Unsplash for hero and menu item images
- **Fonts**: Google Fonts for typography
- **Maps**: Google Maps integration for location display
- **Analytics**: Prepared for Google Analytics integration

## Deployment Strategy

### Development Environment
- Node.js server runs on port 5000 (configurable)
- Vite dev server provides HMR and fast refresh
- Environment variables required: DATABASE_URL
- Replit-specific development banner and tools

### Production Build
1. **Client Build**: Vite builds React app to dist/public
2. **Server Build**: ESBuild bundles Express server to dist/index.js
3. **Database**: Drizzle migrations run via `npm run db:push`
4. **Static Files**: Public assets served from dist/public

### Environment Configuration
- **Development**: NODE_ENV=development, uses tsx for TypeScript execution
- **Production**: NODE_ENV=production, runs compiled JavaScript
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```