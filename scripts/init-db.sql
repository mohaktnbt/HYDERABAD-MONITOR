-- Hyderabad Monitor: TimescaleDB + PostGIS initialization
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS postgis;

-- AQI readings from all sources
CREATE TABLE IF NOT EXISTS aqi_readings (
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
SELECT create_hypertable('aqi_readings', 'time', if_not_exists => TRUE);

-- Weather readings
CREATE TABLE IF NOT EXISTS weather_readings (
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
SELECT create_hypertable('weather_readings', 'time', if_not_exists => TRUE);

-- Stock prices for Hyderabad companies
CREATE TABLE IF NOT EXISTS stock_prices (
    time    TIMESTAMPTZ NOT NULL,
    symbol  TEXT NOT NULL,
    open    REAL,
    high    REAL,
    low     REAL,
    close   REAL,
    volume  BIGINT,
    vwap    REAL
);
SELECT create_hypertable('stock_prices', 'time', if_not_exists => TRUE);

-- Mandi commodity prices
CREATE TABLE IF NOT EXISTS mandi_prices (
    time        TIMESTAMPTZ NOT NULL,
    market      TEXT NOT NULL,
    commodity   TEXT NOT NULL,
    variety     TEXT,
    min_price   REAL,
    max_price   REAL,
    modal_price REAL,
    unit        TEXT DEFAULT 'INR/Quintal'
);
SELECT create_hypertable('mandi_prices', 'time', if_not_exists => TRUE);

-- News articles
CREATE TABLE IF NOT EXISTS news_articles (
    time            TIMESTAMPTZ NOT NULL,
    source          TEXT NOT NULL,
    title           TEXT NOT NULL,
    summary         TEXT,
    url             TEXT UNIQUE,
    sentiment_score REAL,
    entities        TEXT[],
    category        TEXT
);
SELECT create_hypertable('news_articles', 'time', if_not_exists => TRUE);

-- Traffic flow data
CREATE TABLE IF NOT EXISTS traffic_flow (
    time            TIMESTAMPTZ NOT NULL,
    segment_id      TEXT,
    road_name       TEXT,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    current_speed   REAL,
    free_flow_speed REAL,
    congestion      REAL,
    source          TEXT DEFAULT 'tomtom'
);
SELECT create_hypertable('traffic_flow', 'time', if_not_exists => TRUE);

-- Lake water quality
CREATE TABLE IF NOT EXISTS lake_readings (
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
SELECT create_hypertable('lake_readings', 'time', if_not_exists => TRUE);

-- Water tanker demand
CREATE TABLE IF NOT EXISTS tanker_demand (
    time       TIMESTAMPTZ NOT NULL,
    zone       TEXT NOT NULL,
    deliveries INTEGER,
    source     TEXT DEFAULT 'hmwssb'
);
SELECT create_hypertable('tanker_demand', 'time', if_not_exists => TRUE);

-- Property listings
CREATE TABLE IF NOT EXISTS property_listings (
    time          TIMESTAMPTZ NOT NULL,
    locality      TEXT NOT NULL,
    type          TEXT,
    bhk           INTEGER,
    area_sqft     REAL,
    price         REAL,
    price_per_sqft REAL,
    source        TEXT
);
SELECT create_hypertable('property_listings', 'time', if_not_exists => TRUE);

-- Bus positions (7-day retention)
CREATE TABLE IF NOT EXISTS bus_positions (
    time     TIMESTAMPTZ NOT NULL,
    route_id TEXT,
    stop_id  TEXT,
    eta      INTEGER,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);
SELECT create_hypertable('bus_positions', 'time', if_not_exists => TRUE);

-- Flight tracking (24-hour retention)
CREATE TABLE IF NOT EXISTS flights (
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
SELECT create_hypertable('flights', 'time', if_not_exists => TRUE);

-- Blood bank inventory
CREATE TABLE IF NOT EXISTS blood_bank (
    time           TIMESTAMPTZ NOT NULL,
    bank_name      TEXT,
    blood_group    TEXT,
    component      TEXT,
    available_units INTEGER
);
SELECT create_hypertable('blood_bank', 'time', if_not_exists => TRUE);

-- Economic indicators
CREATE TABLE IF NOT EXISTS economic_indicators (
    time           TIMESTAMPTZ NOT NULL,
    indicator_name TEXT NOT NULL,
    value          REAL,
    unit           TEXT,
    source         TEXT
);
SELECT create_hypertable('economic_indicators', 'time', if_not_exists => TRUE);

-- Social media posts
CREATE TABLE IF NOT EXISTS social_posts (
    time     TIMESTAMPTZ NOT NULL,
    platform TEXT NOT NULL,
    title    TEXT,
    body     TEXT,
    score    INTEGER,
    comments INTEGER,
    url      TEXT UNIQUE
);
SELECT create_hypertable('social_posts', 'time', if_not_exists => TRUE);

-- Ward boundaries (PostGIS)
CREATE TABLE IF NOT EXISTS ward_boundaries (
    ward_id    TEXT PRIMARY KEY,
    ward_name  TEXT,
    zone_name  TEXT,
    circle     TEXT,
    population INTEGER,
    area_sqkm  REAL,
    geom       GEOGRAPHY(MULTIPOLYGON, 4326)
);
CREATE INDEX IF NOT EXISTS idx_ward_geom ON ward_boundaries USING GIST (geom);

-- Continuous aggregates
CREATE MATERIALIZED VIEW IF NOT EXISTS aqi_hourly
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS bucket,
       station_id,
       AVG(pm25) as avg_pm25,
       AVG(pm10) as avg_pm10,
       AVG(aqi) as avg_aqi,
       MAX(aqi) as max_aqi
FROM aqi_readings
GROUP BY bucket, station_id
WITH NO DATA;

CREATE MATERIALIZED VIEW IF NOT EXISTS weather_daily
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', time) AS bucket,
       MIN(temperature) as min_temp,
       MAX(temperature) as max_temp,
       AVG(temperature) as avg_temp,
       SUM(precipitation) as total_precipitation,
       AVG(humidity) as avg_humidity
FROM weather_readings
GROUP BY bucket
WITH NO DATA;
