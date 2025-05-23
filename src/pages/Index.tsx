import { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";
import DetailedData from "../components/DetailedData";
import { useTradeData } from "@/contexts/TradeDataContext"; // Import the trade data context
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Input } from "@/components/ui/input"; // Ensure Input is also imported

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [balance, setBalance] = useState(10.00);
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const { toast } = useToast();

  // State for Daily Target
  const [isSettingDailyTarget, setIsSettingDailyTarget] = useState(false);
  const [newDailyTarget, setNewDailyTarget] = useState("");

  // New state for Trading Rules progress
  const [tradingRulesProgress, setTradingRulesProgress] = useState(0);
  // State for Trading Rules card color
  const [tradingRulesCardColor, setTradingRulesCardColor] = useState("bg-white");

  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>(["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  // Use the trade data context
  const { trades, dailyTarget, setDailyTarget } = useTradeData();

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
                value="$-216.84"
                color="text-red-500"
                borderColor="border-red-500"
              />
              <StatsCard
                title="Win Rate"
                value="0%"
                color="text-gray-700"
                borderColor="border-gray-200"
              />
              <StatsCard
                title="Best Trade"
                value="+$0"
                color="text-green-500"
                borderColor="border-green-500"
              />
              <StatsCard
                title="Worst Trade"
                value="$-23.11"
                color="text-red-500"
                borderColor="border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <StatsCard
                title="Total Trades"
                value={trades.length.toString()} // Use trades.length from context
                labelPosition="below"
                borderColor="border-gray-200"
              />
              <StatsCard
                title="Daily Target"
                value={`$${dailyTarget.toFixed(2)}`} // Use dailyTarget from context
                labelPosition="below"
                borderColor="border-gray-200"
              />
              <StatsCard
                title="Daily Profit"
                value="+$0.00"
                color="text-green-500"
                labelPosition="below"
                borderColor="border-gray-200"
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

          {/* Use the DetailedData component */}
          <DetailedData showAddTrade={true} />

          {/* Trades Table - Updated to use shared context */}
          <div className="bg-white rounded-md shadow overflow-x-auto mt-4">
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
                {trades.slice(0, 5).map((trade) => (
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
              Showing 1 to {Math.min(trades.length, 5)} of {trades.length} results
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
