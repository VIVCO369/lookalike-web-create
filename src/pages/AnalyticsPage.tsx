import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "@/lib/utils";
import { BarChart3, Eye, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import StatsCard from "../components/StatsCard"; // Import StatsCard

// Sample trade data (using the same data for both tables as a placeholder)
const sampleTrades = [
  { id: 1, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:32", tradeTime: "13h 25m 23s", timeframe: "M1", trend: "Up", lotSize: "0.10", candles: "Loss", wl: "-23.11", netProfit: "-23.11", balance: "1000.00" },
  { id: 2, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:31", tradeTime: "13h 11m 56s", timeframe: "M5", trend: "Down", lotSize: "0.50", candles: "Loss", wl: "-21.80", netProfit: "-21.80", balance: "976.89" },
  { id: 3, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:31", tradeTime: "13h 2m 47s", timeframe: "M15", trend: "Sideways", lotSize: "0.01", candles: "Loss", wl: "-21.12", netProfit: "-21.12", balance: "955.09" },
  { id: 4, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:31", tradeTime: "13h 25m 23s", timeframe: "H1", trend: "Up", lotSize: "0.20", candles: "Loss", wl: "-23.11", netProfit: "-23.11", balance: "933.97" },
  { id: 5, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:30", tradeTime: "13h 11m 56s", timeframe: "H4", trend: "Down", lotSize: "0.30", candles: "Loss", wl: "-21.80", netProfit: "-21.80", balance: "910.86" },
];


const AnalyticsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={cn("flex-1 flex flex-col overflow-y-auto", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-medium text-gray-700">Analytics</h1>
          </div>
          {/* You can add header elements specific to the analytics page here */}
          <div>
            {/* Placeholder for date/time or other header info */}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-full mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Trade History Analytics</h2>

            {/* Analytics Stats Cards */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                  title="Balance"
                  value="$10.00" // Placeholder value
                  color="text-green-500"
                  borderColor="border-green-500"
                />
                <StatsCard
                  title="Net Profit"
                  value="$-216.84" // Placeholder value
                  color="text-red-500"
                  borderColor="border-red-500"
                />
                <StatsCard
                  title="Win Rate"
                  value="0%" // Placeholder value
                  color="text-gray-700"
                  borderColor="border-gray-200"
                />
                <StatsCard
                  title="Best Trade"
                  value="+$0" // Placeholder value
                  color="text-green-500"
                  borderColor="border-green-500"
                />
                <StatsCard
                  title="Worst Trade"
                  value="$-23.11" // Placeholder value
                  color="text-red-500"
                  borderColor="border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <StatsCard
                  title="Total Trades"
                  value={sampleTrades.length.toString()} // Using sample data length
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
                <StatsCard
                  title="Daily Target"
                  value="$0.00" // Placeholder value
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
                 <StatsCard
                  title="Daily Profit"
                  value="+$0.00" // Placeholder value
                  color="text-green-500"
                  labelPosition="below"
                  borderColor="border-gray-200"
                />
              </div>
            </div>


            {/* Dashboard History Table Card */}
            <Card className="mb-8"> {/* Wrapped in Card */}
              <CardHeader> {/* Added CardHeader */}
                <CardTitle className="text-xl font-medium text-gray-700">Dashboard History (Sample)</CardTitle> {/* Added CardTitle */}
              </CardHeader>
              <CardContent className="p-0"> {/* Added CardContent with p-0 to remove default padding */}
                <div className="overflow-x-auto"> {/* Kept overflow-x-auto for table */}
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
                      {/* Displaying a subset of data for dashboard history simulation */}
                      {sampleTrades.slice(0, 2).map((trade) => (
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
                          <TableCell className="text-red-500">{trade.wl}</TableCell>
                          <TableCell className="text-red-500">{trade.netProfit}</TableCell>
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
                  <div className="px-4 py-3 text-xs text-gray-500">
                    Showing 1 to 2 of {sampleTrades.length} results (Sample)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Removed Trade Demo History Table Card */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
