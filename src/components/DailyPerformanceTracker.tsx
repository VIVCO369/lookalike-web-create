import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react"; // Using BarChart3 for the icon

const DailyPerformanceTracker = () => {
  // Placeholder data for the stats
  const stats = {
    todaysPnL: 41.00,
    tradesToday: 2,
    winRate: "50.0%",
    avgWin: 50.00,
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

  return (
    <Card className="mb-6"> {/* Removed dark background/border classes */}
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium text-gray-700 flex items-center gap-2"> {/* Changed title style */}
           <BarChart3 className="h-5 w-5 text-gray-500" /> {/* Changed icon style */}
           Daily Performance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"> {/* Grid for stats cards */}
          {/* Today's P&L Card */}
          <Card className="text-center"> {/* Removed dark background/border classes */}
            <CardContent className="p-4">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.todaysPnL)}</p> {/* Changed text color */}
              <p className="text-sm text-gray-500">Today's P&L</p> {/* Changed label color */}
            </CardContent>
          </Card>

          {/* Trades Today Card */}
          <Card className="text-center"> {/* Removed dark background/border classes */}
            <CardContent className="p-4">
              <p className="text-lg font-bold text-gray-900">{stats.tradesToday}</p> {/* Changed text color */}
              <p className="text-sm text-gray-500">Trades Today</p> {/* Changed label color */}
            </CardContent>
          </Card>

          {/* Win Rate Card */}
          <Card className="text-center"> {/* Removed dark background/border classes */}
            <CardContent className="p-4">
              <p className="text-lg font-bold text-gray-900">{stats.winRate}</p> {/* Changed text color */}
              <p className="text-sm text-gray-500">Win Rate</p> {/* Changed label color */}
            </CardContent>
          </Card>

          {/* Avg Win Card */}
          <Card className="text-center"> {/* Removed dark background/border classes */}
            <CardContent className="p-4">
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.avgWin)}</p> {/* Changed text color */}
              <p className="text-sm text-gray-500">Avg Win</p> {/* Changed label color */}
            </CardContent>
          </Card>
        </div>

        {/* Buttons */}
        <div className="flex gap-4"> {/* Flex container for buttons */}
          <Button className="font-semibold"> {/* Removed specific background color */}
            Log New Trade
          </Button>
          <Button variant="outline" className="font-semibold"> {/* Changed to outline variant */}
            Reset Day
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPerformanceTracker;
