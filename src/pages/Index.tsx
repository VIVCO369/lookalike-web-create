
import { useState, useEffect } from "react";
import { 
  Plus,
  Clock,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import TradingRules from "../components/TradingRules";
import ScheduleList from "../components/ScheduleList";
import { Link } from "react-router-dom";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [balance, setBalance] = useState(10.00);
  const [isSettingBalance, setIsSettingBalance] = useState(false);
  const [isAddingProfit, setIsAddingProfit] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [newProfit, setNewProfit] = useState("");
  const { toast } = useToast();

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
  
  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
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
  
  const handleAddProfit = () => {
    const parsedProfit = parseFloat(newProfit);
    if (isNaN(parsedProfit)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    
    setBalance(prev => prev + parsedProfit);
    setIsAddingProfit(false);
    setNewProfit("");
    
    toast({
      title: "Profit added",
      description: `$${parsedProfit.toFixed(2)} has been added to your balance`,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <p className="text-gray-600 text-sm">{formatDate(currentDateTime)}</p>
            <p className="text-gray-500 text-xs">{formatTime(currentDateTime)}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="rounded-full p-2">
              <Clock className="h-5 w-5 text-gray-500" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">VS</span>
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
                
                {isAddingProfit ? (
                  <div className="flex gap-2 items-center">
                    <input 
                      type="number" 
                      value={newProfit}
                      onChange={(e) => setNewProfit(e.target.value)}
                      placeholder="Enter profit amount" 
                      className="border p-1 rounded text-sm" 
                    />
                    <Button 
                      size="sm" 
                      onClick={handleAddProfit}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setIsAddingProfit(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => setIsAddingProfit(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Profit
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
                value="10" 
                labelPosition="below"
                borderColor="border-gray-200" 
              />
              <StatsCard 
                title="Avg. Duration" 
                value="13h 09m 09s" 
                labelPosition="below"
                borderColor="border-gray-200" 
              />
              <StatsCard 
                title="Profit Factor" 
                value="0.00" 
                labelPosition="below"
                borderColor="border-gray-200" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="lg:col-start-3">
                <StatsCard 
                  title="Daily Profit" 
                  value="+$0.00" 
                  color="text-green-500"
                  labelPosition="below"
                  borderColor="border-gray-200" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Trading Rules</h3>
                <Link to="/trading-rules" className="text-blue-500 text-sm flex items-center hover:underline">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Today's Schedule</h3>
                <Link to="/schedule" className="text-blue-500 text-sm flex items-center hover:underline">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <ScheduleList hideAddButton={true} />
              <div className="mt-4 flex justify-end">
                <Link to="/trades">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    View Trades <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
