import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CalendarCell = ({ date, isCurrentMonth, data, onSelect, isSelected, view }) => {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  const getVolatilityColor = (volatility) => {
    if (!volatility) return 'bg-calendar-cell';
    if (volatility < 0.02) return 'bg-volatility-low/20 border-volatility-low/50';
    if (volatility < 0.05) return 'bg-volatility-medium/20 border-volatility-medium/50';
    return 'bg-volatility-high/20 border-volatility-high/50';
  };

  const getPerformanceIcon = (change) => {
    if (!change || Math.abs(change) < 0.001) {
      return <Minus className="h-3 w-3 text-performance-neutral" />;
    }
    if (change > 0) {
      return <TrendingUp className="h-3 w-3 text-performance-positive" />;
    }
    return <TrendingDown className="h-3 w-3 text-performance-negative" />;
  };

  const getLiquidityBarHeight = (volume) => {
    if (!volume) return 0;
    const normalizedVolume = Math.min(volume / 1000000, 1); // Normalize to 0-1
    return normalizedVolume * 100;
  };

  const handleClick = () => {
    onSelect(date);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(date);
    }
  };

  return (
    <div
      className={cn(
        'relative h-20 p-2 rounded-lg border cursor-pointer transition-all duration-300',
        'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        getVolatilityColor(data?.volatility),
        isSelected && 'ring-2 ring-primary border-primary',
        isToday && 'ring-1 ring-accent border-accent',
        !isCurrentMonth && 'opacity-40',
        'group'
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${date.toLocaleDateString()} - ${data ? 'Market data available' : 'No data'}`}
    >
      {/* Date Number */}
      <div className={cn(
        'text-sm font-medium mb-1',
        isToday ? 'text-accent' : 'text-foreground',
        !isCurrentMonth && 'text-muted-foreground'
      )}>
        {date.getDate()}
      </div>

      {/* Market Data Visualization */}
      {data && (
        <div className="absolute inset-2 top-6 space-y-1">
          {/* Performance Indicator */}
          <div className="flex items-center justify-between">
            {getPerformanceIcon(data.priceChange)}
            {data.priceChange && (
              <span className={cn(
                'text-xs font-medium',
                data.priceChange > 0 ? 'text-performance-positive' : 'text-performance-negative'
              )}>
                {Math.abs(data.priceChange * 100).toFixed(1)}%
              </span>
            )}
          </div>

          {/* Liquidity Bar */}
          {data.volume && (
            <div className="flex items-end space-x-1 h-4">
              <div 
                className="bg-primary/60 w-1 rounded-sm transition-all duration-300 group-hover:bg-primary"
                style={{ height: `${getLiquidityBarHeight(data.volume)}%` }}
              />
              <div 
                className="bg-primary/40 w-1 rounded-sm transition-all duration-300 group-hover:bg-primary/80"
                style={{ height: `${getLiquidityBarHeight(data.volume * 0.8)}%` }}
              />
              <div 
                className="bg-primary/20 w-1 rounded-sm transition-all duration-300 group-hover:bg-primary/60"
                style={{ height: `${getLiquidityBarHeight(data.volume * 0.6)}%` }}
              />
            </div>
          )}

          {/* Volume Icon for Weekly/Monthly Views */}
          {(view === 'weekly' || view === 'monthly') && data.volume && (
            <div className="absolute top-0 right-0">
              <BarChart3 className="h-3 w-3 text-primary/60" />
            </div>
          )}
        </div>
      )}

      {/* Today Indicator */}
      {isToday && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse" />
      )}

      {/* Hover Tooltip Preview */}
      {data && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        bg-card border border-border rounded p-2 text-xs whitespace-nowrap z-10
                        shadow-lg">
          <div>Vol: {(data.volatility * 100).toFixed(1)}%</div>
          <div>Price: {data.priceChange > 0 ? '+' : ''}{(data.priceChange * 100).toFixed(2)}%</div>
          {data.volume && <div>Vol: {(data.volume / 1000000).toFixed(1)}M</div>}
        </div>
      )}
    </div>
  );
};

export default CalendarCell;