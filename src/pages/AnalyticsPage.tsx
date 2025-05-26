import { useState, useMemo, useEffect } from "react"; // Import useEffect
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { BarChart3, Eye, Edit, Trash2, Clock } from "lucide-react"; // Import Clock icon
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "../components/StatsCard";
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext"; // Import useTradeData and calculateStats
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
import { useToast } from "@/components/ui/use-toast"; // Import useToast

const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Add state for current date/time
  const { toast } = useToast(); // Call useToast hook to get the toast function

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

  // Helper function to format the date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Helper function to format the time
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  // Use the trade data context for Analytics Real Trades
  const { analyticsRealTrades, clearAnalyticsRealTrades } = useTradeData(); // Use analyticsRealTrades and clearAnalyticsRealTrades

  // Calculate stats for Analytics Real Trades
  const stats = useMemo(() => calculateStats(analyticsRealTrades), [analyticsRealTrades]);

  // Use local storage for balance (assuming analytics shows real account balance)
  const [balance] = useLocalStorage<number>("userBalance", 10.00);

  // Format currency values for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle reset Analytics Real trades
  const handleResetAnalyticsRealTrades = () => {
    clearAnalyticsRealTrades();
    toast({
      title: "Analytics Real Trades Cleared",
      description: "All analytics real trade history has been removed.",
    });
    // No pagination state to reset on this page currently
  };


  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10"> {/* Added dark mode styles */}
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Analytics</h1> {/* Added dark mode text color */}
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-full mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">Real Account Analytics</h2> {/* Updated title and added dark mode text color */}

            {/* Analytics Stats Cards - Displaying Real Account Stats */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                  title="Balance"
                  value={`$${balance.toFixed(2)}`} // Using the local balance state
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <StatsCard
                  title="Total Trades"
                  value={stats.totalTrades.toString()} // Using totalTrades from calculated stats
                  labelPosition="below"
                  color="text-gray-700 dark:text-gray-200" // Added dark mode text color
                  borderColor="border-gray-200 dark:border-gray-700" // Added dark mode border color
                />
                <StatsCard
                  title="Daily Target"
                  value="$0.00" // Placeholder value - Daily Target is currently shared
                  labelPosition="below"
                  color="text-gray-700 dark:text-gray-200" // Added dark mode text color
                  borderColor="border-gray-200 dark:border-gray-700" // Added dark mode border color
                />
                 <StatsCard
                  title="Daily Profit"
                  value={stats.dailyProfit >= 0 ? `+${formatCurrency(stats.dailyProfit)}` : formatCurrency(stats.dailyProfit)}
                  color={stats.dailyProfit >= 0 ? "text-green-500" : "text-red-500"}
                  labelPosition="below"
                  borderColor={stats.dailyProfit >= 0 ? "border-green-500 dark:border-green-700" : "border-red-500 dark:border-red-700"} // Added dark mode border color
                />
              </div>
            </div>


            {/* Real Account History Table Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between"> {/* Flex container for title and button */}
                  <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200">Real Account History</CardTitle> {/* Updated title and added dark mode text color */}
                  {/* Reset Analytics Trades Button with AlertDialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
                        <Trash2 className="mr-2 h-4 w-4" /> Reset Analytics Trades
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your analytics real trade data ({analyticsRealTrades.length} trades).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetAnalyticsRealTrades}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] text-gray-600 dark:text-gray-300">TRADE</TableHead> {/* Added dark mode text color */}
                        <TableHead className="text-gray-600 dark:text-gray-300">STRATEGY</TableHead> {/* Added dark mode text color */}
                        <TableHead className="text-gray-600 dark:text-gray-300">PAIR</TableHead> {/* Added dark mode text color */}
                        <TableHead className="text-gray-600 dark:text-gray-300">TYPE</TableHead> {/* Added dark mode text color */}
                        <TableHead className="text-gray-600 dark:text-gray-300">OPEN TIME</TableHead> {/* Added dark mode text color */}
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
                      {/* Displaying analytics real trades */}
                      {analyticsRealTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell className="text-gray-900 dark:text-gray-100">{trade.id}</TableCell> {/* Added dark mode text color */}
                          <TableCell className="text-gray-900 dark:text-gray-100">{trade.strategy}</TableCell> {/* Added dark mode text color */}
                          <TableCell className="text-gray-900 dark:text-gray-100">{trade.pair}</TableCell> {/* Added dark mode text color */}
                          <TableCell className="text-blue-500">{trade.type}</TableCell>
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
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400"> {/* Added dark mode text color */}
                    Showing 1 to {analyticsRealTrades.length} of {analyticsRealTrades.length} results
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
