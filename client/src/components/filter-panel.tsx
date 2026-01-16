import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FilterPanelProps {
  minSales: number;
  onMinSalesChange: (value: number) => void;
  excludeNew: boolean;
  onExcludeNewChange: (value: boolean) => void;
  totalCount: number;
}

export function FilterPanel({
  minSales,
  onMinSalesChange,
  excludeNew,
  onExcludeNewChange,
  totalCount,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4 bg-card rounded-md border border-card-border" data-testid="filter-panel">
      <div className="flex flex-col gap-2 min-w-[200px]">
        <div className="flex items-center justify-between">
          <Label htmlFor="min-sales" className="text-sm font-medium">
            최소 판매량
          </Label>
          <span className="text-sm font-mono text-muted-foreground" data-testid="text-min-sales-value">
            {minSales.toLocaleString()}대 이상
          </span>
        </div>
        <Slider
          id="min-sales"
          value={[minSales]}
          onValueChange={([value]) => onMinSalesChange(value)}
          min={0}
          max={1000}
          step={50}
          className="w-full"
          data-testid="slider-min-sales"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="exclude-new"
          checked={excludeNew}
          onCheckedChange={(checked) => onExcludeNewChange(checked === true)}
          data-testid="checkbox-exclude-new"
        />
        <Label
          htmlFor="exclude-new"
          className="text-sm font-medium cursor-pointer"
          data-testid="label-exclude-new"
        >
          신규 진입 제외
        </Label>
      </div>

      <div className="ml-auto">
        <Badge variant="secondary" className="font-mono" data-testid="badge-total-count">
          {totalCount}개 모델
        </Badge>
      </div>
    </div>
  );
}
