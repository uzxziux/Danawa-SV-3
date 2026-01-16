import type { Nation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NationToggleProps {
  value: Nation;
  onChange: (nation: Nation) => void;
}

export function NationToggle({ value, onChange }: NationToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-border bg-muted p-1 gap-1" role="radiogroup" aria-label="차종 선택">
      <Button
        variant={value === "domestic" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("domestic")}
        className={cn(
          "px-4 transition-all",
          value === "domestic" && "shadow-sm"
        )}
        role="radio"
        aria-checked={value === "domestic"}
        data-testid="button-nation-domestic"
      >
        국산
      </Button>
      <Button
        variant={value === "export" ? "default" : "ghost"}
        size="sm"
        onClick={() => onChange("export")}
        className={cn(
          "px-4 transition-all",
          value === "export" && "shadow-sm"
        )}
        role="radio"
        aria-checked={value === "export"}
        data-testid="button-nation-export"
      >
        수입
      </Button>
    </div>
  );
}
