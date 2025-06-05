import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Activity, Globe, ChevronDown, ChevronUp, BarChart3, Zap, DollarSign } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  status: "Yes" | "No";
  expanded?: boolean;
  details: {
    marketActivity: string;
    volatility: "Low" | "Medium" | "High";
    majorPairs: string[];
    tradingTips: string;
    volume: string;
    spread: string;
  };
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
  isActive: boolean;
}

const TradingSessions = () => {
  // Initialize sessions with modern styling and local storage
  const [sessions, setSessions] = useLocalStorage<Session[]>("tradingSessions", [
    {
      id: 1,
      name: "Asian Session",
      region: "Tokyo • Sydney",
      timeSlots: [
        {
          time: "4:00-5:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "Tokyo Opening Bell",
            volatility: "Medium",
            majorPairs: ["USD/JPY", "AUD/JPY", "GBP/JPY"],
            tradingTips: "Focus on JPY pairs as Tokyo market opens. Good liquidity for Asian currencies.",
            volume: "Moderate",
            spread: "2-3 pips"
          }
        },
        {
          time: "5:00-6:00",
          status: "No",
          expanded: false,
          details: {
            marketActivity: "Early Asian Session",
            volatility: "Low",
            majorPairs: ["AUD/USD", "NZD/USD", "USD/JPY"],
            tradingTips: "Lower volatility period. Good for range trading strategies.",
            volume: "Low",
            spread: "3-4 pips"
          }
        },
        {
          time: "6:00-7:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "Sydney Market Active",
            volatility: "Medium",
            majorPairs: ["AUD/USD", "AUD/JPY", "NZD/USD"],
            tradingTips: "Australian economic data releases. Watch for AUD movements.",
            volume: "Moderate",
            spread: "2-3 pips"
          }
        },
        {
          time: "7:00-8:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "Asian Session Peak",
            volatility: "High",
            majorPairs: ["USD/JPY", "EUR/JPY", "GBP/JPY"],
            tradingTips: "High activity period. Good for breakout strategies and trend following.",
            volume: "High",
            spread: "1-2 pips"
          }
        }
      ],
      headerGradient: "bg-gradient-to-r from-amber-600 to-orange-600",
      cardGradient: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10",
      accentColor: "border-amber-200 dark:border-amber-700",
      icon: <Globe className="h-5 w-5" />,
      isActive: true
    },
    {
      id: 2,
      name: "European Session",
      region: "London • Frankfurt",
      timeSlots: [
        {
          time: "9:00-10:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "London Opening Bell",
            volatility: "High",
            majorPairs: ["EUR/USD", "GBP/USD", "EUR/GBP"],
            tradingTips: "Major European market opening. High volatility and volume expected.",
            volume: "Very High",
            spread: "0.5-1 pip"
          }
        },
        {
          time: "10:00-11:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "European Economic Data",
            volatility: "High",
            majorPairs: ["EUR/USD", "GBP/USD", "USD/CHF"],
            tradingTips: "Key economic releases from Europe. Watch for news-driven movements.",
            volume: "Very High",
            spread: "0.5-1 pip"
          }
        },
        {
          time: "11:00-12:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "Mid-European Session",
            volatility: "Medium",
            majorPairs: ["EUR/USD", "GBP/USD", "EUR/JPY"],
            tradingTips: "Stable trading period. Good for trend continuation strategies.",
            volume: "High",
            spread: "1-1.5 pips"
          }
        },
        {
          time: "12:00-13:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "Pre-US Session",
            volatility: "Medium",
            majorPairs: ["EUR/USD", "GBP/USD", "USD/CAD"],
            tradingTips: "Preparing for US market overlap. Position for afternoon volatility.",
            volume: "High",
            spread: "1-1.5 pips"
          }
        }
      ],
      headerGradient: "bg-gradient-to-r from-emerald-600 to-green-600",
      cardGradient: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10",
      accentColor: "border-emerald-200 dark:border-emerald-700",
      icon: <TrendingUp className="h-5 w-5" />,
      isActive: true
    },
    {
      id: 3,
      name: "US Session",
      region: "New York • Chicago",
      timeSlots: [
        {
          time: "13:00-14:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "US Pre-Market",
            volatility: "Medium",
            majorPairs: ["EUR/USD", "GBP/USD", "USD/JPY"],
            tradingTips: "European-US overlap begins. Watch for increased volatility.",
            volume: "High",
            spread: "1-2 pips"
          }
        },
        {
          time: "14:00-15:00",
          status: "No",
          expanded: false,
          details: {
            marketActivity: "US Market Opening",
            volatility: "Very High",
            majorPairs: ["EUR/USD", "GBP/USD", "USD/CAD"],
            tradingTips: "Highest volatility period. Major news releases and market movements.",
            volume: "Maximum",
            spread: "0.5-1 pip"
          }
        },
        {
          time: "15:00-16:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "US Economic Data",
            volatility: "High",
            majorPairs: ["USD/JPY", "EUR/USD", "USD/CHF"],
            tradingTips: "Key US economic indicators. Perfect for news trading strategies.",
            volume: "Very High",
            spread: "0.5-1 pip"
          }
        },
        {
          time: "16:00-17:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "US Session Peak",
            volatility: "High",
            majorPairs: ["EUR/USD", "GBP/USD", "USD/JPY"],
            tradingTips: "Peak trading hours. Excellent for scalping and day trading.",
            volume: "Very High",
            spread: "0.5-1 pip"
          }
        }
      ],
      headerGradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
      cardGradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10",
      accentColor: "border-blue-200 dark:border-blue-700",
      icon: <Activity className="h-5 w-5" />,
      isActive: true
    },
    {
      id: 4,
      name: "Pacific Session",
      region: "Los Angeles • Vancouver",
      timeSlots: [
        {
          time: "17:00-18:00",
          status: "No",
          expanded: false,
          details: {
            marketActivity: "Late US Session",
            volatility: "Medium",
            majorPairs: ["USD/CAD", "USD/JPY", "EUR/USD"],
            tradingTips: "US session winding down. Good for position adjustments.",
            volume: "Moderate",
            spread: "1.5-2 pips"
          }
        },
        {
          time: "18:00-19:00",
          status: "Yes",
          expanded: false,
          details: {
            marketActivity: "Pacific Opening",
            volatility: "Low",
            majorPairs: ["USD/JPY", "AUD/USD", "NZD/USD"],
            tradingTips: "Pacific markets opening. Lower volatility, good for range trading.",
            volume: "Low",
            spread: "2-3 pips"
          }
        },
        {
          time: "20:00-21:00",
          status: "No",
          expanded: false,
          details: {
            marketActivity: "Evening Quiet Period",
            volatility: "Low",
            majorPairs: ["USD/JPY", "AUD/USD", "EUR/USD"],
            tradingTips: "Quiet trading period. Minimal market movement expected.",
            volume: "Very Low",
            spread: "3-4 pips"
          }
        },
        {
          time: "21:00-22:00",
          status: "No",
          expanded: false,
          details: {
            marketActivity: "Market Close Preparation",
            volatility: "Low",
            majorPairs: ["USD/JPY", "EUR/USD", "GBP/USD"],
            tradingTips: "End of trading day. Focus on position management and planning.",
            volume: "Very Low",
            spread: "3-5 pips"
          }
        }
      ],
      headerGradient: "bg-gradient-to-r from-yellow-600 to-amber-600",
      cardGradient: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10",
      accentColor: "border-yellow-200 dark:border-yellow-700",
      icon: <Clock className="h-5 w-5" />,
      isActive: false
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
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              timeSlots: session.timeSlots.map((slot, index) =>
                index === timeSlotIndex
                  ? { ...slot, status: slot.status === "Yes" ? "No" : "Yes" }
                  : slot
              )
            }
          : session
      )
    );
  };

  // Toggle expansion for a specific time slot
  const toggleTimeSlotExpansion = (sessionId: number, timeSlotIndex: number) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
              ...session,
              timeSlots: session.timeSlots.map((slot, index) =>
                index === timeSlotIndex
                  ? { ...slot, expanded: !slot.expanded }
                  : slot
              )
            }
          : session
      )
    );
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
                    className="rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 overflow-hidden"
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
                            {timeSlot.details.marketActivity}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        {/* Expand/Collapse Button */}
                        <motion.button
                          onClick={() => toggleTimeSlotExpansion(session.id, index)}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {timeSlot.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </motion.button>

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
                    </div>

                    {/* Expandable Body */}
                    {timeSlot.expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/20 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40"
                      >
                        <div className="p-4 space-y-3">
                          {/* Volatility and Volume */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <Zap className={cn(
                                "h-4 w-4",
                                timeSlot.details.volatility === "High" || timeSlot.details.volatility === "Very High"
                                  ? "text-red-500"
                                  : timeSlot.details.volatility === "Medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              )} />
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Volatility</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {timeSlot.details.volatility}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-500" />
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Volume</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {timeSlot.details.volume}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Spread */}
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Typical Spread</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {timeSlot.details.spread}
                              </div>
                            </div>
                          </div>

                          {/* Major Pairs */}
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Major Pairs</div>
                            <div className="flex flex-wrap gap-1">
                              {timeSlot.details.majorPairs.map((pair, pairIndex) => (
                                <span
                                  key={pairIndex}
                                  className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                                >
                                  {pair}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Trading Tips */}
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trading Tips</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                              {timeSlot.details.tradingTips}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
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

export default TradingSessions;
