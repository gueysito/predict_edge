# PredictEdge

AI-powered prediction market analysis tool that helps you identify opportunities across Polymarket and Kalshi.

![PredictEdge Dashboard](https://img.shields.io/badge/Platform-Polymarket%20%7C%20Kalshi-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **Market Aggregation**: Real-time data from Polymarket and Kalshi prediction markets
- **Caesar AI Research**: Deep market analysis powered by Caesar's research engine with citation-backed insights
- **Opportunity Detection**: Automatically identifies mispriced markets, arbitrage opportunities, and high-EV bets
- **Risk/Reward Calculator**: Kelly Criterion calculations for optimal position sizing
- **Price Charts**: Historical price trends and volume analysis
- **Dark Mode UI**: Professional Bloomberg Terminal-inspired financial dashboard

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite build system
- TanStack Query for data fetching
- shadcn/ui + Radix UI components
- Tailwind CSS styling
- Recharts for data visualization

### Backend
- Express.js server
- In-memory storage (Drizzle ORM ready for PostgreSQL)
- RESTful API design
- Async job handling for AI research

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/predict_edge.git
cd predict_edge

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

### Environment Variables

Create a `.env` file with the following variables:

```env
# Caesar AI Research (optional - runs in demo mode without)
CAESAR_REPLIT=your_caesar_api_key

# Session secret (required for production)
SESSION_SECRET=your_session_secret
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Dashboard statistics |
| `/api/markets` | GET | List all markets with filtering |
| `/api/markets/:platform/:id` | GET | Single market details |
| `/api/opportunities` | GET | Detected opportunities |
| `/api/caesar/research` | POST | Submit research query |
| `/api/caesar/jobs/:id` | GET | Get research job status |
| `/api/config/status` | GET | Check API configuration status |

## Market Filters

Markets can be filtered by:
- `platform`: `polymarket`, `kalshi`, or `all`
- `category`: `Politics`, `Crypto`, `Economics`, `Tech`, etc.
- `sort`: `volume`, `endDate`, `yesPrice`, `noPrice`

## Caesar Research Integration

The app integrates with [Caesar.org](https://docs.caesar.xyz) for AI-powered market research:

1. Submit research queries with configurable compute units (1-10)
2. Async job processing with status polling
3. Results include analysis text and citation sources with relevance scores

When no API key is configured, the app runs in demo mode with simulated research results.

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data layer
│   └── index.ts            # Server entry
├── shared/
│   └── schema.ts           # Shared types/schemas
└── design_guidelines.md    # UI design system
```

## Key Components

- **Dashboard**: Market overview with stats and opportunity cards
- **MarketCard**: Displays market info with quick analysis actions
- **OpportunityCard**: Highlights detected trading opportunities
- **CaesarResearchPanel**: AI research interface with citations
- **RiskRewardCalculator**: Kelly Criterion position sizing
- **PriceChart**: Historical price visualization

## Calculations

### Expected Value (EV)
```
EV = (userProbability × payout) - (1 - userProbability) × stake
```

### Kelly Criterion
```
kellyFraction = (p × b - q) / b
where:
  p = probability of winning
  q = 1 - p
  b = odds (payout / stake)
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Caesar.org](https://caesar.org) for AI research capabilities
- [Polymarket](https://polymarket.com) for prediction market data
- [Kalshi](https://kalshi.com) for regulated event contracts
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
