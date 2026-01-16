import type { RadarModel, Nation, RadarQuery, RadarResponse } from "@shared/schema";

export interface IStorage {
  getRadarData(query: RadarQuery): Promise<RadarResponse>;
  getAvailableMonths(): Promise<string[]>;
}

function generateDanawaUrl(nation: Nation, month: string): string {
  const nationParam = nation === "domestic" ? "domestic" : "export";
  return `https://auto.danawa.com/auto/?Month=${month}-00&Nation=${nationParam}&Tab=Model&Work=record`;
}

function calculateScore(momAbs: number, momPct: number, rankChange: number, allModels: { momAbs: number; momPct: number; rankChange: number }[]): number {
  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = (arr: number[], m: number) => Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1;

  const momAbsValues = allModels.map(m => m.momAbs);
  const momPctValues = allModels.map(m => m.momPct);
  const rankChangeValues = allModels.map(m => m.rankChange);

  const zScore = (value: number, arr: number[]) => {
    const m = mean(arr);
    const s = std(arr, m);
    return (value - m) / s;
  };

  const zMomAbs = zScore(momAbs, momAbsValues);
  const zMomPct = zScore(momPct, momPctValues);
  const zRankChange = zScore(rankChange, rankChangeValues);

  return 0.55 * zMomAbs + 0.35 * zMomPct + 0.10 * zRankChange;
}

const domesticModels2025_12: Omit<RadarModel, "id" | "score" | "danawaUrl">[] = [
  { month: "2025-12", nation: "domestic", rank: 1, prevRank: 3, modelName: "그랜저", brandName: "현대", sales: 12450, prevSales: 9800, momAbs: 2650, momPct: 27.0, rankChange: 2 },
  { month: "2025-12", nation: "domestic", rank: 2, prevRank: 1, modelName: "쏘렌토", brandName: "기아", sales: 11200, prevSales: 10500, momAbs: 700, momPct: 6.7, rankChange: -1 },
  { month: "2025-12", nation: "domestic", rank: 3, prevRank: 8, modelName: "아반떼", brandName: "현대", sales: 10800, prevSales: 7200, momAbs: 3600, momPct: 50.0, rankChange: 5 },
  { month: "2025-12", nation: "domestic", rank: 4, prevRank: 2, modelName: "카니발", brandName: "기아", sales: 9500, prevSales: 10200, momAbs: -700, momPct: -6.9, rankChange: -2 },
  { month: "2025-12", nation: "domestic", rank: 5, prevRank: 4, modelName: "투싼", brandName: "현대", sales: 8900, prevSales: 8700, momAbs: 200, momPct: 2.3, rankChange: -1 },
  { month: "2025-12", nation: "domestic", rank: 6, prevRank: 12, modelName: "K5", brandName: "기아", sales: 8200, prevSales: 5400, momAbs: 2800, momPct: 51.9, rankChange: 6 },
  { month: "2025-12", nation: "domestic", rank: 7, prevRank: 5, modelName: "싼타페", brandName: "현대", sales: 7800, prevSales: 8500, momAbs: -700, momPct: -8.2, rankChange: -2 },
  { month: "2025-12", nation: "domestic", rank: 8, prevRank: 6, modelName: "스포티지", brandName: "기아", sales: 7500, prevSales: 8300, momAbs: -800, momPct: -9.6, rankChange: -2 },
  { month: "2025-12", nation: "domestic", rank: 9, prevRank: 15, modelName: "캐스퍼", brandName: "현대", sales: 7200, prevSales: 4800, momAbs: 2400, momPct: 50.0, rankChange: 6 },
  { month: "2025-12", nation: "domestic", rank: 10, prevRank: 7, modelName: "셀토스", brandName: "기아", sales: 7000, prevSales: 7800, momAbs: -800, momPct: -10.3, rankChange: -3 },
  { month: "2025-12", nation: "domestic", rank: 11, prevRank: 9, modelName: "팰리세이드", brandName: "현대", sales: 6800, prevSales: 6900, momAbs: -100, momPct: -1.4, rankChange: -2 },
  { month: "2025-12", nation: "domestic", rank: 12, prevRank: 10, modelName: "모하비", brandName: "기아", sales: 6500, prevSales: 6700, momAbs: -200, momPct: -3.0, rankChange: -2 },
  { month: "2025-12", nation: "domestic", rank: 13, prevRank: null, modelName: "아이오닉 9", brandName: "현대", sales: 6200, prevSales: null, momAbs: 6200, momPct: 500.0, rankChange: 0 },
  { month: "2025-12", nation: "domestic", rank: 14, prevRank: 11, modelName: "레이", brandName: "기아", sales: 5800, prevSales: 6100, momAbs: -300, momPct: -4.9, rankChange: -3 },
  { month: "2025-12", nation: "domestic", rank: 15, prevRank: 18, modelName: "코나", brandName: "현대", sales: 5500, prevSales: 4200, momAbs: 1300, momPct: 31.0, rankChange: 3 },
  { month: "2025-12", nation: "domestic", rank: 16, prevRank: 13, modelName: "EV6", brandName: "기아", sales: 5200, prevSales: 5600, momAbs: -400, momPct: -7.1, rankChange: -3 },
  { month: "2025-12", nation: "domestic", rank: 17, prevRank: 14, modelName: "니로", brandName: "기아", sales: 4900, prevSales: 5100, momAbs: -200, momPct: -3.9, rankChange: -3 },
  { month: "2025-12", nation: "domestic", rank: 18, prevRank: 20, modelName: "스타리아", brandName: "현대", sales: 4600, prevSales: 3800, momAbs: 800, momPct: 21.1, rankChange: 2 },
  { month: "2025-12", nation: "domestic", rank: 19, prevRank: 16, modelName: "K8", brandName: "기아", sales: 4300, prevSales: 4600, momAbs: -300, momPct: -6.5, rankChange: -3 },
  { month: "2025-12", nation: "domestic", rank: 20, prevRank: 17, modelName: "아이오닉 5", brandName: "현대", sales: 4000, prevSales: 4400, momAbs: -400, momPct: -9.1, rankChange: -3 },
];

const domesticModels2025_11: Omit<RadarModel, "id" | "score" | "danawaUrl">[] = [
  { month: "2025-11", nation: "domestic", rank: 1, prevRank: 2, modelName: "쏘렌토", brandName: "기아", sales: 10500, prevSales: 9800, momAbs: 700, momPct: 7.1, rankChange: 1 },
  { month: "2025-11", nation: "domestic", rank: 2, prevRank: 1, modelName: "카니발", brandName: "기아", sales: 10200, prevSales: 10800, momAbs: -600, momPct: -5.6, rankChange: -1 },
  { month: "2025-11", nation: "domestic", rank: 3, prevRank: 4, modelName: "그랜저", brandName: "현대", sales: 9800, prevSales: 9200, momAbs: 600, momPct: 6.5, rankChange: 1 },
  { month: "2025-11", nation: "domestic", rank: 4, prevRank: 3, modelName: "투싼", brandName: "현대", sales: 8700, prevSales: 9100, momAbs: -400, momPct: -4.4, rankChange: -1 },
  { month: "2025-11", nation: "domestic", rank: 5, prevRank: 5, modelName: "싼타페", brandName: "현대", sales: 8500, prevSales: 8400, momAbs: 100, momPct: 1.2, rankChange: 0 },
  { month: "2025-11", nation: "domestic", rank: 6, prevRank: 6, modelName: "스포티지", brandName: "기아", sales: 8300, prevSales: 8200, momAbs: 100, momPct: 1.2, rankChange: 0 },
  { month: "2025-11", nation: "domestic", rank: 7, prevRank: 7, modelName: "셀토스", brandName: "기아", sales: 7800, prevSales: 7600, momAbs: 200, momPct: 2.6, rankChange: 0 },
  { month: "2025-11", nation: "domestic", rank: 8, prevRank: 9, modelName: "아반떼", brandName: "현대", sales: 7200, prevSales: 6800, momAbs: 400, momPct: 5.9, rankChange: 1 },
  { month: "2025-11", nation: "domestic", rank: 9, prevRank: 8, modelName: "팰리세이드", brandName: "현대", sales: 6900, prevSales: 7000, momAbs: -100, momPct: -1.4, rankChange: -1 },
  { month: "2025-11", nation: "domestic", rank: 10, prevRank: 10, modelName: "모하비", brandName: "기아", sales: 6700, prevSales: 6500, momAbs: 200, momPct: 3.1, rankChange: 0 },
];

const exportModels2025_12: Omit<RadarModel, "id" | "score" | "danawaUrl">[] = [
  { month: "2025-12", nation: "export", rank: 1, prevRank: 2, modelName: "E-Class", brandName: "벤츠", sales: 4200, prevSales: 3500, momAbs: 700, momPct: 20.0, rankChange: 1 },
  { month: "2025-12", nation: "export", rank: 2, prevRank: 1, modelName: "5시리즈", brandName: "BMW", sales: 3900, prevSales: 3800, momAbs: 100, momPct: 2.6, rankChange: -1 },
  { month: "2025-12", nation: "export", rank: 3, prevRank: 5, modelName: "Model Y", brandName: "테슬라", sales: 3600, prevSales: 2800, momAbs: 800, momPct: 28.6, rankChange: 2 },
  { month: "2025-12", nation: "export", rank: 4, prevRank: 3, modelName: "GLC", brandName: "벤츠", sales: 3400, prevSales: 3200, momAbs: 200, momPct: 6.3, rankChange: -1 },
  { month: "2025-12", nation: "export", rank: 5, prevRank: 4, modelName: "X5", brandName: "BMW", sales: 3100, prevSales: 3000, momAbs: 100, momPct: 3.3, rankChange: -1 },
  { month: "2025-12", nation: "export", rank: 6, prevRank: 8, modelName: "A6", brandName: "아우디", sales: 2900, prevSales: 2200, momAbs: 700, momPct: 31.8, rankChange: 2 },
  { month: "2025-12", nation: "export", rank: 7, prevRank: 6, modelName: "3시리즈", brandName: "BMW", sales: 2700, prevSales: 2600, momAbs: 100, momPct: 3.8, rankChange: -1 },
  { month: "2025-12", nation: "export", rank: 8, prevRank: 7, modelName: "C-Class", brandName: "벤츠", sales: 2500, prevSales: 2400, momAbs: 100, momPct: 4.2, rankChange: -1 },
  { month: "2025-12", nation: "export", rank: 9, prevRank: 12, modelName: "Q5", brandName: "아우디", sales: 2300, prevSales: 1700, momAbs: 600, momPct: 35.3, rankChange: 3 },
  { month: "2025-12", nation: "export", rank: 10, prevRank: 9, modelName: "Model 3", brandName: "테슬라", sales: 2100, prevSales: 2000, momAbs: 100, momPct: 5.0, rankChange: -1 },
  { month: "2025-12", nation: "export", rank: 11, prevRank: null, modelName: "EQE SUV", brandName: "벤츠", sales: 1900, prevSales: null, momAbs: 1900, momPct: 500.0, rankChange: 0 },
  { month: "2025-12", nation: "export", rank: 12, prevRank: 10, modelName: "XC60", brandName: "볼보", sales: 1800, prevSales: 1850, momAbs: -50, momPct: -2.7, rankChange: -2 },
  { month: "2025-12", nation: "export", rank: 13, prevRank: 15, modelName: "레인지로버", brandName: "랜드로버", sales: 1650, prevSales: 1300, momAbs: 350, momPct: 26.9, rankChange: 2 },
  { month: "2025-12", nation: "export", rank: 14, prevRank: 11, modelName: "A4", brandName: "아우디", sales: 1500, prevSales: 1750, momAbs: -250, momPct: -14.3, rankChange: -3 },
  { month: "2025-12", nation: "export", rank: 15, prevRank: 13, modelName: "X3", brandName: "BMW", sales: 1400, prevSales: 1500, momAbs: -100, momPct: -6.7, rankChange: -2 },
  { month: "2025-12", nation: "export", rank: 16, prevRank: 18, modelName: "Cayenne", brandName: "포르쉐", sales: 1250, prevSales: 950, momAbs: 300, momPct: 31.6, rankChange: 2 },
  { month: "2025-12", nation: "export", rank: 17, prevRank: 14, modelName: "S-Class", brandName: "벤츠", sales: 1100, prevSales: 1350, momAbs: -250, momPct: -18.5, rankChange: -3 },
  { month: "2025-12", nation: "export", rank: 18, prevRank: 16, modelName: "7시리즈", brandName: "BMW", sales: 980, prevSales: 1100, momAbs: -120, momPct: -10.9, rankChange: -2 },
  { month: "2025-12", nation: "export", rank: 19, prevRank: 17, modelName: "iX", brandName: "BMW", sales: 850, prevSales: 1000, momAbs: -150, momPct: -15.0, rankChange: -2 },
  { month: "2025-12", nation: "export", rank: 20, prevRank: 20, modelName: "Panamera", brandName: "포르쉐", sales: 780, prevSales: 720, momAbs: 60, momPct: 8.3, rankChange: 0 },
];

const exportModels2025_11: Omit<RadarModel, "id" | "score" | "danawaUrl">[] = [
  { month: "2025-11", nation: "export", rank: 1, prevRank: 1, modelName: "5시리즈", brandName: "BMW", sales: 3800, prevSales: 3700, momAbs: 100, momPct: 2.7, rankChange: 0 },
  { month: "2025-11", nation: "export", rank: 2, prevRank: 3, modelName: "E-Class", brandName: "벤츠", sales: 3500, prevSales: 3200, momAbs: 300, momPct: 9.4, rankChange: 1 },
  { month: "2025-11", nation: "export", rank: 3, prevRank: 2, modelName: "GLC", brandName: "벤츠", sales: 3200, prevSales: 3300, momAbs: -100, momPct: -3.0, rankChange: -1 },
  { month: "2025-11", nation: "export", rank: 4, prevRank: 4, modelName: "X5", brandName: "BMW", sales: 3000, prevSales: 2900, momAbs: 100, momPct: 3.4, rankChange: 0 },
  { month: "2025-11", nation: "export", rank: 5, prevRank: 6, modelName: "Model Y", brandName: "테슬라", sales: 2800, prevSales: 2500, momAbs: 300, momPct: 12.0, rankChange: 1 },
  { month: "2025-11", nation: "export", rank: 6, prevRank: 5, modelName: "3시리즈", brandName: "BMW", sales: 2600, prevSales: 2700, momAbs: -100, momPct: -3.7, rankChange: -1 },
  { month: "2025-11", nation: "export", rank: 7, prevRank: 7, modelName: "C-Class", brandName: "벤츠", sales: 2400, prevSales: 2350, momAbs: 50, momPct: 2.1, rankChange: 0 },
  { month: "2025-11", nation: "export", rank: 8, prevRank: 9, modelName: "A6", brandName: "아우디", sales: 2200, prevSales: 1900, momAbs: 300, momPct: 15.8, rankChange: 1 },
  { month: "2025-11", nation: "export", rank: 9, prevRank: 8, modelName: "Model 3", brandName: "테슬라", sales: 2000, prevSales: 2100, momAbs: -100, momPct: -4.8, rankChange: -1 },
  { month: "2025-11", nation: "export", rank: 10, prevRank: 10, modelName: "XC60", brandName: "볼보", sales: 1850, prevSales: 1800, momAbs: 50, momPct: 2.8, rankChange: 0 },
];

const allSampleData = [
  ...domesticModels2025_12,
  ...domesticModels2025_11,
  ...exportModels2025_12,
  ...exportModels2025_11,
];

export class MemStorage implements IStorage {
  private radarData: RadarModel[];
  private lastUpdated: string;

  constructor() {
    this.lastUpdated = new Date().toISOString();
    
    const dataWithScores: RadarModel[] = [];
    
    const groupedData: Record<string, Omit<RadarModel, "id" | "score" | "danawaUrl">[]> = {};
    for (const model of allSampleData) {
      const key = `${model.month}-${model.nation}`;
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(model);
    }
    
    for (const [, models] of Object.entries(groupedData)) {
      const cappedModels = models.map(m => ({
        ...m,
        momPct: Math.min(m.momPct, 500),
      }));
      
      for (const model of models) {
        const cappedMomPct = Math.min(model.momPct, 500);
        const score = calculateScore(model.momAbs, cappedMomPct, model.rankChange, cappedModels);
        
        dataWithScores.push({
          ...model,
          id: `${model.nation}-${model.month}-${model.rank}`,
          score,
          danawaUrl: generateDanawaUrl(model.nation, model.month),
        });
      }
    }
    
    this.radarData = dataWithScores;
  }

  async getAvailableMonths(): Promise<string[]> {
    const months = new Set<string>();
    for (const model of this.radarData) {
      months.add(model.month);
    }
    return Array.from(months).sort().reverse();
  }

  async getRadarData(query: RadarQuery): Promise<RadarResponse> {
    const availableMonths = await this.getAvailableMonths();
    const currentMonth = query.month || availableMonths[0] || "2025-12";
    const nation = query.nation || "domestic";
    const minSales = query.minSales || 0;
    const excludeNew = query.excludeNew || false;
    const limit = query.limit || 20;

    let filtered = this.radarData.filter(
      (m) => m.month === currentMonth && m.nation === nation
    );

    if (minSales > 0) {
      filtered = filtered.filter((m) => m.sales >= minSales);
    }

    if (excludeNew) {
      filtered = filtered.filter((m) => m.prevSales !== null && m.prevSales > 0);
    }

    filtered = filtered.filter((m) => m.momAbs > 0);
    
    filtered.sort((a, b) => b.score - a.score);
    
    const models = filtered.slice(0, limit);

    return {
      models,
      availableMonths,
      currentMonth,
      nation,
      totalCount: models.length,
      lastUpdated: this.lastUpdated,
    };
  }
}

export const storage = new MemStorage();
