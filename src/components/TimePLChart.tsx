import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTradeData } from '@/contexts/TradeDataContext';

interface TimePLData {
  time: string;
  pnl: number;
  cumulativePnl: number;
}

const TimePLChart: React.FC = () => {
  // Get trade data from context
  const { backtestingTrades } = useTradeData();

  // Process trade data for time-based P/L
  const timePLData = useMemo(() => {
    const timeSlots: { [key: string]: number } = {};

    // Initialize time slots (24 hours)
    for (let hour = 0; hour < 24; hour++) {
      const timeKey = `${hour.toString().padStart(2, '0')}:00`;
      timeSlots[timeKey] = 0;
    }

    // Process actual trades
    backtestingTrades.forEach(trade => {
      if (trade.tradeTime) {
        const timeParts = trade.tradeTime.split(':');
        if (timeParts.length >= 2) {
          const hour = parseInt(timeParts[0]);
          const timeKey = `${hour.toString().padStart(2, '0')}:00`;

          if (timeSlots[timeKey] !== undefined) {
            const profit = parseFloat(trade.netProfit || '0');
            timeSlots[timeKey] += profit;
          }
        }
      }
    });

    // Add demo data if no real trades exist
    if (backtestingTrades.length === 0) {
      const demoData = [
        { hour: 8, pnl: 120.50 },
        { hour: 9, pnl: -45.25 },
        { hour: 10, pnl: 280.75 },
        { hour: 11, pnl: 65.30 },
        { hour: 13, pnl: -35.60 },
        { hour: 14, pnl: 195.80 },
        { hour: 15, pnl: 85.40 },
        { hour: 16, pnl: -75.20 },
        { hour: 20, pnl: 150.90 },
        { hour: 21, pnl: 45.15 },
      ];

      demoData.forEach(({ hour, pnl }) => {
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        timeSlots[timeKey] = pnl;
      });
    }

    // Convert to array with cumulative P/L and filter active hours
    let cumulativePnl = 0;
    return Object.entries(timeSlots)
      .filter(([_, pnl]) => pnl !== 0)
      .map(([time, pnl]) => {
        cumulativePnl += pnl;
        return {
          time,
          pnl,
          cumulativePnl
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [backtestingTrades]);

  // Chart dimensions and calculations
  const chartHeight = 250;
  const chartWidth = 800;
  const maxPnL = Math.max(...timePLData.map(d => Math.abs(d.pnl)), 1);
  const maxCumulative = Math.max(...timePLData.map(d => Math.abs(d.cumulativePnl)), 1);

  // Generate SVG path for cumulative P/L line
  const generatePath = () => {
    if (timePLData.length === 0) return '';
    
    const points = timePLData.map((data, index) => {
      const x = (index / (timePLData.length - 1)) * chartWidth;
      const y = chartHeight / 2 - (data.cumulativePnl / maxCumulative) * (chartHeight / 2 - 20);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Calculate summary statistics
  const totalPnL = timePLData.reduce((sum, data) => sum + data.pnl, 0);
  const finalCumulative = timePLData.length > 0 ? timePLData[timePLData.length - 1].cumulativePnl : 0;
  const profitableHours = timePLData.filter(data => data.pnl > 0).length;
  const bestHour = timePLData.reduce((best, data) => 
    data.pnl > best.pnl ? data : best, { time: 'N/A', pnl: 0, cumulativePnl: 0 });

  return (
    <Card className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Time & P/L Performance
          </CardTitle>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Hourly profit/loss analysis with cumulative trend • Data from Start Trade
        </p>
      </CardHeader>
      <CardContent>
        {timePLData.length > 0 ? (
          <>
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <motion.div
                className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    ${totalPnL.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total P/L</div>
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    ${finalCumulative.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Final Balance</div>
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="text-center">
                  <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {profitableHours}/{timePLData.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Profitable Hours</div>
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="text-center">
                  <TrendingUp className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {bestHour.time}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Best Hour</div>
                </div>
              </motion.div>
            </div>

            {/* Chart Area */}
            <div className="relative mb-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-300 dark:text-gray-600" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Zero line */}
                <line 
                  x1="0" 
                  y1={chartHeight / 2} 
                  x2={chartWidth} 
                  y2={chartHeight / 2} 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="text-gray-400 dark:text-gray-500"
                  strokeDasharray="5,5"
                />
                
                {/* P/L Bars */}
                {timePLData.map((data, index) => {
                  const x = (index / (timePLData.length - 1)) * chartWidth;
                  const barHeight = Math.abs(data.pnl / maxPnL) * (chartHeight / 2 - 20);
                  const barY = data.pnl >= 0 ? chartHeight / 2 - barHeight : chartHeight / 2;
                  
                  return (
                    <motion.rect
                      key={data.time}
                      x={x - 15}
                      y={barY}
                      width="30"
                      height={barHeight}
                      fill={data.pnl >= 0 ? '#10b981' : '#ef4444'}
                      rx="2"
                      initial={{ height: 0, y: chartHeight / 2 }}
                      animate={{ height: barHeight, y: barY }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <title>{`${data.time}: ${data.pnl >= 0 ? '+' : ''}$${data.pnl.toFixed(2)}`}</title>
                    </motion.rect>
                  );
                })}
                
                {/* Cumulative P/L Line */}
                <motion.path
                  d={generatePath()}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                
                {/* Data points on line */}
                {timePLData.map((data, index) => {
                  const x = (index / (timePLData.length - 1)) * chartWidth;
                  const y = chartHeight / 2 - (data.cumulativePnl / maxCumulative) * (chartHeight / 2 - 20);
                  
                  return (
                    <motion.circle
                      key={`point-${data.time}`}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
                    >
                      <title>{`${data.time}: Cumulative $${data.cumulativePnl.toFixed(2)}`}</title>
                    </motion.circle>
                  );
                })}
                
                {/* Time labels */}
                {timePLData.map((data, index) => {
                  const x = (index / (timePLData.length - 1)) * chartWidth;
                  return (
                    <text
                      key={`label-${data.time}`}
                      x={x}
                      y={chartHeight - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-600 dark:fill-gray-400"
                    >
                      {data.time}
                    </text>
                  );
                })}
              </svg>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
                <span>+${maxPnL.toFixed(0)}</span>
                <span>$0</span>
                <span>-${maxPnL.toFixed(0)}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Cumulative P/L</span>
              </div>
            </div>


          </>
        ) : (
          /* No Data State */
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No P/L Data Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add trades in <span className="font-medium text-orange-500">Start Trade</span> page to see your time-based P/L analysis
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimePLChart;
