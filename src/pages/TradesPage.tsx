import { Eye, Trash2, Edit, Plus, Clock, DollarSign, TrendingUp, TrendingDown, Percent, Scale, Banknote, Target, Award, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import StatsCard from "../components/StatsCard";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useTradeData, TradeFormData, calculateStats } from "@/contexts/TradeDataContext"; // Import useTradeData and calculateStats
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
// Removed Dialog imports as we are using an inline form
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion
import TradingRules from "@/components/TradingRules";


// Initial form data for adding/editing trades
const initialTradeFormData: Omit<TradeFormData, 'id'> = {
  strategy: "",
  pair: "",
  type: "buy",
  openTime: "", // This will now store the date string (YYYY-MM-DD)
  tradeTime: "", // This will now store the time string (HH:mm)
  timeframe: "1m", // Changed default to lowercase for consistency with new values
  trend: "up",
  lotSize: "0.01",
  winLoss: "win",
  netProfit: "0.00",
  balance: "0.00",
  candles: ""
};


const TradesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Use the backtesting context for backtesting trades (removed dailyTarget from context)
  const { backtestingTrades, addTrade, updateTrade, deleteTrade, clearBacktestingTrades } = useTradeData(); // Get all necessary functions



  // Calculate stats for backtesting trades
  const stats = useMemo(() => calculateStats(backtestingTrades), [backtestingTrades]);

  // Calculate separate wins and losses profits
  const winsLossesStats = useMemo(() => {
    let winsProfit = 0;
    let lossesProfit = 0;

    backtestingTrades.forEach(trade => {
      const profit = parseFloat(trade.netProfit || '0');
      if (trade.winLoss === 'win') {
        winsProfit += profit;
      } else if (trade.winLoss === 'loss') {
        lossesProfit += Math.abs(profit); // Make losses positive for display
      }
    });

    return { winsProfit, lossesProfit };
  }, [backtestingTrades]);

  // Pagination state for demo trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // State for managing the inline add/edit trade form
  const [showInlineForm, setShowInlineForm] = useState(false); // State to control inline form visibility
  const [tradeFormData, setTradeFormData] = useState<Omit<TradeFormData, 'id'>>(initialTradeFormData);
  const [editingTradeId, setEditingTradeId] = useState<number | null>(null); // State to track which trade is being edited

  // State for selected trades to delete
  const [selectedTrades, setSelectedTrades] = useState<number[]>([]);

  // State for Trading Rules progress
  const [tradingRulesProgress, setTradingRulesProgress] = useState<number>(0);

  // Calculate total pages for backtesting trades
  const totalPages = Math.ceil(backtestingTrades.length / itemsPerPage);

  // Get paginated backtesting trades for current page
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return backtestingTrades.slice(startIndex, startIndex + itemsPerPage);
  }, [backtestingTrades, currentPage, itemsPerPage]);

  // Use localStorage for timeframes and balance
  const [selectedTimeframes, setSelectedTimeframes] = useLocalStorage<string[]>("selectedTimeframes", ["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  const [balance, setBalance] = useLocalStorage<number>("backtestingBalance", 10.00); // Backtesting specific balance
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [newBalance, setNewBalance] = useLocalStorage<string>("backtestingNewBalanceInput", "");



  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update the current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
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

  // Logic for timeframe buttons and trend
  const toggleTimeframe = (timeframe: string) => {
    if (selectedTimeframes.includes(timeframe)) {
      setSelectedTimeframes(selectedTimeframes.filter(t => t !== timeframe));
    } else {
      setSelectedTimeframes([...selectedTimeframes, timeframe]);
    }
  };

  // Updated logic for trend and trendColor: changes when THREE OR MORE timeframes are NOT selected (red)
  const numberOfRedButtons = timeframes.length - selectedTimeframes.length;
  const trend = numberOfRedButtons >= 3 ? "Down Trend" : "Up Trend";
  const trendColor = numberOfRedButtons >= 3 ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600";

  const handleSetBalance = () => {
    const parsedBalance = parseFloat(newBalance);
    if (isNaN(parsedBalance)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    setBalance(parsedBalance);
    setIsSettingBalance(false);
    setNewBalance("");

    toast({
      title: "Balance updated",
      description: `Your balance has been set to $${parsedBalance.toFixed(2)}`,
    });
  };



  // Handle input changes in the trade form
  const handleTradeFormInputChange = (field: keyof Omit<TradeFormData, 'id'>, value: string) => {
    setTradeFormData({ ...tradeFormData, [field]: value });
  };

  // Handle submitting the trade form (Add or Edit)
  const handleSaveTrade = () => {
    if (editingTradeId !== null) {
      // Update existing trade
      updateTrade(editingTradeId, { ...tradeFormData, id: editingTradeId }, 'backtesting');
      toast({
        title: "Trade Updated",
        description: `Trade ${editingTradeId} has been updated.`,
      });
    } else {
      // Add new trade
      addTrade(tradeFormData as TradeFormData, 'backtesting'); // Cast to TradeFormData as addTrade expects it
      toast({
        title: "Trade Added",
        description: "Your backtesting trade has been successfully saved",
      });
    }

    // Reset form and hide inline form
    setTradeFormData(initialTradeFormData);
    setEditingTradeId(null);
    setShowInlineForm(false); // Hide the inline form
  };

  // Handle opening the Add Trade inline form
  const handleOpenAddTradeForm = () => {
    setTradeFormData(initialTradeFormData); // Clear form data
    setEditingTradeId(null); // Ensure not in editing mode
    setShowInlineForm(true); // Show the inline form
  };

  // Handle opening the Edit Trade inline form
  const handleOpenEditTradeForm = (trade: TradeFormData) => {
    setTradeFormData(trade); // Pre-fill form data
    setEditingTradeId(trade.id || null); // Set editing ID
    setShowInlineForm(true); // Show the inline form
  };

  // Handle canceling the inline form
  const handleCancelInlineForm = () => {
    setTradeFormData(initialTradeFormData); // Clear form data
    setEditingTradeId(null); // Ensure not in editing mode
    setShowInlineForm(false); // Hide the inline form
  };


  // Handle selecting/deselecting a trade for deletion
  const handleSelectTrade = (tradeId: number) => {
    if (selectedTrades.includes(tradeId)) {
      setSelectedTrades(selectedTrades.filter(id => id !== tradeId));
    } else {
      setSelectedTrades([...selectedTrades, tradeId]);
    }
  };

  // Handle deleting selected trades
  const handleDeleteSelectedTrades = () => {
    selectedTrades.forEach(tradeId => {
      deleteTrade(tradeId, 'backtesting');
    });
    setSelectedTrades([]); // Clear selection after deleting
    toast({
      title: "Trades Deleted",
      description: `${selectedTrades.length} trade(s) have been removed.`,
    });
  };

  // Handle clicking the View icon - Enhanced backtesting version
  const handleViewTrade = (trade: TradeFormData) => {
    console.log("🧪 Viewing Backtesting Trade Details:", trade);

    // Calculate trade performance metrics
    const profit = parseFloat(trade.netProfit);
    const isWin = trade.winLoss === "win";
    const profitEmoji = profit > 0 ? "💰" : profit < 0 ? "📉" : "➖";
    const resultEmoji = isWin ? "✅" : "❌";
    const backtestEmoji = "🧪";

    // Calculate risk metrics for backtesting analysis
    const riskLevel = Math.abs(profit) > 50 ? "High" : Math.abs(profit) > 20 ? "Medium" : "Low";
    const riskEmoji = riskLevel === "High" ? "🔥" : riskLevel === "Medium" ? "⚠️" : "🟢";

    // Create an engaging and detailed backtesting analysis
    const tradeDetails = `
🧪 BACKTESTING TRADE ANALYSIS
═══════════════════════════════════

📊 Demo Trade Overview:
   • Trade ID: #${trade.id}
   • Strategy: ${trade.strategy}
   • Trading Pair: ${trade.pair}
   • Position Type: ${trade.type.toUpperCase()}
   • Risk Level: ${riskLevel} ${riskEmoji}

📅 Market Timing:
   • Date: ${trade.openTime}
   • Time: ${trade.tradeTime}
   • Timeframe: ${trade.timeframe}
   • Market Trend: ${trade.trend}

⚙️ Trade Configuration:
   • Lot Size: ${trade.lotSize}
   • Candles Analyzed: ${trade.candles}
   • Entry Strategy: Demo Testing

📈 Performance Results:
   • Outcome: ${trade.winLoss.toUpperCase()} ${resultEmoji}
   • Net Profit: ${formatCurrency(profit)} ${profitEmoji}
   • Demo Balance: ${formatCurrency(parseFloat(trade.balance))}

🎯 Backtesting Insights:
   ${isWin ?
     "🎉 Successful demo trade! This strategy shows promise for live trading." :
     "📚 Learning trade. Analyze this pattern to refine your strategy before going live."}

💡 Strategy Notes:
   • This is a demo trade for testing purposes
   • Use these results to validate your trading strategy
   • Consider risk management before live implementation
    `.trim();

    // Show engaging backtesting-specific toast notification
    toast({
      title: `${backtestEmoji} Backtest Trade #${trade.id} ${resultEmoji}`,
      description: `Demo ${isWin ? "Win" : "Loss"} on ${trade.pair} • ${formatCurrency(profit)} • Risk: ${riskLevel}`,
      duration: 7000,
    });

    // Show detailed alert with formatted backtesting information
    alert(`${tradeDetails}`);
  };


  // Format currency values for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.div // Changed from motion.header to motion.div
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm" // Added dark mode styles
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Replaced "Detailed Data" headline with time and date */}
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
            <p className="text-orange-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
          {/* Timeframe buttons and Trend added here */}
          <div className="flex items-center gap-4"> {/* Adjusted gap */}
            {/* Replaced Trend text with a button */}
            <Button
              variant="outline"
              size="sm"
              className={`${trendColor} text-white`}
            >
              {trend}
            </Button>
            <div className="flex items-center gap-2">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe}
                  variant="outline"
                  size="sm"
                  className={`${
                    selectedTimeframes.includes(timeframe) ? "bg-green-500" : "bg-red-500"
                  } text-white hover:${
                    selectedTimeframes.includes(timeframe) ? "bg-green-600" : "bg-red-600"
                  }`}
                  onClick={() => toggleTimeframe(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
        </motion.div> {/* Changed from motion.header to motion.div */}

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Your Highlights Section - Displaying Demo Stats */}
          <AnimatedContainer delay={0.1}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">Start Trade</h2> {/* Updated title and added dark mode text color */}
                <div className="flex gap-2">
                  {isSettingBalance ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        placeholder="Enter new balance"
                        className="border p-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
                      />
                      <Button
                        size="sm"
                        onClick={handleSetBalance}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Add Deposit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsSettingBalance(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => setIsSettingBalance(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Deposit
                    </Button>
                  )}


                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Deposit"
                  value={`$${balance.toFixed(2)}`}
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-orange-500"
                  icon={DollarSign}
                />
                <StatsCard
                  title="Today's P&L"
                  value={stats.netProfit >= 0 ? `+${formatCurrency(stats.netProfit)}` : formatCurrency(stats.netProfit)}
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-green-500"
                  icon={Scale}
                />
                <StatsCard
                  title="Win Rate"
                  value={stats.winRate}
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-blue-500"
                  icon={Percent}
                />
                <StatsCard
                  title="Account Balance"
                  value={formatCurrency(balance + stats.netProfit)}
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-green-500"
                  icon={TrendingUp}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                <StatsCard
                  title="Total Trades"
                  value={`${stats.totalTrades} Trades`}
                  labelPosition="below"
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-black"
                  icon={BarChart3}
                />
                <StatsCard
                  title="Wins"
                  value={`${stats.wins} Wins`}
                  labelPosition="below"
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-green-500"
                  icon={TrendingUp}
                />
                <StatsCard
                  title="Losses"
                  value={`${stats.losses} Losses`}
                  labelPosition="below"
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-red-500"
                  icon={TrendingDown}
                />
                <StatsCard
                  title="Best Trade"
                  value={stats.bestTrade > 0 ? `+${formatCurrency(stats.bestTrade)}` : formatCurrency(stats.bestTrade)}
                  labelPosition="below"
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-green-500"
                  icon={Award}
                />
                <StatsCard
                  title="Worst Trade"
                  value={formatCurrency(stats.worstTrade)}
                  labelPosition="below"
                  color="text-gray-900 dark:text-white"
                  leftBorderColor="border-l-red-500"
                  icon={TrendingDown}
                />
              </div>
            </div>
          </AnimatedContainer>

          {/* Trading Rules and Signal Progress - Moved from Dashboard */}
          <AnimatedContainer delay={0.25}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <TradingRules hideAddButton={true} dashboardView={true} onProgressChange={setTradingRulesProgress} />
              </div>
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium text-center mb-6 text-gray-800 dark:text-gray-200">Signal Progress</h3>
                    <div className="flex justify-center mb-4">
                      <div className="relative h-32 w-32">
                        <Progress value={tradingRulesProgress} className="h-full w-full rounded-full [&>div]:!bg-orange-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{tradingRulesProgress.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Trade Completed</p>
                    <div className="flex justify-center">
                      <Button
                        variant={tradingRulesProgress === 100 ? "default" : "destructive"}
                        className={tradingRulesProgress === 100 ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                      >
                        {tradingRulesProgress === 100 ? "Take The Trade" : "Ready To Trade"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AnimatedContainer>

          {/* Trades Table - Updated to use demo trades with pagination and new header style */}
          <AnimatedContainer delay={0.3}>
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden mt-4 hover:shadow-lg transition-shadow duration-300" // Added dark mode styles
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {/* Top header bar with title and buttons */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b dark:border-gray-600">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Trade Details</h2>
                <div className="flex gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleOpenAddTradeForm}> {/* Updated onClick */}
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                    onClick={handleDeleteSelectedTrades}
                    disabled={selectedTrades.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedTrades.length})
                  </Button>
                </div>
              </div>

              {/* Enhanced Inline Add/Edit Trade Form */}
              {showInlineForm && (
                <AnimatedContainer delay={0.1}>
                  <motion.div
                    className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-b-2 border-blue-200 dark:border-blue-700 shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        {editingTradeId !== null ? `Edit Start Trade #${editingTradeId}` : "Add New Start Trade"}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelInlineForm}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* First Row */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Strategy *</label>
                        <Input
                          placeholder="Enter strategy name"
                          value={tradeFormData.strategy}
                          onChange={(e) => handleTradeFormInputChange("strategy", e.target.value)}
                          className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-400 dark:bg-gray-600 dark:text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Trading Pair *</label>
                        <Select
                          value={tradeFormData.pair}
                          onValueChange={(value) => handleTradeFormInputChange("pair", value)}
                        >
                          <SelectTrigger className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:bg-gray-600 dark:text-white">
                            <SelectValue placeholder="Select Trading Pair" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="Boom 300 Index">Boom 300 Index</SelectItem>
                            <SelectItem value="Boom 500 Index">Boom 500 Index</SelectItem>
                            <SelectItem value="Boom 600 Index">Boom 600 Index</SelectItem>
                            <SelectItem value="Boom 900 Index">Boom 900 Index</SelectItem>
                            <SelectItem value="Boom 1000 Index">Boom 1000 Index</SelectItem>
                            <SelectItem value="Crash 300 Index">Crash 300 Index</SelectItem>
                            <SelectItem value="Crash 500 Index">Crash 500 Index</SelectItem>
                            <SelectItem value="Crash 600 Index">Crash 600 Index</SelectItem>
                            <SelectItem value="Crash 1000 Index">Crash 1000 Index</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Position Type *</label>
                        <Select
                          value={tradeFormData.type}
                          onValueChange={(value) => handleTradeFormInputChange("type", value)}
                        >
                          <SelectTrigger className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:bg-gray-600 dark:text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Second Row */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Date *</label>
                        <Input
                          type="date"
                          value={tradeFormData.openTime}
                          onChange={(e) => handleTradeFormInputChange("openTime", e.target.value)}
                          className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-400 dark:bg-gray-600 dark:text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Trade Time *</label>
                        <Input
                          type="time"
                          value={tradeFormData.tradeTime}
                          onChange={(e) => handleTradeFormInputChange("tradeTime", e.target.value)}
                          className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-400 dark:bg-gray-600 dark:text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Timeframe *</label>
                        <Select
                          value={tradeFormData.timeframe}
                          onValueChange={(value) => handleTradeFormInputChange("timeframe", value)}
                        >
                          <SelectTrigger className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:bg-gray-600 dark:text-white">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="1M">1M</SelectItem>
                            <SelectItem value="5M">5M</SelectItem>
                            <SelectItem value="15M">15M</SelectItem>
                            <SelectItem value="1H">1H</SelectItem>
                            <SelectItem value="4H">4H</SelectItem>
                            <SelectItem value="1D">1D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Trend</label>
                        <Select
                          value={tradeFormData.trend}
                          onValueChange={(value) => handleTradeFormInputChange("trend", value)}
                        >
                          <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                            <SelectValue placeholder="Select trend" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="up">Up</SelectItem>
                            <SelectItem value="down">Down</SelectItem>
                            <SelectItem value="sideways">Sideways</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Lot Size</label>
                        <Input
                          type="number"
                          placeholder="0.01"
                          step="0.01"
                          value={tradeFormData.lotSize}
                          onChange={(e) => handleTradeFormInputChange("lotSize", e.target.value)}
                          className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Win/Loss</label>
                        <Select
                          value={tradeFormData.winLoss}
                          onValueChange={(value) => handleTradeFormInputChange("winLoss", value)}
                        >
                          <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                            <SelectValue placeholder="Select result" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="win">Win</SelectItem>
                            <SelectItem value="loss">Loss</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Net Profit</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          value={tradeFormData.netProfit}
                          onChange={(e) => handleTradeFormInputChange("netProfit", e.target.value)}
                          className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Balance</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          value={tradeFormData.balance}
                          onChange={(e) => handleTradeFormInputChange("balance", e.target.value)}
                          className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Candles</label>
                        <Select
                          value={tradeFormData.candles}
                          onValueChange={(value) => handleTradeFormInputChange("candles", value)}
                        >
                          <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                            <SelectValue placeholder="Select candles" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="1">1 Candles</SelectItem>
                            <SelectItem value="2">2 Candles</SelectItem>
                            <SelectItem value="3">3 Candles</SelectItem>
                            <SelectItem value="4">4 Candles</SelectItem>
                            <SelectItem value="5">5 Candles</SelectItem>
                            <SelectItem value="10">10 Candles</SelectItem>
                            <SelectItem value="15">15 Candles</SelectItem>
                            <SelectItem value="20">20 Candles</SelectItem>
                            <SelectItem value="25">25 Candles</SelectItem>
                            <SelectItem value="30">30 Candles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-blue-200 dark:border-blue-700">
                      <Button
                        variant="outline"
                        onClick={handleCancelInlineForm}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveTrade}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        disabled={!tradeFormData.strategy || !tradeFormData.pair || !tradeFormData.type || !tradeFormData.openTime || !tradeFormData.tradeTime || !tradeFormData.timeframe}
                      >
                        {editingTradeId !== null ? "💾 Save Changes" : "➕ Add Trade"}
                      </Button>
                    </div>
                  </motion.div>
                </AnimatedContainer>
              )}


              <Table>
                <TableHeader className="bg-[#e6e6e6]"> {/* Changed background to #e6e6e6 */}
                  <TableRow>
                    <TableHead className="w-[40px] text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"> {/* Checkbox column - Changed text color and added border */}
                      {/* Add a checkbox here if you want to select/deselect all */}
                    </TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TRADE</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">STRATEGY</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">PAIR</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TYPE</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">OPEN TIME</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TRADE TIME</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TIMEFRAME</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TREND</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">LOT SIZE</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">CANDLES</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">W/L</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">NET PROFIT</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">BALANCE</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">ACTIONS</TableHead> {/* Actions column - Changed text color and added border */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrades.map((trade, index) => (
                    <motion.tr
                      key={trade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                      whileHover={{ backgroundColor: "#f8f9fa" }}
                      className="dark:hover:bg-gray-700" // Added dark mode hover style
                    >
                      <TableCell className="border-b border-gray-200 dark:border-gray-700"> {/* Added border */}
                        <input
                          type="checkbox"
                          checked={selectedTrades.includes(trade.id || 0)} // Use trade.id for selection
                          onChange={() => handleSelectTrade(trade.id || 0)} // Use trade.id for selection
                          className="form-checkbox h-4 w-4 text-blue-600 rounded dark:bg-gray-700 dark:border-gray-600"
                        />
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.id}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.strategy}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.pair}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-blue-500 border-b border-gray-200 dark:border-gray-700">{trade.type}</TableCell> {/* Added border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.openTime}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.tradeTime}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.timeframe}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.trend}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.lotSize}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-red-500 border-b border-gray-200 dark:border-gray-700">{trade.candles}</TableCell> {/* Added border */}
                      <TableCell className="border-b border-gray-200 dark:border-gray-700"> {/* Added border */}
                        <Badge
                          className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            trade.winLoss === "win"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          )}
                        >
                          {trade.winLoss === "win" ? "Win" : "Loss"}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(parseFloat(trade.netProfit) >= 0 ? "text-green-500" : "text-red-500", "border-b border-gray-200 dark:border-gray-700")}> {/* Added border */}
                        {trade.netProfit}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.balance}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="border-b border-gray-200 dark:border-gray-700"> {/* Added border */}
                        <div className="flex space-x-1">
                          {/* Enhanced View button for backtesting */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 hover:scale-105"
                            onClick={() => handleViewTrade(trade)}
                            title="View start trade analysis"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            onClick={() => handleOpenEditTradeForm(trade)}
                            title="Edit start trade"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* Removed individual delete button */}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {/* Added pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-700"> {/* Added dark mode border */}
                  <div className="text-sm text-gray-500 dark:text-gray-400"> {/* Added dark mode text color */}
                    Showing {paginatedTrades.length > 0 ? ((currentPage - 1) * 5) + 1 : 0} to {Math.min(currentPage * 5, backtestingTrades.length)} of {backtestingTrades.length} results
                  </div>
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                      )}

                      {/* Generate page numbers */}
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        // Show current page and at most 2 pages before and after
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                isActive={pageNumber === currentPage}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNumber);
                                }}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        // Show ellipsis for skipped pages
                        else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return <PaginationItem key={pageNumber}>...</PaginationItem>;
                          }
                          return null;
                        })}

                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                              }}
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </motion.div>
            </AnimatedContainer>
          </main>
        </div>

        {/* Removed Add/Edit Trade Modal */}

      </div>
    );
  };

  export default TradesPage;
