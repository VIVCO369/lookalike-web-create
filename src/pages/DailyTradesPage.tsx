import { Eye, Trash2, Edit, Plus, Clock, Trophy, Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react"; // Import Trophy, Calendar, TrendingUp, TrendingDown, DollarSign
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import DetailedData from "../components/DetailedData"; // Import DetailedData
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion


// Removed initialTradeFormData as it's now only used within DetailedData

const DailyTradesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // Removed showAddTrade state as it's handled by DetailedData
  // Removed formData state as it's handled by DetailedData

  // Use the daily trades context for daily trades (removed dailyTarget from context)
  const { dailyTrades, updateTrade, clearDailyTrades } = useTradeData(); // Get updateTrade and clearDailyTrades

  // Daily Trades specific Daily Target
  const [dailyTarget, setDailyTarget] = useLocalStorage<number>("dailyTradesDailyTarget", 0.00);

  // Calculate stats for daily trades
  const stats = useMemo(() => calculateStats(dailyTrades), [dailyTrades]);

  // Pagination state for daily trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // Calculate total pages for daily trades
  const totalPages = Math.ceil(dailyTrades.length / itemsPerPage);

  // Get paginated daily trades for current page
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return dailyTrades.slice(startIndex, startIndex + itemsPerPage);
  }, [dailyTrades, currentPage, itemsPerPage]);

  // Use localStorage for timeframes and balance
  const [selectedTimeframes, setSelectedTimeframes] = useLocalStorage<string[]>("selectedTimeframes", ["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  const [balance, setBalance] = useLocalStorage<number>("dailyTradesBalance", 10.00); // Daily Trades specific balance
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [newBalance, setNewBalance] = useLocalStorage<string>("dailyTradesNewBalanceInput", "");

  const [isSettingDailyTarget, setIsSettingDailyTarget] = useState(false);
  const [newDailyTarget, setNewDailyTarget] = useLocalStorage<string>("dailyTradesNewDailyTargetInput", "");

  // State for Challenge Milestones
  const [challengeStarted, setChallengeStarted] = useLocalStorage<boolean>("challengeStarted", false);
  const [daysRemaining, setDaysRemaining] = useLocalStorage<number>("daysRemaining", 0);

  // State for editing trades
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTradeId, setEditingTradeId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<TradeFormData, 'id'>>({
    strategy: "",
    pair: "",
    type: "",
    openTime: "",
    tradeTime: "",
    timeframe: "",
    trend: "",
    lotSize: "",
    winLoss: "",
    netProfit: "",
    balance: "",
    candles: "",
  });

  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Removed toggleAddTrade function as it's handled by DetailedData

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

  const handleSetDailyTarget = () => {
    const parsedTarget = parseFloat(newDailyTarget);
    if (isNaN(parsedTarget)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    setDailyTarget(parsedTarget);
    setIsSettingDailyTarget(false);
    setNewDailyTarget("");

    toast({
      title: "Daily Target updated",
      description: `Your daily target has been set to $${parsedTarget.toFixed(2)}`,
    });
  };

  // Removed handleInputChange and handleSubmit as they are handled by DetailedData

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

  // Handle reset daily trades (This function is now called from AlertDialog in DetailedData)
  const handleResetDailyTrades = () => {
    clearDailyTrades();
    toast({
      title: "Daily Trades Cleared",
      description: "All daily trade history has been removed.",
    });
    setCurrentPage(1); // Reset to the first page after clearing
  };

  // Generate 30 days of trading data (Copied from ThirtyDayTradePage)
  const thirtyDayData = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const trades = Math.floor(Math.random() * 8) + 2; // 2-10 trades per day
    const winRate = 0.6 + Math.random() * 0.3; // 60-90% win rate
    const wins = Math.floor(trades * winRate);
    const losses = trades - wins;
    const dailyProfit = wins * (50 + Math.random() * 100) - losses * (30 + Math.random() * 70);

    return {
      day: index + 1,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      trades,
      wins,
      losses,
      winRate: ((wins / trades) * 100).toFixed(1),
      profit: Math.round(dailyProfit),
      candles: Math.round((wins * 15 - losses * 10) + (Math.random() - 0.5) * 20),
    };
  });

  // Handle Start Challenge
  const handleStartChallenge = () => {
    setChallengeStarted(true);
    setDaysRemaining(30); // Start with 30 days
    toast({
      title: "Challenge Started!",
      description: "Your 30-day trading challenge has begun.",
    });
  };

  // Handle Reset Challenge
  const handleResetChallenge = () => {
    setChallengeStarted(false);
    setDaysRemaining(0); // Reset days remaining
    toast({
      title: "Challenge Reset",
      description: "Your 30-day trading challenge has been reset.",
    });
  };

  // Handle clicking the View icon - Enhanced daily trades version
  const handleViewTrade = (trade: TradeFormData) => {
    console.log("📈 Viewing Daily Trade Details:", trade);

    // Calculate trade performance metrics
    const profit = parseFloat(trade.netProfit);
    const isWin = trade.winLoss === "win";
    const profitEmoji = profit > 0 ? "💰" : profit < 0 ? "📉" : "➖";
    const resultEmoji = isWin ? "✅" : "❌";
    const dailyEmoji = "📈";

    // Calculate performance metrics for daily trading
    const performanceLevel = Math.abs(profit) > 100 ? "Excellent" : Math.abs(profit) > 50 ? "Good" : Math.abs(profit) > 20 ? "Average" : "Modest";
    const performanceEmoji = performanceLevel === "Excellent" ? "🚀" : performanceLevel === "Good" ? "👍" : performanceLevel === "Average" ? "👌" : "📊";

    // Calculate challenge progress
    const challengeProgress = challengeStarted ? `Day ${31 - daysRemaining}/30` : "Challenge not started";

    // Create an engaging and detailed daily trading analysis
    const tradeDetails = `
📈 DAILY TRADING ANALYSIS
═══════════════════════════════════

🎯 Daily Trade Overview:
   • Trade ID: #${trade.id}
   • Strategy: ${trade.strategy}
   • Trading Pair: ${trade.pair}
   • Position Type: ${trade.type.toUpperCase()}
   • Performance: ${performanceLevel} ${performanceEmoji}

📅 Trading Session:
   • Date: ${trade.openTime}
   • Time: ${trade.tradeTime}
   • Timeframe: ${trade.timeframe}
   • Market Trend: ${trade.trend}

⚙️ Trade Execution:
   • Lot Size: ${trade.lotSize}
   • Candles Analyzed: ${trade.candles}
   • Entry Method: Daily Trading

📊 Performance Results:
   • Outcome: ${trade.winLoss.toUpperCase()} ${resultEmoji}
   • Net Profit: ${formatCurrency(profit)} ${profitEmoji}
   • Account Balance: ${formatCurrency(parseFloat(trade.balance))}

🏆 Challenge Status:
   • Progress: ${challengeProgress}
   • Days Remaining: ${daysRemaining}/30
   • Challenge Active: ${challengeStarted ? "Yes ✅" : "No ❌"}

💡 Daily Trading Insights:
   ${isWin ?
     "🎉 Great daily trade! You're building consistent trading habits and profitable results." :
     "📚 Learning trade. Daily consistency is key - analyze and improve for tomorrow's session."}

🎯 Daily Goals:
   • Focus on consistent daily performance
   • Build sustainable trading habits
   • Track progress toward daily targets
   • Maintain disciplined risk management
    `.trim();

    // Show engaging daily trading toast notification
    toast({
      title: `${dailyEmoji} Daily Trade #${trade.id} ${resultEmoji}`,
      description: `${isWin ? "Profitable" : "Loss"} daily trade on ${trade.pair} • ${formatCurrency(profit)} • ${performanceLevel} performance`,
      duration: 8000,
    });

    // Show detailed alert with formatted daily trading information
    alert(`${tradeDetails}`);
  };

  // Handle clicking the Edit icon - Enhanced daily trades version
  const handleEditTrade = (trade: TradeFormData) => {
    console.log("✏️ Editing Daily Trade:", trade);

    // Pre-fill the form with trade data
    setEditFormData({
      strategy: trade.strategy,
      pair: trade.pair,
      type: trade.type,
      openTime: trade.openTime,
      tradeTime: trade.tradeTime,
      timeframe: trade.timeframe,
      trend: trade.trend,
      lotSize: trade.lotSize,
      winLoss: trade.winLoss,
      netProfit: trade.netProfit,
      balance: trade.balance,
      candles: trade.candles,
    });

    setEditingTradeId(trade.id || null);
    setShowEditForm(true);

    toast({
      title: "📝 Edit Mode Activated",
      description: `Editing daily trade #${trade.id} on ${trade.pair}`,
      duration: 3000,
    });
  };

  // Handle saving the edited trade
  const handleSaveEditedTrade = () => {
    if (editingTradeId === null) return;

    // Update the trade
    updateTrade(editingTradeId, { ...editFormData, id: editingTradeId }, 'daily-trades');

    // Reset form state
    setShowEditForm(false);
    setEditingTradeId(null);
    setEditFormData({
      strategy: "",
      pair: "",
      type: "",
      openTime: "",
      tradeTime: "",
      timeframe: "",
      trend: "",
      lotSize: "",
      winLoss: "",
      netProfit: "",
      balance: "",
      candles: "",
    });

    toast({
      title: "✅ Trade Updated Successfully",
      description: `Daily trade #${editingTradeId} has been updated with new information.`,
      duration: 4000,
    });
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditingTradeId(null);
    setEditFormData({
      strategy: "",
      pair: "",
      type: "",
      openTime: "",
      tradeTime: "",
      timeframe: "",
      trend: "",
      lotSize: "",
      winLoss: "",
      netProfit: "",
      balance: "",
      candles: "",
    });

    toast({
      title: "❌ Edit Cancelled",
      description: "Trade editing has been cancelled. No changes were saved.",
      duration: 3000,
    });
  };

  // Handle form input changes
  const handleEditFormInputChange = (field: keyof Omit<TradeFormData, 'id'>, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
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
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Challenge Milestones - Moved from 30 Day Trade Page */}
            <AnimatedContainer delay={0.1}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"> {/* Added dark mode styles */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Challenge Milestones</h3> {/* Added dark mode text color */}
                  {/* Start/Reset Buttons */}
                  <div>
                    {!challengeStarted ? (
                      <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleStartChallenge}>
                        Start Challenge
                      </Button>
                    ) : (
                      <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleResetChallenge}>
                        Reset Challenge
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 dark:border-gray-700"> {/* Added dark mode border */}
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">Profitable Days</span> {/* Added dark mode text color */}
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.profitableDaysCount}/30 {/* Use calculated profitableDaysCount */}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 dark:border-gray-700"> {/* Added dark mode border */}
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">Best Day</span> {/* Added dark mode text color */}
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(stats.bestDayProfit)} {/* Use calculated bestDayProfit */}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 dark:border-gray-700"> {/* Added dark mode border */}
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">Days Remaining</span> {/* Added dark mode text color */}
                    </div>
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-300"> {/* Added dark mode text color */}
                      {daysRemaining}/30 {/* Display daysRemaining state */}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedContainer>

            {/* Your Highlights Section - Displaying Demo Stats */}
            <AnimatedContainer delay={0.2}>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">Daily Trade</h2> {/* Changed text here and added dark mode text color */}
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
                          className="bg-blue-500 hover:bg-blue-600 text-white"
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
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => setIsSettingBalance(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Deposit
                      </Button>
                    )}

                    {/* Daily Target Button and Input */}
                    {isSettingDailyTarget ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={newDailyTarget}
                          onChange={(e) => setNewDailyTarget(e.target.value)}
                          placeholder="Enter daily target"
                          className="border p-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
                        />
                        <Button
                          size="sm"
                          onClick={handleSetDailyTarget}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Set
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsSettingDailyTarget(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => setIsSettingDailyTarget(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Daily Target
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <StatsCard
                    title="Deposit"
                    value={`$${balance.toFixed(2)}`} // Using the local balance state for now
                    color="text-green-500"
                    borderColor="border-green-500 dark:border-green-700" // Added dark mode border color
                  />
                  <StatsCard
                    title="Net Profit"
                    value={formatCurrency(stats.netProfit)}
                    color={stats.netProfit >= 0 ? "text-green-500" : "text-red-500"}
                    borderColor={stats.netProfit >= 0 ? "border-green-500 dark:border-green-700" : "border-red-500 dark:border-red-700"} // Added dark mode border color
                  />
                  <StatsCard
                    title="Win Rate"
                    value={stats.winRate}
                    color="text-gray-700 dark:text-gray-200" // Added dark mode text color
                    borderColor="border-gray-200 dark:border-gray-700" // Added dark mode border color
                  />
                  <StatsCard
                    title="Best Trade"
                    value={stats.bestTrade > 0 ? `+${formatCurrency(stats.bestTrade)}` : formatCurrency(stats.bestTrade)}
                    color="text-green-500"
                    borderColor="border-green-500 dark:border-green-700" // Added dark mode border color
                  />
                  <StatsCard
                    title="Worst Trade"
                    value={formatCurrency(stats.worstTrade)}
                    color="text-red-500"
                    borderColor="border-red-500 dark:border-red-700" // Added dark mode border color
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <StatsCard
                    title="Account Balance"
                    value={formatCurrency(balance + stats.netProfit)} // Deposit + Net Profit
                    labelPosition="below"
                    color={balance + stats.netProfit >= 0 ? "text-blue-500" : "text-red-500"}
                    borderColor={balance + stats.netProfit >= 0 ? "border-blue-500 dark:border-blue-700" : "border-red-500 dark:border-red-700"}
                  />
                  <StatsCard
                    title="Total Trades"
                    value={stats.totalTrades.toString()} // Use totalTrades from calculated stats
                    labelPosition="below"
                    color="text-gray-700 dark:text-gray-200" // Added dark mode text color
                    borderColor="border-gray-200 dark:border-gray-700" // Added dark mode border color
                  />
                  <StatsCard
                    title="Daily Target" // Changed title from Avg. Duration
                    value={formatCurrency(dailyTarget)} // Use dailyTarget state
                    labelPosition="below"
                    color="text-gray-700 dark:text-gray-200" // Added dark mode text color
                    borderColor="border-gray-200 dark:border-gray-700" // Added dark mode border color
                  />
                  <StatsCard
                    title="Today's P&L"
                    value={stats.netProfit >= 0 ? `+${formatCurrency(stats.netProfit)}` : formatCurrency(stats.netProfit)} // Changed to use stats.netProfit
                    color={stats.netProfit >= 0 ? "text-green-500" : "text-red-500"} // Changed to use stats.netProfit
                    labelPosition="below"
                    borderColor={stats.netProfit >= 0 ? "border-green-500 dark:border-green-700" : "border-red-500 dark:border-red-700"} // Added dark mode border color
                  />
                </div>
              </div>
            </AnimatedContainer>

            {/* Use the DetailedData component for adding DAILY TRADES */}
            {/* Pass the reset function and trade count */}
            <AnimatedContainer delay={0.3}>
              <DetailedData
                showAddTrade={true}
                accountType="daily-trades"
                onResetTrades={handleResetDailyTrades}
                tradeCount={dailyTrades.length}
              />
            </AnimatedContainer>

            {/* Edit Trade Form */}
            {showEditForm && (
              <AnimatedContainer delay={0.35}>
                <motion.div
                  className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg shadow-lg p-6 border-2 border-purple-200 dark:border-purple-700"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Edit Daily Trade #{editingTradeId}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* First Row */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Strategy</label>
                      <Input
                        value={editFormData.strategy}
                        onChange={(e) => handleEditFormInputChange("strategy", e.target.value)}
                        className="border-purple-200 dark:border-purple-600 focus:border-purple-400 dark:focus:border-purple-400"
                        placeholder="Strategy"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Pair</label>
                      <Select
                        value={editFormData.pair}
                        onValueChange={(value) => handleEditFormInputChange("pair", value)}
                      >
                        <SelectTrigger className="border-purple-200 dark:border-purple-600 focus:border-purple-400">
                          <SelectValue placeholder="Select Trading Pair" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Boom 300 Index">Boom 300 Index</SelectItem>
                          <SelectItem value="Boom 500 Index">Boom 500 Index</SelectItem>
                          <SelectItem value="Boom 600 Index">Boom 600 Index</SelectItem>
                          <SelectItem value="Boom 900 Index">Boom 900 Index</SelectItem>
                          <SelectItem value="Boom 1000 Index">Boom 1000 Index</SelectItem>
                          <SelectItem value="Crash 300 Index">Crash 300 Index</SelectItem>
                          <SelectItem value="Crash 500 Index">Crash 500 Index</SelectItem>
                          <SelectItem value="Crash 600 Index">Crash 600 Index</SelectItem>
                          <SelectItem value="Crash 900 Index">Crash 900 Index</SelectItem>
                          <SelectItem value="Crash 1000 Index">Crash 1000 Index</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Type</label>
                      <Select
                        value={editFormData.type}
                        onValueChange={(value) => handleEditFormInputChange("type", value)}
                      >
                        <SelectTrigger className="border-purple-200 dark:border-purple-600 focus:border-purple-400">
                          <SelectValue placeholder="Buy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Buy">Buy</SelectItem>
                          <SelectItem value="Sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Second Row */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Date</label>
                      <Input
                        type="date"
                        value={editFormData.openTime}
                        onChange={(e) => handleEditFormInputChange("openTime", e.target.value)}
                        className="border-purple-200 dark:border-purple-600 focus:border-purple-400 dark:focus:border-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Trade Time</label>
                      <Input
                        type="time"
                        value={editFormData.tradeTime}
                        onChange={(e) => handleEditFormInputChange("tradeTime", e.target.value)}
                        className="border-purple-200 dark:border-purple-600 focus:border-purple-400 dark:focus:border-purple-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Timeframe</label>
                      <Select
                        value={editFormData.timeframe}
                        onValueChange={(value) => handleEditFormInputChange("timeframe", value)}
                      >
                        <SelectTrigger className="border-purple-200 dark:border-purple-600 focus:border-purple-400">
                          <SelectValue placeholder="1M" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1M">1M</SelectItem>
                          <SelectItem value="5M">5M</SelectItem>
                          <SelectItem value="15M">15M</SelectItem>
                          <SelectItem value="1H">1H</SelectItem>
                          <SelectItem value="4H">4H</SelectItem>
                          <SelectItem value="1D">1D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Third Row */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Trend</label>
                      <Select
                        value={editFormData.trend}
                        onValueChange={(value) => handleEditFormInputChange("trend", value)}
                      >
                        <SelectTrigger className="border-purple-200 dark:border-purple-600 focus:border-purple-400">
                          <SelectValue placeholder="Up" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Up">Up</SelectItem>
                          <SelectItem value="Down">Down</SelectItem>
                          <SelectItem value="Sideways">Sideways</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Lot Size</label>
                      <Input
                        value={editFormData.lotSize}
                        onChange={(e) => handleEditFormInputChange("lotSize", e.target.value)}
                        className="border-purple-200 dark:border-purple-600 focus:border-purple-400 dark:focus:border-purple-400"
                        placeholder="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Win/Loss</label>
                      <Select
                        value={editFormData.winLoss}
                        onValueChange={(value) => handleEditFormInputChange("winLoss", value)}
                      >
                        <SelectTrigger className="border-purple-200 dark:border-purple-600 focus:border-purple-400">
                          <SelectValue placeholder="Win" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="win">Win</SelectItem>
                          <SelectItem value="loss">Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fourth Row */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Net Profit</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editFormData.netProfit}
                        onChange={(e) => handleEditFormInputChange("netProfit", e.target.value)}
                        className="border-purple-200 dark:border-purple-600 focus:border-purple-400 dark:focus:border-purple-400"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Balance</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editFormData.balance}
                        onChange={(e) => handleEditFormInputChange("balance", e.target.value)}
                        className="border-purple-200 dark:border-purple-600 focus:border-purple-400 dark:focus:border-purple-400"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Candles</label>
                      <Select
                        value={editFormData.candles}
                        onValueChange={(value) => handleEditFormInputChange("candles", value)}
                      >
                        <SelectTrigger className="border-purple-200 dark:border-purple-600 focus:border-purple-400">
                          <SelectValue placeholder="Select candles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Candle</SelectItem>
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

                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEditedTrade}
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                    >
                      💾 Save Changes
                    </Button>
                  </div>
                </motion.div>
              </AnimatedContainer>
            )}

            {/* Trades Table - Updated to use demo trades with pagination */}
            <AnimatedContainer delay={0.4}>
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto mt-4 hover:shadow-lg transition-shadow duration-300" // Added dark mode styles
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-gray-600 dark:text-gray-300">TRADE</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">STRATEGY</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">PAIR</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">TYPE</TableHead> {/* Added dark mode text color */}
                      {/* Updated table headers */}
                      <TableHead className="text-gray-600 dark:text-gray-300">DATE</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">TRADE TIME</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">TIMEFRAME</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">TREND</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">LOT SIZE</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">CANDLES</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">W/L</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">NET PROFIT</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">BALANCE</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">ACTIONS</TableHead> {/* Added dark mode text color */}
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
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.id}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.strategy}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.pair}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-blue-500">{trade.type}</TableCell>
                        {/* Display Date and Trade Time separately */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.openTime}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.tradeTime}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.timeframe}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.trend}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.lotSize}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-red-500">{trade.candles}</TableCell>
                        <TableCell className={trade.winLoss === "win" ? "text-green-500" : "text-red-500"}>
                          {trade.winLoss === "win" ? "Win" : "Loss"}
                        </TableCell>
                        <TableCell className={parseFloat(trade.netProfit) >= 0 ? "text-green-500" : "text-red-500"}>
                          {trade.netProfit}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.balance}</TableCell> {/* Added dark mode text color */}
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                              onClick={() => handleViewTrade(trade)}
                              title="View daily trade analysis"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                              onClick={() => handleEditTrade(trade)}
                              title="Edit daily trade"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                      Showing {paginatedTrades.length > 0 ? ((currentPage - 1) * 5) + 1 : 0} to {Math.min(currentPage * 5, demoTrades.length)} of {demoTrades.length} results
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default DailyTradesPage;
