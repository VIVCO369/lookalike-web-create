import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCard from "@/components/StatsCard";
import AnimatedContainer from "@/components/AnimatedContainer";
import { Target, TrendingUp, Calculator, DollarSign, Percent, Clock } from "lucide-react";

const TradeManageTargetPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const targets = [
    { id: 1, symbol: "AAPL", entryPrice: "$150.00", targetPrice: "$165.00", currentPrice: "$158.20", profit: "$820", status: "Active" },
    { id: 2, symbol: "TSLA", entryPrice: "$210.00", targetPrice: "$230.00", currentPrice: "$225.50", profit: "$1,550", status: "Near Target" },
    { id: 3, symbol: "MSFT", entryPrice: "$320.00", targetPrice: "$350.00", currentPrice: "$335.80", profit: "$1,580", status: "Active" },
    { id: 4, symbol: "GOOGL", entryPrice: "$125.00", targetPrice: "$140.00", currentPrice: "$138.75", profit: "$1,375", status: "Near Target" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Near Target": return "text-green-600 bg-green-100";
      case "Active": return "text-blue-600 bg-blue-100";
      case "Reached": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen flex w-full" style={{ backgroundColor: '#f7f5f0' }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6">
          <AnimatedContainer>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trade Targets</h1>
              <p className="text-gray-600">Set and monitor your trade targets and profit objectives</p>
            </div>
          </AnimatedContainer>

          {/* Stats Overview */}
          <AnimatedContainer delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Active Targets"
                value="4"
                color="text-blue-600"
                borderColor="border-blue-200"
              />
              <StatsCard
                title="Targets Hit Today"
                value="2"
                color="text-green-600"
                borderColor="border-green-200"
              />
              <StatsCard
                title="Avg Target Achievement"
                value="73%"
                color="text-purple-600"
                borderColor="border-purple-200"
              />
              <StatsCard
                title="Total Target Profit"
                value="$5,325"
                color="text-orange-600"
                borderColor="border-orange-200"
              />
            </div>
          </AnimatedContainer>

          {/* Target Calculator */}
          <AnimatedContainer delay={0.3}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Target Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input id="symbol" placeholder="e.g., AAPL" />
                  </div>
                  <div>
                    <Label htmlFor="entryPrice">Entry Price</Label>
                    <Input id="entryPrice" type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <Label htmlFor="riskReward">Risk:Reward Ratio</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="1:2">1:2</SelectItem>
                        <SelectItem value="1:3">1:3</SelectItem>
                        <SelectItem value="1:4">1:4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stopLoss">Stop Loss</Label>
                    <Input id="stopLoss" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Calculated Target</p>
                      <p className="text-xl font-bold text-green-600">$165.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Potential Profit</p>
                      <p className="text-xl font-bold text-blue-600">$1,500</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Risk Amount</p>
                      <p className="text-xl font-bold text-red-600">$750</p>
                    </div>
                  </div>
                </div>
                <Button className="mt-4">
                  <Target className="h-4 w-4 mr-2" />
                  Set Target
                </Button>
              </CardContent>
            </Card>
          </AnimatedContainer>

          {/* Active Targets */}
          <AnimatedContainer delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Active Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Symbol</th>
                        <th className="text-left p-3">Entry Price</th>
                        <th className="text-left p-3">Target Price</th>
                        <th className="text-left p-3">Current Price</th>
                        <th className="text-left p-3">Profit/Loss</th>
                        <th className="text-left p-3">Progress</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {targets.map((target, index) => {
                        const entryPrice = parseFloat(target.entryPrice.replace('$', ''));
                        const currentPrice = parseFloat(target.currentPrice.replace('$', ''));
                        const targetPrice = parseFloat(target.targetPrice.replace('$', ''));
                        const progress = Math.min(((currentPrice - entryPrice) / (targetPrice - entryPrice)) * 100, 100);
                        
                        return (
                          <AnimatedContainer key={target.id} delay={0.5 + index * 0.1}>
                            <tr className="border-b hover:bg-gray-50 transition-colors">
                              <td className="p-3 font-semibold">{target.symbol}</td>
                              <td className="p-3">{target.entryPrice}</td>
                              <td className="p-3">{target.targetPrice}</td>
                              <td className="p-3 font-semibold text-blue-600">{target.currentPrice}</td>
                              <td className="p-3 font-semibold text-green-600">{target.profit}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${Math.max(0, progress)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{Math.round(progress)}%</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(target.status)}`}>
                                  {target.status}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button variant="outline" size="sm">Close</Button>
                                </div>
                              </td>
                            </tr>
                          </AnimatedContainer>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default TradeManageTargetPage;
