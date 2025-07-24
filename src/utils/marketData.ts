// Market data generation utilities for demo purposes

export const generateCalendarData = (currentDate, view, instrument) => {
  const data = {};
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Generate data for the current month and surrounding days
  const startDate = new Date(year, month - 1, 15); // Previous month
  const endDate = new Date(year, month + 2, 15);   // Next month
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = new Date(d).toDateString();
    data[dateKey] = generateDayData(new Date(d), instrument);
  }
  
  return data;
};

export const generateDayData = (date, instrument = 'BTC-USD') => {
  // Seed random number generator based on date for consistency
  const seed = date.getTime();
  const random = () => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Base price varies by instrument
  const basePrices = {
    'BTC-USD': 45000,
    'ETH-USD': 3000,
    'AAPL': 180,
    'TSLA': 250,
    'SPY': 450,
    'QQQ': 380
  };
  
  const basePrice = basePrices[instrument] || 100;
  
  // Generate realistic market data
  const volatility = Math.abs(random()) * 0.08 + 0.01; // 1% to 9%
  const priceChange = (random() - 0.5) * volatility;
  const volume = Math.abs(random()) * 2000000 + 500000; // 500K to 2.5M
  
  const open = basePrice * (1 + (random() - 0.5) * 0.02);
  const close = open * (1 + priceChange);
  const high = Math.max(open, close) * (1 + Math.abs(random()) * 0.01);
  const low = Math.min(open, close) * (1 - Math.abs(random()) * 0.01);
  
  return {
    date: date.toISOString().split('T')[0],
    open: open,
    high: high,
    low: low,
    close: close,
    volume: volume,
    priceChange: priceChange,
    volatility: volatility,
    // Additional metrics
    rsi: 30 + Math.abs(random()) * 40, // 30-70 range
    macd: (random() - 0.5) * 10,
    bollinger: {
      upper: high * 1.02,
      middle: (high + low) / 2,
      lower: low * 0.98
    },
    sentiment: random() > 0.5 ? 'bullish' : 'bearish'
  };
};

export const generateHistoricalPattern = (instrument, months = 12) => {
  const patterns = [];
  const today = new Date();
  
  for (let i = months; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthData = {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      avgVolatility: Math.random() * 0.06 + 0.02,
      avgReturn: (Math.random() - 0.5) * 0.15,
      avgVolume: Math.random() * 1500000 + 800000,
      tradingDays: 20 + Math.floor(Math.random() * 3)
    };
    patterns.push(monthData);
  }
  
  return patterns;
};

export const getMarketSeasonality = (instrument) => {
  // Seasonal patterns (simplified for demo)
  const seasonalPatterns = {
    'BTC-USD': {
      Q1: { volatility: 'high', performance: 'positive', strength: 0.7 },
      Q2: { volatility: 'medium', performance: 'neutral', strength: 0.5 },
      Q3: { volatility: 'low', performance: 'negative', strength: 0.3 },
      Q4: { volatility: 'high', performance: 'positive', strength: 0.8 }
    },
    'AAPL': {
      Q1: { volatility: 'medium', performance: 'positive', strength: 0.6 },
      Q2: { volatility: 'low', performance: 'positive', strength: 0.7 },
      Q3: { volatility: 'high', performance: 'negative', strength: 0.4 },
      Q4: { volatility: 'medium', performance: 'positive', strength: 0.8 }
    }
  };
  
  return seasonalPatterns[instrument] || seasonalPatterns['BTC-USD'];
};

export const calculateTechnicalIndicators = (data) => {
  // Simple moving averages
  const sma20 = data.close; // Simplified
  const sma50 = data.close * 0.98;
  
  // RSI calculation (simplified)
  const rsi = 30 + Math.random() * 40;
  
  // MACD (simplified)
  const macd = (Math.random() - 0.5) * 5;
  const signal = macd * 0.8;
  const histogram = macd - signal;
  
  return {
    sma20,
    sma50,
    rsi,
    macd: {
      macd,
      signal,
      histogram
    },
    stochastic: {
      k: Math.random() * 100,
      d: Math.random() * 100
    }
  };
};