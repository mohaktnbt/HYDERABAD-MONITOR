# TIMELINE.md — Hyderabad Monitor Session History

## Session Log

### Session 0 — Research & Planning (2026-03-30)
- **Platform:** Claude.ai (not Claude Code)
- **What happened:**
  - Deep research completed on WorldMonitor architecture (44.9K stars, vanilla TS, globe.gl + deck.gl, 60+ edge functions, 31+ APIs, 435+ RSS feeds)
  - Identified 200+ data sources across 18 categories for Hyderabad
  - Catalogued 90+ Kaggle datasets relevant to Hyderabad/Telangana/India
  - Mapped all WorldMonitor Pro/Enterprise features to Hyderabad equivalents
  - Created 3-tier cost estimates: MVP ($52/mo), Pro ($570-920/mo), Enterprise ($7,120/mo)
  - Identified novel data sources unique to Hyderabad: water tanker demand, 185-lake monitoring, mandi prices, GHMC grievance density, power outage frequency
  - Created CLAUDE.md (master prompt with full architecture, data sources, schema, project structure)
  - Created TODO-MANUAL.md (85 manual action items with priority ordering)
  - Created TIMELINE.md (this file)
- **Deliverables:** CLAUDE.md, TODO-MANUAL.md, TIMELINE.md, AGENTS.md
- **Next session:** Phase 1 build — init project, Docker stack, DB schema, first 3 panels

---

### Session 1 — [DATE TBD]
- **Platform:** Claude Code on VPS
- **Goal:** Phase 1 Foundation
- **Checklist:**
  - [ ] `git init` + connect to `mohaktnbt/hyderabad-monitor`
  - [ ] `npx create-next-app@latest` with TypeScript, Tailwind, App Router
  - [ ] Docker Compose: TimescaleDB 2.x + PostGIS, Redis 7, Meilisearch
  - [ ] Run database schema from CLAUDE.md
  - [ ] Load GHMC ward boundary GeoJSON into PostGIS
  - [ ] MapLibre dark base map + ward overlay
  - [ ] AQI panel: CPCB API → TimescaleDB → SSE → ECharts gauge + heatmap
  - [ ] Weather panel: Open-Meteo → card with 7-day forecast
  - [ ] News panel: RSS feeds → BullMQ parser → sentiment → ticker
  - [ ] 3-tier cache: in-memory → Redis → CDN headers
  - [ ] Dashboard layout: sidebar + responsive panel grid
  - [ ] PM2 ecosystem config
  - [ ] Basic `.env.example` with all variables documented
- **Blockers:** Need API keys from TODO-MANUAL.md Priority 1
- **Notes:** [fill after session]

---

### Session 2 — [DATE TBD]
- **Goal:** Phase 2 Transport & Finance
- **Notes:** [fill after session]

### Session 3 — [DATE TBD]
- **Goal:** Phase 3 Novel Data + Deep Features
- **Notes:** [fill after session]

### Session 4 — [DATE TBD]
- **Goal:** Phase 4 Satellite + Infrastructure
- **Notes:** [fill after session]
