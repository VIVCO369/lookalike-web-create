
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
            <Wrench className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trade Tools</h1>
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
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
                className="bg-white rounded-lg shadow-lg border mt-6 hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Trade History</h3>
                  </div>
                  
                  {tradeToolsTrades.length === 0 ? (
                    <motion.div 
                      className="text-center py-8 text-gray-500"
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
                              <TableHead>TRADE</TableHead>
                              <TableHead>PAIR</TableHead>
                              <TableHead>TYPE</TableHead>
                              <TableHead>TIMEFRAME</TableHead>
                              <TableHead>TREND</TableHead>
                              <TableHead>LOT SIZE</TableHead>
                              <TableHead>CANDLES</TableHead>
                              <TableHead>W/L</TableHead>
                              <TableHead>NET PROFIT</TableHead>
                              <TableHead>BALANCE</TableHead>
                              <TableHead>ACTIONS</TableHead>
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
                              >
                                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                <TableCell>{trade.pair}</TableCell>
                                <TableCell>
                                  <span className={trade.type === 'buy' ? 'text-blue-600' : 'text-red-600'}>
                                    {trade.type}
                                  </span>
                                </TableCell>
                                <TableCell>{trade.timeframe}</TableCell>
                                <TableCell>{trade.trend}</TableCell>
                                <TableCell>{trade.lotSize}</TableCell>
                                <TableCell>{trade.candles}</TableCell>
                                <TableCell>
                                  <span className={trade.winLoss === 'win' ? 'text-green-600' : 'text-red-600'}>
                                    {trade.winLoss === 'win' ? 'Win' : 'Loss'}
                                  </span>
                                </TableCell>
                                <TableCell className={parseFloat(trade.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {parseFloat(trade.netProfit) >= 0 ? '+' : ''}{parseFloat(trade.netProfit).toFixed(2)}
                                </TableCell>
                                <TableCell>{parseFloat(trade.balance).toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
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
