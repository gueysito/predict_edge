import { useQuery } from "@tanstack/react-query";
import { OpportunityCard } from "@/components/opportunity-card";
import { 
  OpportunityCardSkeleton, 
  EmptyState, 
  ErrorState,
} from "@/components/loading-states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, RefreshCw, TrendingUp, Target, Sparkles } from "lucide-react";
import type { Opportunity } from "@shared/schema";
import { useState } from "react";

type OpportunityFilter = "all" | "mispriced" | "arbitrage" | "high_ev" | "value_bet";
type SortOption = "ev" | "confidence" | "kelly" | "recent";

export default function Opportunities() {
  const [typeFilter, setTypeFilter] = useState<OpportunityFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("ev");

  const { 
    data: opportunities, 
    isLoading, 
    error, 
    refetch,
    isFetching,
  } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
  });

  const filteredOpportunities = opportunities
    ?.filter(o => typeFilter === "all" || o.opportunityType === typeFilter)
    ?.sort((a, b) => {
      switch (sortBy) {
        case "ev":
          return b.expectedValue - a.expectedValue;
        case "confidence":
          return b.confidence - a.confidence;
        case "kelly":
          return b.kellySize - a.kellySize;
        case "recent":
          return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime();
        default:
          return 0;
      }
    });

  const typeCounts = opportunities?.reduce((acc, o) => {
    acc[o.opportunityType] = (acc[o.opportunityType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Failed to load opportunities"
          description="We couldn't fetch the opportunity data. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-opportunities">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Opportunities
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-detected mispriced markets and value bets
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={isFetching}
          data-testid="button-refresh-opportunities"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card 
          className={`cursor-pointer hover-elevate ${typeFilter === 'all' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setTypeFilter('all')}
          data-testid="filter-all"
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">All</p>
              <p className="text-2xl font-bold">{opportunities?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover-elevate ${typeFilter === 'high_ev' ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setTypeFilter('high_ev')}
          data-testid="filter-high-ev"
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">High EV</p>
              <p className="text-2xl font-bold">{typeCounts.high_ev || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover-elevate ${typeFilter === 'arbitrage' ? 'ring-2 ring-success' : ''}`}
          onClick={() => setTypeFilter('arbitrage')}
          data-testid="filter-arbitrage"
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-success/10">
              <Target className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium">Arbitrage</p>
              <p className="text-2xl font-bold">{typeCounts.arbitrage || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover-elevate ${typeFilter === 'mispriced' ? 'ring-2 ring-warning' : ''}`}
          onClick={() => setTypeFilter('mispriced')}
          data-testid="filter-mispriced"
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning/10">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium">Mispriced</p>
              <p className="text-2xl font-bold">{typeCounts.mispriced || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredOpportunities?.length || 0} opportunities found
        </p>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[180px]" data-testid="select-sort-opportunities">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ev">Highest EV</SelectItem>
            <SelectItem value="confidence">Highest Confidence</SelectItem>
            <SelectItem value="kelly">Largest Kelly Size</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredOpportunities && filteredOpportunities.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="opportunities"
          title="No opportunities found"
          description={
            typeFilter === "all" 
              ? "Caesar is continuously analyzing markets. Check back soon for new opportunities."
              : `No ${typeFilter.replace('_', ' ')} opportunities detected. Try a different filter.`
          }
          action={
            typeFilter !== "all" && (
              <Button 
                variant="outline" 
                onClick={() => setTypeFilter("all")}
              >
                View all opportunities
              </Button>
            )
          }
        />
      )}
    </div>
  );
}
