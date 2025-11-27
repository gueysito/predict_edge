import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import type { Opportunity } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const opportunityTypeLabels: Record<Opportunity["opportunityType"], string> = {
  mispriced: "Mispriced",
  arbitrage: "Arbitrage",
  high_ev: "High EV",
  value_bet: "Value Bet",
};

const opportunityTypeColors: Record<Opportunity["opportunityType"], string> = {
  mispriced: "bg-warning/10 text-warning border-warning/20",
  arbitrage: "bg-success/10 text-success border-success/20",
  high_ev: "bg-primary/10 text-primary border-primary/20",
  value_bet: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

const actionIcons = {
  buy_yes: <ArrowUpRight className="h-4 w-4 text-success" />,
  buy_no: <ArrowDownRight className="h-4 w-4 text-destructive" />,
  avoid: <Minus className="h-4 w-4 text-muted-foreground" />,
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const formatEV = (ev: number) => {
    const sign = ev >= 0 ? "+" : "";
    return `${sign}${(ev * 100).toFixed(1)}%`;
  };

  const formatKelly = (kelly: number) => {
    return `${(kelly * 100).toFixed(1)}%`;
  };

  return (
    <Card 
      className="hover-elevate transition-all border-l-4"
      style={{ 
        borderLeftColor: opportunity.opportunityType === "arbitrage" 
          ? "hsl(var(--success))" 
          : opportunity.opportunityType === "high_ev"
          ? "hsl(var(--primary))"
          : opportunity.opportunityType === "mispriced"
          ? "hsl(var(--warning))"
          : "hsl(var(--chart-4))"
      }}
      data-testid={`card-opportunity-${opportunity.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={opportunityTypeColors[opportunity.opportunityType]}
            >
              <Zap className="h-3 w-3 mr-1" />
              {opportunityTypeLabels[opportunity.opportunityType]}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {opportunity.market.platform === "polymarket" ? "Poly" : "Kalshi"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(opportunity.detectedAt), { addSuffix: true })}
          </div>
        </div>
        <Link href={`/market/${opportunity.market.platform}/${opportunity.market.id}`}>
          <h3 
            className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors cursor-pointer mt-2"
            data-testid={`text-opportunity-question-${opportunity.id}`}
          >
            {opportunity.market.question}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Expected Value</p>
            <p 
              className={`font-mono font-semibold ${opportunity.expectedValue >= 0 ? 'text-success' : 'text-destructive'}`}
              data-testid={`text-ev-${opportunity.id}`}
            >
              {formatEV(opportunity.expectedValue)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Kelly Size</p>
            <p className="font-mono font-semibold" data-testid={`text-kelly-${opportunity.id}`}>
              {formatKelly(opportunity.kellySize)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className="font-mono font-semibold" data-testid={`text-confidence-${opportunity.id}`}>
              {Math.round(opportunity.confidence * 100)}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50">
          <Target className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Recommended:</span>
              {actionIcons[opportunity.recommendedAction]}
              <span className="text-sm capitalize">
                {opportunity.recommendedAction.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-reasoning-${opportunity.id}`}>
          {opportunity.reasoning}
        </p>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link href={`/market/${opportunity.market.platform}/${opportunity.market.id}`} data-testid={`button-view-opportunity-${opportunity.id}`}>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analysis
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
