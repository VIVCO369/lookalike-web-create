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
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext"; // Import useTradeData and calculateStats
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/useLocalStorage"; // Import useLocalStorage
// Removed AlertDialog imports as they are now in DetailedData

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
    clearDashboardRealTrades // Use clearDashboardRealTrades
  } = useTradeData();

  // Calculate stats for Dashboard Real Trades
  const stats = useMemo(() => calculateStats(dashboardRealTrades), [dashboardRealTrades]);

  // Pagination state for Dashboard Real Trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

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


  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
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
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {/* Added onClick handler and dynamic class for background color */}
              <div onClick={handleTradingRulesClick} className={cn("cursor-pointer", tradingRulesCardColor)}>
                <TradingRules hideAddButton={true} dashboardView={true} onProgressChange={setTradingRulesProgress} /> {/* Pass dashboardView prop */}
              </div>
            </div>
            <div className="md:col-span-1">
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
            </div>
            <div className="md:col-span-1">
              {/* Removed duplicate headline */}
              <ScheduleList hideAddButton={true} />
            </div>
          </div>

          {/* Use the DetailedData component for adding REAL trades */}
          {/* Pass the reset function and trade count */}
          <DetailedData
            showAddTrade={true}
            accountType="real"
            onResetTrades={handleResetDashboardRealTrades} // Pass the correct reset function
            tradeCount={dashboardRealTrades.length} // Pass the correct trade count
          />

          {/* Trades Table - Updated to use Dashboard Real trades with pagination */}
          <div className="bg-white rounded-md shadow overflow-x-auto mt-4">
            {/* Removed the div containing the title and reset button */}
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
                {paginatedTrades.map((trade) => (
                  <TableRow key={trade.id}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Added pagination UI */}
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {paginatedTrades.length > 0 ? ((currentPage - 1) * 5) + 1 : 0} to {Math.min(currentPage * 5, dashboardRealTrades.length)} of {dashboardRealTrades.length} results
              </div>
              {totalPages > 1 && (
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
