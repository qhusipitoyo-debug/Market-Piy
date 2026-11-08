// Client API layer for server endpoints

import { BacktestSummary, BacktestResult, BacktestTrade, NewsEvent, CurrencyNewsStatus, AssetSignals, MarketItem, MarketCategory } from '../types/market';

export async function fetchMarketQuotes(): Promise<{
  crypto: MarketItem[];
  forex: MarketItem[];
  commodities: MarketItem[];
  equities: MarketItem[];
}> {
  const res = await fetch('/api/market-quotes');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.markets;
}

export async function fetchCandles(symbol: string, interval = '4h', limit = 60) {
  const res = await fetch(`/api/candles?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.candles;
}

export async function fetchSignals(params?: {
  force?: boolean;
  preset?: string;
  adx_crypto?: number;
  adx_forex?: number;
  z_crypto?: number;
  z_forex?: number;
}): Promise<{
  generated_at: string;
  source: string;
  assets: AssetSignals[];
}> {
  const query = new URLSearchParams();
  if (params?.force) query.set('force', '1');
  if (params?.preset) query.set('preset', params.preset);
  if (params?.adx_crypto) query.set('adx_crypto', params.adx_crypto.toString());
  if (params?.adx_forex) query.set('adx_forex', params.adx_forex.toString());
  if (params?.z_crypto) query.set('z_crypto', params.z_crypto.toString());
  if (params?.z_forex) query.set('z_forex', params.z_forex.toString());

  const res = await fetch(`/api/signals?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchNewsFeed(): Promise<{
  currencyStatus: Record<string, CurrencyNewsStatus>;
  headlines: Array<{ title: string; link: string; pubDate: string; sentiment: 'bullish' | 'bearish' | 'neutral' }>;
  events: NewsEvent[];
}> {
  const res = await fetch('/api/news-feed');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchBacktestData(): Promise<{
  generated_at: string;
  config: any;
  summary: BacktestSummary;
  results: BacktestResult[];
  trades: BacktestTrade[];
}> {
  const res = await fetch('/api/backtest');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function calibrateWithAI(body: {
  market: MarketCategory;
  symbol: string;
  timeframe: string;
  currentAdx: number;
  currentVol: string;
  newsRisk: string;
}) {
  const res = await fetch('/api/ai-calibrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}
