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
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trade History</h1>
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
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Asset
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Assets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assets</SelectItem>
                        <SelectItem value="eurusd">EUR/USD</SelectItem>
                        <SelectItem value="gbpusd">GBP/USD</SelectItem>
                        <SelectItem value="usdjpy">USD/JPY</SelectItem>
                        <SelectItem value="audusd">AUD/USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Date From
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Date To
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Status
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
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
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700">Transaction ID</th>
                        <th className="text-left p-3 font-medium text-gray-700">Date & Time</th>
                        <th className="text-left p-3 font-medium text-gray-700">Asset</th>
                        <th className="text-left p-3 font-medium text-gray-700">Type</th>
                        <th className="text-left p-3 font-medium text-gray-700">Size</th>
                        <th className="text-left p-3 font-medium text-gray-700">Entry</th>
                        <th className="text-left p-3 font-medium text-gray-700">Exit</th>
                        <th className="text-left p-3 font-medium text-gray-700">P&L</th>
                        <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeHistory.map((trade, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-mono text-sm">{trade.id}</td>
                          <td className="p-3 text-sm">
                            <div>{trade.date}</div>
                            <div className="text-gray-500">{trade.time}</div>
                          </td>
                          <td className="p-3 font-medium">{trade.asset}</td>
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              trade.type === "Buy" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            )}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="p-3">{trade.size}</td>
                          <td className="p-3">{trade.entry}</td>
                          <td className="p-3">{trade.exit}</td>
                          <td className="p-3">
                            <span className={cn(
                              "font-medium",
                              trade.pnl.startsWith("+") ? "text-green-600" : "text-red-600"
                            )}>
                              {trade.pnl}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
