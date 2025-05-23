import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DetailedDataProps {
  showAddTrade?: boolean;
}

const DetailedData = ({ showAddTrade = false }: DetailedDataProps) => {
  const [showTradeForm, setShowTradeForm] = useState(false);

  const toggleTradeForm = () => {
    setShowTradeForm(!showTradeForm);
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
                <Input placeholder="Strategy" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Pair</label>
                {/* Replaced Input with Select and added options */}
                <Select defaultValue="">
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
                <label className="text-sm">Win/Loss</label>
                <Select defaultValue="win">
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
                <Input type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Balance</label>
                <Input type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Candles</label>
                <Input placeholder="Candles" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={toggleTradeForm}>Cancel</Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">Add Trade</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedData;
