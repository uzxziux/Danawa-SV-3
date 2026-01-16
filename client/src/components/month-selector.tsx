import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthSelectorProps {
  value: string;
  onChange: (month: string) => void;
  availableMonths: string[];
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  return `${year}년 ${parseInt(month, 10)}월`;
}

export function MonthSelector({ value, onChange, availableMonths }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]" data-testid="select-month">
          <SelectValue placeholder="월 선택" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((month) => (
            <SelectItem key={month} value={month} data-testid={`option-month-${month}`}>
              {formatMonth(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
