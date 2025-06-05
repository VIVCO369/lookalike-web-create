import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTradeData } from '@/contexts/TradeDataContext';

interface TimeSlotData {
  time: string;
  pnl: number;
  trades: number;
  winRate: number;
}

const TimePLTradesChart: React.FC = () => {
  // Get trade data from context
  const { backtestingTrades } = useTradeData();

  // Process trade data by time slots
  const timeSlotData = useMemo(() => {
    const timeSlots: { [key: string]: { pnl: number; trades: number; wins: number } } = {};

    // Initialize time slots (24 hours)
    for (let hour = 0; hour < 24; hour++) {
      const timeKey = `${hour.toString().padStart(2, '0')}:00`;
      timeSlots[timeKey] = { pnl: 0, trades: 0, wins: 0 };
    }

    // Process actual trades
    backtestingTrades.forEach(trade => {
      if (trade.entryTime) {
        // Extract hour from entry time (assuming format like "10:30" or "14:45")
        const timeParts = trade.entryTime.split(':');
        if (timeParts.length >= 2) {
          const hour = parseInt(timeParts[0]);
          const timeKey = `${hour.toString().padStart(2, '0')}:00`;

          if (timeSlots[timeKey]) {
            const profit = parseFloat(trade.netProfit || '0');
            timeSlots[timeKey].pnl += profit;
            timeSlots[timeKey].trades += 1;

            if (trade.winLoss === 'win') {
              timeSlots[timeKey].wins += 1;
            }
          }
        }
      }
    });

    // Add demo data if no real trades exist
    if (backtestingTrades.length === 0) {
      // Demo data for different trading sessions
      const demoData = [
        { hour: 8, pnl: 150.50, trades: 3, wins: 2 },   // Morning session
        { hour: 9, pnl: -75.25, trades: 2, wins: 0 },   // Early morning
        { hour: 10, pnl: 320.75, trades: 5, wins: 4 },  // Peak morning
        { hour: 11, pnl: 89.30, trades: 2, wins: 1 },   // Late morning
        { hour: 13, pnl: -45.60, trades: 3, wins: 1 },  // Early afternoon
        { hour: 14, pnl: 275.80, trades: 4, wins: 3 },  // Afternoon session
        { hour: 15, pnl: 125.40, trades: 3, wins: 2 },  // Mid afternoon
        { hour: 16, pnl: -95.20, trades: 2, wins: 0 },  // Late afternoon
        { hour: 20, pnl: 180.90, trades: 3, wins: 2 },  // Evening session
        { hour: 21, pnl: 65.15, trades: 2, wins: 1 },   // Late evening
      ];

      demoData.forEach(({ hour, pnl, trades, wins }) => {
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        timeSlots[timeKey] = { pnl, trades, wins };
      });
    }

    // Convert to array and calculate win rates
    return Object.entries(timeSlots).map(([time, data]) => ({
      time,
      pnl: data.pnl,
      trades: data.trades,
      winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0
    })).filter(slot => slot.trades > 0); // Only show time slots with trades
  }, [backtestingTrades]);

  // Get chart dimensions
  const chartHeight = 200;
  const maxPnL = Math.max(...timeSlotData.map(slot => Math.abs(slot.pnl)), 1);
  const maxTrades = Math.max(...timeSlotData.map(slot => slot.trades), 1);

  // Calculate bar heights
  const getPnLBarHeight = (pnl: number) => {
    return (Math.abs(pnl) / maxPnL) * (chartHeight / 2);
  };

  const getTradesBarHeight = (trades: number) => {
    return (trades / maxTrades) * chartHeight;
  };

  // Get summary statistics
  const totalPnL = timeSlotData.reduce((sum, slot) => sum + slot.pnl, 0);
  const totalTrades = timeSlotData.reduce((sum, slot) => sum + slot.trades, 0);
  const avgWinRate = timeSlotData.length > 0 
    ? timeSlotData.reduce((sum, slot) => sum + slot.winRate, 0) / timeSlotData.length 
    : 0;
  const bestTimeSlot = timeSlotData.reduce((best, slot) => 
    slot.pnl > best.pnl ? slot : best, { time: 'N/A', pnl: 0, trades: 0, winRate: 0 });

  return (
    <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Time P/L and Trades Taken
          </CardTitle>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Trading performance analysis by time of day
        </p>
      </CardHeader>
      <CardContent>
        {timeSlotData.length > 0 ? (
          <>
            {/* Chart Area */}
            <div className="relative mb-6">
              {/* Y-axis labels for P/L */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
                <span>+${maxPnL.toFixed(0)}</span>
                <span>$0</span>
                <span>-${maxPnL.toFixed(0)}</span>
              </div>
              
              {/* Chart bars */}
              <div className="ml-12 flex items-center justify-center gap-1" style={{ height: `${chartHeight}px` }}>
                {timeSlotData.map((slot, index) => (
                  <motion.div
                    key={slot.time}
                    className="flex flex-col items-center justify-center flex-1 max-w-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    {/* P/L Bar */}
                    <div className="relative w-full flex flex-col items-center justify-center" style={{ height: `${chartHeight}px` }}>
                      {/* Positive P/L (above center) */}
                      {slot.pnl > 0 && (
                        <motion.div
                          className="w-full bg-green-500 rounded-t mb-auto"
                          style={{ height: `${getPnLBarHeight(slot.pnl)}px` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${getPnLBarHeight(slot.pnl)}px` }}
                          transition={{ duration: 0.6, delay: index * 0.05 }}
                          title={`${slot.time}: +$${slot.pnl.toFixed(2)}, ${slot.trades} trades`}
                        />
                      )}
                      
                      {/* Center line */}
                      <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 my-1" />
                      
                      {/* Negative P/L (below center) */}
                      {slot.pnl < 0 && (
                        <motion.div
                          className="w-full bg-red-500 rounded-b mt-auto"
                          style={{ height: `${getPnLBarHeight(slot.pnl)}px` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${getPnLBarHeight(slot.pnl)}px` }}
                          transition={{ duration: 0.6, delay: index * 0.05 }}
                          title={`${slot.time}: -$${Math.abs(slot.pnl).toFixed(2)}, ${slot.trades} trades`}
                        />
                      )}
                      
                      {/* Trades count indicator */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {slot.trades}
                        </div>
                      </div>
                    </div>
                    
                    {/* Time label */}
                    <div className="mt-8 text-center">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 transform -rotate-45">
                        {slot.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-400"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Trade Count</span>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.div
                className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${totalPnL.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total P/L</div>
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalTrades}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Trades</div>
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {avgWinRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Avg Win Rate</div>
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {bestTimeSlot.time}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Best Time</div>
                </div>
              </motion.div>
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
              Start adding trades to see your time-based performance analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimePLTradesChart;
