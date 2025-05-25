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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion


const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // Use local storage for balance
  const [balance, setBalance] = useLocalStorage<number>("userBalance", 10.00);
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [newBalance, setNewBalance] = useLocalStorage<string>("newBalanceInput", "");
  const { toast } = useToast();

  // State for Daily Target
  const [isSettingDailyTarget, setIsSettingDailyTarget] = useState(false);
  const [newDailyTarget, setNewDailyTarget] = useLocalStorage<string>("newDailyTargetInput", "");

  // New state for Trading Rules progress
  const [tradingRulesProgress, setTradingRulesProgress] = useState(0);
  // State for Trading Rules card color
  const [tradingRulesCardColor, setTradingRulesCardColor] = useState("bg-white");

  const [selectedTimeframes, setSelectedTimeframes] = useLocalStorage<string[]>("selectedTimeframes", ["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  // Use the trade data context for Dashboard Real Trades and daily target
  const {
    dashboardRealTrades, // Use dashboardRealTrades
    dailyTarget,
    setDailyTarget,
    clearDashboardRealTrades, // Use clearDashboardRealTrades
    updateTrade, // Import updateTrade
    deleteTrade, // Import deleteTrade
  } = useTradeData();

  // Calculate stats for Dashboard Real Trades
  const stats = useMemo(() => calculateStats(dashboardRealTrades), [dashboardRealTrades]);

  // Pagination state for Dashboard Real Trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // State for selected trade for view/edit/delete
  const [selectedTrade, setSelectedTrade] = useState<TradeFormData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<TradeFormData | null>(null);


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
    setTradingRulesCardColor("bg-green-100 border-green-500"); // Change color to green
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

  // Handle reset Dashboard Real trades
  const handleResetDashboardRealTrades = () => {
    clearDashboardRealTrades();
    toast({
      title: "Dashboard Real Trades Cleared",
      description: "All dashboard real trade history has been removed.",
    });
    setCurrentPage(1); // Reset to the first page after clearing
  };

  // Handle View icon click
  const handleViewTrade = (trade: TradeFormData) => {
    setSelectedTrade(trade);
    setIsViewDialogOpen(true);
  };

  // Handle Edit icon click
  const handleEditTrade = (trade: TradeFormData) => {
    setSelectedTrade(trade);
    setEditFormData(trade); // Initialize edit form with selected trade data
    setIsEditDialogOpen(true);
  };

  // Handle Delete icon click
  const handleDeleteTrade = (trade: TradeFormData) => {
    setSelectedTrade(trade);
    setIsDeleteDialogOpen(true);
  };

  // Handle saving edited trade
  const handleSaveEdit = () => {
    if (editFormData && selectedTrade?.id !== undefined) {
      updateTrade(selectedTrade.id, editFormData, 'real'); // Update trade in context
      toast({
        title: "Trade Updated",
        description: `Trade ${selectedTrade.id} has been updated.`,
      });
      setIsEditDialogOpen(false);
      setSelectedTrade(null);
      setEditFormData(null);
    }
  };

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (selectedTrade?.id !== undefined) {
      deleteTrade(selectedTrade.id, 'real'); // Delete trade from context
      toast({
        title: "Trade Deleted",
        description: `Trade ${selectedTrade.id} has been deleted.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedTrade(null);
    }
  };


  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
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
                <h2 className="text-xl font-medium text-gray-700">Dashboard</h2> {/* Changed text here */}
                <div className="flex gap-2">
                  {isSettingBalance ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        placeholder="Enter new balance"
                        className="border p-1 rounded text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={handleSetBalance}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Set
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
                      <Plus className="h-4 w-4 mr-1" /> Set Balance
                    </Button>
                  )}

                  {isSettingDailyTarget ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={newDailyTarget}
                        onChange={(e) => setNewDailyTarget(e.target.value)}
                        placeholder="Enter daily target"
                        className="border p-1 rounded text-sm"
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
                  title="Balance"
                  value={`$${balance.toFixed(2)}`}
                  color="text-green-500"
                  borderColor="border-green-500"
                />
                <StatsCard
                  title="Net Profit"
                  value={formatCurrency(stats.netProfit)}
                  color={stats.netProfit >= 0 ? "text-green-500" : "text-red-500"}
                  borderColor={stats.netProfit >= 0 ? "border-green-500" : "border-red-500"}
                />
                <StatsCard
                  title="Win Rate"
                  value={stats.winRate}
                  color="text-gray-700"
                  borderColor="border-gray-200"
                />
                <StatsCard
                  title="Best Trade"
                  value={stats.bestTrade > 0 ? `+${formatCurrency(stats.bestTrade)}` : formatCurrency(stats.bestTrade)}
                  color="text-green-500"
                  borderColor="border-green-500"
                />
                <StatsCard
                  title="Worst Trade"
                  value={formatCurrency(stats.worstTrade)}
                  color="text-red-500"
                  borderColor="border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <StatsCard
                  title="Total Trades"
                  value={stats.totalTrades.toString()} // Use totalTrades from calculated stats
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
                <StatsCard
                  title="Daily Target"
                  value={formatCurrency(dailyTarget)} // Use dailyTarget from context
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
                <StatsCard
                  title="Today's P&L" // Changed title here
                  value={stats.dailyProfit >= 0 ? `+${formatCurrency(stats.dailyProfit)}` : formatCurrency(stats.dailyProfit)}
                  color={stats.dailyProfit >= 0 ? "text-green-500" : "text-red-500"}
                  labelPosition="below"
                  borderColor={stats.dailyProfit >= 0 ? "border-green-500" : "border-red-500"}
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
                  <h3 className="text-lg font-medium text-center mb-6">Signal Progress</h3>
                  <div className="flex justify-center mb-4">
                    <div className="relative h-32 w-32">
                      {/* Increased thickness of the progress bar */}
                      <Progress value={tradingRulesProgress} className="h-full w-full rounded-full [&>div]:!bg-green-500" /> {/* Use tradingRulesProgress and set color */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{tradingRulesProgress.toFixed(0)}%</span> {/* Display progress with better contrast */}
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 mb-6">Trade Completed</p>
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

          {/* Use the DetailedData component for adding REAL trades */}
          {/* Pass the reset function and trade count */}
          <AnimatedContainer delay={0.5}>
            <DetailedData
              showAddTrade={true}
              accountType="real"
              onResetTrades={handleResetDashboardRealTrades} // Pass the correct reset function
              tradeCount={dashboardRealTrades.length} // Pass the correct trade count
            />
          </AnimatedContainer>

          {/* Trades Table - Updated to use Dashboard Real trades with pagination */}
          <AnimatedContainer delay={0.6}>
            <motion.div
              className="bg-white rounded-md shadow overflow-x-auto mt-4 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {/* Removed the div containing the title and reset button */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">TRADE</TableHead>
                    <TableHead>STRATEGY</TableHead>
                    <TableHead>PAIR</TableHead>
                    <TableHead>TYPE</TableHead>
                    {/* Updated table headers */}
                    <TableHead>DATE</TableHead>
                    <TableHead>TRADE TIME</TableHead>
                    <TableHead>TIMEFRAME</TableHead>
                    <TableHead>TREND</TableHead>
                    <TableHead>LOT SIZE</TableHead>
                    <TableHead>CANDLES</TableHead>
                    <TableHead>W/L</TableHead>
                    <TableHead>NET PROFIT</TableHead>
                    <TableHead>BALANCE</TableHead>
                    <TableHead>ACTIONS</TableHead>
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
                    >
                      <TableCell>{trade.id}</TableCell>
                      <TableCell>{trade.strategy}</TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell className="text-blue-500">{trade.type}</TableCell>
                      {/* Display Date and Trade Time separately */}
                      <TableCell>{trade.openTime}</TableCell>
                      <TableCell>{trade.tradeTime}</TableCell>
                      <TableCell>{trade.timeframe}</TableCell>
                      <TableCell>{trade.trend}</TableCell>
                      <TableCell>{trade.lotSize}</TableCell>
                      <TableCell className="text-red-500">{trade.candles}</TableCell>
                      <TableCell className={trade.winLoss === "win" ? "text-green-500" : "text-red-500"}>
                        {trade.winLoss === "win" ? "Win" : "Loss"}
                      </TableCell>
                      <TableCell className={parseFloat(trade.netProfit) >= 0 ? "text-green-500" : "text-red-500"}>
                        {trade.netProfit}
                      </TableCell>
                      <TableCell>{trade.balance}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewTrade(trade)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditTrade(trade)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteTrade(trade)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
                {/* Removed TableCaption */}
              </Table>

              {/* Added pagination UI */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
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

      {/* View Trade Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trade Details</DialogTitle>
            <DialogDescription>
              Details for Trade ID: {selectedTrade?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedTrade && (
              <>
                <div><strong>Strategy:</strong> {selectedTrade.strategy}</div>
                <div><strong>Pair:</strong> {selectedTrade.pair}</div>
                <div><strong>Type:</strong> {selectedTrade.type}</div>
                {/* Display Date and Trade Time separately */}
                <div><strong>Date:</strong> {selectedTrade.openTime}</div>
                <div><strong>Trade Time:</strong> {selectedTrade.tradeTime}</div>
                <div><strong>Timeframe:</strong> {selectedTrade.timeframe}</div>
                <div><strong>Trend:</strong> {selectedTrade.trend}</div>
                <div><strong>Lot Size:</strong> {selectedTrade.lotSize}</div>
                <div><strong>Win/Loss:</strong> {selectedTrade.winLoss}</div>
                <div><strong>Net Profit:</strong> {selectedTrade.netProfit}</div>
                <div><strong>Balance:</strong> {selectedTrade.balance}</div>
                <div><strong>Candles:</strong> {selectedTrade.candles}</div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trade Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Trade</DialogTitle>
            <DialogDescription>
              Edit details for Trade ID: {selectedTrade?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editFormData && (
              <>
                <div className="space-y-2">
                  <label className="text-sm">Strategy</label>
                  <Input
                    value={editFormData.strategy}
                    onChange={(e) => setEditFormData({ ...editFormData, strategy: e.target.value })}
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-sm">Pair</label>
                   <Select
                      value={editFormData.pair}
                      onValueChange={(value) => setEditFormData({ ...editFormData, pair: value })}
                    >
                      <SelectTrigger>
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
                        <SelectItem value="Crash 1000 Index">Crash 1000 Index</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Type</label>
                   <Select
                      value={editFormData.type}
                      onValueChange={(value) => setEditFormData({ ...editFormData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  {/* Changed label to Date and input type to date */}
                  <label className="text-sm">Date</label>
                  <Input
                    type="date"
                    value={editFormData.openTime}
                    onChange={(e) => setEditFormData({ ...editFormData, openTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  {/* Changed label to Trade Time and input type to time */}
                  <label className="text-sm">Trade Time</label>
                  <Input
                    type="time"
                    value={editFormData.tradeTime}
                    onChange={(e) => setEditFormData({ ...editFormData, tradeTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Timeframe</label>
                   <Select
                      value={editFormData.timeframe}
                      onValueChange={(value) => setEditFormData({ ...editFormData, timeframe: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m1">M1</SelectItem>
                        <SelectItem value="m5">M5</SelectItem>
                        <SelectItem value="m15">M15</SelectItem>
                        <SelectItem value="h1">H1</SelectItem>
                        <SelectItem value="h4">H4</SelectItem>
                        <SelectItem value="d1">D1</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Trend</label>
                   <Select
                      value={editFormData.trend}
                      onValueChange={(value) => setEditFormData({ ...editFormData, trend: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Up</SelectItem>
                        <SelectItem value="down">Down</SelectItem>
                        <SelectItem value="sideways">Sideways</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Lot Size</label>
                  <Input
                    type="number"
                    value={editFormData.lotSize}
                    onChange={(e) => setEditFormData({ ...editFormData, lotSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Win/Loss</label>
                   <Select
                      value={editFormData.winLoss}
                      onValueChange={(value) => setEditFormData({ ...editFormData, winLoss: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="loss">Loss</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Net Profit</label>
                  <Input
                    type="number"
                    value={editFormData.netProfit}
                    onChange={(e) => setEditFormData({ ...editFormData, netProfit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Balance</label>
                  <Input
                    type="number"
                    value={editFormData.balance}
                    onChange={(e) => setEditFormData({ ...editFormData, balance: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Candles</label>
                  <Input
                    value={editFormData.candles}
                    onChange={(e) => setEditFormData({ ...editFormData, candles: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Trade AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Trade ID: {selectedTrade?.id}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Index;
