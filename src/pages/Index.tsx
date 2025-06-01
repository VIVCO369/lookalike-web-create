import { useState, useEffect, useMemo } from "react";
import { Plus, Clock, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import TradingRules from "../components/TradingRules";
import ScheduleList from "../components/ScheduleList";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import DetailedData from "../components/DetailedData";
import { useTradeData, calculateStats, TradeFormData } from "@/contexts/TradeDataContext"; // Import useTradeData, calculateStats, and TradeFormData
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/useLocalStorage"; // Import useLocalStorage
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

// Initial form data for adding/editing trades (for the modal on this page)
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


const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // Use local storage for balance - Dashboard specific
  const [balance, setBalance] = useLocalStorage<number>("dashboardBalance", 10.00);
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [newBalance, setNewBalance] = useLocalStorage<string>("dashboardNewBalanceInput", "");
  const { toast } = useToast();

  // State for Daily Target
  const [isSettingDailyTarget, setIsSettingDailyTarget] = useState(false);
  const [newDailyTarget, setNewDailyTarget] = useLocalStorage<string>("dashboardNewDailyTargetInput", "");

  // New state for Trading Rules progress
  const [tradingRulesProgress, setTradingRulesProgress] = useState(0);
  // State for Trading Rules card color
  const [tradingRulesCardColor, setTradingRulesCardColor] = useState("bg-white dark:bg-gray-800"); // Added dark mode class

  const [selectedTimeframes, setSelectedTimeframes] = useLocalStorage<string[]>("selectedTimeframes", ["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  // Use the trade data context for Dashboard Real Trades (removed dailyTarget from context)
  const {
    dashboardRealTrades, // Use dashboardRealTrades
    addTrade, // Import addTrade
    updateTrade, // Import updateTrade
    deleteTrade, // Import deleteTrade
    clearDashboardRealTrades, // Use clearDashboardRealTrades
  } = useTradeData();

  // Dashboard specific Daily Target
  const [dailyTarget, setDailyTarget] = useLocalStorage<number>("dashboardDailyTarget", 0.00);

  // Calculate stats for Dashboard Real Trades
  const stats = useMemo(() => calculateStats(dashboardRealTrades), [dashboardRealTrades]);

  // Pagination state for Dashboard Real Trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // State for managing the inline add/edit trade form for REAL trades
  const [showInlineForm, setShowInlineForm] = useState(false); // State to control inline form visibility
  const [tradeFormData, setTradeFormData] = useState<Omit<TradeFormData, 'id'>>(initialTradeFormData);
  const [editingTradeId, setEditingTradeId] = useState<number | null>(null); // State to track which trade is being edited

  // State for selected trades to delete
  const [selectedTrades, setSelectedTrades] = useState<number[]>([]);


  // Calculate total pages for Dashboard Real Trades
  const totalPages = Math.ceil(dashboardRealTrades.length / itemsPerPage);

  // Get paginated Dashboard Real Trades for current page
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return dashboardRealTrades.slice(startIndex, startIndex + itemsPerPage);
  }, [dashboardRealTrades, currentPage, itemsPerPage]);


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

  // Handler for setting Daily Target
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

  const toggleTimeframe = (timeframe: string) => {
    if (selectedTimeframes.includes(timeframe)) {
      setSelectedTimeframes(selectedTimeframes.filter(t => t !== timeframe));
    } else {
      setSelectedTimeframes([...selectedTimeframes, timeframe]);
    }
  };

  const numberOfRedButtons = timeframes.length - selectedTimeframes.length;
  const trend = numberOfRedButtons >= 3 ? "Down Trend" : "Up Trend";
  // Updated trendColor to use Tailwind classes directly for button background
  const trendColorClass = numberOfRedButtons >= 3 ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600";

  // Handle click on Trading Rules card
  const handleTradingRulesClick = () => {
    setTradingRulesCardColor("bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-700"); // Change color to green and add dark mode styles
    // You might want to revert the color after a delay or on another event
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

  // Handle reset Dashboard Real trades (This function is now called from AlertDialog in the new header)
  const handleResetDashboardRealTrades = () => {
    clearDashboardRealTrades();
    toast({
      title: "Dashboard Real Trades Cleared",
      description: "All dashboard real trade history has been removed.",
    });
    setCurrentPage(1); // Reset to the first page after clearing
    setSelectedTrades([]); // Clear selected trades
  };

  // Handle input changes in the trade form (for the modal on this page)
  const handleTradeFormInputChange = (field: keyof Omit<TradeFormData, 'id'>, value: string) => {
    setTradeFormData({ ...tradeFormData, [field]: value });
  };

  // Handle submitting the trade form (Add or Edit) (for the modal on this page)
  const handleSaveTrade = () => {
    if (editingTradeId !== null) {
      // Update existing trade
      updateTrade(editingTradeId, { ...tradeFormData, id: editingTradeId }, 'real'); // Update real trade
      toast({
        title: "Trade Updated",
        description: `Trade ${editingTradeId} has been updated.`,
      });
    } else {
      // Add new trade
      addTrade(tradeFormData as TradeFormData, 'real'); // Add real trade
      toast({
        title: "Trade Added",
        description: "Your real trade has been successfully saved",
      });
    }

    // Reset form and hide inline form
    setTradeFormData(initialTradeFormData);
    setEditingTradeId(null);
    setShowInlineForm(false); // Hide the inline form
  };

  // Handle opening the Add Trade inline form (for the modal on this page)
  const handleOpenAddTradeForm = () => {
    setTradeFormData(initialTradeFormData); // Clear form data
    setEditingTradeId(null); // Ensure not in editing mode
    setShowInlineForm(true); // Show the inline form
  };

  // Handle opening the Edit Trade inline form (for the modal on this page)
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
      deleteTrade(tradeId, 'real'); // Delete real trade
    });
    setSelectedTrades([]); // Clear selection after deleting
    toast({
      title: "Trades Deleted",
      description: `${selectedTrades.length} trade(s) have been removed.`,
    });
  };

  // Handle clicking the View icon - Enhanced and engaging version
  const handleViewTrade = (trade: TradeFormData) => {
    console.log("📊 Viewing Dashboard Trade Details:", trade);

    // Calculate trade performance metrics
    const profit = parseFloat(trade.netProfit);
    const isWin = trade.winLoss === "win";
    const profitEmoji = profit > 0 ? "💰" : profit < 0 ? "📉" : "➖";
    const resultEmoji = isWin ? "✅" : "❌";

    // Create an engaging and detailed view of the trade
    const tradeDetails = `
🏦 DASHBOARD TRADE ANALYSIS
═══════════════════════════════

📋 Trade Information:
   • Trade ID: #${trade.id}
   • Strategy: ${trade.strategy}
   • Trading Pair: ${trade.pair}
   • Position Type: ${trade.type.toUpperCase()}

📅 Timing Details:
   • Date: ${trade.openTime}
   • Time: ${trade.tradeTime}
   • Timeframe: ${trade.timeframe}
   • Market Trend: ${trade.trend}

⚙️ Trade Setup:
   • Lot Size: ${trade.lotSize}
   • Candles Analyzed: ${trade.candles}

📊 Results:
   • Outcome: ${trade.winLoss.toUpperCase()} ${resultEmoji}
   • Net Profit: ${formatCurrency(profit)} ${profitEmoji}
   • Account Balance: ${formatCurrency(parseFloat(trade.balance))}

💡 Performance Note:
   ${isWin ?
     "🎉 Successful trade! This trade contributed positively to your dashboard performance." :
     "📚 Learning opportunity. Analyze this trade to improve future performance."}
    `.trim();

    // Show engaging toast notification
    toast({
      title: `${profitEmoji} Dashboard Trade #${trade.id} ${resultEmoji}`,
      description: `${isWin ? "Profitable" : "Loss"} trade on ${trade.pair} • ${formatCurrency(profit)}`,
      duration: 6000,
    });

    // Show detailed alert with formatted information
    alert(`${tradeDetails}`);
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
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
          <div className="flex items-center gap-4"> {/* Adjusted gap */}
            {/* Changed Trend display from p to Button */}
            <Button
              variant="outline"
              size="sm"
              className={cn("text-white", trendColorClass)} // Apply dynamic background color class
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
          <AnimatedContainer delay={0.1}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">Dashboard</h2> {/* Changed text here and added dark mode text color */}
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
                  value={`$${balance.toFixed(2)}`}
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
                  title="Daily Target"
                  value={formatCurrency(dailyTarget)} // Use dailyTarget from context
                  labelPosition="below"
                  color="text-gray-700 dark:text-gray-200" // Added dark mode text color
                  borderColor="border-gray-200 dark:border-gray-700" // Added dark mode border color
                />
                <StatsCard
                  title="Today's P&L" // Changed title here
                  value={stats.dailyProfit >= 0 ? `+${formatCurrency(stats.dailyProfit)}` : formatCurrency(stats.dailyProfit)}
                  color={stats.dailyProfit >= 0 ? "text-green-500" : "text-red-500"}
                  labelPosition="below"
                  borderColor={stats.dailyProfit >= 0 ? "border-green-500 dark:border-green-700" : "border-red-500 dark:border-red-700"} // Added dark mode border color
                />
              </div>
            </div>
          </AnimatedContainer>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedContainer delay={0.2} className="md:col-span-1">
              {/* Added onClick handler and dynamic class for background color */}
              <div onClick={handleTradingRulesClick} className={cn("cursor-pointer", tradingRulesCardColor)}>
                <TradingRules hideAddButton={true} dashboardView={true} onProgressChange={setTradingRulesProgress} /> {/* Pass dashboardView prop */}
              </div>
            </AnimatedContainer>
            <AnimatedContainer delay={0.3} className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium text-center mb-6 text-gray-800 dark:text-gray-200">Signal Progress</h3> {/* Added dark mode text color */}
                  <div className="flex justify-center mb-4">
                    <div className="relative h-32 w-32">
                      {/* Increased thickness of the progress bar */}
                      <Progress value={tradingRulesProgress} className="h-full w-full rounded-full [&>div]:!bg-green-500" /> {/* Use tradingRulesProgress and set color */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{tradingRulesProgress.toFixed(0)}%</span> {/* Display progress with better contrast */}
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Trade Completed</p> {/* Added dark mode text color */}
                  <div className="flex justify-center">
                    {/* Conditional button text and color */}
                    <Button
                      variant={tradingRulesProgress === 100 ? "default" : "destructive"}
                      className={tradingRulesProgress === 100 ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                    >
                      {tradingRulesProgress === 100 ? "Take The Trade" : "Ready To Trade"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
            <AnimatedContainer delay={0.4} className="md:col-span-1">
              {/* Removed duplicate headline */}
              <ScheduleList hideAddButton={true} hideActions={true} /> {/* Pass hideActions={true} here */}
            </AnimatedContainer>
          </div>

          {/* Real Trading Detail Table - Updated to match Backtesting table UI */}
          <AnimatedContainer delay={0.5}>
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden mt-4 hover:shadow-lg transition-shadow duration-300" // Added dark mode styles
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {/* Top header bar with title and buttons */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b dark:border-gray-600">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Trade Details</h2> {/* Changed title to match picture */}
                <div className="flex gap-2">
                  <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleOpenAddTradeForm}> {/* Updated onClick */}
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                  {/* Reset Trades Button with AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50" disabled={selectedTrades.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedTrades.length})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your dashboard real trade data ({selectedTrades.length} trades).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {/* Call handleResetDashboardRealTrades directly */}
                        <AlertDialogAction onClick={handleDeleteSelectedTrades}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Inline Add/Edit Trade Form */}
              {showInlineForm && (
                <AnimatedContainer delay={0.1}>
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 mb-4"> {/* Added margin-bottom */}
                    <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                      {editingTradeId !== null ? "Edit Trade" : "Add New Trade"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Strategy</label>
                        <Input
                          placeholder="Strategy"
                          value={tradeFormData.strategy}
                          onChange={(e) => handleTradeFormInputChange("strategy", e.target.value)}
                          className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Pair</label>
                        <Select
                          value={tradeFormData.pair}
                          onValueChange={(value) => handleTradeFormInputChange("pair", value)}
                        >
                          <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
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
                        <label className="text-sm text-gray-700 dark:text-gray-300">Type</label>
                        <Select
                          value={tradeFormData.type}
                          onValueChange={(value) => handleTradeFormInputChange("type", value)}
                        >
                          <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Date</label>
                        <Input
                          type="date"
                          value={tradeFormData.openTime}
                          onChange={(e) => handleTradeFormInputChange("openTime", e.target.value)}
                          className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Trade Time</label>
                        <Input
                          type="time"
                          value={tradeFormData.tradeTime}
                          onChange={(e) => handleTradeFormInputChange("tradeTime", e.target.value)}
                          className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Timeframe</label>
                        <Select
                          value={tradeFormData.timeframe}
                          onValueChange={(value) => handleTradeFormInputChange("timeframe", value)}
                        >
                          <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <SelectItem value="1m">1M</SelectItem>
                            <SelectItem value="5m">5M</SelectItem>
                            <SelectItem value="15m">15M</SelectItem>
                            <SelectItem value="1h">1H</SelectItem>
                            <SelectItem value="4h">4H</SelectItem>
                            <SelectItem value="1d">1D</SelectItem>
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
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={handleCancelInlineForm}>Cancel</Button> {/* Added Cancel button */}
                      <Button onClick={handleSaveTrade}>
                        {editingTradeId !== null ? "Save Changes" : "Add Trade"}
                      </Button>
                    </div>
                  </div>
                </AnimatedContainer>
              )}


              <Table>
                <TableHeader className="bg-[#e6e6e6]"> {/* Changed background to light gray */}
                  <TableRow>
                    <TableHead className="w-[40px] text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"></TableHead> {/* Checkbox column - Changed text color and added border */}
                    <TableHead className="w-[80px] text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TRADE</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">STRATEGY</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">PAIR</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TYPE</TableHead> {/* Changed text color and added border */}
                    {/* Updated table headers */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">OPEN TIME</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TRADE TIME</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TIMEFRAME</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">TREND</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">LOT SIZE</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">CANDLES</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">W/L</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">NET PROFIT</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">BALANCE</TableHead> {/* Changed text color and added border */}
                    <TableHead className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">ACTIONS</TableHead> {/* Added dark mode text color and border */}
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
                      {/* Display Date and Trade Time separately */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.openTime}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.tradeTime}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.timeframe}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.trend}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.lotSize}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="text-red-500 border-b border-gray-200 dark:border-gray-700">{trade.candles}</TableCell> {/* Added border */}
                      <TableCell className={cn(trade.winLoss === "win" ? "text-green-500" : "text-red-500", "border-b border-gray-200 dark:border-gray-700")}> {/* Added border */}
                        {trade.winLoss === "win" ? "Win" : "Loss"}
                      </TableCell>
                      <TableCell className={cn(parseFloat(trade.netProfit) >= 0 ? "text-green-500" : "text-red-500", "border-b border-gray-200 dark:border-gray-700")}> {/* Added border */}
                        {trade.netProfit}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">{trade.balance}</TableCell> {/* Added dark mode text color and border */}
                      <TableCell className="border-b border-gray-200 dark:border-gray-700"> {/* Added border */}
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 hover:scale-105 hover:shadow-md"
                            onClick={() => handleViewTrade(trade)}
                            title="View live trade analysis"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleOpenEditTradeForm(trade)}> {/* Updated onClick */}
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
                    Showing {paginatedTrades.length > 0 ? ((currentPage - 1) * 5) + 1 : 0} to {Math.min(currentPage * 5, dashboardRealTrades.length)} of {dashboardRealTrades.length} results
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

        {/* Removed Add/Edit Trade Modal (for Real Trades) */}

      </div>
    );
  };

  export default Index;
