# 다나와 자동차 판매실적 급상승 모델 레이더

## Overview
다나와 자동차 판매실적 데이터를 기반으로 급상승 모델을 레이더 형태로 시각화하는 대시보드 애플리케이션입니다.

## Project Architecture

### Frontend (client/)
- **React + TypeScript** with Vite
- **Tailwind CSS** for styling
- **TanStack Query** for data fetching
- **Wouter** for routing

### Backend (server/)
- **Express.js** API server
- **In-memory storage** for MVP (no database required)

### Key Features
1. **국산/수입 토글** - 국산차와 수입차 전환
2. **월별 선택** - 월별 데이터 조회
3. **급상승 모델 카드** - Top 20 급상승 모델 표시
   - 판매량, 전월대비 변화, 랭크 변화 표시
4. **필터 기능** - 최소 판매량, 신규 모델 제외 옵션
5. **다크모드** 지원

### Scoring Algorithm
급상승 점수는 다음 공식으로 계산:
```
score = 0.55 * z(momAbs) + 0.35 * z(momPct) + 0.10 * z(rankChange)
```
- `momAbs`: 전월대비 절대 변화량
- `momPct`: 전월대비 변화율 (상한 500%로 캡)
- `rankChange`: 랭크 변화
- `z()`: 표준화 함수 (평균 0, 표준편차 1)

## API Endpoints

### GET /api/radar
급상승 모델 데이터 조회

**Query Parameters:**
- `month`: YYYY-MM 형식 (기본값: 최신 월)
- `nation`: "domestic" | "export" (기본값: domestic)
- `minSales`: 최소 판매량 필터 (기본값: 0)
- `excludeNew`: true/false (신규 모델 제외, 기본값: false)
- `limit`: 결과 개수 제한 (기본값: 20)

**Response:**
```json
{
  "models": [...],
  "availableMonths": ["2025-12", "2025-11"],
  "currentMonth": "2025-12",
  "nation": "domestic",
  "totalCount": 9,
  "lastUpdated": "2026-01-16T01:44:19.800Z"
}
```

## File Structure
```
client/
├── src/
│   ├── components/
│   │   ├── header.tsx
│   │   ├── filter-panel.tsx
│   │   ├── model-card.tsx
│   │   ├── model-card-skeleton.tsx
│   │   ├── empty-state.tsx
│   │   ├── month-selector.tsx
│   │   ├── nation-toggle.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── pages/
│   │   └── home.tsx
│   └── App.tsx
server/
├── routes.ts
└── storage.ts
shared/
└── schema.ts
```

## Development

### Running the Application
```bash
npm run dev
```

### Port
- Frontend and Backend both run on port 5000

## Design Guidelines
- Material Design 3 기반
- 한국어 폰트: Noto Sans KR
- 숫자 폰트: Roboto Mono
- 반응형 레이아웃 (1, 2, 3 컬럼 그리드)
