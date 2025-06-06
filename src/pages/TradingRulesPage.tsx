import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "../components/Sidebar";
import TradingRules from "../components/TradingRules";
import { useState, useEffect } from "react"; // Import useEffect
import { cn } from "@/lib/utils"; // Import cn utility
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion
import useLocalStorage from "@/hooks/useLocalStorage";
import { useTradeData } from "@/contexts/TradeDataContext";
import { useToast } from "@/components/ui/use-toast";

// Interface for trade data
interface TradeData {
  id: string;
  strategy: string;
  pair: string;
  type: string;
  tradeCount: number;
  win: number;
  loss: number;
}

const TradingRulesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Add state for current date/time
  const { toast } = useToast();

  // Get trade data from Start Trade context
  const { backtestingTrades } = useTradeData();

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

  // Generate trade data automatically from Start Trade entries
  const generateTradeData = (): TradeData[] => {
    const tradeGroups: { [key: string]: TradeData } = {};

    backtestingTrades.forEach(trade => {
      const key = `${trade.strategy}-${trade.pair}-${trade.type}`;

      if (!tradeGroups[key]) {
        tradeGroups[key] = {
          id: key,
          strategy: trade.strategy,
          pair: trade.pair,
          type: trade.type,
          tradeCount: 0,
          win: 0,
          loss: 0
        };
      }

      tradeGroups[key].tradeCount++;

      if (trade.winLoss === 'win') {
        tradeGroups[key].win++;
      } else if (trade.winLoss === 'loss') {
        tradeGroups[key].loss++;
      }
    });

    return Object.values(tradeGroups);
  };

  // Get current trade data
  const tradeData = generateTradeData();




  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}> {/* Added dynamic padding */}
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm" // Added dark mode styles
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Trading Rules</h1> {/* Added dark mode text color */}
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
            <p className="text-orange-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6" style={{ backgroundColor: '#f7f5f0' }}>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Trading Rules Component */}
            <AnimatedContainer delay={0.1}>
              <TradingRules />
            </AnimatedContainer>

            {/* Trade Data Table */}
            <AnimatedContainer delay={0.2}>
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5 text-orange-500" />
                      Trade Data Management ({tradeData.length} unique combinations)
                    </CardTitle>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Auto-generated from Start Trade entries
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Trade Data Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800">
                          <TableHead className="font-semibold">TRADE</TableHead>
                          <TableHead className="font-semibold">STRATEGY</TableHead>
                          <TableHead className="font-semibold">PAIR</TableHead>
                          <TableHead className="font-semibold">TYPE</TableHead>
                          <TableHead className="font-semibold">WIN</TableHead>
                          <TableHead className="font-semibold">LOSS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tradeData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No trade data available. Add trades in Start Trade page to see data here.
                            </TableCell>
                          </TableRow>
                        ) : (
                          tradeData.map((trade) => (
                            <TableRow key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <TableCell className="font-medium">
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {trade.tradeCount}
                                </span>
                              </TableCell>
                              <TableCell>{trade.strategy}</TableCell>
                              <TableCell>{trade.pair}</TableCell>
                              <TableCell>
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  trade.type === "Buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                )}>
                                  {trade.type}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-green-600 font-medium">{trade.win}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-red-600 font-medium">{trade.loss}</span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradingRulesPage;
