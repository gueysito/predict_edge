import { randomUUID } from "crypto";
import type { 
  Market, 
  Opportunity, 
  CaesarJob, 
  InsertCaesarJob,
  DashboardStats,
  PriceHistory,
  MarketFilter,
} from "@shared/schema";

export interface IStorage {
  // Markets
  getMarkets(filter?: MarketFilter): Promise<Market[]>;
  getMarket(platform: string, id: string): Promise<Market | undefined>;
  searchMarkets(query: string): Promise<Market[]>;
  getMarketPriceHistory(platform: string, id: string): Promise<PriceHistory[]>;
  
  // Opportunities
  getOpportunities(): Promise<Opportunity[]>;
  
  // Caesar Jobs
  getCaesarJobs(): Promise<CaesarJob[]>;
  getCaesarJob(id: string): Promise<CaesarJob | undefined>;
  createCaesarJob(job: InsertCaesarJob): Promise<CaesarJob>;
  updateCaesarJob(id: string, updates: Partial<CaesarJob>): Promise<CaesarJob | undefined>;
  
  // Stats
  getDashboardStats(): Promise<DashboardStats>;
  
  // Cache management
  updateMarketsCache(markets: Market[]): Promise<void>;
  updateOpportunitiesCache(opportunities: Opportunity[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private markets: Map<string, Market>;
  private opportunities: Map<string, Opportunity>;
  private caesarJobs: Map<string, CaesarJob>;
  private priceHistories: Map<string, PriceHistory[]>;

  constructor() {
    this.markets = new Map();
    this.opportunities = new Map();
    this.caesarJobs = new Map();
    this.priceHistories = new Map();
    
    // Initialize with sample data for demo
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const now = new Date().toISOString();
    
    // Sample markets
    const sampleMarkets: Market[] = [
      {
        id: "poly-btc-100k",
        platform: "polymarket",
        question: "Will Bitcoin reach $100,000 by end of 2024?",
        description: "This market resolves YES if Bitcoin's price reaches or exceeds $100,000 at any point before January 1, 2025.",
        category: "Crypto",
        endDate: new Date("2024-12-31").toISOString(),
        yesPrice: 0.42,
        noPrice: 0.58,
        volume: 5420000,
        liquidity: 890000,
        url: "https://polymarket.com/event/bitcoin-100k",
        lastUpdated: now,
      },
      {
        id: "poly-trump-2024",
        platform: "polymarket",
        question: "Will Trump win the 2024 Presidential Election?",
        description: "This market will resolve to YES if Donald Trump wins the 2024 United States Presidential Election.",
        category: "Politics",
        endDate: new Date("2024-11-06").toISOString(),
        yesPrice: 0.56,
        noPrice: 0.44,
        volume: 125000000,
        liquidity: 15600000,
        url: "https://polymarket.com/event/trump-2024",
        lastUpdated: now,
      },
      {
        id: "kalshi-fed-rate",
        platform: "kalshi",
        question: "Will the Fed cut rates by 50bps in December 2024?",
        description: "Market resolves YES if the Federal Reserve cuts the federal funds rate by 50 basis points at the December 2024 FOMC meeting.",
        category: "Economics",
        endDate: new Date("2024-12-18").toISOString(),
        yesPrice: 0.18,
        noPrice: 0.82,
        volume: 2340000,
        liquidity: 450000,
        url: "https://kalshi.com/markets/fed-rate-december",
        lastUpdated: now,
      },
      {
        id: "poly-eth-staking",
        platform: "polymarket",
        question: "Will Ethereum staking yield exceed 5% APR in 2024?",
        category: "Crypto",
        endDate: new Date("2024-12-31").toISOString(),
        yesPrice: 0.35,
        noPrice: 0.65,
        volume: 890000,
        liquidity: 234000,
        lastUpdated: now,
      },
      {
        id: "kalshi-sp500-5000",
        platform: "kalshi",
        question: "Will S&P 500 close above 5,500 in 2024?",
        category: "Stocks",
        endDate: new Date("2024-12-31").toISOString(),
        yesPrice: 0.72,
        noPrice: 0.28,
        volume: 4560000,
        liquidity: 890000,
        lastUpdated: now,
      },
      {
        id: "poly-openai-gpt5",
        platform: "polymarket",
        question: "Will OpenAI release GPT-5 by end of 2024?",
        category: "Tech",
        endDate: new Date("2024-12-31").toISOString(),
        yesPrice: 0.28,
        noPrice: 0.72,
        volume: 3200000,
        liquidity: 670000,
        lastUpdated: now,
      },
      {
        id: "kalshi-recession",
        platform: "kalshi",
        question: "Will the US enter a recession in 2024?",
        category: "Economics",
        endDate: new Date("2024-12-31").toISOString(),
        yesPrice: 0.15,
        noPrice: 0.85,
        volume: 7800000,
        liquidity: 1230000,
        lastUpdated: now,
      },
      {
        id: "poly-ai-regulation",
        platform: "polymarket",
        question: "Will the EU pass comprehensive AI regulation by Q2 2024?",
        category: "Politics",
        endDate: new Date("2024-06-30").toISOString(),
        yesPrice: 0.89,
        noPrice: 0.11,
        volume: 1560000,
        liquidity: 345000,
        lastUpdated: now,
      },
    ];

    sampleMarkets.forEach(market => {
      this.markets.set(`${market.platform}-${market.id}`, market);
      this.generatePriceHistory(market);
    });

    // Sample opportunities
    const sampleOpportunities: Opportunity[] = [
      {
        id: "opp-1",
        market: sampleMarkets[0],
        opportunityType: "high_ev",
        expectedValue: 0.12,
        kellySize: 0.08,
        confidence: 0.75,
        reasoning: "Based on historical patterns and current market momentum, BTC has a higher probability of reaching 100k than current market implies. Network effects and institutional adoption suggest underpricing.",
        recommendedAction: "buy_yes",
        detectedAt: now,
      },
      {
        id: "opp-2",
        market: sampleMarkets[2],
        opportunityType: "mispriced",
        expectedValue: 0.08,
        kellySize: 0.05,
        confidence: 0.68,
        reasoning: "Fed communication suggests a more aggressive rate cut is unlikely. The market may be overestimating the probability of a 50bps cut based on recent economic data.",
        recommendedAction: "buy_no",
        detectedAt: now,
      },
      {
        id: "opp-3",
        market: sampleMarkets[4],
        opportunityType: "value_bet",
        expectedValue: 0.06,
        kellySize: 0.04,
        confidence: 0.62,
        reasoning: "S&P 500 has strong momentum and corporate earnings have been solid. The current price underestimates the probability of continued bullish momentum.",
        recommendedAction: "buy_yes",
        detectedAt: now,
      },
    ];

    sampleOpportunities.forEach(opp => {
      this.opportunities.set(opp.id, opp);
    });
  }

  private generatePriceHistory(market: Market) {
    const history: PriceHistory[] = [];
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    
    let currentYes = market.yesPrice + (Math.random() - 0.5) * 0.3;
    currentYes = Math.max(0.1, Math.min(0.9, currentYes));
    
    for (let t = thirtyDaysAgo; t <= now; t += 4 * 60 * 60 * 1000) {
      const drift = (market.yesPrice - currentYes) * 0.02;
      const randomWalk = (Math.random() - 0.5) * 0.04;
      currentYes = Math.max(0.05, Math.min(0.95, currentYes + drift + randomWalk));
      
      history.push({
        timestamp: new Date(t).toISOString(),
        yesPrice: currentYes,
        noPrice: 1 - currentYes,
        volume: Math.floor(Math.random() * 50000) + 10000,
      });
    }
    
    history[history.length - 1] = {
      timestamp: new Date().toISOString(),
      yesPrice: market.yesPrice,
      noPrice: market.noPrice,
      volume: Math.floor(market.volume / 30),
    };
    
    this.priceHistories.set(`${market.platform}-${market.id}`, history);
  }

  async getMarkets(filter?: MarketFilter): Promise<Market[]> {
    let markets = Array.from(this.markets.values());
    
    if (filter) {
      if (filter.platform && filter.platform !== "all") {
        markets = markets.filter(m => m.platform === filter.platform);
      }
      
      if (filter.category) {
        markets = markets.filter(m => m.category === filter.category);
      }
      
      if (filter.minLiquidity) {
        markets = markets.filter(m => m.liquidity >= filter.minLiquidity!);
      }
      
      if (filter.minVolume) {
        markets = markets.filter(m => m.volume >= filter.minVolume!);
      }
      
      if (filter.search) {
        const query = filter.search.toLowerCase();
        markets = markets.filter(m => 
          m.question.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query) ||
          m.category?.toLowerCase().includes(query)
        );
      }
      
      const sortBy = filter.sortBy || "volume";
      const sortOrder = filter.sortOrder || "desc";
      
      markets.sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case "volume":
            comparison = a.volume - b.volume;
            break;
          case "liquidity":
            comparison = a.liquidity - b.liquidity;
            break;
          case "closing_date":
            comparison = new Date(a.endDate || 0).getTime() - new Date(b.endDate || 0).getTime();
            break;
          case "expected_value":
            comparison = Math.abs(a.yesPrice - 0.5) - Math.abs(b.yesPrice - 0.5);
            break;
        }
        return sortOrder === "desc" ? -comparison : comparison;
      });
    }
    
    return markets;
  }

  async getMarket(platform: string, id: string): Promise<Market | undefined> {
    return this.markets.get(`${platform}-${id}`);
  }

  async searchMarkets(query: string): Promise<Market[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.markets.values()).filter(m =>
      m.question.toLowerCase().includes(lowerQuery) ||
      m.description?.toLowerCase().includes(lowerQuery) ||
      m.category?.toLowerCase().includes(lowerQuery)
    );
  }

  async getMarketPriceHistory(platform: string, id: string): Promise<PriceHistory[]> {
    return this.priceHistories.get(`${platform}-${id}`) || [];
  }

  async getOpportunities(): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values())
      .sort((a, b) => b.expectedValue - a.expectedValue);
  }

  async getCaesarJobs(): Promise<CaesarJob[]> {
    return Array.from(this.caesarJobs.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getCaesarJob(id: string): Promise<CaesarJob | undefined> {
    return this.caesarJobs.get(id);
  }

  async createCaesarJob(input: InsertCaesarJob): Promise<CaesarJob> {
    const id = randomUUID();
    const job: CaesarJob = {
      id,
      status: "pending",
      query: input.query,
      computeUnits: input.computeUnits || 1,
      createdAt: new Date().toISOString(),
    };
    this.caesarJobs.set(id, job);
    return job;
  }

  async updateCaesarJob(id: string, updates: Partial<CaesarJob>): Promise<CaesarJob | undefined> {
    const job = this.caesarJobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.caesarJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const markets = Array.from(this.markets.values());
    const opportunities = Array.from(this.opportunities.values());
    
    const categoryCount: Record<string, number> = {};
    markets.forEach(m => {
      if (m.category) {
        categoryCount[m.category] = (categoryCount[m.category] || 0) + 1;
      }
    });
    
    const topCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const avgEV = opportunities.length > 0
      ? opportunities.reduce((sum, o) => sum + o.expectedValue, 0) / opportunities.length
      : 0;
    
    return {
      totalMarkets: markets.length,
      totalVolume: markets.reduce((sum, m) => sum + m.volume, 0),
      activeOpportunities: opportunities.length,
      averageEV: avgEV,
      topCategories,
    };
  }

  async updateMarketsCache(markets: Market[]): Promise<void> {
    markets.forEach(market => {
      this.markets.set(`${market.platform}-${market.id}`, market);
    });
  }

  async updateOpportunitiesCache(opportunities: Opportunity[]): Promise<void> {
    this.opportunities.clear();
    opportunities.forEach(opp => {
      this.opportunities.set(opp.id, opp);
    });
  }
}

export const storage = new MemStorage();
