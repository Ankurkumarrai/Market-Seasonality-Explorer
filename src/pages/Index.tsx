import { useState } from 'react';
import { TrendingUp, Activity, BarChart3, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Calendar from '@/components/Calendar/Calendar';
import ViewControls from '@/components/Controls/ViewControls';
import DataPanel from '@/components/Dashboard/DataPanel';
import { generateDayData } from '@/utils/marketData';

const Index = () => {
  const [view, setView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState('BTC-USD');
  const [timeframe, setTimeframe] = useState('3M');
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dayData = generateDayData(date, selectedInstrument);
    setSelectedData(dayData);
    setShowDataPanel(true);
  };

  const handleCloseDataPanel = () => {
    setShowDataPanel(false);
    setSelectedDate(null);
    setSelectedData(null);
  };

  const getMarketStatus = () => {
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const hour = now.getHours();
    const isMarketHours = hour >= 9 && hour < 16;
    
    if (selectedInstrument.includes('BTC') || selectedInstrument.includes('ETH')) {
      return { status: 'Open', color: 'bg-trading-bull' }; // Crypto markets always open
    }
    
    if (isWeekend || !isMarketHours) {
      return { status: 'Closed', color: 'bg-muted' };
    }
    
    return { status: 'Open', color: 'bg-trading-bull' };
  };

  const marketStatus = getMarketStatus();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Market Seasonality Explorer</h1>
                  <p className="text-sm text-muted-foreground">Interactive volatility & performance analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant="outline" 
                className={`${marketStatus.color} text-white border-none animate-pulse`}
              >
                Market {marketStatus.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold text-foreground">$45,234.67</p>
                <p className="text-sm text-trading-bull">+2.34% (24h)</p>
              </div>
              <TrendingUp className="h-8 w-8 text-trading-bull" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volatility</p>
                <p className="text-2xl font-bold text-foreground">3.45%</p>
                <p className="text-sm text-volatility-medium">Medium Risk</p>
              </div>
              <Activity className="h-8 w-8 text-volatility-medium" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold text-foreground">$1.2B</p>
                <p className="text-sm text-primary">High Liquidity</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold text-foreground">$890B</p>
                <p className="text-sm text-trading-neutral">Rank #1</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">₿</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <ViewControls
          view={view}
          setView={setView}
          instrument={selectedInstrument}
          setInstrument={setSelectedInstrument}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />

        {/* Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Calendar
              view={view}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              selectedInstrument={selectedInstrument}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Overview */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fear & Greed Index</span>
                  <span className="text-sm font-medium text-volatility-medium">54 (Neutral)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">VIX Level</span>
                  <span className="text-sm font-medium">18.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dominance</span>
                  <span className="text-sm font-medium">52.4%</span>
                </div>
              </div>
            </div>

            {/* Seasonality Insights */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Seasonality Insights
              </h3>
              <div className="space-y-3">
                <div className="bg-volatility-low/10 border border-volatility-low/20 rounded p-3">
                  <p className="text-sm font-medium text-volatility-low">Q4 Pattern Detected</p>
                  <p className="text-xs text-muted-foreground">Historically strong performance</p>
                </div>
                <div className="bg-volatility-medium/10 border border-volatility-medium/20 rounded p-3">
                  <p className="text-sm font-medium text-volatility-medium">Increased Volatility</p>
                  <p className="text-xs text-muted-foreground">November typically volatile</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Set Price Alert
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Export Analysis
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Share Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-card/50 border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">1</div>
              <div>
                <p className="font-medium text-foreground">Select Instrument</p>
                <p>Choose from stocks, crypto, or ETFs to analyze</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">2</div>
              <div>
                <p className="font-medium text-foreground">Pick View Mode</p>
                <p>Switch between daily, weekly, or monthly analysis</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">3</div>
              <div>
                <p className="font-medium text-foreground">Click Dates</p>
                <p>Click any date to see detailed market analysis</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Data Panel Modal */}
      {showDataPanel && (
        <DataPanel
          selectedDate={selectedDate}
          data={selectedData}
          onClose={handleCloseDataPanel}
          instrument={selectedInstrument}
        />
      )}
    </div>
  );
};

export default Index;
