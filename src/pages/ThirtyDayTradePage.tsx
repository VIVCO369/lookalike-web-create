import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Trophy, Calendar, TrendingUp } from "lucide-react";
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion
import { useTradeData } from "@/contexts/TradeDataContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";


const ThirtyDayTradePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Challenge state management
  const [challengeStarted, setChallengeStarted] = useLocalStorage<boolean>("thirtyDayChallengeStarted", false);
  const [challengeStartDate, setChallengeStartDate] = useLocalStorage<string>("thirtyDayChallengeStartDate", "");
  const { toast } = useToast();

  // Get Daily Trades data
  const { dailyTrades } = useTradeData();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  // Handle Start Challenge
  const handleStartChallenge = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    setChallengeStarted(true);
    setChallengeStartDate(today);
    toast({
      title: "🏆 Challenge Started!",
      description: "Your 30-day trading challenge has begun. Trade data will be tracked from Daily Trades page.",
      duration: 5000,
    });
  };

  // Handle Reset Challenge
  const handleResetChallenge = () => {
    setChallengeStarted(false);
    setChallengeStartDate("");
    toast({
      title: "🔄 Challenge Reset",
      description: "Your 30-day trading challenge has been reset.",
      duration: 3000,
    });
  };

  // Generate 30 days of challenge data based on Daily Trades
  const thirtyDayData = useMemo(() => {
    if (!challengeStarted || !challengeStartDate) {
      // If challenge not started, show empty data with dates
      return Array.from({ length: 30 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - index));
        return {
          day: index + 1,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          trades: 0,
          wins: 0,
          losses: 0,
          winRate: "0.0",
          profit: 0,
          candles: 0,
        };
      });
    }

    // Generate 30 days starting from challenge start date
    const startDate = new Date(challengeStartDate);
    return Array.from({ length: 30 }, (_, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Filter Daily Trades for this specific date
      const dayTrades = dailyTrades.filter(trade => trade.openTime === dateString);

      const trades = dayTrades.length;
      const wins = dayTrades.filter(trade => trade.winLoss === "win").length;
      const losses = trades - wins;
      const winRate = trades > 0 ? ((wins / trades) * 100).toFixed(1) : "0.0";

      // Calculate profit from actual trades
      const profit = dayTrades.reduce((sum, trade) => {
        return sum + parseFloat(trade.netProfit || "0");
      }, 0);

      // Calculate candles from actual trades
      const candles = dayTrades.reduce((sum, trade) => {
        return sum + parseInt(trade.candles || "0");
      }, 0);

      return {
        day: index + 1,
        date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        trades,
        wins,
        losses,
        winRate,
        profit: Math.round(profit),
        candles,
      };
    });
  }, [dailyTrades, challengeStarted, challengeStartDate]);

  // Calculate totals from actual data
  const totalProfit = thirtyDayData.reduce((sum, day) => sum + day.profit, 0);
  const totalTrades = thirtyDayData.reduce((sum, day) => sum + day.trades, 0);
  const totalWins = thirtyDayData.reduce((sum, day) => sum + day.wins, 0);
  const overallWinRate = totalTrades > 0 ? ((totalWins / totalTrades) * 100).toFixed(1) : "0.0";
  const totalCandles = thirtyDayData.reduce((sum, day) => sum + day.candles, 0);


  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        <header className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10"> {/* Added dark mode styles */}
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">30 Day Trade Challenge</h1> {/* Added dark mode text color */}
            {challengeStarted && (
              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Challenge Control Buttons */}
            {!challengeStarted ? (
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleStartChallenge}
              >
                🏆 Start Challenge
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                onClick={handleResetChallenge}
              >
                🔄 Reset Challenge
              </Button>
            )}
            <div>
              <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
              <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Enhanced Challenge Overview */}
            <AnimatedContainer delay={0.1}>
              <motion.div
                className="relative overflow-hidden bg-[#e6e6e6] dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gray-400 dark:bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
                  <div className="absolute top-1/2 right-0 w-24 h-24 bg-gray-400 dark:bg-white rounded-full translate-x-12 animate-bounce"></div>
                  <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-gray-400 dark:bg-white rounded-full translate-y-10 animate-pulse delay-1000"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 p-8">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="p-3 bg-gray-200 dark:bg-white/20 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Trophy className="h-8 w-8 text-orange-600 dark:text-orange-300" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 dark:from-white dark:to-orange-200 bg-clip-text text-transparent">
                          30 Day Trading Challenge
                        </h2>
                        <p className="text-green-600 dark:text-green-100 text-sm">Master Your Trading Journey</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <motion.div
                      className={`px-4 py-2 rounded-full backdrop-blur-sm border-2 ${
                        challengeStarted
                          ? 'bg-orange-100 dark:bg-orange-500/20 border-orange-500 dark:border-orange-300 text-orange-700 dark:text-orange-100'
                          : 'bg-gray-100 dark:bg-gray-500/20 border-gray-500 dark:border-gray-300 text-gray-700 dark:text-gray-200'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${challengeStarted ? 'bg-orange-600 dark:bg-orange-400 animate-pulse' : 'bg-gray-600 dark:bg-gray-400'}`}></div>
                        <span className="text-sm font-semibold">
                          {challengeStarted ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      {challengeStarted && challengeStartDate && (
                        <p className="text-xs opacity-75 mt-1">
                          Started: {new Date(challengeStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Trades */}
                    <motion.div
                      className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 shadow-md"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className="p-2 bg-green-100 dark:bg-green-400/20 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-200" />
                          </div>
                        </div>
                        <motion.p
                          className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          {totalTrades}
                        </motion.p>
                        <p className="text-green-600 dark:text-green-100 text-sm font-medium">Total Trades</p>
                        <div className="mt-2 h-1 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-green-200"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((totalTrades / 100) * 100, 100)}%` }}
                            transition={{ delay: 0.5, duration: 1 }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Win Rate */}
                    <motion.div
                      className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 shadow-md"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-400/20 rounded-lg">
                            <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-200" />
                          </div>
                        </div>
                        <motion.p
                          className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          {overallWinRate}%
                        </motion.p>
                        <p className="text-blue-600 dark:text-blue-100 text-sm font-medium">Win Rate</p>
                        <div className="mt-2 h-1 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-200"
                            initial={{ width: 0 }}
                            animate={{ width: `${parseFloat(overallWinRate)}%` }}
                            transition={{ delay: 0.6, duration: 1 }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Total Profit */}
                    <motion.div
                      className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 shadow-md"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className={`p-2 rounded-lg ${totalProfit >= 0 ? 'bg-emerald-100 dark:bg-emerald-400/20' : 'bg-red-100 dark:bg-red-400/20'}`}>
                            <TrendingUp className={`h-6 w-6 ${totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-200' : 'text-red-600 dark:text-red-200'}`} />
                          </div>
                        </div>
                        <motion.p
                          className={`text-4xl font-bold mb-2 ${totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          ${totalProfit.toLocaleString()}
                        </motion.p>
                        <p className="text-gray-700 dark:text-white text-sm font-medium">Total Profit</p>
                        <div className="mt-2 h-1 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${
                              totalProfit >= 0
                                ? 'from-emerald-400 to-emerald-200'
                                : 'from-red-400 to-red-200'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(Math.abs(totalProfit) / 1000 * 100, 100)}%` }}
                            transition={{ delay: 0.7, duration: 1 }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Total Candles */}
                    <motion.div
                      className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/15 transition-all duration-300 shadow-md"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-400/20 rounded-lg">
                            <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-200" />
                          </div>
                        </div>
                        <motion.p
                          className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                        >
                          {totalCandles}
                        </motion.p>
                        <p className="text-orange-600 dark:text-orange-100 text-sm font-medium">Total Candles</p>
                        <div className="mt-2 h-1 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-200"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((totalCandles / 500) * 100, 100)}%` }}
                            transition={{ delay: 0.8, duration: 1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Progress Indicator */}
                  {challengeStarted && (
                    <motion.div
                      className="mt-8 p-4 bg-white dark:bg-white/10 backdrop-blur-sm rounded-xl border border-gray-300 dark:border-white/20 shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900 dark:text-white font-medium">Challenge Progress</span>
                        <span className="text-green-600 dark:text-green-200 text-sm">
                          {Math.min(Math.floor((new Date().getTime() - new Date(challengeStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1, 30)} / 30 Days
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-orange-400"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min((Math.floor((new Date().getTime() - new Date(challengeStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) / 30 * 100, 100)}%`
                          }}
                          transition={{ delay: 1, duration: 1.5 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatedContainer>

            {/* 30 Day Performance Table */}
            <AnimatedContainer delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"> {/* Added dark mode styles */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b dark:border-gray-600"> {/* Added dark mode styles */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">30-Day Performance Breakdown</h2> {/* Added dark mode text color */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📊 Data from Daily Trades page
                    </p>
                  </div>
                  {!challengeStarted && (
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                      ⚠️ Start the challenge to begin tracking your daily trades data
                    </p>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-700"> {/* Added dark mode styles */}
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day</th> {/* Added dark mode text color */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th> {/* Added dark mode text color */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trades</th> {/* Added dark mode text color */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wins</th> {/* Added dark mode text color */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Losses</th> {/* Added dark mode text color */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Win Rate</th> {/* Added dark mode text color */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit</th> {/* Added dark mode text color */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candles</th> {/* Added dark mode text color */}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"> {/* Added dark mode styles */}
                      {thirtyDayData.map((day, index) => (
                        <tr key={index} className={cn(
                          "hover:bg-gray-50 dark:hover:bg-gray-700", // Added dark mode hover style
                          day.profit >= 0 ? "" : "bg-red-50 dark:bg-red-900" // Added dark mode background color
                        )}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"> {/* Added dark mode text color */}
                            Day {day.day}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{day.date}</td> {/* Added dark mode text color */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{day.trades}</td> {/* Added dark mode text color */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{day.wins}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{day.losses}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{day.winRate}%</td> {/* Added dark mode text color */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={cn(
                              "font-medium",
                              day.profit >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              ${day.profit}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={cn(
                              "font-medium",
                              day.candles >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {day.candles > 0 ? '+' : ''}{day.candles}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ThirtyDayTradePage;
