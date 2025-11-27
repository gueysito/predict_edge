import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  Droplets,
  TrendingUp,
  TrendingDown,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PriceChart } from "@/components/price-chart";
import { CaesarResearchPanel } from "@/components/caesar-research-panel";
import { RiskRewardCalculator } from "@/components/risk-reward-calculator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/loading-states";
import type { Market, PriceHistory } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function MarketDetail() {
  const params = useParams<{ platform: string; id: string }>();
  const { platform, id } = params;

  const { data: market, isLoading, error } = useQuery<Market>({
    queryKey: ["/api/markets", platform, id],
  });

  const { data: priceHistory, isLoading: priceLoading } = useQuery<PriceHistory[]>({
    queryKey: ["/api/markets", platform, id, "history"],
    enabled: !!market,
  });

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(2)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol.toFixed(0)}`;
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          title="Market not found"
          description="We couldn't find this market. It may have been removed or the link is invalid."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!market) return null;

  const yesPercentage = Math.round(market.yesPrice * 100);
  const noPercentage = Math.round(market.noPrice * 100);
  const isYesFavored = yesPercentage >= 50;

  return (
    <div className="p-6 space-y-6" data-testid="page-market-detail">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/markets" data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary">
              {market.platform === "polymarket" ? "Polymarket" : "Kalshi"}
            </Badge>
            {market.category && (
              <Badge variant="outline">{market.category}</Badge>
            )}
          </div>
          <h1 className="text-xl font-semibold" data-testid="text-market-title">
            {market.question}
          </h1>
          {market.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {market.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {market.url && (
            <Button variant="outline" size="icon" asChild>
              <a href={market.url} target="_blank" rel="noopener noreferrer" data-testid="button-external-link">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="outline" size="icon" data-testid="button-share">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Prices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isYesFavored ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="font-medium">Yes</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${isYesFavored ? 'text-success' : ''}`} data-testid="text-yes-price">
                    {yesPercentage}¢
                  </p>
                  <Progress value={yesPercentage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {!isYesFavored ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="font-medium">No</span>
                  </div>
                  <p className={`text-3xl font-bold font-mono ${!isYesFavored ? 'text-success' : ''}`} data-testid="text-no-price">
                    {noPercentage}¢
                  </p>
                  <Progress value={noPercentage} className="h-2" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Volume</span>
                  </div>
                  <p className="text-lg font-semibold font-mono" data-testid="text-volume">
                    {formatVolume(market.volume)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Droplets className="h-4 w-4" />
                    <span>Liquidity</span>
                  </div>
                  <p className="text-lg font-semibold font-mono" data-testid="text-liquidity">
                    {formatVolume(market.liquidity)}
                  </p>
                </div>
                {market.endDate && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Ends</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatDistanceToNow(new Date(market.endDate), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <PriceChart 
            data={priceHistory || []} 
            isLoading={priceLoading}
          />

          <RiskRewardCalculator 
            initialPrice={market.yesPrice}
            initialProbability={market.yesPrice}
          />
        </div>

        <div className="space-y-6">
          <CaesarResearchPanel 
            marketQuestion={market.question}
            marketId={market.id}
          />
        </div>
      </div>
    </div>
  );
}
