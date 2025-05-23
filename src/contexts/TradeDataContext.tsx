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
  dailyProfit: number;
  bestTrade: number;
  worstTrade: number;
  winRate: string;
  totalTrades: number; // Added totalTrades to stats
}

interface TradeDataContextType {
  dashboardRealTrades: TradeFormData[]; // Separate state for Dashboard Real Trades
  setDashboardRealTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  analyticsRealTrades: TradeFormData[]; // Separate state for Analytics Real Trades
  setAnalyticsRealTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  demoTrades: TradeFormData[];
  setDemoTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  dailyTarget: number;
  setDailyTarget: (target: number | ((prevTarget: number) => number)) => void;
  addTrade: (trade: TradeFormData, accountType: 'real' | 'demo') => void;
  clearDemoTrades: () => void;
  clearDashboardRealTrades: () => void; // Function to clear Dashboard Real Trades
  clearAnalyticsRealTrades: () => void; // Function to clear Analytics Real Trades
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
  // Use separate local storage keys for Dashboard Real, Analytics Real, and Demo trades
  const [dashboardRealTrades, setDashboardRealTrades] = useLocalStorage<TradeFormData[]>('dashboardRealTrades', []);
  const [analyticsRealTrades, setAnalyticsRealTrades] = useLocalStorage<TradeFormData[]>('analyticsRealTrades', []);
  const [demoTrades, setDemoTrades] = useLocalStorage<TradeFormData[]>('demoTrades', []);
  const [dailyTarget, setDailyTarget] = useLocalStorage<number>('dailyTarget', 0.00);

  const addTrade = (trade: TradeFormData, accountType: 'real' | 'demo') => {
    const newTrade = {
      ...trade,
      // Generate ID based on the specific trade list
      id: accountType === 'real'
        ? (dashboardRealTrades.length > 0 ? Math.max(...dashboardRealTrades.map(t => t.id || 0)) + 1 : 1)
        : (demoTrades.length > 0 ? Math.max(...demoTrades.map(t => t.id || 0)) + 1 : 1)
    };

    if (accountType === 'real') {
      // Add real trades only to the dashboard list
      setDashboardRealTrades([...dashboardRealTrades, newTrade]);
      // Note: Trades added here are NOT automatically added to analyticsRealTrades.
      // A separate mechanism would be needed if you want them synced.
    } else {
      setDemoTrades([...demoTrades, newTrade]);
    }
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


  return (
    <TradeDataContext.Provider value={{
      dashboardRealTrades,
      setDashboardRealTrades,
      analyticsRealTrades,
      setAnalyticsRealTrades,
      demoTrades,
      setDemoTrades,
      dailyTarget,
      setDailyTarget,
      addTrade,
      clearDemoTrades,
      clearDashboardRealTrades, // Provide the clear function for Dashboard Real
      clearAnalyticsRealTrades, // Provide the clear function for Analytics Real
      // Removed stats and pagination from context value
    }}>
      {children}
    </TradeDataContext.Provider>
  );
};

// Helper function to calculate stats for a given list of trades
export const calculateStats = (trades: TradeFormData[]): CalculatedStats => {
  let totalProfit = 0;
  let dailyProfit = 0;
  let bestTrade = 0;
  let worstTrade = 0;
  let wins = 0;

  console.log("Calculating stats for trades:", trades); // Log the trades array

  if (trades.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's date to midnight
    console.log("Today's date (midnight):", today.toISOString()); // Log today's date

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
      }

      // Attempt to parse the date string
      const tradeDate = new Date(trade.openTime);

      // Check if the parsed date is valid before using it
      if (!isNaN(tradeDate.getTime())) {
        tradeDate.setHours(0, 0, 0, 0); // Set trade date to midnight for comparison

        console.log(`Trade ID: ${trade.id}, Open Time String: "${trade.openTime}", Parsed Trade Date (midnight): ${tradeDate.toISOString()}, Profit: ${profit}`); // Log trade details
        console.log(`Date comparison (tradeDate === today): ${tradeDate.getTime() === today.getTime()}`); // Log comparison result

        if (tradeDate.getTime() === today.getTime()) { // Compare timestamps at midnight
          dailyProfit += profit;
          console.log("Adding to daily profit. Current dailyProfit:", dailyProfit); // Log daily profit update
        }
      } else {
        console.warn(`Trade ID: ${trade.id} has an invalid openTime: "${trade.openTime}". Skipping daily profit calculation for this trade.`);
      }
    });
  }

  const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(0) : '0';

  console.log("Final calculated stats:", {
    netProfit: totalProfit,
    dailyProfit,
    bestTrade,
    worstTrade,
    winRate: `${winRate}%`,
    totalTrades: trades.length,
  }); // Log final stats

  return {
    netProfit: totalProfit,
    dailyProfit,
    bestTrade,
    worstTrade,
    winRate: `${winRate}%`,
    totalTrades: trades.length,
  };
};
