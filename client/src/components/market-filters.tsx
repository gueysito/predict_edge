import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal,
  X,
  ArrowUpDown,
} from "lucide-react";
import type { MarketFilter } from "@shared/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MarketFiltersProps {
  filters: MarketFilter;
  onFiltersChange: (filters: MarketFilter) => void;
  categories?: string[];
}

export function MarketFilters({ 
  filters, 
  onFiltersChange, 
  categories = [] 
}: MarketFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchValue });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({
      platform: "all",
      sortBy: "volume",
      sortOrder: "desc",
      search: "",
      category: undefined,
      minLiquidity: undefined,
      minVolume: undefined,
    });
  };

  const activeFilterCount = [
    filters.platform !== "all",
    filters.category,
    filters.minLiquidity,
    filters.minVolume,
    filters.search,
  ].filter(Boolean).length;

  return (
    <Card data-testid="card-market-filters">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search markets..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9"
                data-testid="input-search-markets"
              />
            </div>
          </form>
          
          <div className="flex gap-2">
            <Select
              value={filters.platform}
              onValueChange={(value) => onFiltersChange({ ...filters, platform: value as MarketFilter["platform"] })}
            >
              <SelectTrigger className="w-[130px]" data-testid="select-platform">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="polymarket">Polymarket</SelectItem>
                <SelectItem value="kalshi">Kalshi</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split("-") as [MarketFilter["sortBy"], MarketFilter["sortOrder"]];
                onFiltersChange({ ...filters, sortBy, sortOrder });
              }}
            >
              <SelectTrigger className="w-[160px]" data-testid="select-sort">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume-desc">Volume (High to Low)</SelectItem>
                <SelectItem value="volume-asc">Volume (Low to High)</SelectItem>
                <SelectItem value="liquidity-desc">Liquidity (High to Low)</SelectItem>
                <SelectItem value="liquidity-asc">Liquidity (Low to High)</SelectItem>
                <SelectItem value="closing_date-asc">Closing Soon</SelectItem>
                <SelectItem value="closing_date-desc">Closing Later</SelectItem>
                <SelectItem value="expected_value-desc">Highest EV</SelectItem>
              </SelectContent>
            </Select>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="relative"
                  data-testid="button-toggle-filters"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-4 pt-4 border-t">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) => onFiltersChange({ 
                      ...filters, 
                      category: value === "all" ? undefined : value 
                    })}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Liquidity</label>
                <Select
                  value={filters.minLiquidity?.toString() || "0"}
                  onValueChange={(value) => onFiltersChange({ 
                    ...filters, 
                    minLiquidity: value === "0" ? undefined : parseInt(value) 
                  })}
                >
                  <SelectTrigger data-testid="select-min-liquidity">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="1000">$1,000+</SelectItem>
                    <SelectItem value="10000">$10,000+</SelectItem>
                    <SelectItem value="50000">$50,000+</SelectItem>
                    <SelectItem value="100000">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Volume</label>
                <Select
                  value={filters.minVolume?.toString() || "0"}
                  onValueChange={(value) => onFiltersChange({ 
                    ...filters, 
                    minVolume: value === "0" ? undefined : parseInt(value) 
                  })}
                >
                  <SelectTrigger data-testid="select-min-volume">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="10000">$10,000+</SelectItem>
                    <SelectItem value="100000">$100,000+</SelectItem>
                    <SelectItem value="500000">$500,000+</SelectItem>
                    <SelectItem value="1000000">$1,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground"
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all filters
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
