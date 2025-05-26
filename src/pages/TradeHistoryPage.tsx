import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { History, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TradeHistoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const tradeHistory = [
    {
      id: "TXN001",
      date: "2024-04-15",
      time: "09:30:00",
      asset: "EUR/USD",
      type: "Buy",
      size: "0.1",
      entry: "1.0875",
      exit: "1.0920",
      pnl: "+$45.00",
      status: "Closed"
    },
    {
      id: "TXN002",
      date: "2024-04-15",
      time: "11:15:00",
      asset: "GBP/USD",
      type: "Sell",
      size: "0.05",
      entry: "1.2650",
      exit: "1.2620",
      pnl: "+$15.00",
      status: "Closed"
    },
    {
      id: "TXN003",
      date: "2024-04-14",
      time: "14:45:00",
      asset: "USD/JPY",
      type: "Buy",
      size: "0.08",
      entry: "149.25",
      exit: "149.80",
      pnl: "+$35.20",
      status: "Closed"
    },
    {
      id: "TXN004",
      date: "2024-04-14",
      time: "16:20:00",
      asset: "AUD/USD",
      type: "Sell",
      size: "0.12",
      entry: "0.6580",
      exit: "0.6595",
      pnl: "-$18.00",
      status: "Closed"
    },
    {
      id: "TXN005",
      date: "2024-04-13",
      time: "08:45:00",
      asset: "EUR/GBP",
      type: "Buy",
      size: "0.06",
      entry: "0.8620",
      exit: "0.8665",
      pnl: "+$27.00",
      status: "Closed"
    }
  ];

  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10"> {/* Added dark mode styles */}
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Trade History</h1> {/* Added dark mode text color */}
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100"> {/* Added dark mode text color */}
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"> {/* Added dark mode text color */}
                      Asset
                    </label>
                    <Select>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"> {/* Added dark mode styles */}
                        <SelectValue placeholder="All Assets" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"> {/* Added dark mode styles */}
                        <SelectItem value="all">All Assets</SelectItem>
                        <SelectItem value="eurusd">EUR/USD</SelectItem>
                        <SelectItem value="gbpusd">GBP/USD</SelectItem>
                        <SelectItem value="usdjpy">USD/JPY</SelectItem>
                        <SelectItem value="audusd">AUD/USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"> {/* Added dark mode text color */}
                      Date From
                    </label>
                    <Input type="date" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /> {/* Added dark mode styles */}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"> {/* Added dark mode text color */}
                      Date To
                    </label>
                    <Input type="date" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" /> {/* Added dark mode styles */}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"> {/* Added dark mode text color */}
                      Status
                    </label>
                    <Select>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"> {/* Added dark mode styles */}
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"> {/* Added dark mode styles */}
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trade History Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Recent Trades</CardTitle> {/* Added dark mode text color */}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b dark:border-gray-700"> {/* Added dark mode border */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Transaction ID</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Date & Time</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Asset</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Type</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Size</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Entry</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Exit</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">P&L</th> {/* Added dark mode text color */}
                        <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Status</th> {/* Added dark mode text color */}
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.map((trade, index) => (
                        <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                          <td className="p-3 font-mono text-sm text-gray-900 dark:text-gray-100">{trade.id}</td> {/* Added dark mode text color */}
                          <td className="p-3 text-sm text-gray-900 dark:text-gray-100"> {/* Added dark mode text color */}
                            <div>{trade.date}</div>
                            <div className="text-gray-500 dark:text-gray-400">{trade.time}</div> {/* Added dark mode text color */}
                          </td>
                          <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{trade.asset}</td> {/* Added dark mode text color */}
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              trade.type === "Buy"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" // Added dark mode styles
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" // Added dark mode styles
                            )}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="p-3 text-gray-900 dark:text-gray-100">{trade.size}</td> {/* Added dark mode text color */}
                          <td className="p-3 text-gray-900 dark:text-gray-100">{trade.entry}</td> {/* Added dark mode text color */}
                          <td className="p-3 text-gray-900 dark:text-gray-100">{trade.exit}</td> {/* Added dark mode text color */}
                          <td className="p-3">
                            <span className={cn(
                              "font-medium",
                              trade.pnl.startsWith("+") ? "text-green-600" : "text-red-600"
                            )}>
                              {trade.pnl}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"> {/* Added dark mode styles */}
                              {trade.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeHistoryPage;
