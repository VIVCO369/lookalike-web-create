
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AnimatedContainer from "@/components/AnimatedContainer";

const ThirtyDaysTargetPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Data matching the image provided
  const targetData = [
    { week: "Week", days: "Days", amount: "Amount", dailyProfit: "Daily Profit", lotSize: "Lot Size", amountTrade: "Amount Trade", trades: "Trades" },
    { week: "✓", days: 1, amount: 20.00, dailyProfit: "10%", lotSize: 2.00, amountTrade: 0.20, trades: 6 },
    { week: "✓", days: 2, amount: 22.00, dailyProfit: "10%", lotSize: 2.20, amountTrade: 0.20, trades: 6 },
    { week: "✓", days: 3, amount: 24.20, dailyProfit: "10%", lotSize: 2.42, amountTrade: 0.20, trades: 6 },
    { week: "✓", days: 4, amount: 26.62, dailyProfit: "10%", lotSize: 2.66, amountTrade: 0.20, trades: 6 },
    { week: "$9.28", days: 5, amount: 29.28, dailyProfit: "10%", lotSize: 2.93, amountTrade: 0.25, trades: 10 },
    { week: "□", days: 6, amount: 32.21, dailyProfit: "10%", lotSize: 3.22, amountTrade: 0.20, trades: 12 },
    { week: "□", days: 7, amount: 35.43, dailyProfit: "10%", lotSize: 3.54, amountTrade: 0.20, trades: 12 },
    { week: "□", days: 8, amount: 38.97, dailyProfit: "10%", lotSize: 3.90, amountTrade: 0.20, trades: 12 },
    { week: "□", days: 9, amount: 42.87, dailyProfit: "10%", lotSize: 4.29, amountTrade: 0.20, trades: 12 },
    { week: "-$17.88", days: 10, amount: 47.16, dailyProfit: "10%", lotSize: 4.72, amountTrade: 0.35, trades: 12 },
    { week: "□", days: 11, amount: 51.87, dailyProfit: "", lotSize: 5.19, amountTrade: 7, trades: 15 },
    { week: "□", days: 12, amount: 57.06, dailyProfit: "", lotSize: 5.71, amountTrade: 7, trades: 15 },
    { week: "□", days: 13, amount: 62.77, dailyProfit: "", lotSize: 6.28, amountTrade: 7, trades: 15 },
    { week: "□", days: 14, amount: 69.05, dailyProfit: "", lotSize: 6.90, amountTrade: 7, trades: 15 },
    { week: "-$28.79", days: 15, amount: 75.95, dailyProfit: "", lotSize: 7.59, amountTrade: 7, trades: 15 },
    { week: "□", days: 16, amount: 83.54, dailyProfit: "8%", lotSize: 6.68, amountTrade: 9, trades: 20 },
    { week: "□", days: 17, amount: 90.23, dailyProfit: "8%", lotSize: 7.22, amountTrade: 9, trades: 20 },
    { week: "□", days: 18, amount: 97.45, dailyProfit: "8%", lotSize: 7.80, amountTrade: 9, trades: 20 },
    { week: "□", days: 19, amount: 105.24, dailyProfit: "8%", lotSize: 8.42, amountTrade: 9, trades: 20 },
    { week: "-$37.71", days: 20, amount: 113.66, dailyProfit: "8%", lotSize: 9.09, amountTrade: 9, trades: 20 },
    { week: "□", days: 21, amount: 122.75, dailyProfit: "8%", lotSize: 9.82, amountTrade: 10, trades: 30 },
    { week: "□", days: 22, amount: 132.58, dailyProfit: "8%", lotSize: 10.61, amountTrade: 10, trades: 30 },
    { week: "□", days: 23, amount: 143.18, dailyProfit: "8%", lotSize: 11.45, amountTrade: 10, trades: 30 },
    { week: "□", days: 24, amount: 154.64, dailyProfit: "8%", lotSize: 12.37, amountTrade: 10, trades: 30 },
    { week: "-$53.34", days: 25, amount: 167.01, dailyProfit: "8%", lotSize: 13.36, amountTrade: 10, trades: 30 },
    { week: "□", days: 26, amount: 180.37, dailyProfit: "6%", lotSize: 10.82, amountTrade: 12, trades: 5 },
    { week: "□", days: 27, amount: 191.19, dailyProfit: "6%", lotSize: 11.47, amountTrade: 12, trades: 5 },
    { week: "□", days: 28, amount: 202.66, dailyProfit: "6%", lotSize: 12.16, amountTrade: 12, trades: 5 },
    { week: "□", days: 29, amount: 214.82, dailyProfit: "6%", lotSize: 12.89, amountTrade: 12, trades: 5 },
    { week: "-$60.70", days: 30, amount: 227.71, dailyProfit: "6%", lotSize: 13.66, amountTrade: 12, trades: 5 }
  ];

  const getRowClass = (index: number, week: string | number) => {
    if (index === 0) return "bg-green-600 text-white font-bold"; // Header
    if (typeof week === "string" && week.includes("$")) {
      return "bg-green-500 text-white font-bold"; // Weekly totals
    }
    if (typeof week === "string" && week === "✓") {
      return "bg-green-100"; // Completed days
    }
    return "bg-white"; // Regular days
  };

  const getCellClass = (colIndex: number, value: any) => {
    // Highlight specific cells with yellow background
    if (colIndex === 4 && typeof value === "number") {
      return "bg-yellow-300 font-bold";
    }
    if (colIndex === 6 && typeof value === "number") {
      return "bg-yellow-300 font-bold";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6">
          <AnimatedContainer>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">$20 To $100 in 30 Days</h1>
              <p className="text-gray-600">Track your trading target progress from $20 to $100.</p>
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-black text-white text-center py-3">
                <h2 className="text-xl font-bold">$20 To $100 in 30 Days</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {targetData.map((row, index) => (
                      <tr key={index} className={getRowClass(index, row.week)}>
                        <td className={`border border-gray-400 px-3 py-2 text-center ${getCellClass(0, row.week)}`}>
                          {row.week}
                        </td>
                        <td className={`border border-gray-400 px-3 py-2 text-center ${getCellClass(1, row.days)}`}>
                          {row.days}
                        </td>
                        <td className={`border border-gray-400 px-3 py-2 text-center ${getCellClass(2, row.amount)}`}>
                          {typeof row.amount === "number" ? `$${row.amount.toFixed(2)}` : row.amount}
                        </td>
                        <td className={`border border-gray-400 px-3 py-2 text-center ${getCellClass(3, row.dailyProfit)}`}>
                          {row.dailyProfit}
                        </td>
                        <td className={`border border-gray-400 px-3 py-2 text-center ${getCellClass(4, row.lotSize)}`}>
                          {typeof row.lotSize === "number" ? `$${row.lotSize.toFixed(2)}` : row.lotSize}
                        </td>
                        <td className={`border border-gray-400 px-3 py-2 text-center ${getCellClass(5, row.amountTrade)}`}>
                          {typeof row.amountTrade === "number" ? row.amountTrade.toFixed(2) : row.amountTrade}
                        </td>
                        <td className={`border border-gray-400 px-3 py-2 text-center ${getCellClass(6, row.trades)}`}>
                          {row.trades}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default ThirtyDaysTargetPage;
