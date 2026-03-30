# CLAUDE.md — Hyderabad Monitor: City Intelligence Dashboard

## Project Identity

**Name:** Hyderabad Monitor (hydmonitor)
**Tagline:** Real-time city intelligence for Hyderabad, India
**Repo:** `mohaktnbt/hyderabad-monitor`
**Inspiration:** [WorldMonitor](https://github.com/koala73/worldmonitor) (44.9K stars, vanilla TS, globe.gl + deck.gl + MapLibre)
**Benchmark:** [worldmonitor.app](https://www.worldmonitor.app) — we match its data density but go DEEP on one city instead of wide across the globe
**Hosting:** Hostinger VPS (IP: 168.231.103.49, user: mohak) — tmux sessions, `printf '\e[?2004l'` to disable bracketed paste mode

---

## Architecture & Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, TypeScript, SSR for SEO + ISR for dashboards)
- **Map Engine:** MapLibre GL JS (free, no vendor lock-in) + deck.gl for GPU-accelerated overlays
- **Charts:** Apache ECharts (MIT, performant with 50+ chart types)
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **State:** Zustand (lightweight, no boilerplate)
- **Real-time:** Server-Sent Events (SSE) via Next.js API routes for live data push
- **Custom Viz:** D3.js for bespoke visualizations (Musi River pollution timeline, lake health gauges)

### Backend
- **API Layer:** Next.js API routes (start simple) → migrate to NestJS microservices at scale
- **Job Queue:** BullMQ (Redis-backed) for scheduled API polling, data transformation, alert dispatch
- **Event Streaming:** Redis Streams (MVP) → Kafka/Redpanda (scale)
- **AI:** Claude Haiku 4.5 for daily city briefs, anomaly descriptions, alert summaries

### Databases
- **Primary:** TimescaleDB (PostgreSQL + hypertables for time-series) with PostGIS for geospatial
- **Cache:** Redis (Upstash free tier → dedicated at scale) with TTLs per data type
- **Search:** Meilisearch for news article full-text search (self-hosted, lightweight)

### Infrastructure
- **Hosting:** Hostinger VPS (Ubuntu 24) → E2E Networks Mumbai for production
- **CDN:** Cloudflare (free tier → Pro)
- **Process Manager:** PM2 with ecosystem.config.js
- **Containers:** Docker Compose for local dev + production deployment
- **CI/CD:** GitHub Actions → SSH deploy to VPS

---

## Data Sources Master Registry

Every data source below has been researched and verified. Sources marked [FREE] have no cost. Sources marked [PAID] require subscription. Sources marked [SCRAPE] need web scraping.

### 1. AIR QUALITY (Panel: AQI Monitor)

| Source | Endpoint | Refresh | Cost | Notes |
|--------|----------|---------|------|-------|
| CPCB via data.gov.in | `https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key={KEY}&format=json&filters[city]=Hyderabad` | Hourly | [FREE] | 14 stations: ICRISAT, Central University, Zoo Park, Sanathnagar, Bollaram, ECIL Kapra, Kokapet, New Malakpet + 6 more. Returns PM2.5, PM10, NO2, SO2, CO, O3, NH3 |
| WAQI/AQICN | `https://api.waqi.info/feed/hyderabad/?token={TOKEN}` | 30 min | [FREE] | 1000 req/sec limit. Backup source |
| OpenAQ v3 | `https://api.openaq.org/v3/locations?city=Hyderabad&country=IN` | Hourly | [FREE] | 90 days history. Mirrors CPCB |
| TSPCB | `https://tspcb.cgg.gov.in/Pages/Envdata.aspx` | Daily | [SCRAPE] | 14 CAAQM + 14 manual stations. Downloadable CSV/XLS |
| Sentinel-5P TROPOMI | Google Earth Engine `COPERNICUS/S5P/OFFL/L3_NO2` | Daily | [FREE] | Columnar NO2, SO2, PM2.5, aerosol. 3.5×5.5km resolution |

**Implementation:** Poll CPCB API every 30 minutes. Store in TimescaleDB hypertable `aqi_readings(time, station_id, pm25, pm10, no2, so2, co, o3, nh3, aqi)`. Create continuous aggregate for hourly/daily averages. Display as ward-level heatmap on MapLibre with interpolation.

### 2. WEATHER & CLIMATE (Panel: Weather Station)

| Source | Endpoint | Refresh | Cost | Notes |
|--------|----------|---------|------|-------|
| Open-Meteo | `https://api.open-meteo.com/v1/forecast?latitude=17.385&longitude=78.4867&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=Asia/Kolkata` | 15 min | [FREE] | No API key needed! 80+ years historical. 16-day forecast |
| IMD | `https://mausam.imd.gov.in/imd_latest/contents/api.pdf` (10 endpoints) | Varies | [FREE] | Requires IP whitelisting. 7-day city forecast, rainfall, AWS data |
| Telangana DPS | `https://tgdps.telangana.gov.in/GHMC_forecast_maps.html` | Daily | [FREE/SCRAPE] | GHMC-area rainfall maps, automatic weather stations |
| OpenWeatherMap | `https://api.openweathermap.org/data/2.5/weather?q=Hyderabad,IN&appid={KEY}` | 10 min | [FREE] | 1000 calls/day free tier |
| WeatherAPI.com | `https://api.weatherapi.com/v1/current.json?key={KEY}&q=Hyderabad` | 15 min | [FREE] | 1M calls/month free |

**Implementation:** Open-Meteo as primary (no key needed!). OpenWeatherMap as fallback. Store in `weather_readings(time, source, temp, humidity, precipitation, wind_speed, wind_dir, pressure, visibility, uv_index)`. Continuous aggregate for daily min/max/avg.

### 3. WATER RESOURCES (Panel: Water Monitor)

| Source | Data | Refresh | Cost | Notes |
|--------|------|---------|------|-------|
| TSPCB Lake Data | 185 GHMC lakes: pH, DO, BOD, COD, TDS, coliform, heavy metals | Monthly | [SCRAPE] | `tspcb.cgg.gov.in/Pages/Envdata.aspx` — Hussain Sagar data since 2001 |
| India-WRIS | Groundwater levels, surface water quality | 6-hourly telemetric | [FREE] | `indiawris.gov.in/wris/#/groundWater` — 25,000 monitoring stations |
| CGWB Telangana | Mandal-wise groundwater reports | Quarterly | [SCRAPE] | `gwrms.telangana.gov.in` — 621 mandals |
| HMWSSB Tanker Tracking | Water tanker delivery counts | Real-time | [SCRAPE] | `tanker.hyderabadwater.gov.in/TANKERTRACKING` — scrape delivery counter |
| CHIRPS Rainfall | 0.05° resolution daily rainfall | Daily | [FREE] | Google Earth Engine `UCSB-CHG/CHIRPS/DAILY` — since 1981 |
| CWC Flood Forecast | River flood forecasting | Real-time | [FREE] | `ffs.cwa.gov.in` — Musi River basin |

**Implementation:** Monthly TSPCB scrape into `lake_readings(time, lake_id, ph, do, bod, cod, tds, coliform)`. HMWSSB tanker scrape every hour into `tanker_demand(time, zone, deliveries)`. Show as lake health cards with sparklines + tanker demand heatmap.

### 4. TRANSPORT & TRAFFIC (Panel: Mobility Hub)

| Source | Endpoint | Refresh | Cost | Notes |
|--------|----------|---------|------|-------|
| HMRL Metro GTFS | `https://data.telangana.gov.in/dataset/gtfs-hmrl-hyderabad` | Static schedule | [FREE] | 57 stations, 69km network. Also at `hmrl.co.in/open-data/` |
| TGSRTC Bus (Gamyam) | `Undocumented API — github.com/iotakodali/hyd-bus-data` | Real-time | [FREE] | No auth needed. JSON ETAs by stop_id for 1,500+ stops, 600+ GPS buses |
| TomTom Traffic | `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=17.385,78.4867&key={KEY}` | 2 min | [FREE] | 50,000 tile requests/day + 2,500 non-tile/day free |
| HERE Traffic | `https://data.traffic.hereapi.com/v7/flow?in=circle:17.385,78.4867;r=10000&apiKey={KEY}` | 2 min | [FREE] | 250,000 free transactions/month |
| Google Maps Platform | Routes API + Traffic Layer | 2 min | [PAID] | India pricing ~₹4-5/1K requests. 10K free events/month |
| Cyberabad Traffic Pulse | `cyberabadtrafficpulse.telangana.gov.in` | Real-time | [FREE/SCRAPE] | IT corridor traffic data |
| OpenSky Network | `https://opensky-network.org/api/states/all?lamin=17.2&lomin=78.2&lamax=17.6&lomax=78.7` | 5 sec | [FREE] | ADS-B flight tracking over RGIA. 4000 credits/day (registered) |
| AviationStack | `https://api.aviationstack.com/v1/flights?access_key={KEY}&dep_iata=HYD` | 30 min | [FREE] | 100 calls/month free. RGIA departures/arrivals |
| OpenStreetMap Roads | Overpass API with Hyderabad bbox | Weekly | [FREE] | Full road network for routing analysis |
| TomTom Traffic Index | `trafficindex.org/hyderabad/` | Daily | [SCRAPE] | Hyderabad ranks 13th globally for congestion |

**Implementation:** Metro GTFS → parse with `gtfs-realtime-bindings` into `metro_schedule`. Bus ETAs poll every 60s → `bus_positions(time, route_id, stop_id, eta)`. TomTom flow as traffic heatmap overlay on MapLibre. OpenSky poll every 60s for live flights over Hyderabad. Show as multi-tab panel: Metro | Bus | Traffic | Flights.

### 5. FINANCIAL MARKETS (Panel: Hyderabad Equity Tracker)

| Source | Endpoint/Method | Refresh | Cost | Notes |
|--------|-----------------|---------|------|-------|
| yfinance (Python) | `yf.Ticker("DIVISLAB.NS")` | 1 min (market hours) | [FREE] | All 166 Hyderabad-HQ companies. Suffix: `.NS` (NSE), `.BO` (BSE) |
| jugaad-data (Python) | `pip install jugaad-data` | 1 min | [FREE] | Best India-specific library. NSE, BSE, option chains, RBI data, BhavCopy |
| stock-nse-india (npm) | `github.com/hi-imcodeman/stock-nse-india` | Real-time | [FREE] | REST + GraphQL, built-in rate limiting |
| Angel One SmartAPI | WebSocket streaming | Real-time tick | [FREE] | Requires demat account. Full NSE/BSE streaming |
| Alpha Vantage | `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=NSE:DRREDDY&apikey={KEY}` | 1 min | [FREE] | 25 calls/day free. Indian data unreliable |
| NSE Official | `nseindia.com` (requires browser-like headers) | Varies | [FREE/SCRAPE] | BhavCopy, indices, corporate actions |

**Key Hyderabad Companies to Track (166 total, top 20 by market cap):**
```
DIVISLAB.NS   — Divi's Laboratories (₹1.59L Cr)
DRREDDY.NS    — Dr. Reddy's Labs (₹1.07L Cr)
NMDC.NS       — NMDC Limited (₹67.9K Cr)
AUROPHARMA.NS — Aurobindo Pharma (₹76.3K Cr)
BDL.NS        — Bharat Dynamics (₹41.7K Cr)
LAURUS.NS     — Laurus Labs
GRANULES.NS   — Granules India
KIMS.NS       — KIMS Hospitals
CYIENT.NS     — Cyient Ltd
KFINTECH.NS   — KFin Technologies
HAPPSTMNDS.NS — Happiest Minds
RAIN.NS       — Rain Industries
GRINFRA.NS    — GR Infraprojects
NATCOPHARM.NS — Natco Pharma
SUVEN.NS      — Suven Pharma
EIHOTEL.NS    — EIH Ltd (Oberoi Hotels)
SHILPAMED.NS  — Shilpa Medicare
NSLNISP.NS    — NACL Industries
NEULANDLAB.NS — Neuland Labs
MSUMI.NS      — Motherson Sumi (Hyderabad ops)
```

**Implementation:** Use `jugaad-data` Python service running as a FastAPI sidecar. Poll top 20 every 1 min during 9:15-15:30 IST, rest every 5 min. Store in `stock_prices(time, symbol, open, high, low, close, volume, vwap)`. Display as ticker tape + mini-charts + sector heatmap (pharma, IT, defense, mining).

### 6. REAL ESTATE (Panel: Property Pulse)

| Source | Data | Refresh | Cost | Notes |
|--------|------|---------|------|-------|
| NHB RESIDEX | Quarterly housing price index for Hyderabad | Quarterly | [FREE] | `residex.nhbonline.org.in` — official India housing index |
| RBI Housing Price Index | City-wise quarterly prices | Quarterly | [FREE] | via DBIE `data.rbi.org.in` |
| IGRS Telangana | Property registrations, circle rates | Daily | [SCRAPE] | `registration.telangana.gov.in` — records since 1983 |
| 99acres | Property listings by locality | Daily | [SCRAPE] | Apify scraper: `apify.com/easyapi/99acres-com-scraper` |
| MagicBricks | Property listings | Daily | [SCRAPE] | Multiple GitHub scrapers available |
| NoBroker | Rental listings | Daily | [SCRAPE] | Kaggle dataset available for initial seed |
| RERA Telangana | Registered real estate projects | Weekly | [SCRAPE] | `rera.telangana.gov.in` — active project tracking |

**Implementation:** Quarterly index updates from NHB/RBI stored manually. Daily scrape of top 50 localities from 99acres → `property_listings(time, locality, type, bhk, area_sqft, price, price_per_sqft, source)`. Aggregate into locality-level median price trends. Display as locality heatmap + price trend charts.

### 7. ECONOMY & GOVERNANCE (Panel: Economy Dashboard)

| Source | Data | Refresh | Cost | Notes |
|--------|------|---------|------|-------|
| RBI DBIE | Interest rates, CPI, WPI, forex reserves, exchange rates | Varies | [FREE] | `data.rbi.org.in` — 11,000+ time series. No REST API — download/scrape |
| jugaad-data RBI | Current RBI rates | Daily | [FREE] | Python: `from jugaad_data.rbi import rbi` |
| Frankfurter API | INR exchange rates | Daily | [FREE] | `api.frankfurter.dev/latest?from=USD&to=INR` — no API key needed |
| Telangana GSDP | State GDP data | Annual | [FREE] | `ecostat.telangana.gov.in` — FY26BE: ₹18.0 trillion |
| NPCI UPI Stats | UPI transaction volumes | Monthly | [FREE] | `npci.org.in/product/upi/product-statistics` |
| data.gov.in MSME | Udyam registration data by district | Monthly | [FREE] | `data.gov.in/catalog/udyam-registration-msme-registration` |
| MCA Company Data | New company registrations (Telangana RoC) | Monthly | [FREE] | data.gov.in Company Master Data API |
| Telangana e-Procurement | Government tender data | Daily | [SCRAPE] | `tender.telangana.gov.in` — ₹63,922 Cr processed FY24 |
| GHMC Property Tax | Collection rates by zone | Monthly | [SCRAPE] | GHMC tax portal |
| Telangana Budget | State budget allocations | Annual | [FREE] | `finance.telangana.gov.in` |

**Implementation:** Daily RBI rate fetch, monthly GSDP/UPI aggregation, quarterly macro indicators. Store in `economic_indicators(time, indicator_name, value, unit, source)`. Display as economy-at-a-glance panel with key metrics cards.

### 8. AGRICULTURE & COMMODITY PRICES (Panel: Mandi Monitor)

| Source | Endpoint | Refresh | Cost | Notes |
|--------|----------|---------|------|-------|
| Agmarknet via data.gov.in | `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={KEY}&format=json&filters[market]=Bowenpally` | Daily | [FREE] | Hyderabad mandis: Bowenpally, Erragadda, Gudimalkapur. 300+ commodities. Min/max/modal prices |
| eNAM | `enam.gov.in` | Daily | [SCRAPE] | 57 Telangana mandis, 1.77 crore farmers. Real-time arrivals |
| GoldAPI.io | `https://www.goldapi.io/api/XAU/INR` | 15 min | [FREE] | 300 requests/month free. Gold price in INR |
| IOCL Fuel Prices | `iocl.com/PetrolDieselPrice` | Daily | [SCRAPE] | Hyderabad petrol/diesel prices updated daily at 6 AM |

**Implementation:** Agmarknet daily poll at 8 PM IST (after mandi closing). Store in `mandi_prices(time, market, commodity, variety, min_price, max_price, modal_price, unit)`. Gold + fuel prices daily. Display as commodity price cards with 30-day sparklines + food inflation tracker.

### 9. NEWS & SOCIAL MEDIA (Panel: City Pulse)

| Source | Endpoint | Refresh | Cost | Notes |
|--------|----------|---------|------|-------|
| GDELT DOC API | `https://api.gdeltproject.org/api/v2/doc/doc?query=Hyderabad&mode=artlist&format=json&maxrecords=50&sort=DateDesc` | 15 min | [FREE] | Unlimited. Sentiment, tone, volume timelines. 100+ languages |
| Deccan Chronicle RSS | `https://www.deccanchronicle.com/rss_feed/` | 15 min | [FREE] | Primary Hyderabad newspaper |
| Telangana Today RSS | `https://telanganatoday.com/feed` | 15 min | [FREE] | Telangana-focused |
| The Hindu Hyderabad | `https://www.thehindu.com/news/cities/Hyderabad/?service=rss` | 15 min | [FREE] | Quality journalism |
| TOI Hyderabad | `https://timesofindia.indiatimes.com/rssfeeds/3808275.cms` | 15 min | [FREE] | High volume |
| Google News RSS | `https://news.google.com/rss/search?q=Hyderabad+India&hl=en-IN&gl=IN&ceid=IN:en` | 15 min | [FREE] | Aggregated, no rate limits |
| Reddit r/hyderabad | `https://www.reddit.com/r/hyderabad/hot.json?limit=100` | 30 min | [FREE] | JSON access, 1000 QPM with OAuth2 |
| Google Trends | PyTrends library with `geo='IN-TG'` | Daily | [FREE] | Trending topics for Telangana |

**Implementation:** RSS feeds → BullMQ job every 15 min → parse → deduplicate → Claude Haiku summarize → store in `news_articles(time, source, title, summary, url, sentiment_score, entities[])`. Full-text index in Meilisearch. Reddit posts → `social_posts(time, platform, title, score, comments, url)`. Display as news ticker + sentiment trend + word cloud.

### 10. SATELLITE & REMOTE SENSING (Panel: Satellite View)

| Source | Data | Refresh | Cost | Notes |
|--------|------|---------|------|-------|
| Sentinel-2 via Copernicus | 10m optical imagery (RGB, NDVI, NDWI) | 3-5 days | [FREE] | `dataspace.copernicus.eu` — urban sprawl, green cover, lake extent |
| Sentinel-1 SAR | 5-20m radar imagery | 6-12 days | [FREE] | Flood mapping (VV backscatter), construction detection |
| Google Earth Engine | Landsat LST, MODIS NDVI, VIIRS nighttime lights, Dynamic World | Varies | [FREE] | 80+ PB of data. Python: `earthengine-api`, `geemap` |
| ISRO Bhuvan | Indian satellite imagery up to 1m | Varies | [FREE] | `bhuvan-app1.nrsc.gov.in/api/` — proximity search, LULC stats |
| NASA FIRMS | Active fire detection | Real-time | [FREE] | `firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/VIIRS_SNPP_NRT/` |
| JRC Global Surface Water | Monthly lake extent since 1984 | Monthly | [FREE] | GEE: `JRC/GSW1_4/MonthlyHistory` — perfect for Hussain Sagar tracking |

**Implementation:** Weekly GEE batch job to generate Hyderabad NDVI, LST, and water extent composites → store as Cloud Optimized GeoTIFFs → serve as MapLibre raster tile layers. Monthly change detection reports generated by Claude. Display as satellite layer toggle on main map + change detection panel.

### 11. HEALTH & WELLNESS (Panel: Health Monitor)

| Source | Data | Refresh | Cost | Notes |
|--------|------|---------|------|-------|
| eRaktKosh | Blood bank inventory by group | Real-time | [FREE] | `directory.apisetu.gov.in/api-collection/eraktkosh` — proper API! |
| IHIP | Disease surveillance (33 conditions) | Weekly | [SCRAPE] | `ihip.nhp.gov.in` — Telangana Phase-1 state |
| NFHS-5 Hyderabad | 131 health indicators | One-time | [FREE] | OpenCity.in CSV — fertility, mortality, nutrition, sanitation |
| GHMC Vector Control | Dengue/malaria complaints | Monthly | [SCRAPE] | MyGHMC app / GHMC grievance system |
| CPCB Noise Data | 10 continuous 24×7 stations | Daily | [FREE] | `cpcbenvis.nic.in/noise_quality_data.html` — since 2011 |

**Implementation:** eRaktKosh API → `blood_bank(time, bank_name, blood_group, component, available_units)`. NFHS-5 as static reference data. Display as health cards + blood availability checker + noise map.

### 12. EDUCATION (Panel: Education Index)

| Source | Data | Cost | Notes |
|--------|------|------|-------|
| UDISE+ | School-level data for Hyderabad district | [FREE] | OpenCity.in CSV — school type, enrollment, teacher qualifications |
| AISHE | Higher education survey | [FREE] | 488 colleges in Hyderabad district (3rd highest in India) |
| NIRF Rankings | Institution rankings | [FREE] | `nirfindia.org` — IIT-H 12th, NALSAR 3rd law, NIPER-H 2nd pharmacy |

### 13. CRIME & SAFETY (Panel: Safety Index)

| Source | Data | Refresh | Cost | Notes |
|--------|------|---------|------|-------|
| NCRB Crime in India | City-wise crime statistics | Annual | [FREE] | CSV on OpenCity.in — 53 metros including Hyderabad |
| Hyderabad Police Annual Report | Tri-commissionerate crime data | Annual | [FREE/SCRAPE] | Hyderabad City + Cyberabad + Rachakonda |
| Cyberabad Traffic Pulse | Real-time traffic monitoring | Real-time | [FREE/SCRAPE] | `cyberabadtrafficpulse.telangana.gov.in` |

### 14. INFRASTRUCTURE & SMART CITY (Panel: Infrastructure Map)

| Source | Data | Cost | Notes |
|--------|------|------|-------|
| OpenStreetMap | Roads, hospitals, schools, parks, water bodies, metro, bus stops, fuel stations | [FREE] | Overpass API: `[out:json];area["name"="Hyderabad"]->.a;(node["amenity"](area.a););out;` |
| GHMC Ward Boundaries | Ward/zone/circle GeoJSON | [FREE] | OpenCity.in KML → convert to GeoJSON |
| HMDA Master Plan 2031 | Land use zoning maps | [FREE] | `masterplan.hmda.gov.in/Masterplan2031` |
| Open Charge Map | EV charging stations | [FREE] | `api.openchargemap.io/v3/poi/?latitude=17.385&longitude=78.486&distance=50&distanceunit=KM` |
| TGSPDCL Power Data | Feeder outages, consumption | [FREE/SCRAPE] | `webportal.tgsouthernpower.org` |
| Telangana Open Data | EV consumption, street light data, factory records | [FREE] | `data.telangana.gov.in` — CKAN API |

### 15. BIODIVERSITY & ENVIRONMENT (Panel: Green Hyderabad)

| Source | Endpoint | Cost | Notes |
|--------|----------|------|-------|
| eBird API 2.0 | `https://api.ebird.org/v2/data/obs/IN-TS-HY/recent?key={KEY}` | [FREE] | Bird observations, hotspots (Hussain Sagar, Shamirpet, Osman Sagar) |
| iNaturalist | `https://api.inaturalist.org/v1/observations?lat=17.385&lng=78.486&radius=50` | [FREE] | Butterflies, insects, plants with photos |
| VIIRS Nighttime Lights | GEE: `NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG` | [FREE] | 500m monthly light pollution data |
| FSI Green Cover | Forest Survey of India reports | [FREE] | Hyderabad: 146.8% decadal forest cover growth (2011-2021) |

### 16. TELECOM & DIGITAL (Panel: Digital Pulse)

| Source | Data | Cost | Notes |
|--------|------|------|-------|
| Ookla Speedtest Open Data | Broadband + mobile performance tiles | [FREE] | `s3://ookla-open-data` — quarterly Parquet files, filter to Hyderabad bbox |
| TRAI Reports | Telecom subscriptions, broadband stats | [FREE] | State-level PDFs |
| Operator Coverage Maps | Jio, Airtel, Vi coverage | [SCRAPE] | TRAI-mandated since April 2025 |

### 17. CULTURE & TOURISM (Panel: City Life)

| Source | Data | Cost | Notes |
|--------|------|------|-------|
| BookMyShow | Movie listings, show times, seat availability | [SCRAPE] | GitHub: `Nikhil-Wagh/BookMyShow-API`, `prathyush/bookmyshow` |
| Telangana Tourism | Visitor data, tourism infrastructure | [FREE] | Kaggle dataset + `telangana.gov.in/tourism` |
| Swiggy API | Restaurant listings, delivery times, pricing | [SCRAPE] | `swiggy.com/dapi/restaurants/list/v5?lat=17.385044&lng=78.486671` — undocumented |
| FSSAI FoSCoS | Food business license registrations | [SCRAPE] | `foscos.fssai.gov.in` — restaurant birth/death rates |

### 18. GOVERNMENT OPEN DATA PORTALS (Meta-source)

| Portal | URL | API | Datasets |
|--------|-----|-----|----------|
| Telangana Open Data | `data.telangana.gov.in` | CKAN REST | 658+ datasets |
| OpenCity.in | `data.opencity.in` | CKAN REST | 20+ GHMC-specific datasets |
| data.gov.in | `data.gov.in` | REST API | 198,000+ datasets. Python: `pip install datagovindia` |
| Census of India | `censusindia.gov.in/census.website/data/population-finder` | CSV download | Ward-level 85 indicators |

---

## Polling Intervals & Caching Strategy

### Polling Schedule
```
EVERY 60 SECONDS:  OpenSky flights, Bus ETAs (Gamyam)
EVERY 2 MINUTES:   TomTom/HERE traffic flow
EVERY 5 MINUTES:   Stock prices (market hours 9:15-15:30 IST only)
EVERY 10 MINUTES:  Weather (Open-Meteo, OWM)
EVERY 15 MINUTES:  News RSS feeds, GDELT
EVERY 30 MINUTES:  AQI (CPCB, WAQI), Reddit, Social media
EVERY 60 MINUTES:  HMWSSB tanker count, Power outage data
EVERY 24 HOURS:    Mandi prices (8 PM IST), Fuel prices (6 AM), Gold prices
EVERY 7 DAYS:      OSM infrastructure refresh, Satellite imagery batch
EVERY 30 DAYS:     TSPCB lake water quality, NCRB crime data
EVERY 90 DAYS:     NHB RESIDEX, RBI Housing Price Index, Ookla data
```

### 3-Tier Caching (mirrors WorldMonitor pattern)
```
L1: In-memory Map (Node.js process) — 30s TTL — ultra-fast for SSE clients
L2: Redis (Upstash) — per-source TTL (AQI: 25min, traffic: 90s, weather: 8min)
L3: Cloudflare CDN — static tiles, GeoJSON boundaries, satellite composites
```

### Night Mode Cost Optimization
Between 2:00 AM and 6:00 AM IST:
- Traffic polling: PAUSE (no traffic to monitor)
- Stock prices: PAUSE (market closed)
- AQI: reduce to hourly
- News: reduce to hourly
- Flights: reduce to every 5 min
- **Estimated savings: 25-30% of API calls**

---

## Database Schema (TimescaleDB + PostGIS)

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS postgis;

-- AQI readings from all sources
CREATE TABLE aqi_readings (
    time        TIMESTAMPTZ NOT NULL,
    station_id  TEXT NOT NULL,
    station_name TEXT,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    pm25        REAL,
    pm10        REAL,
    no2         REAL,
    so2         REAL,
    co          REAL,
    o3          REAL,
    nh3         REAL,
    aqi         INTEGER,
    source      TEXT DEFAULT 'cpcb'
);
SELECT create_hypertable('aqi_readings', 'time');

-- Weather readings
CREATE TABLE weather_readings (
    time          TIMESTAMPTZ NOT NULL,
    source        TEXT NOT NULL,
    temperature   REAL,
    humidity      REAL,
    precipitation REAL,
    wind_speed    REAL,
    wind_dir      REAL,
    pressure      REAL,
    visibility    REAL,
    uv_index      REAL,
    condition     TEXT
);
SELECT create_hypertable('weather_readings', 'time');

-- Stock prices for 166 Hyderabad companies
CREATE TABLE stock_prices (
    time    TIMESTAMPTZ NOT NULL,
    symbol  TEXT NOT NULL,
    open    REAL,
    high    REAL,
    low     REAL,
    close   REAL,
    volume  BIGINT,
    vwap    REAL
);
SELECT create_hypertable('stock_prices', 'time');

-- Mandi commodity prices
CREATE TABLE mandi_prices (
    time        TIMESTAMPTZ NOT NULL,
    market      TEXT NOT NULL,
    commodity   TEXT NOT NULL,
    variety     TEXT,
    min_price   REAL,
    max_price   REAL,
    modal_price REAL,
    unit        TEXT DEFAULT 'INR/Quintal'
);
SELECT create_hypertable('mandi_prices', 'time');

-- News articles
CREATE TABLE news_articles (
    time            TIMESTAMPTZ NOT NULL,
    source          TEXT NOT NULL,
    title           TEXT NOT NULL,
    summary         TEXT,
    url             TEXT UNIQUE,
    sentiment_score REAL,
    entities        TEXT[],
    category        TEXT
);
SELECT create_hypertable('news_articles', 'time');

-- Traffic flow data
CREATE TABLE traffic_flow (
    time            TIMESTAMPTZ NOT NULL,
    segment_id      TEXT,
    road_name       TEXT,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    current_speed   REAL,
    free_flow_speed REAL,
    congestion      REAL,  -- 0.0 to 1.0
    source          TEXT DEFAULT 'tomtom'
);
SELECT create_hypertable('traffic_flow', 'time');

-- Lake water quality
CREATE TABLE lake_readings (
    time      TIMESTAMPTZ NOT NULL,
    lake_id   TEXT NOT NULL,
    lake_name TEXT,
    ph        REAL,
    do_mg_l   REAL,
    bod       REAL,
    cod       REAL,
    tds       REAL,
    coliform  REAL,
    source    TEXT DEFAULT 'tspcb'
);
SELECT create_hypertable('lake_readings', 'time');

-- Water tanker demand (novel indicator)
CREATE TABLE tanker_demand (
    time       TIMESTAMPTZ NOT NULL,
    zone       TEXT NOT NULL,
    deliveries INTEGER,
    source     TEXT DEFAULT 'hmwssb'
);
SELECT create_hypertable('tanker_demand', 'time');

-- Property listings
CREATE TABLE property_listings (
    time          TIMESTAMPTZ NOT NULL,
    locality      TEXT NOT NULL,
    type          TEXT,  -- apartment, villa, plot
    bhk           INTEGER,
    area_sqft     REAL,
    price         REAL,
    price_per_sqft REAL,
    source        TEXT
);
SELECT create_hypertable('property_listings', 'time');

-- Bus positions
CREATE TABLE bus_positions (
    time     TIMESTAMPTZ NOT NULL,
    route_id TEXT,
    stop_id  TEXT,
    eta      INTEGER,  -- seconds
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);
SELECT create_hypertable('bus_positions', 'time');
-- Short retention: 7 days only
SELECT add_retention_policy('bus_positions', INTERVAL '7 days');

-- Flight tracking
CREATE TABLE flights (
    time       TIMESTAMPTZ NOT NULL,
    icao24     TEXT,
    callsign   TEXT,
    latitude   DOUBLE PRECISION,
    longitude  DOUBLE PRECISION,
    altitude   REAL,
    velocity   REAL,
    heading    REAL,
    on_ground  BOOLEAN
);
SELECT create_hypertable('flights', 'time');
SELECT add_retention_policy('flights', INTERVAL '24 hours');

-- Blood bank inventory
CREATE TABLE blood_bank (
    time           TIMESTAMPTZ NOT NULL,
    bank_name      TEXT,
    blood_group    TEXT,
    component      TEXT,
    available_units INTEGER
);
SELECT create_hypertable('blood_bank', 'time');

-- Economic indicators
CREATE TABLE economic_indicators (
    time           TIMESTAMPTZ NOT NULL,
    indicator_name TEXT NOT NULL,
    value          REAL,
    unit           TEXT,
    source         TEXT
);
SELECT create_hypertable('economic_indicators', 'time');

-- GHMC grievance data
CREATE TABLE ghmc_grievances (
    time       TIMESTAMPTZ NOT NULL,
    category   TEXT NOT NULL,  -- pothole, streetlight, garbage, drainage, mosquito
    ward       TEXT,
    zone       TEXT,
    status     TEXT,
    location   GEOGRAPHY(POINT, 4326)
);
SELECT create_hypertable('ghmc_grievances', 'time');

-- Social media posts
CREATE TABLE social_posts (
    time     TIMESTAMPTZ NOT NULL,
    platform TEXT NOT NULL,
    title    TEXT,
    body     TEXT,
    score    INTEGER,
    comments INTEGER,
    url      TEXT UNIQUE
);
SELECT create_hypertable('social_posts', 'time');

-- Continuous aggregates for dashboard performance
CREATE MATERIALIZED VIEW aqi_hourly
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS bucket,
       station_id,
       AVG(pm25) as avg_pm25,
       AVG(pm10) as avg_pm10,
       AVG(aqi) as avg_aqi,
       MAX(aqi) as max_aqi
FROM aqi_readings
GROUP BY bucket, station_id;

CREATE MATERIALIZED VIEW weather_daily
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) AS bucket,
       MIN(temperature) as min_temp,
       MAX(temperature) as max_temp,
       AVG(temperature) as avg_temp,
       SUM(precipitation) as total_precipitation,
       AVG(humidity) as avg_humidity
FROM weather_readings
GROUP BY bucket;

-- GIS: Hyderabad ward boundaries
CREATE TABLE ward_boundaries (
    ward_id    TEXT PRIMARY KEY,
    ward_name  TEXT,
    zone_name  TEXT,
    circle     TEXT,
    population INTEGER,
    area_sqkm  REAL,
    geom       GEOGRAPHY(MULTIPOLYGON, 4326)
);
CREATE INDEX idx_ward_geom ON ward_boundaries USING GIST (geom);
```

---

## Project Structure

```
hyderabad-monitor/
├── CLAUDE.md                    # This file — persistent agent context
├── TIMELINE.md                  # Session history and progress tracking
├── TODO-MANUAL.md               # Things requiring human action (API keys, accounts)
├── docker-compose.yml           # Full stack: Next.js, TimescaleDB, Redis, Meilisearch
├── .env.example                 # All required environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
│
├── prisma/
│   ├── schema.prisma            # Prisma schema with TimescaleDB extensions
│   └── migrations/
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout with dark theme, sidebar
│   │   ├── page.tsx             # Main dashboard — grid of panels
│   │   ├── api/                 # API routes
│   │   │   ├── sse/route.ts     # Server-Sent Events endpoint
│   │   │   ├── aqi/route.ts
│   │   │   ├── weather/route.ts
│   │   │   ├── traffic/route.ts
│   │   │   ├── stocks/route.ts
│   │   │   ├── news/route.ts
│   │   │   ├── metro/route.ts
│   │   │   ├── flights/route.ts
│   │   │   ├── mandi/route.ts
│   │   │   └── health/route.ts
│   │   ├── aqi/page.tsx         # Dedicated AQI deep-dive page
│   │   ├── traffic/page.tsx
│   │   ├── stocks/page.tsx
│   │   ├── news/page.tsx
│   │   ├── satellite/page.tsx
│   │   ├── water/page.tsx
│   │   └── economy/page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # Collapsible nav with panel categories
│   │   │   ├── TopBar.tsx       # Clock, last-updated timestamps, alerts badge
│   │   │   └── PanelGrid.tsx    # Responsive grid layout for dashboard panels
│   │   ├── panels/
│   │   │   ├── AQIPanel.tsx     # Real-time AQI with station cards
│   │   │   ├── WeatherPanel.tsx # Current weather + 7-day forecast
│   │   │   ├── TrafficPanel.tsx # MapLibre traffic heatmap
│   │   │   ├── StockPanel.tsx   # Ticker tape + sector heatmap
│   │   │   ├── NewsPanel.tsx    # News feed with sentiment badges
│   │   │   ├── MetroPanel.tsx   # Metro route map + ridership
│   │   │   ├── FlightsPanel.tsx # Live flights over Hyderabad
│   │   │   ├── MandiPanel.tsx   # Commodity price cards + sparklines
│   │   │   ├── WaterPanel.tsx   # Lake health + tanker demand
│   │   │   ├── HealthPanel.tsx  # Blood bank + disease alerts
│   │   │   ├── SatellitePanel.tsx # Sentinel imagery layers
│   │   │   ├── EconomyPanel.tsx # Key economic indicators
│   │   │   ├── RealEstatePanel.tsx # Property price heatmap
│   │   │   └── SocialPanel.tsx  # Reddit + Twitter sentiment
│   │   ├── map/
│   │   │   ├── HydMap.tsx       # Main MapLibre GL instance
│   │   │   ├── layers/          # deck.gl layer configs
│   │   │   └── controls/        # Map controls, layer toggles
│   │   ├── charts/
│   │   │   ├── TimeSeriesChart.tsx  # ECharts time-series wrapper
│   │   │   ├── HeatmapChart.tsx
│   │   │   ├── GaugeChart.tsx
│   │   │   └── SparklineChart.tsx
│   │   └── ui/                  # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── db.ts                # TimescaleDB connection (pg + Prisma)
│   │   ├── redis.ts             # Redis client (ioredis)
│   │   ├── cache.ts             # 3-tier cache implementation
│   │   ├── sse.ts               # SSE manager for real-time push
│   │   └── ai.ts                # Claude API wrapper for briefs/summaries
│   │
│   ├── services/                # Data fetcher services
│   │   ├── aqi.service.ts
│   │   ├── weather.service.ts
│   │   ├── traffic.service.ts
│   │   ├── stocks.service.ts
│   │   ├── news.service.ts
│   │   ├── metro.service.ts
│   │   ├── flights.service.ts
│   │   ├── mandi.service.ts
│   │   ├── water.service.ts
│   │   ├── health.service.ts
│   │   └── realestate.service.ts
│   │
│   ├── workers/                 # BullMQ job processors
│   │   ├── scheduler.ts         # Master scheduler defining all polling jobs
│   │   ├── aqi.worker.ts
│   │   ├── weather.worker.ts
│   │   ├── traffic.worker.ts
│   │   ├── stocks.worker.ts
│   │   ├── news.worker.ts
│   │   ├── flights.worker.ts
│   │   ├── mandi.worker.ts
│   │   └── alerts.worker.ts     # Threshold-based alert dispatcher
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   │
│   └── config/
│       ├── stations.ts          # AQI station IDs and coordinates
│       ├── companies.ts         # 166 Hyderabad company tickers
│       ├── wards.ts             # Ward/zone/circle mapping
│       └── constants.ts         # Polling intervals, TTLs, thresholds
│
├── scripts/
│   ├── seed-wards.ts            # Load GHMC ward boundaries into PostGIS
│   ├── seed-stations.ts         # Load AQI station metadata
│   ├── seed-companies.ts        # Load company list
│   ├── setup-timescaledb.ts     # Create hypertables and continuous aggregates
│   └── test-apis.ts             # Verify all API endpoints are reachable
│
├── data/
│   ├── geojson/
│   │   ├── ghmc-wards.geojson   # Ward boundaries
│   │   ├── ghmc-zones.geojson   # Zone boundaries
│   │   ├── metro-lines.geojson  # Metro rail lines
│   │   ├── lakes.geojson        # 185 lake polygons
│   │   └── musi-river.geojson   # Musi River centerline
│   └── static/
│       ├── companies.json       # 166 company metadata
│       └── aqi-stations.json    # Station coordinates and IDs
│
└── python/                      # Python sidecar for stock data + GEE
    ├── requirements.txt         # jugaad-data, yfinance, earthengine-api, geemap
    ├── stock_service.py         # FastAPI service for stock data
    └── gee_processor.py         # Google Earth Engine batch jobs
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://hydmon:password@localhost:5432/hydmonitor
REDIS_URL=redis://localhost:6379

# Government APIs (all free, need registration)
DATA_GOV_IN_API_KEY=           # Register at data.gov.in
WAQI_API_TOKEN=                # Register at aqicn.org/data-platform/token/
OPENWEATHERMAP_API_KEY=        # Register at openweathermap.org
EBIRD_API_KEY=                 # Register at ebird.org/api/keygen

# Traffic APIs (free tiers)
TOMTOM_API_KEY=                # Register at developer.tomtom.com
HERE_API_KEY=                  # Register at developer.here.com

# Financial (optional)
ALPHA_VANTAGE_API_KEY=         # Register at alphavantage.co
GOLD_API_KEY=                  # Register at goldapi.io

# AI
ANTHROPIC_API_KEY=             # For Claude Haiku daily briefs

# News (optional paid)
NEWSDATA_API_KEY=              # Register at newsdata.io (200 free credits/day)

# OpenSky Network
OPENSKY_USERNAME=              # Register at opensky-network.org
OPENSKY_PASSWORD=

# Satellite (optional)
GEE_SERVICE_ACCOUNT_KEY=       # Google Earth Engine service account JSON

# Alerts
TELEGRAM_BOT_TOKEN=            # Create bot via @BotFather
TELEGRAM_CHANNEL_ID=

# App
NEXT_PUBLIC_MAPLIBRE_STYLE=https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Build Phases

### Phase 1: Foundation (THIS SESSION)
1. Initialize Next.js 15 project with TypeScript, Tailwind, shadcn/ui
2. Set up Docker Compose (TimescaleDB + PostGIS, Redis, Meilisearch)
3. Create database schema (all hypertables + continuous aggregates)
4. Load GHMC ward boundary GeoJSON
5. Build MapLibre base map with ward overlay and dark theme
6. Implement 3-tier cache (in-memory → Redis → CDN)
7. Build AQI panel (CPCB API → TimescaleDB → SSE → ECharts gauge + map heatmap)
8. Build Weather panel (Open-Meteo → card with current + 7-day forecast)
9. Build News panel (RSS feeds → parser → sentiment → news ticker)
10. Dashboard layout with responsive panel grid

### Phase 2: Transport & Finance
1. Metro panel (GTFS → route map + station info)
2. Bus panel (Gamyam API → real-time positions on map)
3. Traffic panel (TomTom → congestion heatmap overlay)
4. Flights panel (OpenSky → live aircraft on map with tooltip)
5. Stock panel (jugaad-data/yfinance → ticker tape + sector heatmap)
6. Mandi panel (Agmarknet → commodity price cards + sparklines)

### Phase 3: Novel Data + Deep Features
1. Water panel (TSPCB lake data + HMWSSB tanker demand)
2. Health panel (eRaktKosh blood bank + disease alerts)
3. Real estate panel (99acres scraper → locality heatmap)
4. Economy panel (RBI data, GSDP, UPI stats, company registrations)
5. Social panel (Reddit + Google Trends for Telangana)
6. AI daily brief generation (Claude Haiku)
7. Alert system (BullMQ → Telegram + email)

### Phase 4: Satellite + Infrastructure
1. Satellite panel (Sentinel-2 NDVI/NDWI composites as tile layers)
2. Infrastructure map (OSM → 50K+ assets with categorized markers)
3. Green Hyderabad panel (eBird, NDVI, tree census, nighttime lights)
4. Power outage tracker (TGSPDCL)
5. EV charging station map (Open Charge Map)

---

## UI/UX Design Principles

1. **Dark theme by default** — matches WorldMonitor aesthetic, reduces eye strain for monitoring
2. **Information density over whitespace** — every pixel should convey data
3. **Panel-based layout** — each data category is a self-contained panel, drag-and-drop arrangeable
4. **MapLibre as the hero** — full-width map with toggleable layers is the centerpiece
5. **Real-time indicators** — green/amber/red status dots on each panel showing data freshness
6. **Hyderabad color palette** — use Charminar-inspired warm accents (#E8A87C, #D4A373) against dark backgrounds (#0A0A0A, #1A1A2E)
7. **Telugu/Hindi support** — UI strings in English default, with i18n for Telugu and Hindi
8. **Mobile-first responsive** — panels stack vertically on mobile, 2-col on tablet, 3-4 col on desktop
9. **Keyboard navigation** — number keys (1-9) to switch panels, 'M' for map, 'F' for fullscreen

---

## Critical Implementation Notes

1. **Never call government APIs without caching** — CPCB and data.gov.in have aggressive rate limits. Always check Redis L2 cache first.
2. **Night mode saves money** — reduce polling between 2-6 AM IST. Use BullMQ's `limiter` option.
3. **CORS for government APIs** — many Indian gov APIs don't set CORS headers. Proxy through Next.js API routes.
4. **NSE/BSE scraping is legally gray** — prefer jugaad-data or official broker APIs over direct scraping. yfinance is the safest free option.
5. **OpenSky requires authentication for reliable access** — register for a free account. Unauthenticated requests are heavily rate-limited.
6. **GeoJSON size matters** — GHMC ward boundaries can be 5MB+. Simplify with mapshaper to <500KB for frontend. Keep full resolution in PostGIS.
7. **Agmarknet API updates at ~8 PM IST** — schedule mandi price fetch for 8:30 PM to ensure latest data.
8. **Stock market hours** — NSE: 9:15 AM - 3:30 PM IST, Mon-Fri. No polling outside these hours.
9. **Satellite imagery is large** — process in GEE, export as COG (Cloud Optimized GeoTIFF), serve via `/api/tiles/` route.
10. **RSS deduplication** — news articles appear in multiple feeds. Deduplicate by URL before storing.
