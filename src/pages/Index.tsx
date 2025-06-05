import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";

import DailyProfitTarget from "../components/DailyProfitTarget";
import WeeklySessionActivity from "../components/WeeklySessionActivity";



import useTradeGoals from "../hooks/useTradeGoals";
import { cn } from "@/lib/utils";
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import AnimatedContainer from "@/components/AnimatedContainer";
import { motion } from "framer-motion";




const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [selectedTimeframes, setSelectedTimeframes] = useLocalStorage<string[]>("selectedTimeframes", ["1M", "15M", "1H", "4H", "1D"]);
  const timeframes = ["1M", "5M", "15M", "1H", "4H", "1D"];

  // Use the trade data context for Start Trade data for Daily Profit Target calculation
  const { backtestingTrades } = useTradeData();

  // Get Daily Profit Target from Trade Goals
  const { dailyProfitTarget } = useTradeGoals();

  // Calculate current profit from Start Trade data for Daily Profit Target
  const startTradeStats = useMemo(() => calculateStats(backtestingTrades), [backtestingTrades]);

  // Use netProfit to match Start Trade "Today's P&L" calculation
  const currentProfitFromStartTrade = startTradeStats.netProfit;

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


  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm" // Added dark mode styles
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
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
          {/* Daily Profit Target - Top Priority */}
          <AnimatedContainer delay={0.05}>
            <div className="mb-8">
              <DailyProfitTarget
                currentProfit={currentProfitFromStartTrade}
                dailyTarget={dailyProfitTarget}
                onSetTarget={() => {}} // Disabled - must be set through Trade Goals
                readOnly={true} // Read-only mode - targets managed in Trade Goals
              />
            </div>
          </AnimatedContainer>

          {/* Weekly Session Activity */}
          <AnimatedContainer delay={0.1}>
            <div className="mb-8">
              <WeeklySessionActivity />
            </div>
          </AnimatedContainer>








        </main>
      </div>

      {/* Removed Add/Edit Trade Modal (for Real Trades) */}

    </div>
  );
};

export default Index;
