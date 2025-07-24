import { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const AlertPanel = ({ isOpen, onClose, alerts, setAlerts, selectedInstrument }) => {
  const [newAlert, setNewAlert] = useState({
    type: 'volatility',
    condition: 'above',
    value: '',
    instrument: selectedInstrument
  });
  const { toast } = useToast();

  const alertTypes = [
    { value: 'volatility', label: 'Volatility (%)', unit: '%' },
    { value: 'price', label: 'Price Change (%)', unit: '%' },
    { value: 'volume', label: 'Volume (M)', unit: 'M' },
    { value: 'rsi', label: 'RSI', unit: '' }
  ];

  const conditions = [
    { value: 'above', label: 'Above' },
    { value: 'below', label: 'Below' }
  ];

  const addAlert = () => {
    if (!newAlert.value) {
      toast({
        title: "Error",
        description: "Please enter a value for the alert.",
        variant: "destructive"
      });
      return;
    }

    const alert = {
      id: Date.now(),
      ...newAlert,
      value: parseFloat(newAlert.value),
      created: new Date(),
      triggered: false
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      type: 'volatility',
      condition: 'above',
      value: '',
      instrument: selectedInstrument
    });

    toast({
      title: "Alert Created",
      description: `Alert set for ${alert.instrument} ${alert.type} ${alert.condition} ${alert.value}${alertTypes.find(t => t.value === alert.type)?.unit || ''}`,
    });
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Removed",
      description: "Alert has been deleted.",
    });
  };

  const getAlertIcon = (type, condition) => {
    if (condition === 'above') {
      return <TrendingUp className="h-4 w-4" />;
    }
    return <TrendingDown className="h-4 w-4" />;
  };

  const getAlertBadge = (alert) => {
    const variant = alert.triggered ? 'destructive' : 'secondary';
    return variant;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Management
          </DialogTitle>
          <DialogDescription>
            Set up alerts for market conditions and volatility thresholds
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Create New Alert */}
          <div className="space-y-4 p-4 border border-border rounded-lg">
            <h3 className="font-medium">Create New Alert</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Metric</label>
                <Select value={newAlert.type} onValueChange={(value) => setNewAlert({...newAlert, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alertTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}</SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Condition</label>
                <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({...newAlert, condition: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  type="number"
                  placeholder="Enter threshold value"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert({...newAlert, value: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addAlert} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Alerts */}
          <div className="space-y-3">
            <h3 className="font-medium">Active Alerts ({alerts.length})</h3>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No alerts configured
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type, alert.condition)}
                      <div>
                        <div className="font-medium text-sm">
                          {alert.instrument} {alertTypes.find(t => t.value === alert.type)?.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {alert.condition} {alert.value}{alertTypes.find(t => t.value === alert.type)?.unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={getAlertBadge(alert)}>
                        {alert.triggered ? 'Triggered' : 'Active'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

export default AlertPanel;
