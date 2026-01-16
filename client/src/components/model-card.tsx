import { TrendingUp, TrendingDown, ExternalLink, Minus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RadarModel } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  model: RadarModel;
}

function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

function formatPercent(num: number): string {
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(1)}%`;
}

function formatChange(num: number): string {
  const sign = num > 0 ? "+" : "";
  return `${sign}${formatNumber(num)}`;
}

export function ModelCard({ model }: ModelCardProps) {
  const isPositiveChange = model.momAbs > 0;
  const isNegativeChange = model.momAbs < 0;
  const isRankUp = model.rankChange > 0;
  const isRankDown = model.rankChange < 0;
  const isNewEntry = model.prevSales === null || model.prevSales === 0;

  return (
    <Card className="flex flex-col hover-elevate transition-all" data-testid={`card-model-${model.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg font-mono",
              model.rank <= 3
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
            data-testid={`badge-rank-${model.id}`}
          >
            {model.rank}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide" data-testid={`text-brand-${model.id}`}>
              {model.brandName}
            </span>
            <h3 className="text-lg font-semibold leading-tight" data-testid={`text-model-name-${model.id}`}>
              {model.modelName}
            </h3>
          </div>
        </div>
        {isNewEntry && (
          <Badge variant="outline" className="shrink-0 text-xs" data-testid={`badge-new-${model.id}`}>
            신규
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="text-center py-2">
          <span className="text-sm text-muted-foreground">이번달 판매량</span>
          <p className="text-3xl font-bold font-mono tracking-tight" data-testid={`text-sales-${model.id}`}>
            {formatNumber(model.sales)}
            <span className="text-base font-normal text-muted-foreground ml-1">대</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              전월대비
            </span>
            <div className="flex items-center gap-1.5">
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : isNegativeChange ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-lg font-semibold font-mono",
                  isPositiveChange && "text-emerald-600 dark:text-emerald-400",
                  isNegativeChange && "text-red-600 dark:text-red-400"
                )}
                data-testid={`text-mom-abs-${model.id}`}
              >
                {formatChange(model.momAbs)}대
              </span>
            </div>
            <span
              className={cn(
                "text-sm font-mono",
                isPositiveChange && "text-emerald-600 dark:text-emerald-400",
                isNegativeChange && "text-red-600 dark:text-red-400",
                !isPositiveChange && !isNegativeChange && "text-muted-foreground"
              )}
              data-testid={`text-mom-pct-${model.id}`}
            >
              {formatPercent(model.momPct)}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              랭크 변화
            </span>
            <div className="flex items-center gap-1.5">
              {isRankUp ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : isRankDown ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-lg font-semibold font-mono",
                  isRankUp && "text-emerald-600 dark:text-emerald-400",
                  isRankDown && "text-red-600 dark:text-red-400"
                )}
                data-testid={`text-rank-change-${model.id}`}
              >
                {isRankUp ? `↑${model.rankChange}` : isRankDown ? `↓${Math.abs(model.rankChange)}` : "-"}
              </span>
            </div>
            {model.prevRank && (
              <span className="text-sm text-muted-foreground font-mono" data-testid={`text-prev-rank-${model.id}`}>
                전월 {model.prevRank}위
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          variant="outline"
          className="w-full gap-2"
          asChild
          data-testid={`button-danawa-link-${model.id}`}
        >
          <a href={model.danawaUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            다나와 원문 보기
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
