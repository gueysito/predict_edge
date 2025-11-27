import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Clock } from "lucide-react";
import type { PriceHistory } from "@shared/schema";
import { useState } from "react";

interface PriceChartProps {
  data: PriceHistory[];
  isLoading?: boolean;
  title?: string;
}

type TimeRange = "24h" | "7d" | "30d" | "all";

export function PriceChart({ data, isLoading, title = "Price History" }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const filteredData = useMemo(() => {
    if (!data?.length) return [];
    
    const now = new Date();
    let cutoff: Date;
    
    switch (timeRange) {
      case "24h":
        cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "all":
      default:
        return data.map(d => ({
          ...d,
          yesPrice: d.yesPrice * 100,
          noPrice: d.noPrice * 100,
          time: new Date(d.timestamp).toLocaleDateString(),
        }));
    }
    
    return data
      .filter(d => new Date(d.timestamp) >= cutoff)
      .map(d => ({
        ...d,
        yesPrice: d.yesPrice * 100,
        noPrice: d.noPrice * 100,
        time: timeRange === "24h" 
          ? new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date(d.timestamp).toLocaleDateString(),
      }));
  }, [data, timeRange]);

  const priceChange = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0].yesPrice;
    const last = filteredData[filteredData.length - 1].yesPrice;
    const change = last - first;
    const percentChange = (change / first) * 100;
    return { change, percentChange, isPositive: change >= 0 };
  }, [filteredData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-price-chart">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            {priceChange && (
              <Badge 
                variant="secondary"
                className={priceChange.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}
              >
                {priceChange.isPositive ? "+" : ""}{priceChange.change.toFixed(1)}¢ 
                ({priceChange.isPositive ? "+" : ""}{priceChange.percentChange.toFixed(1)}%)
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {(["24h", "7d", "30d", "all"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="px-3"
                data-testid={`button-range-${range}`}
              >
                {range === "all" ? "All" : range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Clock className="h-10 w-10 mb-2" />
            <p className="text-sm">No price data available for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}¢`}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`${value.toFixed(1)}¢`, '']}
              />
              <Area
                type="monotone"
                dataKey="yesPrice"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fill="url(#yesGradient)"
                name="Yes"
              />
              <Area
                type="monotone"
                dataKey="noPrice"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                fill="url(#noGradient)"
                name="No"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Yes Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">No Price</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
