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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Input } from "@/components/ui/input"; // Ensure Input is also imported

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [balance, setBalance] = useState(10.00);
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [isAddingProfit, setIsAddingProfit] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [newProfit, setNewProfit] = useState("");
  const { toast } = useToast();

  // State for Daily Target
  const [dailyTarget, setDailyTarget] = useState(0.00);
  const [isSettingDailyTarget, setIsSettingDailyTarget] = useState(false);
  const [newDailyTarget, setNewDailyTarget] = useState("");


  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>(["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  // Sample trade data
  const trades = [
    { id: 1, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:32", tradeTime: "13h 25m 23s", timeframe: "M1", trend: "Up", lotSize: "0.10", candles: "Loss", wl: "-23.11", netProfit: "-23.11", balance: "1000.00" },
    { id: 2, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:31", tradeTime: "13h 11m 56s", timeframe: "M5", trend: "Down", lotSize: "0.50", candles: "Loss", wl: "-21.80", netProfit: "-21.80", balance: "976.89" },
  ];

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
  const trendColor = numberOfRedButtons >= 3 ? "text-red-500" : "text-green-500";


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
            <div>
              <p className={trendColor}>Trend: {trend}</p>
            </div>
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
              <h2 className="text-xl font-medium text-gray-700">Your Highlights</h2>
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
                value={trades.length.toString()} // Updated value to trades.length
                labelPosition="below"
                borderColor="border-gray-200"
              />
              {/* Removed Avg. Duration card */}
              <StatsCard
                title="Daily Target" // Changed title from Profit Factor
                value={`$${dailyTarget.toFixed(2)}`} // Use dailyTarget state
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
            {/* Removed the empty third grid div */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {/* Removed duplicate headline */}
              <TradingRules hideAddButton={true} />
            </div>
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium text-center mb-6">Signal Progress</h3>
                  <div className="flex justify-center mb-4">
                    <div className="relative h-32 w-32">
                      <Progress value={50} className="h-full w-full rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">50%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 mb-6">Trade Completed</p>
                  <div className="flex justify-center">
                    <Button variant="destructive">Ready To Trade</Button>
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

          {/* Trades Table - Updated to match the image */}
          <div className="bg-white rounded-md shadow overflow-x-auto mt-4">
            {/* Removed the h2 heading from here */}
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
                {trades.slice(0, 2).map((trade) => (
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
                    <TableCell className="text-red-500">{trade.wl}</TableCell>
                    <TableCell className="text-red-500">{trade.netProfit}</TableCell>
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
              Showing 1 to 2 of 5 results
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
