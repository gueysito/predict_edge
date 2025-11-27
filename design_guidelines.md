# Design Guidelines: Caesar-Powered Prediction Market Analysis Tool

## Design Approach

**Selected Approach:** Design System + Reference Hybrid
- **Primary System:** Material Design for robust data visualization patterns
- **Reference Inspiration:** Linear (typography hierarchy), Stripe (restraint), Bloomberg Terminal (information density)
- **Rationale:** Data-heavy financial analysis tools require proven UI patterns for complex information display, real-time updates, and multi-layered insights

## Core Design Principles

1. **Information Hierarchy First:** Data clarity trumps visual flourish
2. **Scannable Layouts:** Users need to quickly assess multiple markets simultaneously  
3. **AI Insight Prominence:** Caesar-generated analysis should be visually distinguished from raw data
4. **Trust Through Transparency:** Citations and sources must be immediately visible

## Typography

**Font Stack:**
- Primary: Inter (headings, UI elements, data labels)
- Monospace: JetBrains Mono (numerical data, prices, percentages)

**Scale:**
- Page Headers: text-2xl font-semibold
- Section Headers: text-lg font-medium
- Data Labels: text-sm font-medium
- Body Text: text-base
- Numerical Data: text-lg font-mono
- Metadata/Timestamps: text-xs text-gray-500

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Card spacing: p-6
- Dense data grids: gap-2 to gap-4

**Grid Structure:**
- Dashboard: 12-column responsive grid
- Market cards: 3-column desktop (lg:grid-cols-3), 1-column mobile
- Market detail: 2-column split (8/4) - main content + sidebar insights
- Data tables: Full-width with horizontal scroll on mobile

## Component Library

### Navigation
- **Top Navigation Bar:** Fixed, contains logo, global search, account menu
- **Sidebar Navigation:** Collapsible, categorized sections (Markets, Opportunities, Portfolio, Settings)
- **Breadcrumbs:** Show current location in market hierarchy

### Dashboard Cards
- **Market Summary Card:** Title, current odds, volume, liquidity, Caesar confidence score
- **Opportunity Card:** Highlighted with subtle border, displays expected value and recommended action
- **Caesar Insight Card:** Distinct background treatment, includes research synthesis with expandable citations

### Data Display
- **Price Charts:** Line charts with Recharts/Chart.js, 24h/7d/30d toggles
- **Order Book Visualization:** Depth chart with bid/ask spreads
- **Comparison Table:** Side-by-side Polymarket vs Kalshi data with variance highlighting
- **Metrics Grid:** Key statistics (volume, liquidity, implied probability) in compact grid layout

### AI Analysis Components
- **Caesar Research Panel:** Expandable section with loading states for async job processing
- **Citation Links:** Inline reference numbers with tooltip previews, click to expand full source
- **Confidence Indicators:** Visual meter showing Caesar's research confidence (1-10 CU scale)
- **Reasoning Display:** Bulleted synthesis with clear "Pro/Con" or "Factors" structure

### Forms & Inputs
- **Search Bar:** Prominent, with autocomplete for market discovery
- **Filters:** Checkbox groups for categories, date ranges, minimum liquidity thresholds
- **Sorting Controls:** Dropdown for sort parameters (EV, volume, closing date)

### Status & Feedback
- **Loading States:** Skeleton screens for data, spinner for Caesar research jobs
- **Caesar Job Status:** Progress indicator showing research depth (CU usage) and ETA
- **Real-time Updates:** Subtle pulse animation on price changes, WebSocket connection indicator
- **Empty States:** Contextual messaging with suggested actions

## Animations

**Minimal, Purposeful Only:**
- Data updates: Smooth number transitions (count-up effects for significant changes)
- Chart updates: Subtle line/bar transitions on data refresh
- Card hover: Slight elevation increase (shadow-md to shadow-lg)
- Caesar job polling: Gentle pulse on status indicator
- NO scroll animations, NO page transitions, NO decorative effects

## Images

**NO HERO IMAGES** - This is a data-focused dashboard application.

**Icon Usage:**
- Heroicons via CDN for UI actions and market categories
- Market-specific icons for Polymarket/Kalshi platform indicators
- Alert/warning icons for risk indicators

## Layout Specifics

**Dashboard Home:**
- Top: Market overview metrics bar (total volume, active markets, opportunities count)
- Main: 3-column grid of market cards with infinite scroll
- Sidebar: Caesar-powered "Best Opportunities" panel with real-time recommendations

**Market Detail Page:**
- Left (2/3): Price chart, order book, historical data, trade form
- Right (1/3): Caesar research synthesis, citations, risk assessment, related markets

**Opportunities Page:**
- Filterable table view with sortable columns
- Each row expands to show detailed Caesar analysis
- Visual indicators for arbitrage potential and mispriced markets

## Accessibility

- WCAG AA contrast ratios throughout
- Keyboard navigation for all interactive elements
- ARIA labels on data visualizations
- Screen reader-friendly table structures
- Focus indicators on form inputs and buttons

## Technical Constraints

- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Maximum content width: max-w-7xl centered with mx-auto
- Sidebar: w-64 on desktop, slide-out overlay on mobile
- Tables: Horizontal scroll on mobile with sticky first column