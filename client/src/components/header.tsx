import { TrendingUp, RefreshCw } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { MonthSelector } from "./month-selector";
import { NationToggle } from "./nation-toggle";
import { Button } from "@/components/ui/button";
import type { Nation } from "@shared/schema";
import { cn } from "@/lib/utils";

interface HeaderProps {
  month: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  nation: Nation;
  onNationChange: (nation: Nation) => void;
  lastUpdated: string | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

function formatLastUpdated(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Header({
  month,
  onMonthChange,
  availableMonths,
  nation,
  onNationChange,
  lastUpdated,
  onRefresh,
  isRefreshing,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                급상승 모델 레이더
              </h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                다나와 자동차 판매실적 기반
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <MonthSelector
              value={month}
              onChange={onMonthChange}
              availableMonths={availableMonths}
            />
            <NationToggle value={nation} onChange={onNationChange} />
            
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                disabled={isRefreshing}
                aria-label="데이터 새로고침"
                data-testid="button-refresh"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {lastUpdated && (
          <div className="pb-3 text-xs text-muted-foreground">
            마지막 업데이트: {formatLastUpdated(lastUpdated)}
          </div>
        )}
      </div>
    </header>
  );
}
