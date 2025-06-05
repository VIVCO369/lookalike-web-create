import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

interface TradeGoal {
  id: number;
  title: string;
  target: string;
  current: string;
  progress: number;
  deadline: string;
}

export const useTradeGoals = () => {
  const [goals] = useLocalStorage<TradeGoal[]>("tradeGoals", [
    { id: 1, title: "Monthly Profit Target", target: "$5,000", current: "$3,200", progress: 64, deadline: "2024-01-31" },
    { id: 2, title: "Weekly Profit Target", target: "$1,200", current: "$800", progress: 67, deadline: "2024-01-07" },
    { id: 3, title: "Daily Profit Target", target: "$200", current: "$150", progress: 75, deadline: "2024-01-01" },
    { id: 4, title: "Quarterly Profit Target", target: "$15,000", current: "$9,600", progress: 64, deadline: "2024-03-31" },
  ]);

  // Get Daily Profit Target from Trade Goals
  const dailyProfitTarget = useMemo(() => {
    const dailyGoal = goals.find(goal => goal.title === "Daily Profit Target");
    if (!dailyGoal) return 0;
    
    // Parse the target value (remove $ and convert to number)
    const targetValue = parseFloat(dailyGoal.target.replace(/[$,]/g, ''));
    return isNaN(targetValue) ? 0 : targetValue;
  }, [goals]);

  // Get Weekly Profit Target from Trade Goals
  const weeklyProfitTarget = useMemo(() => {
    const weeklyGoal = goals.find(goal => goal.title === "Weekly Profit Target");
    if (!weeklyGoal) return 0;
    
    const targetValue = parseFloat(weeklyGoal.target.replace(/[$,]/g, ''));
    return isNaN(targetValue) ? 0 : targetValue;
  }, [goals]);

  // Get Monthly Profit Target from Trade Goals
  const monthlyProfitTarget = useMemo(() => {
    const monthlyGoal = goals.find(goal => goal.title === "Monthly Profit Target");
    if (!monthlyGoal) return 0;
    
    const targetValue = parseFloat(monthlyGoal.target.replace(/[$,]/g, ''));
    return isNaN(targetValue) ? 0 : targetValue;
  }, [goals]);

  // Get Quarterly Profit Target from Trade Goals
  const quarterlyProfitTarget = useMemo(() => {
    const quarterlyGoal = goals.find(goal => goal.title === "Quarterly Profit Target");
    if (!quarterlyGoal) return 0;
    
    const targetValue = parseFloat(quarterlyGoal.target.replace(/[$,]/g, ''));
    return isNaN(targetValue) ? 0 : targetValue;
  }, [goals]);

  // Get Yearly Profit Target from Trade Goals
  const yearlyProfitTarget = useMemo(() => {
    const yearlyGoal = goals.find(goal => goal.title === "Yearly Profit Target");
    if (!yearlyGoal) return 0;
    
    const targetValue = parseFloat(yearlyGoal.target.replace(/[$,]/g, ''));
    return isNaN(targetValue) ? 0 : targetValue;
  }, [goals]);

  return {
    goals,
    dailyProfitTarget,
    weeklyProfitTarget,
    monthlyProfitTarget,
    quarterlyProfitTarget,
    yearlyProfitTarget
  };
};

export default useTradeGoals;
