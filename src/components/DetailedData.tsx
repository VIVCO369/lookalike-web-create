import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTradeData, TradeFormData } from "@/contexts/TradeDataContext";

interface DetailedDataProps {
  showAddTrade?: boolean;
}

// Define the form state interface
interface TradeFormData {
  strategy: string;
  pair: string;
  type: string;
  openTime: string;
  tradeTime: string;
  timeframe: string;
  trend: string;
  lotSize: string;
  winLoss: string;
  netProfit: string;
  balance: string;
  candles: string;
}

const initialTradeFormData: TradeFormData = {
  strategy: "",
  pair: "",
  type: "buy",
  openTime: "",
  tradeTime: "",
  timeframe: "m1",
  trend: "up",
  lotSize: "0.01",
  winLoss: "win",
  netProfit: "0.00",
  balance: "0.00",
  candles: ""
};

const DetailedData = ({ showAddTrade = false }: DetailedDataProps) => {
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [formData, setFormData] = useState<TradeFormData>(initialTradeFormData);
  const { toast } = useToast();
  const { addTrade } = useTradeData();

  const toggleTradeForm = () => {
    setShowTradeForm(!showTradeForm);
  };

  const handleInputChange = (field: keyof TradeFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Add the trade to the shared context
    addTrade(formData);
    
    toast({
      title: "Trade Added",
      description: "Your trade has been successfully saved to Trading Details",
    });
    
    // Reset the form to initial values after submission
    setFormData(initialTradeFormData);
    
    // Close the form
    setShowTradeForm(false);
  };

  return (
    <div className="mt-8">
      {/* Removed the h2 heading from here */}

      <div className="flex items-center justify-between mb-4">
        {/* Styled this span to match "Your Highlights" */}
        <span className="text-xl font-medium text-gray-700 flex items-center gap-1">
          {/* Removed the green dot span */}
          Trading Detail
        </span>
        {showAddTrade && (
          <Button
            onClick={toggleTradeForm}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Trade
          </Button>
        )}
      </div>

      {/* Add Trade Form */}
      {showTradeForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Add New Trade Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Strategy</label>
                <Input 
                  placeholder="Strategy" 
                  value={formData.strategy}
                  onChange={(e) => handleInputChange("strategy", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Pair</label>
                <Select 
                  value={formData.pair}
                  onValueChange={(value) => handleInputChange("pair", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Trading Pair" />
                  </SelectTrigger>
                  <SelectContent>
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
                <label className="text-sm">Type</label>
                <Select 
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
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
                <Input 
                  type="datetime-local" 
                  value={formData.openTime}
                  onChange={(e) => handleInputChange("openTime", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Trade Time</label>
                <Input 
                  placeholder="Trade Time" 
                  value={formData.tradeTime}
                  onChange={(e) => handleInputChange("tradeTime", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Timeframe</label>
                <Select 
                  value={formData.timeframe}
                  onValueChange={(value) => handleInputChange("timeframe", value)}
                >
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
                <Select 
                  value={formData.trend}
                  onValueChange={(value) => handleInputChange("trend", value)}
                >
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
                <Input 
                  type="number" 
                  placeholder="0.01" 
                  step="0.01" 
                  value={formData.lotSize}
                  onChange={(e) => handleInputChange("lotSize", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Win/Loss</label>
                <Select 
                  value={formData.winLoss}
                  onValueChange={(value) => handleInputChange("winLoss", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Net Profit</label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  step="0.01" 
                  value={formData.netProfit}
                  onChange={(e) => handleInputChange("netProfit", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Balance</label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  step="0.01" 
                  value={formData.balance}
                  onChange={(e) => handleInputChange("balance", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Candles</label>
                <Input 
                  placeholder="Candles" 
                  value={formData.candles}
                  onChange={(e) => handleInputChange("candles", e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={toggleTradeForm}>Cancel</Button>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleSubmit}
              >
                Add Trade
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedData;
