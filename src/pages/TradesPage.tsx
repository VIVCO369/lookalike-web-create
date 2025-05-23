import { Eye, Trash2, Edit, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
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
import { useTradeData, TradeFormData } from "@/contexts/TradeDataContext";

const initialTradeFormData: TradeFormData = {
  strategy: "",
  pair: "Boom 500 Index",
  type: "buy",
  openTime: "",
  tradeTime: "",
  timeframe: "m1",
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
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [formData, setFormData] = useState<TradeFormData>(initialTradeFormData);
  
  // Use the shared context for trades and daily target
  const { trades, addTrade, dailyTarget, setDailyTarget } = useTradeData();
  
  // Use localStorage for timeframes and balance
  const [selectedTimeframes, setSelectedTimeframes] = useLocalStorage<string[]>("selectedTimeframes", ["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];
  
  const [balance, setBalance] = useLocalStorage<number>("userBalance", 10.00);
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [newBalance, setNewBalance] = useLocalStorage<string>("newBalanceInput", "");
  
  const [isSettingDailyTarget, setIsSettingDailyTarget] = useState(false);
  const [newDailyTarget, setNewDailyTarget] = useLocalStorage<string>("newDailyTargetInput", "");
  
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAddTrade = () => {
    setShowAddTrade(!showAddTrade);
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

  const handleInputChange = (field: keyof TradeFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Add the trade to the shared context
    addTrade(formData);
    
    toast({
      title: "Trade Added",
      description: "Your trade has been successfully saved",
    });
    
    // Reset form data
    setFormData(initialTradeFormData);
    
    // Close the form
    setShowAddTrade(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}> 
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
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
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Your Highlights Section */}
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

            {/* Combined the second and third grid rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <StatsCard
                title="Total Trades"
                value={trades.length.toString()} // Updated value to trades.length
                labelPosition="below"
                borderColor="border-gray-200"
              />
              <StatsCard
                title="Daily Target" // Changed title from Avg. Duration
                value={`$${dailyTarget.toFixed(2)}`} // Use dailyTarget state
                labelPosition="below"
                borderColor="border-gray-200"
              />
              {/* Removed Profit Factor card */}
              <StatsCard
                title="Daily Profit"
                value="+$0.00"
                color="text-green-500"
                labelPosition="below"
                borderColor="border-gray-201"
              />
            </div>
            {/* Removed the empty third grid div */}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-500 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Trades
              </span>
            </div>
            <Button onClick={toggleAddTrade} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Trade
            </Button>
          </div>

          {/* Add Trade Form with local storage */}
          {showAddTrade && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Add New Trade Entry</h3>
                {/* Adjusted grid layout to 2 columns on medium/large screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Strategy</label>
                    <Input 
                      placeholder="Strategy" 
                      value={formData.strategy}
                      onChange={(e) => handleInputChange("strategy", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Pair</label>
                    <Select 
                      value={formData.pair}
                      onValueChange={(value) => handleInputChange("pair", value)}
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
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
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
                    <label className="text-sm">Open Time</label>
                    <Input 
                      type="datetime-local" 
                      value={formData.openTime}
                      onChange={(e) => handleInputChange("openTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Trade Time</label>
                    <Input 
                      placeholder="Trade Time" 
                      value={formData.tradeTime}
                      onChange={(e) => handleInputChange("tradeTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Timeframe</label>
                    <Select 
                      value={formData.timeframe}
                      onValueChange={(value) => handleInputChange("timeframe", value)}
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
                      value={formData.trend}
                      onValueChange={(value) => handleInputChange("trend", value)}
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
                      placeholder="0.01" 
                      step="0.01" 
                      value={formData.lotSize}
                      onChange={(e) => handleInputChange("lotSize", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Win/Loss</label>
                    <Select 
                      value={formData.winLoss}
                      onValueChange={(value) => handleInputChange("winLoss", value)}
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
                      placeholder="0.00" 
                      step="0.01" 
                      value={formData.netProfit}
                      onChange={(e) => handleInputChange("netProfit", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Balance</label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01" 
                      value={formData.balance}
                      onChange={(e) => handleInputChange("balance", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Candles</label>
                    <Input 
                      placeholder="Candles" 
                      value={formData.candles}
                      onChange={(e) => handleInputChange("candles", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={toggleAddTrade}>Cancel</Button>
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleSubmit}
                  >
                    Add Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trades Table - Updated to use shared context */}
          <div className="bg-white rounded-md shadow">
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
                {trades.map((trade) => (
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
                    <TableCell className={trade.winLoss === "win" ? "text-green-500" : "text-red-500"}>{trade.netProfit}</TableCell>
                    <TableCell className={parseFloat(trade.netProfit) >= 0 ? "text-green-500" : "text-red-500"}>{trade.netProfit}</TableCell>
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

            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing 1 to 5 of 15 results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradesPage;
