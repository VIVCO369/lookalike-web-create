import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Removed Select import as it's no longer used
// Removed Button import as buttons are removed
// Removed DollarSign import as it's no longer used

const PositionSizeCalculator = () => {
  const [accountBalance, setAccountBalance] = useState("1000");
  const [riskPercentage, setRiskPercentage] = useState("2");
  const [stopLossPoints, setStopLossPoints] = useState("10");
  // Removed strategyType state

  // Calculate Position Size
  const positionSize = useMemo(() => {
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercentage);
    const stopLoss = parseFloat(stopLossPoints);

    if (isNaN(balance) || isNaN(risk) || isNaN(stopLoss) || stopLoss <= 0) {
      return "0.00";
    }

    // Formula: (Balance * Risk%) / Stop Loss
    const calculatedSize = (balance * (risk / 100)) / stopLoss;
    return calculatedSize.toFixed(2); // Format to 2 decimal places
  }, [accountBalance, riskPercentage, stopLossPoints]); // Added dependencies

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200">Position Size Calculator</CardTitle> {/* Added dark mode text color */}
      </CardHeader>
      <CardContent className="pt-0">
        {/* Updated grid layout to only include the remaining fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Account Balance ($)</label> {/* Added dark mode text color */}
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Risk Percentage (%)</label> {/* Added dark mode text color */}
            <Input
              type="number"
              placeholder="e.g., 2"
              step="0.1"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Stop Loss (Points)</label> {/* Added dark mode text color */}
            <Input
              type="number"
              placeholder="e.g., 10"
              step="0.1"
              value={stopLossPoints}
              onChange={(e) => setStopLossPoints(e.target.value)}
              className="text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" // Added dark mode styles
            />
          </div>
          {/* Removed Strategy Type, Trading Pair, and Trade Type divs */}
        </div>

        {/* Display Calculated Position Size - Styled as a simple text block */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-center font-semibold"> {/* Added dark mode border and text color */}
          <p className="text-lg">Position Size: ${positionSize} per point</p>
        </div>

        {/* Removed the buttons div */}
      </CardContent>
    </Card>
  );
};

export default PositionSizeCalculator;
