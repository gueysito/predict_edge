import { z } from "zod";

// Platform types
export type Platform = "polymarket" | "kalshi";

// Market schema for prediction markets
export const marketSchema = z.object({
  id: z.string(),
  platform: z.enum(["polymarket", "kalshi"]),
  question: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  endDate: z.string().optional(),
  yesPrice: z.number().min(0).max(1),
  noPrice: z.number().min(0).max(1),
  volume: z.number(),
  liquidity: z.number(),
  outcomes: z.array(z.object({
    name: z.string(),
    price: z.number(),
  })).optional(),
  imageUrl: z.string().optional(),
  url: z.string().optional(),
  lastUpdated: z.string(),
});

export type Market = z.infer<typeof marketSchema>;

// Opportunity schema for detected opportunities
export const opportunitySchema = z.object({
  id: z.string(),
  market: marketSchema,
  opportunityType: z.enum(["mispriced", "arbitrage", "high_ev", "value_bet"]),
  expectedValue: z.number(),
  kellySize: z.number(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  recommendedAction: z.enum(["buy_yes", "buy_no", "avoid"]),
  detectedAt: z.string(),
});

export type Opportunity = z.infer<typeof opportunitySchema>;

// Caesar research job schema
export const caesarJobSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  query: z.string(),
  computeUnits: z.number().min(1).max(10).default(1),
  result: z.string().optional(),
  citations: z.array(z.object({
    id: z.string(),
    url: z.string(),
    title: z.string(),
    snippet: z.string(),
    relevanceScore: z.number(),
  })).optional(),
  createdAt: z.string(),
  completedAt: z.string().optional(),
  error: z.string().optional(),
});

export type CaesarJob = z.infer<typeof caesarJobSchema>;

export const insertCaesarJobSchema = z.object({
  query: z.string().min(1),
  computeUnits: z.number().min(1).max(10).default(1),
});

export type InsertCaesarJob = z.infer<typeof insertCaesarJobSchema>;

// Citation schema
export const citationSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  snippet: z.string(),
  relevanceScore: z.number(),
});

export type Citation = z.infer<typeof citationSchema>;

// Risk/Reward calculation schema
export const riskRewardSchema = z.object({
  marketId: z.string(),
  probability: z.number().min(0).max(1),
  stake: z.number().min(0),
  potentialProfit: z.number(),
  potentialLoss: z.number(),
  expectedValue: z.number(),
  kellyFraction: z.number(),
  recommendedStake: z.number(),
  riskRating: z.enum(["low", "medium", "high", "extreme"]),
});

export type RiskReward = z.infer<typeof riskRewardSchema>;

export const calculateRiskRewardSchema = z.object({
  probability: z.number().min(0).max(1),
  price: z.number().min(0).max(1),
  bankroll: z.number().min(0),
});

export type CalculateRiskRewardInput = z.infer<typeof calculateRiskRewardSchema>;

// Market comparison schema
export const marketComparisonSchema = z.object({
  polymarketMarket: marketSchema.optional(),
  kalshiMarket: marketSchema.optional(),
  priceDifference: z.number().optional(),
  arbitrageOpportunity: z.boolean(),
  arbitrageProfit: z.number().optional(),
});

export type MarketComparison = z.infer<typeof marketComparisonSchema>;

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  totalMarkets: z.number(),
  totalVolume: z.number(),
  activeOpportunities: z.number(),
  averageEV: z.number(),
  topCategories: z.array(z.object({
    name: z.string(),
    count: z.number(),
  })),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Filter schema for markets
export const marketFilterSchema = z.object({
  platform: z.enum(["all", "polymarket", "kalshi"]).default("all"),
  category: z.string().optional(),
  minLiquidity: z.number().optional(),
  minVolume: z.number().optional(),
  sortBy: z.enum(["volume", "liquidity", "closing_date", "expected_value"]).default("volume"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

export type MarketFilter = z.infer<typeof marketFilterSchema>;

// Price history for charts
export const priceHistorySchema = z.object({
  timestamp: z.string(),
  yesPrice: z.number(),
  noPrice: z.number(),
  volume: z.number(),
});

export type PriceHistory = z.infer<typeof priceHistorySchema>;

// Keep existing user schemas for compatibility
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export interface User {
  id: string;
  username: string;
  password: string;
}
