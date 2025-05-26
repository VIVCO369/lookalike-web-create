import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import AnimatedContainer from "@/components/AnimatedContainer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, Edit, Pencil } from "lucide-react"; // Import Target, Plus, Trash2, Edit, Pencil icons
import { Button } from "@/components/ui/button"; // Import Button component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table components
import { Input } from "@/components/ui/input"; // Import Input component
import useLocalStorage from "@/hooks/useLocalStorage"; // Import useLocalStorage

// Define the type for a custom target row
interface CustomTargetRow {
  id: string; // Unique ID for each row
  week: string;
  days: number | string;
  amount: number | string;
  dailyProfit: string;
  lotSize: number | string;
  amountTrade: number | string;
  trades: number | string;
}

const ThirtyDaysTargetPage = () => {
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

  // Data matching the image provided for the first table
  const targetData = [
    { week: "Week", days: "Days", amount: "Amount", dailyProfit: "Daily Profit", lotSize: "Lot Size", amountTrade: "Amount Trade", trades: "Trades" },
    { week: "✓", days: 1, amount: 20.00, dailyProfit: "10%", lotSize: 2.00, amountTrade: 0.20, trades: 6 },
    { week: "✓", days: 2, amount: 22.00, dailyProfit: "10%", lotSize: 2.20, amountTrade: 0.20, trades: 6 },
    { week: "✓", days: 3, amount: 24.20, dailyProfit: "10%", lotSize: 2.42, amountTrade: 0.20, trades: 6 },
    { week: "✓", days: 4, amount: 26.62, dailyProfit: "10%", lotSize: 2.66, amountTrade: 0.20, trades: 6 },
    { week: "$9.28", days: 5, amount: 29.28, dailyProfit: "10%", lotSize: 2.93, amountTrade: 0.25, trades: 10 },
    { week: "□", days: 6, amount: 32.21, dailyProfit: "10%", lotSize: 3.22, amountTrade: 0.20, trades: 12 },
    { week: "□", days: 7, amount: 35.43, dailyProfit: "10%", lotSize: 3.54, amountTrade: 0.20, trades: 12 },
    { week: "□", days: 8, amount: 38.97, dailyProfit: "10%", lotSize: 3.90, amountTrade: 0.20, trades: 12 },
    { week: "□", days: 9, amount: 42.87, dailyProfit: "10%", lotSize: 4.29, amountTrade: 0.20, trades: 12 },
    { week: "-$17.88", days: 10, amount: 47.16, dailyProfit: "10%", lotSize: 4.72, amountTrade: 0.35, trades: 12 },
    { week: "□", days: 11, amount: 51.87, dailyProfit: "", lotSize: 5.19, amountTrade: 7, trades: 15 },
    { week: "□", days: 12, amount: 57.06, dailyProfit: "", lotSize: 5.71, amountTrade: 7, trades: 15 },
    { week: "□", days: 13, amount: 62.77, dailyProfit: "", lotSize: 6.28, amountTrade: 7, trades: 15 },
    { week: "□", days: 14, amount: 69.05, dailyProfit: "", lotSize: 6.90, amountTrade: 7, trades: 15 },
    { week: "-$28.79", days: 15, amount: 75.95, dailyProfit: "", lotSize: 7.59, amountTrade: 7, trades: 15 },
    { week: "□", days: 16, amount: 83.54, dailyProfit: "8%", lotSize: 6.68, amountTrade: 9, trades: 20 },
    { week: "□", days: 17, amount: 90.23, dailyProfit: "8%", lotSize: 7.22, amountTrade: 9, trades: 20 },
    { week: "□", days: 18, amount: 97.45, dailyProfit: "8%", lotSize: 7.80, amountTrade: 9, trades: 20 },
    { week: "□", days: 19, amount: 105.24, dailyProfit: "8%", lotSize: 8.42, amountTrade: 9, trades: 20 },
    { week: "-$37.71", days: 20, amount: 113.66, dailyProfit: "8%", lotSize: 9.09, amountTrade: 9, trades: 20 },
    { week: "□", days: 21, amount: 122.75, dailyProfit: "8%", lotSize: 9.82, amountTrade: 10, trades: 30 },
    { week: "□", days: 22, amount: 132.58, dailyProfit: "8%", lotSize: 10.61, amountTrade: 10, trades: 30 },
    { week: "□", days: 23, amount: 143.18, dailyProfit: "8%", lotSize: 11.45, amountTrade: 10, trades: 30 },
    { week: "□", days: 24, amount: 154.64, dailyProfit: "8%", lotSize: 12.37, amountTrade: 10, trades: 30 },
    { week: "-$53.34", days: 25, amount: 167.01, dailyProfit: "8%", lotSize: 13.36, amountTrade: 10, trades: 30 },
    { week: "□", days: 26, amount: 180.37, dailyProfit: "6%", lotSize: 10.82, amountTrade: 12, trades: 5 },
    { week: "□", days: 27, amount: 191.19, dailyProfit: "6%", lotSize: 11.47, amountTrade: 12, trades: 5 },
    { week: "□", days: 28, amount: 202.66, dailyProfit: "6%", lotSize: 12.16, amountTrade: 12, trades: 5 },
    { week: "□", days: 29, amount: 214.82, dailyProfit: "6%", lotSize: 12.89, amountTrade: 12, trades: 5 },
    { week: "-$60.70", days: 30, amount: 227.71, dailyProfit: "6%", lotSize: 13.66, amountTrade: 12, trades: 5 }
  ];

  // State for the new table data, persisted with useLocalStorage
  const [customTargetData, setCustomTargetData] = useLocalStorage<CustomTargetRow[]>("customTargetData", []);

  // State for managing the add/edit form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<CustomTargetRow, 'id'>>({
    week: "",
    days: "",
    amount: "",
    dailyProfit: "",
    lotSize: "",
    amountTrade: "",
    trades: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null); // State to track which row is being edited

  // State for selected rows to delete
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // State for the custom table title, persisted with useLocalStorage
  const [customTableTitle, setCustomTableTitle] = useLocalStorage<string>("customTargetTableTitle", "Custom Target Table");
  // State to track if the title is being edited
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  // State to hold the temporary title value while editing
  const [tempTitle, setTempTitle] = useState(customTableTitle);


  const getRowClass = (index: number, week: string | number) => {
    if (index === 0) return "bg-green-600 text-white font-bold"; // Header
    if (typeof week === "string" && week.includes("$")) {
      return "bg-green-500 text-white font-bold"; // Weekly totals
    }
    if (typeof week === "string" && week === "✓") {
      return "bg-green-100 dark:bg-green-900"; // Completed days - Added dark mode style
    }
    return "bg-white dark:bg-gray-800"; // Regular days - Added dark mode style
  };

  const getCellClass = (colIndex: number, value: any) => {
    // Highlight specific cells with yellow background
    if (colIndex === 4 && typeof value === "number") {
      return "bg-yellow-300 dark:bg-yellow-700 font-bold text-gray-900 dark:text-gray-100"; // Added dark mode styles
    }
    if (colIndex === 6 && typeof value === "number") {
      return "bg-yellow-300 dark:bg-yellow-700 font-bold text-gray-900 dark:text-gray-100"; // Added dark mode styles
    }
    return "text-gray-900 dark:text-gray-100"; // Default text color - Added dark mode style
  };

  // Handle input changes in the form
  const handleInputChange = (field: keyof Omit<CustomTargetRow, 'id'>, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle adding or saving a row
  const handleSaveRow = () => {
    if (editingId) {
      // Update existing row
      setCustomTargetData(customTargetData.map(row =>
        row.id === editingId ? { ...row, ...formData, id: editingId } : row
      ));
      setEditingId(null);
    } else {
      // Add new row
      const newRow: CustomTargetRow = {
        id: Date.now().toString(), // Simple unique ID
        ...formData,
        days: parseInt(formData.days as string) || formData.days, // Convert to number if possible
        amount: parseFloat(formData.amount as string) || formData.amount, // Convert to number if possible
        lotSize: parseFloat(formData.lotSize as string) || formData.lotSize, // Convert to number if possible
        amountTrade: parseFloat(formData.amountTrade as string) || formData.amountTrade, // Convert to number if possible
        trades: parseInt(formData.trades as string) || formData.trades, // Convert to number if possible
      };
      setCustomTargetData([...customTargetData, newRow]);
    }

    // Reset form and hide it
    setFormData({
      week: "",
      days: "",
      amount: "",
      dailyProfit: "",
      lotSize: "",
      amountTrade: "",
      trades: "",
    });
    setShowForm(false);
  };

  // Handle deleting selected rows
  const handleDeleteRows = () => {
    setCustomTargetData(customTargetData.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]); // Clear selection after deleting
  };

  // Handle selecting/deselecting a row
  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle editing a row
  const handleEditRow = (row: CustomTargetRow) => {
    setEditingId(row.id);
    setFormData({
      week: row.week,
      days: row.days,
      amount: row.amount,
      dailyProfit: row.dailyProfit,
      lotSize: row.lotSize,
      amountTrade: row.amountTrade,
      trades: row.trades,
    });
    setShowForm(true); // Show the form for editing
  };

  // Handle canceling add/edit
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      week: "",
      days: "",
      amount: "",
      dailyProfit: "",
      lotSize: "",
      amountTrade: "",
      trades: "",
    });
  };

  // Function to determine row background color based on trades count
  const getCustomRowClass = (trades: number | string) => {
    const tradesNumber = typeof trades === 'number' ? trades : parseInt(trades as string);
    // Check if tradesNumber is a valid number and a multiple of 5
    if (!isNaN(tradesNumber) && tradesNumber > 0 && tradesNumber % 5 === 0) {
      return "bg-green-100 dark:bg-green-900"; // Green background for multiples of 5
    }
    return "bg-white dark:bg-gray-800"; // Default background
  };

  // Handle saving the custom table title
  const handleSaveTitle = () => {
    setCustomTableTitle(tempTitle);
    setIsEditingTitle(false);
  };

  // Handle canceling title editing
  const handleCancelEditTitle = () => {
    setTempTitle(customTableTitle); // Revert to the saved title
    setIsEditingTitle(false);
  };


  return (
    <div className="min-h-screen bg-background flex w-full">
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
            <Target className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Added icon and dark mode text color */}
            <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">30 Days Target</h1> {/* Added title and dark mode text color */}
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

          {/* First Table: $20 To $100 in 30 Days */}
          <AnimatedContainer delay={0.2}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"> {/* Added margin-bottom */}
              {/* Header */}
              <div className="bg-black text-white text-center py-3">
                <h2 className="text-xl font-bold">$20 To $100 in 30 Days</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {targetData.map((row, index) => (
                      <tr key={index} className={getRowClass(index, row.week)}>
                        <td className={cn(`border border-gray-400 dark:border-gray-600 px-3 py-2 text-center`, getCellClass(0, row.week))}>
                          {row.week}
                        </td>
                        <td className={cn(`border border-gray-400 dark:border-gray-600 px-3 py-2 text-center`, getCellClass(1, row.days))}>
                          {row.days}
                        </td>
                        <td className={cn(`border border-gray-400 dark:border-gray-600 px-3 py-2 text-center`, getCellClass(2, row.amount))}>
                          {typeof row.amount === "number" ? `$${row.amount.toFixed(2)}` : row.amount}
                        </td>
                        <td className={cn(`border border-gray-400 dark:border-gray-600 px-3 py-2 text-center`, getCellClass(3, row.dailyProfit))}>
                          {row.dailyProfit}
                        </td>
                        <td className={cn(`border border-gray-400 dark:border-gray-600 px-3 py-2 text-center`, getCellClass(4, row.lotSize))}>
                          {typeof row.lotSize === "number" ? `$${row.lotSize.toFixed(2)}` : row.lotSize}
                        </td>
                        <td className={cn(`border border-gray-400 dark:border-gray-600 px-3 py-2 text-center`, getCellClass(5, row.amountTrade))}>
                          {typeof row.amountTrade === "number" ? row.amountTrade.toFixed(2) : row.amountTrade}
                        </td>
                        <td className={cn(`border border-gray-400 dark:border-gray-600 px-3 py-2 text-center`, getCellClass(6, row.trades))}>
                          {row.trades}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedContainer>

          {/* Second Table: Custom Target Table */}
          <AnimatedContainer delay={0.3}>
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Header and Buttons */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-6 py-3 border-b dark:border-gray-600">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 flex-grow">
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="text-xl font-bold text-gray-900 dark:text-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                    />
                    <Button size="sm" onClick={handleSaveTitle} className="bg-blue-500 hover:bg-blue-600 text-white">Save</Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEditTitle}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{customTableTitle}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingTitle(true)} className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ week: "", days: "", amount: "", dailyProfit: "", lotSize: "", amountTrade: "", trades: "" }); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                  <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50" onClick={handleDeleteRows} disabled={selectedRows.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedRows.length})
                  </Button>
                </div>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">{editingId ? "Edit Row" : "Add New Row"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Week"
                      value={formData.week}
                      onChange={(e) => handleInputChange("week", e.target.value)}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                    />
                    <Input
                      type="number"
                      placeholder="Days"
                      value={formData.days}
                      onChange={(e) => handleInputChange("days", e.target.value)}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                    />
                    <Input
                      placeholder="Daily Profit"
                      value={formData.dailyProfit}
                      onChange={(e) => handleInputChange("dailyProfit", e.target.value)}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                    />
                    <Input
                      type="number"
                      placeholder="Lot Size"
                      value={formData.lotSize}
                      onChange={(e) => handleInputChange("lotSize", e.target.value)}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                    />
                    <Input
                      type="number"
                      placeholder="Amount Trade"
                      value={formData.amountTrade}
                      onChange={(e) => handleInputChange("amountTrade", e.target.value)}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                    />
                    <Input
                      type="number"
                      placeholder="Trades"
                      value={formData.trades}
                      onChange={(e) => handleInputChange("trades", e.target.value)}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleCancelForm}>Cancel</Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSaveRow}>
                      {editingId ? "Save Changes" : "Add Row"}
                    </Button>
                  </div>
                </div>
              )}


              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-green-600"> {/* Changed background class to green-600 */}
                    <TableRow>
                      <TableHead className="w-[40px] text-gray-900 dark:text-gray-100"></TableHead> {/* Checkbox column - Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Week</TableHead> {/* Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Days</TableHead> {/* Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Amount</TableHead> {/* Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Daily Profit</TableHead> {/* Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Lot Size</TableHead> {/* Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Amount Trade</TableHead> {/* Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Trades</TableHead> {/* Changed text color */}
                      <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead> {/* Actions column - Changed text color */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Render rows from customTargetData */}
                    {customTargetData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-gray-500 dark:text-gray-400 py-4">
                          No data available. Click "Add" to add a row.
                        </TableCell>
                      </TableRow>
                    ) : (
                      customTargetData.map((row) => (
                        <TableRow key={row.id} className={cn("hover:bg-gray-50 dark:hover:bg-gray-700", getCustomRowClass(row.trades))}> {/* Apply conditional class */}
                           <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(row.id)}
                              onChange={() => handleSelectRow(row.id)}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{row.week}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{row.days}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.amount === "number" ? `$${row.amount.toFixed(2)}` : row.amount}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{row.dailyProfit}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.lotSize === "number" ? `$${row.lotSize.toFixed(2)}` : row.lotSize}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{typeof row.amountTrade === "number" ? row.amountTrade.toFixed(2) : row.amountTrade}</TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-100">{row.trades}</TableCell>
                           <TableCell>
                            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleEditRow(row)}>
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
    </div>
  );
};

export default ThirtyDaysTargetPage;
