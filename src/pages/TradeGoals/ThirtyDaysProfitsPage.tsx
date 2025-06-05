import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Target, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useLocalStorage from "@/hooks/useLocalStorage";

// Define the type for trading day data
interface TradingDay {
  day: number;
  balance: number;
  perDay: string;
  session1: number;
  session2: number;
  session3: number;
  session4: number;
  session5: number;
  totalProfit: number;
  withdraw: number;
  reached: string;
  lotSize: number;
}

// Define the type for trading phases
interface TradingPhase {
  id: number;
  name: string;
  days: string;
  data: TradingDay[];
}

const ThirtyDaysProfitsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentPhase, setCurrentPhase] = useState(1);
  const [reachedStatus, setReachedStatus] = useLocalStorage<{[key: string]: string}>('tradingReachedStatus', {});

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

  // Trading phases data
  const tradingPhases: TradingPhase[] = [
    {
      id: 1,
      name: "Phase 1 Trading Plan",
      days: "Days 1-5",
      data: [
        { day: 1, balance: 10.00, perDay: "15%", session1: 0.30, session2: 0.30, session3: 0.30, session4: 0.30, session5: 0.30, totalProfit: 1.50, withdraw: 0, reached: "Yes", lotSize: 0.20 },
        { day: 2, balance: 11.50, perDay: "15%", session1: 0.35, session2: 0.35, session3: 0.35, session4: 0.35, session5: 0.35, totalProfit: 1.73, withdraw: 0, reached: "--", lotSize: 0.20 },
        { day: 3, balance: 13.23, perDay: "15%", session1: 0.40, session2: 0.40, session3: 0.40, session4: 0.40, session5: 0.40, totalProfit: 1.98, withdraw: 0, reached: "--", lotSize: 0.20 },
        { day: 4, balance: 15.21, perDay: "15%", session1: 0.46, session2: 0.46, session3: 0.46, session4: 0.46, session5: 0.46, totalProfit: 2.28, withdraw: 0, reached: "--", lotSize: 0.20 },
        { day: 5, balance: 17.49, perDay: "15%", session1: 0.52, session2: 0.52, session3: 0.52, session4: 0.52, session5: 0.52, totalProfit: 2.62, withdraw: 2.00, reached: "Yes", lotSize: 0.20 }
      ]
    },
    {
      id: 2,
      name: "Phase 2 Trading Plan",
      days: "Days 6-10",
      data: [
        { day: 6, balance: 18.11, perDay: "15%", session1: 0.54, session2: 0.54, session3: 0.54, session4: 0.54, session5: 0.54, totalProfit: 2.72, withdraw: 0, reached: "--", lotSize: 0.25 },
        { day: 7, balance: 20.83, perDay: "15%", session1: 0.62, session2: 0.62, session3: 0.62, session4: 0.62, session5: 0.62, totalProfit: 3.12, withdraw: 0, reached: "--", lotSize: 0.25 },
        { day: 8, balance: 23.96, perDay: "15%", session1: 0.72, session2: 0.72, session3: 0.72, session4: 0.72, session5: 0.72, totalProfit: 3.59, withdraw: 0, reached: "--", lotSize: 0.25 },
        { day: 9, balance: 27.55, perDay: "15%", session1: 0.83, session2: 0.83, session3: 0.83, session4: 0.83, session5: 0.83, totalProfit: 4.13, withdraw: 0, reached: "--", lotSize: 0.25 },
        { day: 10, balance: 31.68, perDay: "15%", session1: 0.95, session2: 0.95, session3: 0.95, session4: 0.95, session5: 0.95, totalProfit: 4.75, withdraw: 0, reached: "--", lotSize: 0.40 }
      ]
    },
    {
      id: 3,
      name: "Phase 3 Trading Plan",
      days: "Days 11-15",
      data: [
        { day: 11, balance: 36.43, perDay: "15%", session1: 1.09, session2: 1.09, session3: 1.09, session4: 1.09, session5: 1.09, totalProfit: 5.46, withdraw: 0, reached: "--", lotSize: 0.40 },
        { day: 12, balance: 41.90, perDay: "15%", session1: 1.26, session2: 1.26, session3: 1.26, session4: 1.26, session5: 1.26, totalProfit: 6.28, withdraw: 6.00, reached: "--", lotSize: 0.40 },
        { day: 13, balance: 48.18, perDay: "15%", session1: 1.45, session2: 1.45, session3: 1.45, session4: 1.45, session5: 1.45, totalProfit: 7.23, withdraw: 0, reached: "--", lotSize: 0.40 },
        { day: 14, balance: 55.41, perDay: "15%", session1: 1.66, session2: 1.66, session3: 1.66, session4: 1.66, session5: 1.66, totalProfit: 8.31, withdraw: 0, reached: "--", lotSize: 0.40 },
        { day: 15, balance: 63.72, perDay: "15%", session1: 1.91, session2: 1.91, session3: 1.91, session4: 1.91, session5: 1.91, totalProfit: 9.56, withdraw: 0, reached: "--", lotSize: 0.40 }
      ]
    },
    {
      id: 4,
      name: "Phase 4 Trading Plan",
      days: "Days 16-20",
      data: [
        { day: 16, balance: 73.28, perDay: "15%", session1: 2.20, session2: 2.20, session3: 2.20, session4: 2.20, session5: 2.20, totalProfit: 10.99, withdraw: 0, reached: "--", lotSize: 0.40 },
        { day: 17, balance: 84.27, perDay: "15%", session1: 2.53, session2: 2.53, session3: 2.53, session4: 2.53, session5: 2.53, totalProfit: 12.64, withdraw: 20.00, reached: "--", lotSize: 0.40 },
        { day: 18, balance: 76.91, perDay: "15%", session1: 2.31, session2: 2.31, session3: 2.31, session4: 2.31, session5: 2.31, totalProfit: 11.54, withdraw: 0, reached: "--", lotSize: 1.00 },
        { day: 19, balance: 88.45, perDay: "15%", session1: 2.65, session2: 2.65, session3: 2.65, session4: 2.65, session5: 2.65, totalProfit: 13.27, withdraw: 0, reached: "--", lotSize: 1.00 },
        { day: 20, balance: 101.72, perDay: "15%", session1: 3.05, session2: 3.05, session3: 3.05, session4: 3.05, session5: 3.05, totalProfit: 15.26, withdraw: 0, reached: "--", lotSize: 1.00 }
      ]
    },
    {
      id: 5,
      name: "Phase 5 Trading Plan",
      days: "Days 21-25",
      data: [
        { day: 21, balance: 116.97, perDay: "15%", session1: 3.51, session2: 3.51, session3: 3.51, session4: 3.51, session5: 3.51, totalProfit: 17.55, withdraw: 0, reached: "--", lotSize: 1.00 },
        { day: 22, balance: 134.52, perDay: "15%", session1: 4.04, session2: 4.04, session3: 4.04, session4: 4.04, session5: 4.04, totalProfit: 20.18, withdraw: 25.00, reached: "--", lotSize: 2.00 },
        { day: 23, balance: 129.70, perDay: "15%", session1: 3.89, session2: 3.89, session3: 3.89, session4: 3.89, session5: 3.89, totalProfit: 19.45, withdraw: 0, reached: "--", lotSize: 2.00 },
        { day: 24, balance: 149.15, perDay: "15%", session1: 4.47, session2: 4.47, session3: 4.47, session4: 4.47, session5: 4.47, totalProfit: 22.37, withdraw: 0, reached: "--", lotSize: 2.00 },
        { day: 25, balance: 171.53, perDay: "15%", session1: 5.15, session2: 5.15, session3: 5.15, session4: 5.15, session5: 5.15, totalProfit: 25.73, withdraw: 0, reached: "--", lotSize: 2.00 }
      ]
    },
    {
      id: 6,
      name: "Phase 6 Trading Plan",
      days: "Days 26-30",
      data: [
        { day: 26, balance: 197.25, perDay: "15%", session1: 5.92, session2: 5.92, session3: 5.92, session4: 5.92, session5: 5.92, totalProfit: 29.59, withdraw: 0, reached: "--", lotSize: 2.00 },
        { day: 27, balance: 226.84, perDay: "15%", session1: 6.81, session2: 6.81, session3: 6.81, session4: 6.81, session5: 6.81, totalProfit: 34.03, withdraw: 30.00, reached: "--", lotSize: 3.00 },
        { day: 28, balance: 230.87, perDay: "15%", session1: 6.93, session2: 6.93, session3: 6.93, session4: 6.93, session5: 6.93, totalProfit: 34.63, withdraw: 0, reached: "--", lotSize: 3.00 },
        { day: 29, balance: 265.50, perDay: "15%", session1: 7.96, session2: 7.96, session3: 7.96, session4: 7.96, session5: 7.96, totalProfit: 39.82, withdraw: 0, reached: "--", lotSize: 3.00 },
        { day: 30, balance: 305.32, perDay: "15%", session1: 9.16, session2: 9.16, session3: 9.16, session4: 9.16, session5: 9.16, totalProfit: 45.80, withdraw: 50.00, reached: "--", lotSize: 3.00 }
      ]
    }
  ];

  // Calculate statistics
  const calculateStats = () => {
    const openingBalance = 301.12;
    const totalProfitTarget = 720.00;
    const totalWithdrawals = 418.12;
    const netProfit = 127.00;

    return {
      openingBalance,
      totalProfitTarget,
      totalWithdrawals,
      netProfit
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
    <div className="min-h-screen flex w-full" style={{ backgroundColor: '#f7f5f0' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={cn(
          "flex-1 transition-all duration-300 flex flex-col",
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
            <DollarSign className="h-6 w-6 text-[#FF5A1F]" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Trade Map</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">31-Day Trading Plan & Progress Tracker</p>
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
        <div className="p-6 overflow-y-auto flex-1" style={{ backgroundColor: '#f7f5f0' }}>
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
                    15% Daily Target
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
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <div>DAY</div>
                  <div>BALANCE</div>
                  <div>% PER DAY</div>
                  <div>SESSION 1</div>
                  <div>SESSION 2</div>
                  <div>SESSION 3</div>
                  <div>SESSION 4</div>
                  <div>SESSION 5</div>
                  <div>T/PROFIT</div>
                  <div>WITHDRAW</div>
                  <div>REACHED</div>
                  <div>LOT SIZE</div>
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
                    className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    {/* Day */}
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-[#FF5A1F] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{day.day}</span>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-gray-900 dark:text-white font-medium">${day.balance.toFixed(2)}</div>

                    {/* Percentage */}
                    <div className="text-blue-600 dark:text-blue-400 font-medium">{day.perDay}</div>

                    {/* Sessions */}
                    <div className="text-blue-600 dark:text-blue-300">${day.session1.toFixed(2)}</div>
                    <div className="text-blue-600 dark:text-blue-300">${day.session2.toFixed(2)}</div>
                    <div className="text-blue-600 dark:text-blue-300">${day.session3.toFixed(2)}</div>
                    <div className="text-blue-600 dark:text-blue-300">${day.session4.toFixed(2)}</div>
                    <div className="text-blue-600 dark:text-blue-300">${day.session5.toFixed(2)}</div>

                    {/* Total Profit */}
                    <div className="text-green-600 dark:text-green-400 font-medium">${day.totalProfit.toFixed(2)}</div>

                    {/* Withdraw */}
                    <div className="text-red-600 dark:text-red-400 font-medium">
                      {day.withdraw > 0 ? `$${day.withdraw.toFixed(2)}` : '-'}
                    </div>

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

                    {/* Lot Size */}
                    <div className="text-yellow-600 dark:text-yellow-400 font-medium">{day.lotSize.toFixed(2)}</div>
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

              {/* Total Profit Target */}
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 90, 31, 0.3)" }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-[#FF5A1F]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-[#FF5A1F]" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Total Profit Target</span>
                </div>
                <div className="text-2xl font-bold text-[#FF5A1F]">
                  ${stats.totalProfitTarget.toFixed(2)}
                </div>
              </motion.div>

              {/* Total Withdrawals */}
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 90, 31, 0.3)" }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-[#FF5A1F]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-[#FF5A1F]" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Total Withdrawals</span>
                </div>
                <div className="text-2xl font-bold text-[#FF5A1F]">
                  ${stats.totalWithdrawals.toFixed(2)}
                </div>
              </motion.div>

              {/* Net Profit */}
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 90, 31, 0.3)" }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-[#FF5A1F]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="h-5 w-5 text-[#FF5A1F]" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Net Profit</span>
                </div>
                <div className="text-2xl font-bold text-[#FF5A1F]">
                  ${stats.netProfit.toFixed(2)}
                </div>
              </motion.div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default ThirtyDaysProfitsPage;
