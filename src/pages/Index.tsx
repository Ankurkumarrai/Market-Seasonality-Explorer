import { useState, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Calendar from '@/components/Calendar/Calendar';
import ViewControls from '@/components/Controls/ViewControls';
import DataPanel from '@/components/Dashboard/DataPanel';
import ExportPanel from '@/components/Export/ExportPanel';
import AlertPanel from '@/components/Alerts/AlertPanel';
import ComparisonPanel from '@/components/Comparison/ComparisonPanel';
import ThemeSelector from '@/components/Theme/ThemeSelector';
import { Button } from '@/components/ui/button';
import { Download, Bell, BarChart3, Maximize2, Minimize2 } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState('daily');
  const [selectedInstrument, setSelectedInstrument] = useState('BTC-USD');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [timeframe, setTimeframe] = useState('1M');
  const [colorScheme, setColorScheme] = useState('default');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [showComparisonPanel, setShowComparisonPanel] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleDateRangeSelect = useCallback((range) => {
    setSelectedDateRange(range);
  }, []);

  return (
    <div className={`min-h-screen bg-background transition-all duration-300 ${colorScheme}`}>
      <div className="container mx-auto p-6">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 animate-fade-in">
              Market Seasonality Explorer
            </h1>
            <p className="text-muted-foreground text-lg">
              Interactive calendar for visualizing historical volatility, liquidity, and performance data
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <ThemeSelector colorScheme={colorScheme} setColorScheme={setColorScheme} />
            <Button variant="outline" size="sm" onClick={() => setShowExportPanel(true)} className="gap-2">
              <Download className="h-4 w-4" />Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAlertPanel(true)} className="gap-2">
              <Bell className="h-4 w-4" />Alerts
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowComparisonPanel(true)} className="gap-2">
              <BarChart3 className="h-4 w-4" />Compare
            </Button>
          </div>
        </div>

        <ViewControls
          view={view}
          setView={setView}
          instrument={selectedInstrument}
          setInstrument={setSelectedInstrument}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Calendar
              view={view}
              selectedDate={selectedDate}
              selectedDateRange={selectedDateRange}
              onDateSelect={handleDateSelect}
              onDateRangeSelect={handleDateRangeSelect}
              selectedInstrument={selectedInstrument}
              colorScheme={colorScheme}
              zoomLevel={zoomLevel}
            />
          </div>
          
          <div className="xl:col-span-1">
            <DataPanel
              selectedDate={selectedDate}
              selectedDateRange={selectedDateRange}
              selectedInstrument={selectedInstrument}
              view={view}
              timeframe={timeframe}
            />
          </div>
        </div>

        <ExportPanel
          isOpen={showExportPanel}
          onClose={() => setShowExportPanel(false)}
          selectedDate={selectedDate}
          selectedDateRange={selectedDateRange}
          selectedInstrument={selectedInstrument}
          view={view}
        />

        <AlertPanel
          isOpen={showAlertPanel}
          onClose={() => setShowAlertPanel(false)}
          alerts={alerts}
          setAlerts={setAlerts}
          selectedInstrument={selectedInstrument}
        />

        <ComparisonPanel
          isOpen={showComparisonPanel}
          onClose={() => setShowComparisonPanel(false)}
          selectedDate={selectedDate}
          selectedInstrument={selectedInstrument}
          view={view}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;