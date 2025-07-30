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
- June 28, 2025: Initial setup with greyscale theme and Resy integration
- June 28, 2025: Major menu system overhaul - Added comprehensive menu data from PDFs:
  * Created separate menu systems for Jealous Fork (day menu) and Jealous Burger (evening menu)
  * Added complete beverage menu with cocktails, coffee, beer, and wine
  * Updated operating hours: JF (Tue-Sun 9AM-3PM), JB (Fri-Sat 5PM-9PM), Closed Mondays
  * Created new FullMenuPage with smart time-based menu highlighting
  * Updated navigation and contact information with dual operating schedules
- June 28, 2025: Comprehensive SEO and visibility enhancements:
  * Added review ratings display (Yelp 4.6, Google 4.7, OpenTable 5.0, Uber 4.8)
  * Updated local areas with accurate Miami neighborhoods and distances
  * Created structured data (JSON-LD) for local business and menu schema
  * Added comprehensive sitemap.xml and robots.txt for better crawling
  * Enhanced contact section with NAP consistency and local business info
  * Positioned restaurant as "Miami's original artisan pancake restaurant"
- June 28, 2025: Expanded local area coverage to 33 Miami-Dade neighborhoods:
  * Added comprehensive suburban coverage including Kendall West, Kendale Lakes, Tamiami
  * Included Westchester, Sunset, Fontainebleau, Sweetwater, Doral areas
  * Extended reach to The Hammocks and The Crossings communities
  * Organized service areas by proximity: Close (under 20 min), Greater Miami-Dade (20-30 min), Extended (30+ min)
  * Updated sitemap and SEO strategy with expanded geographic targeting
- June 28, 2025: Added comprehensive FAQ section and real Resy integration:
  * Created expandable FAQ with 15 SEO-optimized questions covering hours, locations, menu, reservations
  * Integrated actual Resy reservation widget with venue ID 90707 and API key
  * Added FAQ navigation link to main menu and mobile menu
  * Updated all reservation buttons to use real Resy booking system
  * Enhanced user experience with dropdown functionality and comprehensive information
- July 23, 2025: Complete Square API integration with dynamic menu management:
  * Implemented modern Square Node.js SDK with proper authentication
  * Added real-time menu loading from Square Catalog API
  * Integrated inventory tracking with live stock level updates
  * Created featured items system with exactly 6 items (including out-of-stock as requested)
  * Enabled automatic price synchronization from Square dashboard
  * Built fallback system using static menu when Square API unavailable
  * Added visual indicators showing live vs static menu status
  * Ensures seamless integration across homepage, menu pages, and checkout
- July 23, 2025: Advanced Square API synchronization system:
  * Created comprehensive menu synchronization service with real-time Square API integration
  * Built admin panel at /admin with password protection (jealous2025) for menu management
  * Implemented ability to add any Square catalog item as a featured item
  * Added automatic price and stock synchronization between local menu and Square catalog
  * Created inventory management system with real-time stock level updates
  * Built Square menu manager component for selecting and promoting items to featured status
  * Ensured all featured items sync with Square for accurate ordering, pricing, and availability
- July 24, 2025: Menu routing fix and comprehensive categorization system:
  * Fixed menu routing: /menu now displays complete time-based menu (previously /full-menu)
  * Resolved admin stock update errors - all featured items properly toggle between in-stock/out-of-stock
  * Added comprehensive Square API item categorization in admin panel
  * Created MenuCategorizationPanel for organizing all Square catalog items into menu sections
  * Enhanced menu sections with real-time open/closed status based on operating hours
  * Improved admin interface with complete Square item management and categorization
  * All technical details (item IDs, sync status) hidden from customer pages, visible only in admin
- July 28, 2025: Admin panel fixes and responsive contact section:
  * Fixed apiRequest function signature to resolve admin panel edit errors
  * Added complete CRUD operations for menu sections and categories management
  * Created MenuSectionManager component with create, rename, and delete functionality
  * Made contact information section fully responsive with map positioned to the right of contact details
  * Enhanced contact layout with improved spacing, typography, and mobile responsiveness
  * All admin panel operations now working correctly (create, update, delete sections/categories)
  * Replaced hero reservation button with functional Resy widget integration
  * Fixed admin item-to-category assignment system with persistent storage mapping
  * Added proper success feedback and data refresh for category assignments
- July 30, 2025: Complete admin authentication and bulk categorization system overhaul:
  * Fixed admin authentication persistence - login now stays active after page refresh using localStorage
  * Completely redesigned menu categorization with streamlined bulk assignment interface
  * Added bulk category assignment API endpoints for processing multiple items simultaneously
  * Created comprehensive BulkMenuCategorizationPanel with search, filtering, and bulk operations
  * Enhanced category assignment persistence with proper database storage and in-memory caching
  * Added ability to remove item assignments and view assignment statistics
  * All category assignments now persist across server restarts and page refreshes
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```