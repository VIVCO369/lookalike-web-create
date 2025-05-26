import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils"; // Import cn utility
import { motion } from "framer-motion"; // Import motion
import { DollarSign, Plus, Trash2, Edit } from "lucide-react"; // Import DollarSign, Plus, Trash2, Edit icons
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import { Button } from "@/components/ui/button"; // Import Button component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components - Keep import for now, might remove later if not needed elsewhere
import { Input } from "@/components/ui/input"; // Import Input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import useLocalStorage from "@/hooks/useLocalStorage"; // Import useLocalStorage

// Define the type for a custom profits row
interface CustomProfitRow {
  id: string; // Unique ID for each row
  day: number | string;
  perDay: string;
  balance: number | string;
  session1: number | string;
  session2: number | string;
  session3: number | string;
  session4: number | string;
  session5: number | string;
  tfProfit: number | string;
  withdraw: number | string;
  stAmount: number | string;
  lotSize: number | string; // Changed from extraStake to Lot Size
  reached: string;
}

const ThirtyDaysProfitsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  // Sample data that matches the Excel structure for the first table
  const challengeData = [
    { day: 1, balance: 100.00, perDay: "15%", session1: 0.30, session2: 0.30, session3: 0.30, session4: 0.30, session5: 0.30, tfProfit: 1.50, withdraw: 0, stAmount: 1.50, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "15%" },
    { day: 2, balance: 11.50, perDay: "15%", session1: 0.35, session2: 0.35, session3: 0.35, session4: 0.35, session5: 0.35, tfProfit: 1.73, withdraw: 0, stAmount: 1.73, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "15%" },
    { day: 3, balance: 13.23, perDay: "15%", session1: 0.40, session2: 0.40, session3: 0.40, session4: 0.40, session5: 0.40, tfProfit: 1.98, withdraw: 0, stAmount: 1.98, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "" },
    { day: 4, balance: 15.21, perDay: "15%", session1: 0.46, session2: 0.46, session3: 0.46, session4: 0.46, session5: 0.46, tfProfit: 2.28, withdraw: 0, stAmount: 2.28, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "" },
    { day: 5, balance: 17.49, perDay: "15%", session1: 0.52, session2: 0.52, session3: 0.52, session4: 0.52, session5: 0.52, tfProfit: 2.62, withdraw: 2.00, stAmount: 2.62, extraStake: 0.20, reached: "Yes", superTrade: "", profit: "" },
    { day: 6, balance: 18.11, perDay: "15%", session1: 0.54, session2: 0.54, session3: 0.54, session4: 0.54, session5: 0.54, tfProfit: 2.72, withdraw: 0, stAmount: 2.72, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 7, balance: 20.83, perDay: "15%", session1: 0.62, session2: 0.62, session3: 0.62, session4: 0.62, session5: 0.62, tfProfit: 3.12, withdraw: 0, stAmount: 3.12, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 8, balance: 23.96, perDay: "15%", session1: 0.72, session2: 0.72, session3: 0.72, session4: 0.72, session5: 0.72, tfProfit: 3.59, withdraw: 0, stAmount: 3.59, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 9, balance: 27.55, perDay: "15%", session1: 0.83, session2: 0.83, session3: 0.83, session4: 0.83, session5: 0.83, tfProfit: 4.13, withdraw: 0, stAmount: 4.13, extraStake: 0.25, reached: "Yes", superTrade: "", profit: "" },
    { day: 10, balance: 31.68, perDay: "15%", session1: 0.95, session2: 0.95, session3: 0.95, session4: 0.95, session5: 0.95, tfProfit: 4.75, withdraw: 0, stAmount: 4.75, extraStake: 0.40, reached: "Yes", superTrade: "", profit: "" },
    { day: 11, balance: 36.43, perDay: "15%", session1: 1.09, session2: 1.09, session3: 1.09, session4: 1.09, session5: 1.09, tfProfit: 5.46, withdraw: 0, stAmount: 5.46, extraStake: 0.40, reached: "No", superTrade: "", profit: "" },
    { day: 12, balance: 41.90, perDay: "15%", session1: 1.26, session2: 1.26, session3: 1.26, session4: 1.26, session5: 1.26, tfProfit: 6.28, withdraw: 6.00, stAmount: 6.28, extraStake: 0.40, reached: "No", superTrade: "", profit: "" },
    { day: 13, balance: 48.18, perDay: "15%", session1: 1.45, session2: 1.45, session3: 1.45, session4: 1.45, session5: 1.45, tfProfit: 7.23, withdraw: 0, stAmount: 7.23, extraStake: 0.40, reached: "No", superTrade: "", profit: "" },
    { day: 14, balance: 55.41, perDay: "15%", session1: 1.66, session2: 1.66, session3: 1.66, session4: 1.66, session5: 1.66, tfProfit: 8.31, withdraw: 0, stAmount: 8.31, extraStake: 0.40, reached: "Yes", superTrade: "", profit: "" },
    { day: 15, balance: 63.72, perDay: "15%", session1: 1.91, session2: 1.91, session3: 1.91, session4: 1.91, session5: 1.91, tfProfit: 9.56, withdraw: 0, stAmount: 9.56, extraStake: 0.40, reached: "", superTrade: "", profit: "" },
    { day: 16, balance: 73.28, perDay: "15%", session1: 2.20, session2: 2.20, session3: 2.20, session4: 2.20, session5: 2.20, tfProfit: 10.99, withdraw: 0, stAmount: 10.99, extraStake: 0.40, reached: "", superTrade: "", profit: "" },
    { day: 17, balance: 84.27, perDay: "15%", session1: 2.53, session2: 2.53, session3: 2.53, session4: 2.53, session5: 2.53, tfProfit: 12.64, withdraw: 20.00, stAmount: 12.64, extraStake: 0.40, reached: "", superTrade: "", profit: "" },
    { day: 18, balance: 76.91, perDay: "15%", session1: 2.31, session2: 2.31, session3: 2.31, session4: 2.31, session5: 2.31, tfProfit: 11.54, withdraw: 0, stAmount: 11.54, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 19, balance: 88.45, perDay: "15%", session1: 2.65, session2: 2.65, session3: 2.65, session4: 2.65, session5: 2.65, tfProfit: 13.27, withdraw: 0, stAmount: 13.27, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 20, balance: 101.72, perDay: "15%", session1: 3.05, session2: 3.05, session3: 3.05, session4: 3.05, session5: 3.05, tfProfit: 15.26, withdraw: 0, stAmount: 15.26, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 21, balance: 116.97, perDay: "15%", session1: 3.51, session2: 3.51, session3: 3.51, session4: 3.51, session5: 3.51, tfProfit: 17.55, withdraw: 0, stAmount: 17.55, extraStake: 1.00, reached: "", superTrade: "", profit: "" },
    { day: 22, balance: 134.52, perDay: "15%", session1: 4.04, session2: 4.04, session3: 4.04, session4: 4.04, session5: 4.04, tfProfit: 20.18, withdraw: 25.00, stAmount: 20.18, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 23, balance: 129.70, perDay: "15%", session1: 3.89, session2: 3.89, session3: 3.89, session4: 3.89, session5: 3.89, tfProfit: 19.45, withdraw: 0, stAmount: 19.45, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 24, balance: 149.15, perDay: "15%", session1: 4.47, session2: 4.47, session3: 4.47, session4: 4.47, session5: 4.47, tfProfit: 22.37, withdraw: 0, stAmount: 22.37, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 25, balance: 171.53, perDay: "15%", session1: 5.15, session2: 5.15, session3: 5.15, session4: 5.15, session5: 5.15, tfProfit: 25.73, withdraw: 0, stAmount: 25.73, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 26, balance: 197.25, perDay: "15%", session1: 5.92, session2: 5.92, session3: 5.92, session4: 5.92, session5: 5.92, tfProfit: 29.59, withdraw: 0, stAmount: 29.59, extraStake: 2.00, reached: "", superTrade: "", profit: "" },
    { day: 27, balance: 226.84, perDay: "15%", session1: 6.81, session2: 6.81, session3: 6.81, session4: 6.81, session5: 6.81, tfProfit: 34.03, withdraw: 30.00, stAmount: 34.03, extraStake: 3.00, reached: "", superTrade: "", profit: "" },
    { day: 28, balance: 230.87, perDay: "15%", session1: 6.93, session2: 6.93, session3: 6.93, session4: 6.93, session5: 6.93, tfProfit: 34.63, withdraw: 0, stAmount: 34.63, extraStake: 3.00, reached: "", superTrade: "", profit: "" },
    { day: 29, balance: 265.50, perDay: "15%", session1: 7.96, session2: 7.96, session3: 7.96, session4: 7.96, session5: 7.96, tfProfit: 39.82, withdraw: 0, stAmount: 39.82, extraStake: 3.00, reached: "", superTrade: "", profit: "" },
    { day: 30, balance: 305.32, perDay: "15%", session1: 9.16, session2: 9.16, session3: 9.16, session4: 9.16, session5: 9.16, tfProfit: 45.80, withdraw: 50.00, stAmount: 45.80, extraStake: 3.00, reached: "", superTrade: "", profit: "" }
  ];

  const sessionsData = [
    { session: "Session 1", time: "4:00 - 5:00", status: "Yes", balance: "$10", withdrawal: "100%" },
    { session: "Session 2", time: "5:00 - 6:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 3", time: "6:00 - 7:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 4", time: "7:00 - 8:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 5", time: "9:00 - 10:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 6", time: "10:00 - 11:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 7", time: "11:00 - 12:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 8", time: "12:00 - 13:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 9", time: "13:00 - 14:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 10", time: "14:00 - 15:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 11", time: "15:00 - 16:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 12", time: "16:00 - 17:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 13", time: "17:00 - 18:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 14", time: "18:00 - 19:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 15", time: "20:00 - 21:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 16", time: "21:00 - 22:00", status: "No", balance: "", withdrawal: "" },
    { session: "Session 17", time: "22:00 - 23:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "Session 18", time: "23:00 - 24:00", status: "Yes", balance: "", withdrawal: "" },
    { session: "News Filter", time: "", status: "Yes", balance: "", withdrawal: "" }
  ];

  // State for the new custom profits table data, persisted with useLocalStorage
  const [customProfitsData, setCustomProfitsData] = useLocalStorage<CustomProfitRow[]>("customProfitsData", []);

  // State for managing the add/edit modal for custom profits
  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);
  const [profitFormData, setProfitFormData] = useState<Omit<CustomProfitRow, 'id'>>({
    day: "",
    perDay: "",
    balance: "",
    session1: "",
    session2: "",
    session3: "",
    session4: "",
    session5: "",
    tfProfit: "",
    withdraw: "",
    stAmount: "",
    lotSize: "",
    reached: "",
  });
  const [editingProfitId, setEditingProfitId] = useState<string | null>(null); // State to track which row is being edited

  // State for selected rows to delete in the custom profits table
  const [selectedProfitRows, setSelectedProfitRows] = useState<string[]>([]);


  // Handle input changes in the custom profits form
  const handleProfitFormInputChange = (field: keyof Omit<CustomProfitRow, 'id'>, value: string) => {
    setProfitFormData({ ...profitFormData, [field]: value });
  };

  // Handle adding or saving a row in the custom profits table
  const handleSaveProfitRow = () => {
    if (editingProfitId) {
      // Update existing row
      setCustomProfitsData(customProfitsData.map(row =>
        row.id === editingProfitId ? { ...row, ...profitFormData, id: editingProfitId } : row
      ));
      setEditingProfitId(null);
    } else {
      // Add new row
      const newRow: CustomProfitRow = {
        id: Date.now().toString(), // Simple unique ID
        ...profitFormData,
        day: parseInt(profitFormData.day as string) || profitFormData.day, // Convert to number if possible
        balance: parseFloat(profitFormData.balance as string) || profitFormData.balance, // Convert to number if possible
        session1: parseFloat(profitFormData.session1 as string) || profitFormData.session1, // Convert to number if possible
        session2: parseFloat(profitFormData.session2 as string) || profitFormData.session2, // Convert to number if possible
        session3: parseFloat(profitFormData.session3 as string) || profitFormData.session3, // Convert to number if possible
        session4: parseFloat(profitFormData.session4 as string) || profitFormData.session4, // Convert to number if possible
        session5: parseFloat(profitFormData.session5 as string) || profitFormData.session5, // Convert to number if possible
        tfProfit: parseFloat(profitFormData.tfProfit as string) || profitFormData.tfProfit, // Convert to number if possible
        withdraw: parseFloat(profitFormData.withdraw as string) || profitFormData.withdraw, // Convert to number if possible
        stAmount: parseFloat(profitFormData.stAmount as string) || profitFormData.stAmount, // Convert to number if possible
        lotSize: parseFloat(profitFormData.lotSize as string) || profitFormData.lotSize, // Convert to number if possible
      };
      setCustomProfitsData([...customProfitsData, newRow]);
    }

    // Reset form and hide it
    setProfitFormData({
      day: "",
      perDay: "",
      balance: "",
      session1: "",
      session2: "",
      session3: "",
      session4: "",
      session5: "",
      tfProfit: "",
      withdraw: "",
      stAmount: "",
      lotSize: "",
      reached: "",
    });
    setIsProfitModalOpen(false);
  };

  // Handle opening the Add Profit Row modal
  const handleOpenAddProfitModal = () => {
    setProfitFormData({
      day: "",
      perDay: "",
      balance: "",
      session1: "",
      session2: "",
      session3: "",
      session4: "",
      session5: "",
      tfProfit: "",
      withdraw: "",
      stAmount: "",
      lotSize: "",
      reached: "",
    });
    setEditingProfitId(null);
    setIsProfitModalOpen(true);
  };

  // Handle opening the Edit Profit Row modal
  const handleOpenEditProfitModal = (row: CustomProfitRow) => {
    setProfitFormData(row);
    setEditingProfitId(row.id);
    setIsProfitModalOpen(true);
  };

  // Handle selecting/deselecting a row in the custom profits table
  const handleSelectProfitRow = (rowId: string) => {
    if (selectedProfitRows.includes(rowId)) {
      setSelectedProfitRows(selectedProfitRows.filter(id => id !== rowId));
    } else {
      setSelectedProfitRows([...selectedProfitRows, rowId]);
    }
  };

  // Handle deleting selected rows in the custom profits table
  const handleDeleteSelectedProfitRows = () => {
    setCustomProfitsData(customProfitsData.filter(row => !selectedProfitRows.includes(row.id)));
    setSelectedProfitRows([]); // Clear selection after deleting
  };


  return (
    <div className="min-h-screen bg-background flex w-full"> {/* Changed inline style to Tailwind class */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={cn(
          "flex-1 transition-all duration-300 flex flex-col", // Added flex flex-col
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Header - Made fixed */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-10 h-16 flex items-center justify-between px-6 shadow-sm bg-white dark:bg-gray-800 border-b dark:border-gray-700" // Added fixed positioning and dark mode styles
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
           {/* Page Title (Left) */}
           <div className="flex items-center gap-2"> {/* Added container for icon and title */}
            <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added icon and dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">30 Days Profits</h1> {/* Added title and dark mode text color */}
          </div>
          {/* Display current date and time (Right) */}
          <div>
            <p className="text-black dark:text-white text-sm font-bold">{formatDate(currentDateTime)}</p>
            <p className="text-green-500 text-xs font-bold">{formatTime(currentDateTime)}</p>
          </div>
          {/* Removed Timeframe buttons and Trend */}
        </motion.header>

        {/* Main content - Added pt-16 for header clearance and overflow-y-auto */}
        <div className="p-6 pt-24 overflow-y-auto flex-1"> {/* Added pt-24 and overflow-y-auto */}
          <AnimatedContainer>
            <div className="mb-8">
              {/* Removed the h1 and p tags */}
            </div>
          </AnimatedContainer>

          {/* First Table: META CASH 30 DAYS CASH CHALLENGE */}
          <AnimatedContainer delay={0.2}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"> {/* Added margin-bottom */}
              {/* Header */}
              <div className="bg-black text-white text-center py-3">
                <h2 className="text-xl font-bold">META CASH 30 DAYS CASH CHALLENGE</h2>
              </div>
              <div className="bg-red-600 text-white text-center py-2">
                <h3 className="text-lg font-bold">MONEY MANAGEMENT</h3>
              </div>

              <div className="flex">
                {/* Main Table */}
                <div className="flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-red-600 text-white">
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">DAYS</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">BALANCE % PER DAY</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">SESSION 1</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">SESSION 2</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">SESSION 3</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">SESSION 4</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">SESSION 5</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">T/PROFIT</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">WITHDRAW</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">ST/AMOUNT</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">Extra Stake</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">REACHED</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">%PER TRADE</th> {/* Added dark mode border */}
                          <th className="border border-gray-400 dark:border-gray-600 px-2 py-1">PROFIT %</th> {/* Added dark mode border */}
                        </tr>
                      </thead>
                      <tbody>
                        {challengeData.map((row, index) => (
                          <tr
                            key={index}
                            className={cn(
                              index % 2 === 0 ? 'bg-red-100 dark:bg-red-900' : 'bg-red-50 dark:bg-red-800', // Added dark mode styles
                              row.reached === 'No' ? 'bg-red-200 dark:bg-red-700' : '' // Added dark mode styles
                            )}
                          >
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-bold text-gray-900 dark:text-gray-100">{row.day}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.balance.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">{row.perDay}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.session1.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.session2.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.session3.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.session4.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.session5.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.tfProfit.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100"> {/* Added dark mode styles */}
                              {row.withdraw > 0 ? `$${row.withdraw.toFixed(2)}` : ''}
                            </td>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">${row.stAmount.toFixed(2)}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100"> {/* Added dark mode styles */}
                              {row.extraStake > 0 ? `$${row.extraStake.toFixed(2)}` : ''}
                            </td>
                            <td className={cn(`border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-bold`, // Added dark mode border
                              row.reached === 'Yes' ? 'text-green-600' : row.reached === 'No' ? 'text-red-600' : 'text-gray-900 dark:text-gray-100' // Added dark mode text color
                            )}>
                              {row.reached}
                            </td>
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">{row.superTrade}</td> {/* Added dark mode styles */}
                            <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-bold text-blue-600"> {/* Added dark mode border */}
                              {row.profit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Summary */}
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between text-sm font-bold text-gray-900 dark:text-gray-100"> {/* Added dark mode styles */}
                    <div>OPENING BALANCE: $301.12</div>
                    <div>TOTAL PROFIT/WITHDRAW: $300.00 R 5,100.00</div>
                    <div>$ 418.12 $127.00</div>
                  </div>
                </div>

                {/* Side Panel */}
                <div className="w-64 border-l dark:border-gray-700"> {/* Added dark mode border */}
                  {/* ST/BALANCE Section */}
                  <div className="bg-red-600 text-white text-center py-2">
                    <div className="text-lg font-bold">$10</div>
                    <div className="text-sm">ST/BALANCE WITHDRAW%</div>
                    <div className="text-lg font-bold">100%</div>
                  </div>

                  {/* Sessions Table */}
                  <div className="bg-red-500 text-white text-center py-1 text-sm font-bold">
                    Session 1
                  </div>

                  <table className="w-full text-xs">
                    <tbody>
                      {sessionsData.map((session, index) => (
                        <tr key={index} className={cn(
                          session.status === 'Yes' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900' // Added dark mode styles
                        )}>
                          <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-gray-900 dark:text-gray-100">{session.session}</td> {/* Added dark mode styles */}
                          <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center text-gray-900 dark:text-gray-100">{session.time}</td> {/* Added dark mode styles */}
                          <td className={cn(`border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-bold`, // Added dark mode border
                            session.status === 'Yes' ? 'text-green-600' : 'text-red-600'
                          )}>
                            {session.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="bg-red-500 text-white text-center py-1 text-sm font-bold">
                    Session 2
                  </div>
                  <div className="bg-red-100 dark:bg-red-900 p-2 text-xs text-gray-900 dark:text-gray-100"> {/* Added dark mode styles */}
                    <div>17:00-18:00 No</div>
                    <div>18:00-19:00 No</div>
                    <div>20:00-21:00 No</div>
                    <div>21:00-22:00 No</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContainer>

          {/* New Custom Profits Table */}
          <AnimatedContainer delay={0.3}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Header with Title and Buttons */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b dark:border-gray-600">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Custom Profits Table</h2>
                <div className="flex gap-2">
                  <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleOpenAddProfitModal}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                    onClick={handleDeleteSelectedProfitRows}
                    disabled={selectedProfitRows.length === 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedProfitRows.length})
                  </Button>
                </div>
              </div>

              {/* Add/Edit Profit Row Form (Inline) */}
              {isProfitModalOpen && (
                <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">{editingProfitId !== null ? "Edit Profit Row" : "Add New Profit Row"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Day</label>
                      <Input
                        type="number"
                        placeholder="Day"
                        value={profitFormData.day}
                        onChange={(e) => handleProfitFormInputChange("day", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">% Per Day</label>
                      <Input
                        placeholder="% Per Day"
                        value={profitFormData.perDay}
                        onChange={(e) => handleProfitFormInputChange("perDay", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Balance</label>
                      <Input
                        type="number"
                        placeholder="Balance"
                        step="0.01"
                        value={profitFormData.balance}
                        onChange={(e) => handleProfitFormInputChange("balance", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Session 1</label>
                      <Input
                        type="number"
                        placeholder="Session 1"
                        step="0.01"
                        value={profitFormData.session1}
                        onChange={(e) => handleProfitFormInputChange("session1", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Session 2</label>
                      <Input
                        type="number"
                        placeholder="Session 2"
                        step="0.01"
                        value={profitFormData.session2}
                        onChange={(e) => handleProfitFormInputChange("session2", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Session 3</label>
                      <Input
                        type="number"
                        placeholder="Session 3"
                        step="0.01"
                        value={profitFormData.session3}
                        onChange={(e) => handleProfitFormInputChange("session3", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Session 4</label>
                      <Input
                        type="number"
                        placeholder="Session 4"
                        step="0.01"
                        value={profitFormData.session4}
                        onChange={(e) => handleProfitFormInputChange("session4", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Session 5</label>
                      <Input
                        type="number"
                        placeholder="Session 5"
                        step="0.01"
                        value={profitFormData.session5}
                        onChange={(e) => handleProfitFormInputChange("session5", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">T/Profit</label>
                      <Input
                        type="number"
                        placeholder="T/Profit"
                        step="0.01"
                        value={profitFormData.tfProfit}
                        onChange={(e) => handleProfitFormInputChange("tfProfit", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Withdraw</label>
                      <Input
                        type="number"
                        placeholder="Withdraw"
                        step="0.01"
                        value={profitFormData.withdraw}
                        onChange={(e) => handleProfitFormInputChange("withdraw", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">ST/Amount</label>
                      <Input
                        type="number"
                        placeholder="ST/Amount"
                        step="0.01"
                        value={profitFormData.stAmount}
                        onChange={(e) => handleProfitFormInputChange("stAmount", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Lot Size</label>
                      <Input
                        type="number"
                        placeholder="Lot Size"
                        step="0.01"
                        value={profitFormData.lotSize}
                        onChange={(e) => handleProfitFormInputChange("lotSize", e.target.value)}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-700 dark:text-gray-300">Reached</label>
                      <Select
                        value={profitFormData.reached}
                        onValueChange={(value) => handleProfitFormInputChange("reached", value)}
                      >
                        <SelectTrigger className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem> {/* Changed value from "" to "N/A" */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsProfitModalOpen(false)}>Cancel</Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSaveProfitRow}>
                      {editingProfitId !== null ? "Save Changes" : "Add Row"}
                    </Button>
                  </div>
                </div>
              )}


              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-teal-900"> {/* Header background color */}
                    <TableRow>
                      <TableHead className="w-[40px] text-white font-bold"></TableHead> {/* Checkbox column */}
                      <TableHead className="text-white font-bold">DAYS</TableHead>
                      <TableHead className="text-white font-bold">% PER DAY</TableHead>
                      <TableHead className="text-white font-bold">BALANCE</TableHead>
                      <TableHead className="text-white font-bold">SESSION 1</TableHead>
                      <TableHead className="text-white font-bold">SESSION 2</TableHead>
                      <TableHead className="text-white font-bold">SESSION 3</TableHead>
                      <TableHead className="text-white font-bold">SESSION 4</TableHead>
                      <TableHead className="text-white font-bold">SESSION 5</TableHead>
                      <TableHead className="text-white font-bold">T/PROFIT</TableHead>
                      <TableHead className="text-white font-bold">WITHDRAW</TableHead>
                      <TableHead className="text-white font-bold">ST/AMOUNT</TableHead>
                      <TableHead className="text-white font-bold">Lot Size</TableHead>
                      <TableHead className="text-white font-bold">REACHED</TableHead>
                      <TableHead className="text-white font-bold">ACTIONS</TableHead> {/* Actions column */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Render rows from customProfitsData */}
                    {customProfitsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={15} className="text-center text-gray-500 dark:text-gray-400 py-4">
                          No data available. Click "Add" to add a row.
                        </TableCell>
                      </TableRow>
                    ) : (
                      customProfitsData.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                           <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedProfitRows.includes(row.id)}
                              onChange={() => handleSelectProfitRow(row.id)}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{row.day}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{row.perDay}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.balance === "number" ? `$${row.balance.toFixed(2)}` : row.balance}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.session1 === "number" ? row.session1.toFixed(2) : row.session1}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.session2 === "number" ? row.session2.toFixed(2) : row.session2}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.session3 === "number" ? row.session3.toFixed(2) : row.session3}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.session4 === "number" ? row.session4.toFixed(2) : row.session4}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.session5 === "number" ? row.session5.toFixed(2) : row.session5}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.tfProfit === "number" ? `$${row.tfProfit.toFixed(2)}` : row.tfProfit}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.withdraw === "number" ? `$${row.withdraw.toFixed(2)}` : row.withdraw}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.stAmount === "number" ? `$${row.stAmount.toFixed(2)}` : row.stAmount}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.lotSize === "number" ? row.lotSize.toFixed(2) : row.lotSize}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{row.reached}</TableCell>
                           <TableCell>
                            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleOpenEditProfitModal(row)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      {/* Add/Edit Profit Row Modal */}
      {/* Removed Dialog component */}

    </div>
  );
};

export default ThirtyDaysProfitsPage;
