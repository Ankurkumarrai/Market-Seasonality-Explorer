import { useState } from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import MetricsChart from './MetricsChart';

const DataPanel = ({ selectedDate, data, onClose, instrument }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!selectedDate || !data) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVolatilityLevel = (volatility) => {
    if (volatility < 0.02) return { level: 'Low', color: 'bg-volatility-low' };
    if (volatility < 0.05) return { level: 'Medium', color: 'bg-volatility-medium' };
    return { level: 'High', color: 'bg-volatility-high' };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'volatility', label: 'Volatility', icon: Activity },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'liquidity', label: 'Liquidity', icon: DollarSign }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Open:</span>
                <span className="font-medium">${data.open?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">High:</span>
                <span className="font-medium text-performance-positive">${data.high?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Low:</span>
                <span className="font-medium text-performance-negative">${data.low?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Close:</span>
                <span className="font-medium">${data.close?.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Change:</span>
                <span className={`font-medium ${data.priceChange > 0 ? 'text-performance-positive' : 'text-performance-negative'}`}>
                  {data.priceChange > 0 ? '+' : ''}{(data.priceChange * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volume:</span>
                <span className="font-medium">{(data.volume / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volatility:</span>
                <Badge variant="outline" className={getVolatilityLevel(data.volatility).color}>
                  {getVolatilityLevel(data.volatility).level}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MetricsChart data={data} type="overview" />
    </div>
  );

  const renderVolatilityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Volatility Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Daily Volatility</span>
              <span className="font-medium">{(data.volatility * 100).toFixed(2)}%</span>
            </div>
            <Progress value={data.volatility * 200} className="h-2" />
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-volatility-low">{Math.floor(Math.random() * 30 + 10)}</div>
                <div className="text-sm text-muted-foreground">Low Vol Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-volatility-medium">{Math.floor(Math.random() * 20 + 5)}</div>
                <div className="text-sm text-muted-foreground">Med Vol Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-volatility-high">{Math.floor(Math.random() * 10 + 2)}</div>
                <div className="text-sm text-muted-foreground">High Vol Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MetricsChart data={data} type="volatility" />
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Daily Return:</span>
                <span className={`font-medium ${data.priceChange > 0 ? 'text-performance-positive' : 'text-performance-negative'}`}>
                  {(data.priceChange * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Weekly Return:</span>
                <span className="font-medium text-performance-positive">+2.34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Return:</span>
                <span className="font-medium text-performance-negative">-1.12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Risk Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Beta:</span>
                <span className="font-medium">1.23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sharpe Ratio:</span>
                <span className="font-medium">0.87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Max Drawdown:</span>
                <span className="font-medium text-performance-negative">-5.67%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MetricsChart data={data} type="performance" />
    </div>
  );

  const renderLiquidityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Liquidity Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{(data.volume / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Trading Volume</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${(data.volume * data.close / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Dollar Volume</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Daily Volume:</span>
                <span className="font-medium">{(data.volume * 0.85 / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Volume Ratio:</span>
                <span className="font-medium">1.18x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bid-Ask Spread:</span>
                <span className="font-medium">0.02%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MetricsChart data={data} type="liquidity" />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'volatility': return renderVolatilityTab();
      case 'performance': return renderPerformanceTab();
      case 'liquidity': return renderLiquidityTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">{instrument} - Market Analysis</h2>
            <p className="text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex border-b border-border">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'text-primary border-b-2 border-primary bg-primary/5' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DataPanel;