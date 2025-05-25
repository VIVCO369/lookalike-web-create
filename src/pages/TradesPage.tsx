import { Eye, Trash2, Edit, Plus, Clock } from "lucide-react";
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

const TradesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // Removed showAddTrade state as it's handled by DetailedData
  // Removed formData state as it's handled by DetailedData

  // Use the shared context for demo trades and daily target
  const { demoTrades, dailyTarget, setDailyTarget, clearDemoTrades } = useTradeData(); // Get clearDemoTrades

  // Calculate stats for demo trades
  const stats = useMemo(() => calculateStats(demoTrades), [demoTrades]);

  // Pagination state for demo trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // Calculate total pages for demo trades
  const totalPages = Math.ceil(demoTrades.length / itemsPerPage);

  // Get paginated demo trades for current page
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return demoTrades.slice(startIndex, startIndex + itemsPerPage);
  }, [demoTrades, currentPage, itemsPerPage]);

  // Use localStorage for timeframes and balance
  const [selectedTimeframes, setSelectedTimeframes] = useLocalStorage<string[]>("selectedTimeframes", ["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  const [balance, setBalance] = useLocalStorage<number>("userBalance", 10.00); // This balance might need to be separated for demo/real too
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [newBalance, setNewBalance] = useLocalStorage<string>("newBalanceInput", "");

  const [isSettingDailyTarget, setIsSettingDailyTarget] = useState(false);
  const [newDailyTarget, setNewDailyTarget] = useLocalStorage<string>("newDailyTargetInput", "");

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

  // Handle reset demo trades (This function is now called from AlertDialog in DetailedData)
  const handleResetDemoTrades = () => {
    clearDemoTrades();
    toast({
      title: "Demo Trades Cleared",
      description: "All demo trade history has been removed.",
    });
    setCurrentPage(1); // Reset to the first page after clearing
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
          {/* Replaced "Detailed Data" headline with time and date */}
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
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
          {/* Your Highlights Section - Displaying Demo Stats */}
          <AnimatedContainer delay={0.1}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-700">Demo Account</h2> {/* Updated title */}
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

                  {/* Daily Target Button and Input */}
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
                  value={`$${balance.toFixed(2)}`} // Using the local balance state for now
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
                  title="Daily Target" // Changed title from Avg. Duration
                  value={formatCurrency(dailyTarget)} // Use dailyTarget state
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
                <StatsCard
                  title="Today's P&L"
                  value={stats.netProfit >= 0 ? `+${formatCurrency(stats.netProfit)}` : formatCurrency(stats.netProfit)} // Changed to use stats.netProfit
                  color={stats.netProfit >= 0 ? "text-green-500" : "text-red-500"} // Changed to use stats.netProfit
                  labelPosition="below"
                  borderColor={stats.netProfit >= 0 ? "border-green-500" : "border-red-500"} // Changed to use stats.netProfit
                />
              </div>
            </div>
          </AnimatedContainer>

          {/* Use the DetailedData component for adding DEMO trades */}
          {/* Pass the reset function and trade count */}
          <AnimatedContainer delay={0.2}>
            <DetailedData
              showAddTrade={true}
              accountType="demo"
              onResetTrades={handleResetDemoTrades}
              tradeCount={demoTrades.length}
            />
          </AnimatedContainer>

          {/* Trades Table - Updated to use demo trades with pagination */}
          <AnimatedContainer delay={0.3}>
            <motion.div
              className="bg-white rounded-md shadow overflow-x-auto mt-4 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">TRADE</TableHead>
                    <TableHead>STRATEGY</TableHead>
                    <TableHead>PAIR</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>OPEN TIME</TableHead>
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
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
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
        </main>
      </div>
    </div>
  );
};

export default TradesPage;
