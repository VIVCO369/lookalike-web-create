
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Trophy, Calendar, TrendingUp } from "lucide-react";

const ThirtyDayTradePage = () => {
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

  // Generate 30 days of trading data
  const thirtyDayData = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const trades = Math.floor(Math.random() * 8) + 2; // 2-10 trades per day
    const winRate = 0.6 + Math.random() * 0.3; // 60-90% win rate
    const wins = Math.floor(trades * winRate);
    const losses = trades - wins;
    const dailyProfit = wins * (50 + Math.random() * 100) - losses * (30 + Math.random() * 70);
    
    return {
      day: index + 1,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      trades,
      wins,
      losses,
      winRate: ((wins / trades) * 100).toFixed(1),
      profit: Math.round(dailyProfit),
      pips: Math.round((wins * 15 - losses * 10) + (Math.random() - 0.5) * 20),
    };
  });

  const totalProfit = thirtyDayData.reduce((sum, day) => sum + day.profit, 0);
  const totalTrades = thirtyDayData.reduce((sum, day) => sum + day.trades, 0);
  const totalWins = thirtyDayData.reduce((sum, day) => sum + day.wins, 0);
  const overallWinRate = ((totalWins / totalTrades) * 100).toFixed(1);
  const totalPips = thirtyDayData.reduce((sum, day) => sum + day.pips, 0);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">30 Day Trade Challenge</h1>
          </div>
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Challenge Overview */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">30 Day Trading Challenge Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{totalTrades}</p>
                  <p className="text-sm opacity-90">Total Trades</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{overallWinRate}%</p>
                  <p className="text-sm opacity-90">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">${totalProfit.toLocaleString()}</p>
                  <p className="text-sm opacity-90">Total Profit</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{totalPips}</p>
                  <p className="text-sm opacity-90">Total Pips</p>
                </div>
              </div>
            </div>

            {/* 30 Day Performance Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">30-Day Performance Breakdown</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trades</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wins</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Losses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pips</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {thirtyDayData.map((day, index) => (
                      <tr key={index} className={cn(
                        "hover:bg-gray-50",
                        day.profit >= 0 ? "" : "bg-red-50"
                      )}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Day {day.day}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.trades}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{day.wins}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{day.losses}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{day.winRate}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "font-medium",
                            day.profit >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            ${day.profit}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "font-medium",
                            day.pips >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {day.pips > 0 ? '+' : ''}{day.pips}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Challenge Milestones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Milestones</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Profitable Days</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {thirtyDayData.filter(day => day.profit > 0).length}/30
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Best Day</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    ${Math.max(...thirtyDayData.map(day => day.profit))}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Days Remaining</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-600">
                    0/30
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ThirtyDayTradePage;
