import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp, Clock, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTradeData } from '@/contexts/TradeDataContext';

const TimeTradesChart: React.FC = () => {
  const { backtestingTrades } = useTradeData();

  // Process data to group by hour and count trades
  const chartData = useMemo(() => {
    const hourlyData: { [key: string]: { total: number, wins: number, losses: number } } = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      hourlyData[hour] = { total: 0, wins: 0, losses: 0 };
    }

    // Process trades
    backtestingTrades.forEach(trade => {
      if (trade.tradeTime) {
        const hour = trade.tradeTime.split(':')[0] + ':00';
        const pl = parseFloat(trade.netProfit || '0');

        hourlyData[hour].total += 1;
        if (pl > 0) {
          hourlyData[hour].wins += 1;
        } else if (pl < 0) {
          hourlyData[hour].losses += 1;
        }
      }
    });

    // Only show real trade data from Start Trade page

    return Object.entries(hourlyData)
      .filter(([_, data]) => data.total > 0)
      .map(([time, data]) => ({
        time,
        total: data.total,
        wins: data.wins,
        losses: data.losses,
        winRate: data.total > 0 ? ((data.wins / data.total) * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [backtestingTrades]);

  // Calculate summary stats
  const totalTrades = chartData.reduce((sum, item) => sum + item.total, 0);
  const totalWins = chartData.reduce((sum, item) => sum + item.wins, 0);
  const totalLosses = chartData.reduce((sum, item) => sum + item.losses, 0);
  const overallWinRate = totalTrades > 0 ? ((totalWins / totalTrades) * 100).toFixed(1) : '0.0';
  const busiestHour = chartData.reduce((best, current) => 
    current.total > best.total ? current : best, chartData[0] || { time: '00:00', total: 0 }
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{`Time: ${label}`}</p>
          <p className="text-blue-600">
            <span className="font-medium">Total Trades: </span>
            {data.total}
          </p>
          <p className="text-green-600">
            <span className="font-medium">Wins: </span>
            {data.wins}
          </p>
          <p className="text-red-600">
            <span className="font-medium">Losses: </span>
            {data.losses}
          </p>
          <p className="text-purple-600">
            <span className="font-medium">Win Rate: </span>
            {data.winRate}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Time Trading Activity
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Number of trades by trading hours • Data from Start Trade
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {totalTrades}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Trades
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {chartData.length > 0 ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <motion.div 
                className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Total</span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {totalTrades}
                </div>
              </motion.div>

              <motion.div 
                className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600">Wins</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {totalWins}
                </div>
              </motion.div>

              <motion.div 
                className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                  <span className="text-xs font-medium text-red-600">Losses</span>
                </div>
                <div className="text-lg font-bold text-red-600">
                  {totalLosses}
                </div>
              </motion.div>

              <motion.div 
                className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Win Rate</span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {overallWinRate}%
                </div>
              </motion.div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#666"
                    fontSize={12}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#3b82f6">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${220 + (entry.total * 10)}, 70%, ${50 + (entry.total * 2)}%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Additional Info */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Busiest Hour: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {busiestHour.time} ({busiestHour.total} trades)
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Overall Win Rate: </span>
                  <span className={`font-semibold ${parseFloat(overallWinRate) >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {overallWinRate}%
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No Data State */
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Trading Data Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add trades in <span className="font-medium text-orange-500">Start Trade</span> page to see your hourly trading activity
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeTradesChart;
