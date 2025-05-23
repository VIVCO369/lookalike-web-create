import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

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
  realTrades: TradeFormData[];
  setRealTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  demoTrades: TradeFormData[];
  setDemoTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  dailyTarget: number;
  setDailyTarget: (target: number | ((prevTarget: number) => number)) => void;
  addTrade: (trade: TradeFormData, accountType: 'real' | 'demo') => void;
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
  // Use separate local storage keys for real and demo trades
  const [realTrades, setRealTrades] = useLocalStorage<TradeFormData[]>('realTrades', []);
  const [demoTrades, setDemoTrades] = useLocalStorage<TradeFormData[]>('demoTrades', []);
  const [dailyTarget, setDailyTarget] = useLocalStorage<number>('dailyTarget', 0.00);

  const addTrade = (trade: TradeFormData, accountType: 'real' | 'demo') => {
    const newTrade = {
      ...trade,
      // Generate ID based on the specific trade list
      id: accountType === 'real'
        ? (realTrades.length > 0 ? Math.max(...realTrades.map(t => t.id || 0)) + 1 : 1)
        : (demoTrades.length > 0 ? Math.max(...demoTrades.map(t => t.id || 0)) + 1 : 1)
    };

    if (accountType === 'real') {
      setRealTrades([...realTrades, newTrade]);
    } else {
      setDemoTrades([...demoTrades, newTrade]);
    }
  };

  return (
    <TradeDataContext.Provider value={{
      realTrades,
      setRealTrades,
      demoTrades,
      setDemoTrades,
      dailyTarget,
      setDailyTarget,
      addTrade,
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

  if (trades.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

      const tradeDate = new Date(trade.openTime);
      if (tradeDate >= today) {
        dailyProfit += profit;
      }
    });
  }

  const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(0) : '0';

  return {
    netProfit: totalProfit,
    dailyProfit,
    bestTrade,
    worstTrade,
    winRate: `${winRate}%`,
    totalTrades: trades.length,
  };
};
