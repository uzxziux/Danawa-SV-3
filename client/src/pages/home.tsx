import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { FilterPanel } from "@/components/filter-panel";
import { ModelCard } from "@/components/model-card";
import { ModelCardSkeleton } from "@/components/model-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import type { Nation, RadarResponse } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

function buildRadarUrl(params: {
  month: string;
  nation: Nation;
  minSales: number;
  excludeNew: boolean;
}): string {
  const searchParams = new URLSearchParams();
  if (params.month) searchParams.set("month", params.month);
  if (params.nation) searchParams.set("nation", params.nation);
  if (params.minSales > 0) searchParams.set("minSales", String(params.minSales));
  if (params.excludeNew) searchParams.set("excludeNew", "true");
  return `/api/radar?${searchParams.toString()}`;
}

export default function Home() {
  const [month, setMonth] = useState<string>("");
  const [nation, setNation] = useState<Nation>("domestic");
  const [minSales, setMinSales] = useState(0);
  const [excludeNew, setExcludeNew] = useState(false);

  const url = buildRadarUrl({ month, nation, minSales, excludeNew });

  const { data, isLoading, isFetching, refetch } = useQuery<RadarResponse>({
    queryKey: ["/api/radar", month, nation, minSales, excludeNew],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch radar data");
      }
      return res.json();
    },
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/radar"] });
    refetch();
  };

  const currentMonth = data?.currentMonth || month;
  const availableMonths = data?.availableMonths || [];
  const models = data?.models || [];
  const totalCount = data?.totalCount || 0;
  const lastUpdated = data?.lastUpdated || null;

  useEffect(() => {
    if (!month && currentMonth) {
      setMonth(currentMonth);
    }
  }, [month, currentMonth]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        month={month || currentMonth}
        onMonthChange={setMonth}
        availableMonths={availableMonths}
        nation={nation}
        onNationChange={setNation}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 md:py-8">
        <div className="space-y-6">
          <FilterPanel
            minSales={minSales}
            onMinSalesChange={setMinSales}
            excludeNew={excludeNew}
            onExcludeNewChange={setExcludeNew}
            totalCount={totalCount}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ModelCardSkeleton key={i} />
              ))}
            </div>
          ) : models.length === 0 ? (
            <EmptyState
              title="급상승 모델 없음"
              description="현재 필터 조건에 맞는 급상승 모델이 없습니다. 필터를 조정해 보세요."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {models.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center">
            본 서비스는 다나와 자동차 판매실적 데이터를 기반으로 합니다.
            <br />
            원문 데이터는{" "}
            <a
              href="https://auto.danawa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              다나와 자동차
            </a>
            에서 확인하세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
