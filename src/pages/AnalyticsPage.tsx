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

const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Add state for current date/time

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

  // Use the trade data context for real trades
  const { realTrades } = useTradeData();

  // Calculate stats for real trades
  const stats = useMemo(() => calculateStats(realTrades), [realTrades]);

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


  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}> {/* Added inline style */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Analytics</h1>
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-full mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Real Account Analytics</h2> {/* Updated title */}

            {/* Analytics Stats Cards - Displaying Real Account Stats */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                  title="Balance"
                  value={`$${balance.toFixed(2)}`} // Using the local balance state
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
                  value={stats.totalTrades.toString()} // Using totalTrades from calculated stats
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
                <StatsCard
                  title="Daily Target"
                  value="$0.00" // Placeholder value - Daily Target is currently shared
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
                 <StatsCard
                  title="Daily Profit"
                  value={stats.dailyProfit >= 0 ? `+${formatCurrency(stats.dailyProfit)}` : formatCurrency(stats.dailyProfit)}
                  color={stats.dailyProfit >= 0 ? "text-green-500" : "text-red-500"}
                  labelPosition="below"
                  borderColor={stats.dailyProfit >= 0 ? "border-green-500" : "border-red-500"}
                />
              </div>
            </div>


            {/* Real Account History Table Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-gray-700">Real Account History</CardTitle> {/* Updated title */}
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
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
                      {/* Displaying real trades */}
                      {realTrades.map((trade) => (
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
                  <div className="px-4 py-3 text-xs text-gray-500">
                    Showing 1 to {realTrades.length} of {realTrades.length} results
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
