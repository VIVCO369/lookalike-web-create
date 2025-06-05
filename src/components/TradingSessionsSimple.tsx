import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Activity, Globe } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  status: "Yes" | "No";
}

interface Session {
  id: number;
  name: string;
  region: string;
  timeSlots: TimeSlot[];
  headerGradient: string;
  cardGradient: string;
  accentColor: string;
  icon: React.ReactNode;
}

const TradingSessionsSimple = () => {
  // Initialize sessions with modern styling and local storage
  const [sessions, setSessions] = useLocalStorage<Session[]>("tradingSessionsSimple", [
    {
      id: 1,
      name: "Session 1",
      region: "Early bird session",
      timeSlots: [
        { time: "4:00-5:00", status: "Yes" },
        { time: "5:00-6:00", status: "No" },
        { time: "6:00-7:00", status: "Yes" },
        { time: "7:00-8:00", status: "Yes" }
      ],
      headerGradient: "bg-gradient-to-r from-amber-600 to-orange-600",
      cardGradient: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10",
      accentColor: "border-amber-200 dark:border-amber-700",
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 2,
      name: "Session 2",
      region: "Morning session",
      timeSlots: [
        { time: "9:00-10:00", status: "Yes" },
        { time: "10:00-11:00", status: "Yes" },
        { time: "11:00-12:00", status: "No" },
        { time: "12:00-13:00", status: "Yes" }
      ],
      headerGradient: "bg-gradient-to-r from-emerald-600 to-green-600",
      cardGradient: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10",
      accentColor: "border-emerald-200 dark:border-emerald-700",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 3,
      name: "Session 3",
      region: "Afternoon session",
      timeSlots: [
        { time: "13:00-14:00", status: "Yes" },
        { time: "14:00-15:00", status: "No" },
        { time: "15:00-16:00", status: "Yes" },
        { time: "16:00-17:00", status: "Yes" }
      ],
      headerGradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
      cardGradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10",
      accentColor: "border-blue-200 dark:border-blue-700",
      icon: <Activity className="h-5 w-5" />
    },
    {
      id: 4,
      name: "Session 4",
      region: "Night session",
      timeSlots: [
        { time: "17:00-18:00", status: "No" },
        { time: "18:00-19:00", status: "Yes" },
        { time: "20:00-21:00", status: "No" },
        { time: "21:00-22:00", status: "No" }
      ],
      headerGradient: "bg-gradient-to-r from-yellow-600 to-amber-600",
      cardGradient: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10",
      accentColor: "border-yellow-200 dark:border-yellow-700",
      icon: <Clock className="h-5 w-5" />
    }
  ]);

  // Calculate session statistics
  const getSessionStats = (session: Session) => {
    const activeSlots = session.timeSlots.filter(slot => slot.status === "Yes").length;
    const totalSlots = session.timeSlots.length;
    const percentage = Math.round((activeSlots / totalSlots) * 100);
    return { activeSlots, totalSlots, percentage };
  };

  // Toggle status for a specific time slot
  const toggleTimeSlotStatus = (sessionId: number, timeSlotIndex: number) => {
    let newStatus = "";

    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              timeSlots: session.timeSlots.map((slot, index) => {
                if (index === timeSlotIndex) {
                  newStatus = slot.status === "Yes" ? "No" : "Yes";
                  return { ...slot, status: newStatus };
                }
                return slot;
              })
            }
          : session
      )
    );

    // Emit custom event for the chart to listen to
    const event = new CustomEvent('sessionStatusChange', {
      detail: {
        sessionId,
        timeSlotIndex,
        status: newStatus
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {sessions.map((session, sessionIndex) => {
        const stats = getSessionStats(session);
        
        return (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sessionIndex * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className={cn(
              "overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300",
              session.cardGradient,
              session.accentColor,
              "border-2"
            )}>
              {/* Modern Header with Better Readability */}
              <CardHeader className={cn(
                "relative p-0 overflow-hidden",
                session.headerGradient
              )}>
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/25 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
                        <div className="text-white">
                          {session.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl font-bold drop-shadow-lg">
                          {session.name}
                        </CardTitle>
                        <p className="text-white/90 text-sm font-semibold drop-shadow-md">
                          {session.region}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-3xl font-bold drop-shadow-lg">
                        {stats.percentage}%
                      </div>
                      <div className="text-white/90 text-sm font-medium drop-shadow-md">
                        {stats.activeSlots}/{stats.totalSlots} Active
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="w-full bg-black/20 rounded-full h-3 mt-4 border border-white/20">
                    <motion.div
                      className="bg-white rounded-full h-full shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      transition={{ delay: sessionIndex * 0.1 + 0.3, duration: 0.8 }}
                    />
                  </div>
                </div>
              </CardHeader>

              {/* Time Slots with Modern Design */}
              <CardContent className="p-6 space-y-1">
                {session.timeSlots.map((timeSlot, index) => (
                  <motion.div
                    key={index}
                    className="rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                  >
                    {/* Time Slot Header */}
                    <div className="flex items-center justify-between p-2">
                      {/* Time Display with Icon */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors duration-200",
                          timeSlot.status === "Yes"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        )}>
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {timeSlot.time}
                          </span>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {timeSlot.status === "Yes" ? "Trading Active" : "Market Closed"}
                          </div>
                        </div>
                      </div>

                      {/* Yes/No Button */}
                      <motion.button
                        onClick={() => toggleTimeSlotStatus(session.id, index)}
                        className={cn(
                          "px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                          timeSlot.status === "Yes"
                            ? "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500"
                            : "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {timeSlot.status}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
                
                {/* Session Status Badge */}
                <div className="pt-2">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
                    stats.percentage >= 75
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : stats.percentage >= 50
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      stats.percentage >= 75
                        ? "bg-green-500"
                        : stats.percentage >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    )} />
                    {stats.percentage >= 75 ? "Highly Active" : stats.percentage >= 50 ? "Moderately Active" : "Low Activity"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TradingSessionsSimple;
