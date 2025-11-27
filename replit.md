# PredictEdge - Prediction Market Analysis Tool

## Overview

PredictEdge is an AI-powered prediction market analysis platform that helps users identify opportunities across Polymarket and Kalshi. The application uses Caesar's research engine to provide deep market analysis, calculate risk/reward ratios using Kelly Criterion, and surface mispriced markets. Built with a modern React frontend and Express backend, the platform emphasizes data clarity, real-time insights, and transparent AI-generated analysis with proper source citations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- "New York" style variant with neutral base color scheme
- Dark/light theme support with system preference detection
- Custom CSS variables for consistent elevation, borders, and color schemes

**Design Principles:**
- Information hierarchy prioritized over visual flourish
- Scannable layouts for quick multi-market assessment
- AI insights visually distinguished from raw market data
- Monospace fonts (JetBrains Mono) for numerical data display
- Material Design patterns for data visualization

**State Management:**
- React Query for API data fetching, caching, and synchronization
- Local component state with React hooks
- Theme context provider for appearance preferences
- No global state management library needed due to server-state focus

### Backend Architecture

**Server Framework:**
- Express.js HTTP server with TypeScript
- HTTP server creation for potential WebSocket support
- Custom middleware for request logging and JSON body parsing
- Static file serving for production builds

**Data Layer:**
- In-memory storage implementation (MemStorage class) for demo/development
- Drizzle ORM configured for PostgreSQL (production-ready schema defined)
- Schema validation using Zod with drizzle-zod integration
- Prepared for database migration via drizzle-kit

**API Design:**
- RESTful endpoints organized by resource type
- Query parameter-based filtering and sorting for markets
- Standardized error handling and response formats
- Rate limiting and security headers ready for production

**Business Logic:**
- Market aggregation from Polymarket and Kalshi platforms
- Opportunity detection algorithms (mispricing, arbitrage, high EV, value bets)
- Kelly Criterion calculations for position sizing
- Expected value analysis for market evaluation

### External Dependencies

**Caesar AI Research Engine:**
- Integration for deep market research and analysis
- Job-based async processing (submit query → poll status → retrieve results)
- Citation tracking with relevance scoring
- Configurable compute unit allocation (1-10 units per query)
- API key authentication required for production
- Fallback simulation mode for development without API access

**Prediction Market Platforms:**
- Polymarket: Decentralized prediction market data
- Kalshi: CFTC-regulated event contract data
- Market data includes: prices, volume, liquidity, outcomes, end dates
- Price history tracking for trend analysis

**Database (PostgreSQL via Neon):**
- Serverless Postgres connection via @neondatabase/serverless
- Connection pooling for serverless environments
- Schema migration support through Drizzle Kit
- DATABASE_URL environment variable for connection string

**Third-Party UI Libraries:**
- Recharts for price history visualization and charts
- date-fns for date formatting and relative time display
- Embla Carousel for any carousel components
- Radix UI primitives for accessible component foundations

**Development Tools:**
- Replit-specific plugins for development environment integration
- TSX for TypeScript execution in development
- ESBuild for production server bundling
- Runtime error overlay for development debugging

### Data Flow

1. **Market Data Flow:**
   - Markets fetched via `/api/markets` with filter/sort parameters
   - Client-side caching via React Query (stale-while-revalidate pattern)
   - Real-time updates via periodic refetching
   - Price history stored separately for charting

2. **Opportunity Detection:**
   - Server-side analysis of market data
   - Calculated metrics: EV, Kelly size, confidence scores
   - Categorization: mispriced, arbitrage, high_ev, value_bet
   - Cached results with timestamp tracking

3. **Caesar Research Flow:**
   - User submits research query with compute units
   - Job created and tracked with unique ID
   - Polling mechanism for status updates (pending → processing → completed)
   - Results include AI analysis, citations with URLs/snippets, relevance scores

4. **Calculator Tools:**
   - Client-side calculations for immediate feedback
   - Inputs: user probability estimate, market price, bankroll
   - Outputs: EV, Kelly fraction, recommended stake, risk rating
   - No server interaction required for basic calculations