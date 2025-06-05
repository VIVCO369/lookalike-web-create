import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DailyProfitTargetProps {
  currentProfit: number;
  dailyTarget: number;
  onSetTarget: (target: number) => void;
  readOnly?: boolean; // New prop to make it read-only
}

const DailyProfitTarget = ({ currentProfit, dailyTarget, onSetTarget, readOnly = false }: DailyProfitTargetProps) => {
  const [isSettingTarget, setIsSettingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSetTarget = () => {
    const target = parseFloat(newTarget);
    if (!isNaN(target) && target > 0) {
      onSetTarget(target);
      setIsSettingTarget(false);
      setNewTarget("");
    }
  };

  const progressPercentage = dailyTarget > 0 ? Math.min((currentProfit / dailyTarget) * 100, 100) : 0;
  const remainingAmount = Math.max(dailyTarget - currentProfit, 0);
  const isGoalAchieved = currentProfit >= dailyTarget && dailyTarget > 0;
  const isHalfway = progressPercentage >= 50 && !isGoalAchieved;

  const getStatusIcon = () => {
    if (isGoalAchieved) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (isHalfway) {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    if (isGoalAchieved) {
      return "Goal Achieved! 🎉";
    } else if (isHalfway) {
      return "Halfway There!";
    } else {
      return "Keep Trading!";
    }
  };

  const getStatusColor = () => {
    if (isGoalAchieved) {
      return "text-green-500";
    } else if (isHalfway) {
      return "text-yellow-500";
    } else {
      return "text-blue-500";
    }
  };

  if (dailyTarget <= 0) {
    // No Goal State
    return (
      <motion.div
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 shadow-sm hover:shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {readOnly ? "No Daily Profit Target Set" : "Set Your Daily Profit Target"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {readOnly ? "Set your daily target in Trade Goals to track progress" : "Track your progress and stay motivated"}
          </p>

          {readOnly ? (
            <Button
              onClick={() => window.location.href = '/trade-goals'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Go to Trade Goals
            </Button>
          ) : isSettingTarget ? (
            <div className="flex gap-3 items-center">
              <Input
                type="number"
                placeholder="Enter target amount"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 dark:focus:border-green-400"
              />
              <Button
                onClick={handleSetTarget}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Set
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSettingTarget(false)}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsSettingTarget(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Set Daily Goal
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 shadow-sm hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Daily Profit Target
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Today's trading goal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(dailyTarget)}
            </div>
            {readOnly ? (
              <button
                onClick={() => window.location.href = '/trade-goals'}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Edit in Trade Goals
              </button>
            ) : isSettingTarget ? (
              <div className="flex gap-2 items-center mt-2">
                <Input
                  type="number"
                  placeholder="New target"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-24 h-8 text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 dark:focus:border-green-400"
                />
                <Button
                  size="sm"
                  onClick={handleSetTarget}
                  className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
                >
                  Set
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsSettingTarget(false)}
                  className="h-8 px-3 text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsSettingTarget(true)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Edit Target
              </button>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(currentProfit)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 mx-2">of</span>
              <span className="text-gray-700 dark:text-gray-300">
                {formatCurrency(dailyTarget)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {progressPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatCurrency(remainingAmount)} remaining
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            {progressPercentage > 0 && (
              <div
                className="absolute -top-0.5 -bottom-0.5 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                style={{
                  width: `${progressPercentage}%`
                }}
              />
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={cn("text-sm font-medium", getStatusColor())}>
                {getStatusText()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {formatTime(currentTime)} - 23:59
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Time remaining today
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyProfitTarget;
