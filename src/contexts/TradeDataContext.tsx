
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
}

interface TradeDataContextType {
  trades: TradeFormData[];
  setTrades: (trades: TradeFormData[] | ((prevTrades: TradeFormData[]) => TradeFormData[])) => void;
  dailyTarget: number;
  setDailyTarget: (target: number | ((prevTarget: number) => number)) => void;
  addTrade: (trade: TradeFormData) => void;
  stats: CalculatedStats;
  // Add pagination related states and functions
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  totalPages: number;
  paginatedTrades: TradeFormData[];
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
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // Calculate total pages
  const totalPages = Math.ceil(trades.length / itemsPerPage);

  // Get paginated trades for current page
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return trades.slice(startIndex, startIndex + itemsPerPage);
  }, [trades, currentPage, itemsPerPage]);

  // Calculate statistics from trades
  const stats = useMemo(() => {
    // Initialize values
    let totalProfit = 0;
    let dailyProfit = 0;
    let bestTrade = 0;
    let worstTrade = 0;
    let wins = 0;

    // Process all trades
    if (trades.length > 0) {
      // Get today's date at midnight for daily calculations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      trades.forEach(trade => {
        const profit = parseFloat(trade.netProfit || '0');
        
        // Update total profit
        totalProfit += profit;
        
        // Update best and worst trades
        if (profit > bestTrade) {
          bestTrade = profit;
        }
        
        if (profit < worstTrade) {
          worstTrade = profit;
        }
        
        // Count wins
        if (trade.winLoss === 'win') {
          wins++;
        }
        
        // Calculate daily profit
        const tradeDate = new Date(trade.openTime);
        if (tradeDate >= today) {
          dailyProfit += profit;
        }
      });
    }
    
    // Calculate win rate
    const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(0) : '0';
    
    return {
      netProfit: totalProfit,
      dailyProfit,
      bestTrade,
      worstTrade,
      winRate: `${winRate}%`
    };
  }, [trades]);

  const addTrade = (trade: TradeFormData) => {
    const newTrade = {
      ...trade,
      id: trades.length > 0 ? Math.max(...trades.map(t => t.id || 0)) + 1 : 1
    };
    setTrades([...trades, newTrade]);
  };

  return (
    <TradeDataContext.Provider value={{ 
      trades, 
      setTrades, 
      dailyTarget, 
      setDailyTarget, 
      addTrade, 
      stats,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      totalPages,
      paginatedTrades
    }}>
      {children}
    </TradeDataContext.Provider>
  );
};
