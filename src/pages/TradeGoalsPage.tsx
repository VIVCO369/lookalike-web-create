
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Target, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  // Sample data for the 30-day challenge
  const challengeData = [
    { day: 1, balance: "$10.00", perDay: "15%", s1: 0.30, s2: 0.30, s3: 0.30, s4: 0.30, s5: 0.30, profit: 1.50, withdraw: "", amount: "$1.50", stake: "$0.20", reached: "Yes", trade: "15%", profitPercent: "15%" },
    { day: 2, balance: "$11.50", perDay: "15%", s1: 0.35, s2: 0.35, s3: 0.35, s4: 0.35, s5: 0.35, profit: 1.73, withdraw: "", amount: "$1.73", stake: "$0.20", reached: "Yes", trade: "15%", profitPercent: "15%" },
    { day: 3, balance: "$13.23", perDay: "15%", s1: 0.40, s2: 0.40, s3: 0.40, s4: 0.40, s5: 0.40, profit: 1.98, withdraw: "", amount: "$1.98", stake: "$0.20", reached: "Yes", trade: "", profitPercent: "" },
    { day: 4, balance: "$15.21", perDay: "15%", s1: 0.46, s2: 0.46, s3: 0.46, s4: 0.46, s5: 0.46, profit: 2.28, withdraw: "", amount: "$2.28", stake: "$0.20", reached: "Yes", trade: "", profitPercent: "" },
    { day: 5, balance: "$17.49", perDay: "15%", s1: 0.52, s2: 0.52, s3: 0.52, s4: 0.52, s5: 0.52, profit: 2.62, withdraw: "$2.00", amount: "$2.62", stake: "$0.20", reached: "Yes", trade: "", profitPercent: "" },
  ];

  const sessions = [
    { name: "Session 1", time: "4:00-5:00", active: "Yes" },
    { name: "Session 2", time: "5:00-6:00", active: "No" },
    { name: "Session 3", time: "6:00-7:00", active: "No" },
    { name: "Session 4", time: "7:00-8:00", active: "No" },
    { name: "Session 5", time: "9:00-10:00", active: "No" },
    { name: "Session 6", time: "10:00-11:00", active: "No" },
    { name: "Session 7", time: "11:00-12:00", active: "No" },
    { name: "Session 8", time: "12:00-13:00", active: "No" },
    { name: "Session 9", time: "13:00-14:00", active: "Yes" },
    { name: "Session 10", time: "14:00-15:00", active: "No" },
    { name: "Session 11", time: "15:00-16:00", active: "Yes" },
    { name: "Session 12", time: "16:00-17:00", active: "Yes" },
    { name: "Session 13", time: "17:00-18:00", active: "No" },
    { name: "Session 14", time: "18:00-19:00", active: "No" },
    { name: "Session 15", time: "20:00-21:00", active: "No" },
    { name: "Session 16", time: "21:00-22:00", active: "No" },
    { name: "Session 17", time: "22:00-23:00", active: "Yes" },
    { name: "Session 18", time: "23:00-24:00", active: "Yes" },
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Challenge Header */}
            <div className="text-center bg-gray-800 text-white py-4 rounded-lg">
              <h2 className="text-2xl font-bold">META CASH 30 DAYS CASH CHALLENGE</h2>
              <h3 className="text-xl font-semibold text-red-400 mt-2">MONEY MANAGEMENT</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Challenge Table */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-red-600 text-white">
                          <TableRow>
                            <TableHead className="text-white text-center">DAYS</TableHead>
                            <TableHead className="text-white text-center">BALANCE & PER DAY</TableHead>
                            <TableHead className="text-white text-center">SESSION 1</TableHead>
                            <TableHead className="text-white text-center">SESSION 2</TableHead>
                            <TableHead className="text-white text-center">SESSION 3</TableHead>
                            <TableHead className="text-white text-center">SESSION 4</TableHead>
                            <TableHead className="text-white text-center">SESSION 5</TableHead>
                            <TableHead className="text-white text-center">T/PROFIT</TableHead>
                            <TableHead className="text-white text-center">WITHDRAW</TableHead>
                            <TableHead className="text-white text-center">ST/AMOUNT</TableHead>
                            <TableHead className="text-white text-center">Extra Stake</TableHead>
                            <TableHead className="text-white text-center">REACHED</TableHead>
                            <TableHead className="text-white text-center">%PER TRADE</TableHead>
                            <TableHead className="text-white text-center">PROFIT %</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {challengeData.map((row, index) => (
                            <TableRow key={row.day} className={index < 5 ? "bg-red-100" : ""}>
                              <TableCell className="text-center font-medium">{row.day}</TableCell>
                              <TableCell className="text-center">
                                <div>{row.balance}</div>
                                <div className="text-sm text-gray-600">{row.perDay}</div>
                              </TableCell>
                              <TableCell className="text-center">${row.s1.toFixed(2)}</TableCell>
                              <TableCell className="text-center">${row.s2.toFixed(2)}</TableCell>
                              <TableCell className="text-center">${row.s3.toFixed(2)}</TableCell>
                              <TableCell className="text-center">${row.s4.toFixed(2)}</TableCell>
                              <TableCell className="text-center">${row.s5.toFixed(2)}</TableCell>
                              <TableCell className="text-center">${row.profit.toFixed(2)}</TableCell>
                              <TableCell className="text-center">{row.withdraw}</TableCell>
                              <TableCell className="text-center">{row.amount}</TableCell>
                              <TableCell className="text-center">{row.stake}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant={row.reached === "Yes" ? "default" : "destructive"}>
                                  {row.reached}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">{row.trade}</TableCell>
                              <TableCell className="text-center">{row.profitPercent}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card className="bg-green-100">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">OPENING BALANCE</div>
                        <div className="text-xl font-bold">$301.12</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-100">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">TOTAL PROFIT/WITHDRAW</div>
                        <div className="text-xl font-bold">$418.12 | $127.00</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-4">
                {/* Progress Stats */}
                <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold">$10</div>
                    <div className="text-sm">ST/BALANCE</div>
                    <div className="text-2xl font-bold mt-2">100%</div>
                    <div className="text-sm">WITHDRAW%</div>
                  </CardContent>
                </Card>

                {/* Sessions */}
                <Card>
                  <CardHeader className="bg-red-600 text-white py-3">
                    <CardTitle className="text-sm font-bold text-center">SESSIONS</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto">
                      {sessions.map((session, index) => (
                        <div key={index} className={cn(
                          "flex justify-between items-center p-2 text-sm border-b",
                          session.active === "Yes" ? "bg-red-600 text-white" : "bg-gray-100"
                        )}>
                          <span className="font-medium">{session.name}</span>
                          <div className="text-right">
                            <div>{session.time}</div>
                            <div className="text-xs">{session.active}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeGoalsPage;
