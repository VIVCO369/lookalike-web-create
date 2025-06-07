import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign, Calendar, Target, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';


const TradeSummaryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get trade data from Start Trade context
  const { backtestingTrades } = useTradeData();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Calculate real statistics from Start Trade data
  const stats = useMemo(() => calculateStats(backtestingTrades), [backtestingTrades]);

  // Calculate daily summary data from Start Trade entries
  const dailySummaryData = useMemo(() => {
    const dailyData: { [key: string]: { trades: any[], totalProfit: number } } = {};

    // Group trades by date
    backtestingTrades.forEach(trade => {
      const date = trade.openTime; // Use openTime as the date
      if (!dailyData[date]) {
        dailyData[date] = { trades: [], totalProfit: 0 };
      }
      dailyData[date].trades.push(trade);
      dailyData[date].totalProfit += parseFloat(trade.netProfit) || 0;
    });

    // Convert to array format for table
    return Object.entries(dailyData)
      .map(([date, data]) => {
        const wins = data.trades.filter(t => t.winLoss === 'win').length;
        const totalTrades = data.trades.length;
        const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : '0.0';

        return {
          date,
          profitLoss: data.totalProfit,
          totalTrades,
          winRate: `${winRate}%`
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
      .slice(0, 10); // Show last 10 days
  }, [backtestingTrades]);

  // Calculate monthly performance from Start Trade data
  const monthlyPerformance = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    backtestingTrades.forEach(trade => {
      const date = new Date(trade.openTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += parseFloat(trade.netProfit) || 0;
    });

    return Object.entries(monthlyData)
      .map(([month, profit]) => ({ month, profit }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6); // Show last 6 months
  }, [backtestingTrades]);

  // Calculate best performing pairs from Start Trade data
  const bestPerformingPairs = useMemo(() => {
    const pairData: { [key: string]: number } = {};

    backtestingTrades.forEach(trade => {
      if (!pairData[trade.pair]) {
        pairData[trade.pair] = 0;
      }
      pairData[trade.pair] += parseFloat(trade.netProfit) || 0;
    });

    return Object.entries(pairData)
      .map(([pair, profit]) => ({ pair, profit }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 6); // Show top 6 pairs
  }, [backtestingTrades]);

  // Calculate active days
  const activeDays = useMemo(() => {
    const uniqueDates = new Set(backtestingTrades.map(trade => trade.openTime));
    return uniqueDates.size;
  }, [backtestingTrades]);

  // Prepare chart data
  const chartData = useMemo(() => {
    // Monthly P&L Chart Data
    const monthlyChartData = monthlyPerformance.map(month => {
      const date = new Date(month.month + '-01');
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return {
        month: monthName,
        profit: month.profit,
        profitFormatted: `$${month.profit.toFixed(2)}`
      };
    }).reverse(); // Reverse to show chronological order

    // Pair Performance Chart Data (top 8 pairs)
    const pairChartData = bestPerformingPairs.slice(0, 8).map(pair => ({
      pair: pair.pair.length > 15 ? pair.pair.substring(0, 15) + '...' : pair.pair,
      fullPair: pair.pair,
      profit: pair.profit,
      profitFormatted: `$${pair.profit.toFixed(2)}`
    }));

    // Win/Loss Pie Chart Data
    const winLossData = [
      { name: 'Wins', value: stats.wins, color: '#10B981' },
      { name: 'Losses', value: stats.losses, color: '#EF4444' }
    ];

    // Daily P&L Trend Data (last 30 days)
    const dailyTrendData = dailySummaryData.slice(0, 30).map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      profit: day.profitLoss,
      profitFormatted: `$${day.profitLoss.toFixed(2)}`,
      trades: day.totalTrades
    })).reverse(); // Reverse to show chronological order

    // Strategy Performance Data
    const strategyData: { [key: string]: { profit: number, trades: number } } = {};
    backtestingTrades.forEach(trade => {
      if (!strategyData[trade.strategy]) {
        strategyData[trade.strategy] = { profit: 0, trades: 0 };
      }
      strategyData[trade.strategy].profit += parseFloat(trade.netProfit) || 0;
      strategyData[trade.strategy].trades++;
    });

    const strategyChartData = Object.entries(strategyData)
      .map(([strategy, data]) => ({
        strategy: strategy.length > 12 ? strategy.substring(0, 12) + '...' : strategy,
        fullStrategy: strategy,
        profit: data.profit,
        trades: data.trades,
        profitFormatted: `$${data.profit.toFixed(2)}`
      }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 6);

    return {
      monthlyChartData,
      pairChartData,
      winLossData,
      dailyTrendData,
      strategyChartData
    };
  }, [monthlyPerformance, bestPerformingPairs, stats, dailySummaryData, backtestingTrades]);

  // Chart colors
  const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const summaryStats = [
    {
      title: "Total Trades",
      value: stats.totalTrades.toString(),
      change: `${stats.totalTrades > 0 ? '+' : ''}${stats.totalTrades}`,
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Win Rate",
      value: stats.winRate,
      change: `${stats.wins}W / ${stats.losses}L`,
      icon: TrendingUp,
      color: parseFloat(stats.winRate) >= 50 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Total P&L",
      value: `$${stats.netProfit.toFixed(2)}`,
      change: stats.netProfit >= 0 ? `+$${stats.netProfit.toFixed(2)}` : `-$${Math.abs(stats.netProfit).toFixed(2)}`,
      icon: DollarSign,
      color: stats.netProfit >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Profit Wins",
      value: stats.profitWins.toString(),
      change: `${stats.profitWins} profitable trades`,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Profit Losses",
      value: stats.profitLosses.toString(),
      change: `${stats.profitLosses} losing trades`,
      icon: TrendingUp,
      color: "text-red-600"
    },
    {
      title: "Active Days",
      value: activeDays.toString(),
      change: `${activeDays} trading days`,
      icon: Calendar,
      color: "text-purple-600"
    }
  ];

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
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Trade Summary</h1> {/* Added dark mode text color */}
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Stats */}
            <AnimatedContainer delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summaryStats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                      <p className={cn("text-xs", stat.color)}>
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimatedContainer>

            {/* Monthly Performance, Best Performing Pairs, and Daily Trade Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedContainer delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {monthlyPerformance.length > 0 ? (
                        monthlyPerformance.map((month, index) => {
                          const date = new Date(month.month + '-01');
                          const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                          return (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-300">{monthName}</span>
                              <span className={cn(
                                "font-medium",
                                month.profit >= 0 ? "text-green-600" : "text-red-600"
                              )}>
                                {month.profit >= 0 ? '+' : ''}${month.profit.toFixed(2)}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                          No trading data available. Add trades in Start Trade to see monthly performance.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedContainer>

              <AnimatedContainer delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Best Performing Pairs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bestPerformingPairs.length > 0 ? (
                        bestPerformingPairs.map((pair, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{pair.pair}</span>
                            <span className={cn(
                              "font-medium",
                              pair.profit >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {pair.profit >= 0 ? '+' : ''}${pair.profit.toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                          No trading data available. Add trades in Start Trade to see pair performance.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedContainer>
            </div>

            {/* Daily Trade Summary Table */}
            <AnimatedContainer delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Daily Trade Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left text-gray-600 dark:text-gray-300">Date</TableHead>
                          <TableHead className="text-left text-gray-600 dark:text-gray-300">Profit/Loss</TableHead>
                          <TableHead className="text-left text-gray-600 dark:text-gray-300">Total Trades</TableHead>
                          <TableHead className="text-left text-gray-600 dark:text-gray-300">Win Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailySummaryData.length > 0 ? (
                          dailySummaryData.map((day, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <TableCell className="font-medium text-gray-900 dark:text-gray-100">{day.date}</TableCell>
                              <TableCell className={day.profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
                                ${day.profitLoss >= 0 ? `+${day.profitLoss.toFixed(2)}` : day.profitLoss.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">{day.totalTrades}</TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">{day.winRate}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                              No trading data available. Add trades in Start Trade to see daily summary.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly P&L Chart */}
              <AnimatedContainer delay={0.5}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Monthly P&L Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.monthlyChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.monthlyChartData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12 }}
                            className="text-gray-600 dark:text-gray-300"
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            className="text-gray-600 dark:text-gray-300"
                          />
                          <Tooltip
                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Profit/Loss']}
                            labelStyle={{ color: '#374151' }}
                            contentStyle={{
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar
                            dataKey="profit"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No monthly data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>

              {/* Win/Loss Pie Chart */}
              <AnimatedContainer delay={0.6}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <PieChart className="h-5 w-5 text-green-500" />
                      Win/Loss Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.totalTrades > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={chartData.winLossData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.winLossData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: any, name: string) => [value, name]}
                            contentStyle={{
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px'
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No trade data available
                      </div>
                    )}
                    {/* Legend */}
                    {stats.totalTrades > 0 && (
                      <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Wins ({stats.wins})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Losses ({stats.losses})
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>
            </div>

            {/* Additional Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily P&L Trend */}
              <AnimatedContainer delay={0.7}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      Daily P&L Trend (Last 30 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.dailyTrendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData.dailyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            className="text-gray-600 dark:text-gray-300"
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            className="text-gray-600 dark:text-gray-300"
                          />
                          <Tooltip
                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Daily P&L']}
                            labelStyle={{ color: '#374151' }}
                            contentStyle={{
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#8B5CF6"
                            fill="#8B5CF6"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No daily trend data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>

              {/* Top Performing Pairs */}
              <AnimatedContainer delay={0.8}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <Target className="h-5 w-5 text-orange-500" />
                      Top Performing Pairs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {chartData.pairChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.pairChartData} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis
                            type="number"
                            tick={{ fontSize: 12 }}
                            className="text-gray-600 dark:text-gray-300"
                          />
                          <YAxis
                            type="category"
                            dataKey="pair"
                            tick={{ fontSize: 12 }}
                            className="text-gray-600 dark:text-gray-300"
                            width={80}
                          />
                          <Tooltip
                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Profit/Loss']}
                            labelFormatter={(label: any, payload: any) => {
                              const data = payload?.[0]?.payload;
                              return data?.fullPair || label;
                            }}
                            contentStyle={{
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar
                            dataKey="profit"
                            fill="#F59E0B"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No pair performance data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>
            </div>



          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeSummaryPage;
