import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
// Removed date-fns imports

// Define the trade data structure
export interface TradeFormData {
  id?: number;
  strategy: string;
  pair: string;
  type: string;
  openTime: string;
  tradeTime: string;
  timeframe: string;
  trend: string;
  lotSize: string;
  winLoss: string;
  netProfit: string;
  balance: string;
  candles: string;
}

interface CalculatedStats {
  netProfit: number;
  dailyProfit: number; // Profit for the current day
  bestTrade: number;
  worstTrade: number;
  winRate: string;
  totalTrades: number; // Added totalTrades to stats
  wins: number; // Added wins count
  losses: number; // Added losses count
  dailyProfitsByDate: { [date: string]: number }; // New: Profit for each day
  bestDayProfit: number; // New: The highest daily profit
  profitableDaysCount: number; // New: Count of days with positive profit
}

interface TradeDataContextType {
  dashboardRealTrades: TradeFormData[]; // Separate state for Dashboard Real Trades
  setDashboardRealTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  analyticsRealTrades: TradeFormData[]; // Separate state for Analytics Real Trades
  setAnalyticsRealTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  demoTrades: TradeFormData[]; // Keep for backward compatibility if needed
  setDemoTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  backtestingTrades: TradeFormData[]; // New state for Backtesting page
  setBacktestingTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  dailyTrades: TradeFormData[]; // New state for Daily Trades page
  setDailyTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  tradeToolsTrades: TradeFormData[]; // New state for Trade Tools trades
  setTradeToolsTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void; // Setter for Trade Tools trades
  dailyTarget: number;
  setDailyTarget: (target: number | ((prevTarget: number) => number)) => void;
  addTrade: (trade: TradeFormData, accountType: 'real' | 'demo' | 'backtesting' | 'daily-trades' | 'trade-tools') => void;
  updateTrade: (id: number, updatedTrade: TradeFormData, accountType: 'real' | 'demo' | 'backtesting' | 'daily-trades' | 'trade-tools') => void; // Add updateTrade function
  deleteTrade: (id: number, accountType: 'real' | 'demo' | 'backtesting' | 'daily-trades' | 'trade-tools') => void; // Add deleteTrade function
  clearDemoTrades: () => void;
  clearBacktestingTrades: () => void; // Function to clear Backtesting trades
  clearDailyTrades: () => void; // Function to clear Daily Trades
  clearDashboardRealTrades: () => void; // Function to clear Dashboard Real Trades
  clearAnalyticsRealTrades: () => void; // Function to clear Analytics Real Trades
  clearTradeToolsTrades: () => void; // Function to clear Trade Tools trades
  // Removed stats from context - calculate in components that need it
  // Removed pagination states from context - handle in components that need it
}

const TradeDataContext = createContext<TradeDataContextType | undefined>(undefined);

export const useTradeData = () => {
  const context = useContext(TradeDataContext);
  if (!context) {
    throw new Error('useTradeData must be used within a TradeDataProvider');
  }
  return context;
};

export const TradeDataProvider = ({ children }: { children: ReactNode }) => {
  // Use separate local storage keys for Dashboard Real, Analytics Real, Demo, Backtesting, Daily Trades, and Trade Tools trades
  const [dashboardRealTrades, setDashboardRealTrades] = useLocalStorage<TradeFormData[]>('dashboardRealTrades', []);
  const [analyticsRealTrades, setAnalyticsRealTrades] = useLocalStorage<TradeFormData[]>('analyticsRealTrades', []);
  const [demoTrades, setDemoTrades] = useLocalStorage<TradeFormData[]>('demoTrades', []); // Keep for backward compatibility
  const [backtestingTrades, setBacktestingTrades] = useLocalStorage<TradeFormData[]>('backtestingTrades', []); // New for Backtesting page
  const [dailyTrades, setDailyTrades] = useLocalStorage<TradeFormData[]>('dailyTrades', []); // New for Daily Trades page
  const [tradeToolsTrades, setTradeToolsTrades] = useLocalStorage<TradeFormData[]>('tradeToolsTrades', []); // New local storage key
  const [dailyTarget, setDailyTarget] = useLocalStorage<number>('dailyTarget', 0.00);

  const addTrade = (trade: TradeFormData, accountType: 'real' | 'demo' | 'backtesting' | 'daily-trades' | 'trade-tools') => {
    let targetTrades: TradeFormData[];
    let setTargetTrades: React.Dispatch<React.SetStateAction<TradeFormData[]>>;

    if (accountType === 'real') {
      targetTrades = dashboardRealTrades;
      setTargetTrades = setDashboardRealTrades;
    } else if (accountType === 'demo') {
      targetTrades = demoTrades;
      setTargetTrades = setDemoTrades;
    } else if (accountType === 'backtesting') {
      targetTrades = backtestingTrades;
      setTargetTrades = setBacktestingTrades;
    } else if (accountType === 'daily-trades') {
      targetTrades = dailyTrades;
      setTargetTrades = setDailyTrades;
    } else if (accountType === 'trade-tools') { // Handle 'trade-tools' account type
      targetTrades = tradeToolsTrades;
      setTargetTrades = setTradeToolsTrades;
    } else {
      console.error("Unknown account type:", accountType);
      return;
    }

    const newTrade = {
      ...trade,
      // Generate ID based on the specific trade list
      id: targetTrades.length > 0 ? Math.max(...targetTrades.map(t => t.id || 0)) + 1 : 1
    };

    setTargetTrades([...targetTrades, newTrade]);

    // Note: Trades added to 'real' or 'trade-tools' are NOT automatically added to analyticsRealTrades.
    // A separate mechanism would be needed if you want them synced.
  };

  // Function to update a trade
  const updateTrade = (id: number, updatedTrade: TradeFormData, accountType: 'real' | 'demo' | 'backtesting' | 'daily-trades' | 'trade-tools') => {
    let targetTrades: TradeFormData[];
    let setTargetTrades: React.Dispatch<React.SetStateAction<TradeFormData[]>>;

    if (accountType === 'real') {
      targetTrades = dashboardRealTrades;
      setTargetTrades = setDashboardRealTrades;
    } else if (accountType === 'demo') {
      targetTrades = demoTrades;
      setTargetTrades = setDemoTrades;
    } else if (accountType === 'backtesting') {
      targetTrades = backtestingTrades;
      setTargetTrades = setBacktestingTrades;
    } else if (accountType === 'daily-trades') {
      targetTrades = dailyTrades;
      setTargetTrades = setDailyTrades;
    } else if (accountType === 'trade-tools') {
      targetTrades = tradeToolsTrades;
      setTargetTrades = setTradeToolsTrades;
    } else {
      console.error("Unknown account type:", accountType);
      return;
    }

    setTargetTrades(targetTrades.map(trade =>
      trade.id === id ? { ...trade, ...updatedTrade } : trade
    ));
  };

  // Function to delete a trade
  const deleteTrade = (id: number, accountType: 'real' | 'demo' | 'backtesting' | 'daily-trades' | 'trade-tools') => {
    let targetTrades: TradeFormData[];
    let setTargetTrades: React.Dispatch<React.SetStateAction<TradeFormData[]>>;

    if (accountType === 'real') {
      targetTrades = dashboardRealTrades;
      setTargetTrades = setDashboardRealTrades;
    } else if (accountType === 'demo') {
      targetTrades = demoTrades;
      setTargetTrades = setDemoTrades;
    } else if (accountType === 'backtesting') {
      targetTrades = backtestingTrades;
      setTargetTrades = setBacktestingTrades;
    } else if (accountType === 'daily-trades') {
      targetTrades = dailyTrades;
      setTargetTrades = setDailyTrades;
    } else if (accountType === 'trade-tools') {
      targetTrades = tradeToolsTrades;
      setTargetTrades = setTradeToolsTrades;
    } else {
      console.error("Unknown account type:", accountType);
      return;
    }

    setTargetTrades(targetTrades.filter(trade => trade.id !== id));
  };


  // Function to clear demo trades
  const clearDemoTrades = () => {
    setDemoTrades([]);
  };

  // Function to clear Dashboard Real Trades
  const clearDashboardRealTrades = () => {
    setDashboardRealTrades([]);
  };

  // Function to clear Analytics Real Trades
  const clearAnalyticsRealTrades = () => {
    setAnalyticsRealTrades([]);
  };

  // Function to clear Trade Tools trades
  const clearTradeToolsTrades = () => {
    setTradeToolsTrades([]);
  };

  // Function to clear Backtesting trades
  const clearBacktestingTrades = () => {
    setBacktestingTrades([]);
  };

  // Function to clear Daily Trades
  const clearDailyTrades = () => {
    setDailyTrades([]);
  };


  return (
    <TradeDataContext.Provider value={{
      dashboardRealTrades,
      setDashboardRealTrades,
      analyticsRealTrades,
      setAnalyticsRealTrades,
      demoTrades,
      setDemoTrades,
      backtestingTrades, // Provide Backtesting trades
      setBacktestingTrades, // Provide setter for Backtesting trades
      dailyTrades, // Provide Daily Trades
      setDailyTrades, // Provide setter for Daily Trades
      tradeToolsTrades, // Provide Trade Tools trades
      setTradeToolsTrades, // Provide setter for Trade Tools trades
      dailyTarget,
      setDailyTarget,
      addTrade,
      updateTrade, // Provide updateTrade
      deleteTrade, // Provide deleteTrade
      clearDemoTrades,
      clearBacktestingTrades, // Provide the clear function for Backtesting
      clearDailyTrades, // Provide the clear function for Daily Trades
      clearDashboardRealTrades, // Provide the clear function for Dashboard Real
      clearAnalyticsRealTrades, // Provide the clear function for Analytics Real
      clearTradeToolsTrades, // Provide the clear function for Trade Tools
      // Removed stats and pagination from context value
    }}>
      {children}
    </TradeDataContext.Provider>
  );
};

// Helper function to calculate stats for a given list of trades
export const calculateStats = (trades: TradeFormData[]): CalculatedStats => {
  let totalProfit = 0;
  let dailyProfit = 0; // Profit for the current day
  let bestTrade = 0;
  let worstTrade = 0;
  let wins = 0;
  let losses = 0;
  const dailyProfitsByDate: { [date: string]: number } = {}; // Store profit for each day

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today's date to midnight

  if (trades.length > 0) {
    trades.forEach(trade => {
      const profit = parseFloat(trade.netProfit || '0');

      totalProfit += profit;

      if (profit > bestTrade) {
        bestTrade = profit;
      }

      if (profit < worstTrade) {
        worstTrade = profit;
      }

      if (trade.winLoss === 'win') {
        wins++;
      } else if (trade.winLoss === 'loss') {
        losses++;
      }

      // Calculate daily profit for each day
      const tradeDate = new Date(trade.openTime);
      if (!isNaN(tradeDate.getTime())) {
        const dateKey = tradeDate.toISOString().split('T')[0]; // Use YYYY-MM-DD as key
        dailyProfitsByDate[dateKey] = (dailyProfitsByDate[dateKey] || 0) + profit;

        // Also calculate profit for the current day
        tradeDate.setHours(0, 0, 0, 0); // Set trade date to midnight for comparison
        if (tradeDate.getTime() === today.getTime()) {
          dailyProfit += profit;
        }
      } else {
        console.warn(`Trade ID: ${trade.id} has an invalid openTime: "${trade.openTime}". Skipping daily profit calculation for this trade.`);
      }
    });
  }

  const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(0) : '0';

  // Calculate best day profit and profitable days count
  let bestDayProfit = 0;
  let profitableDaysCount = 0;
  Object.values(dailyProfitsByDate).forEach(profit => {
    if (profit > bestDayProfit) {
      bestDayProfit = profit;
    }
    if (profit > 0) {
      profitableDaysCount++;
    }
  });


  return {
    netProfit: totalProfit,
    dailyProfit,
    bestTrade,
    worstTrade,
    winRate: `${winRate}%`,
    totalTrades: trades.length,
    wins,
    losses,
    dailyProfitsByDate, // Include daily profits by date
    bestDayProfit, // Include best day profit
    profitableDaysCount, // Include profitable days count
  };
};
