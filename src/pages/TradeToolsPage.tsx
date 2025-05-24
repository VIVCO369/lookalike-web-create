
import { useState, useEffect, useMemo } from "react"; // Import useMemo
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Wrench, Clock, Eye, Edit, Trash2 } from "lucide-react"; // Import icons for table actions
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import { Button } from "@/components/ui/button"; // Import Button component
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext"; // Import useTradeData and calculateStats
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Import Pagination components


const TradeToolsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { toast } = useToast(); // Call useToast hook to get the toast function

  // Use the trade data context for Trade Tools trades
  const { tradeToolsTrades, clearTradeToolsTrades } = useTradeData(); // Use tradeToolsTrades and clearTradeToolsTrades

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

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F5F0" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Trade Tools</h1>
          </div>
          {/* Display current date and time */}
          <div>
            <p className="text-black text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Trade Tools Table */}
            <div className="bg-white rounded-md shadow overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">TRADE</TableHead>
                    <TableHead>STRATEGY</TableHead>
                    <TableHead>PAIR</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>OPEN TIME</TableHead>
                    <TableHead>TRADE TIME</TableHead>
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
                  {/* Displaying paginated Trade Tools trades */}
                  {paginatedTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.id}</TableCell>
                      <TableCell>{trade.strategy}</TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell className="text-blue-500">{trade.type}</TableCell>
                      <TableCell>{trade.openTime}</TableCell>
                      <TableCell>{trade.tradeTime}</TableCell>
                      <TableCell>{trade.timeframe}</TableCell>
                      <TableCell>{trade.trend}</TableCell>
                      <TableCell>{trade.lotSize}</TableCell>
                      <TableCell className="text-red-500">{trade.candles}</TableCell>
                      <TableCell className={trade.winLoss === "win" ? "text-green-500" : "text-red-500"}>
                        {trade.winLoss === "win" ? "Win" : "Loss"}
                      </TableCell>
                      <TableCell className={parseFloat(trade.netProfit) >= 0 ? "text-green-500" : "text-red-500"}>
                        {trade.netProfit}
                      </TableCell>
                      <TableCell>{trade.balance}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Added pagination UI */}
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {paginatedTrades.length > 0 ? ((currentPage - 1) * 5) + 1 : 0} to {Math.min(currentPage * 5, tradeToolsTrades.length)} of {tradeToolsTrades.length} results
                </div>
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                      )}

                      {/* Generate page numbers */}
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNumber = index + 1;
                        // Show current page and at most 2 pages before and after
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                isActive={pageNumber === currentPage}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNumber);
                                }}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        // Show ellipsis for skipped pages
                        else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return <PaginationItem key={pageNumber}>...</PaginationItem>;
                        }
                        return null;
                      })}

                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage + 1);
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeToolsPage;
