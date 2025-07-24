import { useState } from 'react';
import { Download, FileText, Image, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const ExportPanel = ({ isOpen, onClose, selectedDate, selectedDateRange, selectedInstrument, view }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeData, setIncludeData] = useState(true);
  const [includeAnalysis, setIncludeAnalysis] = useState(false);
  const { toast } = useToast();

  const exportFormats = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'png', label: 'PNG Image', icon: Image },
    { value: 'csv', label: 'CSV Data', icon: Table },
  ];

  const handleExport = () => {
    // Simulate export functionality
    const dateRange = selectedDateRange 
      ? `${selectedDateRange.start.toLocaleDateString()} - ${selectedDateRange.end.toLocaleDateString()}`
      : selectedDate.toLocaleDateString();
    
    toast({
      title: "Export Started",
      description: `Exporting ${selectedInstrument} data for ${dateRange} as ${exportFormat.toUpperCase()}`,
    });

    // Simulate download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `market-data-${selectedInstrument}-${Date.now()}.${exportFormat}`;
      
      toast({
        title: "Export Complete",
        description: "Your file has been downloaded successfully.",
      });
      
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Market Data
          </DialogTitle>
          <DialogDescription>
            Export calendar data and analysis for {selectedInstrument}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {format.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Include in Export</label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="charts" 
                checked={includeCharts} 
                onCheckedChange={(checked) => setIncludeCharts(checked === true)}
              />
              <label htmlFor="charts" className="text-sm">
                Charts and visualizations
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data" 
                checked={includeData} 
                onCheckedChange={(checked) => setIncludeData(checked === true)}
              />
              <label htmlFor="data" className="text-sm">
                Raw market data
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="analysis" 
                checked={includeAnalysis} 
                onCheckedChange={(checked) => setIncludeAnalysis(checked === true)}
              />
              <label htmlFor="analysis" className="text-sm">
                Technical analysis and indicators
              </label>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
            {selectedDateRange ? (
              <div>
                <strong>Date Range:</strong> {selectedDateRange.start.toLocaleDateString()} - {selectedDateRange.end.toLocaleDateString()}
              </div>
            ) : (
              <div>
                <strong>Selected Date:</strong> {selectedDate.toLocaleDateString()}
              </div>
            )}
            <div><strong>Instrument:</strong> {selectedInstrument}</div>
            <div><strong>View:</strong> {view}</div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPanel;