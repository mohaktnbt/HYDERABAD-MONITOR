# AGENTS.md — ClawTeam Parallel Agent Configuration for Hyderabad Monitor

## Agent Definitions for Phase 1 Parallel Build

Use with: `clawteam --agents-file AGENTS.md`

---

### Agent 1: INFRA (Infrastructure & Database)

**Role:** Set up the entire backend infrastructure stack.

**Tasks:**
1. Create `docker-compose.yml` with:
   - TimescaleDB 2.x (PostgreSQL 16 + TimescaleDB + PostGIS extensions)
   - Redis 7 (for cache + BullMQ job queue)
   - Meilisearch (for news search)
   - Volumes for persistent data
   - Health checks for all services
   - Network: `hydmon-network`
2. Create `scripts/setup-timescaledb.ts` that runs the FULL database schema from CLAUDE.md (all hypertables, continuous aggregates, retention policies, GIS tables)
3. Create `prisma/schema.prisma` with TimescaleDB-compatible models
4. Create `.env.example` with ALL environment variables documented
5. Create `scripts/seed-wards.ts` to load GHMC ward boundary GeoJSON into PostGIS `ward_boundaries` table
6. Create `scripts/seed-stations.ts` to load AQI station metadata (14 Hyderabad CAAQM stations with lat/lng)
7. Create `scripts/seed-companies.ts` to load 166 Hyderabad company tickers into a reference table
8. Create `scripts/test-apis.ts` to test connectivity to all free API endpoints

**Files to create:**
```
docker-compose.yml
.env.example
prisma/schema.prisma
scripts/setup-timescaledb.ts
scripts/seed-wards.ts
scripts/seed-stations.ts
scripts/seed-companies.ts
scripts/test-apis.ts
data/static/companies.json
data/static/aqi-stations.json
```

**Dependencies:** None (runs first)

---

### Agent 2: FRONTEND (Next.js App Shell + Map)

**Role:** Create the Next.js project and build the dashboard shell with MapLibre.

**Tasks:**
1. Initialize Next.js 15 with TypeScript, Tailwind 4, App Router:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
   ```
2. Install core dependencies:
   ```bash
   npm install maplibre-gl @deck.gl/core @deck.gl/layers echarts echarts-for-react zustand bullmq ioredis @tanstack/react-query
   npm install -D @types/maplibre-gl
   ```
3. Install shadcn/ui:
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add card badge button tabs separator scroll-area sheet tooltip
   ```
4. Configure dark theme in `tailwind.config.ts` with Hyderabad color palette:
   - Background: `#0A0A0A` (primary), `#1A1A2E` (surface)
   - Accent: `#E8A87C` (Charminar warm), `#10B981` (data green), `#EF4444` (alert red)
5. Create layout components:
   - `src/components/layout/Sidebar.tsx` — collapsible panel navigation with icons for each category
   - `src/components/layout/TopBar.tsx` — "HYDERABAD MONITOR" branding, clock (IST), last-updated timestamps, alert badge count
   - `src/components/layout/PanelGrid.tsx` — responsive CSS grid (1 col mobile, 2 tablet, 3-4 desktop)
6. Create `src/app/layout.tsx` with dark theme, sidebar, Inter/JetBrains Mono fonts
7. Create `src/app/page.tsx` as the main dashboard with panel grid
8. Create `src/components/map/HydMap.tsx`:
   - MapLibre GL JS instance centered on Hyderabad (17.385, 78.487, zoom 11)
   - Dark base style: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`
   - Load GHMC ward boundaries as a GeoJSON fill layer with subtle borders
   - Layer toggle control in top-right
   - Click-on-ward to see ward name + zone
9. Create `src/components/charts/TimeSeriesChart.tsx` — ECharts wrapper for time-series
10. Create `src/components/charts/GaugeChart.tsx` — ECharts gauge for AQI display
11. Create `src/components/charts/SparklineChart.tsx` — tiny inline sparklines

**Files to create:**
```
src/app/layout.tsx
src/app/page.tsx
src/components/layout/Sidebar.tsx
src/components/layout/TopBar.tsx
src/components/layout/PanelGrid.tsx
src/components/map/HydMap.tsx
src/components/charts/TimeSeriesChart.tsx
src/components/charts/GaugeChart.tsx
src/components/charts/SparklineChart.tsx
src/lib/cache.ts
src/lib/redis.ts
src/lib/db.ts
src/config/constants.ts
src/config/stations.ts
src/config/companies.ts
src/config/wards.ts
src/types/index.ts
tailwind.config.ts (modify)
```

**Dependencies:** Waits for Agent 1 to complete `docker-compose.yml`

---

### Agent 3: DATA-SERVICES (API Connectors + Workers)

**Role:** Build all data fetcher services and BullMQ worker jobs.

**Tasks:**
1. Create `src/lib/sse.ts` — Server-Sent Events manager:
   - Maintains active client connections
   - Broadcasts data updates to connected dashboard clients
   - Heartbeat every 30s to keep connections alive
2. Create `src/services/aqi.service.ts`:
   - Fetch from CPCB API (data.gov.in) with `filters[city]=Hyderabad`
   - Fallback to WAQI API
   - Parse response → typed AQI reading → insert into TimescaleDB
   - Check L2 Redis cache before fetching
3. Create `src/services/weather.service.ts`:
   - Primary: Open-Meteo (no key needed!)
   - Fallback: OpenWeatherMap
   - Parse hourly forecast + current conditions
4. Create `src/services/news.service.ts`:
   - Fetch 6 RSS feeds (Deccan Chronicle, Telangana Today, The Hindu HYD, TOI HYD, Google News, GDELT)
   - Parse with `rss-parser` npm package
   - Deduplicate by URL
   - Basic sentiment scoring with `sentiment` npm package
   - Store in TimescaleDB + index in Meilisearch
5. Create `src/services/traffic.service.ts`:
   - TomTom Traffic Flow API for key Hyderabad corridors
   - Parse speed vs freeflow speed → congestion percentage
6. Create `src/services/stocks.service.ts`:
   - For Phase 2: placeholder that reads from Python sidecar
   - Static watchlist of top 20 Hyderabad companies
7. Create `src/services/flights.service.ts`:
   - OpenSky Network state vectors for Hyderabad bounding box
   - Parse aircraft positions → GeoJSON feature collection
8. Create `src/services/mandi.service.ts`:
   - Agmarknet via data.gov.in API
   - Filter for Bowenpally, Erragadda, Gudimalkapur markets
9. Create `src/workers/scheduler.ts`:
   - Master BullMQ scheduler defining ALL repeatable jobs
   - Uses polling intervals from CLAUDE.md
   - Night mode: reduce frequency 2-6 AM IST
10. Create individual workers: `aqi.worker.ts`, `weather.worker.ts`, `news.worker.ts`, `traffic.worker.ts`, `flights.worker.ts`, `mandi.worker.ts`
11. Create `src/workers/alerts.worker.ts`:
   - Threshold-based alerting (AQI > 200, temperature > 45°C, etc.)
   - Dispatch to Telegram Bot API

**Files to create:**
```
src/lib/sse.ts
src/lib/ai.ts
src/services/aqi.service.ts
src/services/weather.service.ts
src/services/news.service.ts
src/services/traffic.service.ts
src/services/stocks.service.ts
src/services/flights.service.ts
src/services/mandi.service.ts
src/services/water.service.ts
src/services/health.service.ts
src/services/realestate.service.ts
src/workers/scheduler.ts
src/workers/aqi.worker.ts
src/workers/weather.worker.ts
src/workers/news.worker.ts
src/workers/traffic.worker.ts
src/workers/flights.worker.ts
src/workers/mandi.worker.ts
src/workers/alerts.worker.ts
```

**Dependencies:** Waits for Agent 1 to complete DB schema

---

### Agent 4: PANELS (Dashboard Panel Components)

**Role:** Build all visual dashboard panel components.

**Tasks:**
1. Create `src/components/panels/AQIPanel.tsx`:
   - ECharts gauge showing overall Hyderabad AQI
   - Station-wise mini cards (14 stations)
   - Color-coded: Good (green), Moderate (yellow), Unhealthy (orange), Hazardous (red)
   - 24-hour trend sparkline
   - Pollutant breakdown bars (PM2.5, PM10, NO₂, SO₂, CO, O₃)
2. Create `src/components/panels/WeatherPanel.tsx`:
   - Current temperature (large number), condition icon
   - Humidity, wind speed, UV index mini stats
   - 7-day forecast row with high/low temps
   - Sunrise/sunset times
3. Create `src/components/panels/NewsPanel.tsx`:
   - Scrolling news ticker at top
   - News card list (title, source badge, time ago, sentiment dot)
   - Source filter tabs (All, Deccan Chronicle, Telangana Today, etc.)
   - Category filter
4. Create `src/components/panels/TrafficPanel.tsx`:
   - MapLibre mini-map with traffic congestion layer
   - Top 10 congested corridors list
   - Average city congestion percentage gauge
5. Create `src/components/panels/FlightsPanel.tsx`:
   - MapLibre mini-map with aircraft icons
   - Live flight count badge
   - Arrivals/departures table for RGIA
6. Create `src/components/panels/StockPanel.tsx`:
   - Horizontal scrolling ticker tape
   - Sector heatmap (Pharma, IT, Defense, Mining, Healthcare, Consumer)
   - Top gainers / losers cards
7. Create `src/components/panels/MandiPanel.tsx`:
   - Commodity price cards (Tomato, Onion, Rice, Wheat, etc.)
   - 30-day price sparklines
   - Price change badges (↑ ↓)
8. Create `src/components/panels/WaterPanel.tsx`:
   - Lake health cards (Hussain Sagar, Osmansagar, Himayatsagar)
   - Water tanker demand bar chart by zone
   - BOD/COD/coliform gauges
9. Create `src/components/panels/HealthPanel.tsx`:
   - Blood bank availability checker (group selector → available units)
   - Disease alert cards
   - Noise level gauge
10. Create `src/components/panels/EconomyPanel.tsx`:
    - Key indicators: RBI repo rate, INR/USD, Telangana GSDP, UPI volume
    - New company registrations trend
    - FDI inflow chart
11. Create `src/components/panels/RealEstatePanel.tsx`:
    - Locality-level price heatmap on MapLibre
    - Top 10 localities by price appreciation table
    - Average ₹/sqft trend chart
12. Create `src/components/panels/SocialPanel.tsx`:
    - Reddit r/hyderabad hot posts
    - Google Trends widget
    - Sentiment trend chart
13. Create `src/app/api/sse/route.ts` — SSE endpoint for real-time push to all panels
14. Create individual API routes: `src/app/api/aqi/route.ts`, `weather/route.ts`, `traffic/route.ts`, `stocks/route.ts`, `news/route.ts`, `metro/route.ts`, `flights/route.ts`, `mandi/route.ts`, `health/route.ts`

**Files to create:**
```
src/components/panels/AQIPanel.tsx
src/components/panels/WeatherPanel.tsx
src/components/panels/NewsPanel.tsx
src/components/panels/TrafficPanel.tsx
src/components/panels/FlightsPanel.tsx
src/components/panels/StockPanel.tsx
src/components/panels/MandiPanel.tsx
src/components/panels/WaterPanel.tsx
src/components/panels/HealthPanel.tsx
src/components/panels/EconomyPanel.tsx
src/components/panels/RealEstatePanel.tsx
src/components/panels/SocialPanel.tsx
src/components/panels/SatellitePanel.tsx
src/app/api/sse/route.ts
src/app/api/aqi/route.ts
src/app/api/weather/route.ts
src/app/api/traffic/route.ts
src/app/api/stocks/route.ts
src/app/api/news/route.ts
src/app/api/flights/route.ts
src/app/api/mandi/route.ts
src/app/api/health/route.ts
```

**Dependencies:** Waits for Agent 2 (component library) and Agent 3 (API routes)

---

## Execution Order

```
┌─────────┐
│ Agent 1  │ ── INFRA (Docker, DB, seeds)
│ (first)  │
└────┬─────┘
     │
     ├──────────────────┐
     │                  │
┌────▼─────┐     ┌─────▼────┐
│ Agent 2  │     │ Agent 3  │
│ FRONTEND │     │ DATA-SVC │
│ (shell)  │     │ (APIs)   │
└────┬─────┘     └─────┬────┘
     │                  │
     └──────┬───────────┘
            │
      ┌─────▼────┐
      │ Agent 4  │
      │ PANELS   │
      │ (UI)     │
      └──────────┘
```

Agent 1 runs first. Agents 2 and 3 run in parallel after Agent 1 completes. Agent 4 runs after both 2 and 3 are done.

---

## Quality Gates

Before marking any agent as complete:
1. `npm run build` must pass with zero errors
2. `npm run lint` must pass
3. Docker Compose `docker compose up -d` must start all services
4. Each API endpoint must return valid JSON when tested with `curl`
5. MapLibre map must render with ward boundaries visible
6. At least 1 panel must show real data from a live API
