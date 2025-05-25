
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const DailyTradesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  const dailyTrades = [
    { time: "09:30", pair: "EUR/USD", type: "BUY", entry: 1.0850, exit: 1.0875, pips: 25, profit: 125, status: "Won" },
    { time: "10:45", pair: "GBP/USD", type: "SELL", entry: 1.2650, exit: 1.2630, pips: 20, profit: 100, status: "Won" },
    { time: "12:15", pair: "USD/JPY", type: "BUY", entry: 150.25, exit: 150.10, pips: -15, profit: -75, status: "Lost" },
    { time: "14:30", pair: "AUD/USD", type: "SELL", entry: 0.6720, exit: 0.6710, pips: 10, profit: 50, status: "Won" },
    { time: "16:00", pair: "EUR/GBP", type: "BUY", entry: 0.8580, exit: 0.8595, pips: 15, profit: 75, status: "Won" },
  ];

  const totalProfit = dailyTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const winningTrades = dailyTrades.filter(trade => trade.status === "Won").length;
  const totalTrades = dailyTrades.length;
  const winRate = ((winningTrades / totalTrades) * 100).toFixed(1);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Daily Trades</h1>
          </div>
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Daily Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Trades</p>
                    <p className="text-2xl font-bold text-gray-900">{totalTrades}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Win Rate</p>
                    <p className="text-2xl font-bold text-green-600">{winRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Daily P&L</p>
                    <p className={cn("text-2xl font-bold", totalProfit >= 0 ? "text-green-600" : "text-red-600")}>
                      ${totalProfit}
                    </p>
                  </div>
                  {totalProfit >= 0 ? 
                    <TrendingUp className="h-8 w-8 text-green-500" /> : 
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  }
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Pips</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {dailyTrades.reduce((sum, trade) => sum + trade.pips, 0)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Trades Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Today's Trades</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pips</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dailyTrades.map((trade, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.pair}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 py-1 text-xs font-semibold rounded-full",
                            trade.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          )}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.entry}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.exit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "font-medium",
                            trade.pips >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {trade.pips > 0 ? '+' : ''}{trade.pips}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "font-medium",
                            trade.profit >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            ${trade.profit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 py-1 text-xs font-semibold rounded-full",
                            trade.status === "Won" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          )}>
                            {trade.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DailyTradesPage;
