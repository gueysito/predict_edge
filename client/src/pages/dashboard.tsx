import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/stats-card";
import { MarketCard } from "@/components/market-card";
import { OpportunityCard } from "@/components/opportunity-card";
import { MarketFilters } from "@/components/market-filters";
import { 
  DashboardSkeleton, 
  MarketCardSkeleton, 
  OpportunityCardSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/loading-states";
import type { Market, Opportunity, DashboardStats, MarketFilter } from "@shared/schema";
import { useState } from "react";

export default function Dashboard() {
  const [filters, setFilters] = useState<MarketFilter>({
    platform: "all",
    sortBy: "volume",
    sortOrder: "desc",
  });

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { data: markets, isLoading: marketsLoading, error: marketsError } = useQuery<Market[]>({
    queryKey: ["/api/markets", filters],
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const formatVolume = (vol: number) => {
    if (vol >= 1000000000) return `$${(vol / 1000000000).toFixed(1)}B`;
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol.toFixed(0)}`;
  };

  const formatEV = (ev: number) => {
    const sign = ev >= 0 ? "+" : "";
    return `${sign}${(ev * 100).toFixed(1)}%`;
  };

  if (statsError || marketsError) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Failed to load dashboard"
          description="We couldn't fetch the latest market data. Please try again."
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-dashboard">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered prediction market analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/opportunities" data-testid="button-view-opportunities">
              <Zap className="h-4 w-4 mr-2" />
              View Opportunities
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Markets"
          value={stats?.totalMarkets || 0}
          subtitle="Active prediction markets"
          icon={BarChart3}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Total Volume"
          value={formatVolume(stats?.totalVolume || 0)}
          subtitle="Combined across platforms"
          icon={DollarSign}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Opportunities"
          value={stats?.activeOpportunities || 0}
          subtitle="High-value bets detected"
          icon={Zap}
          isLoading={statsLoading}
        />
        <StatsCard
          title="Average EV"
          value={formatEV(stats?.averageEV || 0)}
          subtitle="Expected value"
          icon={TrendingUp}
          isLoading={statsLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <MarketFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            categories={stats?.topCategories?.map(c => c.name) || []}
          />
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Trending Markets</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/markets" data-testid="link-view-all-markets">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {marketsLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <MarketCardSkeleton key={i} />
              ))}
            </div>
          ) : markets && markets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {markets.slice(0, 6).map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="markets"
              title="No markets found"
              description="Try adjusting your filters or check back later for new markets."
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Top Opportunities
            </h2>
          </div>

          {opportunitiesLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <OpportunityCardSkeleton key={i} />
              ))}
            </div>
          ) : opportunities && opportunities.length > 0 ? (
            <div className="space-y-4">
              {opportunities.slice(0, 3).map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
              {opportunities.length > 3 && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/opportunities" data-testid="link-view-more-opportunities">
                    View {opportunities.length - 3} more opportunities
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <EmptyState
              icon="opportunities"
              title="No opportunities detected"
              description="Caesar is analyzing markets for mispriced bets. Check back soon."
            />
          )}
        </div>
      </div>
    </div>
  );
}
