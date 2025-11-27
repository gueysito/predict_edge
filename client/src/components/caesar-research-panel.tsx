import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Sparkles, 
  ExternalLink, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { CaesarJob, Citation } from "@shared/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CaesarResearchPanelProps {
  marketQuestion?: string;
  marketId?: string;
  initialQuery?: string;
}

function CitationItem({ citation, index }: { citation: Citation; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button 
          className="flex items-start gap-2 w-full text-left p-2 rounded-md hover-elevate"
          data-testid={`button-citation-${citation.id}`}
        >
          <Badge variant="secondary" className="shrink-0 text-xs">
            {index + 1}
          </Badge>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-1">{citation.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{citation.url}</p>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8 pr-2">
        <div className="p-3 bg-muted/50 rounded-md mt-1 space-y-2">
          <p className="text-sm text-muted-foreground">{citation.snippet}</p>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Relevance: {Math.round(citation.relevanceScore * 100)}%
            </Badge>
            <a 
              href={citation.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              View Source <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface ConfigStatus {
  caesarApiConfigured: boolean;
  features: {
    polymarket: boolean;
    kalshi: boolean;
    caesar: boolean;
  };
}

export function CaesarResearchPanel({ 
  marketQuestion, 
  marketId,
  initialQuery 
}: CaesarResearchPanelProps) {
  const [query, setQuery] = useState(
    initialQuery || 
    (marketQuestion ? `Analyze the prediction market: "${marketQuestion}". Provide insights on probability, key factors, and risk assessment.` : "")
  );
  const [computeUnits, setComputeUnits] = useState([3]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: configStatus } = useQuery<ConfigStatus>({
    queryKey: ["/api/config/status"],
    staleTime: 60000,
  });

  const { data: job, isLoading: isPolling } = useQuery<CaesarJob>({
    queryKey: ["/api/caesar/jobs", activeJobId],
    enabled: !!activeJobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return 2000;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/caesar/research", {
        query,
        computeUnits: computeUnits[0],
        marketId,
      });
      return response as CaesarJob;
    },
    onSuccess: (data) => {
      setActiveJobId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/caesar/jobs"] });
    },
  });

  const isProcessing = job?.status === "pending" || job?.status === "processing";
  const isComplete = job?.status === "completed";
  const isFailed = job?.status === "failed";

  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isComplete) return <CheckCircle className="h-4 w-4 text-success" />;
    if (isFailed) return <AlertCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (job?.status === "pending") return "Queued for research...";
    if (job?.status === "processing") return "Caesar is researching...";
    if (isComplete) return "Research complete";
    if (isFailed) return "Research failed";
    return "Ready";
  };

  const isDemoMode = !configStatus?.caesarApiConfigured;
  const isSimulated = activeJobId?.startsWith("sim-") || job?.id?.startsWith("sim-");

  return (
    <Card className="border-primary/20" data-testid="card-caesar-research">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Caesar Research
          {isDemoMode && (
            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
              Demo
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!activeJobId && (
          <>
            {isDemoMode && (
              <Alert className="bg-warning/10 border-warning/30">
                <FlaskConical className="h-4 w-4 text-warning" />
                <AlertDescription className="text-sm">
                  Demo mode: Results are simulated. Add CAESAR_API_KEY in settings to enable real AI research.
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Research Query</label>
              <Textarea
                placeholder="Ask Caesar to research and analyze..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px] resize-none"
                data-testid="input-caesar-query"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Compute Units (Depth)</label>
                <span className="text-sm text-muted-foreground font-mono">{computeUnits[0]} CU</span>
              </div>
              <Slider
                value={computeUnits}
                onValueChange={setComputeUnits}
                min={1}
                max={10}
                step={1}
                className="w-full"
                data-testid="slider-compute-units"
              />
              <p className="text-xs text-muted-foreground">
                Higher CU = deeper research, ~{computeUnits[0]} min processing time
              </p>
            </div>
            <Button 
              onClick={() => submitMutation.mutate()}
              disabled={!query.trim() || submitMutation.isPending}
              className="w-full"
              data-testid="button-submit-research"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Research
                </>
              )}
            </Button>
          </>
        )}

        {activeJobId && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">{getStatusText()}</span>
              </div>
              {isProcessing && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {job?.computeUnits || computeUnits[0]} CU
                </Badge>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={job?.status === "processing" ? 50 : 10} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Estimated time: ~{job?.computeUnits || computeUnits[0]} minutes
                </p>
              </div>
            )}

            {isComplete && job?.result && (
              <div className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div 
                    className="p-4 bg-muted/30 rounded-md text-sm leading-relaxed whitespace-pre-wrap"
                    data-testid="text-caesar-result"
                  >
                    {job.result}
                  </div>
                </div>

                {job.citations && job.citations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Sources ({job.citations.length})
                    </h4>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                      {job.citations.map((citation, index) => (
                        <CitationItem 
                          key={citation.id} 
                          citation={citation} 
                          index={index} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isFailed && (
              <div className="p-4 bg-destructive/10 rounded-md">
                <p className="text-sm text-destructive">
                  {job?.error || "An error occurred during research. Please try again."}
                </p>
              </div>
            )}

            {(isComplete || isFailed) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setActiveJobId(null);
                  if (isFailed) setQuery(query);
                }}
                className="w-full"
                data-testid="button-new-research"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Research
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CaesarResearchPanelSkeleton() {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
