import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import useLocalStorage from '@/hooks/useLocalStorage';

interface ChartData {
  day: string;
  completed: number;
  missed: number;
  active: number;
  scheduled: number;
  profit: number;
  trades: number;
}

const WeeklySessionChart: React.FC = () => {
  // Sample data for the chart
  const defaultChartData: ChartData[] = [
    { day: 'Mon', completed: 2, missed: 0, active: 0, scheduled: 0, profit: 10.30, trades: 5 },
    { day: 'Tue', completed: 1, missed: 0, active: 1, scheduled: 1, profit: 12.30, trades: 3 },
    { day: 'Wed', completed: 0, missed: 0, active: 0, scheduled: 2, profit: 0, trades: 0 },
    { day: 'Thu', completed: 0, missed: 0, active: 0, scheduled: 2, profit: 0, trades: 0 },
    { day: 'Fri', completed: 0, missed: 1, active: 0, scheduled: 1, profit: 0, trades: 0 },
  ];

  const [chartData] = useLocalStorage<ChartData[]>('weeklySessionChartData', defaultChartData);

  // Calculate max values for scaling
  const maxSessions = Math.max(...chartData.map(d => d.completed + d.missed + d.active + d.scheduled));
  const maxProfit = Math.max(...chartData.map(d => Math.abs(d.profit)));
  const maxTrades = Math.max(...chartData.map(d => d.trades));

  // Calculate totals
  const totals = useMemo(() => {
    return chartData.reduce((acc, day) => ({
      completed: acc.completed + day.completed,
      missed: acc.missed + day.missed,
      active: acc.active + day.active,
      scheduled: acc.scheduled + day.scheduled,
      profit: acc.profit + day.profit,
      trades: acc.trades + day.trades
    }), { completed: 0, missed: 0, active: 0, scheduled: 0, profit: 0, trades: 0 });
  }, [chartData]);

  // Get bar height percentage
  const getBarHeight = (value: number, max: number) => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  // Get profit color
  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-500';
    if (profit < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Weekly Session Activity Chart
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              {totals.completed} Completed
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              {totals.active} Active
            </Badge>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Visual overview of your weekly trading session performance and activity
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Sessions</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {totals.completed + totals.missed + totals.active + totals.scheduled}
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-green-600 dark:text-green-400 text-sm font-medium">Success Rate</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {totals.completed + totals.missed > 0 
                ? Math.round((totals.completed / (totals.completed + totals.missed)) * 100) 
                : 0}%
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Trades</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totals.trades}</div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">Weekly P&L</div>
            <div className={`text-2xl font-bold ${getProfitColor(totals.profit)}`}>
              {totals.profit >= 0 ? '+' : ''}${totals.profit.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-6">
          {/* Session Status Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Session Status by Day</h4>
            <div className="flex items-end justify-between gap-4 h-48 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {chartData.map((day, index) => {
                const totalSessions = day.completed + day.missed + day.active + day.scheduled;
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center flex-1"
                  >
                    {/* Stacked Bar */}
                    <div className="relative w-full max-w-12 h-32 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                      {/* Completed Sessions */}
                      {day.completed > 0 && (
                        <div
                          className="absolute bottom-0 w-full bg-blue-500 transition-all duration-500"
                          style={{ height: `${getBarHeight(day.completed, maxSessions)}%` }}
                        />
                      )}
                      {/* Active Sessions */}
                      {day.active > 0 && (
                        <div
                          className="absolute w-full bg-green-500 transition-all duration-500"
                          style={{ 
                            bottom: `${getBarHeight(day.completed, maxSessions)}%`,
                            height: `${getBarHeight(day.active, maxSessions)}%` 
                          }}
                        />
                      )}
                      {/* Missed Sessions */}
                      {day.missed > 0 && (
                        <div
                          className="absolute w-full bg-red-500 transition-all duration-500"
                          style={{ 
                            bottom: `${getBarHeight(day.completed + day.active, maxSessions)}%`,
                            height: `${getBarHeight(day.missed, maxSessions)}%` 
                          }}
                        />
                      )}
                      {/* Scheduled Sessions */}
                      {day.scheduled > 0 && (
                        <div
                          className="absolute w-full bg-gray-400 transition-all duration-500"
                          style={{ 
                            bottom: `${getBarHeight(day.completed + day.active + day.missed, maxSessions)}%`,
                            height: `${getBarHeight(day.scheduled, maxSessions)}%` 
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Day Label */}
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{day.day}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{totalSessions} sessions</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Missed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Scheduled</span>
              </div>
            </div>
          </div>

          {/* Profit Chart */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily P&L Performance</h4>
            <div className="flex items-end justify-between gap-4 h-32 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {chartData.map((day, index) => (
                <motion.div
                  key={`profit-${day.day}`}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center flex-1"
                >
                  {/* Profit Bar */}
                  <div className="relative w-full max-w-8 h-20 flex items-end">
                    {day.profit !== 0 && (
                      <div
                        className={`w-full rounded-t transition-all duration-500 ${
                          day.profit > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ height: `${getBarHeight(Math.abs(day.profit), maxProfit)}%` }}
                      />
                    )}
                    {day.profit === 0 && (
                      <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded" />
                    )}
                  </div>
                  
                  {/* Day and Value */}
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{day.day}</div>
                    <div className={`text-xs font-medium ${getProfitColor(day.profit)}`}>
                      {day.profit >= 0 ? '+' : ''}${day.profit.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySessionChart;
