# Design Guidelines: Danawa Automotive Sales Radar Dashboard

## Design Approach

**Selected System**: Material Design 3  
**Rationale**: Data-heavy dashboard requiring clear hierarchy, excellent Korean typography support, and robust component patterns for filters, cards, and data visualization.

**Key Principles**:
- Data clarity above all - information should be scannable at a glance
- Minimal cognitive load - predictable patterns, clear affordances
- Mobile-first data consumption - professionals checking trends on-the-go

---

## Typography

**Font Stack**:
- Primary: `'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- Monospace (for numbers): `'Roboto Mono', 'SF Mono', Consolas, monospace`

**Hierarchy**:
- Page Title: `text-3xl font-bold` (급상승 모델 레이더)
- Section Headers: `text-xl font-semibold`
- Card Model Names: `text-lg font-medium`
- Data Labels: `text-sm font-medium uppercase tracking-wide`
- Metric Values: `text-2xl font-bold` (numbers in monospace)
- Body/Supporting Text: `text-base`
- Captions/Metadata: `text-sm opacity-70`

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: `p-4` to `p-6`
- Section margins: `mb-8` to `mb-12`
- Card gaps: `gap-4`
- Inline spacing: `space-x-2` to `space-x-4`

**Container Strategy**:
- Max width: `max-w-7xl mx-auto`
- Horizontal padding: `px-4 lg:px-8`
- Vertical sections: `py-8` to `py-12`

**Grid Patterns**:
- Desktop cards: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`
- Filters row: `flex flex-wrap gap-4`

---

## Component Library

### 1. Header/Navigation
- Sticky top bar with app title, month selector dropdown, update timestamp
- "국산/수입" toggle switch (Material Design segmented button style)
- Clean horizontal layout: `flex items-center justify-between py-4`

### 2. Filter Panel
- Horizontal filter bar below header with rounded containers
- Month dropdown (primary), Min Sales slider, "신규 제외" checkbox
- Each filter in elevated card with `rounded-lg p-4`
- Results count badge: "20개 모델 표시"

### 3. Model Cards (Primary Component)
**Structure** (elevated card, `rounded-lg shadow-md hover:shadow-lg transition-shadow`):
- **Header**: Rank badge + Model name (bold, larger)
- **Primary Metric**: Current sales volume (extra large, monospace)
- **Delta Grid** (2 columns):
  - Left: "전월대비" with absolute change (+대수) and percentage
  - Right: "랭크 변화" with arrow icon and position change
- **Footer**: "다나와 원문 보기" outlined button (full-width)

**Metrics Display Pattern**:
- Use icon + label + value rows
- Positive changes: upward arrow icon
- Negative changes: downward arrow icon
- Icons from Material Symbols (via CDN)

### 4. Empty/Loading States
- Skeleton cards matching real card dimensions during load
- Empty state: Icon + "필터 조건에 맞는 모델이 없습니다" message

### 5. Data Badges
- Rank position: Circle badge with number
- Trend indicators: Chip-style badges (rounded-full with icons)

---

## Responsive Behavior

**Mobile** (<768px):
- Single column card layout
- Stacked filters (each full-width)
- Compact metric display (vertical stack)
- Bottom-aligned "원문 보기" buttons

**Tablet** (768-1024px):
- 2-column card grid
- Horizontal filter bar with wrapping

**Desktop** (>1024px):
- 3-column card grid
- All filters in single row
- Larger metric typography

---

## Interactive Elements

**Buttons**:
- Primary: Filled style with elevation on hover
- Secondary: Outlined style for "원문 보기" links
- Icon buttons: Round with icon-only (filter toggles)
- States: Clear hover elevation, pressed scale-down

**Inputs**:
- Dropdowns: Material outlined select with floating label
- Slider: Track with thumb, value label on drag
- Checkbox: Material checkbox with label

**Cards**:
- Hover: Subtle elevation increase (`shadow-md` → `shadow-lg`)
- No click state (buttons provide interaction)

---

## Icons

**Library**: Material Symbols via CDN (outlined variant)
- Trend up: `trending_up`
- Trend down: `trending_down`
- Filter: `filter_list`
- Calendar: `calendar_month`
- External link: `open_in_new`
- Info: `info`

---

## Data Visualization

**Number Formatting**:
- Sales volume: Comma-separated (e.g., "3,450대")
- Percentages: One decimal (e.g., "+24.5%")
- Rank changes: Signed integer (e.g., "↑5")

**Visual Hierarchy**:
- Current month sales: Largest, boldest (primary focus)
- MoM change: Secondary emphasis with icons
- Rank change: Tertiary with smaller typography

---

## Accessibility

- All interactive elements min `44x44px` touch targets
- Form labels associated with inputs
- Icon-only buttons include `aria-label`
- Focus indicators on all interactive elements
- Korean text line-height: `1.6` for readability

---

## Images

**Not Required**: This is a pure data dashboard. No hero images or decorative photography needed. Focus on clean, functional UI with data as the hero.