import { Calculator } from "lucide-react";
import { RiskRewardCalculator } from "@/components/risk-reward-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CalculatorPage() {
  return (
    <div className="p-6 space-y-6" data-testid="page-calculator">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Risk/Reward Calculator
        </h1>
        <p className="text-sm text-muted-foreground">
          Calculate optimal position sizes using Kelly Criterion and expected value analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RiskRewardCalculator />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-1">Expected Value (EV)</h4>
                <p className="text-muted-foreground">
                  EV = Your Probability - Market Price. A positive EV means you believe the market is mispriced in your favor.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Kelly Criterion</h4>
                <p className="text-muted-foreground">
                  Kelly = (bp - q) / b, where b = odds, p = your probability, q = 1-p. It tells you what fraction of your bankroll to bet.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Half Kelly</h4>
                <p className="text-muted-foreground">
                  We recommend Half Kelly for more conservative sizing, reducing volatility while still capturing most of the edge.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Risk Levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Low Risk</span>
                <Badge className="bg-success/10 text-success border-success/20">
                  {"<"} 2% of bankroll
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Medium Risk</span>
                <Badge className="bg-warning/10 text-warning border-warning/20">
                  2-5% of bankroll
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>High Risk</span>
                <Badge className="bg-chart-5/10 text-chart-5 border-chart-5/20">
                  5-10% of bankroll
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Extreme Risk</span>
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                  {">"} 10% of bankroll
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Be honest about probability.</strong> Overconfidence leads to oversizing positions.
              </p>
              <p>
                <strong className="text-foreground">Consider uncertainty.</strong> If unsure, reduce position size below Kelly recommendation.
              </p>
              <p>
                <strong className="text-foreground">Never bet more than Kelly.</strong> Full Kelly already maximizes long-term growth; going above increases variance without increasing returns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
