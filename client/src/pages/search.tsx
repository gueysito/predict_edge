import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketCard } from "@/components/market-card";
import { MarketCardSkeleton, EmptyState } from "@/components/loading-states";
import type { Market } from "@shared/schema";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data: results, isLoading, isFetching } = useQuery<Market[]>({
    queryKey: ["/api/markets/search", { q: submittedQuery }],
    enabled: submittedQuery.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSubmittedQuery("");
  };

  const suggestedSearches = [
    "Bitcoin",
    "Election 2024",
    "Fed interest rates",
    "AI regulation",
    "Elon Musk",
    "World Cup",
  ];

  return (
    <div className="p-6 space-y-6" data-testid="page-search">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <SearchIcon className="h-6 w-6 text-primary" />
          Search Markets
        </h1>
        <p className="text-sm text-muted-foreground">
          Find prediction markets across Polymarket and Kalshi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for markets, topics, or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
            data-testid="input-search"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Button type="submit" disabled={!searchQuery.trim() || isFetching} data-testid="button-search">
          {isFetching ? "Searching..." : "Search"}
        </Button>
      </form>

      {!submittedQuery && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSearches.map((term) => (
              <Badge 
                key={term}
                variant="secondary"
                className="cursor-pointer hover-elevate"
                onClick={() => {
                  setSearchQuery(term);
                  setSubmittedQuery(term);
                }}
                data-testid={`badge-suggestion-${term.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {submittedQuery && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              "Searching..."
            ) : (
              <>
                Found <span className="font-medium text-foreground">{results?.length || 0}</span> results for "{submittedQuery}"
              </>
            )}
          </p>
          <Button variant="ghost" size="sm" onClick={clearSearch}>
            Clear search
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MarketCardSkeleton key={i} />
          ))}
        </div>
      ) : submittedQuery && results && results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : submittedQuery && results?.length === 0 ? (
        <EmptyState
          icon="search"
          title="No markets found"
          description={`We couldn't find any markets matching "${submittedQuery}". Try a different search term.`}
          action={
            <Button variant="outline" onClick={clearSearch}>
              Clear search
            </Button>
          }
        />
      ) : null}
    </div>
  );
}
