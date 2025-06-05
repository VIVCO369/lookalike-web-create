import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Sidebar from '../../components/Sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Settings, 
  Play, 
  Pause, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Target,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface AutoTradeSettings {
  enabled: boolean;
  strategy: string;
  riskLevel: string;
  maxDailyLoss: number;
  maxDailyProfit: number;
  tradeAmount: number;
  stopLoss: number;
  takeProfit: number;
  maxConcurrentTrades: number;
  tradingHours: {
    start: string;
    end: string;
  };
  allowedSymbols: string[];
}

const AutoTradePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [autoTradeSettings, setAutoTradeSettings] = useLocalStorage<AutoTradeSettings>('autoTradeSettings', {
    enabled: false,
    strategy: 'conservative',
    riskLevel: 'low',
    maxDailyLoss: 100,
    maxDailyProfit: 500,
    tradeAmount: 10,
    stopLoss: 50,
    takeProfit: 100,
    maxConcurrentTrades: 3,
    tradingHours: {
      start: '09:00',
      end: '17:00'
    },
    allowedSymbols: ['R_100', 'R_75', 'R_50']
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const updateSettings = (key: keyof AutoTradeSettings, value: any) => {
    setAutoTradeSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateTradingHours = (key: 'start' | 'end', value: string) => {
    setAutoTradeSettings(prev => ({
      ...prev,
      tradingHours: {
        ...prev.tradingHours,
        [key]: value
      }
    }));
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">VivCo AI Bot</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Auto Trade - Automated trading configuration</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-900 dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Auto Trade Status
                    </CardTitle>
                    <Badge variant={autoTradeSettings.enabled ? "default" : "secondary"} className="px-3 py-1">
                      {autoTradeSettings.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Enable automated trading based on your configured strategy
                      </p>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={autoTradeSettings.enabled}
                          onCheckedChange={(checked) => updateSettings('enabled', checked)}
                        />
                        <span className="text-sm font-medium">
                          {autoTradeSettings.enabled ? 'Auto Trading Enabled' : 'Auto Trading Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={autoTradeSettings.enabled ? "destructive" : "default"}
                        size="sm"
                        onClick={() => updateSettings('enabled', !autoTradeSettings.enabled)}
                      >
                        {autoTradeSettings.enabled ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Strategy Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Trading Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="strategy">Strategy Type</Label>
                      <Select value={autoTradeSettings.strategy} onValueChange={(value) => updateSettings('strategy', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                          <SelectItem value="scalping">Scalping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Select value={autoTradeSettings.riskLevel} onValueChange={(value) => updateSettings('riskLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    Risk Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxDailyLoss">Max Daily Loss ($)</Label>
                      <Input
                        id="maxDailyLoss"
                        type="number"
                        value={autoTradeSettings.maxDailyLoss}
                        onChange={(e) => updateSettings('maxDailyLoss', parseFloat(e.target.value))}
                        placeholder="100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxDailyProfit">Max Daily Profit ($)</Label>
                      <Input
                        id="maxDailyProfit"
                        type="number"
                        value={autoTradeSettings.maxDailyProfit}
                        onChange={(e) => updateSettings('maxDailyProfit', parseFloat(e.target.value))}
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stopLoss">Stop Loss ($)</Label>
                      <Input
                        id="stopLoss"
                        type="number"
                        value={autoTradeSettings.stopLoss}
                        onChange={(e) => updateSettings('stopLoss', parseFloat(e.target.value))}
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="takeProfit">Take Profit ($)</Label>
                      <Input
                        id="takeProfit"
                        type="number"
                        value={autoTradeSettings.takeProfit}
                        onChange={(e) => updateSettings('takeProfit', parseFloat(e.target.value))}
                        placeholder="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trade Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    Trade Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tradeAmount">Trade Amount ($)</Label>
                      <Input
                        id="tradeAmount"
                        type="number"
                        value={autoTradeSettings.tradeAmount}
                        onChange={(e) => updateSettings('tradeAmount', parseFloat(e.target.value))}
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxConcurrentTrades">Max Concurrent Trades</Label>
                      <Input
                        id="maxConcurrentTrades"
                        type="number"
                        value={autoTradeSettings.maxConcurrentTrades}
                        onChange={(e) => updateSettings('maxConcurrentTrades', parseInt(e.target.value))}
                        placeholder="3"
                      />
                    </div>

                    <div>
                      <Label htmlFor="startTime">Trading Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={autoTradeSettings.tradingHours.start}
                        onChange={(e) => updateTradingHours('start', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="endTime">Trading End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={autoTradeSettings.tradingHours.end}
                        onChange={(e) => updateTradingHours('end', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">Important Notice</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Auto trading involves significant risk. Please ensure you understand the risks involved and never trade with money you cannot afford to lose. 
                        Monitor your trades regularly and adjust settings as needed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AutoTradePage;
