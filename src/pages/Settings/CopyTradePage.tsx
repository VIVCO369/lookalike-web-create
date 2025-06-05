import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Sidebar from '../../components/Sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  DollarSign, 
  BarChart3,
  Eye,
  UserPlus,
  Settings,
  Shield,
  AlertCircle
} from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  winRate: number;
  totalProfit: number;
  followers: number;
  rating: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  strategy: string;
  isFollowing: boolean;
  copyAmount: number;
}

interface CopyTradeSettings {
  enabled: boolean;
  maxCopyAmount: number;
  stopLossPercentage: number;
  maxDailyLoss: number;
  autoStopOnLoss: boolean;
}

const CopyTradePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [copySettings, setCopySettings] = useLocalStorage<CopyTradeSettings>('copyTradeSettings', {
    enabled: false,
    maxCopyAmount: 100,
    stopLossPercentage: 10,
    maxDailyLoss: 200,
    autoStopOnLoss: true
  });

  const [traders, setTraders] = useLocalStorage<Trader[]>('availableTraders', [
    {
      id: '1',
      name: 'Alex Thompson',
      avatar: '/api/placeholder/40/40',
      winRate: 78.5,
      totalProfit: 12450,
      followers: 1250,
      rating: 4.8,
      riskLevel: 'Medium',
      strategy: 'Scalping',
      isFollowing: false,
      copyAmount: 50
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      winRate: 82.3,
      totalProfit: 18750,
      followers: 2100,
      rating: 4.9,
      riskLevel: 'Low',
      strategy: 'Swing Trading',
      isFollowing: true,
      copyAmount: 75
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      avatar: '/api/placeholder/40/40',
      winRate: 71.2,
      totalProfit: 9800,
      followers: 850,
      rating: 4.6,
      riskLevel: 'High',
      strategy: 'Day Trading',
      isFollowing: false,
      copyAmount: 25
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: '/api/placeholder/40/40',
      winRate: 85.1,
      totalProfit: 22100,
      followers: 3200,
      rating: 4.9,
      riskLevel: 'Medium',
      strategy: 'Trend Following',
      isFollowing: true,
      copyAmount: 100
    }
  ]);

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

  const updateSettings = (key: keyof CopyTradeSettings, value: any) => {
    setCopySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleFollowTrader = (traderId: string) => {
    setTraders(prev => prev.map(trader => 
      trader.id === traderId 
        ? { ...trader, isFollowing: !trader.isFollowing }
        : trader
    ));
  };

  const updateCopyAmount = (traderId: string, amount: number) => {
    setTraders(prev => prev.map(trader => 
      trader.id === traderId 
        ? { ...trader, copyAmount: amount }
        : trader
    ));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Copy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Copy Trade</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Follow and copy successful traders</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-900 dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Copy Trade Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-500" />
                    Copy Trade Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Enable Copy Trading</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow copying trades from followed traders
                      </p>
                    </div>
                    <Switch
                      checked={copySettings.enabled}
                      onCheckedChange={(checked) => updateSettings('enabled', checked)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="maxCopyAmount">Max Copy Amount ($)</Label>
                      <Input
                        id="maxCopyAmount"
                        type="number"
                        value={copySettings.maxCopyAmount}
                        onChange={(e) => updateSettings('maxCopyAmount', parseFloat(e.target.value))}
                        placeholder="100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                      <Input
                        id="stopLoss"
                        type="number"
                        value={copySettings.stopLossPercentage}
                        onChange={(e) => updateSettings('stopLossPercentage', parseFloat(e.target.value))}
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxDailyLoss">Max Daily Loss ($)</Label>
                      <Input
                        id="maxDailyLoss"
                        type="number"
                        value={copySettings.maxDailyLoss}
                        onChange={(e) => updateSettings('maxDailyLoss', parseFloat(e.target.value))}
                        placeholder="200"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={copySettings.autoStopOnLoss}
                        onCheckedChange={(checked) => updateSettings('autoStopOnLoss', checked)}
                      />
                      <Label className="text-sm">Auto stop on loss</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Traders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Top Traders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {traders.map((trader) => (
                      <motion.div
                        key={trader.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={trader.avatar} alt={trader.name} />
                              <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{trader.name}</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs">{trader.rating}</span>
                                </div>
                                <Badge className={`text-xs ${getRiskColor(trader.riskLevel)}`}>
                                  {trader.riskLevel} Risk
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={trader.isFollowing ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleFollowTrader(trader.id)}
                          >
                            {trader.isFollowing ? 'Unfollow' : 'Follow'}
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{trader.winRate}%</div>
                            <div className="text-xs text-gray-500">Win Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">${trader.totalProfit.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Total Profit</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{trader.followers}</div>
                            <div className="text-xs text-gray-500">Followers</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Strategy: {trader.strategy}</span>
                          {trader.isFollowing && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Copy Amount:</Label>
                              <Input
                                type="number"
                                value={trader.copyAmount}
                                onChange={(e) => updateCopyAmount(trader.id, parseFloat(e.target.value))}
                                className="w-20 h-8 text-xs"
                                min="1"
                                max={copySettings.maxCopyAmount}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Copies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Active Copy Trades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {traders.filter(t => t.isFollowing).length > 0 ? (
                    <div className="space-y-3">
                      {traders.filter(t => t.isFollowing).map((trader) => (
                        <div key={trader.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{trader.name}</div>
                              <div className="text-xs text-gray-500">Copy Amount: ${trader.copyAmount}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Copy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No active copy trades</p>
                      <p className="text-sm">Follow traders to start copying their trades</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">Risk Disclosure</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Copy trading involves substantial risk of loss. Past performance does not guarantee future results. 
                        You should carefully consider whether copy trading is suitable for you in light of your financial situation.
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

export default CopyTradePage;
