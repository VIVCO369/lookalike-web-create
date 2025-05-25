
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TradeSummaryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const summaryStats = [
    {
      title: "Total Trades",
      value: "247",
      change: "+12%",
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Win Rate",
      value: "68.4%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Total P&L",
      value: "$12,450",
      change: "+18.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Days",
      value: "89",
      change: "+5 days",
      icon: Calendar,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trade Summary</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {summaryStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">January 2024</span>
                      <span className="font-medium text-green-600">+$2,150</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">February 2024</span>
                      <span className="font-medium text-green-600">+$3,280</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">March 2024</span>
                      <span className="font-medium text-red-600">-$850</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">April 2024</span>
                      <span className="font-medium text-green-600">+$4,120</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Performing Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">EUR/USD</span>
                      <span className="font-medium text-green-600">+$1,850</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">GBP/USD</span>
                      <span className="font-medium text-green-600">+$1,420</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">USD/JPY</span>
                      <span className="font-medium text-green-600">+$980</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">AUD/USD</span>
                      <span className="font-medium text-red-600">-$320</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeSummaryPage;
