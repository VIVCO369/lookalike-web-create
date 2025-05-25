import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react"; // Import Trash2 icon
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTradeData, TradeFormData } from "@/contexts/TradeDataContext";
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
import AnimatedContainer from "@/components/AnimatedContainer"; // Import AnimatedContainer
import { motion } from "framer-motion"; // Import motion


interface DetailedDataProps {
  showAddTrade?: boolean;
  accountType: 'real' | 'demo' | 'trade-tools'; // Add accountType prop
  onResetTrades?: () => void; // Add prop for reset function
  tradeCount?: number; // Add prop for trade count
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

const DetailedData = ({ showAddTrade = false, accountType, onResetTrades, tradeCount = 0 }: DetailedDataProps) => {
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
    // Add the trade to the shared context, specifying the account type
    addTrade(formData, accountType);

    toast({
      title: "Trade Added",
      description: `Your ${accountType} trade has been successfully saved`,
    });

    // Reset the form to initial values after submission
    setFormData(initialTradeFormData);

    // Close the form
    setShowTradeForm(false);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xl font-medium text-gray-700 flex items-center gap-1">
          {accountType === 'real' ? 'Real Trading Detail' : accountType === 'demo' ? 'Demo Trading Detail' : 'Trade Tools Detail'} {/* Dynamic title */}
        </span>
        <div className="flex gap-2"> {/* Flex container for buttons */}
          {showAddTrade && (
            <Button
              onClick={toggleTradeForm}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> New Trade
            </Button>
          )}
          {/* Reset Trades Button with AlertDialog - show if onResetTrades is provided */}
          {onResetTrades && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
                  <Trash2 className="mr-2 h-4 w-4" /> Reset Trades {/* Changed button text */}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your {accountType === 'real' ? 'dashboard real' : accountType === 'demo' ? 'demo' : 'trade tools'} trade data ({tradeCount} trades). {/* Dynamic description */}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  {/* Call onResetTrades directly */}
                  <AlertDialogAction onClick={onResetTrades}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Add Trade Form */}
      {showTradeForm && (
        <AnimatedContainer delay={0.1}>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Add New Trade Entry ({accountType === 'real' ? 'Real' : accountType === 'demo' ? 'Demo' : 'Trade Tools'})</h3> {/* Dynamic form title */}
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
        </AnimatedContainer>
      )}
    </div>
  );
};

export default DetailedData;
