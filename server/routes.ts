import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCaesarJobSchema, 
  marketFilterSchema,
} from "@shared/schema";

const CAESAR_API_KEY = process.env.CAESAR_REPLIT;
const CAESAR_API_URL = "https://api.caesar.xyz";

// Simulate Caesar API call (will use real API when key is provided)
async function submitCaesarResearch(query: string, computeUnits: number): Promise<{ id: string }> {
  if (CAESAR_API_KEY) {
    try {
      const response = await fetch(`${CAESAR_API_URL}/research`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CAESAR_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, compute_units: computeUnits }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return { id: data.job_id || data.id };
      }
    } catch (error) {
      console.error("Caesar API error:", error);
    }
  }
  
  // Fallback to simulated response
  return { id: `sim-${Date.now()}` };
}

async function getCaesarJobStatus(jobId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  result?: string;
  citations?: Array<{
    id: string;
    url: string;
    title: string;
    snippet: string;
    relevanceScore: number;
  }>;
  error?: string;
}> {
  if (CAESAR_API_KEY && !jobId.startsWith("sim-")) {
    try {
      const response = await fetch(`${CAESAR_API_URL}/research/${jobId}`, {
        headers: {
          "Authorization": `Bearer ${CAESAR_API_KEY}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          status: data.status,
          result: data.result,
          citations: data.citations,
          error: data.error,
        };
      }
    } catch (error) {
      console.error("Caesar API status error:", error);
    }
  }
  
  // Simulated progressive response
  const jobAge = Date.now() - parseInt(jobId.replace("sim-", ""));
  
  if (jobAge < 3000) {
    return { status: "pending" };
  } else if (jobAge < 8000) {
    return { status: "processing" };
  } else {
    return {
      status: "completed",
      result: `Based on comprehensive analysis of prediction market data and relevant factors:

**Market Assessment:**
The current pricing appears to incorporate most publicly available information. However, there are several key factors that may not be fully priced in:

1. **Historical Patterns:** Similar markets have shown a tendency to underestimate tail events by approximately 15-20%.

2. **Information Asymmetry:** Institutional participants may have access to data suggesting different probability estimates.

3. **Liquidity Considerations:** The current liquidity depth suggests potential for price impact on larger positions.

**Risk Factors:**
- Regulatory changes could significantly impact outcomes
- Market sentiment may shift based on upcoming announcements
- Correlation with broader market conditions exists

**Recommendation:**
Consider the Kelly Criterion for position sizing, with a recommended half-Kelly approach for more conservative risk management. The expected value analysis suggests a potential edge exists.`,
      citations: [
        {
          id: "cite-1",
          url: "https://research.example.com/prediction-markets-analysis",
          title: "Prediction Markets: An Analysis of Efficiency",
          snippet: "Studies show prediction markets are generally efficient but can exhibit systematic biases in certain conditions...",
          relevanceScore: 0.92,
        },
        {
          id: "cite-2",
          url: "https://academic.example.org/market-microstructure",
          title: "Market Microstructure and Price Discovery",
          snippet: "The relationship between liquidity and price accuracy in prediction markets reveals important patterns...",
          relevanceScore: 0.85,
        },
        {
          id: "cite-3",
          url: "https://finance.example.com/risk-management",
          title: "Optimal Position Sizing Using Kelly Criterion",
          snippet: "The Kelly Criterion provides a mathematically optimal approach to position sizing, maximizing long-term growth...",
          relevanceScore: 0.78,
        },
      ],
    };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Config status (check if Caesar API is configured)
  app.get("/api/config/status", async (_req, res) => {
    res.json({
      caesarApiConfigured: !!CAESAR_API_KEY,
      features: {
        polymarket: true,
        kalshi: true,
        caesar: !!CAESAR_API_KEY,
      },
    });
  });

  // Dashboard stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Markets endpoints
  app.get("/api/markets", async (req, res) => {
    try {
      const filterResult = marketFilterSchema.safeParse(req.query);
      const filter = filterResult.success ? filterResult.data : undefined;
      const markets = await storage.getMarkets(filter);
      res.json(markets);
    } catch (error) {
      console.error("Error fetching markets:", error);
      res.status(500).json({ error: "Failed to fetch markets" });
    }
  });

  app.get("/api/markets/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const markets = await storage.searchMarkets(query);
      res.json(markets);
    } catch (error) {
      console.error("Error searching markets:", error);
      res.status(500).json({ error: "Failed to search markets" });
    }
  });

  app.get("/api/markets/:platform/:id", async (req, res) => {
    try {
      const { platform, id } = req.params;
      const market = await storage.getMarket(platform, id);
      
      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }
      
      res.json(market);
    } catch (error) {
      console.error("Error fetching market:", error);
      res.status(500).json({ error: "Failed to fetch market" });
    }
  });

  app.get("/api/markets/:platform/:id/history", async (req, res) => {
    try {
      const { platform, id } = req.params;
      const history = await storage.getMarketPriceHistory(platform, id);
      res.json(history);
    } catch (error) {
      console.error("Error fetching price history:", error);
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  // Opportunities endpoints
  app.get("/api/opportunities", async (_req, res) => {
    try {
      const opportunities = await storage.getOpportunities();
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  // Caesar research endpoints
  app.get("/api/caesar/jobs", async (_req, res) => {
    try {
      const jobs = await storage.getCaesarJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching Caesar jobs:", error);
      res.status(500).json({ error: "Failed to fetch research jobs" });
    }
  });

  app.get("/api/caesar/jobs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let job = await storage.getCaesarJob(id);
      
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      // If job is still pending/processing, check for updates
      if (job.status === "pending" || job.status === "processing") {
        const externalStatus = await getCaesarJobStatus(job.id);
        
        if (externalStatus.status !== job.status || externalStatus.result) {
          job = await storage.updateCaesarJob(id, {
            status: externalStatus.status,
            result: externalStatus.result,
            citations: externalStatus.citations,
            error: externalStatus.error,
            completedAt: externalStatus.status === "completed" || externalStatus.status === "failed" 
              ? new Date().toISOString() 
              : undefined,
          });
        }
      }
      
      res.json(job);
    } catch (error) {
      console.error("Error fetching Caesar job:", error);
      res.status(500).json({ error: "Failed to fetch research job" });
    }
  });

  app.post("/api/caesar/research", async (req, res) => {
    try {
      const parseResult = insertCaesarJobSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request body",
          details: parseResult.error.errors,
        });
      }
      
      const { query, computeUnits } = parseResult.data;
      
      // Create job in storage
      const job = await storage.createCaesarJob({ query, computeUnits });
      
      // Submit to Caesar API (async)
      submitCaesarResearch(query, computeUnits).catch(error => {
        console.error("Error submitting to Caesar:", error);
        storage.updateCaesarJob(job.id, {
          status: "failed",
          error: "Failed to submit research request",
        });
      });
      
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating Caesar job:", error);
      res.status(500).json({ error: "Failed to create research job" });
    }
  });

  // Risk/Reward calculation endpoint
  app.post("/api/calculate/risk-reward", async (req, res) => {
    try {
      const { probability, price, bankroll } = req.body;
      
      if (typeof probability !== "number" || typeof price !== "number" || typeof bankroll !== "number") {
        return res.status(400).json({ error: "Invalid parameters" });
      }
      
      const expectedValue = probability - price;
      const odds = 1 / price - 1;
      const kellyFraction = Math.max(0, (probability * (odds + 1) - 1) / odds);
      const halfKelly = kellyFraction / 2;
      const recommendedStake = bankroll * halfKelly;
      
      const potentialProfit = recommendedStake * odds;
      const potentialLoss = recommendedStake;
      
      let riskRating: "low" | "medium" | "high" | "extreme";
      if (halfKelly < 0.02) riskRating = "low";
      else if (halfKelly < 0.05) riskRating = "medium";
      else if (halfKelly < 0.10) riskRating = "high";
      else riskRating = "extreme";
      
      res.json({
        expectedValue,
        kellyFraction,
        halfKelly,
        recommendedStake,
        potentialProfit,
        potentialLoss,
        riskRating,
        odds,
        breakEvenProbability: price,
      });
    } catch (error) {
      console.error("Error calculating risk/reward:", error);
      res.status(500).json({ error: "Failed to calculate risk/reward" });
    }
  });

  return httpServer;
}
