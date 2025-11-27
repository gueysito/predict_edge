import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MarketCard } from "@/components/market-card";
import { MarketFilters } from "@/components/market-filters";
import { 
  MarketCardSkeleton, 
  EmptyState, 
  ErrorState,
  LoadingSpinner,
} from "@/components/loading-states";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw } from "lucide-react";
import type { Market, MarketFilter, DashboardStats } from "@shared/schema";

export default function Markets() {
  const [filters, setFilters] = useState<MarketFilter>({
    platform: "all",
    sortBy: "volume",
    sortOrder: "desc",
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { 
    data: markets, 
    isLoading, 
    error, 
    refetch,
    isFetching,
  } = useQuery<Market[]>({
    queryKey: ["/api/markets", filters],
  });

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Failed to load markets"
          description="We couldn't fetch the market data. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-markets">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Markets
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse and analyze prediction markets from Polymarket and Kalshi
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={isFetching}
          data-testid="button-refresh-markets"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <MarketFilters 
        filters={filters} 
        onFiltersChange={setFilters}
        categories={stats?.topCategories?.map(c => c.name) || []}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <MarketCardSkeleton key={i} />
          ))}
        </div>
      ) : markets && markets.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{markets.length}</span> markets
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon="search"
          title="No markets found"
          description="Try adjusting your filters or search query to find markets."
          action={
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                platform: "all",
                sortBy: "volume",
                sortOrder: "desc",
              })}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
