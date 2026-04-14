import { getCached } from '@/lib/cache';
import { CACHE_TTL, HYDERABAD } from '@/config/constants';
import type { WeatherForecast, WeatherReading, DailyForecast } from '@/types';

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight showers',
  81: 'Moderate showers',
  82: 'Violent showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

async function fetchWeather(): Promise<WeatherForecast> {
  const { lat, lng } = HYDERABAD.CENTER;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,wind_speed_10m_max,weather_code&timezone=Asia/Kolkata&forecast_days=7`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const data: OpenMeteoResponse = await res.json();

  const current: WeatherReading = {
    time: data.current.time,
    source: 'open-meteo',
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    windSpeed: data.current.wind_speed_10m,
    windDir: data.current.wind_direction_10m,
    pressure: data.current.surface_pressure,
    visibility: 0,
    uvIndex: 0,
    condition: WMO_CODES[data.current.weather_code] || 'Unknown',
  };

  const hourly: WeatherReading[] = data.hourly.time.slice(0, 24).map((t, i) => ({
    time: t,
    source: 'open-meteo',
    temperature: data.hourly.temperature_2m[i],
    humidity: data.hourly.relative_humidity_2m[i],
    precipitation: data.hourly.precipitation[i],
    windSpeed: data.hourly.wind_speed_10m[i],
    windDir: 0,
    pressure: 0,
    visibility: 0,
    uvIndex: 0,
    condition: WMO_CODES[data.hourly.weather_code[i]] || 'Unknown',
  }));

  const daily: DailyForecast[] = data.daily.time.map((t, i) => ({
    date: t,
    minTemp: data.daily.temperature_2m_min[i],
    maxTemp: data.daily.temperature_2m_max[i],
    precipitation: data.daily.precipitation_sum[i],
    condition: WMO_CODES[data.daily.weather_code[i]] || 'Unknown',
    windSpeed: data.daily.wind_speed_10m_max[i],
  }));

  return { current, hourly, daily };
}

export async function getWeatherData(): Promise<WeatherForecast> {
  return getCached('weather:hyderabad', fetchWeather, CACHE_TTL.WEATHER);
}
