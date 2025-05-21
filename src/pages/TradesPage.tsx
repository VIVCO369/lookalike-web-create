
import { Eye, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TradesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddTrade, setShowAddTrade] = useState(false);

  // Sample trade data
  const trades = [
    { id: 1, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:32", tradeTime: "13h 25m 23s", timeframe: "M1", trend: "Up", lotSize: "0.10", candles: "Loss", wl: "-23.11", netProfit: "-23.11", balance: "1000.00" },
    { id: 2, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:31", tradeTime: "13h 11m 56s", timeframe: "M5", trend: "Down", lotSize: "0.50", candles: "Loss", wl: "-21.80", netProfit: "-21.80", balance: "976.89" },
    { id: 3, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:31", tradeTime: "13h 2m 47s", timeframe: "M15", trend: "Sideways", lotSize: "0.01", candles: "Loss", wl: "-21.12", netProfit: "-21.12", balance: "955.09" },
    { id: 4, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:31", tradeTime: "13h 25m 23s", timeframe: "H1", trend: "Up", lotSize: "0.20", candles: "Loss", wl: "-23.11", netProfit: "-23.11", balance: "933.97" },
    { id: 5, strategy: "None", pair: "Boom 500 Index", type: "Buy", openTime: "2023-03-18T06:30", tradeTime: "13h 11m 56s", timeframe: "H4", trend: "Down", lotSize: "0.30", candles: "Loss", wl: "-21.80", netProfit: "-21.80", balance: "910.86" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAddTrade = () => {
    setShowAddTrade(!showAddTrade);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-medium text-gray-700">Detailed Data</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">1M</Button>
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">5M</Button>
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">15M</Button>
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">1H</Button>
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">4H</Button>
              <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">1D</Button>
            </div>
            <div>
              <p className="text-red-500">Trend: Down Trend</p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-500 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Trades
              </span>
            </div>
            <Button onClick={toggleAddTrade} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Trade
            </Button>
          </div>

          {/* Add Trade Form */}
          {showAddTrade && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Add New Trade Entry</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm">Strategy</label>
                    <Input placeholder="Strategy" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Pair</label>
                    <Input placeholder="Trading Pair" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Type</label>
                    <Select defaultValue="buy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Open Time</label>
                    <Input type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Trade Time</label>
                    <Input placeholder="Trade Time" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Timeframe</label>
                    <Select defaultValue="m1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m1">M1</SelectItem>
                        <SelectItem value="m5">M5</SelectItem>
                        <SelectItem value="m15">M15</SelectItem>
                        <SelectItem value="h1">H1</SelectItem>
                        <SelectItem value="h4">H4</SelectItem>
                        <SelectItem value="d1">D1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Trend</label>
                    <Select defaultValue="up">
                      <SelectTrigger>
                        <SelectValue placeholder="Select trend" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Up</SelectItem>
                        <SelectItem value="down">Down</SelectItem>
                        <SelectItem value="sideways">Sideways</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Lot Size</label>
                    <Input type="number" placeholder="0.01" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Net Profit</label>
                    <Input type="number" placeholder="0.00" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Balance</label>
                    <Input type="number" placeholder="0.00" step="0.01" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={toggleAddTrade}>Cancel</Button>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">Add Trade</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trades Table */}
          <div className="bg-white rounded-md shadow">
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
                {trades.map((trade) => (
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

            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing 1 to 5 of 15 results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradesPage;
