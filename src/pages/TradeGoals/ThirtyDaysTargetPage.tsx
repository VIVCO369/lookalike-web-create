import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Target, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useLocalStorage from "@/hooks/useLocalStorage";

// Define the type for trading day data
interface TradingDay {
  day: number;
  amount: number;
  dailyProfit: string;
  dailyProfitAmount: number;
  lotSize: number;
  amountTrade: number;
  trades: number;
  reached: string;
  week: string;
}

// Define the type for trading phases
interface TradingPhase {
  id: number;
  name: string;
  days: string;
  data: TradingDay[];
}

const ThirtyDaysTargetPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentPhase, setCurrentPhase] = useState(1);
  const [reachedStatus, setReachedStatus] = useLocalStorage<{[key: string]: string}>('targetReachedStatus', {});

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

  // Trading phases data for $20 to $100 in 30 Days
  const tradingPhases: TradingPhase[] = [
    {
      id: 1,
      name: "Phase 1 Target Plan",
      days: "Days 1-5",
      data: [
        { day: 1, amount: 20.00, dailyProfit: "10%", dailyProfitAmount: 2.00, lotSize: 0.20, amountTrade: 2.00, trades: 6, reached: "--", week: "Week 1" },
        { day: 2, amount: 22.00, dailyProfit: "10%", dailyProfitAmount: 2.20, lotSize: 0.20, amountTrade: 2.20, trades: 6, reached: "--", week: "Week 1" },
        { day: 3, amount: 24.20, dailyProfit: "10%", dailyProfitAmount: 2.42, lotSize: 0.20, amountTrade: 2.42, trades: 6, reached: "--", week: "Week 1" },
        { day: 4, amount: 26.62, dailyProfit: "10%", dailyProfitAmount: 2.66, lotSize: 0.20, amountTrade: 2.66, trades: 6, reached: "--", week: "Week 1" },
        { day: 5, amount: 29.28, dailyProfit: "10%", dailyProfitAmount: 2.93, lotSize: 0.25, amountTrade: 2.93, trades: 10, reached: "--", week: "-$9.28" }
      ]
    },
    {
      id: 2,
      name: "Phase 2 Target Plan",
      days: "Days 6-10",
      data: [
        { day: 6, amount: 32.21, dailyProfit: "10%", dailyProfitAmount: 3.22, lotSize: 0.20, amountTrade: 3.22, trades: 12, reached: "--", week: "Week 2" },
        { day: 7, amount: 35.43, dailyProfit: "10%", dailyProfitAmount: 3.54, lotSize: 0.20, amountTrade: 3.54, trades: 12, reached: "--", week: "Week 2" },
        { day: 8, amount: 38.97, dailyProfit: "10%", dailyProfitAmount: 3.90, lotSize: 0.20, amountTrade: 3.90, trades: 12, reached: "--", week: "Week 2" },
        { day: 9, amount: 42.87, dailyProfit: "10%", dailyProfitAmount: 4.29, lotSize: 0.20, amountTrade: 4.29, trades: 12, reached: "--", week: "Week 2" },
        { day: 10, amount: 47.16, dailyProfit: "10%", dailyProfitAmount: 4.72, lotSize: 0.35, amountTrade: 4.72, trades: 12, reached: "--", week: "-$17.88" }
      ]
    },
    {
      id: 3,
      name: "Phase 3 Target Plan",
      days: "Days 11-15",
      data: [
        { day: 11, amount: 51.87, dailyProfit: "10%", dailyProfitAmount: 5.19, lotSize: 7, amountTrade: 5.19, trades: 15, reached: "--", week: "Week 3" },
        { day: 12, amount: 57.06, dailyProfit: "10%", dailyProfitAmount: 5.71, lotSize: 7, amountTrade: 5.71, trades: 15, reached: "--", week: "Week 3" },
        { day: 13, amount: 62.77, dailyProfit: "10%", dailyProfitAmount: 6.28, lotSize: 7, amountTrade: 6.28, trades: 15, reached: "--", week: "Week 3" },
        { day: 14, amount: 69.05, dailyProfit: "10%", dailyProfitAmount: 6.90, lotSize: 7, amountTrade: 6.90, trades: 15, reached: "--", week: "Week 3" },
        { day: 15, amount: 75.95, dailyProfit: "10%", dailyProfitAmount: 7.59, lotSize: 7, amountTrade: 7.59, trades: 15, reached: "--", week: "-$28.79" }
      ]
    },
    {
      id: 4,
      name: "Phase 4 Target Plan",
      days: "Days 16-20",
      data: [
        { day: 16, amount: 83.54, dailyProfit: "10%", dailyProfitAmount: 8.35, lotSize: 9, amountTrade: 8.35, trades: 20, reached: "--", week: "Week 4" },
        { day: 17, amount: 91.90, dailyProfit: "10%", dailyProfitAmount: 9.19, lotSize: 9, amountTrade: 9.19, trades: 20, reached: "--", week: "Week 4" },
        { day: 18, amount: 101.09, dailyProfit: "10%", dailyProfitAmount: 10.11, lotSize: 9, amountTrade: 10.11, trades: 20, reached: "--", week: "Week 4" },
        { day: 19, amount: 111.20, dailyProfit: "10%", dailyProfitAmount: 11.12, lotSize: 9, amountTrade: 11.12, trades: 20, reached: "--", week: "Week 4" },
        { day: 20, amount: 122.32, dailyProfit: "10%", dailyProfitAmount: 12.23, lotSize: 9, amountTrade: 12.23, trades: 20, reached: "--", week: "-$37.71" }
      ]
    },
    {
      id: 5,
      name: "Phase 5 Target Plan",
      days: "Days 21-25",
      data: [
        { day: 21, amount: 134.55, dailyProfit: "10%", dailyProfitAmount: 13.46, lotSize: 10, amountTrade: 13.46, trades: 30, reached: "--", week: "Week 5" },
        { day: 22, amount: 148.01, dailyProfit: "10%", dailyProfitAmount: 14.80, lotSize: 10, amountTrade: 14.80, trades: 30, reached: "--", week: "Week 5" },
        { day: 23, amount: 162.81, dailyProfit: "10%", dailyProfitAmount: 16.28, lotSize: 10, amountTrade: 16.28, trades: 30, reached: "--", week: "Week 5" },
        { day: 24, amount: 179.09, dailyProfit: "10%", dailyProfitAmount: 17.91, lotSize: 10, amountTrade: 17.91, trades: 30, reached: "--", week: "Week 5" },
        { day: 25, amount: 197.00, dailyProfit: "10%", dailyProfitAmount: 19.70, lotSize: 10, amountTrade: 19.70, trades: 30, reached: "--", week: "-$53.34" }
      ]
    },
    {
      id: 6,
      name: "Phase 6 Target Plan",
      days: "Days 26-30",
      data: [
        { day: 26, amount: 216.70, dailyProfit: "10%", dailyProfitAmount: 21.67, lotSize: 12, amountTrade: 21.67, trades: 5, reached: "--", week: "Week 6" },
        { day: 27, amount: 238.37, dailyProfit: "10%", dailyProfitAmount: 23.84, lotSize: 12, amountTrade: 23.84, trades: 5, reached: "--", week: "Week 6" },
        { day: 28, amount: 262.21, dailyProfit: "10%", dailyProfitAmount: 26.22, lotSize: 12, amountTrade: 26.22, trades: 5, reached: "--", week: "Week 6" },
        { day: 29, amount: 288.43, dailyProfit: "10%", dailyProfitAmount: 28.84, lotSize: 12, amountTrade: 28.84, trades: 5, reached: "--", week: "Week 6" },
        { day: 30, amount: 317.27, dailyProfit: "10%", dailyProfitAmount: 31.73, lotSize: 12, amountTrade: 31.73, trades: 5, reached: "--", week: "-$60.70" }
      ]
    }
  ];

  // Calculate statistics
  const calculateStats = () => {
    const openingBalance = 20.00;
    const totalTarget = 100.00;
    const currentAmount = 317.27; // Final amount from phase 6 with 10% daily growth
    const totalProfit = currentAmount - openingBalance;

    return {
      openingBalance,
      totalTarget,
      currentAmount,
      totalProfit
    };
  };

  const stats = calculateStats();

  // Handle reached status change
  const handleReachedChange = (day: number, value: string) => {
    setReachedStatus(prev => ({
      ...prev,
      [day]: value
    }));
  };

  // Get current phase data
  const getCurrentPhaseData = () => {
    return tradingPhases.find(phase => phase.id === currentPhase) || tradingPhases[0];
  };




  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={cn(
          "flex-1 transition-all duration-300 flex flex-col", // Added flex flex-col
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Page Title (Left) */}
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-[#FF5A1F]" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">30 Days Target</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">DAILY PROFIT</p>
            </div>
          </div>

          {/* Phase Navigation (Right) */}
          <div className="flex gap-2">
            {tradingPhases.map((phase) => (
              <Button
                key={phase.id}
                onClick={() => setCurrentPhase(phase.id)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-all duration-200",
                  currentPhase === phase.id
                    ? "bg-[#FF5A1F] text-white shadow-lg shadow-orange-500/25"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Phase {phase.id}
              </Button>
            ))}
          </div>
        </motion.header>

        {/* Main content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-gray-900">
          {/* Current Phase Header */}
          <AnimatedContainer>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-[#FF5A1F] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{getCurrentPhaseData().id}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{getCurrentPhaseData().name} ({getCurrentPhaseData().days})</h2>
                <div className="ml-auto">
                  <span className="bg-[#FF5A1F] text-white px-3 py-1 rounded-full text-sm font-medium">
                    10% Daily Target
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContainer>

          {/* Trading Plan Table */}
          <AnimatedContainer delay={0.2}>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              {/* Table Header */}
              <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-9 gap-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div>DAY</div>
                  <div>AMOUNT</div>
                  <div>% PER DAY</div>
                  <div>DAILY PROFIT</div>
                  <div>LOT SIZE</div>
                  <div>AMOUNT TRADE</div>
                  <div>TRADES</div>
                  <div>REACHED</div>
                  <div>WEEK</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="bg-white dark:bg-gray-900">
                {getCurrentPhaseData().data.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-9 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    {/* Day */}
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#FF5A1F] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{day.day}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-gray-900 dark:text-white font-medium">${day.amount.toFixed(2)}</div>

                    {/* % Per Day */}
                    <div className="text-blue-600 dark:text-blue-400 font-medium">{day.dailyProfit}</div>

                    {/* Daily Profit Amount */}
                    <div className="text-green-600 dark:text-green-400 font-medium">${day.dailyProfitAmount.toFixed(2)}</div>

                    {/* Lot Size */}
                    <div className="text-yellow-600 dark:text-yellow-400 font-medium">
                      {typeof day.lotSize === 'number' && day.lotSize >= 1 ? day.lotSize : day.lotSize.toFixed(2)}
                    </div>

                    {/* Amount Trade */}
                    <div className="text-blue-600 dark:text-blue-300">${day.amountTrade.toFixed(2)}</div>

                    {/* Trades */}
                    <div className="text-purple-600 dark:text-purple-400 font-medium">{day.trades}</div>

                    {/* Reached Status */}
                    <div>
                      <Select
                        value={reachedStatus[day.day] || day.reached}
                        onValueChange={(value) => handleReachedChange(day.day, value)}
                      >
                        <SelectTrigger className="w-20 h-8 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectItem value="Yes" className="text-green-600 dark:text-green-400">Yes</SelectItem>
                          <SelectItem value="No" className="text-red-600 dark:text-red-400">No</SelectItem>
                          <SelectItem value="--" className="text-gray-600 dark:text-gray-400">--</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Week */}
                    <div className={`text-sm ${
                      day.week.startsWith('-$')
                        ? 'text-red-600 dark:text-red-400 font-bold'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {day.week}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedContainer>

          {/* Statistics Cards */}
          <AnimatedContainer delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Opening Balance */}
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 90, 31, 0.3)" }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-[#FF5A1F]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-[#FF5A1F]" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Opening Balance</span>
                </div>
                <div className="text-2xl font-bold text-[#FF5A1F]">
                  ${stats.openingBalance.toFixed(2)}
                </div>
              </motion.div>

              {/* Total Target */}
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 90, 31, 0.3)" }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-[#FF5A1F]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-[#FF5A1F]" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Total Target</span>
                </div>
                <div className="text-2xl font-bold text-[#FF5A1F]">
                  ${stats.totalTarget.toFixed(2)}
                </div>
              </motion.div>

              {/* Current Amount */}
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 90, 31, 0.3)" }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-[#FF5A1F]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-[#FF5A1F]" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Current Amount</span>
                </div>
                <div className="text-2xl font-bold text-[#FF5A1F]">
                  ${stats.currentAmount.toFixed(2)}
                </div>
              </motion.div>

              {/* Total Profit */}
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 90, 31, 0.3)" }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-[#FF5A1F]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="h-5 w-5 text-[#FF5A1F]" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Total Profit</span>
                </div>
                <div className="text-2xl font-bold text-[#FF5A1F]">
                  ${stats.totalProfit.toFixed(2)}
                </div>
              </motion.div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default ThirtyDaysTargetPage;
