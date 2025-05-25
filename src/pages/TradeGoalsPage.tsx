
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

const TradeGoalsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update the current date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Helper function to format the date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Helper function to format the time
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  // Complete 30-day challenge data based on the image
  const challengeData = [
    { day: 1, balance: "$10.00", perDay: "15%", s1: 0.30, s2: 0.30, s3: 0.30, s4: 0.30, s5: 0.30, profit: 1.50, withdraw: "", stAmount: "$1.50", extraStake: "$0.20", reached: "Yes", perTrade: "15%", profitPercent: "15%" },
    { day: 2, balance: "$11.50", perDay: "15%", s1: 0.35, s2: 0.35, s3: 0.35, s4: 0.35, s5: 0.35, profit: 1.73, withdraw: "", stAmount: "$1.73", extraStake: "$0.20", reached: "Yes", perTrade: "15%", profitPercent: "15%" },
    { day: 3, balance: "$13.23", perDay: "15%", s1: 0.40, s2: 0.40, s3: 0.40, s4: 0.40, s5: 0.40, profit: 1.98, withdraw: "", stAmount: "$1.98", extraStake: "$0.20", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 4, balance: "$15.21", perDay: "15%", s1: 0.46, s2: 0.46, s3: 0.46, s4: 0.46, s5: 0.46, profit: 2.28, withdraw: "", stAmount: "$2.28", extraStake: "$0.20", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 5, balance: "$17.49", perDay: "15%", s1: 0.52, s2: 0.52, s3: 0.52, s4: 0.52, s5: 0.52, profit: 2.62, withdraw: "$2.00", stAmount: "$2.62", extraStake: "$0.20", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 6, balance: "$18.11", perDay: "15%", s1: 0.54, s2: 0.54, s3: 0.54, s4: 0.54, s5: 0.54, profit: 2.72, withdraw: "", stAmount: "$2.72", extraStake: "$0.25", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 7, balance: "$20.83", perDay: "15%", s1: 0.62, s2: 0.62, s3: 0.62, s4: 0.62, s5: 0.62, profit: 3.12, withdraw: "", stAmount: "$3.12", extraStake: "$0.25", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 8, balance: "$23.96", perDay: "15%", s1: 0.72, s2: 0.72, s3: 0.72, s4: 0.72, s5: 0.72, profit: 3.59, withdraw: "", stAmount: "$3.59", extraStake: "$0.25", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 9, balance: "$27.55", perDay: "15%", s1: 0.83, s2: 0.83, s3: 0.83, s4: 0.83, s5: 0.83, profit: 4.13, withdraw: "", stAmount: "$4.13", extraStake: "$0.25", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 10, balance: "$31.68", perDay: "15%", s1: 0.95, s2: 0.95, s3: 0.95, s4: 0.95, s5: 0.95, profit: 4.75, withdraw: "", stAmount: "$4.75", extraStake: "$0.40", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 11, balance: "$36.43", perDay: "15%", s1: 1.09, s2: 1.09, s3: 1.09, s4: 1.09, s5: 1.09, profit: 5.46, withdraw: "", stAmount: "$5.46", extraStake: "$0.40", reached: "No", perTrade: "", profitPercent: "" },
    { day: 12, balance: "$41.90", perDay: "15%", s1: 1.26, s2: 1.26, s3: 1.26, s4: 1.26, s5: 1.26, profit: 6.28, withdraw: "$6.00", stAmount: "$6.28", extraStake: "$0.40", reached: "No", perTrade: "", profitPercent: "" },
    { day: 13, balance: "$48.18", perDay: "15%", s1: 1.45, s2: 1.45, s3: 1.45, s4: 1.45, s5: 1.45, profit: 7.23, withdraw: "", stAmount: "$7.23", extraStake: "$0.40", reached: "No", perTrade: "", profitPercent: "" },
    { day: 14, balance: "$55.41", perDay: "15%", s1: 1.66, s2: 1.66, s3: 1.66, s4: 1.66, s5: 1.66, profit: 8.31, withdraw: "", stAmount: "$8.31", extraStake: "$0.40", reached: "Yes", perTrade: "", profitPercent: "" },
    { day: 15, balance: "$63.72", perDay: "15%", s1: 1.91, s2: 1.91, s3: 1.91, s4: 1.91, s5: 1.91, profit: 9.56, withdraw: "", stAmount: "$9.56", extraStake: "$0.40", reached: "", perTrade: "", profitPercent: "" },
    { day: 16, balance: "$73.28", perDay: "15%", s1: 2.20, s2: 2.20, s3: 2.20, s4: 2.20, s5: 2.20, profit: 10.99, withdraw: "", stAmount: "$10.99", extraStake: "$0.40", reached: "", perTrade: "", profitPercent: "" },
    { day: 17, balance: "$84.27", perDay: "15%", s1: 2.53, s2: 2.53, s3: 2.53, s4: 2.53, s5: 2.53, profit: 12.64, withdraw: "$20.00", stAmount: "$12.64", extraStake: "$0.40", reached: "", perTrade: "", profitPercent: "" },
    { day: 18, balance: "$76.91", perDay: "15%", s1: 2.31, s2: 2.31, s3: 2.31, s4: 2.31, s5: 2.31, profit: 11.54, withdraw: "", stAmount: "$11.54", extraStake: "$1.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 19, balance: "$88.45", perDay: "15%", s1: 2.65, s2: 2.65, s3: 2.65, s4: 2.65, s5: 2.65, profit: 13.27, withdraw: "", stAmount: "$13.27", extraStake: "$1.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 20, balance: "$101.72", perDay: "15%", s1: 3.05, s2: 3.05, s3: 3.05, s4: 3.05, s5: 3.05, profit: 15.26, withdraw: "", stAmount: "$15.26", extraStake: "$1.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 21, balance: "$116.97", perDay: "15%", s1: 3.51, s2: 3.51, s3: 3.51, s4: 3.51, s5: 3.51, profit: 17.55, withdraw: "", stAmount: "$17.55", extraStake: "$1.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 22, balance: "$134.52", perDay: "15%", s1: 4.04, s2: 4.04, s3: 4.04, s4: 4.04, s5: 4.04, profit: 20.18, withdraw: "$25.00", stAmount: "$20.18", extraStake: "$2.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 23, balance: "$129.70", perDay: "15%", s1: 3.89, s2: 3.89, s3: 3.89, s4: 3.89, s5: 3.89, profit: 19.45, withdraw: "", stAmount: "$19.45", extraStake: "$2.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 24, balance: "$149.15", perDay: "15%", s1: 4.47, s2: 4.47, s3: 4.47, s4: 4.47, s5: 4.47, profit: 22.37, withdraw: "", stAmount: "$22.37", extraStake: "$2.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 25, balance: "$171.53", perDay: "15%", s1: 5.15, s2: 5.15, s3: 5.15, s4: 5.15, s5: 5.15, profit: 25.73, withdraw: "", stAmount: "$25.73", extraStake: "$2.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 26, balance: "$197.25", perDay: "15%", s1: 5.92, s2: 5.92, s3: 5.92, s4: 5.92, s5: 5.92, profit: 29.59, withdraw: "", stAmount: "$29.59", extraStake: "$2.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 27, balance: "$226.84", perDay: "15%", s1: 6.81, s2: 6.81, s3: 6.81, s4: 6.81, s5: 6.81, profit: 34.03, withdraw: "$30.00", stAmount: "$34.03", extraStake: "$3.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 28, balance: "$230.87", perDay: "15%", s1: 6.93, s2: 6.93, s3: 6.93, s4: 6.93, s5: 6.93, profit: 34.63, withdraw: "", stAmount: "$34.63", extraStake: "$3.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 29, balance: "$265.50", perDay: "15%", s1: 7.96, s2: 7.96, s3: 7.96, s4: 7.96, s5: 7.96, profit: 39.82, withdraw: "", stAmount: "$39.82", extraStake: "$3.00", reached: "", perTrade: "", profitPercent: "" },
    { day: 30, balance: "$305.32", perDay: "15%", s1: 9.16, s2: 9.16, s3: 9.16, s4: 9.16, s5: 9.16, profit: 45.80, withdraw: "$50.00", stAmount: "$45.80", extraStake: "$3.00", reached: "", perTrade: "", profitPercent: "" },
  ];

  const sessions = [
    { name: "Session 1", time: "4:00 - 5:00", active: "Yes" },
    { name: "Session 2", time: "5:00 - 6:00", active: "No" },
    { name: "Session 3", time: "6:00 - 7:00", active: "No" },
    { name: "Session 4", time: "7:00 - 8:00", active: "No" },
    { name: "Session 5", time: "9:00 - 10:00", active: "No" },
    { name: "Session 6", time: "10:00 - 11:00", active: "No" },
    { name: "Session 7", time: "11:00 - 12:00", active: "No" },
    { name: "Session 8", time: "12:00 - 13:00", active: "No" },
    { name: "Session 9", time: "13:00 - 14:00", active: "Yes" },
    { name: "Session 10", time: "14:00 - 15:00", active: "No" },
    { name: "Session 11", time: "15:00 - 16:00", active: "Yes" },
    { name: "Session 12", time: "16:00 - 17:00", active: "Yes" },
    { name: "Session 13", time: "17:00 - 18:00", active: "No" },
    { name: "Session 14", time: "18:00 - 19:00", active: "No" },
    { name: "Session 15", time: "20:00 - 21:00", active: "No" },
    { name: "Session 16", time: "21:00 - 22:00", active: "No" },
    { name: "Session 17", time: "22:00 - 23:00", active: "Yes" },
    { name: "Session 18", time: "23:00 - 24:00", active: "Yes" },
    { name: "News Filter", time: "", active: "Yes" },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trade Goals</h1>
          </div>
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-full mx-auto space-y-6">
            {/* Challenge Header */}
            <div className="text-center bg-gray-800 text-white py-4 rounded-lg">
              <h2 className="text-2xl font-bold">META CASH 30 DAYS CASH CHALLENGE</h2>
              <h3 className="text-xl font-semibold text-red-400 mt-2">MONEY MANAGEMENT</h3>
            </div>

            <div className="flex gap-6">
              {/* Main Challenge Table */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-red-600 text-white">
                        <tr>
                          <th className="p-2 text-center border border-red-700">DAYS</th>
                          <th className="p-2 text-center border border-red-700">BALANCE & PER DAY</th>
                          <th className="p-2 text-center border border-red-700">SESSION 1</th>
                          <th className="p-2 text-center border border-red-700">SESSION 2</th>
                          <th className="p-2 text-center border border-red-700">SESSION 3</th>
                          <th className="p-2 text-center border border-red-700">SESSION 4</th>
                          <th className="p-2 text-center border border-red-700">SESSION 5</th>
                          <th className="p-2 text-center border border-red-700">T/PROFIT</th>
                          <th className="p-2 text-center border border-red-700">WITHDRAW</th>
                          <th className="p-2 text-center border border-red-700">ST/AMOUNT</th>
                          <th className="p-2 text-center border border-red-700">Extra Stake</th>
                          <th className="p-2 text-center border border-red-700">REACHED</th>
                          <th className="p-2 text-center border border-red-700">%PER TRADE</th>
                          <th className="p-2 text-center border border-red-700">PROFIT %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {challengeData.map((row, index) => (
                          <tr key={row.day} className={cn(
                            "border-b",
                            index < 5 ? "bg-red-100" : 
                            index < 12 ? "bg-white" :
                            index < 17 ? "bg-red-50" :
                            index < 22 ? "bg-white" :
                            "bg-red-50"
                          )}>
                            <td className="p-2 text-center font-bold border border-gray-300">{row.day}</td>
                            <td className="p-2 text-center border border-gray-300">
                              <div className="font-semibold">{row.balance}</div>
                              <div className="text-xs text-gray-600">{row.perDay}</div>
                            </td>
                            <td className="p-2 text-center border border-gray-300">${row.s1.toFixed(2)}</td>
                            <td className="p-2 text-center border border-gray-300">${row.s2.toFixed(2)}</td>
                            <td className="p-2 text-center border border-gray-300">${row.s3.toFixed(2)}</td>
                            <td className="p-2 text-center border border-gray-300">${row.s4.toFixed(2)}</td>
                            <td className="p-2 text-center border border-gray-300">${row.s5.toFixed(2)}</td>
                            <td className="p-2 text-center border border-gray-300 font-semibold">${row.profit.toFixed(2)}</td>
                            <td className="p-2 text-center border border-gray-300 text-red-600 font-semibold">{row.withdraw}</td>
                            <td className="p-2 text-center border border-gray-300">{row.stAmount}</td>
                            <td className="p-2 text-center border border-gray-300">{row.extraStake}</td>
                            <td className="p-2 text-center border border-gray-300">
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-bold",
                                row.reached === "Yes" ? "bg-green-100 text-green-800" :
                                row.reached === "No" ? "bg-red-100 text-red-800" :
                                "text-gray-500"
                              )}>
                                {row.reached}
                              </span>
                            </td>
                            <td className="p-2 text-center border border-gray-300 font-semibold text-blue-600">{row.perTrade}</td>
                            <td className="p-2 text-center border border-gray-300 font-semibold text-green-600">{row.profitPercent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Footer */}
                <div className="bg-gray-800 text-white p-4 rounded-b-lg flex justify-between items-center">
                  <div>
                    <span className="font-bold">OPENING BALANCE: </span>
                    <span className="text-green-400 font-bold">$301.12</span>
                  </div>
                  <div>
                    <span className="font-bold">TOTAL PROFIT/WITHDRAW: </span>
                    <span className="text-green-400 font-bold">$418.12 | $127.00</span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-80 space-y-4">
                {/* Progress Stats */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg text-center">
                  <div className="text-4xl font-bold">$10</div>
                  <div className="text-sm mb-4">ST/BALANCE</div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm">WITHDRAW%</div>
                </div>

                {/* Sessions */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-red-600 text-white py-3 px-4">
                    <h3 className="text-sm font-bold text-center">SESSIONS</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {sessions.map((session, index) => (
                      <div key={index} className={cn(
                        "flex justify-between items-center p-3 text-sm border-b border-gray-200",
                        session.active === "Yes" ? "bg-red-600 text-white" : "bg-gray-50"
                      )}>
                        <span className="font-medium">{session.name}</span>
                        <div className="text-right">
                          {session.time && <div className="text-xs">{session.time}</div>}
                          <div className={cn(
                            "text-xs font-bold",
                            session.active === "Yes" ? "text-white" : "text-gray-600"
                          )}>
                            {session.active}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeGoalsPage;
