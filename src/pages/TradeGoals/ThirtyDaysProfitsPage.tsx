
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { DollarSign } from "lucide-react";
import AnimatedContainer from "@/components/AnimatedContainer";

const ThirtyDaysProfitsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample data that matches the Excel structure
  const challengeData = [
    { day: 1, balance: 100.00, perDay: "15%", session1: 0.30, session2: 0.30, session3: 0.30, session4: 0.30, session5: 0.30, tfProfit: 1.50, withdraw: 0, stAmount: 1.50, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "15%" },
    { day: 2, balance: 11.50, perDay: "15%", session1: 0.35, session2: 0.35, session3: 0.35, session4: 0.35, session5: 0.35, tfProfit: 1.73, withdraw: 0, stAmount: 1.73, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "15%" },
    { day: 3, balance: 13.23, perDay: "15%", session1: 0.40, session2: 0.40, session3: 0.40, session4: 0.40, session5: 0.40, tfProfit: 1.98, withdraw: 0, stAmount: 1.98, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "" },
    { day: 4, balance: 15.21, perDay: "15%", session1: 0.46, session2: 0.46, session3: 0.46, session4: 0.46, session5: 0.46, tfProfit: 2.28, withdraw: 0, stAmount: 2.28, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "" },
    { day: 5, balance: 17.49, perDay: "15%", session1: 0.52, session2: 0.52, session3: 0.52, session4: 0.52, session5: 0.52, tfProfit: 2.62, withdraw: 2.00, stAmount: 2.62, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "" },
    { day: 6, balance: 18.11, perDay: "15%", session1: 0.54, session2: 0.54, session3: 0.54, session4: 0.54, session5: 0.54, tfProfit: 2.72, withdraw: 0, stAmount: 2.72, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 7, balance: 20.83, perDay: "15%", session1: 0.62, session2: 0.62, session3: 0.62, session4: 0.62, session5: 0.62, tfProfit: 3.12, withdraw: 0, stAmount: 3.12, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 8, balance: 23.96, perDay: "15%", session1: 0.72, session2: 0.72, session3: 0.72, session4: 0.72, session5: 0.72, tfProfit: 3.59, withdraw: 0, stAmount: 3.59, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 9, balance: 27.55, perDay: "15%", session1: 0.83, session2: 0.83, session3: 0.83, session4: 0.83, session5: 0.83, tfProfit: 4.13, withdraw: 0, stAmount: 4.13, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 10, balance: 31.68, perDay: "15%", session1: 0.95, session2: 0.95, session3: 0.95, session4: 0.95, session5: 0.95, tfProfit: 4.75, withdraw: 0, stAmount: 4.75, extraStake: 0.40, reached: "Yes", superTrade: "", profit: "" },
    { day: 11, balance: 36.43, perDay: "15%", session1: 1.09, session2: 1.09, session3: 1.09, session4: 1.09, session5: 1.09, tfProfit: 5.46, withdraw: 0, stAmount: 5.46, extraStake: 0.40, reached: "No", superTrade: "", profit: "" },
    { day: 12, balance: 41.90, perDay: "15%", session1: 1.26, session2: 1.26, session3: 1.26, session4: 1.26, session5: 1.26, tfProfit: 6.28, withdraw: 6.00, stAmount: 6.28, extraStake: 0.40, reached: "No", superTrade: "", profit: "" },
    { day: 13, balance: 48.18, perDay: "15%", session1: 1.45, session2: 1.45, session3: 1.45, session4: 1.45, session5: 1.45, tfProfit: 7.23, withdraw: 0, stAmount: 7.23, extraStake: 0.40, reached: "No", superTrade: "", profit: "" },
    { day: 14, balance: 55.41, perDay: "15%", session1: 1.66, session2: 1.66, session3: 1.66, session4: 1.66, session5: 1.66, tfProfit: 8.31, withdraw: 0, stAmount: 8.31, extraStake: 0, reached: "Yes", superTrade: "", profit: "" },
    { day: 15, balance: 63.72, perDay: "15%", session1: 1.91, session2: 1.91, session3: 1.91, session4: 1.91, session5: 1.91, tfProfit: 9.56, withdraw: 0, stAmount: 9.56, extraStake: 0.40, reached: "", superTrade: "", profit: "" },
    { day: 16, balance: 73.28, perDay: "15%", session1: 2.20, session2: 2.20, session3: 2.20, session4: 2.20, session5: 2.20, tfProfit: 10.99, withdraw: 0, stAmount: 10.99, extraStake: 0.40, reached: "", superTrade: "", profit: "" },
    { day: 17, balance: 84.27, perDay: "15%", session1: 2.53, session2: 2.53, session3: 2.53, session4: 2.53, session5: 2.53, tfProfit: 12.64, withdraw: 20.00, stAmount: 12.64, extraStake: 0.40, reached: "", superTrade: "", profit: "" },
    { day: 18, balance: 76.91, perDay: "15%", session1: 2.31, session2: 2.31, session3: 2.31, session4: 2.31, session5: 2.31, tfProfit: 11.54, withdraw: 0, stAmount: 11.54, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 19, balance: 88.45, perDay: "15%", session1: 2.65, session2: 2.65, session3: 2.65, session4: 2.65, session5: 2.65, tfProfit: 13.27, withdraw: 0, stAmount: 13.27, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 20, balance: 101.72, perDay: "15%", session1: 3.05, session2: 3.05, session3: 3.05, session4: 3.05, session5: 3.05, tfProfit: 15.26, withdraw: 0, stAmount: 15.26, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 21, balance: 116.97, perDay: "15%", session1: 3.51, session2: 3.51, session3: 3.51, session4: 3.51, session5: 3.51, tfProfit: 17.55, withdraw: 0, stAmount: 17.55, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 22, balance: 134.52, perDay: "15%", session1: 4.04, session2: 4.04, session3: 4.04, session4: 4.04, session5: 4.04, tfProfit: 20.18, withdraw: 25.00, stAmount: 20.18, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 23, balance: 129.70, perDay: "15%", session1: 3.89, session2: 3.89, session3: 3.89, session4: 3.89, session5: 3.89, tfProfit: 19.45, withdraw: 0, stAmount: 19.45, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 24, balance: 149.15, perDay: "15%", session1: 4.47, session2: 4.47, session3: 4.47, session4: 4.47, session5: 4.47, tfProfit: 22.37, withdraw: 0, stAmount: 22.37, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 25, balance: 171.53, perDay: "15%", session1: 5.15, session2: 5.15, session3: 5.15, session4: 5.15, session5: 5.15, tfProfit: 25.73, withdraw: 0, stAmount: 25.73, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 26, balance: 197.25, perDay: "15%", session1: 5.92, session2: 5.92, session3: 5.92, session4: 5.92, session5: 5.92, tfProfit: 29.59, withdraw: 0, stAmount: 29.59, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 27, balance: 226.84, perDay: "15%", session1: 6.81, session2: 6.81, session3: 6.81, session4: 6.81, session5: 6.81, tfProfit: 34.03, withdraw: 30.00, stAmount: 34.03, extraStake: 3.00, reached: "", superTrade: "", profit: "" },
    { day: 28, balance: 230.87, perDay: "15%", session1: 6.93, session2: 6.93, session3: 6.93, session4: 6.93, session5: 6.93, tfProfit: 34.63, withdraw: 0, stAmount: 34.63, extraStake: 3.00, reached: "", superTrade: "", profit: "" },
    { day: 29, balance: 265.50, perDay: "15%", session1: 7.96, session2: 7.96, session3: 7.96, session4: 7.96, session5: 7.96, tfProfit: 39.82, withdraw: 0, stAmount: 39.82, extraStake: 3.00, reached: "", superTrade: "", profit: "" },
    { day: 30, balance: 305.32, perDay: "15%", session1: 9.16, session2: 9.16, session3: 9.16, session4: 9.16, session5: 9.16, tfProfit: 45.80, withdraw: 50.00, stAmount: 45.80, extraStake: 3.00, reached: "", superTrade: "", profit: "" }
  ];

  const sessionsData = [
    { session: "Session 1", time: "4:00 - 5:00", status: "Yes", balance: "$10", withdrawal: "100%" },
    { session: "Session 2", time: "5:00 - 6:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 3", time: "6:00 - 7:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 4", time: "7:00 - 8:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 5", time: "9:00 - 10:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 6", time: "10:00 - 11:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 7", time: "11:00 - 12:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 8", time: "12:00 - 13:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 9", time: "13:00 - 14:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 10", time: "14:00 - 15:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 11", time: "15:00 - 16:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 12", time: "16:00 - 17:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 13", time: "17:00 - 18:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 14", time: "18:00 - 19:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 15", time: "20:00 - 21:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 16", time: "21:00 - 22:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 17", time: "22:00 - 23:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 18", time: "23:00 - 24:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "News Filter", time: "", status: "Yes", balance: "", withdrawal: "" }
  ];

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">META CASH 30 DAYS CASH CHALLENGE</h1>
              <p className="text-gray-600">MONEY MANAGEMENT - Track your 30-day cash challenge progress.</p>
            </div>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-black text-white text-center py-3">
                <h2 className="text-xl font-bold">META CASH 30 DAYS CASH CHALLENGE</h2>
              </div>
              <div className="bg-red-600 text-white text-center py-2">
                <h3 className="text-lg font-bold">MONEY MANAGEMENT</h3>
              </div>

              <div className="flex">
                {/* Main Table */}
                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-red-600 text-white">
                          <th className="border border-gray-400 px-2 py-1">DAYS</th>
                          <th className="border border-gray-400 px-2 py-1">BALANCE % PER DAY</th>
                          <th className="border border-gray-400 px-2 py-1">SESSION 1</th>
                          <th className="border border-gray-400 px-2 py-1">SESSION 2</th>
                          <th className="border border-gray-400 px-2 py-1">SESSION 3</th>
                          <th className="border border-gray-400 px-2 py-1">SESSION 4</th>
                          <th className="border border-gray-400 px-2 py-1">SESSION 5</th>
                          <th className="border border-gray-400 px-2 py-1">T/PROFIT</th>
                          <th className="border border-gray-400 px-2 py-1">WITHDRAW</th>
                          <th className="border border-gray-400 px-2 py-1">ST/AMOUNT</th>
                          <th className="border border-gray-400 px-2 py-1">Extra Stake</th>
                          <th className="border border-gray-400 px-2 py-1">REACHED</th>
                          <th className="border border-gray-400 px-2 py-1">%PER TRADE</th>
                          <th className="border border-gray-400 px-2 py-1">PROFIT %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {challengeData.map((row, index) => (
                          <tr 
                            key={index} 
                            className={`${
                              index % 2 === 0 ? 'bg-red-100' : 'bg-red-50'
                            } ${row.reached === 'No' ? 'bg-red-200' : ''}`}
                          >
                            <td className="border border-gray-400 px-2 py-1 text-center font-bold">{row.day}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.balance.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">{row.perDay}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.session1.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.session2.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.session3.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.session4.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.session5.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.tfProfit.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">
                              {row.withdraw > 0 ? `$${row.withdraw.toFixed(2)}` : ''}
                            </td>
                            <td className="border border-gray-400 px-2 py-1 text-center">${row.stAmount.toFixed(2)}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center">
                              {row.extraStake > 0 ? `$${row.extraStake.toFixed(2)}` : ''}
                            </td>
                            <td className={`border border-gray-400 px-2 py-1 text-center font-bold ${
                              row.reached === 'Yes' ? 'text-green-600' : row.reached === 'No' ? 'text-red-600' : ''
                            }`}>
                              {row.reached}
                            </td>
                            <td className="border border-gray-400 px-2 py-1 text-center">{row.superTrade}</td>
                            <td className="border border-gray-400 px-2 py-1 text-center font-bold text-blue-600">
                              {row.profit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Summary */}
                  <div className="bg-gray-100 p-4 flex justify-between text-sm font-bold">
                    <div>OPENING BALANCE: $301.12</div>
                    <div>TOTAL PROFIT/WITHDRAW: $300.00 R 5,100.00</div>
                    <div>$ 418.12 $127.00</div>
                  </div>
                </div>

                {/* Side Panel */}
                <div className="w-64 border-l">
                  {/* ST/BALANCE Section */}
                  <div className="bg-red-600 text-white text-center py-2">
                    <div className="text-lg font-bold">$10</div>
                    <div className="text-sm">ST/BALANCE WITHDRAW%</div>
                    <div className="text-lg font-bold">100%</div>
                  </div>

                  {/* Sessions Table */}
                  <div className="bg-red-500 text-white text-center py-1 text-sm font-bold">
                    Session 1
                  </div>
                  
                  <table className="w-full text-xs">
                    <tbody>
                      {sessionsData.map((session, index) => (
                        <tr key={index} className={`${
                          session.status === 'Yes' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <td className="border border-gray-400 px-2 py-1">{session.session}</td>
                          <td className="border border-gray-400 px-2 py-1 text-center">{session.time}</td>
                          <td className={`border border-gray-400 px-2 py-1 text-center font-bold ${
                            session.status === 'Yes' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {session.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="bg-red-500 text-white text-center py-1 text-sm font-bold">
                    Session 2
                  </div>
                  <div className="bg-red-100 p-2 text-xs">
                    <div>17:00-18:00 No</div>
                    <div>18:00-19:00 No</div>
                    <div>20:00-21:00 No</div>
                    <div>21:00-22:00 No</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default ThirtyDaysProfitsPage;
