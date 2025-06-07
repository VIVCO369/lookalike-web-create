import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react"; // Using BarChart3 for the icon
import { useTradeData, calculateStats } from "@/contexts/TradeDataContext"; // Import useTradeData and calculateStats
import { useMemo } from "react"; // Import useMemo
import { cn } from "@/lib/utils"; // Import cn utility
import StatsCard from "./StatsCard"; // Import StatsCard

interface DailyPerformanceTrackerProps {
  accountType: 'real' | 'demo' | 'trade-tools'; // Add accountType prop
  onResetDay?: () => void; // Add prop for reset function
  customLabels?: {
    bestTrade?: string;
    worstTrade?: string;
  };
}

const DailyPerformanceTracker = ({ accountType, onResetDay, customLabels }: DailyPerformanceTrackerProps) => {
  const { dashboardRealTrades, demoTrades, tradeToolsTrades } = useTradeData(); // Get all trade lists

  // Select the correct trade list based on accountType
  const trades = useMemo(() => {
    if (accountType === 'real') return dashboardRealTrades;
    if (accountType === 'demo') return demoTrades;
    if (accountType === 'trade-tools') return tradeToolsTrades; // Use tradeToolsTrades
    return [];
  }, [accountType, dashboardRealTrades, demoTrades, tradeToolsTrades]); // Add tradeToolsTrades to dependencies

  // Calculate stats for the selected trade list
  const stats = useMemo(() => calculateStats(trades), [trades]);

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
        <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"> {/* Changed title style and added dark mode text color */}
           <BarChart3 className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {/* Changed icon style and added dark mode text color */}
           Daily Performance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Updated grid to 5 columns to accommodate the new card */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"> {/* Grid for stats cards */}
          {/* Today's P&L Card */}
          <StatsCard
            title="Today's P&L"
            value={stats.dailyProfit >= 0 ? `+${formatCurrency(stats.dailyProfit)}` : formatCurrency(stats.dailyProfit)}
            color={stats.dailyProfit >= 0 ? "text-green-500" : "text-red-500"}
          />

          {/* Trades Today Card */}
          <StatsCard
            title="Trades Today"
            value={stats.totalTrades.toString()}
          />

          {/* Win Rate Card */}
          <StatsCard
            title="Win Rate"
            value={stats.winRate}
          />

          {/* Best Trade / Profit Win Card */}
          <StatsCard
            title={customLabels?.bestTrade || "Best Trade"}
            value={customLabels?.bestTrade ?
              (stats.totalWinProfit > 0 ? `+${formatCurrency(stats.totalWinProfit)}` : formatCurrency(stats.totalWinProfit)) :
              (stats.bestTrade > 0 ? `+${formatCurrency(stats.bestTrade)}` : formatCurrency(stats.bestTrade))
            }
            color="text-green-500"
          />

          {/* Worst Trade / Profit Loss Card */}
          <StatsCard
            title={customLabels?.worstTrade || "Worst Trade"}
            value={customLabels?.worstTrade ?
              formatCurrency(stats.totalLossProfit) :
              formatCurrency(stats.worstTrade)
            }
            color="text-red-500"
          />
        </div>

        {/* Buttons - Removed "Log New Trade" as it's handled by DetailedData, kept "Reset Day" */}
        <div className="flex gap-4 justify-end"> {/* Align buttons to the right */}
           {onResetDay && ( // Only show reset button if onResetDay is provided
             <Button variant="outline" className="font-semibold bg-red-500 hover:bg-red-600 text-white" onClick={onResetDay}>
               Reset Day
             </Button>
           )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyPerformanceTracker;
