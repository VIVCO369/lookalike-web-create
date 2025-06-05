import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Sidebar from '../../components/Sidebar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Settings,
  Play,
  Square,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Shield,
  Zap,
  BarChart3,
  Activity,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Info,
  Percent,
  Hash,
  Timer,
  Coins
} from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';

// Trading Bot Interfaces
interface TradingConfig {
  symbol: string;
  predictionMode: 'fixed' | 'alternating';
  fixedDigit: number;
  alternatingDigits: [number, number];
  martingaleStart: number;
  martingaleMultiplier: number;
  maxMartingaleLevels: number;
  targetProfit: number;
  stopLoss: number;
  initialStake: number;
  credits: number;
}

interface TradeResult {
  id: string;
  timestamp: Date;
  digit: number;
  prediction: number;
  result: 'win' | 'loss';
  stake: number;
  payout: number;
  profit: number;
  martingaleLevel: number;
  balance: number;
}

interface TradingStats {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  currentProfit: number;
  currentStake: number;
  martingaleLevel: number;
  isActive: boolean;
  status: 'stopped' | 'running' | 'target_reached' | 'stop_loss_hit';
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'success' | 'error' | 'info';
  message: string;
  profit?: number;
}

const AutoTradePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Trading Configuration
  const [config, setConfig] = useLocalStorage<TradingConfig>('vivcoAI_config', {
    symbol: '1HZ75V',
    predictionMode: 'fixed',
    fixedDigit: 5,
    alternatingDigits: [3, 7],
    martingaleStart: 2,
    martingaleMultiplier: 1.7,
    maxMartingaleLevels: 5,
    targetProfit: 100,
    stopLoss: 50,
    initialStake: 1,
    credits: 7
  });

  // Trading Statistics
  const [stats, setStats] = useLocalStorage<TradingStats>('vivcoAI_stats', {
    totalTrades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentProfit: 0,
    currentStake: 1,
    martingaleLevel: 0,
    isActive: false,
    status: 'stopped'
  });

  // Activity Logs
  const [activityLogs, setActivityLogs] = useLocalStorage<ActivityLog[]>('vivcoAI_logs', []);

  // Trade History
  const [tradeHistory, setTradeHistory] = useLocalStorage<TradeResult[]>('vivcoAI_history', []);

  // Manual prediction override
  const [manualPrediction, setManualPrediction] = useState<number | null>(null);

  // Trading interval ref
  const tradingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Utility Functions
  const addLog = (type: 'success' | 'error' | 'info', message: string, profit?: number) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
      profit
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  const clearLogs = () => {
    setActivityLogs([]);
  };

  const resetStats = () => {
    setStats({
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      currentProfit: 0,
      currentStake: config.initialStake,
      martingaleLevel: 0,
      isActive: false,
      status: 'stopped'
    });
    setTradeHistory([]);
    addLog('info', 'Statistics reset successfully');
  };

  const getNextPrediction = (): number => {
    if (manualPrediction !== null) {
      const prediction = manualPrediction;
      setManualPrediction(null);
      return prediction;
    }

    if (config.predictionMode === 'fixed') {
      return config.fixedDigit;
    } else {
      // Alternating mode - use trade count to determine which digit
      return stats.totalTrades % 2 === 0
        ? config.alternatingDigits[0]
        : config.alternatingDigits[1];
    }
  };

  const calculateStake = (): number => {
    if (stats.martingaleLevel === 0) {
      return config.initialStake;
    }
    return config.initialStake * Math.pow(config.martingaleMultiplier, stats.martingaleLevel);
  };

  // Simulated trading function (replace with real Deriv API)
  const executeTrade = async (): Promise<TradeResult> => {
    const prediction = getNextPrediction();
    const stake = calculateStake();

    // Simulate random digit (0-9)
    const actualDigit = Math.floor(Math.random() * 10);
    const isWin = actualDigit > prediction;
    const payout = isWin ? stake * 1.95 : 0;
    const profit = payout - stake;

    const trade: TradeResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      digit: actualDigit,
      prediction,
      result: isWin ? 'win' : 'loss',
      stake,
      payout,
      profit,
      martingaleLevel: stats.martingaleLevel,
      balance: stats.currentProfit + profit
    };

    return trade;
  };

  // Main trading logic
  const processTrade = async () => {
    if (config.credits < 7) {
      addLog('error', 'Insufficient credits. Need 7 credits to trade.');
      stopTrading();
      return;
    }

    try {
      const trade = await executeTrade();

      // Update trade history
      setTradeHistory(prev => [trade, ...prev.slice(0, 99)]);

      // Update statistics
      setStats(prev => {
        const newStats = { ...prev };
        newStats.totalTrades += 1;
        newStats.currentProfit = trade.balance;

        if (trade.result === 'win') {
          newStats.wins += 1;
          newStats.martingaleLevel = 0;
          newStats.currentStake = config.initialStake;

          // Update credits: -7 on win
          setConfig(prevConfig => ({
            ...prevConfig,
            credits: Math.max(0, prevConfig.credits - 7)
          }));

          addLog('success', `Win! Digit: ${trade.digit} > ${trade.prediction}. Profit: +$${trade.profit.toFixed(2)}`, trade.profit);
        } else {
          newStats.losses += 1;

          // Update credits: +1 on loss
          setConfig(prevConfig => ({
            ...prevConfig,
            credits: prevConfig.credits + 1
          }));

          // Handle Martingale
          if (newStats.losses >= config.martingaleStart && newStats.martingaleLevel < config.maxMartingaleLevels) {
            newStats.martingaleLevel += 1;
            newStats.currentStake = config.initialStake * Math.pow(config.martingaleMultiplier, newStats.martingaleLevel);
          }

          addLog('error', `Loss! Digit: ${trade.digit} ≤ ${trade.prediction}. Loss: -$${Math.abs(trade.profit).toFixed(2)}`, trade.profit);
        }

        newStats.winRate = newStats.totalTrades > 0 ? (newStats.wins / newStats.totalTrades) * 100 : 0;

        // Check stop conditions
        if (newStats.currentProfit >= config.targetProfit) {
          newStats.status = 'target_reached';
          newStats.isActive = false;
          addLog('success', `Target profit reached! Stopping trading.`);
          stopTrading();
        } else if (newStats.currentProfit <= -config.stopLoss) {
          newStats.status = 'stop_loss_hit';
          newStats.isActive = false;
          addLog('error', `Stop loss hit! Stopping trading.`);
          stopTrading();
        }

        return newStats;
      });

    } catch (error) {
      addLog('error', `Trade execution failed: ${error}`);
    }
  };

  const startTrading = () => {
    if (config.credits < 7) {
      addLog('error', 'Cannot start trading. Need at least 7 credits.');
      return;
    }

    setStats(prev => ({ ...prev, isActive: true, status: 'running' }));
    addLog('info', 'Vivco AI 8.0 Trading System started');

    tradingIntervalRef.current = setInterval(() => {
      processTrade();
    }, 1500); // 1.5 second intervals
  };

  const stopTrading = () => {
    if (tradingIntervalRef.current) {
      clearInterval(tradingIntervalRef.current);
      tradingIntervalRef.current = null;
    }

    setStats(prev => ({ ...prev, isActive: false, status: 'stopped' }));
    addLog('info', 'Trading stopped');
  };

  // Effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (tradingIntervalRef.current) {
        clearInterval(tradingIntervalRef.current);
      }
    };
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const getStatusColor = () => {
    switch (stats.status) {
      case 'running': return 'bg-green-500';
      case 'target_reached': return 'bg-blue-500';
      case 'stop_loss_hit': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (stats.status) {
      case 'running': return 'Active Trading';
      case 'target_reached': return 'Target Reached';
      case 'stop_loss_hit': return 'Stop Loss Hit';
      default: return 'Stopped';
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
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auto Trade</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vivco AI 8.0 Trading System</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-gray-900 dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-orange-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

            {/* Left Column - Activity Feed (1/3) */}
            <div className="lg:col-span-1 space-y-6">

              {/* Activity Feed */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-400" />
                        Activity Feed
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearLogs}
                        className="text-gray-400 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {activityLogs.slice(0, 20).map((log, index) => (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "p-3 rounded-lg border-l-4 text-sm",
                              log.type === 'success' && "bg-green-900/30 border-green-400",
                              log.type === 'error' && "bg-red-900/30 border-red-400",
                              log.type === 'info' && "bg-blue-900/30 border-blue-400"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {log.type === 'success' && <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />}
                              {log.type === 'error' && <XCircle className="h-4 w-4 text-red-400 mt-0.5" />}
                              {log.type === 'info' && <Info className="h-4 w-4 text-blue-400 mt-0.5" />}
                              <div className="flex-1">
                                <p className="text-gray-200">{log.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {log.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                              {log.profit !== undefined && (
                                <div className={cn(
                                  "text-xs font-bold",
                                  log.profit > 0 ? "text-green-400" : "text-red-400"
                                )}>
                                  {log.profit > 0 ? '+' : ''}${log.profit.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {activityLogs.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No activity yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profit Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-500" />
                      Profit Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">Chart visualization coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Trading Dashboard (2/3) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Target Profit */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-xs font-medium">Target Profit</p>
                          <p className="text-2xl font-bold">${config.targetProfit}</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-200" />
                      </div>
                      <div className="mt-2">
                        <Progress
                          value={Math.max(0, Math.min(100, (stats.currentProfit / config.targetProfit) * 100))}
                          className="h-2 bg-blue-400/30"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Profit */}
                  <Card className={cn(
                    "border-0 shadow-lg text-white overflow-hidden",
                    stats.currentProfit >= 0
                      ? "bg-gradient-to-br from-green-500 to-green-600"
                      : "bg-gradient-to-br from-red-500 to-red-600"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-xs font-medium">Current Profit</p>
                          <p className="text-2xl font-bold">
                            {stats.currentProfit >= 0 ? '+' : ''}${stats.currentProfit.toFixed(2)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-white/70" />
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-white/80">
                          {stats.totalTrades} trades executed
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Stake */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-xs font-medium">Current Stake</p>
                          <p className="text-2xl font-bold">${stats.currentStake.toFixed(2)}</p>
                        </div>
                        <Coins className="h-8 w-8 text-purple-200" />
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-purple-100">
                          Martingale Level: {stats.martingaleLevel}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Win Rate */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-xs font-medium">Win Rate</p>
                          <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
                        </div>
                        <Percent className="h-8 w-8 text-orange-200" />
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-orange-100">
                          {stats.wins}W / {stats.losses}L
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Trade Performance & Control */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Trade Performance
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("px-3 py-1", getStatusColor())}>
                          {getStatusText()}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetStats}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                      {/* Trade Statistics */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Statistics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                            <span className="font-semibold">{stats.totalTrades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Wins:</span>
                            <span className="font-semibold text-green-600">{stats.wins}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Losses:</span>
                            <span className="font-semibold text-red-600">{stats.losses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                            <span className="font-semibold text-orange-600">{config.credits}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Indicators */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Progress</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Target Profit</span>
                              <span>${stats.currentProfit.toFixed(2)} / ${config.targetProfit}</span>
                            </div>
                            <Progress
                              value={Math.max(0, Math.min(100, (stats.currentProfit / config.targetProfit) * 100))}
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Stop Loss</span>
                              <span>${Math.abs(stats.currentProfit).toFixed(2)} / ${config.stopLoss}</span>
                            </div>
                            <Progress
                              value={Math.max(0, Math.min(100, (Math.abs(Math.min(0, stats.currentProfit)) / config.stopLoss) * 100))}
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Win Rate</span>
                              <span>{stats.winRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={stats.winRate} className="h-2" />
                          </div>
                        </div>
                      </div>

                      {/* Trading Control */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Control</h4>
                        <div className="space-y-3">
                          <Button
                            onClick={stats.isActive ? stopTrading : startTrading}
                            disabled={!stats.isActive && config.credits < 7}
                            className={cn(
                              "w-full h-12 text-lg font-bold",
                              stats.isActive
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            )}
                          >
                            {stats.isActive ? (
                              <>
                                <Square className="h-5 w-5 mr-2" />
                                Stop Trading
                              </>
                            ) : (
                              <>
                                <Play className="h-5 w-5 mr-2" />
                                Start Trading
                              </>
                            )}
                          </Button>

                          {!stats.isActive && config.credits < 7 && (
                            <p className="text-sm text-red-500 text-center">
                              Need 7 credits to start trading
                            </p>
                          )}

                          <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Next prediction: {config.predictionMode === 'fixed' ? config.fixedDigit :
                                `${config.alternatingDigits[stats.totalTrades % 2]}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Trading Configuration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-orange-500" />
                      Trading Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Basic Settings */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Basic Settings</h4>

                        <div>
                          <Label>Symbol</Label>
                          <Select
                            value={config.symbol}
                            onValueChange={(value) => setConfig(prev => ({ ...prev, symbol: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1HZ75V">1HZ75V (Volatility 75 1s)</SelectItem>
                              <SelectItem value="1HZ100V">1HZ100V (Volatility 100 1s)</SelectItem>
                              <SelectItem value="1HZ50V">1HZ50V (Volatility 50 1s)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Prediction Mode</Label>
                          <Select
                            value={config.predictionMode}
                            onValueChange={(value: 'fixed' | 'alternating') =>
                              setConfig(prev => ({ ...prev, predictionMode: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed Digit</SelectItem>
                              <SelectItem value="alternating">Alternating Digits</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {config.predictionMode === 'fixed' ? (
                          <div>
                            <Label>Fixed Digit (0-9)</Label>
                            <Select
                              value={config.fixedDigit.toString()}
                              onValueChange={(value) =>
                                setConfig(prev => ({ ...prev, fixedDigit: parseInt(value) }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0,1,2,3,4,5,6,7,8,9].map(digit => (
                                  <SelectItem key={digit} value={digit.toString()}>{digit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>First Digit</Label>
                              <Select
                                value={config.alternatingDigits[0].toString()}
                                onValueChange={(value) =>
                                  setConfig(prev => ({
                                    ...prev,
                                    alternatingDigits: [parseInt(value), prev.alternatingDigits[1]]
                                  }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[0,1,2,3,4,5,6,7,8,9].map(digit => (
                                    <SelectItem key={digit} value={digit.toString()}>{digit}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Second Digit</Label>
                              <Select
                                value={config.alternatingDigits[1].toString()}
                                onValueChange={(value) =>
                                  setConfig(prev => ({
                                    ...prev,
                                    alternatingDigits: [prev.alternatingDigits[0], parseInt(value)]
                                  }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[0,1,2,3,4,5,6,7,8,9].map(digit => (
                                    <SelectItem key={digit} value={digit.toString()}>{digit}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        <div>
                          <Label>Manual Prediction Override</Label>
                          <div className="flex gap-2">
                            <Select
                              value={manualPrediction?.toString() || ""}
                              onValueChange={(value) =>
                                setManualPrediction(value ? parseInt(value) : null)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select digit" />
                              </SelectTrigger>
                              <SelectContent>
                                {[0,1,2,3,4,5,6,7,8,9].map(digit => (
                                  <SelectItem key={digit} value={digit.toString()}>{digit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              onClick={() => setManualPrediction(null)}
                              disabled={manualPrediction === null}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Settings */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Advanced Settings</h4>

                        <div>
                          <Label>Initial Stake ($)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={config.initialStake}
                            onChange={(e) =>
                              setConfig(prev => ({ ...prev, initialStake: parseFloat(e.target.value) || 1 }))}
                          />
                        </div>

                        <div>
                          <Label>Martingale Start (after losses)</Label>
                          <Input
                            type="number"
                            min="1"
                            value={config.martingaleStart}
                            onChange={(e) =>
                              setConfig(prev => ({ ...prev, martingaleStart: parseInt(e.target.value) || 2 }))}
                          />
                        </div>

                        <div>
                          <Label>Martingale Multiplier</Label>
                          <Input
                            type="number"
                            step="0.1"
                            min="1.1"
                            value={config.martingaleMultiplier}
                            onChange={(e) =>
                              setConfig(prev => ({ ...prev, martingaleMultiplier: parseFloat(e.target.value) || 1.7 }))}
                          />
                        </div>

                        <div>
                          <Label>Max Martingale Levels</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={config.maxMartingaleLevels}
                            onChange={(e) =>
                              setConfig(prev => ({ ...prev, maxMartingaleLevels: parseInt(e.target.value) || 5 }))}
                          />
                        </div>

                        <div>
                          <Label>Target Profit ($)</Label>
                          <Input
                            type="number"
                            min="1"
                            value={config.targetProfit}
                            onChange={(e) =>
                              setConfig(prev => ({ ...prev, targetProfit: parseFloat(e.target.value) || 100 }))}
                          />
                        </div>

                        <div>
                          <Label>Stop Loss ($)</Label>
                          <Input
                            type="number"
                            min="1"
                            value={config.stopLoss}
                            onChange={(e) =>
                              setConfig(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 50 }))}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Warning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200">Vivco AI 8.0 Trading System</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                          This automated trading system uses DigitOver predictions with Martingale risk management.
                          Trading involves significant risk. Only trade with funds you can afford to lose.
                          Monitor your trades and adjust settings as needed.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AutoTradePage;
