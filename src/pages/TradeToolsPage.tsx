import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Wrench, Clock, Eye, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext";
import { useToast } from "@/components/ui/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import DailyPerformanceTracker from "../components/DailyPerformanceTracker";
import DetailedData from "../components/DetailedData";
import AnimatedContainer from "../components/AnimatedContainer";
import { motion } from "framer-motion";

const TradeToolsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { toast } = useToast();

  // Use the trade data context for Trade Tools trades
  const { tradeToolsTrades, clearTradeToolsTrades } = useTradeData();

  // Calculate stats for Trade Tools trades
  const stats = useMemo(() => calculateStats(tradeToolsTrades), [tradeToolsTrades]);

  // Pagination state for Trade Tools trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // Calculate total pages for Trade Tools trades
  const totalPages = Math.ceil(tradeToolsTrades.length / itemsPerPage);

  // Get paginated Trade Tools trades for current page
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return tradeToolsTrades.slice(startIndex, startIndex + itemsPerPage);
  }, [tradeToolsTrades, currentPage, itemsPerPage]);

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

  // Format currency values for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle reset day
  const handleResetDay = () => {
    clearTradeToolsTrades();
    toast({
      title: "Day Reset",
      description: "All Trade Tools trades have been cleared.",
    });
  };

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
            <Wrench className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">Trade Tools</h1> {/* Added dark mode text color */}
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p> {/* Added dark mode text color */}
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Daily Performance Tracker */}
            <AnimatedContainer delay={0.1}>
              <DailyPerformanceTracker
                accountType="trade-tools"
                onResetDay={handleResetDay}
              />
            </AnimatedContainer>

            {/* Trade Tracker Section */}
            <AnimatedContainer delay={0.2}>
              <DetailedData
                accountType="trade-tools"
                showAddTrade={true}
              />
            </AnimatedContainer>

            {/* Trades Table */}
            <AnimatedContainer delay={0.3}>
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border mt-6 hover:shadow-xl transition-shadow duration-300 dark:border-gray-700" // Added dark mode styles
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Trade History</h3> {/* Added dark mode text color */}
                  </div>

                  {tradeToolsTrades.length === 0 ? (
                    <motion.div
                      className="text-center py-8 text-gray-500 dark:text-gray-400" // Added dark mode text color
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      No trades found. Add your first trade to get started.
                    </motion.div>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-gray-600 dark:text-gray-300">TRADE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">PAIR</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">TYPE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">TIMEFRAME</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">TREND</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">LOT SIZE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">CANDLES</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">W/L</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">NET PROFIT</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">BALANCE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-600 dark:text-gray-300">ACTIONS</TableHead> {/* Added dark mode text color */}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedTrades.map((trade, index) => (
                              <motion.tr
                                key={trade.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                                whileHover={{ backgroundColor: "#f8f9fa" }}
                                className="dark:hover:bg-gray-700" // Added dark mode hover style
                              >
                                <TableCell className="text-gray-900 dark:text-gray-100">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell> {/* Added dark mode text color */}
                                <TableCell className="text-gray-900 dark:text-gray-100">{trade.pair}</TableCell> {/* Added dark mode text color */}
                                <TableCell>
                                  <span className={trade.type === 'buy' ? 'text-blue-600' : 'text-red-600'}>
                                    {trade.type}
                                  </span>
                                </TableCell>
                                <TableCell className="text-gray-900 dark:text-gray-100">{trade.timeframe}</TableCell> {/* Added dark mode text color */}
                                <TableCell className="text-gray-900 dark:text-gray-100">{trade.trend}</TableCell> {/* Added dark mode text color */}
                                <TableCell className="text-gray-900 dark:text-gray-100">{trade.lotSize}</TableCell> {/* Added dark mode text color */}
                                <TableCell className="text-gray-900 dark:text-gray-100">{trade.candles}</TableCell> {/* Added dark mode text color */}
                                <TableCell>
                                  <span className={trade.winLoss === 'win' ? 'text-green-600' : 'text-red-600'}>
                                    {trade.winLoss === 'win' ? 'Win' : 'Loss'}
                                  </span>
                                </TableCell>
                                <TableCell className={parseFloat(trade.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {parseFloat(trade.netProfit) >= 0 ? '+' : ''}{parseFloat(trade.netProfit).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-gray-900 dark:text-gray-100">{parseFloat(trade.balance).toFixed(2)}</TableCell> {/* Added dark mode text color */}
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </TableBody>
                        </Table>
                      </motion.div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.3 }}
                        >
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={currentPage === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              ))}
                              <PaginationItem>
                                <PaginationNext
                                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeToolsPage;
