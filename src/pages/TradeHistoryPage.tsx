import { useState, useEffect } from "react"; // Import useEffect
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { History, Filter, Download, Clock } from "lucide-react"; // Import Clock icon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion


const TradeHistoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date()); // Add state for current date/time


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
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm" // Added dark mode styles
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Trade History</h1> {/* Added dark mode text color */}
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <AnimatedContainer delay={0.1}>
            <div className="max-w-7xl mx-auto space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">All Trade History</h2> {/* Added dark mode text color */}

              {/* Filter and Download Section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search trades..." className="w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" /> {/* Added dark mode styles */}
                  <Select>
                    <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"> {/* Added dark mode styles */}
                      <SelectValue placeholder="Filter by Asset" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"> {/* Added dark mode styles */}
                      <SelectItem value="all">All Assets</SelectItem>
                      <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                      <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                      <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                      <SelectItem value="AUD/USD">AUD/USD</SelectItem>
                      <SelectItem value="EUR/GBP">EUR/GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"> {/* Added dark mode styles */}
                    <Filter className="mr-2 h-4 w-4" /> Filter
                  </Button>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Download className="mr-2 h-4 w-4" /> Download CSV
                </Button>
              </div>

              {/* Trade History Table */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto hover:shadow-lg transition-shadow duration-300 dark:border-gray-700" // Added dark mode styles
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-gray-600 dark:text-gray-300">ID</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">DATE</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">TIME</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">ASSET</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">TYPE</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">SIZE</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">ENTRY</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">EXIT</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">P&L</TableHead> {/* Added dark mode text color */}
                      <TableHead className="text-gray-600 dark:text-gray-300">STATUS</TableHead> {/* Added dark mode text color */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tradeHistory.map((trade, index) => (
                      <motion.tr
                        key={trade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                        whileHover={{ backgroundColor: "#f8f9fa" }}
                        className="dark:hover:bg-gray-700" // Added dark mode hover style
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{trade.id}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.date}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.time}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.asset}</TableCell> {/* Added dark mode text color */}
                        <TableCell className={trade.type === "Buy" ? "text-green-600" : "text-red-600"}>{trade.type}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.size}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.entry}</TableCell> {/* Added dark mode text color */}
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.exit}</TableCell> {/* Added dark mode text color */}
                        <TableCell className={parseFloat(trade.pnl.replace("$", "")) >= 0 ? "text-green-600" : "text-red-600"}>{trade.pnl}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{trade.status}</TableCell> {/* Added dark mode text color */}
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
                <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400"> {/* Added dark mode text color */}
                  Showing 1 to {tradeHistory.length} of {tradeHistory.length} results
                </div>
              </motion.div>
            </div>
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
};

export default TradeHistoryPage;
