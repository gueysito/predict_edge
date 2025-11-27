import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  Clock,
  DollarSign,
  Droplets,
} from "lucide-react";
import type { Market } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface MarketCardProps {
  market: Market;
  showPlatformBadge?: boolean;
}

export function MarketCard({ market, showPlatformBadge = true }: MarketCardProps) {
  const yesPercentage = Math.round(market.yesPrice * 100);
  const noPercentage = Math.round(market.noPrice * 100);
  const isYesFavored = yesPercentage >= 50;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`;
    return `$${vol.toFixed(0)}`;
  };

  const formatLiquidity = (liq: number) => {
    if (liq >= 1000000) return `$${(liq / 1000000).toFixed(1)}M`;
    if (liq >= 1000) return `$${(liq / 1000).toFixed(1)}K`;
    return `$${liq.toFixed(0)}`;
  };

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-market-${market.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/market/${market.platform}/${market.id}`}>
              <h3 
                className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                data-testid={`text-market-question-${market.id}`}
              >
                {market.question}
              </h3>
            </Link>
          </div>
          {showPlatformBadge && (
            <Badge 
              variant="secondary" 
              className="shrink-0 text-xs"
              data-testid={`badge-platform-${market.id}`}
            >
              {market.platform === "polymarket" ? "Poly" : "Kalshi"}
            </Badge>
          )}
        </div>
        {market.category && (
          <Badge variant="outline" className="w-fit text-xs mt-2">
            {market.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              {isYesFavored ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className="font-medium">Yes</span>
            </div>
            <span 
              className={`font-mono font-semibold ${isYesFavored ? 'text-success' : 'text-muted-foreground'}`}
              data-testid={`text-yes-price-${market.id}`}
            >
              {yesPercentage}¢
            </span>
          </div>
          <Progress 
            value={yesPercentage} 
            className="h-2"
          />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              {!isYesFavored ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className="font-medium">No</span>
            </div>
            <span 
              className={`font-mono font-semibold ${!isYesFavored ? 'text-success' : 'text-muted-foreground'}`}
              data-testid={`text-no-price-${market.id}`}
            >
              {noPercentage}¢
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Vol: </span>
            <span className="font-mono font-medium text-foreground" data-testid={`text-volume-${market.id}`}>
              {formatVolume(market.volume)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            <span>Liq: </span>
            <span className="font-mono font-medium text-foreground" data-testid={`text-liquidity-${market.id}`}>
              {formatLiquidity(market.liquidity)}
            </span>
          </div>
        </div>

        {market.endDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
            <Clock className="h-3.5 w-3.5" />
            <span>Ends {formatDistanceToNow(new Date(market.endDate), { addSuffix: true })}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/market/${market.platform}/${market.id}`} data-testid={`button-analyze-${market.id}`}>
              Analyze
            </Link>
          </Button>
          {market.url && (
            <Button 
              variant="outline" 
              size="icon"
              asChild
            >
              <a 
                href={market.url} 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid={`button-external-${market.id}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
