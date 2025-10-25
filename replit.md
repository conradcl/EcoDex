# Wildlife Identification App

## Overview

WildID is an AI-powered wildlife identification application that allows users to upload photos of animals to instantly identify species and learn their conservation status. The application uses Google's Gemini AI to analyze wildlife images and provide detailed information including species name, scientific classification, habitat, diet, geographic range, and conservation status (endangered, invasive, native, or unknown). The interface is designed to feel like a digital field guide with nature-inspired aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React with TypeScript**: Modern component-based UI using functional components and hooks
- **Vite**: Fast build tool and development server with HMR (Hot Module Replacement)
- **Wouter**: Lightweight client-side routing library for navigation
- **React Query (@tanstack/react-query)**: Server state management and data fetching with automatic caching

**UI Component Library**
- **shadcn/ui**: Comprehensive component system built on Radix UI primitives
- **Tailwind CSS**: Utility-first styling with custom design tokens and a nature-inspired color palette
- **Design System**: Custom spacing primitives (4, 6, 8, 12, 16, 24), two-font system (Inter for UI, Merriweather for species names/headings)

**State Management**
- Local component state via React hooks (useState, useEffect)
- Server state via React Query with custom query client configuration
- Form state via React Hook Form with Zod validation

### Backend Architecture

**Server Framework**
- **Express.js**: Minimalist Node.js web framework handling HTTP requests
- **TypeScript**: Type-safe server-side code with ES modules
- **Custom Middleware**: Request logging, JSON body parsing with raw body access for webhooks

**API Design**
- RESTful endpoint structure (`/api/*` prefix)
- Single analysis endpoint (`POST /api/analyze`) for wildlife image identification
- Zod schema validation for request/response data integrity
- Centralized error handling with appropriate HTTP status codes

**Development Tools**
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds
- **Vite middleware**: Development server integration with Express

### Data Storage Solutions

**Database Setup**
- **Drizzle ORM**: TypeScript-first ORM for database operations
- **PostgreSQL**: Primary database (via Neon serverless driver `@neondatabase/serverless`)
- **Schema Location**: Centralized in `shared/schema.ts` for type sharing between client/server
- **Migration Strategy**: Drizzle Kit for schema migrations with PostgreSQL dialect

**Current Schema**
- User table structure defined but minimal usage (in-memory storage fallback exists)
- Wildlife analysis results schema with conservation status enum
- Shared types between frontend and backend via workspace paths

**Note on Database**: The application is configured for PostgreSQL via Drizzle, but database operations are not currently active in the main workflow. The code agent may add full database persistence later.

### Authentication and Authorization

**Current State**
- Basic user schema exists in `shared/schema.ts` with username and ID fields
- In-memory storage implementation (`MemStorage` class) as fallback
- Session handling infrastructure present but not actively used
- No authentication flow currently implemented in the UI

**Future Considerations**
- Session management via `connect-pg-simple` (PostgreSQL session store dependency present)
- User-specific wildlife identification history could be added

## External Dependencies

### AI/ML Services

**Google Gemini AI**
- **Library**: `@google/genai` SDK
- **Purpose**: Wildlife image analysis and species identification
- **Authentication**: API key via `GEMINI_API_KEY` environment variable
- **Model**: Configured for latest Gemini models (2.5-flash or 2.5-pro series)
- **Integration**: Custom `analyzeWildlifeImage` function in `server/gemini.ts`
- **Request Format**: Base64-encoded images with MIME type specification
- **Response Structure**: Structured JSON with species details, conservation status, and confidence scores

### Database & Infrastructure

**Neon Serverless PostgreSQL**
- **Driver**: `@neondatabase/serverless`
- **Connection**: Via `DATABASE_URL` environment variable
- **Purpose**: Persistent data storage for users and wildlife analysis results
- **Configuration**: Defined in `drizzle.config.ts` with schema in `shared/schema.ts`

### UI Component Libraries

**Radix UI Primitives**
- Headless, accessible component primitives for all interactive UI elements
- 20+ component primitives installed (accordion, dialog, dropdown-menu, popover, select, etc.)
- Provides keyboard navigation, focus management, and ARIA attributes

**Utility Libraries**
- **class-variance-authority**: Type-safe component variant styling
- **clsx & tailwind-merge**: Conditional className composition
- **cmdk**: Command palette/search component
- **date-fns**: Date formatting and manipulation
- **lucide-react**: Icon library

### Development Tools

**Replit-Specific Plugins**
- `@replit/vite-plugin-runtime-error-modal`: Error overlay for development
- `@replit/vite-plugin-cartographer`: Code navigation enhancement
- `@replit/vite-plugin-dev-banner`: Development environment indicator

### Form & Validation

**React Hook Form**
- Form state management with `@hookform/resolvers` for validation integration

**Zod**
- Runtime type validation for API requests/responses
- Schema-to-TypeScript type inference
- Integration with Drizzle ORM via `drizzle-zod`