import { useState, useEffect, useMemo } from "react"; // Import useEffect and useMemo
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { History, Filter, Download, Clock, Eye, Edit, Trash2, Copy, Search } from "lucide-react"; // Import more icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { useTradeData, TradeFormData, calculateStats } from "@/contexts/TradeDataContext"; // Import trade data context
import { useToast } from "@/hooks/use-toast"; // Import toast
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Import AlertDialog
import { motion } from "framer-motion"; // Import motion


const TradeHistoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { toast } = useToast();

  // Get Start Trade data (backtestingTrades) as the data source
  const { backtestingTrades, updateTrade, deleteTrade } = useTradeData();

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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

  // Calculate stats for all trades
  const stats = useMemo(() => calculateStats(backtestingTrades), [backtestingTrades]);


  // Filter and sort trades
  const filteredAndSortedTrades = useMemo(() => {
    let filtered = backtestingTrades.filter(trade => {
      // Search filter
      const searchMatch = searchTerm === "" ||
        trade.pair?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.strategy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.id?.toString().includes(searchTerm);

      // Type filter
      const typeMatch = filterType === "all" || trade.type?.toLowerCase() === filterType.toLowerCase();

      // Status filter (win/loss)
      const statusMatch = filterStatus === "all" || trade.winLoss === filterStatus;

      return searchMatch && typeMatch && statusMatch;
    });

    // Sort trades
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.openTime || "").getTime();
          bValue = new Date(b.openTime || "").getTime();
          break;
        case "profit":
          aValue = parseFloat(a.netProfit || "0");
          bValue = parseFloat(b.netProfit || "0");
          break;
        case "pair":
          aValue = a.pair || "";
          bValue = b.pair || "";
          break;
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [backtestingTrades, searchTerm, filterType, filterStatus, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTrades.length / itemsPerPage);
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTrades.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTrades, currentPage, itemsPerPage]);

  // Handle delete trade
  const handleDeleteTrade = (tradeId: number) => {
    deleteTrade(tradeId, 'backtesting');
    toast({
      title: "Trade Deleted",
      description: `Trade ${tradeId} has been removed from history.`,
    });
  };

  // Handle copy trade
  const handleCopyTrade = (trade: TradeFormData) => {
    const tradeText = `Trade ${trade.id}: ${trade.pair} ${trade.type} - Profit: ${trade.netProfit}`;
    navigator.clipboard.writeText(tradeText);
    toast({
      title: "Trade Copied",
      description: "Trade details copied to clipboard.",
    });
  };

  // Format currency
  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="flex min-h-screen bg-background"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">All Trade History</h1>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-orange-900 dark:text-orange-300">
              {backtestingTrades.length} trades
            </span>
          </div>
          <div className="text-right">
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-orange-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trades</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTrades}</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <History className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</p>
                      <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(stats.netProfit)}
                      </p>
                    </div>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${stats.netProfit >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                      <span className={`text-sm font-bold ${stats.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.netProfit >= 0 ? '+' : '-'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.winRate}</p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Trade</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.bestTrade)}</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">↗</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">
          <AnimatedContainer delay={0.1}>
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Filter and Search Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search trades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                  {/* Type Filter */}
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Filter by Result" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="win">Wins</SelectItem>
                      <SelectItem value="loss">Losses</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="profit">Profit</SelectItem>
                      <SelectItem value="pair">Pair</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort Order & Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing {paginatedTrades.length} of {filteredAndSortedTrades.length} trades
                  {searchTerm && ` matching "${searchTerm}"`}
                </div>
              </div>

              {/* Trade History Table */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {paginatedTrades.length === 0 ? (
                  <div className="p-8 text-center">
                    <History className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No trades found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchTerm ? `No trades match "${searchTerm}"` : "Start trading to see your history here."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px] text-gray-600 dark:text-gray-300">ID</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">DATE</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">TIME</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">PAIR</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">TYPE</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">STRATEGY</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">LOT SIZE</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">PROFIT</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">W/L</TableHead>
                            <TableHead className="text-gray-600 dark:text-gray-300">ACTIONS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedTrades.map((trade, index) => (
                            <TableRow
                              key={trade.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                {trade.id}
                              </TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">
                                {trade.openTime}
                              </TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">
                                {trade.tradeTime}
                              </TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">
                                {trade.pair}
                              </TableCell>
                              <TableCell className={`font-medium ${trade.type === "buy" ? "text-green-600" : "text-red-600"}`}>
                                {trade.type?.toUpperCase()}
                              </TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">
                                {trade.strategy}
                              </TableCell>
                              <TableCell className="text-gray-900 dark:text-gray-100">
                                {trade.lotSize}
                              </TableCell>
                              <TableCell className={`font-medium ${parseFloat(trade.netProfit || "0") >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {formatCurrency(trade.netProfit || "0")}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  trade.winLoss === "win"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}>
                                  {trade.winLoss?.toUpperCase()}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => handleCopyTrade(trade)}
                                    title="Copy trade details"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        title="Delete trade"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Trade</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this trade? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteTrade(trade.id!)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedTrades.length)} of {filteredAndSortedTrades.length} results
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Page {currentPage} of {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
};

export default TradeHistoryPage;
