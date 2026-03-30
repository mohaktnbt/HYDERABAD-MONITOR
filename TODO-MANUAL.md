# TODO-MANUAL.md — Things YOU Must Do (Claude Code Can't)

> **Last updated:** 2026-03-30
> **Status tracking:** ✅ Done | 🔲 Not started | 🔄 In progress | ⚠️ Blocked

---

## PRIORITY 1: API Keys & Account Registration (Do FIRST)

These are required before Claude Code can build functional data connectors. All are **free** unless noted.

### Government Data APIs

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 1 | Register on data.gov.in and get API key | https://data.gov.in/user/register | 5 min | 🔲 |
| 2 | Note your data.gov.in API key → paste into `.env` as `DATA_GOV_IN_API_KEY` | After step 1 | 1 min | 🔲 |
| 3 | Register on WAQI/AQICN for air quality token | https://aqicn.org/data-platform/token/ | 3 min | 🔲 |
| 4 | Note WAQI token → paste into `.env` as `WAQI_API_TOKEN` | After step 3 | 1 min | 🔲 |

### Weather APIs

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 5 | Register on OpenWeatherMap (free tier: 1000 calls/day) | https://openweathermap.org/appid | 3 min | 🔲 |
| 6 | Note OWM API key → `OPENWEATHERMAP_API_KEY` | After step 5 | 1 min | 🔲 |
| 7 | (Optional) Apply for IMD API access — requires IP whitelisting request via email | https://mausam.imd.gov.in/imd_latest/contents/api.pdf | 2-5 days | 🔲 |

### Traffic APIs

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 8 | Register on TomTom Developer Portal (free: 50K tile req/day) | https://developer.tomtom.com/ | 5 min | 🔲 |
| 9 | Note TomTom key → `TOMTOM_API_KEY` | After step 8 | 1 min | 🔲 |
| 10 | Register on HERE Developer Portal (free: 250K txn/month) | https://developer.here.com/ | 5 min | 🔲 |
| 11 | Note HERE key → `HERE_API_KEY` | After step 10 | 1 min | 🔲 |

### Flight Tracking

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 12 | Register on OpenSky Network (free: 4000 credits/day) | https://opensky-network.org/index.php/register | 3 min | 🔲 |
| 13 | Note OpenSky credentials → `OPENSKY_USERNAME` + `OPENSKY_PASSWORD` | After step 12 | 1 min | 🔲 |

### Financial Data

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 14 | Register on Alpha Vantage (free: 25 calls/day) | https://www.alphavantage.co/support/#api-key | 2 min | 🔲 |
| 15 | Note AV key → `ALPHA_VANTAGE_API_KEY` | After step 14 | 1 min | 🔲 |
| 16 | Register on GoldAPI.io (free: 300 req/month) | https://www.goldapi.io/ | 3 min | 🔲 |
| 17 | Note Gold API key → `GOLD_API_KEY` | After step 16 | 1 min | 🔲 |
| 18 | (Optional) Open Angel One demat account for free real-time NSE streaming | https://www.angelone.in/ | 1-3 days | 🔲 |
| 19 | (Optional) Open Upstox demat account for free WebSocket streaming | https://upstox.com/ | 1-3 days | 🔲 |

### Biodiversity

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 20 | Register on eBird and request API key | https://ebird.org/api/keygen | 3 min | 🔲 |
| 21 | Note eBird key → `EBIRD_API_KEY` | After step 20 | 1 min | 🔲 |

### AI & LLM

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 22 | Ensure Anthropic API key is ready (you already have one) | https://console.anthropic.com/ | 1 min | 🔲 |
| 23 | Set `ANTHROPIC_API_KEY` in `.env` | - | 1 min | 🔲 |

### News (Optional Paid)

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 24 | (Optional) Register on NewsData.io (free: 200 credits/day) | https://newsdata.io/register | 3 min | 🔲 |
| 25 | Note NewsData key → `NEWSDATA_API_KEY` | After step 24 | 1 min | 🔲 |

### Satellite Imagery

| # | Task | URL | Time | Status |
|---|------|-----|------|--------|
| 26 | Register for Google Earth Engine (free for non-commercial) | https://earthengine.google.com/signup/ | 5 min (approval: 1-2 days) | 🔲 |
| 27 | Create GEE service account + download JSON key → `GEE_SERVICE_ACCOUNT_KEY` path in `.env` | https://developers.google.com/earth-engine/guides/service_account | 10 min | 🔲 |
| 28 | Register on Copernicus Data Space Ecosystem | https://dataspace.copernicus.eu/ | 5 min | 🔲 |
| 29 | Register on ISRO Bhuvan | https://bhuvan.nrsc.gov.in/bhuvan_links.php | 3 min | 🔲 |

---

## PRIORITY 2: Alert Channel Setup

| # | Task | Instructions | Status |
|---|------|-------------|--------|
| 30 | Create a Telegram bot via @BotFather | Open Telegram → search @BotFather → `/newbot` → name it "Hyderabad Monitor" → note the bot token → `TELEGRAM_BOT_TOKEN` | 🔲 |
| 31 | Create a Telegram channel for alerts | Create channel → add your bot as admin → get channel ID (send a message, then check `https://api.telegram.org/bot{TOKEN}/getUpdates`) → `TELEGRAM_CHANNEL_ID` | 🔲 |
| 32 | (Optional) Set up AWS SES for email alerts | AWS Console → SES → Verify your domain/email → note SMTP credentials | 🔲 |
| 33 | (Optional) Set up Firebase project for push notifications | https://console.firebase.google.com/ → New project → Cloud Messaging → note server key | 🔲 |
| 34 | (Optional) WhatsApp Business API via Twilio ($0.007-0.016/msg) | https://www.twilio.com/whatsapp → Sign up → note Account SID + Auth Token | 🔲 |

---

## PRIORITY 3: GitHub Repository Setup

| # | Task | Instructions | Status |
|---|------|-------------|--------|
| 35 | Create GitHub repo `mohaktnbt/hyderabad-monitor` | https://github.com/new → Name: `hyderabad-monitor` → Public → No README (Claude Code will create it) → Create | 🔲 |
| 36 | Ensure GitHub CLI is configured on VPS | SSH to VPS → `gh auth status` → if not logged in: `gh auth login` | 🔲 |

---

## PRIORITY 4: GeoJSON Data Downloads (Manual Collection)

Claude Code can process these but you need to download/locate them first.

| # | Task | Source | Format | Status |
|---|------|--------|--------|--------|
| 37 | Download GHMC ward boundary file | https://data.opencity.in → search "GHMC ward" → download KML/GeoJSON | KML/GeoJSON | 🔲 |
| 38 | Download GHMC zone boundary file | https://data.opencity.in → search "GHMC zone" | KML/GeoJSON | 🔲 |
| 39 | Download Hyderabad Metro route lines | OpenStreetMap → extract via Overpass or find on DataMeet GitHub | GeoJSON | 🔲 |
| 40 | Download Hyderabad lakes polygons | TSPCB + OpenStreetMap → filter `natural=water` in Hyderabad bbox | GeoJSON | 🔲 |
| 41 | Download Musi River centerline | OpenStreetMap Overpass: `[out:json];way["name"="Musi River"];out geom;` | GeoJSON | 🔲 |
| 42 | Download Telangana Assembly constituency shapefiles | Kaggle: `syedabdulshameer/telangana-assembly-shapefiles` | Shapefile | 🔲 |
| 43 | Download DataMeet GHMC ward data (population) | https://github.com/datameet → search GHMC | Excel/CSV | 🔲 |

---

## PRIORITY 5: Kaggle Datasets to Download

These provide seed/historical data that enriches the dashboard. Claude Code can process them once downloaded.

| # | Dataset | Kaggle URL | Use Case | Status |
|---|---------|-----------|----------|--------|
| 44 | Hyderabad Weather 1950-2020 | `rohanvarma9187/hyderabad-weather1950-2020-temp-and-rainfall` | Historical climate baselines | 🔲 |
| 45 | AAQ Data Hyderabad | `khusheekapoor/aaq-data-hyderabad` | Historical AQI for trend analysis | 🔲 |
| 46 | Hyderabad House Price | `faisal012/hyderabad-house-price` | Seed real estate data | 🔲 |
| 47 | GHMC Data | `venky73/ghmc-data` | Ward-level civic amenities | 🔲 |
| 48 | Zomato Restaurants Hyderabad | `batjoker/zomato-restaurants-hyderabad` | Food economy baseline | 🔲 |
| 49 | Telangana Vehicle Registration | `chandansy/telangana-vehicle-registration-data` | Traffic density proxy | 🔲 |
| 50 | India AQI 2023-2025 | `saikiranudayana/india-air-quality-index-aqi-dataset-20232025` | Recent AQI, filter for Hyderabad | 🔲 |
| 51 | Indian Weather Daily Updating | `nelgiriyewithana/indian-weather-repository-daily-snapshot` | Continuous weather feed | 🔲 |
| 52 | Indian Agricultural Mandi Prices | `arjunyadav99/indian-agricultural-mandi-prices-20232025` | Historical mandi data | 🔲 |
| 53 | Crime Rate in India | `tanushagupta/crime-rate-in-india` | Crime panel seed data | 🔲 |
| 54 | Telangana Ground Water Quality | `sivapriyagarladinne/telangana-post-monsoon-ground-water-quality-data` | Water quality baseline | 🔲 |
| 55 | India Stock Market (Daily Updated) | `andrewmvd/india-stock-market` | Historical stock data | 🔲 |
| 56 | Hyderabad Salaried Employees | `shubamsumbria/hyderabad-salaried-employees-dataset-clustering` | Salary insights panel | 🔲 |

---

## PRIORITY 6: VPS Infrastructure Prep

| # | Task | Instructions | Status |
|---|------|-------------|--------|
| 57 | Ensure Docker & Docker Compose are installed on VPS | `ssh mohak@168.231.103.49` → `docker --version && docker compose version` | 🔲 |
| 58 | Ensure Node.js 22 LTS is installed | `node -v` should show v22.x | 🔲 |
| 59 | Ensure Python 3.11+ is installed | `python3 --version` | 🔲 |
| 60 | Ensure PM2 is installed globally | `pm2 --version` || `npm install -g pm2` | 🔲 |
| 61 | Ensure sufficient disk space (need ~20GB) | `df -h /` | 🔲 |
| 62 | Open ports: 3000 (Next.js), 5432 (TimescaleDB), 6379 (Redis), 7700 (Meilisearch) | Hostinger firewall config | 🔲 |
| 63 | Set up a domain or subdomain for the dashboard | e.g., `hydmonitor.yourdomain.com` → point A record to VPS IP | 🔲 |
| 64 | (Optional) Set up Cloudflare for CDN + SSL | Add domain to Cloudflare → proxy through CF | 🔲 |

---

## PRIORITY 7: Government Portal Scraping Preparation

Some data sources require manual exploration to understand page structure before Claude Code can build scrapers.

| # | Task | URL | What to Check | Status |
|---|------|-----|---------------|--------|
| 65 | Explore TSPCB environmental data portal | https://tspcb.cgg.gov.in/Pages/Envdata.aspx | How lake/AQI data is organized, download formats | 🔲 |
| 66 | Explore HMWSSB tanker tracking page | https://tanker.hyderabadwater.gov.in/TANKERTRACKING | Check if counter is scrapable, any auth needed | 🔲 |
| 67 | Explore TGSPDCL outage reports | https://webportal.tgsouthernpower.org | Feeder outage data format | 🔲 |
| 68 | Explore Telangana e-Procurement portal | https://tender.telangana.gov.in | Tender data structure | 🔲 |
| 69 | Explore RERA Telangana project listing | https://rera.telangana.gov.in | Registered project data format | 🔲 |
| 70 | Explore GHMC grievance system | https://igs.ghmc.gov.in | Complaint categories, ward-level data | 🔲 |
| 71 | Explore Cyberabad Traffic Pulse | https://cyberabadtrafficpulse.telangana.gov.in | Real-time traffic data format | 🔲 |
| 72 | Explore MyGHMC app | Download from Play Store (search "My GHMC") | Grievance categories, data available | 🔲 |

---

## PRIORITY 8: Legal & Compliance Notes

| # | Task | Notes | Status |
|---|------|-------|--------|
| 73 | Review data.gov.in Terms of Use | https://data.gov.in/terms-use → Government data is generally open for reuse under NDSAP | 🔲 |
| 74 | Review NSE data usage policy | NSE data redistribution requires license. yfinance personal use is gray area. Use official broker APIs for production. | 🔲 |
| 75 | Review OpenStreetMap attribution requirements | Must display "© OpenStreetMap contributors" on any map using OSM data | 🔲 |
| 76 | Review GEE terms for commercial use | Free for research/education. Commercial use requires Google Cloud project + billing | 🔲 |
| 77 | Decide on open-source license for the project | Recommendation: AGPL-3.0 (same as WorldMonitor) for viral open-source | 🔲 |

---

## PRIORITY 9: Future Enhancements (After V1 Launch)

| # | Task | Notes | Status |
|---|------|-------|--------|
| 78 | Apply for HMRL/TSRTC data partnership | Write to `md@hmrl.co.in` and `md@tsrtc.telangana.gov.in` requesting real-time data feed | 🔲 |
| 79 | Explore GVK EMRI (108 ambulance) data partnership | Contact GVK EMRI for ambulance response time data | 🔲 |
| 80 | Set up Google Maps Platform billing for production traffic data | Enable billing → India pricing is 60-70% lower than global | 🔲 |
| 81 | Explore T-Hub partnership for startup data access | T-Hub 2.0, Phase-2, Raidurgam → contact for data sharing | 🔲 |
| 82 | Apply for Namma Yatri open data access | https://nammayatri.in/open/ → request API access for ride-hailing data | 🔲 |
| 83 | Set up X/Twitter API access ($200/month Basic) | https://developer.twitter.com/ → only if social media panel is high priority | 🔲 |
| 84 | Explore GHMC Smart City data sharing | Contact GHMC Smart City Cell for IoT sensor data access | 🔲 |
| 85 | Build Android TV app for SOC wall display | Kotlin + Jetpack Compose → WebView pointing to dashboard with auto-refresh | 🔲 |

---

## Quick Start Checklist (Minimum for Phase 1)

To get Claude Code building Phase 1 immediately, you need AT MINIMUM these 8 items done:

- [ ] **Item 1-2:** data.gov.in API key (for CPCB AQI)
- [ ] **Item 3-4:** WAQI token (backup AQI source)
- [ ] **Item 5-6:** OpenWeatherMap API key (weather panel)
- [ ] **Item 22-23:** Anthropic API key in `.env` (AI briefs)
- [ ] **Item 35:** GitHub repo created
- [ ] **Item 37:** GHMC ward boundary GeoJSON downloaded
- [ ] **Item 57-60:** VPS has Docker, Node.js, Python, PM2

> **Estimated time to complete minimum checklist: ~30 minutes**
> **Estimated time to complete ALL items: ~3-4 hours** (excluding items that need days for approval)

---

## Notes for Claude Code Sessions

When starting a Claude Code session on the VPS, use this command:
```bash
ssh mohak@168.231.103.49
tmux new -s hydmon
printf '\e[?2004l'
cd ~/hyderabad-monitor
claude --dangerously-skip-permissions
```

First message to Claude Code:
```
Read CLAUDE.md thoroughly. This is the master context for the Hyderabad Monitor project. 
Start with Phase 1 — Foundation. Initialize the Next.js 15 project, set up Docker Compose 
with TimescaleDB + Redis, create the database schema, load ward boundaries, and build the 
first 3 panels (AQI, Weather, News). Follow the project structure exactly as specified in CLAUDE.md.
Check TIMELINE.md for any previous session progress before starting.
```
