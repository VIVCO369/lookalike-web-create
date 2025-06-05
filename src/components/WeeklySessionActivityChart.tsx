import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import useLocalStorage from '@/hooks/useLocalStorage';

interface SessionData {
  day: string;
  session1: number;
  session2: number;
  session3: number;
  session4: number;
}

interface WeeklySessionActivityChartProps {
  onSessionUpdate?: (sessionData: SessionData[]) => void;
}

const WeeklySessionActivityChart: React.FC<WeeklySessionActivityChartProps> = ({ onSessionUpdate }) => {
  // Initialize with sample data matching the image
  const defaultSessionData: SessionData[] = [
    { day: 'Thu', session1: 0, session2: 0, session3: 0, session4: 0 },
    { day: 'Fri', session1: 0, session2: 0, session3: 0, session4: 0 },
    { day: 'Sat', session1: 0, session2: 0, session3: 0, session4: 0 },
    { day: 'Sun', session1: 0, session2: 0, session3: 0, session4: 0 },
    { day: 'Mon', session1: 0, session2: 0, session3: 0, session4: 0 },
    { day: 'Tue', session1: 0, session2: 0, session3: 0, session4: 0 }, // Total = 0 active slots (matches Global Trading Sessions)
    { day: 'Wed', session1: 0, session2: 0, session3: 0, session4: 0 },
  ];

  const [sessionData, setSessionData] = useLocalStorage<SessionData[]>('weeklySessionChart', defaultSessionData);

  // Listen to trading sessions changes from TradingSessionsSimple component
  useEffect(() => {
    const handleSessionChange = (event: CustomEvent) => {
      const { sessionId, timeSlotIndex, status } = event.detail;

      // Get current day
      const today = new Date();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = dayNames[today.getDay()];

      // Update session data based on the session selection
      setSessionData(prevData => {
        return prevData.map(dayData => {
          if (dayData.day === currentDay) {
            const updatedDay = { ...dayData };

            // Increment or decrement based on status (Yes = +1, No = -1, but minimum 0)
            const change = status === 'Yes' ? 1 : -1;

            switch (sessionId) {
              case 1:
                updatedDay.session1 = Math.max(0, updatedDay.session1 + change);
                break;
              case 2:
                updatedDay.session2 = Math.max(0, updatedDay.session2 + change);
                break;
              case 3:
                updatedDay.session3 = Math.max(0, updatedDay.session3 + change);
                break;
              case 4:
                updatedDay.session4 = Math.max(0, updatedDay.session4 + change);
                break;
            }

            return updatedDay;
          }
          return dayData;
        });
      });
    };

    // Listen for custom events from trading sessions
    window.addEventListener('sessionStatusChange', handleSessionChange as EventListener);

    return () => {
      window.removeEventListener('sessionStatusChange', handleSessionChange as EventListener);
    };
  }, [setSessionData]);

  // Notify parent component of updates
  useEffect(() => {
    if (onSessionUpdate) {
      onSessionUpdate(sessionData);
    }
  }, [sessionData, onSessionUpdate]);

  // Chart configuration with fixed scale
  const chartHeight = 200;
  const maxSlots = 4; // Fixed maximum of 4 slots per session

  // Session colors matching the website theme
  const sessionColors = {
    session1: '#f97316', // Orange-500 (matches website orange theme)
    session2: '#10b981', // Emerald-500 (green theme)
    session3: '#3b82f6', // Blue-500 (blue theme)
    session4: '#8b5cf6', // Violet-500 (purple theme)
  };

  // Calculate bar height based on fixed 4-slot scale
  const getBarHeight = (value: number) => {
    return (value / maxSlots) * chartHeight;
  };

  // Get total slots for each day
  const getTotalSlots = (day: SessionData) => {
    return day.session1 + day.session2 + day.session3 + day.session4;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 border-0 backdrop-blur-sm">
      <CardHeader className="pb-6 relative overflow-hidden">
        {/* Futuristic background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-cyan-400/10"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Weekly Session Activity
                </CardTitle>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  7 Days Performance
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 dark:bg-green-400/20 rounded-full border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">LIVE</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Real-time trading session analytics with interactive performance tracking
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Area */}
        <div className="relative mb-8 p-6 bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/30 rounded-2xl border border-blue-200/30 dark:border-blue-700/30 backdrop-blur-sm">
          {/* Futuristic grid background */}
          <div className="absolute inset-0 opacity-20 dark:opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Y-axis labels - properly aligned with bars */}
          <div className="absolute left-2 top-6 text-xs font-medium text-blue-600 dark:text-blue-400 pr-3" style={{ height: `${chartHeight}px` }}>
            {/* 4 slots - at the very top */}
            <div className="absolute" style={{ top: '0px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md">4 slots</span>
            </div>
            {/* 3 slots - 1/4 down from top */}
            <div className="absolute" style={{ top: '50px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md">3 slots</span>
            </div>
            {/* 2 slots - 1/2 down from top */}
            <div className="absolute" style={{ top: '100px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md">2 slots</span>
            </div>
            {/* 1 slot - 3/4 down from top */}
            <div className="absolute" style={{ top: '150px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md">1 slots</span>
            </div>
          </div>

          {/* Chart bars */}
          <div className="ml-16 flex items-end justify-between gap-3 relative" style={{ height: `${chartHeight}px` }}>
            {/* Horizontal grid lines for reference */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Grid line for 4 slots (top) */}
              <div className="absolute w-full border-t-2 border-red-400/70" style={{ top: '0px' }} />
              {/* Grid line for 3 slots */}
              <div className="absolute w-full border-t-2 border-red-400/70" style={{ top: '50px' }} />
              {/* Grid line for 2 slots */}
              <div className="absolute w-full border-t-2 border-red-400/70" style={{ top: '100px' }} />
              {/* Grid line for 1 slot */}
              <div className="absolute w-full border-t-2 border-red-400/70" style={{ top: '150px' }} />
              {/* Bottom baseline */}
              <div className="absolute w-full border-t-2 border-red-400/70" style={{ bottom: '0px' }} />
            </div>
            {sessionData.map((day, dayIndex) => (
              <motion.div
                key={day.day}
                className="flex flex-col items-center flex-1 group"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: dayIndex * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Individual bars side by side */}
                <div className="relative w-full max-w-20 flex items-end justify-between gap-1 transition-all duration-300" style={{ height: `${chartHeight}px` }}>
                  {/* Session 1 (orange) */}
                  <motion.div
                    className="w-3 relative overflow-hidden rounded-t-sm"
                    style={{
                      background: `linear-gradient(135deg, ${sessionColors.session1}, ${sessionColors.session1}dd)`,
                      height: `${getBarHeight(day.session1)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session1)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>

                  {/* Session 2 (green) */}
                  <motion.div
                    className="w-3 relative overflow-hidden rounded-t-sm"
                    style={{
                      background: `linear-gradient(135deg, ${sessionColors.session2}, ${sessionColors.session2}dd)`,
                      height: `${getBarHeight(day.session2)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session2)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>

                  {/* Session 3 (blue) */}
                  <motion.div
                    className="w-3 relative overflow-hidden rounded-t-sm"
                    style={{
                      background: `linear-gradient(135deg, ${sessionColors.session3}, ${sessionColors.session3}dd)`,
                      height: `${getBarHeight(day.session3)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session3)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>

                  {/* Session 4 (purple) */}
                  <motion.div
                    className="w-3 relative overflow-hidden rounded-t-sm"
                    style={{
                      background: `linear-gradient(135deg, ${sessionColors.session4}, ${sessionColors.session4}dd)`,
                      height: `${getBarHeight(day.session4)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session4)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.4 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>
                </div>


              </motion.div>
            ))}
          </div>

          {/* Day labels below the chart */}
          <div className="ml-16 flex justify-between gap-3 mt-4">
            {sessionData.map((day, dayIndex) => (
              <motion.div
                key={`label-${day.day}`}
                className="flex-1 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: dayIndex * 0.1 + 0.5 }}
              >
                <div className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {day.day}
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-1 opacity-60"></div>
              </motion.div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default WeeklySessionActivityChart;
