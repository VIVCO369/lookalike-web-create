import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { Wrench, Clock, Eye, Edit, Trash2, Plus } from "lucide-react"; // Import Plus icon
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTradeData, calculateStats, TradeFormData } from "@/contexts/TradeDataContext"; // Import TradeFormData
import { useToast } from "@/components/ui/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import DailyPerformanceTracker from "../components/DailyPerformanceTracker";
import DetailedData from "../components/DetailedData";
import AnimatedContainer from "../components/AnimatedContainer";
import { motion } from "framer-motion";
// Removed Dialog imports as we are using an inline form
import { Input } from "@/components/ui/input"; // Import Input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components


// Initial form data for adding/editing trades (for the modal on this page)
const initialTradeFormData: Omit<TradeFormData, 'id'> = {
  strategy: "",
  pair: "",
  type: "buy",
  openTime: "", // This will now store the date string (YYYY-MM-DD)
  tradeTime: "", // This will now store the time string (HH:mm)
  timeframe: "1m", // Changed default to lowercase for consistency with new values
  trend: "up",
  lotSize: "0.01",
  winLoss: "win",
  netProfit: "0.00",
  balance: "0.00",
  candles: ""
};


const TradeToolsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { toast } = useToast();

  // Use the trade data context for Trade Tools trades
  const { tradeToolsTrades, clearTradeToolsTrades, addTrade, updateTrade, deleteTrade } = useTradeData(); // Import addTrade, updateTrade, deleteTrade

  // Calculate stats for Trade Tools trades
  const stats = useMemo(() => calculateStats(tradeToolsTrades), [tradeToolsTrades]);

  // Pagination state for Trade Tools trades
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Show 5 trades per page

  // State for managing the inline add/edit trade form for Trade Tools trades
  const [showInlineForm, setShowInlineForm] = useState(false); // State to control inline form visibility
  const [tradeFormData, setTradeFormData] = useState<Omit<TradeFormData, 'id'>>(initialTradeFormData);
  const [editingTradeId, setEditingTradeId] = useState<number | null>(null); // State to track which trade is being edited


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

  // Handle input changes in the trade form (for the modal on this page)
  const handleTradeFormInputChange = (field: keyof Omit<TradeFormData, 'id'>, value: string) => {
    setTradeFormData({ ...tradeFormData, [field]: value });
  };

  // Handle submitting the trade form (Add or Edit) (for the modal on this page)
  const handleSaveTrade = () => {
    if (editingTradeId !== null) {
      // Update existing trade
      updateTrade(editingTradeId, { ...tradeFormData, id: editingTradeId }, 'trade-tools'); // Update trade-tools trade
      toast({
        title: "Trade Updated",
        description: `Trade ${editingTradeId} has been updated.`,
      });
    } else {
      // Add new trade
      addTrade(tradeFormData as TradeFormData, 'trade-tools'); // Add trade-tools trade
      toast({
        title: "Trade Added",
        description: "Your trade tools trade has been successfully saved",
      });
    }

    // Reset form and hide inline form
    setTradeFormData(initialTradeFormData);
    setEditingTradeId(null);
    setShowInlineForm(false); // Hide the inline form
  };

  // Handle opening the Add Trade inline form (for the modal on this page)
  const handleOpenAddTradeForm = () => {
    setTradeFormData(initialTradeFormData); // Clear form data
    setEditingTradeId(null); // Ensure not in editing mode
    setShowInlineForm(true); // Show the inline form
  };

  // Handle opening the Edit Trade inline form (for the modal on this page)
  const handleOpenEditTradeForm = (trade: TradeFormData) => {
    setTradeFormData(trade); // Pre-fill form data
    setEditingTradeId(trade.id || null); // Set editing ID
    setShowInlineForm(true); // Show the inline form
  };

  // Handle canceling the inline form
  const handleCancelInlineForm = () => {
    setTradeFormData(initialTradeFormData); // Clear form data
    setEditingTradeId(null); // Ensure not in editing mode
    setShowInlineForm(false); // Hide the inline form
  };


  // Handle deleting a trade
  const handleDeleteTrade = (tradeId: number) => {
    deleteTrade(tradeId, 'trade-tools'); // Delete trade-tools trade
    toast({
      title: "Trade Deleted",
      description: `Trade ${tradeId} has been removed.`,
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
              {/* Hide the Add Trade button in DetailedData as it's now in the table header */}
              <DetailedData
                accountType="trade-tools"
                showAddTrade={false} // Hide the button here
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
                  {/* New Header for the Trade History Table */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Trade History</h3> {/* Added dark mode text color */}
                    {/* New Trade Button */}
                    <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleOpenAddTradeForm}> {/* Updated onClick */}
                      <Plus className="mr-2 h-4 w-4" /> New Trade
                    </Button>
                  </div>

                  {/* Inline Add/Edit Trade Form */}
                  {showInlineForm && (
                    <AnimatedContainer delay={0.1}>
                      <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 mb-4"> {/* Added margin-bottom */}
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                          {editingTradeId !== null ? "Edit Trade" : "Add New Trade"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Strategy</label>
                            <Input
                              placeholder="Strategy"
                              value={tradeFormData.strategy}
                              onChange={(e) => handleTradeFormInputChange("strategy", e.target.value)}
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Pair</label>
                            <Select
                              value={tradeFormData.pair}
                              onValueChange={(value) => handleTradeFormInputChange("pair", value)}
                            >
                              <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                                <SelectValue placeholder="Select Trading Pair" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                <SelectItem value="Boom 300 Index">Boom 300 Index</SelectItem>
                                <SelectItem value="Boom 500 Index">Boom 500 Index</SelectItem>
                                <SelectItem value="Boom 600 Index">Boom 600 Index</SelectItem>
                                <SelectItem value="Boom 900 Index">Boom 900 Index</SelectItem>
                                <SelectItem value="Boom 1000 Index">Boom 1000 Index</SelectItem>
                                <SelectItem value="Crash 300 Index">Crash 300 Index</SelectItem>
                                <SelectItem value="Crash 500 Index">Crash 500 Index</SelectItem>
                                <SelectItem value="Crash 600 Index">Crash 600 Index</SelectItem>
                                <SelectItem value="Crash 1000 Index">Crash 1000 Index</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Type</label>
                            <Select
                              value={tradeFormData.type}
                              onValueChange={(value) => handleTradeFormInputChange("type", value)}
                            >
                              <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                <SelectItem value="buy">Buy</SelectItem>
                                <SelectItem value="sell">Sell</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Date</label>
                            <Input
                              type="date"
                              value={tradeFormData.openTime}
                              onChange={(e) => handleTradeFormInputChange("openTime", e.target.value)}
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Trade Time</label>
                            <Input
                              type="time"
                              value={tradeFormData.tradeTime}
                              onChange={(e) => handleTradeFormInputChange("tradeTime", e.target.value)}
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Timeframe</label>
                            <Select
                              value={tradeFormData.timeframe}
                              onValueChange={(value) => handleTradeFormInputChange("timeframe", value)}
                            >
                              <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                <SelectItem value="1m">1M</SelectItem>
                                <SelectItem value="5m">5M</SelectItem>
                                <SelectItem value="15m">15M</SelectItem>
                                <SelectItem value="1h">1H</SelectItem>
                                <SelectItem value="4h">4H</SelectItem>
                                <SelectItem value="1d">1D</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Trend</label>
                            <Select
                              value={tradeFormData.trend}
                              onValueChange={(value) => handleTradeFormInputChange("trend", value)}
                            >
                              <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                                <SelectValue placeholder="Select trend" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                <SelectItem value="up">Up</SelectItem>
                                <SelectItem value="down">Down</SelectItem>
                                <SelectItem value="sideways">Sideways</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Lot Size</label>
                            <Input
                              type="number"
                              placeholder="0.01"
                              step="0.01"
                              value={tradeFormData.lotSize}
                              onChange={(e) => handleTradeFormInputChange("lotSize", e.target.value)}
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Win/Loss</label>
                            <Select
                              value={tradeFormData.winLoss}
                              onValueChange={(value) => handleTradeFormInputChange("winLoss", value)}
                            >
                              <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                                <SelectValue placeholder="Select result" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                <SelectItem value="win">Win</SelectItem>
                                <SelectItem value="loss">Loss</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Net Profit</label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              value={tradeFormData.netProfit}
                              onChange={(e) => handleTradeFormInputChange("netProfit", e.target.value)}
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Balance</label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              value={tradeFormData.balance}
                              onChange={(e) => handleTradeFormInputChange("balance", e.target.value)}
                              className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Candles</label>
                            <Select
                              value={tradeFormData.candles}
                              onValueChange={(value) => handleTradeFormInputChange("candles", value)}
                            >
                              <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                                <SelectValue placeholder="Select candles" />
                              </SelectTrigger>
                              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                                <SelectItem value="1">1 Candles</SelectItem>
                                <SelectItem value="2">2 Candles</SelectItem>
                                <SelectItem value="3">3 Candles</SelectItem>
                                <SelectItem value="4">4 Candles</SelectItem>
                                <SelectItem value="5">5 Candles</SelectItem>
                                <SelectItem value="10">10 Candles</SelectItem>
                                <SelectItem value="15">15 Candles</SelectItem>
                                <SelectItem value="20">20 Candles</SelectItem>
                                <SelectItem value="25">25 Candles</SelectItem>
                                <SelectItem value="30">30 Candles</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={handleCancelInlineForm}>Cancel</Button> {/* Added Cancel button */}
                          <Button onClick={handleSaveTrade}>
                            {editingTradeId !== null ? "Save Changes" : "Add Trade"}
                          </Button>
                        </div>
                      </div>
                    </AnimatedContainer>
                  )}


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
                          <TableHeader className="bg-[#e6e6e6]"> {/* Changed background to #e6e6e6 */}
                            <TableRow>
                              <TableHead className="text-gray-900 dark:text-gray-100">TRADE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">DATE</TableHead> {/* Added Date header */}
                              <TableHead className="text-gray-900 dark:text-gray-100">TIME</TableHead> {/* Added Time header */}
                              <TableHead className="text-gray-900 dark:text-gray-100">PAIR</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">TYPE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">TIMEFRAME</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">TREND</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">LOT SIZE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">CANDLES</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">W/L</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">NET PROFIT</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">BALANCE</TableHead> {/* Added dark mode text color */}
                              <TableHead className="text-gray-900 dark:text-gray-100">ACTIONS</TableHead> {/* Added dark mode text color */}
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
                                <TableCell className="text-gray-900 dark:text-gray-100">{trade.openTime}</TableCell> {/* Display Date */}
                                <TableCell className="text-gray-900 dark:text-gray-100">{trade.tradeTime}</TableCell> {/* Display Time */}
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
                                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleOpenEditTradeForm(trade)}> {/* Updated onClick */}
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    {/* Delete Button with AlertDialog */}
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"> {/* Added dark mode styles */}
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this trade entry.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteTrade(trade.id || 0)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
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

      {/* Removed Add/Edit Trade Modal (for Trade Tools Trades) */}

    </div>
  );
};

export default TradeToolsPage;
