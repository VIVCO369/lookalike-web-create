import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import useLocalStorage from '@/hooks/useLocalStorage';

interface SessionData {
  day: string;
  date: string;
  session1: number;
  session2: number;
  session3: number;
  session4: number;
}

interface TimeSlot {
  time: string;
  status: 'Yes' | 'No';
}

interface Session {
  id: number;
  name: string;
  timeSlots: TimeSlot[];
  color: string;
  bgColor: string;
}

const WeeklySessionActivity: React.FC = () => {
  // Get current date and generate 7-day timeline
  const generateWeekData = (): SessionData[] => {
    const today = new Date();
    const weekData: SessionData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      weekData.push({
        day: dayName,
        date: dateStr,
        session1: i === 0 ? 0 : 0, // Only today shows activity initially
        session2: i === 0 ? 0 : 0,
        session3: i === 0 ? 0 : 0,
        session4: i === 0 ? 0 : 0,
      });
    }

    return weekData;
  };

  const [weekData, setWeekData] = useLocalStorage<SessionData[]>('weeklySessionActivity', generateWeekData());

  // Session configuration with predefined time slots
  const [sessions, setSessions] = useLocalStorage<Session[]>('sessionCards', [
    {
      id: 1,
      name: 'Session 1',
      timeSlots: [
        { time: '4:00-5:00', status: 'No' },
        { time: '5:00-6:00', status: 'No' },
        { time: '6:00-7:00', status: 'No' },
        { time: '7:00-8:00', status: 'No' }
      ],
      color: '#16a34a', // Green
      bgColor: 'bg-green-900'
    },
    {
      id: 2,
      name: 'Session 2',
      timeSlots: [
        { time: '9:00-10:00', status: 'No' },
        { time: '10:00-11:00', status: 'No' },
        { time: '11:00-12:00', status: 'No' },
        { time: '12:00-13:00', status: 'No' }
      ],
      color: '#7c3aed', // Purple
      bgColor: 'bg-purple-900'
    },
    {
      id: 3,
      name: 'Session 3',
      timeSlots: [
        { time: '13:00-14:00', status: 'No' },
        { time: '14:00-15:00', status: 'No' },
        { time: '15:00-16:00', status: 'No' },
        { time: '16:00-17:00', status: 'No' }
      ],
      color: '#2563eb', // Blue
      bgColor: 'bg-blue-900'
    },
    {
      id: 4,
      name: 'Session 4',
      timeSlots: [
        { time: '17:00-18:00', status: 'No' },
        { time: '18:00-19:00', status: 'No' },
        { time: '20:00-21:00', status: 'No' },
        { time: '21:00-22:00', status: 'No' }
      ],
      color: '#ea580c', // Orange
      bgColor: 'bg-orange-900'
    }
  ]);

  // Update today's data when sessions change
  useEffect(() => {
    const today = new Date();
    const todayIndex = 6; // Today is the last item in the array

    setWeekData(prevData => {
      const newData = [...prevData];
      if (newData[todayIndex]) {
        newData[todayIndex] = {
          ...newData[todayIndex],
          session1: sessions[0].timeSlots.filter(slot => slot.status === 'Yes').length,
          session2: sessions[1].timeSlots.filter(slot => slot.status === 'Yes').length,
          session3: sessions[2].timeSlots.filter(slot => slot.status === 'Yes').length,
          session4: sessions[3].timeSlots.filter(slot => slot.status === 'Yes').length,
        };
      }
      return newData;
    });
  }, [sessions, setWeekData]);

  // Toggle time slot status
  const toggleTimeSlot = (sessionId: number, slotIndex: number) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              timeSlots: session.timeSlots.map((slot, index) =>
                index === slotIndex
                  ? { ...slot, status: slot.status === 'Yes' ? 'No' : 'Yes' }
                  : slot
              )
            }
          : session
      )
    );
  };

  // Chart configuration
  const chartHeight = 200;
  const maxSlots = 4;

  // Calculate bar height
  const getBarHeight = (value: number) => {
    return (value / maxSlots) * chartHeight;
  };

  // Get total active slots for a session
  const getTotalActiveSlots = (sessionId: number) => {
    const session = sessions.find(s => s.id === sessionId);
    return session ? session.timeSlots.filter(slot => slot.status === 'Yes').length : 0;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 border-0 backdrop-blur-sm">
      <CardHeader className="pb-6 relative overflow-hidden">
        {/* Header with gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-cyan-400/10"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <CardTitle className="text-xl font-bold text-black dark:text-white">
                  Weekly Session Activity
                </CardTitle>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 dark:bg-green-400/20 rounded-full border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">LIVE</span>
            </div>
          </div>


        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Area */}
        <div className="relative mb-8 p-6 bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/30 rounded-2xl border border-blue-200/30 dark:border-blue-700/30 backdrop-blur-sm">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-6 text-xs font-medium text-blue-600 dark:text-blue-400 pr-3" style={{ height: `${chartHeight}px` }}>
            <div className="absolute" style={{ top: '0px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md whitespace-nowrap">4 slots</span>
            </div>
            <div className="absolute" style={{ top: '50px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md whitespace-nowrap">3 slots</span>
            </div>
            <div className="absolute" style={{ top: '100px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md whitespace-nowrap">2 slots</span>
            </div>
            <div className="absolute" style={{ top: '150px' }}>
              <span className="px-2 py-1 bg-blue-100/50 dark:bg-blue-900/30 rounded-md whitespace-nowrap">1 slot</span>
            </div>
          </div>

          {/* Chart bars */}
          <div className="ml-16 flex items-end justify-between gap-3 relative" style={{ height: `${chartHeight}px` }}>
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-full border-t border-gray-300/40 dark:border-gray-500/30" style={{ top: '0px' }} />
              <div className="absolute w-full border-t border-gray-300/40 dark:border-gray-500/30" style={{ top: '50px' }} />
              <div className="absolute w-full border-t border-gray-300/40 dark:border-gray-500/30" style={{ top: '100px' }} />
              <div className="absolute w-full border-t border-gray-300/40 dark:border-gray-500/30" style={{ top: '150px' }} />
              <div className="absolute w-full border-t-2 border-gray-400/60 dark:border-gray-400/50" style={{ bottom: '0px' }} />
            </div>

            {weekData.map((day, dayIndex) => (
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
                {/* Stacked bars for each session */}
                <div className="relative w-full max-w-16 flex flex-col items-center justify-end" style={{ height: `${chartHeight}px` }}>
                  {/* Session 4 (top) */}
                  <motion.div
                    className="w-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${sessions[3].color}, ${sessions[3].color}dd)`,
                      height: `${getBarHeight(day.session4)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session4)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.4 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>

                  {/* Session 3 */}
                  <motion.div
                    className="w-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${sessions[2].color}, ${sessions[2].color}dd)`,
                      height: `${getBarHeight(day.session3)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session3)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>

                  {/* Session 2 */}
                  <motion.div
                    className="w-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${sessions[1].color}, ${sessions[1].color}dd)`,
                      height: `${getBarHeight(day.session2)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session2)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>

                  {/* Session 1 (bottom) */}
                  <motion.div
                    className="w-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${sessions[0].color}, ${sessions[0].color}dd)`,
                      height: `${getBarHeight(day.session1)}px`
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${getBarHeight(day.session1)}px`, opacity: 1 }}
                    transition={{ duration: 0.8, delay: dayIndex * 0.1 + 0.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Day labels below the chart */}
          <div className="ml-16 flex justify-between gap-3 mt-4">
            {weekData.map((day, dayIndex) => (
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
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {day.date}
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-1 opacity-60"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Session Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sessions.map((session, sessionIndex) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sessionIndex * 0.1 + 1 }}
              className="relative"
            >
              <Card className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${session.bgColor}/20 backdrop-blur-sm`}>
                {/* Session Header */}
                <CardHeader className="relative p-0 overflow-hidden" style={{ background: `linear-gradient(135deg, ${session.color}, ${session.color}dd)` }}>
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="relative p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white text-lg font-bold drop-shadow-lg">
                          {session.name}
                        </CardTitle>
                        <p className="text-white/90 text-sm font-semibold drop-shadow-md">
                          {getTotalActiveSlots(session.id)}/4 Active Slots
                        </p>
                      </div>
                      <div className="text-white text-2xl font-bold drop-shadow-lg">
                        {Math.round((getTotalActiveSlots(session.id) / 4) * 100)}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/20 rounded-full h-2 mt-3 border border-white/20">
                      <motion.div
                        className="bg-white rounded-full h-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${(getTotalActiveSlots(session.id) / 4) * 100}%` }}
                        transition={{ delay: sessionIndex * 0.1 + 1.3, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </CardHeader>

                {/* Time Slots */}
                <CardContent className="p-4 space-y-2">
                  {session.timeSlots.map((timeSlot, slotIndex) => (
                    <motion.div
                      key={slotIndex}
                      className="rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sessionIndex * 0.1 + 1.5 + slotIndex * 0.1 }}
                    >
                      <div className="flex items-center justify-between p-3">
                        {/* Time Display */}
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors duration-200 ${
                            timeSlot.status === 'Yes'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {timeSlot.time}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {timeSlot.status === 'Yes' ? 'Trading Active' : 'Market Closed'}
                            </div>
                          </div>
                        </div>

                        {/* Toggle Button */}
                        <motion.button
                          onClick={() => toggleTimeSlot(session.id, slotIndex)}
                          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            timeSlot.status === 'Yes'
                              ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
                              : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {timeSlot.status}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {sessions.map((session, index) => (
            <motion.div
              key={`stats-${session.id}`}
              className="relative p-4 rounded-xl border border-white/20 dark:border-gray-700/30 backdrop-blur-sm transition-all duration-300 group overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${session.color}15, ${session.color}05)` }}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 + 2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Dot indicator */}
              <div className="absolute top-3 right-3">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: session.color }}
                ></div>
              </div>

              <div className="text-center">
                {/* Value */}
                <div className="mb-2">
                  <div className="text-3xl font-black bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {getTotalActiveSlots(session.id)}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Active Slots
                  </div>
                </div>

                {/* Session info */}
                <div className="space-y-1">
                  <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {session.name}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: session.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(getTotalActiveSlots(session.id) / 4) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 + 2.5 }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySessionActivity;
