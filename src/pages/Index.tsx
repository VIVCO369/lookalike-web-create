import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";

import DailyProfitTarget from "../components/DailyProfitTarget";
import WeeklySessionActivity from "../components/WeeklySessionActivity";
import TimePLChart from "../components/TimePLChart";
import TimeTradesChart from "../components/TimeTradesChart";



import useTradeGoals from "../hooks/useTradeGoals";
import { cn } from "@/lib/utils";
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext";
import useLocalStorage from "@/hooks/useLocalStorage";
import AnimatedContainer from "@/components/AnimatedContainer";
import { motion } from "framer-motion";




const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());



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




  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dashboard Title - Left Side */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>

          {/* Date and Time - Right Side */}
          <div className="text-right">
            <p className="text-gray-900 dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
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

          {/* Time-based Charts */}
          <AnimatedContainer delay={0.2}>
            <div className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time P&L Chart */}
                <TimePLChart />

                {/* Time Number of Trades Chart */}
                <TimeTradesChart />
              </div>
            </div>
          </AnimatedContainer>








        </main>
      </div>

      {/* Removed Add/Edit Trade Modal (for Real Trades) */}

    </div>
  );
};

export default Index;
