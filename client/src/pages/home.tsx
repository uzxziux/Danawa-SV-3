import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { FilterPanel } from "@/components/filter-panel";
import { ModelCard } from "@/components/model-card";
import { EmptyState } from "@/components/empty-state";
import type { Nation } from "@shared/schema";
import { getRadarData, getAvailableMonths } from "@/lib/radar-data";

export default function Home() {
  const [nation, setNation] = useState<Nation>("domestic");
  const [minSales, setMinSales] = useState(0);
  const [excludeNew, setExcludeNew] = useState(false);

  const availableMonths = useMemo(() => getAvailableMonths(), []);
  const [month, setMonth] = useState<string>(availableMonths[0] || "2025-12");

  const data = useMemo(() => {
    return getRadarData({ month, nation, minSales, excludeNew });
  }, [month, nation, minSales, excludeNew]);

  const models = data.models;
  const totalCount = data.totalCount;
  const lastUpdated = data.lastUpdated;

  return (
    <div className="min-h-screen bg-background">
      <Header
        month={month}
        onMonthChange={setMonth}
        availableMonths={availableMonths}
        nation={nation}
        onNationChange={setNation}
        lastUpdated={lastUpdated}
        onRefresh={() => {}}
        isRefreshing={false}
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

          {models.length === 0 ? (
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
