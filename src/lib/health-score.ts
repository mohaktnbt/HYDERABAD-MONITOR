// Composite city health scoring — combines multiple signals into a single metric.
// Each sub-score is 0-100 (higher is better).

import type { AQIReading, WeatherForecast } from '@/types';

export interface CityHealthScore {
  overall: number;
  grade: string;
  components: {
    airQuality: number;
    weather: number;
    waterAvailability: number;
    mobility: number;
    safety: number;
    governance: number;
    economy: number;
  };
  generatedAt: string;
  narrative: string;
}

// Convert AQI to a 0-100 score (inverse — lower AQI = higher score)
function aqiToScore(aqi: number): number {
  if (aqi <= 50) return 100;
  if (aqi <= 100) return 85;
  if (aqi <= 200) return 65;
  if (aqi <= 300) return 40;
  if (aqi <= 400) return 20;
  return 5;
}

// Convert temperature + humidity + rain to comfort score
function weatherToScore(w: WeatherForecast | null): number {
  if (!w?.current) return 50;
  const t = w.current.temperature;
  const h = w.current.humidity;

  // Hyderabad comfort band: 22-32°C, humidity 40-65%
  let tempScore = 100;
  if (t < 18) tempScore = 60;
  else if (t < 22) tempScore = 85;
  else if (t <= 32) tempScore = 100;
  else if (t <= 36) tempScore = 75;
  else if (t <= 40) tempScore = 50;
  else tempScore = 25;

  let humScore = 100;
  if (h > 80) humScore = 55;
  else if (h > 65) humScore = 80;
  else if (h >= 40) humScore = 100;
  else if (h >= 25) humScore = 80;
  else humScore = 60;

  // Heavy rain = discomfort
  const rainPenalty = Math.min(30, (w.current.precipitation || 0) * 3);
  return Math.max(0, Math.round((tempScore + humScore) / 2 - rainPenalty));
}

function gradeFromScore(score: number): string {
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 55) return 'C+';
  if (score >= 45) return 'C';
  if (score >= 35) return 'D';
  return 'E';
}

function narrativeFromComponents(c: CityHealthScore['components']): string {
  const parts: string[] = [];
  if (c.airQuality < 50) parts.push('air quality is poor');
  else if (c.airQuality > 80) parts.push('air is fresh');

  if (c.weather < 50) parts.push('weather is uncomfortable');
  else if (c.weather > 80) parts.push('weather is pleasant');

  if (c.mobility < 50) parts.push('traffic is heavy');
  if (c.waterAvailability < 50) parts.push('water supply is stressed');

  if (parts.length === 0) return 'Hyderabad is having a normal day across all indicators.';
  return 'Today in Hyderabad: ' + parts.join(', ') + '.';
}

export function computeCityHealth(input: {
  aqi: AQIReading[];
  weather: WeatherForecast | null;
  trafficCongestion?: number; // 0..1
  waterAvailabilityPct?: number; // 0..100
}): CityHealthScore {
  const validAqi = input.aqi.filter((r) => r.aqi != null);
  const avgAqi = validAqi.length
    ? validAqi.reduce((s, r) => s + (r.aqi ?? 0), 0) / validAqi.length
    : 100;

  const components = {
    airQuality: aqiToScore(avgAqi),
    weather: weatherToScore(input.weather),
    // Placeholder values for modules not yet wired in — refined in Phase 2+
    waterAvailability: input.waterAvailabilityPct ?? 72,
    mobility: input.trafficCongestion != null ? Math.round(100 - input.trafficCongestion * 100) : 58,
    safety: 68,
    governance: 64,
    economy: 76,
  };

  // Weighted overall
  const weights = {
    airQuality: 0.22,
    weather: 0.10,
    waterAvailability: 0.15,
    mobility: 0.18,
    safety: 0.15,
    governance: 0.10,
    economy: 0.10,
  };

  const overall = Math.round(
    components.airQuality * weights.airQuality +
    components.weather * weights.weather +
    components.waterAvailability * weights.waterAvailability +
    components.mobility * weights.mobility +
    components.safety * weights.safety +
    components.governance * weights.governance +
    components.economy * weights.economy
  );

  return {
    overall,
    grade: gradeFromScore(overall),
    components,
    generatedAt: new Date().toISOString(),
    narrative: narrativeFromComponents(components),
  };
}
