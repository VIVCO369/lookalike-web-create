
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
          <div className="max-w-6xl mx-auto">
            {/* Daily Performance Tracker */}
            <DailyPerformanceTracker 
              accountType="trade-tools" 
              onResetDay={handleResetDay}
            />

            {/* Trade Tracker Section */}
            <DetailedData 
              accountType="trade-tools"
              showAddTrade={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeToolsPage;
