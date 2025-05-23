
import React, { createContext, useContext, ReactNode } from 'react';
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

interface TradeDataContextType {
  trades: TradeFormData[];
  setTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  dailyTarget: number;
  setDailyTarget: (target: number | ((prevTarget: number) => number)) => void;
  addTrade: (trade: TradeFormData) => void;
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
  const [trades, setTrades] = useLocalStorage<TradeFormData[]>('tradingDetailTrades', []);
  const [dailyTarget, setDailyTarget] = useLocalStorage<number>('dailyTarget', 0.00);

  const addTrade = (trade: TradeFormData) => {
    const newTrade = {
      ...trade,
      id: trades.length > 0 ? Math.max(...trades.map(t => t.id || 0)) + 1 : 1
    };
    setTrades([...trades, newTrade]);
  };

  return (
    <TradeDataContext.Provider value={{ trades, setTrades, dailyTarget, setDailyTarget, addTrade }}>
      {children}
    </TradeDataContext.Provider>
  );
};
