import { create } from 'zustand';
import type { AQIReading, WeatherForecast, NewsArticle, PanelId } from '@/types';

interface DashboardState {
  // Data
  aqiData: AQIReading[];
  weatherData: WeatherForecast | null;
  newsData: NewsArticle[];

  // UI state
  activePanel: PanelId | null;
  sidebarCollapsed: boolean;
  mapVisible: boolean;

  // Status
  lastUpdated: Record<string, string>;
  errors: Record<string, string>;

  // Actions
  setAQIData: (data: AQIReading[]) => void;
  setWeatherData: (data: WeatherForecast) => void;
  setNewsData: (data: NewsArticle[]) => void;
  setActivePanel: (panel: PanelId | null) => void;
  toggleSidebar: () => void;
  toggleMap: () => void;
  setLastUpdated: (key: string, time: string) => void;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  aqiData: [],
  weatherData: null,
  newsData: [],

  activePanel: null,
  sidebarCollapsed: false,
  mapVisible: true,

  lastUpdated: {},
  errors: {},

  setAQIData: (data) =>
    set({ aqiData: data }),
  setWeatherData: (data) =>
    set({ weatherData: data }),
  setNewsData: (data) =>
    set({ newsData: data }),
  setActivePanel: (panel) =>
    set({ activePanel: panel }),
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMap: () =>
    set((s) => ({ mapVisible: !s.mapVisible })),
  setLastUpdated: (key, time) =>
    set((s) => ({ lastUpdated: { ...s.lastUpdated, [key]: time } })),
  setError: (key, error) =>
    set((s) => ({ errors: { ...s.errors, [key]: error } })),
  clearError: (key) =>
    set((s) => {
      const errors = { ...s.errors };
      delete errors[key];
      return { errors };
    }),
}));
