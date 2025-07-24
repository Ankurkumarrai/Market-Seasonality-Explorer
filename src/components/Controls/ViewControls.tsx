import { Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ViewControls = ({ view, setView, instrument, setInstrument, timeframe, setTimeframe }) => {
  const instruments = [
    { value: 'BTC-USD', label: 'Bitcoin (BTC-USD)' },
    { value: 'ETH-USD', label: 'Ethereum (ETH-USD)' },
    { value: 'AAPL', label: 'Apple Inc. (AAPL)' },
    { value: 'TSLA', label: 'Tesla Inc. (TSLA)' },
    { value: 'SPY', label: 'SPDR S&P 500 (SPY)' },
    { value: 'QQQ', label: 'Invesco QQQ (QQQ)' }
  ];

  const viewModes = [
    { value: 'daily', label: 'Daily View', icon: Calendar },
    { value: 'weekly', label: 'Weekly View', icon: BarChart3 },
    { value: 'monthly', label: 'Monthly View', icon: TrendingUp }
  ];

  const timeframes = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: '1Y', label: '1 Year' },
    { value: '2Y', label: '2 Years' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Instrument Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Financial Instrument</label>
          <Select value={instrument} onValueChange={setInstrument}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select instrument" />
            </SelectTrigger>
            <SelectContent>
              {instruments.map(inst => (
                <SelectItem key={inst.value} value={inst.value}>
                  {inst.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">View Mode</label>
          <div className="flex space-x-1 bg-background rounded-lg p-1 border border-border">
            {viewModes.map(mode => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.value}
                  variant={view === mode.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView(mode.value)}
                  className="flex-1 gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{mode.label.split(' ')[0]}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Timeframe */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Timeframe</label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map(tf => (
                <SelectItem key={tf.value} value={tf.value}>
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Legend/Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Legend</label>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-volatility-low rounded"></div>
              <span className="text-xs text-muted-foreground">Low Vol</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-volatility-medium rounded"></div>
              <span className="text-xs text-muted-foreground">Med Vol</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-volatility-high rounded"></div>
              <span className="text-xs text-muted-foreground">High Vol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewControls;