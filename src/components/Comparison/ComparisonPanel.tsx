import { useState } from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDayData } from '@/utils/marketData';

const ComparisonPanel = ({ isOpen, onClose, selectedDate, selectedInstrument, view }) => {
  const [comparisonInstruments, setComparisonInstruments] = useState([selectedInstrument]);
  const [newInstrument, setNewInstrument] = useState('');

  const instruments = [
    { value: 'BTC-USD', label: 'Bitcoin (BTC-USD)' },
    { value: 'ETH-USD', label: 'Ethereum (ETH-USD)' },
    { value: 'AAPL', label: 'Apple Inc. (AAPL)' },
    { value: 'TSLA', label: 'Tesla Inc. (TSLA)' },
    { value: 'SPY', label: 'SPDR S&P 500 (SPY)' },
    { value: 'QQQ', label: 'Invesco QQQ (QQQ)' }
  ];

  const addInstrument = () => {
    if (newInstrument && !comparisonInstruments.includes(newInstrument)) {
      setComparisonInstruments([...comparisonInstruments, newInstrument]);
      setNewInstrument('');
    }
  };

  const removeInstrument = (instrument) => {
    setComparisonInstruments(comparisonInstruments.filter(i => i !== instrument));
  };

  const getComparisonData = (instrument) => {
    return generateDayData(selectedDate, instrument);
  };

  const getPerformanceColor = (change) => {
    if (change > 0) return 'text-performance-positive';
    if (change < 0) return 'text-performance-negative';
    return 'text-performance-neutral';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Comparison
          </DialogTitle>
          <DialogDescription>
            Compare multiple instruments for {selectedDate.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Add Instrument */}
          <div className="flex gap-2">
            <Select value={newInstrument} onValueChange={setNewInstrument}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select instrument to add" />
              </SelectTrigger>
              <SelectContent>
                {instruments
                  .filter(inst => !comparisonInstruments.includes(inst.value))
                  .map((inst) => (
                    <SelectItem key={inst.value} value={inst.value}>
                      {inst.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={addInstrument} disabled={!newInstrument}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Selections */}
          <div className="flex flex-wrap gap-2">
            {comparisonInstruments.map((instrument) => (
              <Badge 
                key={instrument} 
                variant="secondary" 
                className="gap-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeInstrument(instrument)}
              >
                {instrument}
                {comparisonInstruments.length > 1 && <span>×</span>}
              </Badge>
            ))}
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisonInstruments.map((instrument) => {
              const data = getComparisonData(instrument);
              return (
                <Card key={instrument} className={instrument === selectedInstrument ? 'ring-2 ring-primary' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {instrument}
                      {instrument === selectedInstrument && (
                        <Badge variant="outline">Selected</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Price Change</div>
                        <div className={`font-medium ${getPerformanceColor(data.priceChange)}`}>
                          {data.priceChange > 0 ? '+' : ''}{(data.priceChange * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Volatility</div>
                        <div className="font-medium">
                          {(data.volatility * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Volume</div>
                        <div className="font-medium">
                          {(data.volume / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">RSI</div>
                        <div className="font-medium">
                          {data.rsi.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-muted-foreground text-xs">OHLC</div>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div>
                          <div className="text-muted-foreground">Open</div>
                          <div className="font-medium">{data.open.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">High</div>
                          <div className="font-medium text-performance-positive">{data.high.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Low</div>
                          <div className="font-medium text-performance-negative">{data.low.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Close</div>
                          <div className="font-medium">{data.close.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Volatility Visual Bar */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Volatility Level</div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            data.volatility < 0.02 ? 'bg-volatility-low' :
                            data.volatility < 0.05 ? 'bg-volatility-medium' : 'bg-volatility-high'
                          }`}
                          style={{ width: `${Math.min(data.volatility * 1000, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Summary */}
          {comparisonInstruments.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Comparison Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Best Performer</div>
                    <div className="font-medium text-performance-positive">
                      {comparisonInstruments.reduce((best, current) => {
                        const bestData = getComparisonData(best);
                        const currentData = getComparisonData(current);
                        return currentData.priceChange > bestData.priceChange ? current : best;
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Worst Performer</div>
                    <div className="font-medium text-performance-negative">
                      {comparisonInstruments.reduce((worst, current) => {
                        const worstData = getComparisonData(worst);
                        const currentData = getComparisonData(current);
                        return currentData.priceChange < worstData.priceChange ? current : worst;
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Highest Volume</div>
                    <div className="font-medium">
                      {comparisonInstruments.reduce((highest, current) => {
                        const highestData = getComparisonData(highest);
                        const currentData = getComparisonData(current);
                        return currentData.volume > highestData.volume ? current : highest;
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Most Volatile</div>
                    <div className="font-medium">
                      {comparisonInstruments.reduce((mostVolatile, current) => {
                        const mostVolatileData = getComparisonData(mostVolatile);
                        const currentData = getComparisonData(current);
                        return currentData.volatility > mostVolatileData.volatility ? current : mostVolatile;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonPanel;