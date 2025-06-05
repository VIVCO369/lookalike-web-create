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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D1B0E] via-[#1A0F08] to-[#0F0704] border border-[#3D2A1A] hover:border-[#FF5A1F] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF5A1F]/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Blur Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF5A1F]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#FF5A1F]/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative p-8 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-[#FF5A1F]/20 rounded-full mb-4">
            <Target className="h-8 w-8 text-[#FF5A1F]" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            {readOnly ? "No Daily Profit Target Set" : "Set Your Daily Profit Target"}
          </h3>
          <p className="text-gray-400 mb-6">
            {readOnly ? "Set your daily target in Trade Goals to track progress" : "Track your progress and stay motivated"}
          </p>

          {readOnly ? (
            <Button
              onClick={() => window.location.href = '/trade-goals'}
              className="bg-[#FF5A1F] hover:bg-[#FF5A1F]/80 text-white px-6 py-2"
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
                className="bg-black/30 border-[#3D2A1A] text-white placeholder-gray-400 focus:border-[#FF5A1F]"
              />
              <Button
                onClick={handleSetTarget}
                className="bg-[#FF5A1F] hover:bg-[#FF5A1F]/80 text-white"
              >
                Set
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSettingTarget(false)}
                className="border-[#3D2A1A] text-gray-300 hover:bg-[#3D2A1A]/20"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsSettingTarget(true)}
              className="bg-[#FF5A1F] hover:bg-[#FF5A1F]/80 text-white px-6 py-2"
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
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D1B0E] via-[#1A0F08] to-[#0F0704] border border-[#3D2A1A] hover:border-[#FF5A1F] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF5A1F]/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Blur Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF5A1F]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#FF5A1F]/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FF5A1F]/20 rounded-full">
              <Target className="h-6 w-6 text-[#FF5A1F]" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Daily Profit Target
              </h3>
              <p className="text-gray-400 text-sm">Today's trading goal</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#FF5A1F]">
              {formatCurrency(dailyTarget)}
            </div>
            {readOnly ? (
              <button
                onClick={() => window.location.href = '/trade-goals'}
                className="text-xs text-gray-400 hover:text-[#FF5A1F] transition-colors"
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
                  className="w-24 h-8 text-xs bg-black/30 border-[#3D2A1A] text-white placeholder-gray-400 focus:border-[#FF5A1F]"
                />
                <Button
                  size="sm"
                  onClick={handleSetTarget}
                  className="h-8 px-3 text-xs bg-[#FF5A1F] hover:bg-[#FF5A1F]/80 text-white"
                >
                  Set
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsSettingTarget(false)}
                  className="h-8 px-3 text-xs border-[#3D2A1A] text-gray-300 hover:bg-[#3D2A1A]/20"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsSettingTarget(true)}
                className="text-xs text-gray-400 hover:text-[#FF5A1F] transition-colors"
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
              <span className="text-white font-medium">
                {formatCurrency(currentProfit)}
              </span>
              <span className="text-gray-400 mx-2">of</span>
              <span className="text-gray-300">
                {formatCurrency(dailyTarget)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#FF5A1F]">
                {progressPercentage.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">
                {formatCurrency(remainingAmount)} remaining
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-black/30 rounded-full h-3 border border-[#3D2A1A]/50">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FF7A3F] rounded-full relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            {progressPercentage > 0 && (
              <motion.div
                className="absolute -top-1 -bottom-1 rounded-full shadow-lg shadow-[#FF5A1F]/50"
                style={{ width: `${progressPercentage}%` }}
                animate={{ 
                  boxShadow: [
                    "0 0 10px rgba(255, 90, 31, 0.5)",
                    "0 0 20px rgba(255, 90, 31, 0.8)",
                    "0 0 10px rgba(255, 90, 31, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
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
              <div className="text-xs text-gray-400 font-mono">
                {formatTime(currentTime)} - 23:59
              </div>
              <div className="text-xs text-gray-500">
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
