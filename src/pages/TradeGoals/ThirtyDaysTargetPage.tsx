import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Target, DollarSign, TrendingUp, Wallet, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  // Dynamic calculation states
  const [startingAmount, setStartingAmount] = useLocalStorage<number>('startingAmount', 20.00);
  const [dailyPercentage, setDailyPercentage] = useLocalStorage<number>('dailyPercentage', 10);
  const [showSettings, setShowSettings] = useState(false);

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

  // Function to calculate dynamic trading phases
  const calculateDynamicPhases = (): TradingPhase[] => {
    const phases: TradingPhase[] = [];
    let currentAmount = startingAmount;
    const dailyDecimal = dailyPercentage / 100;

    // Define lot sizes and trades for each phase
    const phaseConfig = [
      { lotSizes: [0.20, 0.20, 0.20, 0.20, 0.25], trades: [6, 6, 6, 6, 10] },
      { lotSizes: [0.20, 0.20, 0.20, 0.20, 0.35], trades: [12, 12, 12, 12, 12] },
      { lotSizes: [7, 7, 7, 7, 7], trades: [15, 15, 15, 15, 15] },
      { lotSizes: [9, 9, 9, 9, 9], trades: [20, 20, 20, 20, 20] },
      { lotSizes: [10, 10, 10, 10, 10], trades: [30, 30, 30, 30, 30] },
      { lotSizes: [12, 12, 12, 12, 12], trades: [5, 5, 5, 5, 5] }
    ];

    for (let phaseIndex = 0; phaseIndex < 6; phaseIndex++) {
      const phaseData: TradingDay[] = [];
      const startDay = phaseIndex * 5 + 1;
      const endDay = startDay + 4;

      for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        const day = startDay + dayIndex;
        const dailyProfitAmount = currentAmount * dailyDecimal;
        const nextAmount = currentAmount + dailyProfitAmount;

        // Calculate week indicator or milestone amount
        let weekIndicator: string;
        if (day % 5 === 0) {
          // Milestone days (5, 10, 15, 20, 25, 30)
          const milestoneAmounts = [-9.28, -17.88, -28.79, -37.71, -53.34, -60.70];
          weekIndicator = `-$${Math.abs(milestoneAmounts[Math.floor((day - 1) / 5)]).toFixed(2)}`;
        } else {
          // Regular week indicators
          const weekNumber = Math.floor((day - 1) / 5) + 1;
          weekIndicator = `Week ${weekNumber}`;
        }

        phaseData.push({
          day,
          amount: currentAmount,
          dailyProfit: `${dailyPercentage}%`,
          dailyProfitAmount,
          lotSize: phaseConfig[phaseIndex].lotSizes[dayIndex],
          amountTrade: dailyProfitAmount,
          trades: phaseConfig[phaseIndex].trades[dayIndex],
          reached: "--",
          week: weekIndicator
        });

        currentAmount = nextAmount;
      }

      phases.push({
        id: phaseIndex + 1,
        name: `Phase ${phaseIndex + 1} Target Plan`,
        days: `Days ${startDay}-${endDay}`,
        data: phaseData
      });
    }

    return phases;
  };

  // Get dynamic trading phases
  const tradingPhases: TradingPhase[] = calculateDynamicPhases();

  // Calculate statistics
  const calculateStats = () => {
    const openingBalance = startingAmount;
    const totalTarget = startingAmount * 5; // 5x the starting amount as target
    const finalPhase = tradingPhases[tradingPhases.length - 1];
    const finalDay = finalPhase.data[finalPhase.data.length - 1];
    const currentAmount = finalDay.amount + finalDay.dailyProfitAmount; // Final amount after 30 days
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
            <Button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "ml-4 px-3 py-2 text-xs font-medium rounded transition-all duration-200",
                showSettings
                  ? "bg-[#FF5A1F] text-white shadow-lg shadow-orange-500/25"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              )}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
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
          {/* Settings Panel */}
          {showSettings && (
            <AnimatedContainer>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#FF5A1F]" />
                  Dynamic Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Starting Amount */}
                  <div>
                    <Label htmlFor="startingAmount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Starting Amount ($)
                    </Label>
                    <Input
                      id="startingAmount"
                      type="number"
                      value={startingAmount}
                      onChange={(e) => setStartingAmount(parseFloat(e.target.value) || 20)}
                      className="mt-1"
                      min="1"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Initial trading capital amount
                    </p>
                  </div>

                  {/* Daily Percentage */}
                  <div>
                    <Label htmlFor="dailyPercentage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Daily Percentage (%)
                    </Label>
                    <Input
                      id="dailyPercentage"
                      type="number"
                      value={dailyPercentage}
                      onChange={(e) => setDailyPercentage(parseFloat(e.target.value) || 10)}
                      className="mt-1"
                      min="1"
                      max="100"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Target daily profit percentage
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Starting:</span>
                      <div className="font-medium text-[#FF5A1F]">${startingAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Daily %:</span>
                      <div className="font-medium text-[#FF5A1F]">{dailyPercentage}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Day 1 Profit:</span>
                      <div className="font-medium text-green-600">${(startingAmount * dailyPercentage / 100).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Final Amount:</span>
                      <div className="font-medium text-blue-600">${stats.currentAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedContainer>
          )}

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
                    {dailyPercentage}% Daily Target
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
