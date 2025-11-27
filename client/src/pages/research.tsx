import { useQuery } from "@tanstack/react-query";
import { Sparkles, Clock } from "lucide-react";
import { CaesarResearchPanel } from "@/components/caesar-research-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { CaesarJob } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

function RecentJobCard({ job }: { job: CaesarJob }) {
  const statusColors = {
    pending: "bg-muted text-muted-foreground",
    processing: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    failed: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="hover-elevate" data-testid={`card-recent-job-${job.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className={statusColors[job.status]}>
            {job.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm line-clamp-2 mb-2">{job.query}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{job.computeUnits} CU</span>
          {job.citations && (
            <span>{job.citations.length} sources</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Research() {
  const { data: recentJobs, isLoading } = useQuery<CaesarJob[]>({
    queryKey: ["/api/caesar/jobs"],
  });

  return (
    <div className="p-6 space-y-6" data-testid="page-research">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Caesar Research
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-powered research engine with citation-backed insights
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CaesarResearchPanel />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-medium">Recent Research</h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentJobs && recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.slice(0, 5).map((job) => (
                <RecentJobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No research history yet. Start your first query above.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">About Caesar</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Caesar is an AI research engine that searches the internet and proprietary databases to provide expert-level, citation-backed answers.
              </p>
              <p>
                <strong className="text-foreground">Compute Units:</strong> Higher CU values enable deeper research with more validation loops.
              </p>
              <p>
                <strong className="text-foreground">Citations:</strong> Every insight is linked to its source for verification.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
