import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion


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

  // Sample data for the Daily Trade Summary table
  const dailySummaryData = [
    { date: "2023-10-27", profitLoss: 15.50, totalTrades: 5, winRate: "80%" },
    { date: "2023-10-28", profitLoss: -5.20, totalTrades: 3, winRate: "33%" },
    // Add more sample data as needed
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trade Summary</h1>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Stats */}
            <AnimatedContainer delay={0.1}>
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
            </AnimatedContainer>

            {/* Monthly Performance and Best Performing Assets - Restored */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedContainer delay={0.2}>
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
              </AnimatedContainer>

              <AnimatedContainer delay={0.3}>
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
              </AnimatedContainer>
            </div>

            {/* Daily Trade Summary Table - Added below the existing sections */}
            <AnimatedContainer delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Trade Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0"> {/* Remove default padding */}
                  {/* Removed the placeholder text paragraph */}
                  <div className="overflow-x-auto"> {/* Make table scrollable on small screens */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">Date</TableHead>
                          <TableHead className="text-left">Profit/Loss</TableHead>
                          <TableHead className="text-left">Total Trades</TableHead>
                          <TableHead className="text-left">Win Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailySummaryData.map((day, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{day.date}</TableCell>
                            <TableCell className={day.profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
                              {day.profitLoss >= 0 ? `+${day.profitLoss.toFixed(2)}` : day.profitLoss.toFixed(2)}
                            </TableCell>
                            <TableCell>{day.totalTrades}</TableCell>
                            <TableCell>{day.winRate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeSummaryPage;
