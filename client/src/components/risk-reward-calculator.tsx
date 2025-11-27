import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react";

interface RiskRewardCalculatorProps {
  initialProbability?: number;
  initialPrice?: number;
  initialBankroll?: number;
}

export function RiskRewardCalculator({
  initialProbability = 0.5,
  initialPrice = 0.5,
  initialBankroll = 1000,
}: RiskRewardCalculatorProps) {
  const [probability, setProbability] = useState([initialProbability * 100]);
  const [price, setPrice] = useState([initialPrice * 100]);
  const [bankroll, setBankroll] = useState(initialBankroll.toString());

  const calculations = useMemo(() => {
    const prob = probability[0] / 100;
    const marketPrice = price[0] / 100;
    const bank = parseFloat(bankroll) || 0;

    const expectedValue = prob - marketPrice;
    const odds = 1 / marketPrice - 1;
    const kellyFraction = Math.max(0, (prob * (odds + 1) - 1) / odds);
    const halfKelly = kellyFraction / 2;
    const recommendedStake = bank * halfKelly;

    const potentialProfit = recommendedStake * odds;
    const potentialLoss = recommendedStake;

    let riskRating: "low" | "medium" | "high" | "extreme";
    if (halfKelly < 0.02) riskRating = "low";
    else if (halfKelly < 0.05) riskRating = "medium";
    else if (halfKelly < 0.10) riskRating = "high";
    else riskRating = "extreme";

    const breakEvenProb = marketPrice;

    return {
      expectedValue,
      kellyFraction,
      halfKelly,
      recommendedStake,
      potentialProfit,
      potentialLoss,
      riskRating,
      odds,
      breakEvenProb,
    };
  }, [probability, price, bankroll]);

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-chart-5";
      case "extreme": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadge = (rating: string) => {
    switch (rating) {
      case "low": return <Badge className="bg-success/10 text-success border-success/20">Low Risk</Badge>;
      case "medium": return <Badge className="bg-warning/10 text-warning border-warning/20">Medium Risk</Badge>;
      case "high": return <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/20">High Risk</Badge>;
      case "extreme": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Extreme Risk</Badge>;
      default: return null;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatPercent = (val: number) => {
    const sign = val >= 0 ? "+" : "";
    return `${sign}${(val * 100).toFixed(2)}%`;
  };

  return (
    <Card data-testid="card-risk-calculator">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Risk/Reward Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Your Estimated Probability</Label>
                <span className="font-mono text-sm font-semibold text-primary" data-testid="text-probability-value">
                  {probability[0]}%
                </span>
              </div>
              <Slider
                value={probability}
                onValueChange={setProbability}
                min={1}
                max={99}
                step={1}
                className="w-full"
                data-testid="slider-probability"
              />
              <p className="text-xs text-muted-foreground">
                What you believe the true probability is
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Market Price (Current Odds)</Label>
                <span className="font-mono text-sm font-semibold" data-testid="text-price-value">
                  {price[0]}¢
                </span>
              </div>
              <Slider
                value={price}
                onValueChange={setPrice}
                min={1}
                max={99}
                step={1}
                className="w-full"
                data-testid="slider-price"
              />
              <p className="text-xs text-muted-foreground">
                Current "Yes" price in the market
              </p>
            </div>

            <div className="space-y-2">
              <Label>Your Bankroll</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={bankroll}
                  onChange={(e) => setBankroll(e.target.value)}
                  className="pl-7 font-mono"
                  placeholder="1000"
                  data-testid="input-bankroll"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Total capital available for betting
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expected Value</span>
                <span 
                  className={`font-mono font-bold text-lg ${calculations.expectedValue >= 0 ? 'text-success' : 'text-destructive'}`}
                  data-testid="text-expected-value"
                >
                  {formatPercent(calculations.expectedValue)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kelly Criterion</span>
                <span className="font-mono font-semibold" data-testid="text-kelly-full">
                  {(calculations.kellyFraction * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Half Kelly (Safer)</span>
                <span className="font-mono font-semibold text-primary" data-testid="text-kelly-half">
                  {(calculations.halfKelly * 100).toFixed(2)}%
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                {getRiskBadge(calculations.riskRating)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-xs text-success font-medium">If Win</span>
                </div>
                <p className="font-mono font-bold text-success" data-testid="text-potential-profit">
                  +{formatCurrency(calculations.potentialProfit)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-destructive font-medium">If Lose</span>
                </div>
                <p className="font-mono font-bold text-destructive" data-testid="text-potential-loss">
                  -{formatCurrency(calculations.potentialLoss)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Recommended Position Size</p>
              <p className="text-xs text-muted-foreground">
                Based on Half Kelly criterion ({(calculations.halfKelly * 100).toFixed(1)}% of bankroll)
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-mono text-primary" data-testid="text-recommended-stake">
              {formatCurrency(calculations.recommendedStake)}
            </p>
            {calculations.expectedValue < 0 && (
              <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Negative EV - consider avoiding</span>
              </div>
            )}
            {calculations.expectedValue > 0 && (
              <div className="flex items-center gap-1 text-xs text-success mt-1">
                <CheckCircle className="h-3 w-3" />
                <span>Positive edge detected</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Break-even probability:</strong>{" "}
            <span className="font-mono">{(calculations.breakEvenProb * 100).toFixed(1)}%</span>
          </p>
          <p>
            <strong>Implied odds:</strong>{" "}
            <span className="font-mono">{calculations.odds.toFixed(2)} : 1</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
